class InstagramService {
  constructor() {
    this.accessToken = null
    this.userId = null
    this.apiVersion = 'v18.0'
    this.baseUrl = 'https://graph.instagram.com/v18.0'
  }

  async initialize(accessToken) {
    this.accessToken = accessToken
    const response = await fetch(`${this.baseUrl}/me?fields=id,username&access_token=${this.accessToken}`)
    const data = await response.json()
    this.userId = data.id
  }

  async getProfile() {
    if (!this.accessToken || !this.userId) {
      throw new Error('Instagram não está autenticado')
    }

    const fields = 'id,username,media_count,followers_count,follows_count'
    const response = await fetch(
      `${this.baseUrl}/${this.userId}?fields=${fields}&access_token=${this.accessToken}`
    )
    return await response.json()
  }

  async getRecentMedia() {
    if (!this.accessToken || !this.userId) {
      throw new Error('Instagram não está autenticado')
    }

    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,like_count,comments_count,timestamp'
    const response = await fetch(
      `${this.baseUrl}/${this.userId}/media?fields=${fields}&access_token=${this.accessToken}`
    )
    return await response.json()
  }

  async getEngagementRate(posts) {
    if (!posts || posts.length === 0) return 0

    const totalEngagement = posts.reduce((sum, post) => {
      return sum + (post.like_count || 0) + (post.comments_count || 0)
    }, 0)

    const averageEngagement = totalEngagement / posts.length
    const profile = await this.getProfile()
    const followerCount = profile.followers_count
    
    return (averageEngagement / followerCount) * 100
  }

  async authenticate() {
    return 'mock_access_token'
  }

  isAuthenticated() {
    return !!(this.accessToken && this.userId)
  }

  clearAuth() {
    this.accessToken = null
    this.userId = null
  }
}

const instagramService = new InstagramService()

export default instagramService
