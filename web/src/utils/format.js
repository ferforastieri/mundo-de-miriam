export function formatNumber(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) return '—'

  return new Intl.NumberFormat('pt-BR', {
    notation: number >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1
  }).format(number)
}

export function formatBytes(bytes) {
  const value = Number(bytes)

  if (!Number.isFinite(value) || value <= 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
  const size = value / 1024 ** exponent

  return `${size.toLocaleString('pt-BR', { maximumFractionDigits: size >= 10 ? 0 : 1 })} ${units[exponent]}`
}

export function formatDateTime(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

export function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(date)
}
