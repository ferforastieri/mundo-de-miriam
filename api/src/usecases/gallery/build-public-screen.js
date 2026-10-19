import { toPublicPhoto } from '../../mappers/photo.mapper.js'
import { toGroup, toScreen } from '../../mappers/screen.mapper.js'

/**
 * Monta a tela pública (com fotos ou grupos) a partir das linhas do banco.
 * Usado tanto pela galeria pública quanto pelos links privados.
 */
export function buildPublicScreen(screen, groups, photos) {
  const screenGroups = groups.filter((group) => group.screen_id === screen.id)
  const screenPhotos = photos.filter((photo) => photo.screen_id === screen.id)

  if (screen.kind === 'partnerships') {
    return {
      ...toScreen(screen),
      photos: [],
      groups: screenGroups.map((group) => ({
        ...toGroup(group),
        photos: screenPhotos
          .filter((photo) => photo.group_id === group.id)
          .map(toPublicPhoto)
      }))
    }
  }

  return {
    ...toScreen(screen),
    groups: [],
    photos: screenPhotos.map(toPublicPhoto)
  }
}
