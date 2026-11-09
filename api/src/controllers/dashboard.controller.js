import { getContainer } from '../context.js'
import { requireAdmin } from '../http/guards.js'
import { getDashboard } from '../usecases/stats/get-dashboard.js'
import { getMediaKit } from '../usecases/stats/get-media-kit.js'

export function registerDashboardRoutes(app) {
  app.get('/api/admin/dashboard', { preHandler: requireAdmin }, async () => {
    return getDashboard(getContainer())
  })

  app.get('/api/admin/media-kit', { preHandler: requireAdmin }, async () => {
    return getMediaKit(getContainer())
  })
}
