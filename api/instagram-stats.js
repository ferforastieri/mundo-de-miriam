const GRAPH_API_VERSION = 'v23.0'
const INSTAGRAM_USER_ID = '17841464226067946'
const CACHE_SECONDS = 15 * 60

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Método não permitido' })
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  try {
    const [profile, mediaPayload] = await Promise.all([
      graphRequest(INSTAGRAM_USER_ID, {
        fields: 'followers_count,media_count',
        access_token: accessToken
      }),
      graphRequest(`${INSTAGRAM_USER_ID}/media`, {
        fields: 'id,media_type,like_count,comments_count',
        limit: '12',
        access_token: accessToken
      })
    ])

    const recentMedia = mediaPayload.data
    const recentInteractions = recentMedia.reduce(
      (total, media) => total + (media.like_count || 0) + (media.comments_count || 0),
      0
    )
    const recentViews = await getRecentViews(recentMedia, accessToken)

    setCacheHeaders(response)
    return response.status(200).json({
      followers: profile.followers_count,
      posts: profile.media_count,
      recentViews,
      recentInteractions,
      recentItems: recentMedia.length,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Falha ao atualizar estatísticas do Instagram:', error.message)
    setNoStoreHeaders(response)
    return response.status(502).json({ error: 'Não foi possível atualizar o Instagram' })
  }
}

async function getRecentViews(mediaItems, accessToken) {
  const viewCounts = await Promise.all(
    mediaItems.map(async (media) => {
      const insights = await graphRequest(`${media.id}/insights`, {
        metric: 'views',
        access_token: accessToken
      })
      return insights.data.find((metric) => metric.name === 'views').values[0].value
    })
  )

  return viewCounts.reduce((total, views) => total + views, 0)
}

async function graphRequest(path, query) {
  const url = new URL(`https://graph.instagram.com/${GRAPH_API_VERSION}/${path}`)
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value))

  const graphResponse = await fetch(url, {
    headers: { Accept: 'application/json' }
  })
  const payload = await graphResponse.json()

  if (!graphResponse.ok || payload.error) {
    const message = payload.error?.message || `Meta Graph API respondeu com status ${graphResponse.status}`
    throw new Error(message)
  }

  return payload
}

function setCacheHeaders(response) {
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
  response.setHeader(
    'Vercel-CDN-Cache-Control',
    `public, s-maxage=${CACHE_SECONDS}`
  )
}

function setNoStoreHeaders(response) {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store')
}
