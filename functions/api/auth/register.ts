import {
  hashPassword,
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
    
    // Rate limit registration by IP: max 5 requests per 15 minutes (KK 06)
    const ipLimit = await checkRateLimit(env.DB, `reg_ip:${ip}`, 5, 15 * 60)
    if (!ipLimit.allowed) {
      return jsonError('Too many registration attempts. Please try again later.', 429)
    }

    const { email, password, name } = await request.json<{
      email: string
      password: string
      name?: string
    }>()

    if (!email || !password) return jsonError('Email and password are required')
    const normalizedEmail = email.trim().toLowerCase()
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return jsonError('Invalid email address format', 400)
    }

    if (password.length < 8) return jsonError('Password must be at least 8 characters')
    if (password.length > 128) return jsonError('Password must not exceed 128 characters')

    // Rate limit per email: max 3 registrations/OTPs per 15 minutes (KK 06)
    const emailLimit = await checkRateLimit(env.DB, `reg_email:${normalizedEmail}`, 3, 15 * 60)
    if (!emailLimit.allowed) {
      return jsonError('Too many attempts for this email. Please try again later.', 429)
    }

    // Check if email already exists
    const existing = await env.DB.prepare(
      'SELECT id, email_verified FROM users WHERE email = ?'
    ).bind(normalizedEmail).first<{ id: string; email_verified: number }>()

    if (existing) {
      // If user already exists and is verified, do not disclose account existence (KK 12)
      // Return identical success response
      if (existing.email_verified) {
        return json({ message: 'If this email is eligible, a verification code has been sent. Please check your inbox.' }, 200)
      }

      // If user exists but is NOT yet verified, update their password and re-issue OTP
      const passwordHash = await hashPassword(password)
      await env.DB.prepare(
        'UPDATE users SET password_hash = ?, name = COALESCE(?, name), updated_at = datetime(\'now\') WHERE id = ?'
      ).bind(passwordHash, name || null, existing.id).run()

      const otp = generateOtp()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
      await env.DB.prepare(
        'INSERT INTO otp_codes (id, email, code, type, expires_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(generateId(), normalizedEmail, otp, 'verify_email', expiresAt).run()

      await sendOtpEmail(env.RESEND_API_KEY, normalizedEmail, otp, 'verify_email')
      return json({ message: 'If this email is eligible, a verification code has been sent. Please check your inbox.' }, 200)
    }

    // Hash password using PBKDF2 (KK 01) and create user
    const passwordHash = await hashPassword(password)
    const userId = generateId()

    await env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, name, email_verified) VALUES (?, ?, ?, ?, 0)'
    ).bind(userId, normalizedEmail, passwordHash, name || null).run()

    // Generate and store cryptographically secure OTP
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    await env.DB.prepare(
      'INSERT INTO otp_codes (id, email, code, type, expires_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(generateId(), normalizedEmail, otp, 'verify_email', expiresAt).run()

    // Send verification email
    await sendOtpEmail(env.RESEND_API_KEY, normalizedEmail, otp, 'verify_email')

    return json({ message: 'If this email is eligible, a verification code has been sent. Please check your inbox.' }, 201)
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
