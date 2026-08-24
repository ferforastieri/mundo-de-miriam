export const SITE_URL = 'https://www.mundodemiriam.com.br'
export const SITE_NAME = 'Mundo de Miriam'
export const SOCIAL_IMAGE = `${SITE_URL}/assets/social/miriam-forastieri-og.png`
export const SOCIAL_IMAGE_WIDTH = '1732'
export const SOCIAL_IMAGE_HEIGHT = '908'
export const SOCIAL_IMAGE_ALT = 'Retrato de Miriam Cléres Forastieri, maquiadora e fotógrafa em Sorocaba'

export const SEO_ROUTES = [
  {
    path: '/',
    label: 'Início',
    title: 'Miriam Cléres Forastieri | Maquiadora e Fotógrafa',
    heading: 'Miriam Cléres Forastieri',
    description: 'Portfólio profissional de Miriam Cléres Forastieri, maquiadora artística e fotógrafa em Sorocaba. Conheça trabalhos de beleza, arte, e-commerce e parcerias.'
  },
  {
    path: '/about',
    label: 'Sobre Miriam',
    title: 'Sobre Miriam Cléres Forastieri | Trajetória Profissional',
    heading: 'Sobre Miriam Cléres Forastieri',
    description: 'Conheça a trajetória de Miriam Cléres Forastieri em maquiagem artística, beleza, fotografia, criação de conteúdo e empreendedorismo em Sorocaba.'
  },
  {
    path: '/curriculum',
    label: 'Currículo',
    title: 'Currículo de Miriam Cléres Forastieri',
    heading: 'Currículo de Miriam Cléres Forastieri',
    description: 'Formação, experiência e competências profissionais de Miriam Cléres Forastieri em maquiagem artística, fotografia, beleza e criação de conteúdo.'
  },
  {
    path: '/beauty-portfolio',
    label: 'Maquiagem beauty',
    title: 'Portfólio de Maquiagem Beauty | Miriam Cléres Forastieri',
    heading: 'Portfólio de maquiagem beauty',
    description: 'Conheça os trabalhos de maquiagem beauty e produção de beleza realizados por Miriam Cléres Forastieri em Sorocaba e região.'
  },
  {
    path: '/artistic-portfolio',
    label: 'Maquiagem artística',
    title: 'Portfólio de Maquiagem Artística | Miriam Forastieri',
    heading: 'Portfólio de maquiagem artística',
    description: 'Explore trabalhos de maquiagem artística, caracterização e criações visuais de Miriam Cléres Forastieri, maquiadora e fotógrafa em Sorocaba.'
  },
  {
    path: '/ecommerce',
    label: 'Fotografia e-commerce',
    title: 'Fotografia para E-commerce | Miriam Cléres Forastieri',
    heading: 'Fotografia para e-commerce',
    description: 'Fotografia profissional de produtos e conteúdo para e-commerce, marcas e redes sociais por Miriam Cléres Forastieri em Sorocaba.'
  },
  {
    path: '/partnerships',
    label: 'Parcerias',
    title: 'Parcerias com Marcas | Miriam Cléres Forastieri',
    heading: 'Parcerias com marcas',
    description: 'Campanhas e conteúdos desenvolvidos por Miriam Cléres Forastieri em parceria com marcas de beleza, maquiagem e lifestyle.'
  }
]

export function getSeoForPath(path) {
  return SEO_ROUTES.find((route) => route.path === path) || SEO_ROUTES[0]
}

export function getCanonicalUrl(path) {
  const seo = getSeoForPath(path)
  return `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`
}

