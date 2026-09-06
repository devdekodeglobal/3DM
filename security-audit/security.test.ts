import { describe, it, expect, vi } from 'vitest'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import * as auth from '../functions/_auth-utils'
import * as design from '../functions/api/designs/[id]'
import * as designs from '../functions/api/designs/index'
import * as google from '../functions/api/auth/google'
import * as otp from '../functions/api/auth/verify-otp'
import * as login from '../functions/api/auth/login'

// Real SQLite execution of handler SQL; D1 API adapter, synthetic records only.
function database() {
 const sql = new DatabaseSync(':memory:'); sql.exec(readFileSync('schema.sql','utf8'))
 const db:any = { prepare(query:string) { let args:any[]=[]; return {
   bind(...values:any[]) { args=values; return this },
   async first() { return sql.prepare(query).get(...args) ?? null },
   async all() { return {results:sql.prepare(query).all(...args)} },
   async run() { return {meta:sql.prepare(query).run(...args)} },
 }}, async batch(statements:any[]) { return Promise.all(statements.map(s=>s.run())) } }
 sql.exec("INSERT INTO users(id,email,email_verified) VALUES ('a','a@example.test',1),('b','b@example.test',1)")
 sql.exec("INSERT INTO sessions(id,user_id,expires_at) VALUES ('sa','a','2099-01-01T00:00:00.000Z')")
 sql.exec("INSERT INTO designs(id,user_id,name) VALUES ('db','b','Private B')")
 return {sql,db}
}
const context=(db:any,method='GET',body?:any,id='db')=>({env:{DB:db},params:{id},request:new Request('https://www.kreatekaro.co/api/designs/'+id,{method,headers:{Cookie:'session=sa','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined})}) as any
describe('ownership and SQL binding',()=>{
 it('denies read/update/rename/delete across users and SQL metacharacters',async()=>{
  const {db,sql}=database()
  expect((await design.onRequestGet(context(db))).status).toBe(404)
  expect((await design.onRequestPut(context(db,'PUT',{name:'changed',user_id:'a'}))).status).toBe(404)
  await design.onRequestDelete(context(db,'DELETE'))
  expect(sql.prepare("SELECT name FROM designs WHERE id='db'").get()?.name).toBe('Private B')
  expect((await design.onRequestGet(context(db,'GET',undefined,"' OR 1=1 --"))).status).toBe(404)
  const r=await designs.onRequestPost(context(db,'POST',{name:'A',user_id:'b',config:{},elements:[]}))
  expect(r.status).toBe(201)
  expect(sql.prepare("SELECT user_id FROM designs WHERE name='A'").get()?.user_id).toBe('a')
  const list:any=await (await designs.onRequestGet(context(db))).json()
  expect(list.designs).toHaveLength(1)
 })
 it('rejects a logged-out session and has secure cookie attributes',async()=>{
  const {db}=database(); await auth.deleteSession(db,'sa')
  expect((await design.onRequestGet(context(db))).status).toBe(401)
  expect(auth.setSessionCookie('test')).toMatch(/HttpOnly; Secure; SameSite=Lax/)
 })
})
describe('original vulnerabilities and regression checks',()=>{
 it('password storage baseline: identical passwords produce identical hashes',async()=>{
  expect(await auth.hashPassword('Synthetic-only-123')).toBe(await auth.hashPassword('Synthetic-only-123'))
 })
 it('expired session on current UTC day must be denied',async()=>{
  const {db,sql}=database(); const expired=new Date(Date.now()-60000).toISOString()
  sql.prepare("UPDATE sessions SET expires_at=? WHERE id='sa'").run(expired)
  expect(await auth.getSessionUser(db,'sa')).toBeNull()
 })
 it('expired OTP must be denied',async()=>{
  const {db,sql}=database()
  sql.prepare("INSERT INTO otp_codes(id,email,code,type,expires_at) VALUES ('o','a@example.test','123456','verify_email',?)").run(new Date(Date.now()-60000).toISOString())
  const r=await otp.onRequestGet({env:{DB:db},request:new Request('https://www.kreatekaro.co/api/auth/verify-otp?email=a@example.test&code=123456')} as any)
  expect(r.status).toBe(400)
 })
 it('OAuth callback without state must stop before token exchange',async()=>{
  const {db}=database(); const mock=vi.fn(async()=>new Response('{}',{status:400})); vi.stubGlobal('fetch',mock)
  const r=await google.onRequestGet({env:{DB:db,GOOGLE_CLIENT_ID:'test',GOOGLE_CLIENT_SECRET:'test'},request:new Request('https://www.kreatekaro.co/api/auth/google?code=synthetic')} as any)
  vi.unstubAllGlobals(); expect(mock).not.toHaveBeenCalled(); expect(r.status).toBe(400)
 })
 it('unverified Google email must not link or authenticate',async()=>{
  const {db,sql}=database(); const mock=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({access_token:'test'}))).mockResolvedValueOnce(new Response(JSON.stringify({sub:'google-a',email:'a@example.test',email_verified:false,name:'test'})))
  vi.stubGlobal('fetch',mock)
  const r=await google.onRequestGet({env:{DB:db,GOOGLE_CLIENT_ID:'test',GOOGLE_CLIENT_SECRET:'test'},request:new Request('https://www.kreatekaro.co/api/auth/google?code=synthetic&state=test',{headers:{Cookie:'oauth_state=test'}})} as any)
  vi.unstubAllGlobals(); expect(r.status).toBe(400); expect(sql.prepare("SELECT google_id FROM users WHERE id='a'").get()?.google_id).toBeNull()
 })
 it('documents absence of application login throttling with 12 bounded synthetic attempts',async()=>{
  const {db}=database()
  for(let i=0;i<12;i++) expect((await login.onRequestPost({env:{DB:db},request:new Request('https://www.kreatekaro.co/api/auth/login',{method:'POST',body:JSON.stringify({email:'missing@example.test',password:'wrong'})})} as any)).status).toBe(401)
 })
 it('documents missing design schema: object elements accepted',async()=>{
  const {db}=database(); const r=await designs.onRequestPost(context(db,'POST',{name:'Malformed',config:{width:-1},elements:{invalid:true}})); expect(r.status).toBe(201)
 })
 it('authenticated responses must not be cached',async()=>{ expect(auth.json({private:true}).headers.get('Cache-Control')).toBe('no-store') })
 it('Google verified email collision cannot promote a pre-registered account',async()=>{
  const {db,sql}=database(); sql.exec("UPDATE users SET email_verified=0,password_hash='attacker-known' WHERE id='a'")
  vi.stubGlobal('fetch',vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({access_token:'test'}))).mockResolvedValueOnce(new Response(JSON.stringify({sub:'new-sub',email:'a@example.test',email_verified:true,name:'A',picture:'https://example.test/a.png'}))))
  const r=await google.onRequestGet({env:{DB:db},request:new Request('https://www.kreatekaro.co/api/auth/google?code=test&state=test',{headers:{Cookie:'oauth_state=test'}})} as any)
  vi.unstubAllGlobals(); expect(r.status).toBe(409)
  expect(sql.prepare("SELECT email_verified FROM users WHERE id='a'").get()?.email_verified).toBe(0)
 })
 it('OAuth starts with bound state and ignores forwarded host headers',async()=>{
  const {db}=database(); const r=await google.onRequestGet({env:{DB:db,GOOGLE_CLIENT_ID:'test'},request:new Request('https://www.kreatekaro.co/api/auth/google',{headers:{'x-forwarded-host':'attacker.invalid'}})} as any)
  const location=new URL(r.headers.get('Location')!); expect(location.searchParams.get('redirect_uri')).toBe('https://www.kreatekaro.co/api/auth/google')
  expect(r.headers.get('Set-Cookie')).toContain(`oauth_state=${location.searchParams.get('state')}`)
 })
 it('new verified Google subject authenticates and clears OAuth state',async()=>{
  const {db}=database()
  vi.stubGlobal('fetch',vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({access_token:'test'}))).mockResolvedValueOnce(new Response(JSON.stringify({sub:'new-sub',email:'new@example.test',email_verified:true,name:'New',picture:'https://example.test/a.png'}))))
  const r=await google.onRequestGet({env:{DB:db},request:new Request('https://www.kreatekaro.co/api/auth/google?code=test&state=test',{headers:{Cookie:'oauth_state=test'}})} as any)
  vi.unstubAllGlobals(); expect(r.status).toBe(302); expect(r.headers.get('Set-Cookie')).toContain('session='); expect(r.headers.get('Set-Cookie')).toContain('Max-Age=0')
 })
 it('valid OTP succeeds once and sequential replay fails',async()=>{
  const {db,sql}=database(); sql.prepare("INSERT INTO otp_codes(id,email,code,type,expires_at) VALUES ('o','a@example.test','123456','verify_email',?)").run(new Date(Date.now()+600000).toISOString())
  const ctx={env:{DB:db},request:new Request('https://www.kreatekaro.co/api/auth/verify-otp?email=a@example.test&code=123456')} as any
  expect((await otp.onRequestGet(ctx)).status).toBe(200); expect((await otp.onRequestGet(ctx)).status).toBe(400)
 })
})
