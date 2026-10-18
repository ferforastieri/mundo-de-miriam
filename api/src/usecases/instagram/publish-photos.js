import { AppError, badRequest, notFound } from '../../http/errors.js'
import { decryptSecret } from '../../services/crypto.js'
import {
  createCarouselContainer,
  createCarouselItemContainer,
  createImageContainer,
  fetchContainerStatus,
  fetchMediaDetails,
  publishContainer
} from '../../services/instagram-api.js'
import { isoDaysAgo, nowIso } from '../../utils/dates.js'

const MAX_CAROUSEL_ITEMS = 10
const DAILY_PUBLISH_LIMIT = 25
const CONTAINER_ATTEMPTS = 12
const CONTAINER_INTERVAL_MS = 2000

function sanitizeMessage(message, token) {
  const clean = String(message || 'Erro desconhecido na API do Instagram.')
  return token ? clean.replaceAll(token, '[token]') : clean
}

async function waitForContainer(token, creationId) {
  for (let attempt = 0; attempt < CONTAINER_ATTEMPTS; attempt += 1) {
    const status = await fetchContainerStatus(token, creationId)

    if (status.status_code === 'FINISHED') return
    if (status.status_code === 'ERROR') {
      throw new Error(status.status || 'O Instagram não conseguiu processar a imagem.')
    }

    await new Promise((resolve) => setTimeout(resolve, CONTAINER_INTERVAL_MS))
  }

  throw new Error('O Instagram demorou demais para processar a publicação.')
}

export async function publishPhotos(container, { photoIds, caption = '', origin }) {
  const ids = [...new Set((photoIds || []).map(String).filter(Boolean))]

  if (ids.length === 0) {
    throw badRequest('no_photos', 'Selecione pelo menos uma foto para publicar.')
  }

  if (ids.length > MAX_CAROUSEL_ITEMS) {
    throw badRequest('too_many_photos', `O Instagram aceita no máximo ${MAX_CAROUSEL_ITEMS} fotos por carrossel.`)
  }

  const state = await container.instagram.getState()

  if (!state?.encrypted_token || !state?.token_iv) {
    throw badRequest('instagram_not_configured', 'Configure o token do Instagram antes de publicar.')
  }

  const publishedLast24h = await container.instagram.countPublicationsSince(isoDaysAgo(1))

  if (publishedLast24h >= DAILY_PUBLISH_LIMIT) {
    throw new AppError(
      429,
      'publish_limit',
      `Limite de ${DAILY_PUBLISH_LIMIT} publicações por dia atingido. Tente novamente amanhã.`
    )
  }

  const token = await decryptSecret(container.env, state.encrypted_token, state.token_iv)
  const userId = state.instagram_user_id || container.env.INSTAGRAM_USER_ID

  const photos = []

  for (const photoId of ids) {
    const photo = await container.photos.findById(photoId)

    if (!photo) {
      throw notFound('Uma das fotos selecionadas não foi encontrada.')
    }

    if (photo.content_type !== 'image/jpeg') {
      throw badRequest(
        'invalid_format',
        `A foto “${photo.alt || photoId}” precisa estar em JPEG para ser publicada no Instagram.`
      )
    }

    photos.push(photo)
  }

  const publicationId = crypto.randomUUID()
  const createdAt = nowIso()
  const cleanCaption = String(caption || '').slice(0, 2200)

  try {
    const imageUrls = photos.map((photo) => `${origin}/media/${photo.storage_key}`)

    let creationId

    if (photos.length === 1) {
      creationId = await createImageContainer(token, userId, {
        imageUrl: imageUrls[0],
        caption: cleanCaption
      })
    } else {
      const itemIds = []

      for (const imageUrl of imageUrls) {
        itemIds.push(await createCarouselItemContainer(token, userId, { imageUrl }))
      }

      creationId = await createCarouselContainer(token, userId, {
        children: itemIds,
        caption: cleanCaption
      })
    }

    await waitForContainer(token, creationId)

    const published = await publishContainer(token, userId, creationId)
    let permalink = null

    if (published.id) {
      try {
        const details = await fetchMediaDetails(token, published.id)
        permalink = details.permalink || null
      } catch {
        permalink = null
      }
    }

    await container.instagram.insertPublication({
      id: publicationId,
      createdAt,
      publishedAt: nowIso(),
      status: 'published',
      caption: cleanCaption,
      igMediaId: published.id || null,
      permalink,
      photoIds: ids
    })

    return {
      ok: true,
      mediaId: published.id || null,
      permalink,
      count: photos.length
    }
  } catch (error) {
    const message = sanitizeMessage(error?.message, token)

    await container.instagram.insertPublication({
      id: publicationId,
      createdAt,
      status: 'failed',
      caption: cleanCaption,
      photoIds: ids,
      error: message
    })

    throw new AppError(502, 'publish_failed', `O Instagram recusou a publicação: ${message}`)
  }
}
