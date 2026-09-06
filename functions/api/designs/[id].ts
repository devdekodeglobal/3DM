import { getSessionId, getSessionUser, json, jsonError } from '../../_auth-utils'
import { secure, readJson, rateLimit } from '../../_security'
import { MAX_DESIGN_BYTES, designId, validateDesign } from '../../../shared/validation'
interface Env { DB: D1Database }
export const onRequestGet = secure<Env>(async ({ request, env, params }) => {
  const user = await getSessionUser(env.DB, getSessionId(request) || '')
  if (!user) return jsonError('Unauthorized', 401)
  await rateLimit(env.DB, 'design:read', String(user.id), 60, 60)
  const design = await env.DB.prepare('SELECT * FROM designs WHERE id=? AND user_id=?').bind(designId(params.id), user.id).first()
  if (!design) return jsonError('Design not found', 404)
  return json({ design })
})
export const onRequestPut = secure<Env>(async ({ request, env, params }) => {
  const user = await getSessionUser(env.DB, getSessionId(request) || '')
  if (!user) return jsonError('Unauthorized', 401)
  const id = designId(params.id)
  await rateLimit(env.DB, 'design:write', String(user.id), 30, 60)
  const data = validateDesign(await readJson(request, MAX_DESIGN_BYTES), true)
  const { results } = await env.DB.prepare(`UPDATE designs SET name=COALESCE(?,name),
    config=COALESCE(?,config),elements=COALESCE(?,elements),updated_at=datetime('now')
    WHERE id=? AND user_id=? RETURNING id,name,updated_at`)
    .bind(data.name ?? null, data.config === undefined ? null : JSON.stringify(data.config),
      data.elements === undefined ? null : JSON.stringify(data.elements), id, user.id).all()
  if (!results.length) return jsonError('Design not found', 404)
  return json({ design: results[0] })
})
export const onRequestDelete = secure<Env>(async ({ request, env, params }) => {
  const user = await getSessionUser(env.DB, getSessionId(request) || '')
  if (!user) return jsonError('Unauthorized', 401)
  await rateLimit(env.DB, 'design:write', String(user.id), 30, 60)
  const result = await env.DB.prepare('DELETE FROM designs WHERE id=? AND user_id=?').bind(designId(params.id), user.id).run()
  if (!result.meta.changes) return jsonError('Design not found', 404)
  return json({ message: 'Design deleted' })
})
