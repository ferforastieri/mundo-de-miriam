import { notFound } from '../../http/errors.js'
import { nowIso } from '../../utils/dates.js'

export async function removeAdminAvatar(container, adminId) {
  const admin = await container.adminUsers.findById(adminId)

  if (!admin) {
    throw notFound('Conta não encontrada.')
  }

  await container.adminUsers.updateAvatar(adminId, null, nowIso())

  if (admin.avatar_key) {
    try {
      await container.media.remove(admin.avatar_key)
    } catch (error) {
      console.warn('Não foi possível remover o avatar:', error?.message || error)
    }
  }

  return { avatarUrl: null }
}
