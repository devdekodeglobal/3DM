import {
  getSessionId,
  getSessionUser,
  json,
  jsonError,
} from '../../../_auth-utils'

interface Env {
  DB: D1Database
}

export async function requireAdmin(request: Request, env: Env) {
  const sessionId = getSessionId(request)
  if (!sessionId) return null
  const user = await getSessionUser(env.DB, sessionId)
  if (!user || (user.email !== 'devdekodeglobal@gmail.com' && user.email !== 'dev.dekodeglobal@gmail.com')) return null
  return user
}

// GET /api/admin/users
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const adminUser = await requireAdmin(request, env)
  if (!adminUser) return jsonError('Forbidden', 403)

  try {
    const { results } = await env.DB.prepare(`
      SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.email_verified, 
        u.created_at,
        (SELECT COUNT(*) FROM designs d WHERE d.user_id = u.id) as project_count
      FROM users u
      ORDER BY u.created_at DESC
    `).all()
    return json(results)
  } catch (err) {
    console.error('Fetch users error:', err)
    return jsonError('Internal server error', 500)
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
