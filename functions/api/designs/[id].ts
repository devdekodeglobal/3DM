import {
  getSessionId,
  getSessionUser,
  json,
  jsonError,
} from '../../../_auth-utils'

interface Env {
  DB: D1Database
}

// GET /api/designs/[id] — load a specific design
export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const id = params.id as string
  const design = await env.DB.prepare(
    'SELECT * FROM designs WHERE id = ? AND user_id = ?'
  ).bind(id, user.id).first()

  if (!design) return jsonError('Design not found', 404)
  return json({ design })
}

// PUT /api/designs/[id] — update a design
export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const id = params.id as string
  const { name, config, elements } = await request.json<{
    name?: string
    config?: unknown
    elements?: unknown
  }>()

  const { results } = await env.DB.prepare(`
    UPDATE designs
    SET name = COALESCE(?, name),
        config = COALESCE(?, config),
        elements = COALESCE(?, elements),
        updated_at = datetime('now')
    WHERE id = ? AND user_id = ?
    RETURNING id, name, updated_at
  `).bind(
    name ?? null,
    config ? JSON.stringify(config) : null,
    elements ? JSON.stringify(elements) : null,
    id,
    user.id
  ).all()

  if (!results.length) return jsonError('Design not found', 404)
  return json({ design: results[0] })
}

// DELETE /api/designs/[id] — delete a design
export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const sessionId = getSessionId(request)
  const user = await getSessionUser(env.DB, sessionId || '')
  if (!user) return jsonError('Unauthorized', 401)

  const id = params.id as string
  await env.DB.prepare(
    'DELETE FROM designs WHERE id = ? AND user_id = ?'
  ).bind(id, user.id).run()

  return json({ message: 'Design deleted' })
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
