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
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '')
  return `${proto}://${host}/api/auth/google`
}

function getOAuthStateCookie(request: Request): string | null {
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(/(?:^|;\s*)oauth_state=([^;]+)/)
  return match ? match[1] : null
}

function setOAuthStateCookie(state: string): string {
  return `oauth_state=${state}; Path=/api/auth/google; HttpOnly; Secure; SameSite=Lax; Max-Age=300`
}

function clearOAuthStateCookie(): string {
  return `oauth_state=; Path=/api/auth/google; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}

// GET /api/auth/google — either start OAuth flow or handle callback
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const incomingState = url.searchParams.get('state')

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
      prompt: 'select_account',
    })

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${GOOGLE_AUTH_URL}?${params}`,
        'Set-Cookie': setOAuthStateCookie(state),
      },
    })
  }

  // ── Step 2: Handle callback — verify state (KK 04) & exchange tokens ────────
  const expectedState = getOAuthStateCookie(request)
  if (!incomingState || !expectedState || incomingState !== expectedState) {
    console.error('OAuth state verification failed. Possible CSRF attack.')
    const baseUrl = getRedirectUri(request).replace('/api/auth/google', '')
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${baseUrl}/?error=oauth_state_invalid`,
        'Set-Cookie': clearOAuthStateCookie(),
      },
    })
  }

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
      email_verified?: boolean
      name: string
      picture: string
    }>()

    const normalizedEmail = googleUser.email.toLowerCase()

    // ── Step 3: Safe Account Resolution (KK 03) ───────────────────────────────
    // First, check if there is an account already linked to this google_id
    const userByGoogleId = await env.DB.prepare(
      'SELECT id, email, password_hash, email_verified FROM users WHERE google_id = ?'
    ).bind(googleUser.sub).first<{ id: string; email: string; password_hash: string | null; email_verified: number }>()

    let userId: string

    if (userByGoogleId) {
      userId = userByGoogleId.id
      // Update profile info without touching existing password_hash
      await env.DB.prepare(
        'UPDATE users SET name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url), updated_at = datetime(\'now\') WHERE id = ?'
      ).bind(googleUser.name, googleUser.picture, userId).run()
    } else {
      // Check if an account exists with this email
      const userByEmail = await env.DB.prepare(
        'SELECT id, google_id, email_verified, password_hash FROM users WHERE email = ?'
      ).bind(normalizedEmail).first<{ id: string; google_id: string | null; email_verified: number; password_hash: string | null }>()

      if (userByEmail) {
        // Unsafe account collision protection (KK 03):
        // If an account exists with this email but has a different google_id, do NOT silently merge
        if (userByEmail.google_id && userByEmail.google_id !== googleUser.sub) {
          console.error('Account collision: email already linked to another Google account.')
          const baseUrl = getRedirectUri(request).replace('/api/auth/google', '')
          return Response.redirect(`${baseUrl}/?error=account_conflict`, 302)
        }

        // If the email was never verified in our system, do NOT allow auto-merging with an unverified password account
        if (!userByEmail.email_verified) {
          console.error('Unsafe match: Existing local account with email is unverified.')
          const baseUrl = getRedirectUri(request).replace('/api/auth/google', '')
          return Response.redirect(`${baseUrl}/?error=unverified_account_exists`, 302)
        }

        // Email was verified: safely link google_id while preserving existing password_hash
        userId = userByEmail.id
        await env.DB.prepare(
          'UPDATE users SET google_id = ?, avatar_url = COALESCE(avatar_url, ?), updated_at = datetime(\'now\') WHERE id = ?'
        ).bind(googleUser.sub, googleUser.picture, userId).run()
      } else {
        // Brand new Google user: create fresh record
        userId = generateId()
        await env.DB.prepare(
          'INSERT INTO users (id, email, google_id, name, avatar_url, email_verified) VALUES (?, ?, ?, ?, ?, 1)'
        ).bind(userId, normalizedEmail, googleUser.sub, googleUser.name, googleUser.picture).run()
      }
    }

    const sessionId = await createSession(env.DB, userId)

    // Redirect to editor with session cookie set and clear the oauth_state cookie
    const baseUrl = getRedirectUri(request).replace('/api/auth/google', '')
    return new Response(null, {
      status: 302,
      headers: [
        ['Location', `${baseUrl}/editor`],
        ['Set-Cookie', setSessionCookie(sessionId)],
        ['Set-Cookie', clearOAuthStateCookie()],
      ],
    })
  } catch (err) {
    console.error('Google OAuth error:', err)
    const baseUrl = getRedirectUri(request).replace('/api/auth/google', '')
    return Response.redirect(`${baseUrl}/?error=google_auth_failed`, 302)
  }
}
