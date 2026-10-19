export function nowIso() {
  return new Date().toISOString()
}

export function addSecondsIso(seconds) {
  return new Date(Date.now() + seconds * 1000).toISOString()
}

export function isoDaysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

export function isoMinutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString()
}

export function expiryFromDays(days) {
  return addSecondsIso(days * 24 * 60 * 60)
}

export function isExpired(isoDate) {
  if (!isoDate) return true
  return new Date(isoDate).getTime() <= Date.now()
}
