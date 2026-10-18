import { timingSafeEqual } from 'node:crypto'
import { PBKDF2_ITERATIONS } from '../config.js'

const encoder = new TextEncoder()

export function bytesToBase64(bytes) {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

export function base64ToBytes(value) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export function bytesToBase64Url(bytes) {
  return bytesToBase64(bytes).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

export async function hashPassword(password, options = {}) {
  const iterations = options.iterations || PBKDF2_ITERATIONS
  const salt = options.salt
    ? base64ToBytes(options.salt)
    : crypto.getRandomValues(new Uint8Array(16))

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  )

  return {
    hash: bytesToBase64(new Uint8Array(bits)),
    salt: bytesToBase64(salt),
    iterations
  }
}

export async function verifyPassword(password, storedUser) {
  const candidate = await hashPassword(password, {
    salt: storedUser.password_salt,
    iterations: Number(storedUser.password_iterations)
  })

  const candidateBytes = base64ToBytes(candidate.hash)
  const storedBytes = base64ToBytes(storedUser.password_hash)

  if (candidateBytes.length !== storedBytes.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(candidateBytes), Buffer.from(storedBytes))
}
