import {
  getSessionId,
  getSessionUser,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
}

const MAX_DESIGN_PAYLOAD_SIZE = 2 * 1024 * 1024 // 2MB

// GET /api/designs — list all designs for current user
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const { results } = await env.DB.prepare(
    'SELECT id, project_id, name, config, elements, created_at, updated_at FROM designs WHERE user_id = ? ORDER BY updated_at DESC'
  ).bind(user.id).all()

  return json({ designs: results })
}

// POST /api/designs — save a new design
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  // Enforce maximum payload size (KK 07)
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10)
  if (contentLength > MAX_DESIGN_PAYLOAD_SIZE) {
    return jsonError('Payload exceeds maximum allowed size of 2MB', 413)
  }

  const rawBody = await request.text()
  if (rawBody.length > MAX_DESIGN_PAYLOAD_SIZE) {
    return jsonError('Payload exceeds maximum allowed size of 2MB', 413)
  }

  let parsed: { project_id?: string; name?: string; config?: unknown; elements?: unknown }
  try {
    parsed = JSON.parse(rawBody)
  } catch {
    return jsonError('Invalid JSON body', 400)
  }

  const { project_id, name, config, elements } = parsed

  if (!project_id || typeof project_id !== 'string') {
    return jsonError('project_id is required')
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return jsonError('Design name is required')
  }

  if (name.length > 100) {
    return jsonError('Design name must not exceed 100 characters')
  }

  // Limit to 2 designs per project
  const { results: existing } = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM designs WHERE project_id = ?'
  ).bind(project_id).all<{ count: number }>()

  const count = existing[0]?.count ?? 0
  if (count >= 2) return jsonError('Max capacity reached: Limit of 2 designs per project.', 403)

  const { results } = await env.DB.prepare(
    'INSERT INTO designs (user_id, project_id, name, config, elements) VALUES (?, ?, ?, ?, ?) RETURNING id, project_id, name, created_at'
  ).bind(user.id, project_id, name.trim(), JSON.stringify(config || {}), JSON.stringify(elements || [])).all()

  return json({ design: results[0] }, 201)
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
