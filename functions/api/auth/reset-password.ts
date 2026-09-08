import {
  hashPassword,
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

    const { email, code, newPassword } = await request.json<{
      email: string
      code: string
      newPassword: string
    }>()

    if (!email || !code || !newPassword) {
      return jsonError('Email, verification code, and new password are required')
    }

    const normalizedEmail = email.trim().toLowerCase()
    const trimmedCode = code.trim()

    // Validate password constraints
    if (newPassword.length < 8) return jsonError('New password must be at least 8 characters long', 400)
    if (newPassword.length > 128) return jsonError('New password must not exceed 128 characters', 400)

    // Rate limit OTP verification attempts to prevent brute-forcing (5 attempts per 10 mins)
    const otpLimit = await checkRateLimit(env.DB, `pwd_verify:${normalizedEmail}`, 5, 10 * 60)
    if (!otpLimit.allowed) {
      return jsonError('Too many invalid reset attempts. Please request a new reset code.', 429)
    }

    const ipLimit = await checkRateLimit(env.DB, `pwd_verify_ip:${ip}`, 15, 10 * 60)
    if (!ipLimit.allowed) {
      return jsonError('Too many reset attempts from this IP address. Please wait.', 429)
    }

    // Lookup valid, unexpired reset_password OTP
    const otpRecord = await env.DB.prepare(`
      SELECT id FROM otp_codes
      WHERE email = ? AND code = ? AND type = 'reset_password'
        AND used = 0 AND expires_at > datetime('now')
      ORDER BY created_at DESC LIMIT 1
    `).bind(normalizedEmail, trimmedCode).first<{ id: string }>()

    if (!otpRecord) {
      return jsonError('Invalid or expired reset code. Please request a new code.', 400)
    }

    // Verify user exists in database
    const user = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(normalizedEmail).first<{ id: string }>()

    if (!user) {
      return jsonError('Invalid account details.', 400)
    }

    // Hash new password using PBKDF2 (100,000 iterations)
    const newPasswordHash = await hashPassword(newPassword)

    // Atomic D1 batch execution:
    // 1. Mark OTP used
    // 2. Update user's password hash and verify email status
    // 3. Invalidate ALL existing active sessions for security
    await env.DB.batch([
      env.DB.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').bind(otpRecord.id),
      env.DB.prepare(
        'UPDATE users SET password_hash = ?, email_verified = 1, updated_at = datetime(\'now\') WHERE id = ?'
      ).bind(newPasswordHash, user.id),
      env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id),
    ])

    return json({ message: 'Password reset successfully! You can now log in with your new password.' })
  } catch (err) {
    console.error('Reset password error:', err)
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
