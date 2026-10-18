import { badRequest, notFound } from '../../http/errors.js'
import { nowIso } from '../../utils/dates.js'

export async function reorderAlbumPhotos(container, albumId, orderedIds) {
  const album = await container.albums.findById(albumId)

  if (!album) {
    throw notFound('Álbum não encontrado.')
  }

  const photos = await container.albums.listPhotos(albumId)
  const currentIds = photos.map((photo) => photo.id).sort()
  const nextIds = [...new Set((orderedIds || []).map(String))].sort()

  if (
    currentIds.length !== nextIds.length ||
    currentIds.some((id, index) => id !== nextIds[index])
  ) {
    throw badRequest('invalid_order', 'A ordem enviada não corresponde às fotos do álbum.')
  }

  await container.albums.reorder(albumId, orderedIds.map(String), nowIso())
  return { reordered: true }
}
