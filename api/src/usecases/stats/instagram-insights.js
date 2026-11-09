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
  // Inclui o dia de hoje e os (days - 1) dias anteriores, sem depender da hora
  // em que a coleta rodou.
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const cutoff = today.getTime() - (days - 1) * DAY_MS
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

/**
 * `recent_views` é o acumulado das publicações recentes no momento da coleta.
 * Somar esse valor dia a dia repetiria as mesmas views; usamos a variação
 * positiva entre coletas. Quando a conta já expõe `views` do dia, esse valor
 * entra no lugar da estimativa.
 */
function estimateViews(daily) {
  let total = 0
  let previous = null

  for (const row of daily) {
    const account = row.views === null || row.views === undefined ? null : Number(row.views)
    const recent = row.recent_views === null || row.recent_views === undefined
      ? null
      : Number(row.recent_views)

    if (Number.isFinite(account)) {
      total += account
    } else if (Number.isFinite(recent) && Number.isFinite(previous)) {
      total += Math.max(0, recent - previous)
    }

    if (Number.isFinite(recent)) previous = recent
  }

  return total
}

export function summarizePeriod(rows, days) {
  const daily = dailyRows(rows, days)
  const accountViews = daily.filter((row) => row.views !== null && row.views !== undefined)
  const mediaViews = daily.filter(
    (row) => row.recent_views !== null && row.recent_views !== undefined
  )
  const followers = daily
    .map((row) => Number(row.followers))
    .filter((value) => Number.isFinite(value))

  let views = estimateViews(daily)

  // Com uma única coleta sem views da conta, o acumulado das publicações é a
  // melhor referência disponível.
  if (!views && !accountViews.length && mediaViews.length === 1) {
    views = Number(mediaViews[0].recent_views) || 0
  }

  return {
    days,
    samples: daily.length,
    from: daily[0]?.captured_at || null,
    to: daily.at(-1)?.captured_at || null,
    views,
    viewsSource: !accountViews.length
      ? 'media'
      : accountViews.length === daily.length
        ? 'account'
        : 'partial',
    newFollowers: sumBy(daily, 'new_followers'),
    // Seguidores líquidos: diferença entre o total no começo e no fim da janela.
    netFollowers: followers.length >= 2 ? followers.at(-1) - followers[0] : null,
    interactions:
      sumBy(daily, 'total_interactions') || sumBy(daily, 'recent_interactions')
  }
}

function numberOrNull(value) {
  if (value === null || value === undefined) return null
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

/**
 * Linha de `instagram_period_totals`: o total oficial que a API devolve para
 * a janela, exatamente como o app do Instagram mostra.
 */
function parsePeriodTotal(row) {
  if (!row) return null

  let payload

  try {
    payload = JSON.parse(row.payload || '{}')
  } catch {
    return null
  }

  const days = Number(row.days ?? payload.days)

  if (!INSIGHT_DAY_OPTIONS.includes(days)) return null

  return {
    days,
    capturedAt: payload.capturedAt || row.captured_at || null,
    from: payload.from || row.window_from || null,
    to: payload.to || row.window_to || null,
    views: numberOrNull(payload.views),
    interactions: numberOrNull(payload.interactions),
    newFollowers: numberOrNull(payload.newFollowers),
    netFollowers: numberOrNull(payload.netFollowers),
    followers: numberOrNull(payload.followers),
    nonFollowers: numberOrNull(payload.nonFollowers)
  }
}

function mergeOfficialTotals(fallback, official) {
  const keys = [
    'views',
    'interactions',
    'newFollowers',
    'netFollowers',
    'followers',
    'nonFollowers'
  ]
  const hasOfficial = keys.some(
    (key) => official[key] !== null && official[key] !== undefined
  )

  if (!hasOfficial) return fallback

  const merged = {
    ...fallback,
    source: 'instagram',
    capturedAt: official.capturedAt,
    from: official.from || fallback.from,
    to: official.to || fallback.to
  }

  for (const key of keys) {
    if (official[key] !== null && official[key] !== undefined) {
      merged[key] = official[key]
    }
  }

  // O total oficial de views já é o acumulado do período; não é uma soma
  // de snapshots diários nem uma estimativa pelas publicações.
  if (official.views !== null) {
    merged.viewsSource = 'instagram'
  }

  return merged
}

/**
 * Monta os mesmos números para o painel e para o PDF.
 *
 * Quando existe o total oficial do Instagram para a janela, ele tem
 * prioridade sobre a soma dos snapshots — é o mesmo número do app. Os
 * snapshots continuam servindo de reserva e para os gráficos.
 */
export function buildInsightPeriods(rows, demographics, requestedDays, periodTotals = []) {
  const days = resolveInsightDays(requestedDays)
  const split = audienceSplit(demographics)
  const totalsByDays = new Map()

  for (const row of periodTotals || []) {
    const parsed = parsePeriodTotal(row)

    if (parsed) totalsByDays.set(parsed.days, parsed)
  }

  const periods = {}

  for (const option of INSIGHT_DAY_OPTIONS) {
    const summary = summarizePeriod(rows, option)

    if (split) {
      summary.followers = split.followers
      summary.nonFollowers = split.nonFollowers
    }

    const official = totalsByDays.get(option)
    periods[option] = official ? mergeOfficialTotals(summary, official) : summary
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
