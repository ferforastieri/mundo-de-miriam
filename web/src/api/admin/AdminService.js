import { http } from '../http/HttpClient.js'

function queryString(params) {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  }

  const result = query.toString()
  return result ? `?${result}` : ''
}

class AdminService {
  login(email, password) {
    return http.post('/api/admin/auth/login', { email, password })
  }

  logout() {
    return http.post('/api/admin/auth/logout')
  }

  me() {
    return http.get('/api/admin/auth/me')
  }

  changePassword(currentPassword, newPassword) {
    return http.post('/api/admin/auth/password', { currentPassword, newPassword })
  }

  getDashboard() {
    return http.get('/api/admin/dashboard')
  }

  getScreens() {
    return http.get('/api/admin/screens')
  }

  deleteScreen(screenId) {
    return http.delete(`/api/admin/screens/${encodeURIComponent(screenId)}`)
  }

  createScreen(payload) {
    return http.post('/api/admin/screens', payload)
  }

  updateScreen(screenId, patch) {
    return http.patch(`/api/admin/screens/${encodeURIComponent(screenId)}`, patch)
  }

  createGroup(screenId, name) {
    return http.post(`/api/admin/screens/${encodeURIComponent(screenId)}/groups`, { name })
  }

  updateGroup(groupId, patch) {
    return http.patch(`/api/admin/groups/${encodeURIComponent(groupId)}`, patch)
  }

  deleteGroup(groupId) {
    return http.delete(`/api/admin/groups/${encodeURIComponent(groupId)}`)
  }

  reorderGroups(screenId, orderedIds) {
    return http.patch(`/api/admin/screens/${encodeURIComponent(screenId)}/groups/reorder`, {
      orderedIds
    })
  }

  getPhotos(screenId, groupId = null) {
    return http.get(`/api/admin/photos${queryString({ screenId, groupId })}`)
  }

  uploadPhoto({ screenId, groupId, file, alt = '', caption = '' }) {
    return http.upload(
      `/api/admin/photos/upload${queryString({
        screenId,
        groupId,
        fileName: file.name,
        alt,
        caption
      })}`,
      file
    )
  }

  updatePhoto(photoId, patch) {
    return http.patch(`/api/admin/photos/${encodeURIComponent(photoId)}`, patch)
  }

  replacePhotoFile(photoId, file) {
    return http.upload(`/api/admin/photos/${encodeURIComponent(photoId)}/file`, file)
  }

  deletePhoto(photoId) {
    return http.delete(`/api/admin/photos/${encodeURIComponent(photoId)}`)
  }

  reorderPhotos({ screenId, groupId = null, orderedIds }) {
    return http.patch('/api/admin/photos/reorder', { screenId, groupId, orderedIds })
  }

  getInstagram() {
    return http.get('/api/admin/instagram')
  }

  refreshInstagram() {
    return http.post('/api/admin/instagram/refresh')
  }

  saveInstagramToken(token) {
    return http.put('/api/admin/instagram/token', { token })
  }

  deleteInstagramToken() {
    return http.delete('/api/admin/instagram/token')
  }

  publishToInstagram(photoIds, caption) {
    return http.post('/api/admin/instagram/publish', { photoIds, caption })
  }

  shareScreen(screenId, payload = {}) {
    return http.post(`/api/admin/screens/${encodeURIComponent(screenId)}/share`, payload)
  }

  revokeScreenShare(screenId) {
    return http.delete(`/api/admin/screens/${encodeURIComponent(screenId)}/share`)
  }
}

export default new AdminService()
