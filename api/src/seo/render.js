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
  const seo = getSeoForPath(url.pathname)
  const title = isAdmin ? ADMIN_TITLE : seo?.title || SITE_NAME
  const description = isAdmin ? ADMIN_DESCRIPTION : seo?.description || ''
  const robots = isAdmin ? ADMIN_ROBOTS : INDEXABLE_ROBOTS
  const canonical = canonicalFor(url.pathname)
  const fallback = !isAdmin && seo ? buildFallbackContent(seo) : null

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
