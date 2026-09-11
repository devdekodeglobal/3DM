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

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const sessionId = getSessionId(request)
    if (!sessionId) return jsonError('Unauthorized', 401)

    const user = await getSessionUser(env.DB, sessionId)
    if (!user) return jsonError('Unauthorized', 401)

    // Delete user from the database. 
    // ON DELETE CASCADE will automatically handle the user's designs and sessions.
    await env.DB.prepare(
      'DELETE FROM users WHERE id = ?'
    ).bind(user.id).run()

    // We clear the cookie just to be tidy, even though the session is deleted in DB.
    return json(
      { message: 'Account deleted successfully' },
      200,
      { 'Set-Cookie': clearSessionCookie() }
    )

  } catch (err) {
    console.error('Delete account error:', err)
    return jsonError('Internal server error', 500)
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
