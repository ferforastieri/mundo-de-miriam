import { notFound } from '../../http/errors.js'
import { nowIso } from '../../utils/dates.js'

export async function deletePhoto(container, photoId) {
  const photo = await container.photos.findById(photoId)

  if (!photo) {
    throw notFound('Foto não encontrada.')
  }

  await container.photos.remove(photoId)

  try {
    await container.media.remove(photo.storage_key)
  } catch (error) {
    console.warn('Não foi possível remover o arquivo do R2:', error?.message || error)
  }

  if (photo.group_id) {
    const remaining = await container.photos.listGroupPhotos(photo.group_id, {
      includeHidden: false
    })

    if (remaining.length > 0 && !remaining.some((item) => item.is_featured)) {
      await container.photos.setFeatured(remaining[0].id, photo.group_id, nowIso())
    }
  }

  return { deleted: true }
}
