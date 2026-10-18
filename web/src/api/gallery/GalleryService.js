import { http } from '../http/HttpClient.js'

class GalleryService {
  getGallery() {
    return http.get('/api/public/gallery')
  }

  getInstagramStats() {
    return http.get('/api/instagram/stats')
  }
}

export default new GalleryService()
