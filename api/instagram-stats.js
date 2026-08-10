const INSTAGRAM_USERNAME = 'mihforastieri'
const INSTAGRAM_APP_ID = '936619743392459'
const FALLBACK_STATS = {
  followers: 3139,
  posts: 157,
  recentViews: 13838,
  recentInteractions: 1653,
  recentItems: 11,
  updatedAt: '2026-08-10T00:00:00.000Z',
  cached: true
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const instagramResponse = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_USERNAME}`,
      {
        headers: {
          'X-IG-App-ID': INSTAGRAM_APP_ID,
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
          Accept: 'application/json'
        }
      }
    )

    if (!instagramResponse.ok) {
      throw new Error(`Instagram respondeu com status ${instagramResponse.status}`)
    }

    const payload = await instagramResponse.json()
    const profile = payload?.data?.user

    if (!profile) {
      throw new Error('Perfil do Instagram não encontrado')
    }

    const recentMedia = [
      ...new Map(
        (profile.edge_owner_to_timeline_media?.edges || []).map(({ node }) => [node.shortcode, node])
      ).values()
    ]

    const recentViews = recentMedia.reduce(
      (total, media) => total + (media.video_view_count || 0),
      0
    )
    const recentInteractions = recentMedia.reduce((total, media) => {
      const likes = media.edge_liked_by?.count ?? media.edge_media_preview_like?.count ?? 0
      const comments = media.edge_media_to_comment?.count ?? 0
      return total + likes + comments
    }, 0)

    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return response.status(200).json({
      followers: profile.edge_followed_by?.count || 0,
      posts: profile.edge_owner_to_timeline_media?.count || 0,
      recentViews,
      recentInteractions,
      recentItems: recentMedia.length,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400')
    return response.status(200).json(FALLBACK_STATS)
  }
}
