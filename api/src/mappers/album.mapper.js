import { isExpired } from '../utils/dates.js'

export function toAlbum(row, extra = {}) {
  return {
    id: row.id,
    token: row.token,
    title: row.title,
    description: row.description || '',
    expiresAt: row.expires_at || null,
    expired: Boolean(row.expires_at) && isExpired(row.expires_at),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    photoCount: Number(row.photo_count ?? extra.photoCount ?? 0)
  }
}

export function toAlbumPhoto(row) {
  return {
    id: row.id,
    url: `/media/${row.storage_key}`,
    alt: row.alt || '',
    position: row.sort_order,
    createdAt: row.created_at
  }
}
