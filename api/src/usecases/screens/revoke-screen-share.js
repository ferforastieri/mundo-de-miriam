import { notFound } from '../../http/errors.js'
import { toScreen } from '../../mappers/screen.mapper.js'
import { nowIso } from '../../utils/dates.js'
import { screenUpdatePayload } from './screen-payload.js'

/** Remove o link privado de uma tela (o link antigo deixa de funcionar). */
export async function revokeScreenShare(container, screenId) {
  const screen = await container.screens.findById(screenId)

  if (!screen) {
    throw notFound('Tela não encontrada.')
  }

  await container.screens.update(
    screenId,
    screenUpdatePayload(screen, {
      shareToken: null,
      expiresAt: null,
      updatedAt: nowIso()
    })
  )

  const updated = await container.screens.findById(screenId)

  return {
    ...toScreen(updated),
    shareToken: null,
    expiresAt: null
  }
}
