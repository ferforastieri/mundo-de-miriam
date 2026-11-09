import { isoDaysAgo, nowIso } from '../../utils/dates.js'
import { toAdminPhoto } from '../../mappers/photo.mapper.js'
import {
  toInstagramHistoryPoint,
  toInstagramState
} from '../../mappers/instagram.mapper.js'
import { toScreen } from '../../mappers/screen.mapper.js'
import { buildInsightPeriods } from './instagram-insights.js'

export async function getDashboard(container, options = {}) {
  const [latest, state, historyRows, demographics, periodTotals, totals, counts, recent, screens] =
    await Promise.all([
      container.instagram.latestSuccessful(),
      container.instagram.getState(),
      container.instagram.listSuccessfulSince(isoDaysAgo(90)),
      container.instagram.listDemographics(),
      container.instagram.listPeriodTotals(),
      container.photos.totals(),
      container.photos.countsByScreen(),
      container.photos.recent(8),
      container.screens.listAll()
    ])

  // Os gráficos rápidos continuam mostrando a janela de 30 dias.
  const sparklineCutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  const history = historyRows.filter(
    (row) => new Date(row.captured_at).getTime() >= sparklineCutoff
  )

  const screensById = new Map(screens.map((screen) => [screen.id, screen]))
  const countsByScreen = new Map(
    counts.map((row) => [
      row.screen_id,
      { total: Number(row.total || 0), bytes: Number(row.bytes || 0) }
    ])
  )

  return {
    instagram: {
      state: toInstagramState(state),
      latest: latest ? toInstagramHistoryPoint(latest) : null,
      history: history.map(toInstagramHistoryPoint),
      insights: buildInsightPeriods(historyRows, demographics, options.days, periodTotals)
    },
    photos: {
      totals,
      byScreen: screens.map((screen) => ({
        screenId: screen.id,
        name: screen.name,
        kind: screen.kind,
        total: countsByScreen.get(screen.id)?.total || 0,
        bytes: countsByScreen.get(screen.id)?.bytes || 0
      })),
      recent: recent.map((photo) =>
        toAdminPhoto(photo, {
          screenName: photo.screen_name || screensById.get(photo.screen_id)?.name || null,
          groupName: photo.group_name || null
        })
      )
    },
    screens: screens.map(toScreen),
    generatedAt: nowIso()
  }
}
