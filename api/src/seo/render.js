import {
  ADMIN_ROBOTS,
  INDEXABLE_ROBOTS,
  SITE_NAME,
  SOCIAL_IMAGE,
  SOCIAL_IMAGE_ALT,
  buildFallbackContent,
  canonicalFor,
  getSeoForPath,
  isPagePath
} from './pages.js'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

async function getDynamicScreen(env, pathname) {
  const match = pathname.match(/^\/galeria\/([a-z0-9-]+)\/?$/)

  if (!match) return null

  try {
    const screen = await env.DB.prepare(
      'SELECT id, name, description FROM screens WHERE id = ? AND is_visible = 1'
    )
      .bind(match[1])
      .first()

    return screen || false
  } catch {
    return false
  }
}

const ADMIN_TITLE = 'Painel administrativo · Mundo de Miriam'
const ADMIN_DESCRIPTION = 'Área restrita para gerenciar o site de Miriam Cléres Forastieri.'

function setMetaContent(content) {
  return {
    element(element) {
      element.setAttribute('content', content)
    }
  }
}

/**
 * Injeta as tags de SEO da rota no HTML do SPA antes de entregá-lo ao cliente.
 * Funciona para navegadores e para crawlers que não executam JavaScript
 * (WhatsApp, Facebook, LinkedIn etc.), sem precisar de script de build/SSR.
 */
export async function serveHtmlWithSeo(request, env) {
  const url = new URL(request.url)

  if (!isPagePath(url.pathname)) {
    return env.ASSETS.fetch(request)
  }

  const assetResponse = await env.ASSETS.fetch(request)
  const contentType = assetResponse.headers.get('content-type') || ''

  if (!assetResponse.ok || !contentType.includes('text/html')) {
    return assetResponse
  }

  const isAdmin = url.pathname.startsWith('/admin')
  const isAlbum = url.pathname.startsWith('/album')
  const isGallery = url.pathname.startsWith('/galeria')
  const isUnlisted = isAdmin || isAlbum
  const seo = getSeoForPath(url.pathname)
  const dynamicScreen = isGallery ? await getDynamicScreen(env, url.pathname) : null
  const galleryMissing = isGallery && dynamicScreen === false
  const title = isAlbum
    ? 'Álbum de fotos · Mundo de Miriam'
    : isAdmin
      ? ADMIN_TITLE
      : galleryMissing
        ? 'Galeria não encontrada · Mundo de Miriam'
        : dynamicScreen
          ? `${dynamicScreen.name} · Mundo de Miriam`
          : seo?.title || SITE_NAME
  const description = isAlbum
    ? 'Álbum de fotos compartilhado por Miriam Cléres Forastieri.'
    : isAdmin
      ? ADMIN_DESCRIPTION
      : dynamicScreen
        ? dynamicScreen.description || 'Galeria de fotos por Miriam Cléres Forastieri.'
        : galleryMissing
          ? 'Galeria não encontrada.'
          : seo?.description || ''
  const robots = isUnlisted || galleryMissing ? ADMIN_ROBOTS : INDEXABLE_ROBOTS
  const canonical = canonicalFor(url.pathname)
  const fallback = dynamicScreen
    ? `<h1>${escapeHtml(dynamicScreen.name)}</h1><p>${escapeHtml(dynamicScreen.description || '')}</p><nav aria-label="Conteúdo principal"><a href="/">Mundo de Miriam</a></nav>`
    : !isUnlisted && !galleryMissing && seo
      ? buildFallbackContent(seo)
      : null

  let rewriter = new HTMLRewriter()
    .on('title', {
      element(element) {
        element.setInnerContent(title)
      }
    })
    .on('meta[name="description"]', setMetaContent(description))
    .on('meta[name="robots"]', setMetaContent(robots))
    .on('link[rel="canonical"]', {
      element(element) {
        element.setAttribute('href', canonical)
      }
    })
    .on('meta[property="og:title"]', setMetaContent(title))
    .on(
      'meta[property="og:description"]',
      setMetaContent(description)
    )
    .on('meta[property="og:url"]', setMetaContent(canonical))
    .on('meta[property="og:image"]', setMetaContent(SOCIAL_IMAGE))
    .on(
      'meta[property="og:image:secure_url"]',
      setMetaContent(SOCIAL_IMAGE)
    )
    .on(
      'meta[property="og:image:alt"]',
      setMetaContent(SOCIAL_IMAGE_ALT)
    )
    .on('meta[name="twitter:title"]', setMetaContent(title))
    .on(
      'meta[name="twitter:description"]',
      setMetaContent(description)
    )
    .on('meta[name="twitter:url"]', setMetaContent(canonical))
    .on('meta[name="twitter:image"]', setMetaContent(SOCIAL_IMAGE))
    .on(
      'meta[name="twitter:image:alt"]',
      setMetaContent(SOCIAL_IMAGE_ALT)
    )

  if (fallback) {
    rewriter = rewriter.on('main#seo-fallback', {
      element(element) {
        element.setInnerContent(fallback, { html: true })
      }
    })
  }

  const response = rewriter.transform(assetResponse)
  const headers = new Headers(response.headers)

  headers.set('cache-control', 'public, max-age=0, must-revalidate')
  headers.set('x-content-type-options', 'nosniff')

  // O preview (*.workers.dev) aponta o canonical para o domínio oficial;
  // evitamos que ele seja indexado como conteúdo duplicado.
  if (url.hostname.endsWith('.workers.dev')) {
    headers.set('x-robots-tag', 'noindex')
  }

  return new Response(response.body, {
    status: response.status,
    headers
  })
}
