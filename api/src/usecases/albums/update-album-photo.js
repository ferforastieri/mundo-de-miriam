import { notFound } from '../../http/errors.js'
import { toAlbumPhoto } from '../../mappers/album.mapper.js'
import { nowIso } from '../../utils/dates.js'

export async function updateAlbumPhoto(container, photoId, { alt }) {
  const photo = await container.albums.findPhoto(photoId)

  if (!photo) {
    throw notFound('Foto do álbum não encontrada.')
  }

  await container.albums.updatePhoto(photoId, {
    alt: String(alt || '').slice(0, 240),
    updatedAt: nowIso()
  })

  const updated = await container.albums.findPhoto(photoId)
  return toAlbumPhoto(updated)
}
