import { badRequest } from '../../http/errors.js'
import { toAlbum } from '../../mappers/album.mapper.js'
import { bytesToBase64Url } from '../../services/password.js'
import { addSecondsIso, nowIso } from '../../utils/dates.js'

const DAY_SECONDS = 24 * 60 * 60
const MAX_TITLE = 120
const MAX_DESCRIPTION = 500
const MAX_DAYS = 3650

export function normalizeExpiry(expiresInDays) {
  if (expiresInDays === undefined || expiresInDays === null || expiresInDays === '') return null

  const days = Number(expiresInDays)

  if (days === 0) return null
  if (!Number.isFinite(days) || days < 1 || days > MAX_DAYS) {
    throw badRequest('invalid_expiry', 'A validade deve ser "para sempre" ou entre 1 e 3650 dias.')
  }

  return addSecondsIso(days * DAY_SECONDS)
}

export async function createAlbum(container, { title, description = '', expiresInDays }) {
  const cleanTitle = String(title || '').trim()
  const cleanDescription = String(description || '').trim()

  if (!cleanTitle || cleanTitle.length > MAX_TITLE) {
    throw badRequest('invalid_title', `O nome do álbum deve ter entre 1 e ${MAX_TITLE} caracteres.`)
  }

  if (cleanDescription.length > MAX_DESCRIPTION) {
    throw badRequest(
      'invalid_description',
      `A descrição deve ter no máximo ${MAX_DESCRIPTION} caracteres.`
    )
  }

  const now = nowIso()
  const album = {
    id: crypto.randomUUID(),
    token: bytesToBase64Url(crypto.getRandomValues(new Uint8Array(12))),
    title: cleanTitle,
    description: cleanDescription,
    expiresAt: normalizeExpiry(expiresInDays),
    createdAt: now
  }

  await container.albums.create(album)

  const created = await container.albums.findById(album.id)
  return toAlbum(created)
}
