import { notFound } from '../../http/errors.js'
import { isExpired } from '../../utils/dates.js'
import { buildPublicScreen } from './build-public-screen.js'

/** Tela acessada por link privado (/a/<token>). */
export async function getPublicScreen(container, token) {
  const screen = await container.screens.findByShareToken(String(token || ''))

  if (!screen) {
    throw notFound('Link não encontrado.')
  }

  if (screen.expires_at && isExpired(screen.expires_at)) {
    return {
      available: false,
      reason: 'expired',
      screen: {
        name: screen.name,
        expiresAt: screen.expires_at
      }
    }
  }

  const [groups, photos] = await Promise.all([
    container.groups.listAll(),
    container.photos.listAllVisible()
  ])

  return {
    available: true,
    screen: {
      ...buildPublicScreen(screen, groups, photos),
      expiresAt: screen.expires_at || null
    }
  }
}
