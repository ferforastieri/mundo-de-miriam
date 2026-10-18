export class AppError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export function badRequest(code, message, details = null) {
  return new AppError(400, code, message, details)
}

export function unauthorized(message = 'Sessão expirada. Faça login novamente.') {
  return new AppError(401, 'unauthorized', message)
}

export function forbidden(code, message) {
  return new AppError(403, code, message)
}

export function notFound(message = 'Registro não encontrado.') {
  return new AppError(404, 'not_found', message)
}

export function conflict(code, message) {
  return new AppError(409, code, message)
}

export function payloadTooLarge(message = 'Arquivo maior que o limite permitido.') {
  return new AppError(413, 'payload_too_large', message)
}

export function unsupportedMedia(message = 'Formato de arquivo não suportado.') {
  return new AppError(415, 'unsupported_media_type', message)
}

export function tooManyRequests(message, retryAfterSeconds) {
  const error = new AppError(429, 'rate_limited', message)
  error.retryAfterSeconds = retryAfterSeconds
  return error
}

export function toHttpError(error) {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      payload: {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {})
        }
      },
      retryAfterSeconds: error.retryAfterSeconds || null
    }
  }

  if (error?.validation) {
    return {
      statusCode: 400,
      payload: {
        error: {
          code: 'validation_error',
          message: 'Dados inválidos.',
          details: error.validation.map((item) => ({
            field: item.instancePath || item.params?.missingProperty || null,
            message: item.message
          }))
        }
      }
    }
  }

  if (error?.code === 'FST_ERR_CTP_BODY_TOO_LARGE') {
    return {
      statusCode: 413,
      payload: {
        error: {
          code: 'payload_too_large',
          message: 'Arquivo maior que o limite permitido.'
        }
      }
    }
  }

  if (error?.code === 'FST_ERR_CTP_INVALID_MEDIA_TYPE') {
    return {
      statusCode: 415,
      payload: {
        error: {
          code: 'unsupported_media_type',
          message: 'Formato de arquivo não suportado.'
        }
      }
    }
  }

  console.error('Erro não tratado na API:', error)
  return {
    statusCode: 500,
    payload: {
      error: {
        code: 'internal_error',
        message: 'Não foi possível concluir a operação.'
      }
    }
  }
}
