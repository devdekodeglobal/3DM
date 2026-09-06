import { hashPassword, generateId, generateOtp, sendOtpEmail, json } from '../../_auth-utils'
import { secure, readJson, authLimits, rateLimit, HttpError } from '../../_security'
import { codeDigest } from '../../_verification'
import { emailAddress, passwordValue, onlyKeys } from '../../../shared/validation'
interface Env { DB: D1Database; RESEND_API_KEY: string; SECURITY_SECRET: string; RESEND_FROM?: string }
export const onRequestPost = secure<Env>(async ({ request, env, waitUntil }) => {
  const data = await readJson(request)
  onlyKeys(data, ['email','password','name'])
  const email = emailAddress(data.email)
  const password = passwordValue(data.password, true)
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length > 100)) throw new HttpError('Name must be at most 100 characters')
  await authLimits(env.DB, request, email, 'registration', 3, 20, 3600)
  await rateLimit(env.DB, 'registration:total', 'daily', 500, 86400)
  const code = generateOtp()
  const digest = await codeDigest(env.SECURITY_SECRET, email, code)
  const passwordHash = await hashPassword(password)
  const existing = await env.DB.prepare('SELECT email_verified, google_id FROM users WHERE email = ?').bind(email).first<{ email_verified: number; google_id: string | null }>()
  if (!existing?.email_verified && !existing?.google_id) {
    const now = Math.floor(Date.now() / 1000)
    await env.DB.prepare(`INSERT INTO registration_challenges (email,user_id,password_hash,name,code_hash,expires_at)
      VALUES (?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET user_id=excluded.user_id,
      password_hash=excluded.password_hash,name=excluded.name,code_hash=excluded.code_hash,expires_at=excluded.expires_at`)
      .bind(email, generateId(), passwordHash, typeof data.name === 'string' ? data.name.trim() : null, digest, now + 600).run()
    await env.DB.prepare('DELETE FROM registration_challenges WHERE email IN (SELECT email FROM registration_challenges WHERE expires_at < ? LIMIT 20)').bind(now).run()
    // Avoid exposing provider latency/failure in registration responses.
    waitUntil((async () => {
      try {
        if (!await sendOtpEmail(env.RESEND_API_KEY, email, code, 'verify_email', env.RESEND_FROM)) throw new Error('Delivery rejected')
      } catch {
        await env.DB.prepare('DELETE FROM registration_challenges WHERE email=? AND code_hash=?').bind(email, digest).run()
        console.error('Verification delivery failed')
      }
    })())
  }
  return json({ message: 'If this email can be registered, a verification code will arrive. Existing customers can sign in using their usual method.' }, 202)
})
