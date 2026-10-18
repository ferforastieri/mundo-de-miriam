import { nowIso } from '../../utils/dates.js'

export async function clearInstagramToken(container) {
  const state = await container.instagram.getState()

  await container.instagram.saveState({
    encryptedToken: null,
    tokenIv: null,
    tokenExpiresAt: null,
    tokenUpdatedAt: nowIso(),
    instagramUserId: state?.instagram_user_id ?? null,
    username: state?.username ?? null,
    lastAttemptAt: state?.last_attempt_at ?? null,
    lastSuccessAt: state?.last_success_at ?? null,
    lastError: null
  })

  return { configured: false }
}
