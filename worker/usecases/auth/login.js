import {
  LOGIN_MAX_FAILURES,
  LOGIN_WINDOW_MINUTES,
  SESSION_TTL_SECONDS
} from '../../config.js'
import { AppError, tooManyRequests } from '../../http/errors.js'
import { verifyPassword } from '../../services/password.js'
import { createSessionToken } from '../../services/session-token.js'
import { addSecondsIso, isoDaysAgo, isoMinutesAgo, nowIso } from '../../utils/dates.js'

// Hash fixo usado para equalizar o tempo de resposta quando o e-mail não existe.
const DUMMY_USER = {
  password_hash: 'oCzbKaw/Pmry6UERRHnDJgHhmsg3FufEYv2IkJDGH6c=',
  password_salt: '8rJX0n0v9m3sT5cB2hQ1xw==',
  password_iterations: 210_000
}

export async function login(container, { email, password, ip, userAgent }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const rawPassword = String(password || '')

  if (!normalizedEmail || !rawPassword) {
    throw new AppError(400, 'validation_error', 'Informe e-mail e senha.')
  }

  const failureCount = await container.loginAttempts.countFailuresSince(
    ip,
    isoMinutesAgo(LOGIN_WINDOW_MINUTES)
  )

  if (failureCount >= LOGIN_MAX_FAILURES) {
    throw tooManyRequests(
      `Muitas tentativas de login. Tente novamente em ${LOGIN_WINDOW_MINUTES} minutos.`,
      LOGIN_WINDOW_MINUTES * 60
    )
  }

  const now = nowIso()
  const user = await container.adminUsers.findByEmail(normalizedEmail)
  const passwordMatches = await verifyPassword(rawPassword, user || DUMMY_USER)

  if (!user || !passwordMatches) {
    await container.loginAttempts.record({
      ip,
      email: normalizedEmail,
      success: false,
      createdAt: now
    })

    throw new AppError(401, 'invalid_credentials', 'E-mail ou senha incorretos.')
  }

  await container.loginAttempts.record({
    ip,
    email: normalizedEmail,
    success: true,
    createdAt: now
  })
  await container.loginAttempts.deleteOlderThan(isoDaysAgo(7))
  await container.sessions.deleteExpired(now)
  await container.adminUsers.touchLastLogin(user.id, now)

  const { token, hash } = await createSessionToken()
  const expiresAt = addSecondsIso(SESSION_TTL_SECONDS)

  await container.sessions.create({
    id: crypto.randomUUID(),
    tokenHash: hash,
    adminUserId: user.id,
    createdAt: now,
    expiresAt,
    ip,
    userAgent: userAgent || null
  })

  return {
    token,
    expiresAt,
    admin: {
      id: user.id,
      email: user.email
    }
  }
}
