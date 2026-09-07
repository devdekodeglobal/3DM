import {
  json,
  jsonError,
} from '../../../_auth-utils'
import { requireAdmin } from './index'

interface Env {
  DB: D1Database
}

// DELETE /api/admin/users/:id
export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const adminUser = await requireAdmin(request, env)
  if (!adminUser) return jsonError('Forbidden', 403)

  const targetId = params.id as string
  if (!targetId) return jsonError('User ID required', 400)
  
  // Don't let admin delete themselves
  if (targetId === adminUser.id) return jsonError('Cannot delete yourself', 400)

  try {
    await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(targetId).run()
    return json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error('Delete user error:', err)
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
