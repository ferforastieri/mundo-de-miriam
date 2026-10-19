const CONTENT_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov'
}

function asBytes(value) {
  if (value instanceof Uint8Array) return value
  if (value instanceof ArrayBuffer) return new Uint8Array(value)
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
  }
  return null
}

function matches(bytes, offset, signature) {
  if (bytes.length < offset + signature.length) return false
  return signature.every((byte, index) => bytes[offset + index] === byte)
}

const ascii = (value) => [...value].map((character) => character.charCodeAt(0))

export function detectImageContentType(value) {
  const bytes = asBytes(value)
  if (!bytes || bytes.length < 12) return null

  if (matches(bytes, 0, [0xff, 0xd8, 0xff])) {
    return 'image/jpeg'
  }

  if (matches(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png'
  }

  if (
    matches(bytes, 0, ascii('GIF87a')) ||
    matches(bytes, 0, ascii('GIF89a'))
  ) {
    return 'image/gif'
  }

  if (matches(bytes, 0, ascii('RIFF')) && matches(bytes, 8, ascii('WEBP'))) {
    return 'image/webp'
  }

  if (
    matches(bytes, 4, ascii('ftyp')) &&
    (matches(bytes, 8, ascii('avif')) || matches(bytes, 8, ascii('avis')))
  ) {
    return 'image/avif'
  }

  return null
}

export function extensionForContentType(contentType) {
  return CONTENT_TYPES[contentType] || null
}

export function detectVideoContentType(value) {
  const bytes = asBytes(value)
  if (!bytes || bytes.length < 12) return null

  if (matches(bytes, 4, ascii('ftyp'))) {
    const brand = String.fromCharCode(...bytes.slice(8, 12))
    return brand === 'qt  ' ? 'video/quicktime' : 'video/mp4'
  }

  if (matches(bytes, 0, [0x1a, 0x45, 0xdf, 0xa3])) {
    return 'video/webm'
  }

  return null
}

/** Detecta imagem ou vídeo pelo conteúdo (magic bytes). */
export function detectMediaContentType(value) {
  return detectImageContentType(value) || detectVideoContentType(value)
}
