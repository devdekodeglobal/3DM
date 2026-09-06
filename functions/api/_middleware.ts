import { secure, rateLimit, clientIp, HttpError } from '../_security'
export const onRequest = secure<{ DB: D1Database }>(async (context) => {
  const { request, env } = context
  const path = new URL(request.url).pathname
  const allowed = path === '/api/auth/me' ? ['GET','DELETE']
    : path === '/api/auth/google' ? ['GET']
    : ['/api/auth/register','/api/auth/login','/api/auth/verify-otp'].includes(path) ? ['POST']
    : path === '/api/designs' ? ['GET','POST']
    : /^\/api\/designs\/[a-f0-9]{32}$/.test(path) ? ['GET','PUT','DELETE'] : []
  if (!allowed.length) throw new HttpError('API route not found', 404)
  if (!allowed.includes(request.method)) throw new HttpError('Method not allowed', 405)
  await rateLimit(env.DB, 'api:ip', clientIp(request), 120, 60)
  return context.next()
})
