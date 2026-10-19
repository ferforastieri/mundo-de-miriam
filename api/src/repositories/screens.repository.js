export function createScreensRepository(db) {
  return {
    async listAll() {
      const result = await db
        .prepare('SELECT * FROM screens ORDER BY sort_order ASC, name ASC')
        .all()

      return result.results || []
    },

    async countAll() {
      const row = await db.prepare('SELECT COUNT(*) AS total FROM screens').first()
      return Number(row?.total || 0)
    },

    async listPage({ limit, offset }) {
      const result = await db
        .prepare('SELECT * FROM screens ORDER BY sort_order ASC, name ASC LIMIT ? OFFSET ?')
        .bind(limit, offset)
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

    async findByShareToken(token) {
      return db
        .prepare('SELECT * FROM screens WHERE share_token = ?')
        .bind(token)
        .first()
    },

    async create(screen) {
      await db
        .prepare(
          `INSERT INTO screens
            (id, name, description, kind, sort_order, is_visible, menu_label, menu_category, icon,
             created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          screen.id,
          screen.name,
          screen.description,
          screen.kind,
          screen.sortOrder,
          screen.isVisible,
          screen.menuLabel,
          screen.menuCategory,
          screen.icon,
          screen.createdAt,
          screen.createdAt
        )
        .run()
    },

    async remove(id) {
      await db.prepare('DELETE FROM screens WHERE id = ?').bind(id).run()
    },

    async update(id, screen) {
      await db
        .prepare(
          `UPDATE screens
           SET name = ?,
               description = ?,
               sort_order = ?,
               is_visible = ?,
               menu_label = ?,
               menu_category = ?,
               icon = ?,
               share_token = ?,
               expires_at = ?,
               updated_at = ?
           WHERE id = ?`
        )
        .bind(
          screen.name,
          screen.description,
          screen.sortOrder,
          screen.isVisible,
          screen.menuLabel,
          screen.menuCategory,
          screen.icon,
          screen.shareToken,
          screen.expiresAt,
          screen.updatedAt,
          id
        )
        .run()
    }
  }
}
