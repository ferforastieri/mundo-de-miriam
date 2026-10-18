import { notFound } from '../../http/errors.js'
import { toAlbum, toAlbumPhoto } from '../../mappers/album.mapper.js'

export async function getAlbum(container, albumId) {
  const album = await container.albums.findById(albumId)

  if (!album) {
    throw notFound('Álbum não encontrado.')
  }

  const photos = await container.albums.listPhotos(albumId)

  return {
    album: toAlbum(album, { photoCount: photos.length }),
    photos: photos.map(toAlbumPhoto)
  }
}
