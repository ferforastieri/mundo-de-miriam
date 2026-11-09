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
  try {
    return await requestJson(
      graphUrl('me', {
        fields:
          'id,username,name,biography,website,followers_count,follows_count,media_count,profile_picture_url',
        access_token: token
      })
    )
  } catch (error) {
    // Contas/versões antigas podem não expor todos os campos extras.
    return requestJson(
      graphUrl('me', {
        fields: 'id,username,followers_count,media_count',
        access_token: token
      })
    )
  }
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

const ACCOUNT_METRICS = [
  'reach',
  'views',
  'profile_views',
  'accounts_engaged',
  'total_interactions',
  'likes',
  'comments',
  'shares',
  'saves',
  'website_clicks'
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

/**
 * Janela do dia corrente. Sem since/until a API pode devolver um intervalo
 * maior (rolagem de 30 dias), o que infla a soma diária dos insights.
 */
function currentDayWindow() {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  return {
    since: Math.floor(start.getTime() / 1000),
    until: Math.floor(now.getTime() / 1000)
  }
}

export async function fetchAccountInsights(token, userId) {
  const window = currentDayWindow()

  const attempt = async (metrics, extra = {}) => {
    const payload = await requestJson(
      graphUrl(`${userId}/insights`, {
        metric: metrics.join(','),
        period: 'day',
        ...window,
        ...extra,
        access_token: token
      })
    )

    return insightsToMap(payload)
  }

  // As métricas de engajamento só retornam dados com metric_type=total_value.
  let map = {}

  try {
    map = await attempt(ACCOUNT_METRICS, { metric_type: 'total_value' })
  } catch {
    const results = await Promise.allSettled(
      ACCOUNT_METRICS.map((metric) => attempt([metric], { metric_type: 'total_value' }))
    )

    for (const result of results) {
      if (result.status === 'fulfilled') Object.assign(map, result.value)
    }
  }

  // follower_count (novos seguidores) não aceita total_value.
  try {
    const followers = await attempt(['follower_count'])

    if (map.follower_count === undefined) {
      map.follower_count = followers.follower_count ?? null
    }
  } catch {
    // sem dados de novos seguidores
  }

  return map
}

const PERIOD_METRICS = [
  'views',
  'total_interactions',
  'likes',
  'comments',
  'shares',
  'saves',
  'profile_views',
  'accounts_engaged',
  'reach'
]

function periodWindow(days) {
  const until = Math.floor(Date.now() / 1000)
  const since = Math.floor((Date.now() - Math.max(1, days - 1) * 24 * 60 * 60 * 1000) / 1000)

  return { since, until }
}

async function fetchTotalValues(token, userId, metrics, window) {
  const payload = await requestJson(
    graphUrl(`${userId}/insights`, {
      metric: metrics.join(','),
      period: 'day',
      metric_type: 'total_value',
      since: window.since,
      until: window.until,
      access_token: token
    })
  )

  const totals = {}

  for (const metric of payload?.data || []) {
    const value = metric?.total_value?.value
    const numeric = Number(value)

    totals[metric.name] =
      value !== null && value !== undefined && Number.isFinite(numeric) ? numeric : null
  }

  return totals
}

function breakdownValues(payload, metricName) {
  const metric = (payload?.data || []).find((item) => item.name === metricName)
  const results = metric?.total_value?.breakdowns?.[0]?.results || []

  return results.map((item) => ({
    key: String(item.dimension_values?.[0] || '').toUpperCase(),
    value: Number(item.value) || 0
  }))
}

function sumBreakdown(items, predicate) {
  return items.filter(predicate).reduce((total, item) => total + item.value, 0)
}

function splitPercentages(followers, nonFollowers) {
  const total = followers + nonFollowers

  if (!total) return { followers: null, nonFollowers: null }

  return {
    followers: Math.round((followers / total) * 1000) / 10,
    nonFollowers: Math.round((nonFollowers / total) * 1000) / 10
  }
}

/**
 * Totais oficiais do Instagram para uma janela de dias.
 *
 * O app mostra o acumulado do período; somar os snapshots diários não
 * reproduz esse número (views e interações são contados de formas diferentes
 * por dia). Com `metric_type=total_value` + `since/until` a própria API
 * devolve o total do período, que é o mesmo número exibido no Instagram.
 */
export async function fetchPeriodTotals(token, userId, days) {
  const window = periodWindow(days)
  let totals = {}

  try {
    totals = await fetchTotalValues(token, userId, PERIOD_METRICS, window)
  } catch {
    // Uma métrica indisponível derruba o lote; busca cada uma isoladamente.
    const results = await Promise.allSettled(
      PERIOD_METRICS.map((metric) => fetchTotalValues(token, userId, [metric], window))
    )

    for (const result of results) {
      if (result.status === 'fulfilled') Object.assign(totals, result.value)
    }
  }

  // Views por seguidor/não seguidor e follows/unfollows usam o mesmo
  // breakdown (`follow_type`), então cabem na mesma chamada.
  let viewBreakdown = []
  let followBreakdown = []

  try {
    const payload = await requestJson(
      graphUrl(`${userId}/insights`, {
        metric: 'views,follows_and_unfollows',
        period: 'day',
        metric_type: 'total_value',
        breakdown: 'follow_type',
        since: window.since,
        until: window.until,
        access_token: token
      })
    )

    viewBreakdown = breakdownValues(payload, 'views')
    followBreakdown = breakdownValues(payload, 'follows_and_unfollows')
  } catch {
    // Contas pequenas podem não expor o detalhamento; tenta separadamente.
    for (const metric of ['views', 'follows_and_unfollows']) {
      try {
        const payload = await requestJson(
          graphUrl(`${userId}/insights`, {
            metric,
            period: 'day',
            metric_type: 'total_value',
            breakdown: 'follow_type',
            since: window.since,
            until: window.until,
            access_token: token
          })
        )

        if (metric === 'views') viewBreakdown = breakdownValues(payload, 'views')
        else followBreakdown = breakdownValues(payload, 'follows_and_unfollows')
      } catch {
        // Sem o recorte; segue sem ele.
      }
    }
  }

  const followerViews = sumBreakdown(
    viewBreakdown,
    (item) => item.key.includes('FOLLOWER') && !item.key.includes('NON')
  )
  const nonFollowerViews = sumBreakdown(viewBreakdown, (item) => item.key.includes('NON'))
  const split = splitPercentages(followerViews, nonFollowerViews)

  const follows = sumBreakdown(
    followBreakdown,
    (item) => item.key.includes('FOLLOW') && !item.key.includes('NON')
  )
  const unfollows = sumBreakdown(followBreakdown, (item) => item.key.includes('NON'))
  const hasFollows = followBreakdown.length > 0

  return {
    days,
    capturedAt: new Date().toISOString(),
    from: new Date(window.since * 1000).toISOString(),
    to: new Date(window.until * 1000).toISOString(),
    views: totals.views ?? null,
    interactions: totals.total_interactions ?? null,
    likes: totals.likes ?? null,
    comments: totals.comments ?? null,
    shares: totals.shares ?? null,
    saves: totals.saves ?? null,
    profileViews: totals.profile_views ?? null,
    accountsEngaged: totals.accounts_engaged ?? null,
    reach: totals.reach ?? null,
    newFollowers: hasFollows ? follows : null,
    netFollowers: hasFollows ? follows - unfollows : null,
    followers: split.followers,
    nonFollowers: split.nonFollowers,
    source: 'instagram'
  }
}

/**
 * Views separadas entre seguidores e não seguidores. Alguns tipos de conta
 * não expõem esse detalhamento; quem chama deve tratar a falha como opcional.
 */
export async function fetchViewsByFollowType(token, userId) {
  const window = currentDayWindow()

  const payload = await requestJson(
    graphUrl(`${userId}/insights`, {
      metric: 'views',
      period: 'day',
      ...window,
      metric_type: 'total_value',
      breakdown: 'follow_type',
      access_token: token
    })
  )

  const values = payload?.data?.[0]?.total_value?.breakdowns?.[0]?.results || []
  return values.map((item) => ({
    key: item.dimension_values?.[0] ?? item.dimension_values?.join(' / ') ?? '',
    value: item.value
  }))
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
      saves: map.saved ?? map.saves ?? null,
      totalInteractions: map.total_interactions ?? null
    }
  }

  try {
    return await attempt(['views', 'reach', 'shares', 'saved', 'total_interactions'])
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
      metric_type: 'total_value',
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
