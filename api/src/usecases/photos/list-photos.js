import { badRequest, notFound } from '../../http/errors.js'
import { toAdminPhoto } from '../../mappers/photo.mapper.js'
import { toGroup, toScreen } from '../../mappers/screen.mapper.js'
import { paginationMeta, parsePagination } from '../../utils/pagination.js'

export async function listPhotos(container, { screenId, groupId = null, page = 1, pageSize = 24 } = {}) {
  if (!screenId) {
    throw badRequest('screen_required', 'Informe a tela para listar as fotos.')
  }

  const screen = await container.screens.findById(screenId)

  if (!screen) {
    throw notFound('Tela não encontrada.')
  }

  const pagination = parsePagination({ page, pageSize }, { defaultSize: 24 })
  const groups = await container.groups.listByScreen(screenId)
  const [total, photos] = await Promise.all([
    container.photos.countByScreen(screenId, { groupId: groupId || undefined }),
    container.photos.listByScreen(screenId, {
      groupId: groupId || undefined,
      includeHidden: true,
      limit: pagination.pageSize,
      offset: pagination.offset
    })
  ])

  return {
    screen: toScreen(screen),
    groups: groups.map(toGroup),
    photos: photos.map((photo) => toAdminPhoto(photo)),
    pagination: paginationMeta({ ...pagination, total })
  }
}
