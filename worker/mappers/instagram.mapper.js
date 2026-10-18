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
    recentItems: row.recent_items
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
