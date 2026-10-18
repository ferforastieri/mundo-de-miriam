import {
  INSTAGRAM_REFRESH_WINDOW_DAYS,
  INSTAGRAM_TOKEN_TTL_DAYS
} from '../../config.js'
import { toInstagramHistoryPoint, toInstagramState } from '../../mappers/instagram.mapper.js'
import { isoDaysAgo, nowIso } from '../../utils/dates.js'

export async function getInstagramPanel(container) {
  const [state, latest, history, attempts] = await Promise.all([
    container.instagram.getState(),
    container.instagram.latestSuccessful(),
    container.instagram.listSuccessfulSince(isoDaysAgo(90)),
    container.instagram.listRecent(30)
  ])

  return {
    state: {
      ...toInstagramState(state),
      refreshWindowDays: INSTAGRAM_REFRESH_WINDOW_DAYS
    },
    latest: latest
      ? {
          ...toInstagramHistoryPoint(latest),
          source: latest.source
        }
      : null,
    history: history.map(toInstagramHistoryPoint),
    attempts: attempts.map((attempt) => ({
      capturedAt: attempt.captured_at,
      source: attempt.source,
      success: Boolean(attempt.success),
      error: attempt.error || null,
      followers: attempt.followers,
      posts: attempt.posts
    })),
    generatedAt: nowIso(),
    tokenTtlDays: INSTAGRAM_TOKEN_TTL_DAYS
  }
}
