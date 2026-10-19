import { MAX_SCREEN_CATEGORY, MAX_SCREEN_LABEL, SCREEN_ICONS } from '../../config.js'
import { badRequest, conflict } from '../../http/errors.js'
import { toScreen } from '../../mappers/screen.mapper.js'
import { nowIso } from '../../utils/dates.js'
import { slugify } from '../../utils/slug.js'

const KINDS = ['gallery', 'partnerships', 'single']
const MAX_NAME = 80
const MAX_DESCRIPTION = 240

export async function createScreen(container, {
  name,
  id,
  description = '',
  kind = 'gallery',
  visible = true,
  sortOrder,
  menuLabel,
  menuCategory = '',
  icon = 'image'
}) {
  const cleanName = String(name || '').trim()
  const cleanDescription = String(description || '').trim()

  if (!cleanName || cleanName.length > MAX_NAME) {
    throw badRequest('invalid_name', `O nome deve ter entre 1 e ${MAX_NAME} caracteres.`)
  }

  if (cleanDescription.length > MAX_DESCRIPTION) {
    throw badRequest('invalid_description', `A descrição deve ter no máximo ${MAX_DESCRIPTION} caracteres.`)
  }

  if (!KINDS.includes(kind)) {
    throw badRequest('invalid_kind', 'Tipo de tela inválido.')
  }

  const cleanLabel = menuLabel === undefined ? cleanName : String(menuLabel).trim()

  if (!cleanLabel || cleanLabel.length > MAX_SCREEN_LABEL) {
    throw badRequest(
      'invalid_menu_label',
      `O rótulo do menu deve ter entre 1 e ${MAX_SCREEN_LABEL} caracteres.`
    )
  }

  const cleanCategory = String(menuCategory || '').trim()

  if (cleanCategory.length > MAX_SCREEN_CATEGORY) {
    throw badRequest(
      'invalid_menu_category',
      `A categoria do menu deve ter no máximo ${MAX_SCREEN_CATEGORY} caracteres.`
    )
  }

  const iconKey = String(icon || 'image')

  if (!SCREEN_ICONS.includes(iconKey)) {
    throw badRequest('invalid_icon', 'Ícone inválido.')
  }

  const screenId = String(id || slugify(cleanName, 'tela')).trim()

  if (!/^[a-z0-9][a-z0-9-]{1,59}$/.test(screenId)) {
    throw badRequest(
      'invalid_id',
      'O identificador deve ter de 2 a 60 caracteres: letras minúsculas, números e hífen.'
    )
  }

  const existing = await container.screens.findById(screenId)

  if (existing) {
    throw conflict('screen_exists', 'Já existe uma tela com esse identificador.')
  }

  const screens = await container.screens.listAll()
  const maxOrder = screens.reduce((max, screen) => Math.max(max, Number(screen.sort_order || 0)), 0)
  const order = Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : maxOrder + 10
  const now = nowIso()

  await container.screens.create({
    id: screenId,
    name: cleanName,
    description: cleanDescription,
    kind,
    sortOrder: order,
    isVisible: visible ? 1 : 0,
    menuLabel: cleanLabel,
    menuCategory: cleanCategory,
    icon: iconKey,
    createdAt: now
  })

  const created = await container.screens.findById(screenId)
  return toScreen(created)
}
