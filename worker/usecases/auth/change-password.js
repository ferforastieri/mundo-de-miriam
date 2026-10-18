import { AppError } from '../../http/errors.js'
import { hashPassword, verifyPassword } from '../../services/password.js'
import { nowIso } from '../../utils/dates.js'

const MIN_PASSWORD_LENGTH = 12
const MAX_PASSWORD_LENGTH = 200

export async function changePassword(container, { adminId, sessionId, currentPassword, newPassword }) {
  const password = String(newPassword || '')
  const current = String(currentPassword || '')

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(
      400,
      'weak_password',
      `A nova senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`
    )
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new AppError(400, 'weak_password', 'A nova senha é muito longa.')
  }

  if (password === current) {
    throw new AppError(400, 'weak_password', 'A nova senha precisa ser diferente da atual.')
  }

  const user = await container.adminUsers.findById(adminId)

  if (!user) {
    throw new AppError(401, 'unauthorized', 'Sessão inválida.')
  }

  const currentMatches = await verifyPassword(current, user)

  if (!currentMatches) {
    throw new AppError(400, 'invalid_password', 'A senha atual está incorreta.')
  }

  const updated = await hashPassword(password)
  const now = nowIso()

  await container.adminUsers.updatePassword(adminId, {
    hash: updated.hash,
    salt: updated.salt,
    iterations: updated.iterations,
    updatedAt: now
  })

  await container.sessions.deleteByAdminUser(adminId, sessionId)

  return { updatedAt: now }
}
