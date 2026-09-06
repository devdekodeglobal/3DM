import { json, jsonError } from '../../_auth-utils'
import { secure, readJson, authLimits, HttpError } from '../../_security'
import { codeDigest } from '../../_verification'
import { emailAddress, onlyKeys } from '../../../shared/validation'
interface Env { DB: D1Database; SECURITY_SECRET: string }
export const onRequestPost = secure<Env>(async ({ request, env }) => {
  const data = await readJson(request)
  onlyKeys(data, ['email','code'])
  const email = emailAddress(data.email)
  if (typeof data.code !== 'string' || !/^\d{6}$/.test(data.code)) throw new HttpError('Enter a six-digit code')
  await authLimits(env.DB, request, email, 'verify', 5, 30, 600)
  const digest = await codeDigest(env.SECURITY_SECRET, email, data.code)
  const now = Math.floor(Date.now() / 1000)
  // D1 batch is transactional: consume the code in the mutation, not a prior read.
  const [created] = await env.DB.batch([
    env.DB.prepare(`INSERT INTO users (id,email,password_hash,name,email_verified)
      SELECT user_id,email,password_hash,name,1 FROM registration_challenges
      WHERE email=? AND code_hash=? AND expires_at>?
      ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash,name=excluded.name,email_verified=1
      WHERE users.email_verified=0 AND users.google_id IS NULL`).bind(email, digest, now),
    env.DB.prepare('DELETE FROM registration_challenges WHERE email=? AND code_hash=? AND expires_at>?').bind(email, digest, now),
  ])
  if (!created.meta.changes) return jsonError('Invalid or expired code', 400)
  return json({ message: 'Email verified successfully. You can now sign in.' })
})
