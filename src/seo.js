export const SITE_URL = 'https://www.mundodemiriam.com.br'
export const SOCIAL_IMAGE = `${SITE_URL}/assets/profile/fotodalinda.jpg`

export const SEO_ROUTES = [
  {
    path: '/',
    title: 'Miriam Cléres | Maquiadora e Fotógrafa em Sorocaba',
    description: 'Portfólio de Miriam Cléres, maquiadora artística e fotógrafa em Sorocaba. Conheça trabalhos de beleza, arte, e-commerce e parcerias.'
  },
  {
    path: '/about',
    title: 'Sobre Miriam Cléres | Maquiadora e Fotógrafa',
    description: 'Conheça a trajetória de Miriam Cléres, profissional de maquiagem artística, beleza, criação de conteúdo e fotografia em Sorocaba.'
  },
  {
    path: '/curriculum',
    title: 'Currículo | Miriam Cléres Forastieri',
    description: 'Formação, experiência e competências profissionais de Miriam Cléres em maquiagem artística, fotografia, beleza e criação de conteúdo.'
  },
  {
    path: '/beauty-portfolio',
    title: 'Portfólio de Maquiagem Beauty | Miriam Cléres',
    description: 'Trabalhos de maquiagem beauty e produção de beleza realizados por Miriam Cléres. Portfólio profissional em Sorocaba e região.'
  },
  {
    path: '/artistic-portfolio',
    title: 'Portfólio de Maquiagem Artística | Miriam Cléres',
    description: 'Explore o portfólio de maquiagem artística, caracterização e criações visuais de Miriam Cléres.'
  },
  {
    path: '/ecommerce',
    title: 'Fotografia para E-commerce | Miriam Cléres',
    description: 'Fotografia profissional de produtos e conteúdo visual para e-commerce, marcas e redes sociais por Miriam Cléres.'
  },
  {
    path: '/partnerships',
    title: 'Parcerias com Marcas | Miriam Cléres',
    description: 'Campanhas, conteúdo e trabalhos desenvolvidos por Miriam Cléres em parceria com marcas de beleza e lifestyle.'
  }
]

export function getSeoForPath(path) {
  return SEO_ROUTES.find((route) => route.path === path) || SEO_ROUTES[0]
}

export function applySeo(path) {
  const seo = getSeoForPath(path)
  const canonicalUrl = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`

  document.title = seo.title
  document.documentElement.lang = 'pt-BR'
  setMeta('name', 'description', seo.description)
  setMeta('property', 'og:title', seo.title)
  setMeta('property', 'og:description', seo.description)
  setMeta('property', 'og:url', canonicalUrl)
  setMeta('name', 'twitter:title', seo.title)
  setMeta('name', 'twitter:description', seo.description)

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = canonicalUrl
}

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}
