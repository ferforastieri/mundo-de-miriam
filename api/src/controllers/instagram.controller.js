import { getContainer } from '../context.js'
import { requireAdmin } from '../http/guards.js'
import { clearInstagramToken } from '../usecases/instagram/clear-instagram-token.js'
import { getInstagramPanel } from '../usecases/instagram/get-instagram-panel.js'
import { publishPhotos } from '../usecases/instagram/publish-photos.js'
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

const publishSchema = {
  body: {
    type: 'object',
    required: ['photoIds'],
    additionalProperties: false,
    properties: {
      photoIds: {
        type: 'array',
        minItems: 1,
        maxItems: 10,
        items: { type: 'string', minLength: 1, maxLength: 80 }
      },
      caption: { type: 'string', maxLength: 2200 }
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

  app.post(
    '/api/admin/instagram/publish',
    { preHandler: requireAdmin, schema: publishSchema },
    async (request) => {
      const origin = `${request.protocol}://${request.headers.host}`

      return publishPhotos(getContainer(), {
        photoIds: request.body.photoIds,
        caption: request.body.caption || '',
        origin
      })
    }
  )
}
