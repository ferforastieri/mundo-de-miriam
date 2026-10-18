import { badRequest, notFound } from '../../http/errors.js'
import { toAlbum } from '../../mappers/album.mapper.js'
import { nowIso } from '../../utils/dates.js'
import { normalizeExpiry } from './create-album.js'

const MAX_TITLE = 120
const MAX_DESCRIPTION = 500

export async function updateAlbum(container, albumId, patch = {}) {
  const album = await container.albums.findById(albumId)

  if (!album) {
    throw notFound('Álbum não encontrado.')
  }

  const title = patch.title === undefined ? album.title : String(patch.title).trim()
  const description =
    patch.description === undefined ? album.description || '' : String(patch.description).trim()
  const expiresAt =
    patch.expiresInDays === undefined ? album.expires_at : normalizeExpiry(patch.expiresInDays)

  if (!title || title.length > MAX_TITLE) {
    throw badRequest('invalid_title', `O nome do álbum deve ter entre 1 e ${MAX_TITLE} caracteres.`)
  }

  if (description.length > MAX_DESCRIPTION) {
    throw badRequest(
      'invalid_description',
      `A descrição deve ter no máximo ${MAX_DESCRIPTION} caracteres.`
    )
  }

  await container.albums.update(albumId, {
    title,
    description,
    expiresAt,
    updatedAt: nowIso()
  })

  const updated = await container.albums.findById(albumId)
  return toAlbum(updated)
}
