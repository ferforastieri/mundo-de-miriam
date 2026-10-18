export function createSessionsRepository(db) {
  return {
    async create(session) {
      await db
        .prepare(
          `INSERT INTO sessions
            (id, token_hash, admin_user_id, created_at, expires_at, last_seen_at, ip, user_agent)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          session.id,
          session.tokenHash,
          session.adminUserId,
          session.createdAt,
          session.expiresAt,
          session.createdAt,
          session.ip,
          session.userAgent
        )
        .run()
    },

    async findByTokenHash(tokenHash) {
      return db
        .prepare(
          `SELECT
             s.id AS session_id,
             s.expires_at,
             u.id AS admin_user_id,
             u.email,
             u.last_login_at
           FROM sessions s
           INNER JOIN admin_users u ON u.id = s.admin_user_id
           WHERE s.token_hash = ?`
        )
        .bind(tokenHash)
        .first()
    },

    async touchLastSeen(id, at) {
      await db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').bind(at, id).run()
    },

    async renew(id, { lastSeenAt, expiresAt }) {
      await db
        .prepare('UPDATE sessions SET last_seen_at = ?, expires_at = ? WHERE id = ?')
        .bind(lastSeenAt, expiresAt, id)
        .run()
    },

    async deleteByTokenHash(tokenHash) {
      await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run()
    },

    async deleteByAdminUser(adminUserId, exceptSessionId = null) {
      if (exceptSessionId) {
        await db
          .prepare('DELETE FROM sessions WHERE admin_user_id = ? AND id <> ?')
          .bind(adminUserId, exceptSessionId)
          .run()
        return
      }

      await db.prepare('DELETE FROM sessions WHERE admin_user_id = ?').bind(adminUserId).run()
    },

    async deleteExpired(now) {
      await db.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(now).run()
    }
  }
}
