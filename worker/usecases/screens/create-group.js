import { badRequest, notFound } from '../../http/errors.js'
import { toGroup } from '../../mappers/screen.mapper.js'
import { nowIso } from '../../utils/dates.js'
import { slugify } from '../../utils/slug.js'

const MAX_NAME_LENGTH = 60

export async function createGroup(container, screenId, { name }) {
  const screen = await container.screens.findById(screenId)

  if (!screen) {
    throw notFound('Tela não encontrada.')
  }

  if (screen.kind !== 'partnerships') {
    throw badRequest('invalid_screen', 'Só é possível criar grupos em telas de parcerias.')
  }

  const cleanName = String(name || '').trim()

  if (!cleanName || cleanName.length > MAX_NAME_LENGTH) {
    throw badRequest('invalid_name', `O nome do grupo deve ter entre 1 e ${MAX_NAME_LENGTH} caracteres.`)
  }

  const existingGroups = await container.groups.listByScreen(screenId)
  const baseId = slugify(cleanName, 'grupo')
  let id = baseId
  let suffix = 2

  while (existingGroups.some((group) => group.id === id)) {
    id = `${baseId}-${suffix}`
    suffix += 1
  }

  const maxSortOrder = await container.groups.maxSortOrder(screenId)
  const createdAt = nowIso()

  await container.groups.create({
    id,
    screenId,
    name: cleanName,
    sortOrder: maxSortOrder + 10,
    createdAt
  })

  const created = await container.groups.findById(id)
  return toGroup(created)
}
