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
  },
  {
    path: '/beauty-portfolio',
    label: 'Maquiagem beauty',
    title: 'Portfólio de Maquiagem Beauty | Miriam Cléres Forastieri',
    heading: 'Portfólio de maquiagem beauty',
    description:
      'Conheça os trabalhos de maquiagem beauty e produção de beleza realizados por Miriam Cléres Forastieri em Sorocaba e região.'
  },
  {
    path: '/artistic-portfolio',
    label: 'Maquiagem artística',
    title: 'Portfólio de Maquiagem Artística | Miriam Forastieri',
    heading: 'Portfólio de maquiagem artística',
    description:
      'Explore trabalhos de maquiagem artística, caracterização e criações visuais de Miriam Cléres Forastieri, maquiadora e fotógrafa em Sorocaba.'
  },
  {
    path: '/ecommerce',
    label: 'Fotografia e-commerce',
    title: 'Fotografia para E-commerce | Miriam Cléres Forastieri',
    heading: 'Fotografia para e-commerce',
    description:
      'Fotografia profissional de produtos e conteúdo para e-commerce, marcas e redes sociais por Miriam Cléres Forastieri em Sorocaba.'
  },
  {
    path: '/partnerships',
    label: 'Parcerias',
    title: 'Parcerias com Marcas | Miriam Cléres Forastieri',
    heading: 'Parcerias com marcas',
    description:
      'Campanhas e conteúdos desenvolvidos por Miriam Cléres Forastieri em parceria com marcas de beleza, maquiagem e lifestyle.'
  }
]

export const SEO_PATHS = SEO_ROUTES.map((route) => route.path)

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

export function getSeoForPath(pathname) {
  const normalized = normalizePath(pathname)
  return SEO_ROUTES.find((route) => route.path === normalized) || null
}

export function isPagePath(pathname) {
  if (pathname.startsWith('/admin')) return true
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
