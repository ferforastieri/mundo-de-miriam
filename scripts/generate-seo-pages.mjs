import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEO_ROUTES, SITE_URL } from '../src/seo.js'

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

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
