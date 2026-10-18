import {
  INSTAGRAM_REFRESH_WINDOW_DAYS,
  INSTAGRAM_TOKEN_TTL_DAYS
} from '../../config.js'
import { decryptSecret, encryptSecret } from '../../services/crypto.js'
import {
  fetchProfile,
  fetchRecentMedia,
  fetchRecentViews,
  refreshLongLivedToken
} from '../../services/instagram-api.js'
import { addSecondsIso, nowIso } from '../../utils/dates.js'

function mapState(state) {
  return {
    encryptedToken: state?.encrypted_token ?? null,
    tokenIv: state?.token_iv ?? null,
    tokenExpiresAt: state?.token_expires_at ?? null,
    tokenUpdatedAt: state?.token_updated_at ?? null,
    instagramUserId: state?.instagram_user_id ?? null,
    username: state?.username ?? null,
    lastAttemptAt: state?.last_attempt_at ?? null,
    lastSuccessAt: state?.last_success_at ?? null,
    lastError: state?.last_error ?? null
  }
}

function shouldRefreshToken(state) {
  if (!state?.token_expires_at) return false

  const expiresAt = new Date(state.token_expires_at).getTime()
  const refreshThreshold = INSTAGRAM_REFRESH_WINDOW_DAYS * 24 * 60 * 60 * 1000

  return expiresAt - Date.now() < refreshThreshold
}

function sanitizeMessage(message, token) {
  const clean = String(message || 'Erro desconhecido na API do Instagram.')
  return token ? clean.replaceAll(token, '[token]') : clean
}

export async function refreshInstagramStats(container, { source = 'manual' } = {}) {
  const state = await container.instagram.getState()
  const now = nowIso()
  let token = null

  if (state?.encrypted_token && state?.token_iv) {
    try {
      token = await decryptSecret(container.env, state.encrypted_token, state.token_iv)
    } catch (error) {
      console.error('Falha ao descriptografar o token do Instagram:', error?.message || error)
    }
  }

  if (!token) {
    return {
      ok: false,
      reason: 'not_configured',
      message: 'Nenhum token do Instagram configurado.'
    }
  }

  let encryptedToken = state.encrypted_token
  let tokenIv = state.token_iv
  let tokenExpiresAt = state.token_expires_at
  let tokenUpdatedAt = state.token_updated_at

  if (shouldRefreshToken(state)) {
    try {
      const refreshed = await refreshLongLivedToken(token)
      token = refreshed.accessToken
      const encrypted = await encryptSecret(container.env, token)
      encryptedToken = encrypted.ciphertext
      tokenIv = encrypted.iv
      tokenExpiresAt = addSecondsIso(
        refreshed.expiresInSeconds || INSTAGRAM_TOKEN_TTL_DAYS * 24 * 60 * 60
      )
      tokenUpdatedAt = now
    } catch (error) {
      console.warn(
        'Não foi possível renovar o token do Instagram:',
        sanitizeMessage(error?.message, token)
      )
    }
  }

  try {
    const profile = await fetchProfile(token)
    const userId = profile.id || state.instagram_user_id || container.env.INSTAGRAM_USER_ID
    const media = await fetchRecentMedia(token, userId)
    const recentInteractions = media.reduce(
      (total, item) => total + (item.like_count || 0) + (item.comments_count || 0),
      0
    )
    const recentViews = await fetchRecentViews(token, media)

    const snapshot = {
      followers: profile.followers_count ?? null,
      posts: profile.media_count ?? null,
      recentViews,
      recentInteractions,
      recentItems: media.length,
      capturedAt: now,
      source,
      success: true
    }

    await container.instagram.insertSnapshot(snapshot)
    await container.instagram.saveState({
      encryptedToken,
      tokenIv,
      tokenExpiresAt,
      tokenUpdatedAt,
      instagramUserId: userId,
      username: profile.username || state?.username || container.env.INSTAGRAM_USERNAME || null,
      lastAttemptAt: now,
      lastSuccessAt: now,
      lastError: null
    })

    return { ok: true, snapshot }
  } catch (error) {
    const message = sanitizeMessage(error?.message, token)

    await container.instagram.insertSnapshot({
      capturedAt: now,
      source,
      success: false,
      error: message
    })

    await container.instagram.saveState({
      ...mapState(state),
      encryptedToken,
      tokenIv,
      tokenExpiresAt,
      tokenUpdatedAt,
      lastAttemptAt: now,
      lastError: message
    })

    return { ok: false, reason: 'api_error', message }
  }
}
