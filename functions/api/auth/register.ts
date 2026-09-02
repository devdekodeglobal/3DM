import {
  hashPassword,
  generateId,
  generateOtp,
  sendOtpEmail,
  json,
  jsonError,
} from '../_auth-utils'

interface Env {
  DB: D1Database
  RESEND_API_KEY: string
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { email, password, name } = await request.json<{
      email: string
      password: string
      name?: string
    }>()

    if (!email || !password) return jsonError('Email and password are required')
    if (password.length < 8) return jsonError('Password must be at least 8 characters')

    // Check if email already exists
    const existing = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first()

    if (existing) return jsonError('An account with this email already exists', 409)

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const userId = generateId()

    await env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, name, email_verified) VALUES (?, ?, ?, ?, 0)'
    ).bind(userId, email.toLowerCase(), passwordHash, name || null).run()

    // Generate and store OTP
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    await env.DB.prepare(
      'INSERT INTO otp_codes (id, email, code, type, expires_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(generateId(), email.toLowerCase(), otp, 'verify_email', expiresAt).run()

    // Send verification email
    await sendOtpEmail(env.RESEND_API_KEY, email, otp, 'verify_email')

    return json({ message: 'Account created. Check your email for a verification code.' }, 201)
  } catch (err) {
    console.error('Register error:', err)
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
