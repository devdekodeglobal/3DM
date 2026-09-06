// Local integration fixture only; never included in functions/ or public/.
import * as login from '../functions/api/auth/login'
import * as register from '../functions/api/auth/register'
import * as verify from '../functions/api/auth/verify-otp'
import * as google from '../functions/api/auth/google'
import * as me from '../functions/api/auth/me'
import * as designs from '../functions/api/designs/index'
import * as item from '../functions/api/designs/[id]'
import { onRequest as middleware } from '../functions/api/_middleware'
import { hashPassword, verifyPassword } from '../functions/_password'
const routes: Record<string, any> = { '/api/auth/login':login,'/api/auth/register':register,'/api/auth/verify-otp':verify,'/api/auth/google':google,'/api/auth/me':me,'/api/designs':designs }
export default { async fetch(request: Request, env: any, execution: ExecutionContext) {
  if (new URL(request.url).pathname === '/__kdf') {
    const hash = await hashPassword('Synthetic-password-123')
    return Response.json({valid:await verifyPassword('Synthetic-password-123',hash),wrong:await verifyPassword('wrong',hash),scheme:hash.split('$')[0]})
  }
  const path=new URL(request.url).pathname
  const route=routes[path] || item
  const handler=route['onRequest'+request.method[0]+request.method.slice(1).toLowerCase()]
  const context:any={request,env,params:{id:path.split('/').pop()},waitUntil:execution.waitUntil.bind(execution),next:()=>handler?handler(context):new Response('Missing',{status:404})}
  return middleware(context)
} }
