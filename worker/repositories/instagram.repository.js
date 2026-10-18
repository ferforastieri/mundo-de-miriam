export function createInstagramRepository(db) {
  return {
    async getState() {
      return db.prepare('SELECT * FROM instagram_state WHERE id = 1').first()
    },

    async saveState(state) {
      await db
        .prepare(
          `INSERT INTO instagram_state
            (id, encrypted_token, token_iv, token_expires_at, token_updated_at,
             instagram_user_id, username, last_attempt_at, last_success_at, last_error)
           VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             encrypted_token = excluded.encrypted_token,
             token_iv = excluded.token_iv,
             token_expires_at = excluded.token_expires_at,
             token_updated_at = excluded.token_updated_at,
             instagram_user_id = excluded.instagram_user_id,
             username = excluded.username,
             last_attempt_at = excluded.last_attempt_at,
             last_success_at = excluded.last_success_at,
             last_error = excluded.last_error`
        )
        .bind(
          state.encryptedToken ?? null,
          state.tokenIv ?? null,
          state.tokenExpiresAt ?? null,
          state.tokenUpdatedAt ?? null,
          state.instagramUserId ?? null,
          state.username ?? null,
          state.lastAttemptAt ?? null,
          state.lastSuccessAt ?? null,
          state.lastError ?? null
        )
        .run()
    },

    async insertSnapshot(snapshot) {
      await db
        .prepare(
          `INSERT INTO instagram_snapshots
            (followers, posts, recent_views, recent_interactions, recent_items,
             captured_at, source, success, error)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          snapshot.followers ?? null,
          snapshot.posts ?? null,
          snapshot.recentViews ?? null,
          snapshot.recentInteractions ?? null,
          snapshot.recentItems ?? null,
          snapshot.capturedAt,
          snapshot.source,
          snapshot.success ? 1 : 0,
          snapshot.error ?? null
        )
        .run()
    },

    async latestSuccessful() {
      return db
        .prepare(
          `SELECT * FROM instagram_snapshots
           WHERE success = 1
           ORDER BY captured_at DESC
           LIMIT 1`
        )
        .first()
    },

    async listSuccessfulSince(since, limit = 2000) {
      const result = await db
        .prepare(
          `SELECT * FROM instagram_snapshots
           WHERE success = 1 AND captured_at >= ?
           ORDER BY captured_at ASC
           LIMIT ?`
        )
        .bind(since, limit)
        .all()

      return result.results || []
    },

    async listRecent(limit = 50) {
      const result = await db
        .prepare('SELECT * FROM instagram_snapshots ORDER BY captured_at DESC LIMIT ?')
        .bind(limit)
        .all()

      return result.results || []
    },

    async deleteSnapshotsBefore(cutoff) {
      await db
        .prepare('DELETE FROM instagram_snapshots WHERE captured_at < ?')
        .bind(cutoff)
        .run()
    }
  }
}
