import { createAdminUsersRepository } from './admin-users.repository.js'
import { createSessionsRepository } from './sessions.repository.js'
import { createLoginAttemptsRepository } from './login-attempts.repository.js'
import { createScreensRepository } from './screens.repository.js'
import { createGroupsRepository } from './groups.repository.js'
import { createPhotosRepository } from './photos.repository.js'
import { createInstagramRepository } from './instagram.repository.js'
import { createMediaRepository } from './media.repository.js'

export function createContainer(env) {
  return {
    env,
    adminUsers: createAdminUsersRepository(env.DB),
    sessions: createSessionsRepository(env.DB),
    loginAttempts: createLoginAttemptsRepository(env.DB),
    screens: createScreensRepository(env.DB),
    groups: createGroupsRepository(env.DB),
    photos: createPhotosRepository(env.DB),
    instagram: createInstagramRepository(env.DB),
    media: createMediaRepository(env.MEDIA)
  }
}
