import { INSTAGRAM_GRAPH_VERSION, INSTAGRAM_MEDIA_LIMIT } from '../config.js'

const GRAPH_BASE = `https://graph.instagram.com/${INSTAGRAM_GRAPH_VERSION}`
const REFRESH_URL = 'https://graph.instagram.com/refresh_access_token'
const REQUEST_TIMEOUT_MS = 15_000

export class InstagramApiError extends Error {
  constructor(message, details = null) {
    super(message)
    this.name = 'InstagramApiError'
    this.details = details
  }
}

async function requestJson(url) {
  let response

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    })
  } catch (error) {
    throw new InstagramApiError('Não foi possível conectar à API do Instagram.', {
      cause: error?.message || String(error)
    })
  }

  let payload = {}

  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok || payload?.error) {
    const message =
      payload?.error?.message ||
      `A API do Instagram respondeu com o status ${response.status}.`

    throw new InstagramApiError(message, {
      status: response.status,
      type: payload?.error?.type || null,
      code: payload?.error?.code || null
    })
  }

  return payload
}

function graphUrl(path, query = {}) {
  const url = new URL(`${GRAPH_BASE}/${path}`)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

export async function fetchProfile(token) {
  return requestJson(
    graphUrl('me', {
      fields: 'id,username,followers_count,media_count',
      access_token: token
    })
  )
}

export async function fetchRecentMedia(token, userId) {
  const payload = await requestJson(
    graphUrl(`${userId}/media`, {
      fields: 'id,media_type,like_count,comments_count,permalink,timestamp',
      limit: INSTAGRAM_MEDIA_LIMIT,
      access_token: token
    })
  )

  return Array.isArray(payload.data) ? payload.data : []
}

export async function fetchMediaViews(token, mediaId) {
  const payload = await requestJson(
    graphUrl(`${mediaId}/insights`, {
      metric: 'views',
      access_token: token
    })
  )

  const metric = Array.isArray(payload.data)
    ? payload.data.find((item) => item.name === 'views')
    : null

  return Number(metric?.values?.[0]?.value ?? 0)
}

export async function fetchRecentViews(token, mediaItems) {
  const results = await Promise.allSettled(
    mediaItems.map((media) => fetchMediaViews(token, media.id))
  )

  return results.reduce((total, result) => {
    return result.status === 'fulfilled' ? total + (result.value || 0) : total
  }, 0)
}

export async function refreshLongLivedToken(token) {
  const url = new URL(REFRESH_URL)
  url.searchParams.set('grant_type', 'ig_refresh_token')
  url.searchParams.set('access_token', token)

  const payload = await requestJson(url)

  if (!payload.access_token) {
    throw new InstagramApiError('A API do Instagram não retornou um token renovado.')
  }

  return {
    accessToken: payload.access_token,
    expiresInSeconds: Number(payload.expires_in || 0)
  }
}
