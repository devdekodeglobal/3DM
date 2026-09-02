import {
  generateId,
  createSession,
  setSessionCookie,
  json,
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
  return `${url.protocol}//${url.host}/api/auth/google`
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
    return Response.redirect(`${GOOGLE_AUTH_URL}?${params}`, 302)
  }

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
    }>()

    // Upsert user in D1
    const existing = await env.DB.prepare(
      'SELECT id FROM users WHERE google_id = ? OR email = ?'
    ).bind(googleUser.sub, googleUser.email.toLowerCase()).first<{ id: string }>()

    let userId: string
    if (existing) {
      userId = existing.id
      await env.DB.prepare(
        'UPDATE users SET google_id = ?, name = ?, avatar_url = ?, email_verified = 1, updated_at = datetime(\'now\') WHERE id = ?'
      ).bind(googleUser.sub, googleUser.name, googleUser.picture, userId).run()
    } else {
      userId = generateId()
      await env.DB.prepare(
        'INSERT INTO users (id, email, google_id, name, avatar_url, email_verified) VALUES (?, ?, ?, ?, ?, 1)'
      ).bind(userId, googleUser.email.toLowerCase(), googleUser.sub, googleUser.name, googleUser.picture).run()
    }

    const sessionId = await createSession(env.DB, userId)

    // Redirect to editor with session cookie set
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/editor',
        'Set-Cookie': setSessionCookie(sessionId),
      },
    })
  } catch (err) {
    console.error('Google OAuth error:', err)
    return Response.redirect('/?error=google_auth_failed', 302)
  }
}
