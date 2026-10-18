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

  return parseGraphResponse(response)
}

async function requestJsonPost(path, params = {}) {
  const url = graphUrl(path, params)
  let response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    })
  } catch (error) {
    throw new InstagramApiError('Não foi possível conectar à API do Instagram.', {
      cause: error?.message || String(error)
    })
  }

  return parseGraphResponse(response)
}

async function parseGraphResponse(response) {

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

// ---------------------------------------------------------------------------
// Estatísticas extras (insights) e publicação de conteúdo
// ---------------------------------------------------------------------------

const ACCOUNT_METRICS_FULL = [
  'reach',
  'views',
  'profile_views',
  'accounts_engaged',
  'total_interactions',
  'likes',
  'comments',
  'shares',
  'saves',
  'follower_count',
  'website_clicks'
]

const ACCOUNT_METRICS_CORE = [
  'reach',
  'views',
  'profile_views',
  'accounts_engaged',
  'total_interactions',
  'follower_count'
]

function insightsToMap(payload) {
  const map = {}

  for (const metric of payload?.data || []) {
    const values = metric?.values || []
    const last = values[values.length - 1]
    const value = last?.value ?? metric?.total_value?.value
    map[metric.name] = Number.isFinite(Number(value)) ? Number(value) : null
  }

  return map
}

export async function fetchAccountInsights(token, userId) {
  const attempt = async (metrics) => {
    const payload = await requestJson(
      graphUrl(`${userId}/insights`, {
        metric: metrics.join(','),
        period: 'day',
        access_token: token
      })
    )

    return insightsToMap(payload)
  }

  try {
    return await attempt(ACCOUNT_METRICS_FULL)
  } catch {
    try {
      return await attempt(ACCOUNT_METRICS_CORE)
    } catch {
      return {}
    }
  }
}

export async function fetchMediaInsights(token, mediaId) {
  const attempt = async (metrics) => {
    const payload = await requestJson(
      graphUrl(`${mediaId}/insights`, {
        metric: metrics.join(','),
        access_token: token
      })
    )

    const map = insightsToMap(payload)
    return {
      views: map.views ?? null,
      reach: map.reach ?? null,
      shares: map.shares ?? null,
      saves: map.saves ?? map.saved ?? null,
      totalInteractions: map.total_interactions ?? null
    }
  }

  try {
    return await attempt(['views', 'reach', 'shares', 'saves', 'total_interactions'])
  } catch {
    try {
      return await attempt(['views', 'reach'])
    } catch {
      return null
    }
  }
}

export async function fetchDemographics(token, userId, metric, breakdown) {
  const payload = await requestJson(
    graphUrl(`${userId}/insights`, {
      metric,
      period: 'lifetime',
      breakdown,
      access_token: token
    })
  )

  const values = payload?.data?.[0]?.total_value?.breakdowns?.[0]?.results || []
  return values.map((item) => ({
    key: item.dimension_values?.[0] ?? item.dimension_values?.join(' / ') ?? '',
    value: item.value
  }))
}

export async function createImageContainer(token, userId, { imageUrl, caption }) {
  const payload = await requestJsonPost(`${userId}/media`, {
    image_url: imageUrl,
    caption,
    access_token: token
  })

  if (!payload.id) {
    throw new InstagramApiError('O Instagram não retornou o identificador do conteúdo.')
  }

  return payload.id
}

export async function createCarouselItemContainer(token, userId, { imageUrl }) {
  const payload = await requestJsonPost(`${userId}/media`, {
    image_url: imageUrl,
    is_carousel_item: 'true',
    access_token: token
  })

  if (!payload.id) {
    throw new InstagramApiError('O Instagram não retornou o identificador do item do carrossel.')
  }

  return payload.id
}

export async function createCarouselContainer(token, userId, { children, caption }) {
  const payload = await requestJsonPost(`${userId}/media`, {
    media_type: 'CAROUSEL',
    children: children.join(','),
    caption,
    access_token: token
  })

  if (!payload.id) {
    throw new InstagramApiError('O Instagram não retornou o identificador do carrossel.')
  }

  return payload.id
}

export async function fetchContainerStatus(token, containerId) {
  return requestJson(
    graphUrl(containerId, {
      fields: 'status_code,status',
      access_token: token
    })
  )
}

export async function publishContainer(token, userId, creationId) {
  return requestJsonPost(`${userId}/media_publish`, {
    creation_id: creationId,
    access_token: token
  })
}

export async function fetchMediaDetails(token, mediaId) {
  return requestJson(
    graphUrl(mediaId, {
      fields: 'id,permalink,media_type,timestamp',
      access_token: token
    })
  )
}
