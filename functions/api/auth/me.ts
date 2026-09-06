import { getSessionId, getSessionUser, deleteSession, clearSessionCookie, json } from '../../_auth-utils'
import { secure } from '../../_security'
interface Env { DB: D1Database }
export const onRequestGet = secure<Env>(async ({ request, env }) => {
  const id = getSessionId(request)
  return json({ user: id ? await getSessionUser(env.DB, id) : null })
})
export const onRequestDelete = secure<Env>(async ({ request, env }) => {
  const id = getSessionId(request)
  if (id) await deleteSession(env.DB, id)
  return json({ message: 'Signed out' }, 200, { 'Set-Cookie': clearSessionCookie() })
})
