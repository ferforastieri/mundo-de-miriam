import { notFound } from '../../http/errors.js'
import { toAlbumPhoto } from '../../mappers/album.mapper.js'
import { extensionForContentType } from '../../services/image.js'
import { nowIso } from '../../utils/dates.js'
import { slugify } from '../../utils/slug.js'
import { validateImageBuffer } from '../photos/upload-photo.js'

export async function uploadAlbumPhoto(container, {
  albumId,
  buffer,
  fileName = 'imagem',
  alt = ''
}) {
  const album = await container.albums.findById(albumId)

  if (!album) {
    throw notFound('Álbum não encontrado.')
  }

  const contentType = validateImageBuffer(buffer)
  const extension = extensionForContentType(contentType)
  const photoId = crypto.randomUUID()
  const storageKey = `albums/${albumId}/${slugify(fileName)}.${extension}`
  const now = nowIso()
  const maxSortOrder = await container.albums.maxSortOrder(albumId)

  await container.media.put(storageKey, buffer, contentType)

  try {
    await container.albums.insertPhoto({
      id: photoId,
      albumId,
      storageKey,
      alt: String(alt || '').slice(0, 240),
      contentType,
      bytes: buffer.byteLength,
      sortOrder: maxSortOrder + 10,
      createdAt: now
    })
  } catch (error) {
    await container.media.remove(storageKey).catch(() => {})
    throw error
  }

  const created = await container.albums.findPhoto(photoId)
  return toAlbumPhoto(created)
}
