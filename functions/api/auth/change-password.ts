import {
  getSessionId,
  getSessionUser,
  hashPassword,
  verifyPassword,
  json,
  jsonError,
} from '../../_auth-utils'

interface Env {
  DB: D1Database
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const sessionId = getSessionId(request)
    if (!sessionId) return jsonError('Unauthorized', 401)

    const user = await getSessionUser(env.DB, sessionId)
    if (!user) return jsonError('Unauthorized', 401)

    // Ensure user is not a Google OAuth user (they shouldn't have a password)
    if (user.google_id) {
      return jsonError('Password changes are not supported for Google authenticated accounts.', 400)
    }

    const { oldPassword, newPassword } = await request.json<{ oldPassword?: string; newPassword?: string }>()
    if (!oldPassword || !newPassword) {
      return jsonError('Old password and new password are required.', 400)
    }

    // Fetch the user's current password hash
    const dbUser = await env.DB.prepare(
      'SELECT password_hash FROM users WHERE id = ?'
    ).bind(user.id).first<{ password_hash: string }>()

    if (!dbUser || !dbUser.password_hash) {
      return jsonError('User password not found.', 400)
    }

    const { valid } = await verifyPassword(oldPassword, dbUser.password_hash)
    if (!valid) {
      return jsonError('Incorrect old password.', 400)
    }

    const hashedNewPassword = await hashPassword(newPassword)

    await env.DB.prepare(
      'UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).bind(hashedNewPassword, user.id).run()

    return json({ message: 'Password updated successfully' }, 200)

  } catch (err) {
    console.error('Change password error:', err)
    return jsonError('Internal server error', 500)
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
