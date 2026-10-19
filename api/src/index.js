import { handleAsNodeRequest } from 'cloudflare:node'
import { buildServer } from './app.js'
import { runWithContext } from './context.js'
import { createContainer } from './repositories/index.js'
import { isoDaysAgo, nowIso } from './utils/dates.js'
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

  const object = await env.MEDIA.get(key)

  if (!object) {
    return new Response('Not Found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  headers.set('x-content-type-options', 'nosniff')

  if (request.headers.get('if-none-match') === object.httpEtag) {
    return new Response(null, { status: 304, headers })
  }

  return new Response(request.method === 'HEAD' ? null : object.body, {
    status: 200,
    headers
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
