import {
  createSession,
  setSessionCookie,
  checkRateLimit,
  getClientIp,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
  RESEND_API_KEY: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_CLIENT_ID: string
}

// Step 1: GET /api/auth/verify-otp?email=&code= → verify the OTP and auto-login
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const ip = getClientIp(request)
    const url = new URL(request.url)
    const email = url.searchParams.get('email')?.trim().toLowerCase()
    const code = url.searchParams.get('code')?.trim()

    if (!email || !code) return jsonError('Email and code are required')

    // Rate limit OTP verification attempts to prevent brute-forcing 6-digit codes (KK 06)
    // Max 5 attempts per email per 10 minutes
    const otpLimit = await checkRateLimit(env.DB, `otp_verify:${email}`, 5, 10 * 60)
    if (!otpLimit.allowed) {
      return jsonError('Too many invalid verification attempts. Please request a new code.', 429)
    }

    const ipLimit = await checkRateLimit(env.DB, `otp_ip:${ip}`, 15, 10 * 60)
    if (!ipLimit.allowed) {
      return jsonError('Too many verification attempts from this IP. Please wait.', 429)
    }

    const otp = await env.DB.prepare(`
      SELECT id FROM otp_codes
      WHERE email = ? AND code = ? AND type = 'verify_email'
        AND used = 0 AND expires_at > datetime('now')
      ORDER BY created_at DESC LIMIT 1
    `).bind(email, code).first<{ id: string }>()

    if (!otp) return jsonError('Invalid or expired code', 400)

    // Look up the user to create a session for auto-login
    const user = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first<{ id: string }>()

    if (!user) return jsonError('User not found', 404)

    // Mark OTP used and verify user's email
    await env.DB.batch([
      env.DB.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').bind(otp.id),
      env.DB.prepare('UPDATE users SET email_verified = 1 WHERE email = ?').bind(email),
    ])

    // Auto-login: create a session so the user doesn't need to sign in again after OTP
    const sessionId = await createSession(env.DB, user.id)

    return json(
      { message: 'Email verified successfully. You are now signed in.' },
      200,
      { 'Set-Cookie': setSessionCookie(sessionId) }
    )
  } catch (err) {
    console.error('Verify OTP error:', err)
    return jsonError('Internal server error', 500)
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
