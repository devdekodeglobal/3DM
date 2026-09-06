import { verifyPassword, hashPassword, isLegacyPasswordHash, createSession, setSessionCookie, json, jsonError } from '../../_auth-utils'
import { secure, readJson, authLimits } from '../../_security'
import { emailAddress, passwordValue, onlyKeys } from '../../../shared/validation'
interface Env { DB: D1Database }
export const onRequestPost = secure<Env>(async ({ request, env }) => {
  const data = await readJson(request)
  onlyKeys(data, ['email','password'])
  const email = emailAddress(data.email)
  const password = passwordValue(data.password)
  await authLimits(env.DB, request, email, 'login', 10, 40, 900)
  const user = await env.DB.prepare('SELECT id, password_hash, email_verified FROM users WHERE email = ? AND password_hash IS NOT NULL AND google_id IS NULL')
    .bind(email).first<{ id: string; password_hash: string; email_verified: number }>()
  if (!user) { await hashPassword(password); return jsonError('Invalid email or password', 401) }
  if (!await verifyPassword(password, user.password_hash) || !user.email_verified) return jsonError('Invalid email or password', 401)
  if (isLegacyPasswordHash(user.password_hash)) {
    const upgraded = await hashPassword(password)
    const result = await env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ? AND password_hash = ?').bind(upgraded, user.id, user.password_hash).run()
    if (result.meta.changes !== 1) return jsonError('Please try signing in again', 409)
  }
  return json({ message: 'Signed in successfully' }, 200, { 'Set-Cookie': setSessionCookie(await createSession(env.DB, user.id)) })
})
