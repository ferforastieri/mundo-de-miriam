import { badRequest, notFound } from '../../http/errors.js'
import { toScreen } from '../../mappers/screen.mapper.js'
import { bytesToBase64Url } from '../../services/password.js'
import { expiryFromDays, nowIso } from '../../utils/dates.js'
import { screenUpdatePayload } from './screen-payload.js'

const MAX_DAYS = 3650

function resolveExpiry(expiresInDays) {
  if (expiresInDays === undefined || expiresInDays === null || expiresInDays === '') {
    return null
  }

  const days = Number(expiresInDays)

  if (days === 0) return null
  if (!Number.isFinite(days) || days < 1 || days > MAX_DAYS) {
    throw badRequest('invalid_expiry', 'A validade deve ser "para sempre" ou entre 1 e 3650 dias.')
  }

  return expiryFromDays(days)
}

/**
 * Gera (ou reaproveita) o link privado de uma tela e define a validade.
 * "rotate" força um token novo, invalidando o link anterior.
 */
export async function shareScreen(container, screenId, { expiresInDays, rotate = false } = {}) {
  const screen = await container.screens.findById(screenId)

  if (!screen) {
    throw notFound('Tela não encontrada.')
  }

  const token =
    rotate || !screen.share_token
      ? bytesToBase64Url(crypto.getRandomValues(new Uint8Array(12)))
      : screen.share_token

  await container.screens.update(
    screenId,
    screenUpdatePayload(screen, {
      shareToken: token,
      expiresAt: resolveExpiry(expiresInDays),
      updatedAt: nowIso()
    })
  )

  const updated = await container.screens.findById(screenId)

  return {
    ...toScreen(updated),
    shareToken: updated.share_token,
    expiresAt: updated.expires_at
  }
}
