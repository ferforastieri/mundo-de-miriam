import { bytesToBase64Url } from './password.js'

const encoder = new TextEncoder()

export async function hashSessionToken(token) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(token))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function createSessionToken() {
  const token = bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32)))
  return {
    token,
    hash: await hashSessionToken(token)
  }
}
