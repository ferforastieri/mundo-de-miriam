import { badRequest, notFound } from '../../http/errors.js'
import { nowIso } from '../../utils/dates.js'

export async function reorderGroups(container, screenId, orderedIds) {
  const screen = await container.screens.findById(screenId)

  if (!screen) {
    throw notFound('Tela não encontrada.')
  }

  const groups = await container.groups.listByScreen(screenId)
  const currentIds = groups.map((group) => group.id).sort()
  const nextIds = [...new Set((orderedIds || []).map(String))].sort()

  if (
    currentIds.length !== nextIds.length ||
    currentIds.some((id, index) => id !== nextIds[index])
  ) {
    throw badRequest('invalid_order', 'A ordem enviada não corresponde aos grupos da tela.')
  }

  await container.groups.reorder(screenId, orderedIds.map(String), nowIso())
  return { reordered: true }
}
