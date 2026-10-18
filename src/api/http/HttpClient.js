const DEFAULT_ERROR_MESSAGE = 'Não foi possível concluir a operação.'

export class HttpError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message || DEFAULT_ERROR_MESSAGE)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.details = details
  }
}

async function parsePayload(response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }

  return response.text().catch(() => null)
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.headers || {})
    }
  })

  const payload = await parsePayload(response)

  if (!response.ok) {
    throw new HttpError(payload?.error?.message, {
      status: response.status,
      code: payload?.error?.code,
      details: payload?.error?.details
    })
  }

  return payload
}

class HttpClient {
  get(path) {
    return request(path)
  }

  post(path, body) {
    return request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {})
    })
  }

  put(path, body) {
    return request(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {})
    })
  }

  patch(path, body) {
    return request(path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {})
    })
  }

  delete(path) {
    return request(path, { method: 'DELETE' })
  }

  upload(path, file) {
    return request(path, {
      method: 'POST',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file
    })
  }
}

export const http = new HttpClient()
