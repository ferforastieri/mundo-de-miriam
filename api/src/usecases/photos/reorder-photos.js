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

  const currentIds = photos.map((photo) => photo.id).sort()
  const nextIds = [...new Set((orderedIds || []).map(String))].sort()

  if (
    currentIds.length !== nextIds.length ||
    currentIds.some((id, index) => id !== nextIds[index])
  ) {
    throw badRequest('invalid_order', 'A ordem enviada não corresponde às fotos desta tela.')
  }

  await container.photos.reorder(orderedIds.map(String), nowIso())

  return { reordered: true }
}
