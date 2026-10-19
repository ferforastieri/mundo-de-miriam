import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from '../../config.js'
import {
  badRequest,
  payloadTooLarge,
  unsupportedMedia
} from '../../http/errors.js'
import { toAdminPhoto } from '../../mappers/photo.mapper.js'
import { detectMediaContentType, extensionForContentType } from '../../services/image.js'
import { nowIso } from '../../utils/dates.js'
import { slugify } from '../../utils/slug.js'

export async function resolvePhotoScope(container, { screenId, groupId }) {
  const screen = await container.screens.findById(screenId)

  if (!screen) {
    throw badRequest('invalid_screen', 'Tela inválida.')
  }

  let group = null

  if (groupId) {
    group = await container.groups.findById(groupId)

    if (!group || group.screen_id !== screen.id) {
      throw badRequest('invalid_group', 'Grupo inválido para esta tela.')
    }
  }

  if (screen.kind === 'partnerships' && !group) {
    throw badRequest('group_required', 'Escolha a marca/parceria desta foto.')
  }

  if (screen.kind !== 'partnerships' && group) {
    throw badRequest('invalid_group', 'Esta tela não aceita grupos.')
  }

  return { screen, group }
}

export function validateMediaBuffer(buffer) {
  const bytes = buffer?.byteLength ?? 0

  if (bytes === 0) {
    throw badRequest('empty_file', 'O arquivo enviado está vazio.')
  }

  const contentType = detectMediaContentType(buffer)

  if (!contentType) {
    throw unsupportedMedia(
      'Envie uma imagem (JPEG, PNG, WebP, GIF, AVIF) ou um vídeo (MP4, WebM ou MOV).'
    )
  }

  if (contentType.startsWith('video/')) {
    if (bytes > MAX_VIDEO_BYTES) {
      throw payloadTooLarge('O vídeo deve ter no máximo 50 MB.')
    }
  } else if (bytes > MAX_IMAGE_BYTES) {
    throw payloadTooLarge('A imagem deve ter no máximo 20 MB.')
  }

  return contentType
}

/** Compatibilidade com chamadas antigas. */
export const validateImageBuffer = validateMediaBuffer

export async function uploadPhoto(container, {
  screenId,
  groupId = null,
  buffer,
  fileName,
  alt = '',
  caption = ''
}) {
  const { screen, group } = await resolvePhotoScope(container, { screenId, groupId })
  const contentType = validateMediaBuffer(buffer)
  const extension = extensionForContentType(contentType)
  const photoId = crypto.randomUUID()
  const storageKey = `photos/${photoId}/${slugify(fileName || 'imagem')}.${extension}`
  const now = nowIso()
  const maxSortOrder = await container.photos.maxSortOrder({
    screenId: screen.id,
    groupId: group?.id || null
  })

  let isFeatured = false

  if (group) {
    const groupPhotos = await container.photos.listGroupPhotos(group.id, { includeHidden: true })
    isFeatured = !groupPhotos.some((photo) => photo.is_featured)
  }

  await container.media.put(storageKey, buffer, contentType)

  try {
    await container.photos.insert({
      id: photoId,
      screenId: screen.id,
      groupId: group?.id || null,
      storageKey,
      alt: String(alt || '').slice(0, 240),
      caption: String(caption || '').slice(0, 400),
      contentType,
      bytes: buffer.byteLength,
      width: null,
      height: null,
      sortOrder: maxSortOrder + 10,
      isVisible: true,
      isFeatured,
      createdAt: now
    })
  } catch (error) {
    await container.media.remove(storageKey).catch(() => {})
    throw error
  }

  if (screen.kind === 'single') {
    await container.photos.ensureSingleVisible(screen.id, photoId, now)
  }

  const created = await container.photos.findById(photoId)
  return toAdminPhoto(created)
}
