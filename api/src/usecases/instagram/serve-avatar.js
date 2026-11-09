import { decryptSecret } from '../../services/crypto.js'
import { fetchProfile } from '../../services/instagram-api.js'
import { getStoredProfilePicture, storeProfilePicture } from './profile-picture.js'

const FETCH_TIMEOUT_MS = 10_000

async function resolveProfilePictureUrl(container, state) {
  let url = state?.profile_picture_url || null

  // A URL salva pode ter expirado. Se houver token, busca uma nova.
  if (!state?.encrypted_token || !state?.token_iv) return url

  try {
    const token = await decryptSecret(container.env, state.encrypted_token, state.token_iv)
    const profile = await fetchProfile(token)
    url = profile?.profile_picture_url || url
  } catch {
    // Mantém a URL anterior; o cache pode já cobrir o painel.
  }

  return url
}

async function downloadImage(url) {
  if (!url) return null

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })

    if (!response.ok) return null

    const contentType = response.headers.get('content-type') || 'image/jpeg'

    if (!contentType.startsWith('image/')) return null

    const bytes = Buffer.from(await response.arrayBuffer())

    if (!bytes.length) return null

    return { bytes, contentType }
  } catch {
    return null
  }
}

function sendImage(reply, image) {
  return reply
    .header('content-type', image.contentType)
    .header('cache-control', 'private, max-age=1800')
    .header('x-content-type-options', 'nosniff')
    .send(image.bytes)
}

/**
 * Entrega a foto de perfil do Instagram a partir do cache no R2.
 * Quando o cache não existe (ou o download para o R2 falha), buscamos a
 * imagem atual e devolvemos direto — assim o avatar não some só porque o
 * bucket recusou a gravação.
 */
export async function serveInstagramAvatar(container, reply) {
  const cached = await getStoredProfilePicture(container)

  if (cached) {
    try {
      return sendImage(reply, {
        bytes: Buffer.from(await cached.arrayBuffer()),
        contentType: cached.httpMetadata?.contentType || 'image/jpeg'
      })
    } catch {
      // Cache corrompido: segue para a busca da imagem atual.
    }
  }

  const state = await container.instagram.getState()
  const url = await resolveProfilePictureUrl(container, state)

  // Primeira tentativa: guardar no R2 para as próximas requisições.
  await storeProfilePicture(container, url)

  const stored = await getStoredProfilePicture(container)

  if (stored) {
    try {
      return sendImage(reply, {
        bytes: Buffer.from(await stored.arrayBuffer()),
        contentType: stored.httpMetadata?.contentType || 'image/jpeg'
      })
    } catch {
      // Segue para o download direto.
    }
  }

  const image = await downloadImage(url)

  if (image) return sendImage(reply, image)

  return reply
    .code(404)
    .header('cache-control', 'no-store')
    .send({
      error: {
        code: 'avatar_unavailable',
        message: 'Foto de perfil do Instagram indisponível.'
      }
    })
}
