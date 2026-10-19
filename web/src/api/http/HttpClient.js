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

function uploadWithProgress(path, file, method = 'POST', onProgress = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, path, true)
    xhr.withCredentials = true
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        onProgress(event.loaded / event.total)
      }
    })

    xhr.addEventListener('load', () => {
      let payload = null

      try {
        payload = xhr.responseText ? JSON.parse(xhr.responseText) : null
      } catch {
        payload = xhr.responseText
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(payload)
        return
      }

      reject(
        new HttpError(payload?.error?.message, {
          status: xhr.status,
          code: payload?.error?.code,
          details: payload?.error?.details
        })
      )
    })

    xhr.addEventListener('error', () => {
      reject(new HttpError('Falha de rede ao enviar o arquivo.'))
    })

    xhr.addEventListener('abort', () => {
      reject(new HttpError('Envio cancelado.'))
    })

    xhr.send(file)
  })
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

  upload(path, file, method = 'POST', onProgress = null) {
    return uploadWithProgress(path, file, method, onProgress)
  }
}

export const http = new HttpClient()
