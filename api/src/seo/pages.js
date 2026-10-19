export const SITE_URL = 'https://www.mundodemiriam.com.br'
export const SITE_NAME = 'Mundo de Miriam'
export const SOCIAL_IMAGE = `${SITE_URL}/assets/social/miriam-forastieri-og.png`
export const SOCIAL_IMAGE_ALT =
  'Retrato de Miriam Cléres Forastieri, maquiadora e fotógrafa em Sorocaba'
export const INDEXABLE_ROBOTS =
  'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
export const ADMIN_ROBOTS = 'noindex,nofollow'

/**
 * Mesmos dados de `web/src/seo.js` (o frontend usa para navegação interna e a
 * borda usa para injetar as tags antes de entregar o HTML).
 */
export const SEO_ROUTES = [
  {
    path: '/',
    label: 'Início',
    title: 'Miriam Cléres Forastieri | Maquiadora e Fotógrafa',
    heading: 'Miriam Cléres Forastieri',
    description:
      'Portfólio profissional de Miriam Cléres Forastieri, maquiadora artística e fotógrafa em Sorocaba. Conheça trabalhos de beleza, arte, e-commerce e parcerias.'
  },
  {
    path: '/about',
    label: 'Sobre Miriam',
    title: 'Sobre Miriam Cléres Forastieri | Trajetória Profissional',
    heading: 'Sobre Miriam Cléres Forastieri',
    description:
      'Conheça a trajetória de Miriam Cléres Forastieri em maquiagem artística, beleza, fotografia, criação de conteúdo e empreendedorismo em Sorocaba.'
  },
  {
    path: '/curriculum',
    label: 'Currículo',
    title: 'Currículo de Miriam Cléres Forastieri',
    heading: 'Currículo de Miriam Cléres Forastieri',
    description:
      'Formação, experiência e competências profissionais de Miriam Cléres Forastieri em maquiagem artística, fotografia, beleza e criação de conteúdo.'
  }
]

export const SEO_PATHS = SEO_ROUTES.map((route) => route.path)

/**
 * URLs antigas das telas (quando as rotas eram fixas no código).
 * Continuam sendo redirecionadas para a rota dinâmica `/galeria/<id>`.
 */
export const LEGACY_SCREEN_PATHS = {
  '/beauty-portfolio': 'beauty',
  '/artistic-portfolio': 'artistic',
  '/ecommerce': 'ecommerce',
  '/partnerships': 'partnerships'
}

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

export function getSeoForPath(pathname) {
  const normalized = normalizePath(pathname)
  return SEO_ROUTES.find((route) => route.path === normalized) || null
}

export function isPagePath(pathname) {
  if (pathname.startsWith('/admin') || pathname.startsWith('/album')) return true
  if (pathname.startsWith('/galeria')) return true
  if (normalizePath(pathname) in LEGACY_SCREEN_PATHS) return true
  return SEO_PATHS.includes(normalizePath(pathname))
}

export function canonicalFor(pathname) {
  const normalized = normalizePath(pathname)
  return `${SITE_URL}${normalized === '/' ? '/' : normalized}`
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function buildFallbackContent(seo) {
  const links = SEO_ROUTES.filter((route) => route.path !== seo.path)
    .map((route) => `          <a href="${route.path}">${escapeHtml(route.label)}</a>`)
    .join('\n')

  return `<h1>${escapeHtml(seo.heading)}</h1>
        <p>${escapeHtml(seo.description)}</p>
        <nav aria-label="Conteúdo principal">
${links}
        </nav>`
}
