import {
  verifyPassword,
  createSession,
  setSessionCookie,
  json,
  jsonError,
} from '../_auth-utils'

interface Env {
  DB: D1Database
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { email, password } = await request.json<{ email: string; password: string }>()

    if (!email || !password) return jsonError('Email and password are required')

    const user = await env.DB.prepare(
      'SELECT id, password_hash, email_verified FROM users WHERE email = ? AND password_hash IS NOT NULL'
    ).bind(email.toLowerCase()).first<{ id: string; password_hash: string; email_verified: number }>()

    if (!user) return jsonError('Invalid email or password', 401)

    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) return jsonError('Invalid email or password', 401)

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
