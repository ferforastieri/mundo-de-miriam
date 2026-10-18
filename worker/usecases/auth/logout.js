import { hashSessionToken } from '../../services/session-token.js'

export async function logout(container, rawToken) {
  if (!rawToken) return

  const tokenHash = await hashSessionToken(rawToken)
  await container.sessions.deleteByTokenHash(tokenHash)
}
