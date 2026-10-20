import { handleAsNodeRequest } from 'cloudflare:node'
import { Zip, ZipPassThrough } from 'fflate'
import { buildServer } from './app.js'
import { runWithContext } from './context.js'
import { createContainer } from './repositories/index.js'
import { isoDaysAgo, nowIso } from './utils/dates.js'
import { slugify } from './utils/slug.js'
import { refreshInstagramStats } from './usecases/instagram/refresh-instagram-stats.js'
import { serveHtmlWithSeo } from './seo/render.js'
import { SEO_ROUTES, SITE_URL } from './seo/pages.js'

const PORT = 8787
const MEDIA_KEY_PATTERN = /^(photos|albums|avatars)\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/

const server = buildServer()
await server.ready()
server.server.listen(PORT)

async function serveMedia(request, env) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { allow: 'GET, HEAD' }
    })
  }

  let key

  try {
    key = decodeURIComponent(new URL(request.url).pathname.slice('/media/'.length))
  } catch {
    return new Response('Not Found', { status: 404 })
  }

  if (!MEDIA_KEY_PATTERN.test(key)) {
    return new Response('Not Found', { status: 404 })
  }

  const rangeHeader = request.headers.get('range')
  const head = await env.MEDIA.head(key)

  if (!head) {
    return new Response('Not Found', { status: 404 })
  }

  const headers = new Headers()
  head.writeHttpMetadata(headers)
  headers.set('etag', head.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  headers.set('x-content-type-options', 'nosniff')
  headers.set('accept-ranges', 'bytes')

  if (new URL(request.url).searchParams.get('download') === '1') {
    const fileName = key.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '_')
    headers.set('content-disposition', `attachment; filename="${fileName}"`)
  }

  if (request.headers.get('if-none-match') === head.httpEtag) {
    return new Response(null, { status: 304, headers })
  }

  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim())
    const size = head.size

    if (match && (match[1] || match[2]) && size > 0) {
      let start
      let end

      if (!match[1]) {
        const suffix = Number(match[2])
        start = Math.max(0, size - suffix)
        end = size - 1
      } else {
        start = Number(match[1])
        end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1
      }

      if (Number.isFinite(start) && Number.isFinite(end) && start <= end && start < size) {
        const length = end - start + 1
        const partial = await env.MEDIA.get(key, { range: { offset: start, length } })

        if (!partial) {
          return new Response('Not Found', { status: 404 })
        }

        const partialHeaders = new Headers(headers)
        partialHeaders.set('content-range', `bytes ${start}-${end}/${size}`)
        partialHeaders.set('content-length', String(length))

        return new Response(partial.body, { status: 206, headers: partialHeaders })
      }

      return new Response(null, {
        status: 416,
        headers: { 'content-range': `bytes */${size}` }
      })
    }
  }

  if (request.method === 'HEAD') {
    return new Response(null, { status: 200, headers })
  }

  const object = await env.MEDIA.get(key)

  if (!object) {
    return new Response('Not Found', { status: 404 })
  }

  return new Response(object.body, { status: 200, headers })
}


async function serveSharedDownload(env, token) {
  const screen = await env.DB.prepare(
    'SELECT id, name, expires_at, kind FROM screens WHERE share_token = ?'
  )
    .bind(token)
    .first()

  if (!screen) {
    return new Response('Not Found', { status: 404 })
  }

  if (screen.expires_at && new Date(screen.expires_at).getTime() <= Date.now()) {
    return new Response('Link expirado', { status: 410 })
  }

  const result = await env.DB.prepare(
    `SELECT storage_key, alt FROM photos
     WHERE screen_id = ? AND is_visible = 1
     ORDER BY sort_order ASC, created_at ASC`
  )
    .bind(screen.id)
    .all()

  const rows = result.results || []

  if (rows.length === 0) {
    return new Response('Not Found', { status: 404 })
  }

  const used = new Set()
  const entries = rows.map((row, index) => {
    const match = /\.([a-z0-9]+)$/i.exec(row.storage_key)
    const extension = match ? match[1].toLowerCase() : 'bin'
    const base = slugify(row.alt || 'arquivo') || 'arquivo'
    let name = `${String(index + 1).padStart(2, '0')}-${base}.${extension}`
    let suffix = 2

    while (used.has(name)) {
      name = `${String(index + 1).padStart(2, '0')}-${base}-${suffix}.${extension}`
      suffix += 1
    }

    used.add(name)
    return { name, key: row.storage_key }
  })

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const zip = new Zip((error, chunk, final) => {
          if (error) {
            controller.error(error)
            return
          }

          controller.enqueue(chunk)

          if (final) controller.close()
        })

        for (const entry of entries) {
          const file = new ZipPassThrough(entry.name)
          zip.add(file)

          const object = await env.MEDIA.get(entry.key)

          if (object) {
            const reader = object.body.getReader()

            while (true) {
              const { done, value } = await reader.read()

              if (done) break

              file.push(value, false)
            }
          }

          file.push(new Uint8Array(0), true)
        }

        zip.end()
      } catch (error) {
        controller.error(error)
      }
    }
  })

  const fileName = `${slugify(screen.name || 'fotos') || 'fotos'}.zip`

  return new Response(stream, {
    headers: {
      'content-type': 'application/zip',
      'content-disposition': `attachment; filename="${fileName}"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex'
    }
  })
}

async function serveSitemap(request, env) {
  try {
    const result = await env.DB.prepare(
      "SELECT id FROM screens WHERE is_visible = 1 AND kind IN ('gallery', 'partnerships') ORDER BY sort_order ASC"
    ).all()

    const urls = [
      ...SEO_ROUTES.map((route) => `${SITE_URL}${route.path === '/' ? '/' : route.path}`),
      ...(result.results || []).map((row) => `${SITE_URL}/galeria/${row.id}`)
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`

    return new Response(xml, {
      headers: {
        'content-type': 'application/xml; charset=utf-8',
        'cache-control': 'public, max-age=0, s-maxage=300'
      }
    })
  } catch (error) {
    console.warn('Falha ao gerar o sitemap dinâmico:', error?.message || error)
    return env.ASSETS.fetch(request)
  }
}

async function runMaintenance(container) {
  const now = nowIso()

  await Promise.all([
    container.sessions.deleteExpired(now),
    container.loginAttempts.deleteOlderThan(isoDaysAgo(7)),
    container.instagram.deleteSnapshotsBefore(isoDaysAgo(730))
  ])
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/media/')) {
      return serveMedia(request, env)
    }

    if (url.pathname === '/sitemap.xml') {
      return serveSitemap(request, env)
    }

    const downloadMatch = url.pathname.match(/^\/api\/public\/screens\/([^/]+)\/download$/)

    if (downloadMatch) {
      if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 })
      }

      return serveSharedDownload(env, decodeURIComponent(downloadMatch[1]))
    }

    if (!url.pathname.startsWith('/api/')) {
      return serveHtmlWithSeo(request, env)
    }

    const container = createContainer(env)

    return runWithContext({ env, ctx, container }, () =>
      handleAsNodeRequest(PORT, request)
    )
  },

  async scheduled(controller, env, ctx) {
    const container = createContainer(env)

    await runWithContext({ env, ctx, container }, async () => {
      try {
        await runMaintenance(container)
      } catch (error) {
        console.error('Falha na manutenção agendada:', error?.message || error)
      }

      try {
        const result = await refreshInstagramStats(container, { source: 'cron' })
        console.log('Cron do Instagram concluído:', JSON.stringify(result))
      } catch (error) {
        console.error('Falha no cron do Instagram:', error?.message || error)
      }
    })
  }
}
