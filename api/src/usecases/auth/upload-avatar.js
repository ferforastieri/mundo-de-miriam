import { IMAGE_CONTENT_TYPES, MAX_IMAGE_BYTES } from '../../config.js'
import { badRequest, notFound } from '../../http/errors.js'
import { nowIso } from '../../utils/dates.js'

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif'
}

export async function uploadAdminAvatar(container, adminId, { body, contentType }) {
  const type = String(contentType || '').split(';')[0].trim().toLowerCase()

  if (!body || !body.byteLength) {
    throw badRequest('empty_file', 'Envie uma imagem.')
  }

  if (body.byteLength > MAX_IMAGE_BYTES) {
    throw badRequest('file_too_large', 'A imagem é muito grande.')
  }

  if (!IMAGE_CONTENT_TYPES.includes(type)) {
    throw badRequest('invalid_type', 'Formato de imagem não suportado.')
  }

  const admin = await container.adminUsers.findById(adminId)

  if (!admin) {
    throw notFound('Conta não encontrada.')
  }

  const key = `avatars/${adminId}/${crypto.randomUUID()}.${EXTENSIONS[type] || 'jpg'}`

  await container.media.put(key, body, type)
  await container.adminUsers.updateAvatar(adminId, key, nowIso())

  if (admin.avatar_key) {
    try {
      await container.media.remove(admin.avatar_key)
    } catch (error) {
      console.warn('Não foi possível remover o avatar anterior:', error?.message || error)
    }
  }

  return { avatarUrl: `/media/${key}` }
}
