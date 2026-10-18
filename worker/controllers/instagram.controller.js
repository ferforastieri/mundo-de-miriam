import { getContainer } from '../context.js'
import { requireAdmin } from '../http/guards.js'
import { clearInstagramToken } from '../usecases/instagram/clear-instagram-token.js'
import { getInstagramPanel } from '../usecases/instagram/get-instagram-panel.js'
import { refreshInstagramStats } from '../usecases/instagram/refresh-instagram-stats.js'
import { setInstagramToken } from '../usecases/instagram/set-instagram-token.js'

const tokenSchema = {
  body: {
    type: 'object',
    required: ['token'],
    additionalProperties: false,
    properties: {
      token: { type: 'string', minLength: 20, maxLength: 2000 }
    }
  }
}

export function registerInstagramRoutes(app) {
  app.get('/api/admin/instagram', { preHandler: requireAdmin }, async () => {
    return getInstagramPanel(getContainer())
  })

  app.post('/api/admin/instagram/refresh', { preHandler: requireAdmin }, async () => {
    return refreshInstagramStats(getContainer(), { source: 'manual' })
  })

  app.put(
    '/api/admin/instagram/token',
    { preHandler: requireAdmin, schema: tokenSchema },
    async (request) => {
      return setInstagramToken(getContainer(), { token: request.body.token })
    }
  )

  app.delete('/api/admin/instagram/token', { preHandler: requireAdmin }, async () => {
    return clearInstagramToken(getContainer())
  })
}