export function getStructuredData(path) {
  const seo = getSeoForPath(path)
  const canonicalUrl = getCanonicalUrl(path)
  const personId = `${SITE_URL}/#miriam-cleres-forastieri`
  const websiteId = `${SITE_URL}/#website`
  const serviceId = `${SITE_URL}/#professional-service`
  const imageId = `${SITE_URL}/#social-image`

  const graph = [
    {
      '@type': 'Person',
      '@id': personId,
      name: 'Miriam Cléres Forastieri',
      givenName: 'Miriam',
      additionalName: 'Cléres',
      familyName: 'Forastieri',
      alternateName: ['Miriam Forastieri', 'Miriam Cléres'],
      url: `${SITE_URL}/about`,
      image: { '@id': imageId },
      description: 'Maquiadora artística, fotógrafa, criadora de conteúdo e fundadora da marca Mimelie em Sorocaba.',
      jobTitle: ['Maquiadora artística', 'Fotógrafa', 'Criadora de conteúdo'],
      email: 'mailto:cleresmimakeup@gmail.com',
      telephone: '+55 15 99196-2479',
      homeLocation: {
        '@type': 'City',
        name: 'Sorocaba',
        containedInPlace: { '@type': 'State', name: 'São Paulo' }
      },
      knowsAbout: ['Maquiagem artística', 'Maquiagem beauty', 'Fotografia', 'Fotografia de produtos', 'Criação de conteúdo'],
      sameAs: ['https://www.instagram.com/mihforastieri/', 'https://mimelie.com/']
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: ['Miriam Cléres Forastieri', 'Mundo de Miriam por Miriam Forastieri'],
      inLanguage: 'pt-BR',
      publisher: { '@id': personId },
      about: { '@id': personId }
    },
    {
      '@type': 'ImageObject',
      '@id': imageId,
      url: SOCIAL_IMAGE,
      contentUrl: SOCIAL_IMAGE,
      width: Number(SOCIAL_IMAGE_WIDTH),
      height: Number(SOCIAL_IMAGE_HEIGHT),
      caption: SOCIAL_IMAGE_ALT,
      representativeOfPage: true
    },
    {
      '@type': 'ProfessionalService',
      '@id': serviceId,
      name: 'Miriam Cléres Forastieri — Maquiagem e Fotografia',
      url: `${SITE_URL}/`,
      image: { '@id': imageId },
      description: SEO_ROUTES[0].description,
      founder: { '@id': personId },
      telephone: '+55 15 99196-2479',
      email: 'cleresmimakeup@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sorocaba',
        addressRegion: 'SP',
        addressCountry: 'BR'
      },
      areaServed: { '@type': 'City', name: 'Sorocaba' },
      sameAs: ['https://www.instagram.com/mihforastieri/'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Serviços de maquiagem e fotografia',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Maquiagem artística e beauty' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fotografia para e-commerce' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Criação de conteúdo para marcas' } }
        ]
      }
    },
    {
      '@type': seo.path === '/about' ? 'ProfilePage' : 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: seo.title,
      headline: seo.heading,
      description: seo.description,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': websiteId },
      about: { '@id': personId },
      primaryImageOfPage: { '@id': imageId },
      ...(seo.path === '/about' ? { mainEntity: { '@id': personId } } : {})
    }
  ]

  if (seo.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: seo.label, item: canonicalUrl }
      ]
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function applySeo(path) {
  const seo = getSeoForPath(path)
  const canonicalUrl = getCanonicalUrl(path)

  document.title = seo.title
  document.documentElement.lang = 'pt-BR'
  setMeta('name', 'description', seo.description)
  setMeta('name', 'author', 'Miriam Cléres Forastieri')
  setMeta('property', 'og:title', seo.title)
  setMeta('property', 'og:description', seo.description)
  setMeta('property', 'og:url', canonicalUrl)
  setMeta('property', 'og:image', SOCIAL_IMAGE)
  setMeta('property', 'og:image:secure_url', SOCIAL_IMAGE)
  setMeta('property', 'og:image:type', 'image/png')
  setMeta('property', 'og:image:width', SOCIAL_IMAGE_WIDTH)
  setMeta('property', 'og:image:height', SOCIAL_IMAGE_HEIGHT)
  setMeta('property', 'og:image:alt', SOCIAL_IMAGE_ALT)
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', seo.title)
  setMeta('name', 'twitter:description', seo.description)
  setMeta('name', 'twitter:url', canonicalUrl)
  setMeta('name', 'twitter:image', SOCIAL_IMAGE)
  setMeta('name', 'twitter:image:alt', SOCIAL_IMAGE_ALT)

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = canonicalUrl

  const structuredData = document.getElementById('structured-data')
  if (structuredData) structuredData.textContent = JSON.stringify(getStructuredData(path))
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
