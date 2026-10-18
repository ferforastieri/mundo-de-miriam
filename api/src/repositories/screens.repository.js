export function createScreensRepository(db) {
  return {
    async listAll() {
      const result = await db
        .prepare('SELECT * FROM screens ORDER BY sort_order ASC, name ASC')
        .all()

      return result.results || []
    },

    async listVisible() {
      const result = await db
        .prepare('SELECT * FROM screens WHERE is_visible = 1 ORDER BY sort_order ASC, name ASC')
        .all()

      return result.results || []
    },

    async findById(id) {
      return db.prepare('SELECT * FROM screens WHERE id = ?').bind(id).first()
    },

    async update(id, { name, description, sortOrder, isVisible, updatedAt }) {
      await db
        .prepare(
          `UPDATE screens
           SET name = ?, description = ?, sort_order = ?, is_visible = ?, updated_at = ?
           WHERE id = ?`
        )
        .bind(name, description, sortOrder, isVisible, updatedAt, id)
        .run()
    }
  }
}
