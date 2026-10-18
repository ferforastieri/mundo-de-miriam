import { conflict, notFound } from '../../http/errors.js'

export async function deleteGroup(container, groupId) {
  const group = await container.groups.findById(groupId)

  if (!group) {
    throw notFound('Grupo não encontrado.')
  }

  const photoCount = await container.groups.countPhotos(groupId)

  if (photoCount > 0) {
    throw conflict(
      'group_not_empty',
      'Mova ou exclua as fotos deste grupo antes de removê-lo.'
    )
  }

  await container.groups.remove(groupId)
  return { deleted: true }
}
