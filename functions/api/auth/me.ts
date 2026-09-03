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
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
