import {
  generateId,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
  RESEND_API_KEY: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_CLIENT_ID: string
}

// Step 1: GET /api/auth/verify-otp?email=&code= → verify the OTP
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')?.toLowerCase()
    const code = url.searchParams.get('code')

    if (!email || !code) return jsonError('Email and code are required')

    const otp = await env.DB.prepare(`
      SELECT id FROM otp_codes
      WHERE email = ? AND code = ? AND type = 'verify_email'
        AND used = 0 AND expires_at > datetime('now')
      ORDER BY created_at DESC LIMIT 1
    `).bind(email, code).first<{ id: string }>()

    if (!otp) return jsonError('Invalid or expired code', 400)

    // Mark OTP used and verify user's email
    await env.DB.batch([
      env.DB.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').bind(otp.id),
      env.DB.prepare('UPDATE users SET email_verified = 1 WHERE email = ?').bind(email),
    ])

    return json({ message: 'Email verified successfully. You can now sign in.' })
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
