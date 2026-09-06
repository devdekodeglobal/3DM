import {
  hashPassword,
  verifyPassword,
  createSession,
  setSessionCookie,
  checkRateLimit,
  getClientIp,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const ip = getClientIp(request)

    // Rate limit per IP: max 10 failed login attempts per 10 minutes (KK 06)
    const ipLimit = await checkRateLimit(env.DB, `login_ip:${ip}`, 10, 10 * 60)
    if (!ipLimit.allowed) {
      return jsonError('Too many login attempts. Please try again in 10 minutes.', 429)
    }

    const { email, password } = await request.json<{ email: string; password: string }>()

    if (!email || !password) return jsonError('Email and password are required')
    const normalizedEmail = email.trim().toLowerCase()

    // Rate limit per email: max 5 attempts per 10 minutes (KK 06)
    const emailLimit = await checkRateLimit(env.DB, `login_email:${normalizedEmail}`, 5, 10 * 60)
    if (!emailLimit.allowed) {
      return jsonError('Too many failed attempts on this account. Please try again later.', 429)
    }

    const user = await env.DB.prepare(
      'SELECT id, password_hash, email_verified FROM users WHERE email = ? AND password_hash IS NOT NULL'
    ).bind(normalizedEmail).first<{ id: string; password_hash: string; email_verified: number }>()

    if (!user) return jsonError('Invalid email or password', 401)

    // Verify password with PBKDF2 / legacy check (KK 01)
    const { valid, needsRehash } = await verifyPassword(password, user.password_hash)
    if (!valid) return jsonError('Invalid email or password', 401)

    // Transparent password migration: upgrade legacy SHA-256 hashes to PBKDF2 on successful login
    if (needsRehash) {
      try {
        const upgradedHash = await hashPassword(password)
        await env.DB.prepare(
          'UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?'
        ).bind(upgradedHash, user.id).run()
      } catch (rehashErr) {
        console.warn('Transparent password rehash failed:', rehashErr)
      }
    }

    if (!user.email_verified) {
      return jsonError('Please verify your email before signing in. Check your inbox for the OTP code.', 403)
    }

    const sessionId = await createSession(env.DB, user.id)

    return json(
      { message: 'Signed in successfully' },
      200,
      { 'Set-Cookie': setSessionCookie(sessionId) }
    )
  } catch (err) {
    console.error('Login error:', err)
    return jsonError('Internal server error', 500)
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
