// A URL que o Instagram devolve para a foto de perfil é assinada e expira.
// Guardamos uma cópia no R2 para o painel continuar exibindo a imagem mesmo
// depois do vencimento (e para evitar hotlink direto no CDN do Instagram).
const AVATAR_KEY = 'avatars/instagram/profile'
const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const FETCH_TIMEOUT_MS = 10_000

export async function storeProfilePicture(container, url) {
  if (!url || !container?.media) return null

  let response

  try {
    response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
  } catch {
    return null
  }

  if (!response.ok) return null

  const contentType = response.headers.get('content-type') || 'image/jpeg'

  if (!contentType.startsWith('image/')) return null

  let bytes

  try {
    bytes = await response.arrayBuffer()
  } catch {
    return null
  }

  if (!bytes?.byteLength || bytes.byteLength > MAX_AVATAR_BYTES) return null

  try {
    await container.media.put(AVATAR_KEY, bytes, contentType)
  } catch {
    return null
  }

  return { key: AVATAR_KEY, contentType }
}

export async function getStoredProfilePicture(container) {
  if (!container?.media) return null

  try {
    return await container.media.get(AVATAR_KEY)
  } catch {
    return null
  }
}
