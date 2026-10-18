export function createAlbumsRepository(db) {
  return {
    async listAll() {
      const result = await db
        .prepare(
          `SELECT a.*, COUNT(p.id) AS photo_count
           FROM albums a
           LEFT JOIN album_photos p ON p.album_id = a.id
           GROUP BY a.id
           ORDER BY a.created_at DESC`
        )
        .all()

      return result.results || []
    },

    async findById(id) {
      return db.prepare('SELECT * FROM albums WHERE id = ?').bind(id).first()
    },

    async findByToken(token) {
      return db.prepare('SELECT * FROM albums WHERE token = ?').bind(token).first()
    },

    async create(album) {
      await db
        .prepare(
          `INSERT INTO albums (id, token, title, description, expires_at, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          album.id,
          album.token,
          album.title,
          album.description ?? null,
          album.expiresAt ?? null,
          album.createdAt,
          album.createdAt
        )
        .run()
    },

    async update(id, { title, description, expiresAt, updatedAt }) {
      await db
        .prepare(
          'UPDATE albums SET title = ?, description = ?, expires_at = ?, updated_at = ? WHERE id = ?'
        )
        .bind(title, description ?? null, expiresAt ?? null, updatedAt, id)
        .run()
    },

    async remove(id) {
      await db.prepare('DELETE FROM albums WHERE id = ?').bind(id).run()
    },

    async listPhotos(albumId) {
      const result = await db
        .prepare(
          'SELECT * FROM album_photos WHERE album_id = ? ORDER BY sort_order ASC, created_at ASC'
        )
        .bind(albumId)
        .all()

      return result.results || []
    },

    async findPhoto(id) {
      return db.prepare('SELECT * FROM album_photos WHERE id = ?').bind(id).first()
    },

    async insertPhoto(photo) {
      await db
        .prepare(
          `INSERT INTO album_photos
            (id, album_id, storage_key, alt, content_type, bytes, sort_order, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          photo.id,
          photo.albumId,
          photo.storageKey,
          photo.alt ?? null,
          photo.contentType,
          photo.bytes,
          photo.sortOrder,
          photo.createdAt,
          photo.createdAt
        )
        .run()
    },

    async updatePhoto(id, { alt, updatedAt }) {
      await db
        .prepare('UPDATE album_photos SET alt = ?, updated_at = ? WHERE id = ?')
        .bind(alt ?? null, updatedAt, id)
        .run()
    },

    async removePhoto(id) {
      await db.prepare('DELETE FROM album_photos WHERE id = ?').bind(id).run()
    },

    async maxSortOrder(albumId) {
      const row = await db
        .prepare('SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM album_photos WHERE album_id = ?')
        .bind(albumId)
        .first()

      return Number(row?.max_order || 0)
    },

    async reorder(albumId, orderedIds, updatedAt) {
      const statements = orderedIds.map((id, index) =>
        db
          .prepare(
            'UPDATE album_photos SET sort_order = ?, updated_at = ? WHERE id = ? AND album_id = ?'
          )
          .bind((index + 1) * 10, updatedAt, id, albumId)
      )

      if (statements.length > 0) {
        await db.batch(statements)
      }
    },

    async totals() {
      const row = await db
        .prepare(
          `SELECT
             (SELECT COUNT(*) FROM albums) AS albums,
             (SELECT COUNT(*) FROM albums WHERE expires_at IS NOT NULL AND expires_at <= datetime('now')) AS expired,
             (SELECT COUNT(*) FROM album_photos) AS photos`
        )
        .first()

      return {
        albums: Number(row?.albums || 0),
        expired: Number(row?.expired || 0),
        photos: Number(row?.photos || 0)
      }
    }
  }
}
