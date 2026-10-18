export function createAdminUsersRepository(db) {
  return {
    async findByEmail(email) {
      return db
        .prepare('SELECT * FROM admin_users WHERE email = ? COLLATE NOCASE')
        .bind(email)
        .first()
    },

    async findById(id) {
      return db.prepare('SELECT * FROM admin_users WHERE id = ?').bind(id).first()
    },

    async touchLastLogin(id, at) {
      await db
        .prepare('UPDATE admin_users SET last_login_at = ?, updated_at = ? WHERE id = ?')
        .bind(at, at, id)
        .run()
    },

    async updatePassword(id, { hash, salt, iterations, updatedAt }) {
      await db
        .prepare(
          'UPDATE admin_users SET password_hash = ?, password_salt = ?, password_iterations = ?, updated_at = ? WHERE id = ?'
        )
        .bind(hash, salt, iterations, updatedAt, id)
        .run()
    }
  }
}
