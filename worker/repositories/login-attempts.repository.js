export function createLoginAttemptsRepository(db) {
  return {
    async countFailuresSince(ip, since) {
      const row = await db
        .prepare(
          'SELECT COUNT(*) AS total FROM login_attempts WHERE ip = ? AND success = 0 AND created_at >= ?'
        )
        .bind(ip, since)
        .first()

      return Number(row?.total || 0)
    },

    async record({ ip, email, success, createdAt }) {
      await db
        .prepare('INSERT INTO login_attempts (ip, email, success, created_at) VALUES (?, ?, ?, ?)')
        .bind(ip, email, success ? 1 : 0, createdAt)
        .run()
    },

    async deleteOlderThan(cutoff) {
      await db.prepare('DELETE FROM login_attempts WHERE created_at < ?').bind(cutoff).run()
    }
  }
}
