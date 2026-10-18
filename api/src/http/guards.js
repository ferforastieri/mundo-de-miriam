import { getRuntimeConfig } from '../config.js'
import { getContainer } from '../context.js'
import { forbidden, unauthorized } from '../http/errors.js'
import { getAuthenticatedAdmin } from '../usecases/auth/get-authenticated-admin.js'

export function getClientIp(request) {
  return request.headers['cf-connecting-ip'] || request.ip || 'unknown'
}

export function assertSameOrigin(request) {
  const origin = request.headers.origin
  const fetchSite = request.headers['sec-fetch-site']

  if (fetchSite && !['same-origin', 'none'].includes(fetchSite)) {
    throw forbidden('invalid_origin', 'Origem da requisição não permitida.')
  }

  if (!origin) return

  let parsedOrigin
  let originHost

  try {
    parsedOrigin = new URL(origin)
    originHost = parsedOrigin.host
  } catch {
    throw forbidden('invalid_origin', 'Origem da requisição inválida.')
  }

  const runtime = getRuntimeConfig(getContainer().env)
  const allowedOrigins = new Set([runtime.publicSiteUrl])

  if (runtime.isDevelopment) {
    allowedOrigins.add('http://localhost:5173')
    allowedOrigins.add('http://127.0.0.1:5173')
    allowedOrigins.add('http://localhost:8787')
    allowedOrigins.add('http://127.0.0.1:8787')
  }

  if (originHost === request.headers.host || allowedOrigins.has(parsedOrigin.origin)) {
    return
  }

  throw forbidden('invalid_origin', 'Origem da requisição não permitida.')
}

export function getSessionCookieName() {
  return getRuntimeConfig(getContainer().env).cookieName
}

export function getRawSessionToken(request) {
  const cookieName = getSessionCookieName()
  return request.cookies?.[cookieName] || null
}

export async function requireAdmin(request) {
  assertSameOrigin(request)

  const container = getContainer()
  const rawToken = getRawSessionToken(request)
  const admin = rawToken ? await getAuthenticatedAdmin(container, rawToken) : null

  if (!admin) {
    throw unauthorized()
  }

  request.admin = admin
  request.sessionToken = rawToken
}
