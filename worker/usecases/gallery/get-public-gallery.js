import { toPublicPhoto } from '../../mappers/photo.mapper.js'
import { toGroup, toScreen } from '../../mappers/screen.mapper.js'

export async function getPublicGallery(container) {
  const [screens, groups, photos] = await Promise.all([
    container.screens.listVisible(),
    container.groups.listAll(),
    container.photos.listAllVisible()
  ])

  return {
    screens: screens.map((screen) => {
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
    }),
    generatedAt: new Date().toISOString()
  }
}
