import {
  generateId,
  generateOtp,
  sendOtpEmail,
  checkRateLimit,
  getClientIp,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
  RESEND_API_KEY: string
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const ip = getClientIp(request)

    // Rate limit password reset requests by IP: max 5 requests per 15 minutes
    const ipLimit = await checkRateLimit(env.DB, `pwd_reset_ip:${ip}`, 5, 15 * 60)
    if (!ipLimit.allowed) {
      return jsonError('Too many password reset requests. Please try again later.', 429)
    }

    const { email } = await request.json<{ email: string }>()

    if (!email) return jsonError('Email address is required')
    const normalizedEmail = email.trim().toLowerCase()

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return jsonError('Invalid email address format', 400)
    }

    // Rate limit per email: max 3 reset requests per 15 minutes
    const emailLimit = await checkRateLimit(env.DB, `pwd_reset_email:${normalizedEmail}`, 3, 15 * 60)
    if (!emailLimit.allowed) {
      return jsonError('Too many reset attempts for this email. Please try again later.', 429)
    }

    // Check if user exists in D1 database
    const user = await env.DB.prepare(
      'SELECT id, email_verified FROM users WHERE email = ?'
    ).bind(normalizedEmail).first<{ id: string; email_verified: number }>()

    // ALWAYS return identical response to prevent user enumeration attacks
    const genericSuccessMsg = 'If an account exists for this email address, a password reset code has been sent. Please check your inbox.'

    if (!user) {
      return json({ message: genericSuccessMsg }, 200)
    }

    // Generate cryptographically secure 6-digit OTP code (10 min expiry)
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Store in D1
    await env.DB.prepare(
      'INSERT INTO otp_codes (id, email, code, type, expires_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(generateId(), normalizedEmail, otp, 'reset_password', expiresAt).run()

    console.log(`[DEV BYPASS] Password Reset OTP for ${normalizedEmail} is: ${otp}`)

    // Send reset email via Resend
    await sendOtpEmail(env.RESEND_API_KEY, normalizedEmail, otp, 'reset_password')

    return json({ message: genericSuccessMsg }, 200)
  } catch (err) {
    console.error('Forgot password error:', err)
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
