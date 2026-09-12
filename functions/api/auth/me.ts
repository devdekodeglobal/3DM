import {
  getSessionId,
  getSessionUser,
  deleteSession,
  clearSessionCookie,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
}

// GET /api/auth/me — return current user from session cookie
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const sessionId = getSessionId(request)
  if (!sessionId) return json({ user: null })

  const user = await getSessionUser(env.DB, sessionId)
  return json({ user })
}

// PUT /api/auth/me — update user profile (e.g. name)
export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const sessionId = getSessionId(request)
    if (!sessionId) return jsonError('Unauthorized', 401)

    const user = await getSessionUser(env.DB, sessionId)
    if (!user) return jsonError('Unauthorized', 401)

    const body = await request.json<{ name?: string }>()
    const newName = typeof body.name === 'string' ? body.name.trim() : ''

    if (newName.length > 100) {
      return jsonError('Name must not exceed 100 characters', 400)
    }

    await env.DB.prepare(
      'UPDATE users SET name = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).bind(newName || null, user.id).run()

    const updatedUser = await getSessionUser(env.DB, sessionId)
    return json({ user: updatedUser, message: 'Profile updated successfully' })
  } catch (err) {
    console.error('Update profile error:', err)
    return jsonError('Internal server error', 500)
  }
}

// DELETE /api/auth/me — sign out (delete session)
export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const sessionId = getSessionId(request)
  if (sessionId) await deleteSession(env.DB, sessionId)

  return json(
    { message: 'Signed out' },
    200,
    { 'Set-Cookie': clearSessionCookie() }
  )
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
