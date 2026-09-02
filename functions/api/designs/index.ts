import {
  getSessionId,
  getSessionUser,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
}

// GET /api/designs — list all designs for current user
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const { results } = await env.DB.prepare(
    'SELECT id, name, created_at, updated_at FROM designs WHERE user_id = ? ORDER BY updated_at DESC'
  ).bind(user.id).all()

  return json({ designs: results })
}

// POST /api/designs — save a new design
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const { name, config, elements } = await request.json<{
    name: string
    config: unknown
    elements: unknown
  }>()

  if (!name) return jsonError('Design name is required')

  // Limit to 10 designs per user on free tier
  const { results: existing } = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM designs WHERE user_id = ?'
  ).bind(user.id).all<{ count: number }>()

  const count = existing[0]?.count ?? 0
  if (count >= 10) return jsonError('Free plan limit: 10 designs. Delete one to save more.', 403)

  const { results } = await env.DB.prepare(
    'INSERT INTO designs (user_id, name, config, elements) VALUES (?, ?, ?, ?) RETURNING id, name, created_at'
  ).bind(user.id, name, JSON.stringify(config || {}), JSON.stringify(elements || [])).all()

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
