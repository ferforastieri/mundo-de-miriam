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
             captured_at, source, success, error,
             reach, profile_views, accounts_engaged, total_interactions,
             likes, comments, shares, saves, new_followers, website_clicks)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
          snapshot.error ?? null,
          snapshot.reach ?? null,
          snapshot.profileViews ?? null,
          snapshot.accountsEngaged ?? null,
          snapshot.totalInteractions ?? null,
          snapshot.likes ?? null,
          snapshot.comments ?? null,
          snapshot.shares ?? null,
          snapshot.saves ?? null,
          snapshot.newFollowers ?? null,
          snapshot.websiteClicks ?? null
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
    },

    async upsertMedia(media) {
      await db
        .prepare(
          `INSERT INTO instagram_media
            (id, media_type, permalink, caption, published_at,
             like_count, comments_count, views, reach, shares, saves,
             total_interactions, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             media_type = excluded.media_type,
             permalink = excluded.permalink,
             caption = excluded.caption,
             published_at = excluded.published_at,
             like_count = excluded.like_count,
             comments_count = excluded.comments_count,
             views = excluded.views,
             reach = excluded.reach,
             shares = excluded.shares,
             saves = excluded.saves,
             total_interactions = excluded.total_interactions,
             updated_at = excluded.updated_at`
        )
        .bind(
          media.id,
          media.mediaType ?? null,
          media.permalink ?? null,
          media.caption ?? null,
          media.publishedAt ?? null,
          media.likeCount ?? null,
          media.commentsCount ?? null,
          media.views ?? null,
          media.reach ?? null,
          media.shares ?? null,
          media.saves ?? null,
          media.totalInteractions ?? null,
          media.updatedAt
        )
        .run()
    },

    async listMedia(limit = 12) {
      const result = await db
        .prepare(
          `SELECT * FROM instagram_media
           ORDER BY published_at DESC
           LIMIT ?`
        )
        .bind(limit)
        .all()

      return result.results || []
    },

    async replaceDemographics(entries) {
      const statements = [db.prepare('DELETE FROM instagram_demographics')]

      for (const entry of entries) {
        statements.push(
          db
            .prepare(
              `INSERT INTO instagram_demographics (id, captured_at, metric, breakdown, payload)
               VALUES (?, ?, ?, ?, ?)`
            )
            .bind(
              crypto.randomUUID(),
              entry.capturedAt,
              entry.metric,
              entry.breakdown,
              JSON.stringify(entry.payload)
            )
        )
      }

      await db.batch(statements)
    },

    async listDemographics() {
      const result = await db
        .prepare('SELECT * FROM instagram_demographics ORDER BY breakdown ASC')
        .all()

      return result.results || []
    },

    async insertPublication(publication) {
      await db
        .prepare(
          `INSERT INTO instagram_publications
            (id, created_at, published_at, status, caption, ig_media_id, permalink, photo_ids, error)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          publication.id,
          publication.createdAt,
          publication.publishedAt ?? null,
          publication.status,
          publication.caption ?? null,
          publication.igMediaId ?? null,
          publication.permalink ?? null,
          JSON.stringify(publication.photoIds || []),
          publication.error ?? null
        )
        .run()
    },

    async listPublications(limit = 20) {
      const result = await db
        .prepare('SELECT * FROM instagram_publications ORDER BY created_at DESC LIMIT ?')
        .bind(limit)
        .all()

      return result.results || []
    },

    async countPublicationsSince(since) {
      const row = await db
        .prepare(
          "SELECT COUNT(*) AS total FROM instagram_publications WHERE status = 'published' AND created_at >= ?"
        )
        .bind(since)
        .first()

      return Number(row?.total || 0)
    }
  }
}
