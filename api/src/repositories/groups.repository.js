export function createGroupsRepository(db) {
  return {
    async listAll() {
      const result = await db
        .prepare('SELECT * FROM photo_groups ORDER BY screen_id ASC, sort_order ASC, name ASC')
        .all()

      return result.results || []
    },

    async listByScreen(screenId) {
      const result = await db
        .prepare(
          'SELECT * FROM photo_groups WHERE screen_id = ? ORDER BY sort_order ASC, name ASC'
        )
        .bind(screenId)
        .all()

      return result.results || []
    },

    async findById(id) {
      return db.prepare('SELECT * FROM photo_groups WHERE id = ?').bind(id).first()
    },

    async create(group) {
      await db
        .prepare(
          `INSERT INTO photo_groups (id, screen_id, name, sort_order, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          group.id,
          group.screenId,
          group.name,
          group.sortOrder,
          group.createdAt,
          group.createdAt
        )
        .run()
    },

    async update(id, { name, sortOrder, updatedAt }) {
      await db
        .prepare('UPDATE photo_groups SET name = ?, sort_order = ?, updated_at = ? WHERE id = ?')
        .bind(name, sortOrder, updatedAt, id)
        .run()
    },

    async remove(id) {
      await db.prepare('DELETE FROM photo_groups WHERE id = ?').bind(id).run()
    },

    async maxSortOrder(screenId) {
      const row = await db
        .prepare('SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM photo_groups WHERE screen_id = ?')
        .bind(screenId)
        .first()

      return Number(row?.max_order || 0)
    },

    async countPhotos(groupId) {
      const row = await db
        .prepare('SELECT COUNT(*) AS total FROM photos WHERE group_id = ?')
        .bind(groupId)
        .first()

      return Number(row?.total || 0)
    },

    async reorder(screenId, orderedIds, updatedAt) {
      const statements = orderedIds.map((id, index) =>
        db
          .prepare('UPDATE photo_groups SET sort_order = ?, updated_at = ? WHERE id = ? AND screen_id = ?')
          .bind((index + 1) * 10, updatedAt, id, screenId)
      )

      if (statements.length > 0) {
        await db.batch(statements)
      }
    }
  }
}
