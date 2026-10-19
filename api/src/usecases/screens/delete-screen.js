import { notFound } from '../../http/errors.js'

/**
 * Exclui uma tela para sempre: remove os arquivos (fotos/vídeos) do R2 e
 * depois apaga a tela no banco — as fotos e os grupos saem junto (CASCADE).
 */
export async function deleteScreen(container, screenId) {
  const screen = await container.screens.findById(screenId)

  if (!screen) {
    throw notFound('Tela não encontrada.')
  }

  const photos = await container.photos.listByScreen(screenId)
  let freedBytes = 0
  let failedFiles = 0

  for (const photo of photos) {
    try {
      await container.media.remove(photo.storage_key)
      freedBytes += Number(photo.bytes || 0)
    } catch (error) {
      failedFiles += 1
      console.warn('Não foi possível remover o arquivo do R2:', error?.message || error)
    }
  }

  await container.screens.remove(screenId)

  return {
    deleted: true,
    photos: photos.length,
    freedBytes,
    failedFiles
  }
}
