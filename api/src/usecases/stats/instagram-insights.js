import { isoDaysAgo } from '../../utils/dates.js'

export const INSIGHT_DAY_OPTIONS = [7, 30, 90]
export const DEFAULT_INSIGHT_DAYS = 90

const DAY_MS = 24 * 60 * 60 * 1000

export function resolveInsightDays(value) {
  const numeric = Number(value)
  return INSIGHT_DAY_OPTIONS.includes(numeric) ? numeric : DEFAULT_INSIGHT_DAYS
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

/**
 * Divisão das visualizações entre seguidores e não seguidores.
 * O Instagram devolve esse recorte como breakdown `follow_type`.
 */
export function audienceSplit(demographics = []) {
  const row = [...demographics]
    .reverse()
    .find((entry) => entry.breakdown === 'follow_type')

  if (!row) return null

  const payload = parseJson(row.payload, [])
  let followers = 0
  let nonFollowers = 0

  for (const item of Array.isArray(payload) ? payload : []) {
    const dimensions = item.dimension_values || item.dimensionValues || []
    const label = String(
      item.key ?? (Array.isArray(dimensions) ? dimensions[0] : dimensions) ?? ''
    ).toUpperCase()
    const value = Number(item.value ?? item.total_value?.value ?? 0)

    if (!Number.isFinite(value)) continue

    if (label.includes('NON')) {
      nonFollowers += value
    } else if (label.includes('FOLLOWER')) {
      followers += value
    }
  }

  const total = followers + nonFollowers

  if (!total) return null

  return {
    followers: Math.round((followers / total) * 1000) / 10,
    nonFollowers: Math.round((nonFollowers / total) * 1000) / 10
  }
}

/**
 * A coleta roda de hora em hora; para os totais do período usamos apenas o
 * último registro de cada dia, evitando somar o mesmo dia várias vezes.
 */
function dailyRows(rows, days) {
  const cutoff = Date.now() - days * DAY_MS
  const byDay = new Map()

  for (const row of rows) {
    const time = new Date(row.captured_at).getTime()

    if (!Number.isFinite(time) || time < cutoff) continue

    byDay.set(String(row.captured_at).slice(0, 10), row)
  }

  return [...byDay.values()]
}

function sumBy(rows, key) {
  return rows.reduce((total, row) => total + (Number(row[key]) || 0), 0)
}

export function summarizePeriod(rows, days) {
  const daily = dailyRows(rows, days)
  const accountViews = daily.filter((row) => row.views !== null && row.views !== undefined)
  const followers = daily
    .map((row) => Number(row.followers))
    .filter((value) => Number.isFinite(value))

  return {
    days,
    samples: daily.length,
    from: daily[0]?.captured_at || null,
    to: daily.at(-1)?.captured_at || null,
    // Visualizações da conta somadas dia a dia. Enquanto o histórico não tiver
    // views da conta, usa-se a soma das views das publicações recentes.
    views: daily.reduce((total, row) => {
      const value = row.views ?? row.recent_views ?? 0

      return total + (Number(value) || 0)
    }, 0),
    viewsSource: accountViews.length > 0 ? 'account' : 'media',
    newFollowers: sumBy(daily, 'new_followers'),
    // Seguidores líquidos: diferença entre o total no começo e no fim da janela.
    netFollowers: followers.length >= 2 ? followers.at(-1) - followers[0] : null,
    interactions:
      sumBy(daily, 'total_interactions') || sumBy(daily, 'recent_interactions')
  }
}

/**
 * Monta os mesmos números para o painel e para o PDF, a partir do histórico.
 * Assim o PDF nunca diverge do que está na tela.
 */
export function buildInsightPeriods(rows, demographics, requestedDays) {
  const days = resolveInsightDays(requestedDays)
  const split = audienceSplit(demographics)
  const periods = {}

  for (const option of INSIGHT_DAY_OPTIONS) {
    const summary = summarizePeriod(rows, option)

    if (split) {
      summary.followers = split.followers
      summary.nonFollowers = split.nonFollowers
    }

    periods[option] = summary
  }

  return {
    days,
    from: isoDaysAgo(days),
    selected: periods[days],
    options: INSIGHT_DAY_OPTIONS.map((option) => periods[option]),
    last7Days: periods[7],
    last30Days: periods[30],
    last90Days: periods[90]
  }
}
