import { secure, rateLimit, clientIp, HttpError } from '../_security'
export const onRequest = secure<{ DB: D1Database }>(async (context) => {
  const { request, env } = context
  const path = new URL(request.url).pathname
  const allowed = path === '/api/auth/me' ? ['GET','DELETE']
    : path === '/api/auth/delete-account' ? ['DELETE']
    : (path === '/api/auth/google' || path === '/api/auth/verify-otp') ? ['GET']
    : ['/api/auth/register','/api/auth/login','/api/auth/reset-password','/api/auth/forgot-password','/api/auth/change-password'].includes(path) ? ['POST']
    : ['/api/designs', '/api/projects'].includes(path) ? ['GET','POST']
    : /^\/api\/(designs|projects)\/[a-f0-9-]+$/.test(path) ? ['GET','PUT','DELETE'] 
    : path === '/api/admin/users' ? ['GET']
    : /^\/api\/admin\/users\/[a-f0-9-]+$/.test(path) ? ['PUT','DELETE'] : []
  if (!allowed.length) throw new HttpError('API route not found', 404)
  if (!allowed.includes(request.method)) throw new HttpError('Method not allowed', 405)
  await rateLimit(env.DB, 'api:ip', clientIp(request), 120, 60)
  return context.next()
})
