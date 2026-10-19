import {
  ADMIN_ROBOTS,
  INDEXABLE_ROBOTS,
  LEGACY_SCREEN_PATHS,
  SITE_NAME,
  SOCIAL_IMAGE,
  SOCIAL_IMAGE_ALT,
  TWITTER_IMAGE,
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

  // URLs antigas das telas: redireciona para a rota dinâmica.
  const legacyScreenId = LEGACY_SCREEN_PATHS[url.pathname.replace(/\/+$/, '') || '/']

  if (legacyScreenId) {
    return Response.redirect(`${url.origin}/galeria/${legacyScreenId}${url.search}`, 301)
  }

  // Links antigos de álbuns (/album/<token>) → link privado da tela (/a/<token>).
  const legacyAlbum = url.pathname.match(/^\/album\/([A-Za-z0-9_-]{8,64})\/?$/)

  if (legacyAlbum) {
    return Response.redirect(`${url.origin}/a/${legacyAlbum[1]}${url.search}`, 301)
  }

  const assetResponse = await env.ASSETS.fetch(request)
  const contentType = assetResponse.headers.get('content-type') || ''

  if (!assetResponse.ok || !contentType.includes('text/html')) {
    return assetResponse
  }

  const isAdmin = url.pathname.startsWith('/admin')
  const isAlbum = url.pathname.startsWith('/album')
  const isShared = url.pathname.startsWith('/a/')
  const isGallery = url.pathname.startsWith('/galeria')
  const isUnlisted = isAdmin || isAlbum || isShared
  const seo = getSeoForPath(url.pathname)
  const dynamicScreen = isGallery ? await getDynamicScreen(env, url.pathname) : null
  const galleryMissing = isGallery && dynamicScreen === false
  const title = isAlbum || isShared
    ? 'Fotos compartilhadas · Mundo de Miriam'
    : isAdmin
      ? ADMIN_TITLE
      : galleryMissing
        ? 'Galeria não encontrada · Mundo de Miriam'
        : dynamicScreen
          ? `${dynamicScreen.name} · Mundo de Miriam`
          : seo?.title || SITE_NAME
  const description = isAlbum || isShared
    ? 'Página privada de fotos compartilhada por Miriam Cléres Forastieri.'
    : isAdmin
      ? ADMIN_DESCRIPTION
      : dynamicScreen
        ? dynamicScreen.description || ''
        : galleryMissing
          ? 'Galeria não encontrada.'
          : seo?.description || ''
  const robots = isUnlisted || galleryMissing ? ADMIN_ROBOTS : INDEXABLE_ROBOTS
  const canonical = canonicalFor(url.pathname)

  // Páginas não listadas (painel, links privados) não devem gerar um cartão
  // próprio ao serem compartilhadas: usamos a identidade pública do site.
  const homeSeo = getSeoForPath('/')
  const socialTitle = isUnlisted ? homeSeo?.title || SITE_NAME : title
  const socialDescription = isUnlisted ? homeSeo?.description || '' : description
  const fallback = dynamicScreen
    ? `<h1>${escapeHtml(dynamicScreen.name)}</h1><p>${escapeHtml(dynamicScreen.description || '')}</p><nav aria-label="Conteúdo principal"><a href="/">Mundo de Miriam</a></nav>`
    : !isUnlisted && !galleryMissing && seo
      ? buildFallbackContent(seo)
      : null

  let ogImageApplied = false

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
    .on('meta[property="og:title"]', setMetaContent(socialTitle))
    .on(
      'meta[property="og:description"]',
      setMetaContent(socialDescription)
    )
    .on('meta[property="og:url"]', setMetaContent(canonical))
    .on('meta[property="og:image"]', {
      element(element) {
        if (ogImageApplied) return
        ogImageApplied = true
        element.setAttribute('content', SOCIAL_IMAGE)
      }
    })
    .on(
      'meta[property="og:image:secure_url"]',
      setMetaContent(SOCIAL_IMAGE)
    )
    .on(
      'meta[property="og:image:alt"]',
      setMetaContent(SOCIAL_IMAGE_ALT)
    )
    .on('meta[name="twitter:title"]', setMetaContent(socialTitle))
    .on(
      'meta[name="twitter:description"]',
      setMetaContent(socialDescription)
    )
    .on('meta[name="twitter:url"]', setMetaContent(canonical))
    .on('meta[name="twitter:image"]', setMetaContent(TWITTER_IMAGE))
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

  // Páginas não listadas (painel, links privados) e o preview (*.workers.dev)
  // não devem ser indexados.
  if (isUnlisted || url.hostname.endsWith('.workers.dev')) {
    headers.set('x-robots-tag', 'noindex')
  }

  return new Response(response.body, {
    status: galleryMissing ? 404 : response.status,
    headers
  })
}
