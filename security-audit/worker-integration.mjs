import { build } from 'esbuild'
import { Miniflare } from 'miniflare'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const bundle = await build({entryPoints:['security-audit/runtime-worker.ts'],bundle:true,write:false,format:'esm',platform:'neutral',external:['node:*']})
let deliveredCode
let deliveryResolve
let providerCalls=0
const delivered=new Promise(resolve=>{deliveryResolve=resolve})
const mf = new Miniflare({modules:true,script:bundle.outputFiles[0].text,compatibilityDate:'2026-07-01',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],bindings:{SECURITY_SECRET:'local-test-secret-only-1234567890123456',RESEND_API_KEY:'synthetic',GOOGLE_CLIENT_ID:'synthetic',GOOGLE_CLIENT_SECRET:'synthetic'},outboundService:async(req)=>{
  if(new URL(req.url).hostname==='api.resend.com') {
    const mail=await req.json();deliveredCode=mail.html.match(/\b\d{6}\b/)?.[0]
    deliveryResolve();return Response.json({id:'test'})
  }
  if(new URL(req.url).hostname==='oauth2.googleapis.com') {
    providerCalls++;const data=new URLSearchParams(await req.text());assert.equal(data.get('code_verifier')?.length,64)
    return Response.json({access_token:'synthetic-token'})
  }
  if(new URL(req.url).hostname==='www.googleapis.com')return Response.json({sub:'synthetic-google-subject',email:'google@example.test',email_verified:true,name:'Fixture'})
  throw new Error('Unexpected external request blocked')
}})
try {
  const db=await mf.getD1Database('DB')
  for(const filename of ['schema.sql','migrations/0001_security.sql']) {
    const sql=(await fs.readFile(filename,'utf8')).replace(/--[^\n]*/g,'')
    for(const statement of sql.split(';').map(x=>x.trim()).filter(Boolean))await db.prepare(statement).run()
  }
  const begin=Date.now()
  const result=await mf.dispatchFetch('https://www.kreatekaro.co/__kdf')
  const text=await result.text(); assert.equal(result.status,200,text)
  const body=JSON.parse(text);assert.equal(body.valid,true);assert.equal(body.wrong,false)
  console.log('PASS actual workerd KDF round-trip, milliseconds:',Date.now()-begin,body.scheme)
  const me=await mf.dispatchFetch('https://www.kreatekaro.co/api/auth/me')
  assert.equal(me.status,200);assert.deepEqual(await me.json(),{user:null})
  assert.equal(me.headers.get('Cache-Control'),'no-store');assert.equal(me.headers.get('Access-Control-Allow-Origin'),null)
  const oldOtp=await mf.dispatchFetch('https://www.kreatekaro.co/api/auth/verify-otp?email=test&code=123456');assert.equal(oldOtp.status,405)
  const cross=await mf.dispatchFetch('https://www.kreatekaro.co/api/auth/login',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:'{}'});assert.equal(cross.status,403)
  console.log('PASS actual workerd + D1 API headers, unsupported method and cross-origin rejection')
  const send=(path,body,cookie,method='POST')=>mf.dispatchFetch('https://www.kreatekaro.co'+path,{method,redirect:'manual',headers:{Origin:'https://www.kreatekaro.co','Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})})
  const credentials={email:'local@example.test',password:'Synthetic-password-123'}
  assert.equal((await send('/api/auth/register',credentials)).status,202)
  await Promise.race([delivered,new Promise((_,reject)=>{const t=setTimeout(()=>reject(new Error('Mock email not delivered')),5000);t.unref()})])
  assert.match(deliveredCode,/^\d{6}$/)
  assert.equal(await db.prepare('SELECT id FROM users WHERE email=?').bind(credentials.email).first(),null)
  const verified=await Promise.all([1,2].map(()=>send('/api/auth/verify-otp',{email:credentials.email,code:deliveredCode})))
  assert.deepEqual(verified.map(r=>r.status).sort(),[200,400])
  const signedIn=await send('/api/auth/login',credentials);assert.equal(signedIn.status,200)
  const cookie=signedIn.headers.get('Set-Cookie').split(';')[0]
  const design={name:'Local fixture',config:{width:3,depth:3,wallThickness:0.1,walls:{north:true,south:true,east:true,west:true}},elements:[]}
  const saves=await Promise.all(Array.from({length:12},()=>send('/api/designs',design,cookie)))
  assert.equal(saves.filter(r=>r.status===201).length,10);assert.equal(saves.filter(r=>r.status===403).length,2)
  assert.equal((await send('/api/auth/me',undefined,cookie,'DELETE')).status,200)
  assert.equal((await send('/api/designs',undefined,cookie,'GET')).status,401)
  console.log('PASS actual D1 single-use verification, password login, atomic ten-design quota and logout revocation')
  const start=await send('/api/auth/google',undefined,undefined,'GET')
  const state=new URL(start.headers.get('Location')).searchParams.get('state')
  const stateCookie=start.headers.get('Set-Cookie').split(';')[0]
  const callback='/api/auth/google?code=synthetic&state='+state
  assert.equal((await send(callback,undefined,stateCookie,'GET')).status,302)
  assert.equal((await send(callback,undefined,stateCookie,'GET')).status,400)
  assert.equal(providerCalls,1)
  console.log('PASS actual workerd OAuth PKCE exchange and one-use state with mocked provider')
} finally { await mf.dispose() }
