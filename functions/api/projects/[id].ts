import {
  getSessionId,
  getSessionUser,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
}

// GET /api/projects/:id
export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const projectId = params.id as string

  const { results } = await env.DB.prepare(
    'SELECT id, name, description, created_at, updated_at FROM projects WHERE id = ? AND user_id = ?'
  ).bind(projectId, user.id).all()

  if (results.length === 0) return jsonError('Project not found', 404)

  return json({ project: results[0] })
}

// PUT /api/projects/:id
export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const projectId = params.id as string

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

  const { results, success } = await env.DB.prepare(
    'UPDATE projects SET name = ?, description = ?, updated_at = datetime("now") WHERE id = ? AND user_id = ? RETURNING id, name, description, updated_at'
  ).bind(name.trim(), description?.trim() || null, projectId, user.id).all()

  if (!success || results.length === 0) {
    return jsonError('Failed to update project or project not found', 400)
  }

  return json({ project: results[0] })
}

// DELETE /api/projects/:id
export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const projectId = params.id as string

  const { success } = await env.DB.prepare(
    'DELETE FROM projects WHERE id = ? AND user_id = ?'
  ).bind(projectId, user.id).all()

  if (!success) {
    return jsonError('Failed to delete project', 400)
  }

  return json({ success: true })
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
