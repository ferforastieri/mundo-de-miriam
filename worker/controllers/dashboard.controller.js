import { getContainer } from '../context.js'
import { requireAdmin } from '../http/guards.js'
import { getDashboard } from '../usecases/stats/get-dashboard.js'

export function registerDashboardRoutes(app) {
  app.get('/api/admin/dashboard', { preHandler: requireAdmin }, async () => {
    return getDashboard(getContainer())
  })
}
