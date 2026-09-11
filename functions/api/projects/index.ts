import {
  getSessionId,
  getSessionUser,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
}

// GET /api/projects — list all projects for current user
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const { results } = await env.DB.prepare(
    'SELECT id, name, description, created_at, updated_at FROM projects WHERE user_id = ? ORDER BY updated_at DESC'
  ).bind(user.id).all()

  return json({ projects: results })
}

// POST /api/projects — create a new project (limit to 1 per user)
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  // Enforce 2 projects per user
  const { results: existing } = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM projects WHERE user_id = ?'
  ).bind(user.id).all<{ count: number }>()

  const count = existing[0]?.count ?? 0
  if (count >= 2) return jsonError('Max capacity reached: Limit of 2 projects per user.', 403)

  let parsed: { name?: string; description?: string }
  try {
    parsed = await request.json()
  } catch {
    return jsonError('Invalid JSON body', 400)
  }

  const { name, description } = parsed

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return jsonError('Project name is required')
  }

  const { results } = await env.DB.prepare(
    'INSERT INTO projects (user_id, name, description) VALUES (?, ?, ?) RETURNING id, name, description, created_at, updated_at'
  ).bind(user.id, name.trim(), description?.trim() || null).all()

  return json({ project: results[0] }, 201)
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
