import { notFound } from '../../http/errors.js'
import { toAlbumPhoto } from '../../mappers/album.mapper.js'
import { isExpired } from '../../utils/dates.js'

export async function getPublicAlbum(container, token) {
  const album = await container.albums.findByToken(String(token || ''))

  if (!album) {
    throw notFound('Álbum não encontrado.')
  }

  if (album.expires_at && isExpired(album.expires_at)) {
    return {
      available: false,
      reason: 'expired',
      album: {
        title: album.title,
        expiresAt: album.expires_at
      }
    }
  }

  const photos = await container.albums.listPhotos(album.id)

  return {
    available: true,
    album: {
      title: album.title,
      description: album.description || '',
      createdAt: album.created_at,
      expiresAt: album.expires_at || null
    },
    photos: photos.map(toAlbumPhoto)
  }
}
