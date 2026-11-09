import { decryptSecret } from '../../services/crypto.js'
import { fetchProfile } from '../../services/instagram-api.js'
import { getStoredProfilePicture, storeProfilePicture } from './profile-picture.js'

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

/**
 * Entrega a foto de perfil do Instagram a partir do cache no R2.
 * Se ainda não houver cache, busca a URL atual e tenta baixá-la.
 */
export async function serveInstagramAvatar(container, reply) {
  let object = await getStoredProfilePicture(container)

  if (!object) {
    const state = await container.instagram.getState()
    const url = await resolveProfilePictureUrl(container, state)

    await storeProfilePicture(container, url)
    object = await getStoredProfilePicture(container)
  }

  if (!object) {
    return reply.code(404).send({
      error: {
        code: 'avatar_unavailable',
        message: 'Foto de perfil do Instagram indisponível.'
      }
    })
  }

  const bytes = await object.arrayBuffer()
  const contentType = object.httpMetadata?.contentType || 'image/jpeg'

  return reply
    .header('content-type', contentType)
    .header('cache-control', 'private, max-age=1800')
    .send(Buffer.from(bytes))
}
