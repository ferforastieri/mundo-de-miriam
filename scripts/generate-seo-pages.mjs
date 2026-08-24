import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEO_ROUTES, SITE_URL, getStructuredData } from '../src/seo.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDirectory = path.join(projectRoot, 'dist')
const sourceHtml = await readFile(path.join(distDirectory, 'index.html'), 'utf8')

for (const seo of SEO_ROUTES) {
  const canonicalUrl = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`
  const html = sourceHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(" \/>)/, `$1${escapeHtml(seo.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, `$1${canonicalUrl}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${escapeHtml(seo.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${escapeHtml(seo.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(" \/>)/, `$1${canonicalUrl}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/, `$1${escapeHtml(seo.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(" \/>)/, `$1${escapeHtml(seo.description)}$2`)
    .replace(/(<meta name="twitter:url" content=")[^"]*(" \/>)/, `$1${canonicalUrl}$2`)
    .replace(
      /(<script id="structured-data" type="application\/ld\+json">)[\s\S]*?(<\/script>)/,
      `$1${JSON.stringify(getStructuredData(seo.path))}$2`
    )
    .replace(/<main id="seo-fallback">[\s\S]*?<\/main>/, buildFallbackContent(seo))

  const routeDirectory = seo.path === '/'
    ? distDirectory
    : path.join(distDirectory, seo.path.slice(1))

  await mkdir(routeDirectory, { recursive: true })
  await writeFile(path.join(routeDirectory, 'index.html'), html)
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SEO_ROUTES.map(({ path: routePath }) => `  <url><loc>${SITE_URL}${routePath === '/' ? '/' : routePath}</loc></url>`).join('\n')}
</urlset>
`

await writeFile(path.join(distDirectory, 'sitemap.xml'), sitemap)

function buildFallbackContent(seo) {
  const links = SEO_ROUTES
    .filter(({ path: routePath }) => routePath !== seo.path)
    .map(({ path: routePath, label }) => `          <a href="${routePath}">${escapeHtml(label)}</a>`)
    .join('\n')

  return `<main id="seo-fallback">
        <h1>${escapeHtml(seo.heading)}</h1>
        <p>${escapeHtml(seo.description)}</p>
        <nav aria-label="Conteúdo principal">
${links}
        </nav>
      </main>`
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
