import { SCREEN_ICONS } from '../config.js'
import { getContainer } from '../context.js'
import { requireAdmin } from '../http/guards.js'
import { createGroup } from '../usecases/screens/create-group.js'
import { createScreen } from '../usecases/screens/create-screen.js'
import { deleteScreen } from '../usecases/screens/delete-screen.js'
import { deleteGroup } from '../usecases/screens/delete-group.js'
import { listScreens } from '../usecases/screens/list-screens.js'
import { reorderGroups } from '../usecases/screens/reorder-groups.js'
import { revokeScreenShare } from '../usecases/screens/revoke-screen-share.js'
import { shareScreen } from '../usecases/screens/share-screen.js'
import { updateGroup } from '../usecases/screens/update-group.js'
import { updateScreen } from '../usecases/screens/update-screen.js'

const screenIdParams = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 60 }
  }
}

const updateScreenSchema = {
  params: screenIdParams,
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: { type: 'string', maxLength: 80 },
      description: { type: 'string', maxLength: 240 },
      sortOrder: { type: 'integer', minimum: 0, maximum: 9999 },
      visible: { type: 'boolean' },
      menuLabel: { type: 'string', minLength: 1, maxLength: 24 },
      menuCategory: { type: 'string', maxLength: 24 },
      icon: { type: 'string', enum: SCREEN_ICONS }
    }
  }
}

const createScreenSchema = {
  body: {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 80 },
      id: { type: 'string', minLength: 2, maxLength: 60 },
      description: { type: 'string', maxLength: 240 },
      kind: { type: 'string', enum: ['gallery', 'partnerships', 'single'] },
      visible: { type: 'boolean' },
      sortOrder: { type: 'integer', minimum: 0, maximum: 9999 },
      menuLabel: { type: 'string', minLength: 1, maxLength: 24 },
      menuCategory: { type: 'string', maxLength: 24 },
      icon: { type: 'string', enum: SCREEN_ICONS }
    }
  }
}

const shareScreenSchema = {
  params: screenIdParams,
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      expiresInDays: { type: ['integer', 'null'], minimum: 0, maximum: 3650 },
      rotate: { type: 'boolean' }
    }
  }
}

const createGroupSchema = {
  params: screenIdParams,
  body: {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 60 }
    }
  }
}

const updateGroupSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', minLength: 1, maxLength: 60 }
    }
  },
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: { type: 'string', maxLength: 60 },
      sortOrder: { type: 'integer', minimum: 0, maximum: 9999 }
    }
  }
}

const reorderGroupsSchema = {
  params: screenIdParams,
  body: {
    type: 'object',
    required: ['orderedIds'],
    additionalProperties: false,
    properties: {
      orderedIds: {
        type: 'array',
        minItems: 0,
        items: { type: 'string', minLength: 1, maxLength: 60 }
      }
    }
  }
}

export function registerScreensRoutes(app) {
  app.get('/api/admin/screens', { preHandler: requireAdmin }, async () => {
    return { screens: await listScreens(getContainer()) }
  })

  app.post(
    '/api/admin/screens',
    { preHandler: requireAdmin, schema: createScreenSchema },
    async (request) => {
      return createScreen(getContainer(), request.body)
    }
  )

  app.delete(
    '/api/admin/screens/:id',
    { preHandler: requireAdmin, schema: { params: screenIdParams } },
    async (request) => {
      return deleteScreen(getContainer(), request.params.id)
    }
  )

  app.post(
    '/api/admin/screens/:id/share',
    { preHandler: requireAdmin, schema: shareScreenSchema },
    async (request) => {
      return shareScreen(getContainer(), request.params.id, request.body || {})
    }
  )

  app.delete(
    '/api/admin/screens/:id/share',
    { preHandler: requireAdmin, schema: { params: screenIdParams } },
    async (request) => {
      return revokeScreenShare(getContainer(), request.params.id)
    }
  )

  app.patch(
    '/api/admin/screens/:id',
    { preHandler: requireAdmin, schema: updateScreenSchema },
    async (request) => {
      return updateScreen(getContainer(), request.params.id, request.body)
    }
  )

  app.post(
    '/api/admin/screens/:id/groups',
    { preHandler: requireAdmin, schema: createGroupSchema },
    async (request) => {
      return createGroup(getContainer(), request.params.id, request.body)
    }
  )

  app.patch(
    '/api/admin/screens/:id/groups/reorder',
    { preHandler: requireAdmin, schema: reorderGroupsSchema },
    async (request) => {
      return reorderGroups(getContainer(), request.params.id, request.body.orderedIds)
    }
  )

  app.patch(
    '/api/admin/groups/:id',
    { preHandler: requireAdmin, schema: updateGroupSchema },
    async (request) => {
      return updateGroup(getContainer(), request.params.id, request.body)
    }
  )

  app.delete('/api/admin/groups/:id', { preHandler: requireAdmin }, async (request) => {
    return deleteGroup(getContainer(), request.params.id)
  })
}
