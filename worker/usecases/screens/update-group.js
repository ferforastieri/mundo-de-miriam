import { badRequest, notFound } from '../../http/errors.js'
import { toGroup } from '../../mappers/screen.mapper.js'
import { nowIso } from '../../utils/dates.js'

const MAX_NAME_LENGTH = 60

export async function updateGroup(container, groupId, patch = {}) {
  const current = await container.groups.findById(groupId)

  if (!current) {
    throw notFound('Grupo não encontrado.')
  }

  const name = patch.name === undefined ? current.name : String(patch.name).trim()
  const sortOrder =
    patch.sortOrder === undefined ? current.sort_order : Number(patch.sortOrder)

  if (!name || name.length > MAX_NAME_LENGTH) {
    throw badRequest('invalid_name', `O nome do grupo deve ter entre 1 e ${MAX_NAME_LENGTH} caracteres.`)
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0 || sortOrder > 9999) {
    throw badRequest('invalid_position', 'Posição inválida.')
  }

  await container.groups.update(groupId, {
    name,
    sortOrder,
    updatedAt: nowIso()
  })

  const updated = await container.groups.findById(groupId)
  return toGroup(updated)
}
