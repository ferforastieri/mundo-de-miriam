import { INSTAGRAM_STALE_HOURS } from '../config.js'

export function toPublicInstagramStats(snapshot, state, fallbackUsername) {
  if (!snapshot) {
    return {
      available: false,
      configured: Boolean(state?.encrypted_token),
      username: state?.username || fallbackUsername || null
    }
  }

  const ageMs = Date.now() - new Date(snapshot.captured_at).getTime()

  return {
    available: true,
    configured: Boolean(state?.encrypted_token),
    username: state?.username || fallbackUsername || null,
    followers: snapshot.followers,
    posts: snapshot.posts,
    recentViews: snapshot.recent_views,
    recentInteractions: snapshot.recent_interactions,
    recentItems: snapshot.recent_items,
    updatedAt: snapshot.captured_at,
    stale: ageMs > INSTAGRAM_STALE_HOURS * 60 * 60 * 1000
  }
}

export function toInstagramHistoryPoint(row) {
  return {
    capturedAt: row.captured_at,
    followers: row.followers,
    posts: row.posts,
    recentViews: row.recent_views,
    recentInteractions: row.recent_interactions,
    recentItems: row.recent_items,
    reach: row.reach,
    profileViews: row.profile_views,
    accountsEngaged: row.accounts_engaged,
    totalInteractions: row.total_interactions,
    likes: row.likes,
    comments: row.comments,
    shares: row.shares,
    saves: row.saves,
    newFollowers: row.new_followers,
    websiteClicks: row.website_clicks
  }
}

export function toInstagramMedia(row) {
  return {
    id: row.id,
    mediaType: row.media_type,
    permalink: row.permalink,
    publishedAt: row.published_at,
    likeCount: row.like_count,
    commentsCount: row.comments_count,
    views: row.views,
    reach: row.reach,
    shares: row.shares,
    saves: row.saves,
    totalInteractions: row.total_interactions,
    updatedAt: row.updated_at
  }
}

export function toInstagramDemographics(rows) {
  const result = {}

  for (const row of rows) {
    let parsed = []

    try {
      parsed = JSON.parse(row.payload)
    } catch {
      parsed = []
    }

    result[row.breakdown] = parsed
  }

  return result
}

export function toInstagramPublication(row) {
  let photoIds = []

  try {
    photoIds = JSON.parse(row.photo_ids || '[]')
  } catch {
    photoIds = []
  }

  return {
    id: row.id,
    createdAt: row.created_at,
    publishedAt: row.published_at,
    status: row.status,
    caption: row.caption,
    permalink: row.permalink,
    mediaId: row.ig_media_id,
    photoIds,
    error: row.error
  }
}

export function toInstagramState(state) {
  if (!state) {
    return {
      configured: false,
      username: null,
      userId: null,
      tokenExpiresAt: null,
      tokenUpdatedAt: null,
      lastAttemptAt: null,
      lastSuccessAt: null,
      lastError: null
    }
  }

  return {
    configured: Boolean(state.encrypted_token),
    username: state.username || null,
    userId: state.instagram_user_id || null,
    tokenExpiresAt: state.token_expires_at || null,
    tokenUpdatedAt: state.token_updated_at || null,
    lastAttemptAt: state.last_attempt_at || null,
    lastSuccessAt: state.last_success_at || null,
    lastError: state.last_error || null
  }
}
