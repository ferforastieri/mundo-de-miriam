import {
  INSTAGRAM_REFRESH_WINDOW_DAYS,
  INSTAGRAM_TOKEN_TTL_DAYS
} from '../../config.js'
import {
  toInstagramDemographics,
  toInstagramHistoryPoint,
  toInstagramMedia,
  toInstagramPublication,
  toInstagramState
} from '../../mappers/instagram.mapper.js'
import { isoDaysAgo, nowIso } from '../../utils/dates.js'

export async function getInstagramPanel(container) {
  const [state, latest, history, attempts, media, demographics, publications] =
    await Promise.all([
      container.instagram.getState(),
      container.instagram.latestSuccessful(),
      container.instagram.listSuccessfulSince(isoDaysAgo(90)),
      container.instagram.listRecent(30),
      container.instagram.listMedia(12),
      container.instagram.listDemographics(),
      container.instagram.listPublications(20)
    ])

  const dailyHistory = buildDailyHistory(history)

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
    history: dailyHistory,
    attempts: attempts.map((attempt) => ({
      capturedAt: attempt.captured_at,
      source: attempt.source,
      success: Boolean(attempt.success),
      error: attempt.error || null,
      followers: attempt.followers,
      posts: attempt.posts
    })),
    media: media.map(toInstagramMedia),
    demographics: toInstagramDemographics(demographics),
    publications: publications.map(toInstagramPublication),
    publishedLast24h: await container.instagram.countPublicationsSince(isoDaysAgo(1)),
    generatedAt: nowIso(),
    tokenTtlDays: INSTAGRAM_TOKEN_TTL_DAYS
  }
}

/**
 * O cron roda de hora em hora; para os gráficos, mantemos apenas o último
 * registro de cada dia (evitando linhas repetidas com o mesmo valor).
 */
function buildDailyHistory(rows) {
  const byDay = new Map()

  for (const row of rows) {
    const day = String(row.captured_at).slice(0, 10)
    byDay.set(day, row)
  }

  return [...byDay.values()].map(toInstagramHistoryPoint)
}
