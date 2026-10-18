import { badRequest, notFound } from '../../http/errors.js'
import { toScreen } from '../../mappers/screen.mapper.js'
import { nowIso } from '../../utils/dates.js'

const MAX_NAME_LENGTH = 80
const MAX_DESCRIPTION_LENGTH = 240

export async function updateScreen(container, screenId, patch = {}) {
  const current = await container.screens.findById(screenId)

  if (!current) {
    throw notFound('Tela não encontrada.')
  }

  const name = patch.name === undefined ? current.name : String(patch.name).trim()
  const description =
    patch.description === undefined
      ? current.description || ''
      : String(patch.description).trim()
  const sortOrder =
    patch.sortOrder === undefined ? current.sort_order : Number(patch.sortOrder)
  const isVisible =
    patch.visible === undefined ? current.is_visible : patch.visible ? 1 : 0

  if (!name || name.length > MAX_NAME_LENGTH) {
    throw badRequest('invalid_name', `O nome deve ter entre 1 e ${MAX_NAME_LENGTH} caracteres.`)
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    throw badRequest('invalid_description', `A descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`)
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0 || sortOrder > 9999) {
    throw badRequest('invalid_position', 'Posição inválida.')
  }

  await container.screens.update(screenId, {
    name,
    description,
    sortOrder,
    isVisible,
    updatedAt: nowIso()
  })

  const updated = await container.screens.findById(screenId)
  return toScreen(updated)
}
