import { getSessionId, getSessionUser, json, jsonError } from '../../_auth-utils'
import { secure, readJson, rateLimit } from '../../_security'
import { MAX_DESIGN_BYTES, validateDesign } from '../../../shared/validation'
interface Env { DB: D1Database }
export const onRequestGet = secure<Env>(async ({ request, env }) => {
  const user = await getSessionUser(env.DB, getSessionId(request) || '')
  if (!user) return jsonError('Unauthorized', 401)
  await rateLimit(env.DB, 'design:read', String(user.id), 60, 60)
  const { results } = await env.DB.prepare('SELECT id,name,created_at,updated_at FROM designs WHERE user_id=? ORDER BY updated_at DESC LIMIT 10').bind(user.id).all()
  return json({ designs: results })
})
export const onRequestPost = secure<Env>(async ({ request, env }) => {
  const user = await getSessionUser(env.DB, getSessionId(request) || '')
  if (!user) return jsonError('Unauthorized', 401)
  await rateLimit(env.DB, 'design:write', String(user.id), 30, 60)
  const data = validateDesign(await readJson(request, MAX_DESIGN_BYTES))
  // Single statement enforces the quota atomically, including concurrent clients.
  const { results } = await env.DB.prepare(`INSERT INTO designs (user_id,name,config,elements)
    SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM designs WHERE user_id=?) < 10 RETURNING id,name,created_at`)
    .bind(user.id, data.name, JSON.stringify(data.config), JSON.stringify(data.elements), user.id).all()
  if (!results.length) return jsonError('Free plan limit: 10 designs. Delete one to save more.', 403)
  return json({ design: results[0] }, 201)
})
