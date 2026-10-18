export const JSON_BODY_LIMIT = 1024 * 1024
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024

export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
export const SESSION_COOKIE_PRODUCTION = '__Host-mdm_session'
export const SESSION_COOKIE_DEVELOPMENT = 'mdm_session'

export const PBKDF2_ITERATIONS = 100_000

export const LOGIN_MAX_FAILURES = 5
export const LOGIN_WINDOW_MINUTES = 15

export const INSTAGRAM_GRAPH_VERSION = 'v23.0'
export const INSTAGRAM_MEDIA_LIMIT = 12
export const INSTAGRAM_TOKEN_TTL_DAYS = 60
export const INSTAGRAM_REFRESH_WINDOW_DAYS = 7
export const INSTAGRAM_STALE_HOURS = 6

export const IMAGE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
]

export function getRuntimeConfig(env) {
  const isDevelopment = env.ENVIRONMENT === 'development'

  return {
    isDevelopment,
    cookieName: isDevelopment ? SESSION_COOKIE_DEVELOPMENT : SESSION_COOKIE_PRODUCTION,
    secureCookie: !isDevelopment,
    publicSiteUrl: env.PUBLIC_SITE_URL || 'https://www.mundodemiriam.com.br'
  }
}
