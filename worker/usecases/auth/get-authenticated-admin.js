import { hashSessionToken } from '../../services/session-token.js'
import { isExpired } from '../../utils/dates.js'

export async function getAuthenticatedAdmin(container, rawToken) {
  if (!rawToken) return null

  const tokenHash = await hashSessionToken(rawToken)
  const session = await container.sessions.findByTokenHash(tokenHash)

  if (!session || isExpired(session.expires_at)) {
    return null
  }

  return {
    id: session.admin_user_id,
    email: session.email,
    sessionId: session.session_id,
    lastLoginAt: session.last_login_at || null
  }
}
