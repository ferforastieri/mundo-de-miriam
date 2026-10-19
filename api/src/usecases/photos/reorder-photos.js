import { badRequest, notFound } from '../../http/errors.js'
import { nowIso } from '../../utils/dates.js'

export async function reorderPhotos(container, { screenId, groupId = null, orderedIds }) {
  const screen = await container.screens.findById(screenId)

  if (!screen) {
    throw notFound('Tela não encontrada.')
  }

  if (screen.kind === 'partnerships' && !groupId) {
    throw badRequest('group_required', 'Escolha a marca/parceria para reordenar as fotos.')
  }

  if (screen.kind !== 'partnerships' && groupId) {
    throw badRequest('invalid_group', 'Esta tela não aceita grupos.')
  }

  const photos = await container.photos.listByScreen(screenId, {
    groupId: groupId || undefined,
    includeHidden: true
  })

  const byId = new Map(photos.map((photo) => [photo.id, photo]))
  const nextIds = [...new Set((orderedIds || []).map(String))]

  if (nextIds.length === 0 || nextIds.some((id) => !byId.has(id))) {
    throw badRequest('invalid_order', 'A ordem enviada não corresponde às fotos desta tela.')
  }

  // Cada página reordena apenas as suas fotos: reaproveitamos as posições
  // (sort_order) que elas já ocupavam, sem afetar as demais páginas.
  const slots = nextIds.map((id) => byId.get(id).sort_order).sort((a, b) => a - b)
  const updatedAt = nowIso()

  await Promise.all(
    nextIds.map((id, index) => container.photos.setSortOrder(id, slots[index], updatedAt))
  )

  return { reordered: true }
}
