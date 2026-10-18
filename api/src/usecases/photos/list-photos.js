import { badRequest, notFound } from '../../http/errors.js'
import { toAdminPhoto } from '../../mappers/photo.mapper.js'
import { toGroup, toScreen } from '../../mappers/screen.mapper.js'

export async function listPhotos(container, { screenId, groupId = null } = {}) {
  if (!screenId) {
    throw badRequest('screen_required', 'Informe a tela para listar as fotos.')
  }

  const screen = await container.screens.findById(screenId)

  if (!screen) {
    throw notFound('Tela não encontrada.')
  }

  const groups = await container.groups.listByScreen(screenId)
  const photos = await container.photos.listByScreen(screenId, {
    groupId: groupId || undefined,
    includeHidden: true
  })

  return {
    screen: toScreen(screen),
    groups: groups.map(toGroup),
    photos: photos.map((photo) => toAdminPhoto(photo))
  }
}
