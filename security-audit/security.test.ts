import { describe,it,expect,vi,afterEach } from 'vitest'
import { createHash } from 'node:crypto'
import { database,call,A,B,DESIGN_B,config,SECRET } from './test-db'
import * as auth from '../functions/_auth-utils'
import * as design from '../functions/api/designs/[id]'
import * as designs from '../functions/api/designs/index'
import * as google from '../functions/api/auth/google'
import * as otp from '../functions/api/auth/verify-otp'
import * as login from '../functions/api/auth/login'
import * as register from '../functions/api/auth/register'
import * as me from '../functions/api/auth/me'
import { codeDigest } from '../functions/_verification'
import { rateLimit,readJson } from '../functions/_security'
import { validateDesign } from '../shared/validation'
import { backfillPasswords } from '../functions/_password-migration'
afterEach(()=>vi.unstubAllGlobals())
describe('password and login security',()=>{
 it('backfills dormant passwords in bounded batches without changing credentials',async()=>{
  const {db,sql}=database();const password='Synthetic-password-123'
  const legacy=createHash('sha256').update(password).digest('base64')
  sql.prepare('UPDATE users SET password_hash=?').run(legacy)
  expect(await backfillPasswords(db,1)).toEqual({scanned:1,upgraded:1})
  expect(sql.prepare('SELECT count(*) AS n FROM users WHERE password_hash=?').get(legacy)?.n).toBe(1)
  expect(await backfillPasswords(db,1)).toEqual({scanned:1,upgraded:1})
  expect(await backfillPasswords(db,1)).toEqual({scanned:0,upgraded:0})
  for(const row of sql.prepare('SELECT password_hash FROM users').all()) expect(await auth.verifyPassword(password,String(row.password_hash))).toBe(true)
  await expect(backfillPasswords(db,101)).rejects.toThrow('Invalid batch size')
 })
 it('salts each password, rejects wrong passwords and malformed stored parameters',async()=>{
  const a=await auth.hashPassword('Synthetic-password-123'),b=await auth.hashPassword('Synthetic-password-123')
  expect(a).not.toBe(b);expect(a).toMatch(/^pbkdf2-sha256-v1\$600000\$/)
  expect(await auth.verifyPassword('Synthetic-password-123',a)).toBe(true)
  expect(await auth.verifyPassword('wrong',a)).toBe(false)
  expect(await auth.verifyPassword('Synthetic-password-123',a.replace('600000','1'))).toBe(false)
 })
 it('upgrades legacy hashes on successful login without changing the password',async()=>{
  const {db,sql}=database();const legacy=createHash('sha256').update('Synthetic-password-123').digest('base64')
  sql.prepare('UPDATE users SET password_hash=? WHERE id=?').run(legacy,A)
  const r=await call(login.onRequestPost,db,'/api/auth/login','POST',{email:'a@example.test',password:'Synthetic-password-123'})
  expect(r.status).toBe(200);expect(sql.prepare('SELECT password_hash FROM users WHERE id=?').get(A)?.password_hash).not.toBe(legacy)
  expect(r.headers.get('Set-Cookie')).toContain('HttpOnly; Secure; SameSite=Lax')
 })
 it('rejects a password retained on a previously Google-linked account',async()=>{
  const {db,sql}=database();sql.prepare('UPDATE users SET google_id=?,password_hash=? WHERE id=?').run('google-a',await auth.hashPassword('Synthetic-password-123'),A)
  expect((await call(login.onRequestPost,db,'/api/auth/login','POST',{email:'a@example.test',password:'Synthetic-password-123'})).status).toBe(401)
 })
 it('throttles by account and exposes Retry-After',async()=>{
  const {db}=database()
  for(let i=0;i<10;i++) await rateLimit(db,'login:email','a@example.test',10,900)
  const r=await call(login.onRequestPost,db,'/api/auth/login','POST',{email:'a@example.test',password:'wrong'})
  expect(r.status).toBe(429);expect(Number(r.headers.get('Retry-After'))).toBeGreaterThan(0)
 })
 it('atomically limits concurrent requests and resets after expiry',async()=>{
  const {db,sql}=database()
  const results=await Promise.allSettled(Array.from({length:8},()=>rateLimit(db,'test','shared',5,60)))
  expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(5)
  sql.exec('UPDATE security_limits SET reset_at=0')
  await expect(rateLimit(db,'test','shared',5,60)).resolves.toBeUndefined()
 })
})
describe('registration and single-use verification',()=>{
 it('uses identical registration replies and stores only a keyed code digest',async()=>{
  const {db,sql}=database();let emailBody:any
  vi.stubGlobal('fetch',vi.fn(async(_:unknown,options:any)=>{emailBody=JSON.parse(options.body);return Response.json({id:'test'})}))
  const known=await call(register.onRequestPost,db,'/api/auth/register','POST',{email:'a@example.test',password:'Synthetic-password-123'})
  const unknown=await call(register.onRequestPost,db,'/api/auth/register','POST',{email:'new@example.test',password:'Synthetic-password-123'})
  expect(known.status).toBe(202);expect(await known.text()).toBe(await unknown.text())
  const code=emailBody.html.match(/>(\d{6})<\/div>/)[1]
  const row=sql.prepare('SELECT * FROM registration_challenges WHERE email=?').get('new@example.test')!
  expect(row.code_hash).not.toBe(code);expect(row.code_hash).toBe(await codeDigest(SECRET,'new@example.test',code))
  expect(sql.prepare('SELECT id FROM users WHERE email=?').get('new@example.test')).toBeUndefined()
  const results=await Promise.all(Array.from({length:2},()=>call(otp.onRequestPost,db,'/api/auth/verify-otp','POST',{email:'new@example.test',code})))
  expect(results.map(r=>r.status).sort()).toEqual([200,400])
  const signed=await call(login.onRequestPost,db,'/api/auth/login','POST',{email:'new@example.test',password:'Synthetic-password-123'})
  expect(signed.status).toBe(200)
 })
 it('does not retain a pre-registration password after the email owner registers',async()=>{
  const {db,sql}=database();sql.prepare('UPDATE users SET email_verified=0,password_hash=? WHERE id=?').run('attacker-known',A)
  let code=''
  vi.stubGlobal('fetch',vi.fn(async(_:unknown,options:any)=>{code=JSON.parse(options.body).html.match(/>(\d{6})<\/div>/)[1];return Response.json({id:'test'})}))
  await call(register.onRequestPost,db,'/api/auth/register','POST',{email:'a@example.test',password:'Owners-new-password-123'})
  expect((await call(otp.onRequestPost,db,'/api/auth/verify-otp','POST',{email:'a@example.test',code})).status).toBe(200)
  expect(await auth.verifyPassword('Owners-new-password-123',String(sql.prepare('SELECT password_hash FROM users WHERE id=?').get(A)?.password_hash))).toBe(true)
 })
 it('rejects expired, wrong-account and repeatedly guessed codes',async()=>{
  const {db,sql}=database();const hash=await codeDigest(SECRET,'new@example.test','123456')
  sql.prepare('INSERT INTO registration_challenges VALUES(?,?,?,?,?,?)').run('new@example.test','e'.repeat(32),'test',null,hash,Math.floor(Date.now()/1000)-1)
  expect((await call(otp.onRequestPost,db,'/api/auth/verify-otp','POST',{email:'new@example.test',code:'123456'})).status).toBe(400)
  expect((await call(otp.onRequestPost,db,'/api/auth/verify-otp','POST',{email:'other@example.test',code:'123456'})).status).toBe(400)
  for(let i=0;i<4;i++)expect((await call(otp.onRequestPost,db,'/api/auth/verify-otp','POST',{email:'new@example.test',code:'000000'})).status).toBe(400)
  expect((await call(otp.onRequestPost,db,'/api/auth/verify-otp','POST',{email:'new@example.test',code:'123456'})).status).toBe(429)
 })
 it('fails closed when the verification secret is not configured',async()=>{
  const {db}=database()
  expect((await call(register.onRequestPost,db,'/api/auth/register','POST',{email:'new@example.test',password:'Synthetic-password-123'},{},{SECURITY_SECRET:undefined})).status).toBe(503)
 })
})
describe('ownership and sessions',()=>{
 it('denies cross-user read, rename, modification, deletion and injection',async()=>{
  const {db,sql}=database();const path='/api/designs/'+DESIGN_B
  expect((await call(design.onRequestGet,db,path)).status).toBe(404)
  expect((await call(design.onRequestPut,db,path,'PUT',{name:'changed'})).status).toBe(404)
  expect((await call(design.onRequestDelete,db,path,'DELETE')).status).toBe(404)
  expect(sql.prepare('SELECT name FROM designs WHERE id=?').get(DESIGN_B)?.name).toBe('Private B')
  expect((await call(design.onRequestGet,db,"/api/designs/' OR 1=1 --")).status).toBe(404)
  expect((await call(designs.onRequestPost,db,'/api/designs','POST',{name:'x',config,elements:[],user_id:B})).status).toBe(400)
 })
 it('creates only owned projects, returns small summaries and enforces the quota concurrently',async()=>{
  const {db,sql}=database()
  const results=await Promise.all(Array.from({length:12},(_,i)=>call(designs.onRequestPost,db,'/api/designs','POST',{name:'A '+i,config,elements:[]})))
  expect(results.filter(r=>r.status===201)).toHaveLength(10);expect(results.filter(r=>r.status===403)).toHaveLength(2)
  expect(sql.prepare('SELECT COUNT(*) n FROM designs WHERE user_id=?').get(A)?.n).toBe(10)
  const list=await (await call(designs.onRequestGet,db,'/api/designs')).json() as any
  expect(list.designs).toHaveLength(10);expect(list.designs[0]).not.toHaveProperty('elements')
 })
 it('rejects expired and logged-out sessions',async()=>{
  const {db,sql}=database()
  sql.prepare('UPDATE sessions SET expires_at=?').run(new Date(Date.now()-1000).toISOString())
  expect(await auth.getSessionUser(db,'sa')).toBeNull()
  sql.exec("UPDATE sessions SET expires_at='2099-01-01T00:00:00Z'")
  await call(me.onRequestDelete,db,'/api/auth/me','DELETE')
  expect((await call(designs.onRequestGet,db,'/api/designs')).status).toBe(401)
 })
})
describe('request validation',()=>{
 it('rejects origin forgery and missing Origin, even for logout',async()=>{
  const {db}=database()
  expect((await call(me.onRequestDelete,db,'/api/auth/me','DELETE',undefined,{Origin:'https://evil.kreatekaro.co'})).status).toBe(403)
  expect((await call(me.onRequestDelete,db,'/api/auth/me','DELETE',undefined,{Origin:''})).status).toBe(403)
 })
 it('rejects malformed, oversized and non-JSON bodies',async()=>{
  for(const [body,status,type] of [['{',400,'application/json'],['x'.repeat(100),413,'application/json'],['{}',415,'text/plain']]){
    await expect(readJson(new Request('https://test',{method:'POST',headers:{'Content-Type':type as string},body:body as string}),32)).rejects.toMatchObject({status})
  }
 })
 it('rejects wrong types, negative dimensions, duplicate IDs, prototype keys and deep JSON',()=>{
  for(const data of [
    {name:'x',config:{...config,width:-1},elements:[]},
    {name:'x',config,elements:{}},
    {name:'x',config,elements:[{id:'x',type:'wall'},{id:'x',type:'wall'}]},
    {name:'x',config,elements:[JSON.parse('{"id":"x","type":"wall","__proto__":{}}')]},
    {name:'x',config,elements:[{id:'x',type:'wall',width:Infinity}]},
    {name:'x',config,elements:[{id:'x',type:'wall',platesCount:10001}]},
  ])expect(()=>validateDesign(data)).toThrow()
  let nested:any={};for(let i=0;i<20;i++)nested={next:nested}
  expect(()=>validateDesign({name:'x',config:{...config,extra:nested},elements:[]})).toThrow()
 })
 it('sets private response headers without wildcard credentials',()=>{
  const response=auth.json({private:true})
  expect(response.headers.get('Cache-Control')).toBe('no-store')
  expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull()
  expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
 })
})
describe('OAuth identity and browser binding',()=>{
 async function begin(db:any){
  const r=await call(google.onRequestGet,db,'/api/auth/google')
  const location=new URL(r.headers.get('Location')!)
  expect(location.searchParams.get('code_challenge_method')).toBe('S256')
  return {state:location.searchParams.get('state')!,cookie:r.headers.get('Set-Cookie')!.split(';')[0]}
 }
 function profile(email:string,verified=true){
  const mock=vi.fn().mockResolvedValueOnce(Response.json({access_token:'test'})).mockResolvedValueOnce(Response.json({sub:'new-google',email,email_verified:verified,name:'New'}));vi.stubGlobal('fetch',mock);return mock
 }
 it('rejects absent state before exchanging tokens',async()=>{
  const {db}=database();const fetch=vi.fn();vi.stubGlobal('fetch',fetch)
  expect((await call(google.onRequestGet,db,'/api/auth/google?code=test')).status).toBe(400);expect(fetch).not.toHaveBeenCalled()
 })
 it('rejects unverified identities and verified collisions with password accounts',async()=>{
  const {db}=database();let start=await begin(db);profile('a@example.test',false)
  expect((await call(google.onRequestGet,db,'/api/auth/google?code=test&state='+start.state,'GET',undefined,{Cookie:start.cookie})).status).toBe(400)
  start=await begin(db);profile('a@example.test')
  expect((await call(google.onRequestGet,db,'/api/auth/google?code=test&state='+start.state,'GET',undefined,{Cookie:start.cookie})).status).toBe(409)
 })
 it('creates a verified Google account once; rejects state replay and expiration',async()=>{
  const {db,sql}=database();const start=await begin(db);profile('new@example.test')
  const path='/api/auth/google?code=test&state='+start.state
  const r=await call(google.onRequestGet,db,path,'GET',undefined,{Cookie:start.cookie})
  expect(r.status).toBe(302);expect(r.headers.get('Set-Cookie')).toContain('Max-Age=0')
  expect((await call(google.onRequestGet,db,path,'GET',undefined,{Cookie:start.cookie})).status).toBe(400)
  const expired=await begin(db);sql.exec('UPDATE oauth_challenges SET expires_at=0')
  expect((await call(google.onRequestGet,db,'/api/auth/google?code=test&state='+expired.state,'GET',undefined,{Cookie:expired.cookie})).status).toBe(400)
 })
})
