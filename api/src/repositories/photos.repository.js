export function createPhotosRepository(db) {
  return {
    async listByScreen(screenId, { groupId = null, includeHidden = true, limit = null, offset = 0 } = {}) {
      const clauses = ['screen_id = ?']
      const bindings = [screenId]

      if (groupId !== undefined && groupId !== null) {
        clauses.push('group_id = ?')
        bindings.push(groupId)
      }

      if (!includeHidden) {
        clauses.push('is_visible = 1')
      }

      const sql = `SELECT * FROM photos
        WHERE ${clauses.join(' AND ')}
        ORDER BY sort_order ASC, created_at ASC${limit ? ' LIMIT ? OFFSET ?' : ''}`
      const statement = limit
        ? db.prepare(sql).bind(...bindings, limit, offset)
        : db.prepare(sql).bind(...bindings)
      const result = await statement.all()

      return result.results || []
    },

    async listAllVisible() {
      const result = await db
        .prepare(
          `SELECT * FROM photos
           WHERE is_visible = 1
           ORDER BY screen_id ASC, group_id ASC, sort_order ASC, created_at ASC`
        )
        .all()

      return result.results || []
    },

    async listGroupPhotos(groupId, { includeHidden = true } = {}) {
      const hiddenClause = includeHidden ? '' : 'AND is_visible = 1'
      const result = await db
        .prepare(
          `SELECT * FROM photos
           WHERE group_id = ? ${hiddenClause}
           ORDER BY sort_order ASC, created_at ASC`
        )
        .bind(groupId)
        .all()

      return result.results || []
    },

    async findById(id) {
      return db.prepare('SELECT * FROM photos WHERE id = ?').bind(id).first()
    },

    async insert(photo) {
      await db
        .prepare(
          `INSERT INTO photos
            (id, screen_id, group_id, storage_key, alt, caption, content_type, bytes,
             width, height, sort_order, is_visible, is_featured, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          photo.id,
          photo.screenId,
          photo.groupId,
          photo.storageKey,
          photo.alt,
          photo.caption,
          photo.contentType,
          photo.bytes,
          photo.width,
          photo.height,
          photo.sortOrder,
          photo.isVisible ? 1 : 0,
          photo.isFeatured ? 1 : 0,
          photo.createdAt,
          photo.createdAt
        )
        .run()
    },

    async update(id, fields) {
      const columns = []
      const bindings = []

      for (const [column, value] of Object.entries(fields)) {
        columns.push(`${column} = ?`)
        bindings.push(value)
      }

      if (columns.length === 0) return

      bindings.push(id)
      await db
        .prepare(`UPDATE photos SET ${columns.join(', ')} WHERE id = ?`)
        .bind(...bindings)
        .run()
    },

    async remove(id) {
      await db.prepare('DELETE FROM photos WHERE id = ?').bind(id).run()
    },

    async countByScreen(screenId, { groupId = null } = {}) {
      const clauses = ['screen_id = ?']
      const bindings = [screenId]

      if (groupId !== undefined && groupId !== null) {
        clauses.push('group_id = ?')
        bindings.push(groupId)
      }

      const row = await db
        .prepare(`SELECT COUNT(*) AS total FROM photos WHERE ${clauses.join(' AND ')}`)
        .bind(...bindings)
        .first()

      return Number(row?.total || 0)
    },

    async setSortOrder(id, sortOrder, updatedAt) {
      await db
        .prepare('UPDATE photos SET sort_order = ?, updated_at = ? WHERE id = ?')
        .bind(sortOrder, updatedAt, id)
        .run()
    },

    async maxSortOrder({ screenId, groupId = null }) {
      const row = groupId
        ? await db
            .prepare(
              'SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM photos WHERE screen_id = ? AND group_id = ?'
            )
            .bind(screenId, groupId)
            .first()
        : await db
            .prepare(
              'SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM photos WHERE screen_id = ? AND group_id IS NULL'
            )
            .bind(screenId)
            .first()

      return Number(row?.max_order || 0)
    },

    async reorder(orderedIds, updatedAt) {
      const statements = orderedIds.map((id, index) =>
        db
          .prepare('UPDATE photos SET sort_order = ?, updated_at = ? WHERE id = ?')
          .bind((index + 1) * 10, updatedAt, id)
      )

      if (statements.length > 0) {
        await db.batch(statements)
      }
    },

    async setFeatured(photoId, groupId, updatedAt) {
      await db.batch([
        db
          .prepare('UPDATE photos SET is_featured = 0, updated_at = ? WHERE group_id = ?')
          .bind(updatedAt, groupId),
        db
          .prepare('UPDATE photos SET is_featured = 1, updated_at = ? WHERE id = ?')
          .bind(updatedAt, photoId)
      ])
    },

    async clearFeatured(groupId, updatedAt) {
      await db
        .prepare('UPDATE photos SET is_featured = 0, updated_at = ? WHERE group_id = ?')
        .bind(updatedAt, groupId)
        .run()
    },

    async ensureSingleVisible(screenId, keepPhotoId, updatedAt) {
      await db
        .prepare(
          `UPDATE photos
           SET is_visible = CASE WHEN id = ? THEN 1 ELSE 0 END, updated_at = ?
           WHERE screen_id = ?`
        )
        .bind(keepPhotoId, updatedAt, screenId)
        .run()
    },

    async countsByScreen() {
      const result = await db
        .prepare(
          `SELECT screen_id, COUNT(*) AS total, COALESCE(SUM(bytes), 0) AS bytes
           FROM photos
           GROUP BY screen_id`
        )
        .all()

      return result.results || []
    },

    async countsByGroup() {
      const result = await db
        .prepare(
          `SELECT group_id, COUNT(*) AS total, COALESCE(SUM(bytes), 0) AS bytes
           FROM photos
           WHERE group_id IS NOT NULL
           GROUP BY group_id`
        )
        .all()

      return result.results || []
    },

    async totals() {
      const row = await db
        .prepare(
          `SELECT
             COUNT(*) AS total,
             COALESCE(SUM(bytes), 0) AS bytes,
             COALESCE(SUM(CASE WHEN is_visible = 1 THEN 1 ELSE 0 END), 0) AS visible,
             COALESCE(SUM(CASE WHEN is_visible = 0 THEN 1 ELSE 0 END), 0) AS hidden
           FROM photos`
        )
        .first()

      return {
        total: Number(row?.total || 0),
        bytes: Number(row?.bytes || 0),
        visible: Number(row?.visible || 0),
        hidden: Number(row?.hidden || 0)
      }
    },

    async recent(limit = 8) {
      const result = await db
        .prepare(
          `SELECT
             p.*,
             s.name AS screen_name,
             g.name AS group_name
           FROM photos p
           INNER JOIN screens s ON s.id = p.screen_id
           LEFT JOIN photo_groups g ON g.id = p.group_id
           ORDER BY p.created_at DESC
           LIMIT ?`
        )
        .bind(limit)
        .all()

      return result.results || []
    }
  }
}
