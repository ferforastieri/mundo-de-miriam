import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import {
  JSON_BODY_LIMIT,
  MAX_IMAGE_BYTES
} from './config.js'
import { toHttpError } from './http/errors.js'
import { registerAuthRoutes } from './controllers/auth.controller.js'
import { registerDashboardRoutes } from './controllers/dashboard.controller.js'
import { registerInstagramRoutes } from './controllers/instagram.controller.js'
import { registerPhotosRoutes } from './controllers/photos.controller.js'
import { registerPublicRoutes } from './controllers/public.controller.js'
import { registerScreensRoutes } from './controllers/screens.controller.js'

export function buildServer() {
  const app = Fastify({
    logger: false,
    pluginTimeout: 0,
    trustProxy: true,
    bodyLimit: JSON_BODY_LIMIT
  })

  app.register(cookie)

  app.addContentTypeParser(
    /^image\/.*/,
    { parseAs: 'buffer', bodyLimit: MAX_IMAGE_BYTES },
    (request, body, done) => done(null, body)
  )

  app.addContentTypeParser(
    'application/octet-stream',
    { parseAs: 'buffer', bodyLimit: MAX_IMAGE_BYTES },
    (request, body, done) => done(null, body)
  )

  app.addHook('onSend', async (request, reply, payload) => {
    reply.header('x-content-type-options', 'nosniff')
    reply.header('referrer-policy', 'strict-origin-when-cross-origin')

    if (request.url.startsWith('/api/admin')) {
      reply.header('cache-control', 'no-store')
    }

    return payload
  })

  registerPublicRoutes(app)
  registerAuthRoutes(app)
  registerDashboardRoutes(app)
  registerScreensRoutes(app)
  registerPhotosRoutes(app)
  registerInstagramRoutes(app)

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      error: {
        code: 'not_found',
        message: 'Rota não encontrada.'
      }
    })
  })

  app.setErrorHandler((error, request, reply) => {
    const { statusCode, payload, retryAfterSeconds } = toHttpError(error)

    if (retryAfterSeconds) {
      reply.header('retry-after', String(retryAfterSeconds))
    }

    reply.code(statusCode).send(payload)
  })

  return app
}
