import { getContainer } from '../context.js'
import { getPublicGallery } from '../usecases/gallery/get-public-gallery.js'
import { getPublicInstagramStats } from '../usecases/instagram/get-public-stats.js'

export function registerPublicRoutes(app) {
  app.get('/api/health', async () => ({
    ok: true,
    time: new Date().toISOString()
  }))

  app.get('/api/public/gallery', async (request, reply) => {
    reply.header('cache-control', 'public, max-age=0, must-revalidate')
    return getPublicGallery(getContainer())
  })

  app.get('/api/instagram/stats', async (request, reply) => {
    reply.header(
      'cache-control',
      'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
    )
    return getPublicInstagramStats(getContainer())
  })
}
