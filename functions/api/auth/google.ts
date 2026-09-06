import {
  generateId,
  createSession,
  setSessionCookie,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

function getRedirectUri(request: Request): string {
  const url = new URL(request.url)
  return `${url.origin}/api/auth/google`
}

// GET /api/auth/google — either start OAuth flow or handle callback
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  // ── Step 1: Redirect to Google ──────────────────────────────────────────────
  if (!code) {
    const state = generateId()
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: getRedirectUri(request),
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline',
    })
    return new Response(null, { status: 302, headers: {
      Location: `${GOOGLE_AUTH_URL}?${params}`,
      'Set-Cookie': `oauth_state=${state}; Path=/api/auth/google; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    } })
  }

  const state = url.searchParams.get('state')
  const cookieState = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)oauth_state=([^;]+)/)?.[1]
  if (!state || !cookieState || state !== cookieState) return jsonError('Invalid OAuth state', 400)

  // ── Step 2: Handle callback — exchange code for tokens ─────────────────────
  try {
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: getRedirectUri(request),
      }),
    })

    if (!tokenRes.ok) return jsonError('Failed to exchange Google token', 500)
    const { access_token } = await tokenRes.json<{ access_token: string }>()

    // Get user info from Google
    const userRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    if (!userRes.ok) return jsonError('Failed to fetch Google user info', 500)

    const googleUser = await userRes.json<{
      sub: string
      email: string
      name: string
      picture: string
      email_verified: boolean
    }>()

    if (typeof googleUser.sub !== 'string' || !googleUser.sub ||
        typeof googleUser.email !== 'string' || !googleUser.email || googleUser.email_verified !== true) {
      return jsonError('Google identity must have a verified email', 400)
    }

    // Upsert user in D1
    const existing = await env.DB.prepare(
      'SELECT id FROM users WHERE google_id = ?'
    ).bind(googleUser.sub).first<{ id: string }>()

    let userId: string
    if (existing) {
      userId = existing.id
      await env.DB.prepare(
        'UPDATE users SET google_id = ?, name = ?, avatar_url = ?, email_verified = 1, updated_at = datetime(\'now\') WHERE id = ?'
      ).bind(googleUser.sub, googleUser.name, googleUser.picture, userId).run()
    } else {
      // Linking requires a separate flow authenticated as the existing account.
      // Never promote an unverified password account or trust email as a stable subject.
      const emailAccount = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
        .bind(googleUser.email.toLowerCase()).first()
      if (emailAccount) return jsonError('Sign in using your existing account method', 409)
      userId = generateId()
      await env.DB.prepare(
        'INSERT INTO users (id, email, google_id, name, avatar_url, email_verified) VALUES (?, ?, ?, ?, ?, 1)'
      ).bind(userId, googleUser.email.toLowerCase(), googleUser.sub, googleUser.name, googleUser.picture).run()
    }

    const sessionId = await createSession(env.DB, userId)

    // Redirect to editor with session cookie set
    const baseUrl = getRedirectUri(request).replace('/api/auth/google', '')
    const headers = new Headers({
      Location: `${baseUrl}/editor`,
      'Cache-Control': 'no-store',
    })
    headers.append('Set-Cookie', setSessionCookie(sessionId))
    headers.append('Set-Cookie', 'oauth_state=; Path=/api/auth/google; HttpOnly; Secure; SameSite=Lax; Max-Age=0')
    return new Response(null, {
      status: 302,
      headers,
    })
  } catch (err) {
    console.error('Google OAuth error:', err)
    const baseUrl = getRedirectUri(request).replace('/api/auth/google', '')
    return Response.redirect(`${baseUrl}/?error=google_auth_failed`, 302)
  }
}
