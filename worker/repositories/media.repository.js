export function createMediaRepository(bucket) {
  return {
    async put(key, body, contentType) {
      await bucket.put(key, body, {
        httpMetadata: {
          contentType,
          cacheControl: 'public, max-age=31536000, immutable'
        }
      })
    },

    async get(key) {
      return bucket.get(key)
    },

    async head(key) {
      return bucket.head(key)
    },

    async remove(key) {
      await bucket.delete(key)
    }
  }
}
