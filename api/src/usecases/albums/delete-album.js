import { notFound } from '../../http/errors.js'

export async function deleteAlbum(container, albumId) {
  const album = await container.albums.findById(albumId)

  if (!album) {
    throw notFound('Álbum não encontrado.')
  }

  const photos = await container.albums.listPhotos(albumId)

  await container.albums.remove(albumId)

  for (const photo of photos) {
    try {
      await container.media.remove(photo.storage_key)
    } catch (error) {
      console.warn('Não foi possível remover foto do álbum no R2:', error?.message || error)
    }
  }

  return { deleted: true }
}
