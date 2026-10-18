import { SESSION_TTL_SECONDS, getRuntimeConfig } from '../config.js'
import { getContainer } from '../context.js'
import {
  assertSameOrigin,
  getClientIp,
  getRawSessionToken,
  requireAdmin
} from '../http/guards.js'
import { login } from '../usecases/auth/login.js'
import { logout } from '../usecases/auth/logout.js'
import { changePassword } from '../usecases/auth/change-password.js'

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
      email: { type: 'string', maxLength: 320 },
      password: { type: 'string', maxLength: 200 }
    }
  }
}

const changePasswordSchema = {
  body: {
    type: 'object',
    required: ['currentPassword', 'newPassword'],
    additionalProperties: false,
    properties: {
      currentPassword: { type: 'string', maxLength: 200 },
      newPassword: { type: 'string', maxLength: 200 }
    }
  }
}

export function registerAuthRoutes(app) {
  app.post('/api/admin/auth/login', { schema: loginSchema }, async (request, reply) => {
    assertSameOrigin(request)

    const container = getContainer()
    const result = await login(container, {
      email: request.body.email,
      password: request.body.password,
      ip: getClientIp(request),
      userAgent: request.headers['user-agent']
    })

    const runtime = getRuntimeConfig(container.env)

    reply.setCookie(runtime.cookieName, result.token, {
      path: '/',
      httpOnly: true,
      secure: runtime.secureCookie,
      sameSite: 'strict',
      maxAge: SESSION_TTL_SECONDS
    })

    return {
      admin: result.admin,
      expiresAt: result.expiresAt
    }
  })

  app.post('/api/admin/auth/logout', { preHandler: requireAdmin }, async (request, reply) => {
    const container = getContainer()
    await logout(container, getRawSessionToken(request))

    const runtime = getRuntimeConfig(container.env)
    reply.clearCookie(runtime.cookieName, {
      path: '/',
      httpOnly: true,
      secure: runtime.secureCookie,
      sameSite: 'strict'
    })

    return { ok: true }
  })

  app.get('/api/admin/auth/me', { preHandler: requireAdmin }, async (request) => ({
    admin: request.admin
  }))

  app.post(
    '/api/admin/auth/password',
    { preHandler: requireAdmin, schema: changePasswordSchema },
    async (request) => {
      const container = getContainer()

      await changePassword(container, {
        adminId: request.admin.id,
        sessionId: request.admin.sessionId,
        currentPassword: request.body.currentPassword,
        newPassword: request.body.newPassword
      })

      return { ok: true }
    }
  )
}
