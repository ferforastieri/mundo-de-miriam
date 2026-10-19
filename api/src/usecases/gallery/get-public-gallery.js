import { buildPublicScreen } from './build-public-screen.js'

export async function getPublicGallery(container) {
  const [screens, groups, photos] = await Promise.all([
    container.screens.listVisible(),
    container.groups.listAll(),
    container.photos.listAllVisible()
  ])

  return {
    screens: screens.map((screen) => buildPublicScreen(screen, groups, photos)),
    generatedAt: new Date().toISOString()
  }
}
