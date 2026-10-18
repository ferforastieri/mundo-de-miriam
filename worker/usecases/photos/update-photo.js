import { badRequest, notFound } from '../../http/errors.js'
import { toAdminPhoto } from '../../mappers/photo.mapper.js'
import { nowIso } from '../../utils/dates.js'
import { resolvePhotoScope } from './upload-photo.js'

async function promoteGroupFeatured(container, groupId) {
  if (!groupId) return

  const photos = await container.photos.listGroupPhotos(groupId, { includeHidden: false })

  if (photos.length === 0) return
  if (photos.some((photo) => photo.is_featured)) return

  await container.photos.setFeatured(photos[0].id, groupId, nowIso())
}

export async function updatePhoto(container, photoId, patch = {}) {
  const photo = await container.photos.findById(photoId)

  if (!photo) {
    throw notFound('Foto não encontrada.')
  }

  const targetScreenId = patch.screenId === undefined ? photo.screen_id : patch.screenId
  const targetGroupId =
    patch.groupId === undefined ? photo.group_id : patch.groupId || null

  const { screen, group } = await resolvePhotoScope(container, {
    screenId: targetScreenId,
    groupId: targetGroupId
  })

  const scopeChanged =
    screen.id !== photo.screen_id || (group?.id || null) !== (photo.group_id || null)

  const now = nowIso()
  const fields = { updated_at: now }

  if (patch.alt !== undefined) fields.alt = String(patch.alt).slice(0, 240)
  if (patch.caption !== undefined) fields.caption = String(patch.caption).slice(0, 400)

  if (scopeChanged) {
    fields.screen_id = screen.id
    fields.group_id = group?.id || null
    fields.is_featured = 0
    fields.sort_order =
      (await container.photos.maxSortOrder({
        screenId: screen.id,
        groupId: group?.id || null
      })) + 10
  }

  if (patch.visible !== undefined) {
    fields.is_visible = patch.visible ? 1 : 0

    if (!patch.visible && photo.is_featured) {
      fields.is_featured = 0
    }
  }

  if (patch.featured === false) {
    fields.is_featured = 0
  }

  if (screen.kind === 'single' && patch.visible === true) {
    fields.is_visible = 1
  }

  await container.photos.update(photoId, fields)

  if (patch.featured === true && group) {
    await container.photos.setFeatured(photoId, group.id, now)
  }

  if (screen.kind === 'single' && (patch.visible === true || scopeChanged)) {
    await container.photos.ensureSingleVisible(screen.id, photoId, now)
  }

  if (scopeChanged && photo.group_id) {
    await promoteGroupFeatured(container, photo.group_id)
  }

  if (patch.visible === false && photo.group_id) {
    await promoteGroupFeatured(container, photo.group_id)
  }
  const updated = await container.photos.findById(photoId)
  return toAdminPhoto(updated)
}

export function assertPhotoPatch(patch) {
  const allowed = ['alt', 'caption', 'screenId', 'groupId', 'visible', 'featured']
  const unknown = Object.keys(patch || {}).filter((key) => !allowed.includes(key))

  if (unknown.length > 0) {
    throw badRequest('invalid_patch', `Campos não permitidos: ${unknown.join(', ')}.`)
  }
}
