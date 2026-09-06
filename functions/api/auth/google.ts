import { generateId, createSession, setSessionCookie, jsonError } from '../../_auth-utils'
import { secure, rateLimit, clientIp, HttpError } from '../../_security'
interface Env { DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string }
const COOKIE = '__Host-oauth_state'
function stateCookie(value: string, age: number) { return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}` }
export const onRequestGet = secure<Env>(async ({ request, env }) => {
  const url = new URL(request.url)
  await rateLimit(env.DB, 'oauth:ip', clientIp(request), 20, 600)
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) throw new HttpError('Google sign-in is temporarily unavailable', 503)
  for (const key of ['code','state','error']) if (url.searchParams.getAll(key).length > 1) throw new HttpError('Invalid OAuth callback')
  if (url.searchParams.has('error')) return new Response(null, { status: 302, headers: { Location: '/?error=google_auth_cancelled', 'Set-Cookie': stateCookie('', 0) } })
  const code = url.searchParams.get('code')
  const redirectUri = `${url.origin}/api/auth/google`
  if (!code) {
    const state = generateId()
    const verifier = generateId() + generateId()
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
    const challenge = btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    const now = Math.floor(Date.now() / 1000)
    await env.DB.prepare('INSERT INTO oauth_challenges(id,verifier,expires_at) VALUES(?,?,?)').bind(state, verifier, now + 600).run()
    await env.DB.prepare('DELETE FROM oauth_challenges WHERE id IN (SELECT id FROM oauth_challenges WHERE expires_at<=? LIMIT 20)').bind(now).run()
    const params = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, redirect_uri: redirectUri, response_type: 'code', scope: 'openid email profile', state, code_challenge: challenge, code_challenge_method: 'S256' })
    return new Response(null, { status: 302, headers: { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}`, 'Set-Cookie': stateCookie(state, 600) } })
  }
  const state = url.searchParams.get('state')
  const cookie = (request.headers.get('Cookie') || '').split(';').map(x=>x.trim()).filter(x=>x.startsWith(COOKIE+'='))
  if (!state || !/^[a-f0-9]{32}$/.test(state) || cookie.length !== 1 || cookie[0] !== COOKIE+'='+state || code.length > 4096) throw new HttpError('Invalid OAuth state')
  const challenge = await env.DB.prepare('DELETE FROM oauth_challenges WHERE id=? AND expires_at>? RETURNING verifier').bind(state, Math.floor(Date.now()/1000)).first<{ verifier: string }>()
  if (!challenge) throw new HttpError('Expired or used OAuth state')
  // The state is one-use in D1. PKCE binds the provider code to this initiation.
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, code, code_verifier: challenge.verifier, grant_type: 'authorization_code', redirect_uri: redirectUri }),
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) return jsonError('Google sign-in failed. Please start again.', 400)
  const tokens = await response.json<{ access_token?: string }>()
  if (typeof tokens.access_token !== 'string') throw new HttpError('Invalid Google response')
  const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` }, signal: AbortSignal.timeout(10000) })
  if (!profileResponse.ok) throw new HttpError('Google identity could not be verified')
  const profile = await profileResponse.json<{ sub?: string; email?: string; email_verified?: boolean; name?: string; picture?: string }>()
  if (typeof profile.sub !== 'string' || !profile.sub || profile.sub.length > 255 || typeof profile.email !== 'string' || profile.email.length > 254 || profile.email_verified !== true) throw new HttpError('Google identity must have a verified email')
  const existing = await env.DB.prepare('SELECT id FROM users WHERE google_id=?').bind(profile.sub).first<{ id:string }>()
  let userId: string
  if (existing) userId = existing.id
  else {
    const collision = await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(profile.email.toLowerCase()).first()
    if (collision) return jsonError('Sign in using your existing account method', 409)
    userId = generateId()
    await env.DB.prepare('INSERT INTO users(id,email,google_id,name,avatar_url,email_verified) VALUES(?,?,?,?,?,1)')
      .bind(userId, profile.email.toLowerCase(), profile.sub, typeof profile.name === 'string' ? profile.name.slice(0,100) : null,
        typeof profile.picture === 'string' && profile.picture.startsWith('https://') ? profile.picture.slice(0,2048) : null).run()
  }
  const headers = new Headers({ Location: '/editor' })
  headers.append('Set-Cookie', setSessionCookie(await createSession(env.DB, userId)))
  headers.append('Set-Cookie', stateCookie('',0))
  return new Response(null, { status:302, headers })
})
