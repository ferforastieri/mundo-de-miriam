import { MAX_VIDEO_BYTES } from '../config.js'
import { getContainer } from '../context.js'
import { requireAdmin } from '../http/guards.js'
import { deletePhoto } from '../usecases/photos/delete-photo.js'
import { listPhotos } from '../usecases/photos/list-photos.js'
import { reorderPhotos } from '../usecases/photos/reorder-photos.js'
import { replacePhotoFile } from '../usecases/photos/replace-photo-file.js'
import {
  assertPhotoPatch,
  updatePhoto
} from '../usecases/photos/update-photo.js'
import { uploadPhoto } from '../usecases/photos/upload-photo.js'

const listQuerySchema = {
  querystring: {
    type: 'object',
    required: ['screenId'],
    additionalProperties: false,
    properties: {
      screenId: { type: 'string', minLength: 1, maxLength: 60 },
      groupId: { type: 'string', maxLength: 60 },
      page: { type: 'integer', minimum: 1 },
      pageSize: { type: 'integer', minimum: 1, maximum: 200 }
    }
  }
}

const uploadQuerySchema = {
  querystring: {
    type: 'object',
    required: ['screenId'],
    additionalProperties: false,
    properties: {
      screenId: { type: 'string', minLength: 1, maxLength: 60 },
      groupId: { type: 'string', maxLength: 60 },
      alt: { type: 'string', maxLength: 240 },
      caption: { type: 'string', maxLength: 400 },
      fileName: { type: 'string', maxLength: 200 }
    }
  }
}

const reorderBodySchema = {
  body: {
    type: 'object',
    required: ['screenId', 'orderedIds'],
    additionalProperties: false,
    properties: {
      screenId: { type: 'string', minLength: 1, maxLength: 60 },
      groupId: { type: ['string', 'null'], maxLength: 60 },
      orderedIds: {
        type: 'array',
        minItems: 0,
        items: { type: 'string', minLength: 1, maxLength: 80 }
      }
    }
  }
}

const updateBodySchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      alt: { type: 'string', maxLength: 240 },
      caption: { type: 'string', maxLength: 400 },
      screenId: { type: 'string', minLength: 1, maxLength: 60 },
      groupId: { type: ['string', 'null'], maxLength: 60 },
      visible: { type: 'boolean' },
      featured: { type: 'boolean' }
    }
  }
}

export function registerPhotosRoutes(app) {
  app.get('/api/admin/photos', { preHandler: requireAdmin, schema: listQuerySchema }, async (request) => {
    return listPhotos(getContainer(), {
      screenId: request.query.screenId,
      groupId: request.query.groupId || null,
      page: request.query.page,
      pageSize: request.query.pageSize
    })
  })

  app.post(
    '/api/admin/photos/upload',
    {
      preHandler: requireAdmin,
      schema: uploadQuerySchema,
      bodyLimit: MAX_VIDEO_BYTES
    },
    async (request) => {
      return uploadPhoto(getContainer(), {
        screenId: request.query.screenId,
        groupId: request.query.groupId || null,
        alt: request.query.alt || '',
        caption: request.query.caption || '',
        fileName: request.query.fileName || request.headers['x-file-name'] || 'imagem',
        buffer: request.body
      })
    }
  )

  app.patch(
    '/api/admin/photos/reorder',
    { preHandler: requireAdmin, schema: reorderBodySchema },
    async (request) => {
      return reorderPhotos(getContainer(), {
        screenId: request.body.screenId,
        groupId: request.body.groupId ?? null,
        orderedIds: request.body.orderedIds
      })
    }
  )

  app.patch(
    '/api/admin/photos/:id',
    { preHandler: requireAdmin, schema: updateBodySchema },
    async (request) => {
      assertPhotoPatch(request.body)
      return updatePhoto(getContainer(), request.params.id, request.body)
    }
  )

  app.put(
    '/api/admin/photos/:id/file',
    {
      preHandler: requireAdmin,
      bodyLimit: MAX_VIDEO_BYTES
    },
    async (request) => {
      return replacePhotoFile(getContainer(), request.params.id, {
        buffer: request.body,
        fileName: request.headers['x-file-name'] || 'imagem'
      })
    }
  )

  app.delete('/api/admin/photos/:id', { preHandler: requireAdmin }, async (request) => {
    return deletePhoto(getContainer(), request.params.id)
  })
}
