import { toAlbum } from '../../mappers/album.mapper.js'

export async function listAlbums(container) {
  const albums = await container.albums.listAll()
  return albums.map((album) => toAlbum(album))
}
