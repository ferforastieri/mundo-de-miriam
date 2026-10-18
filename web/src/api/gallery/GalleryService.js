import { http } from '../http/HttpClient.js'

class GalleryService {
  getGallery() {
    return http.get('/api/public/gallery')
  }

  getInstagramStats() {
    return http.get('/api/instagram/stats')
  }

  getAlbum(token) {
    return http.get(`/api/public/albums/${encodeURIComponent(token)}`)
  }
}

export default new GalleryService()
