import { MAX_SCREEN_CATEGORY, MAX_SCREEN_LABEL, SCREEN_ICONS } from '../../config.js'
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
  const menuLabel =
    patch.menuLabel === undefined ? current.menu_label : String(patch.menuLabel).trim()
  const menuCategory =
    patch.menuCategory === undefined
      ? current.menu_category
      : String(patch.menuCategory).trim()
  const icon = patch.icon === undefined ? current.icon : String(patch.icon)

  if (!name || name.length > MAX_NAME_LENGTH) {
    throw badRequest('invalid_name', `O nome deve ter entre 1 e ${MAX_NAME_LENGTH} caracteres.`)
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    throw badRequest('invalid_description', `A descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`)
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0 || sortOrder > 9999) {
    throw badRequest('invalid_position', 'Posição inválida.')
  }

  if (!menuLabel || menuLabel.length > MAX_SCREEN_LABEL) {
    throw badRequest(
      'invalid_menu_label',
      `O rótulo do menu deve ter entre 1 e ${MAX_SCREEN_LABEL} caracteres.`
    )
  }

  if (menuCategory.length > MAX_SCREEN_CATEGORY) {
    throw badRequest(
      'invalid_menu_category',
      `A categoria do menu deve ter no máximo ${MAX_SCREEN_CATEGORY} caracteres.`
    )
  }

  if (!SCREEN_ICONS.includes(icon)) {
    throw badRequest('invalid_icon', 'Ícone inválido.')
  }

  await container.screens.update(screenId, {
    name,
    description,
    sortOrder,
    isVisible,
    menuLabel,
    menuCategory,
    icon,
    updatedAt: nowIso()
  })

  const updated = await container.screens.findById(screenId)
  return toScreen(updated)
}
