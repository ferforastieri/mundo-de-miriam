import { MAX_IMAGE_BYTES } from '../config.js'
import { getContainer } from '../context.js'
import { requireAdmin } from '../http/guards.js'
import { createAlbum } from '../usecases/albums/create-album.js'
import { deleteAlbum } from '../usecases/albums/delete-album.js'
import { deleteAlbumPhoto } from '../usecases/albums/delete-album-photo.js'
import { getAlbum } from '../usecases/albums/get-album.js'
import { getPublicAlbum } from '../usecases/albums/get-public-album.js'
import { listAlbums } from '../usecases/albums/list-albums.js'
import { reorderAlbumPhotos } from '../usecases/albums/reorder-album-photos.js'
import { updateAlbum } from '../usecases/albums/update-album.js'
import { updateAlbumPhoto } from '../usecases/albums/update-album-photo.js'
import { uploadAlbumPhoto } from '../usecases/albums/upload-album-photo.js'

const albumIdParams = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 80 }
  }
}

const createAlbumSchema = {
  body: {
    type: 'object',
    required: ['title'],
    additionalProperties: false,
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 120 },
      description: { type: 'string', maxLength: 500 },
      expiresInDays: { type: ['integer', 'null'], minimum: 0, maximum: 3650 }
    }
  }
}

const updateAlbumSchema = {
  params: albumIdParams,
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 120 },
      description: { type: 'string', maxLength: 500 },
      expiresInDays: { type: ['integer', 'null'], minimum: 0, maximum: 3650 }
    }
  }
}

const uploadSchema = {
  params: albumIdParams,
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      fileName: { type: 'string', maxLength: 200 },
      alt: { type: 'string', maxLength: 240 }
    }
  }
}

const reorderSchema = {
  params: albumIdParams,
  body: {
    type: 'object',
    required: ['orderedIds'],
    additionalProperties: false,
    properties: {
      orderedIds: {
        type: 'array',
        minItems: 0,
        items: { type: 'string', minLength: 1, maxLength: 80 }
      }
    }
  }
}

const photoParams = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 80 }
  }
}

const updatePhotoSchema = {
  params: photoParams,
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      alt: { type: 'string', maxLength: 240 }
    }
  }
}

const publicAlbumParams = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string', minLength: 8, maxLength: 64 }
  }
}

export function registerAlbumsRoutes(app) {
  app.get('/api/public/albums/:token', { schema: { params: publicAlbumParams } }, async (request, reply) => {
    reply.header('cache-control', 'private, max-age=0, must-revalidate')
    reply.header('x-robots-tag', 'noindex')
    return getPublicAlbum(getContainer(), request.params.token)
  })

  app.get('/api/admin/albums', { preHandler: requireAdmin }, async () => {
    return { albums: await listAlbums(getContainer()) }
  })

  app.post('/api/admin/albums', { preHandler: requireAdmin, schema: createAlbumSchema }, async (request) => {
    return createAlbum(getContainer(), request.body)
  })

  app.get('/api/admin/albums/:id', { preHandler: requireAdmin, schema: { params: albumIdParams } }, async (request) => {
    return getAlbum(getContainer(), request.params.id)
  })

  app.patch(
    '/api/admin/albums/:id',
    { preHandler: requireAdmin, schema: updateAlbumSchema },
    async (request) => {
      return updateAlbum(getContainer(), request.params.id, request.body)
    }
  )

  app.delete('/api/admin/albums/:id', { preHandler: requireAdmin, schema: { params: albumIdParams } }, async (request) => {
    return deleteAlbum(getContainer(), request.params.id)
  })

  app.post(
    '/api/admin/albums/:id/photos',
    {
      preHandler: requireAdmin,
      schema: uploadSchema,
      bodyLimit: MAX_IMAGE_BYTES
    },
    async (request) => {
      return uploadAlbumPhoto(getContainer(), {
        albumId: request.params.id,
        buffer: request.body,
        fileName: request.query.fileName || request.headers['x-file-name'] || 'imagem',
        alt: request.query.alt || ''
      })
    }
  )

  app.patch(
    '/api/admin/albums/:id/photos/reorder',
    { preHandler: requireAdmin, schema: reorderSchema },
    async (request) => {
      return reorderAlbumPhotos(getContainer(), request.params.id, request.body.orderedIds)
    }
  )

  app.patch(
    '/api/admin/album-photos/:id',
    { preHandler: requireAdmin, schema: updatePhotoSchema },
    async (request) => {
      return updateAlbumPhoto(getContainer(), request.params.id, request.body)
    }
  )

  app.delete(
    '/api/admin/album-photos/:id',
    { preHandler: requireAdmin, schema: { params: photoParams } },
    async (request) => {
      return deleteAlbumPhoto(getContainer(), request.params.id)
    }
  )
}
