import { notFound } from '../../http/errors.js'

export async function deleteAlbumPhoto(container, photoId) {
  const photo = await container.albums.findPhoto(photoId)

  if (!photo) {
    throw notFound('Foto do álbum não encontrada.')
  }

  await container.albums.removePhoto(photoId)

  try {
    await container.media.remove(photo.storage_key)
  } catch (error) {
    console.warn('Não foi possível remover foto do álbum no R2:', error?.message || error)
  }

  return { deleted: true }
}
