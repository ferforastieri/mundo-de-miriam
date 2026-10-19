import { notFound } from '../../http/errors.js'
import { toAdminPhoto } from '../../mappers/photo.mapper.js'
import { extensionForContentType } from '../../services/image.js'
import { nowIso } from '../../utils/dates.js'
import { slugify } from '../../utils/slug.js'
import { validateMediaBuffer } from './upload-photo.js'

export async function replacePhotoFile(container, photoId, { buffer, fileName }) {
  const photo = await container.photos.findById(photoId)

  if (!photo) {
    throw notFound('Foto não encontrada.')
  }

  const contentType = validateMediaBuffer(buffer)
  const extension = extensionForContentType(contentType)
  const storageKey = `photos/${photoId}/${slugify(fileName || 'imagem')}.${extension}`
  const previousKey = photo.storage_key

  await container.media.put(storageKey, buffer, contentType)

  try {
    await container.photos.update(photoId, {
      storage_key: storageKey,
      content_type: contentType,
      bytes: buffer.byteLength,
      updated_at: nowIso()
    })
  } catch (error) {
    await container.media.remove(storageKey).catch(() => {})
    throw error
  }

  if (previousKey && previousKey !== storageKey) {
    try {
      await container.media.remove(previousKey)
    } catch (error) {
      console.warn('Não foi possível remover o arquivo anterior do R2:', error?.message || error)
    }
  }

  const updated = await container.photos.findById(photoId)
  return toAdminPhoto(updated)
}
