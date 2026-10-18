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

    async create(screen) {
      await db
        .prepare(
          `INSERT INTO screens
            (id, name, description, kind, sort_order, is_visible, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          screen.id,
          screen.name,
          screen.description,
          screen.kind,
          screen.sortOrder,
          screen.isVisible,
          screen.createdAt,
          screen.createdAt
        )
        .run()
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
