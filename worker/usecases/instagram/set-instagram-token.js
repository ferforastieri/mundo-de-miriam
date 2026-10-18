import { INSTAGRAM_TOKEN_TTL_DAYS } from '../../config.js'
import { badRequest } from '../../http/errors.js'
import { fetchProfile } from '../../services/instagram-api.js'
import { encryptSecret } from '../../services/crypto.js'
import { addSecondsIso, nowIso } from '../../utils/dates.js'
import { refreshInstagramStats } from './refresh-instagram-stats.js'

function sanitizeMessage(message, token) {
  const clean = String(message || 'Token recusado pelo Instagram.')
  return token ? clean.replaceAll(token, '[token]') : clean
}

export async function setInstagramToken(container, { token }) {
  const cleanToken = String(token || '').trim()

  if (cleanToken.length < 20) {
    throw badRequest('invalid_token', 'Informe um token de acesso válido do Instagram.')
  }

  let profile

  try {
    profile = await fetchProfile(cleanToken)
  } catch (error) {
    throw badRequest(
      'invalid_token',
      `Token recusado pelo Instagram: ${sanitizeMessage(error?.message, cleanToken)}`
    )
  }

  const encrypted = await encryptSecret(container.env, cleanToken)
  const now = nowIso()

  await container.instagram.saveState({
    encryptedToken: encrypted.ciphertext,
    tokenIv: encrypted.iv,
    tokenExpiresAt: addSecondsIso(INSTAGRAM_TOKEN_TTL_DAYS * 24 * 60 * 60),
    tokenUpdatedAt: now,
    instagramUserId: profile.id || null,
    username: profile.username || null,
    lastAttemptAt: null,
    lastSuccessAt: null,
    lastError: null
  })

  const refresh = await refreshInstagramStats(container, { source: 'token_setup' })

  return {
    configured: true,
    profile: {
      id: profile.id || null,
      username: profile.username || null,
      followers: profile.followers_count ?? null,
      posts: profile.media_count ?? null
    },
    refresh
  }
}
