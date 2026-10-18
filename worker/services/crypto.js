import { AppError } from '../http/errors.js'
import { base64ToBytes, bytesToBase64 } from './password.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

async function importKey(rawKeyBase64) {
  const keyBytes = base64ToBytes(rawKeyBase64 || '')

  if (keyBytes.length !== 32) {
    throw new AppError(
      500,
      'encryption_key_missing',
      'A chave de criptografia do Instagram não está configurada no Worker.'
    )
  }

  return crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt', 'decrypt'])
}

export async function encryptSecret(env, plaintext) {
  const key = await importKey(env.TOKEN_ENCRYPTION_KEY)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  )

  return {
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    iv: bytesToBase64(iv)
  }
}

export async function decryptSecret(env, ciphertext, iv) {
  if (!ciphertext || !iv) return null

  const key = await importKey(env.TOKEN_ENCRYPTION_KEY)
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(iv) },
    key,
    base64ToBytes(ciphertext)
  )

  return decoder.decode(plaintext)
}
