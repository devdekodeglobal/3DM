import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
export const A='a'.repeat(32), B='b'.repeat(32), DESIGN_B='d'.repeat(32)
export const config={width:3,depth:3,wallThickness:0.1,walls:{north:true,south:false,east:true,west:true}}
export const SECRET='synthetic-test-secret-only-1234567890123456'
export function database() {
 const sql=new DatabaseSync(':memory:')
 sql.exec(readFileSync('schema.sql','utf8'));sql.exec(readFileSync('migrations/0001_security.sql','utf8'))
 const db:any={prepare(query:string){let args:any[]=[]; return {
  bind(...values:any[]){args=values;return this},
  execute(mode:string){const stmt=sql.prepare(query);return mode==='first'?stmt.get(...args)??null:mode==='all'?{results:stmt.all(...args)}:{meta:stmt.run(...args)}},
  async first(){return this.execute('first')},async all(){return this.execute('all')},async run(){return this.execute('run')}
 }},async batch(statements:any[]){sql.exec('BEGIN');try{const result=statements.map(s=>s.execute('run'));sql.exec('COMMIT');return result}catch(e){sql.exec('ROLLBACK');throw e}}}
 sql.prepare('INSERT INTO users(id,email,email_verified) VALUES(?,?,1),(?,?,1)').run(A,'a@example.test',B,'b@example.test')
 sql.prepare('INSERT INTO sessions(id,user_id,expires_at) VALUES(?,?,?)').run('sa',A,'2099-01-01T00:00:00.000Z')
 sql.prepare('INSERT INTO designs(id,user_id,name,config) VALUES(?,?,?,?)').run(DESIGN_B,B,'Private B',JSON.stringify(config))
 return {sql,db}
}
export async function call(handler:any,db:any,path:string,method='GET',body?:unknown,headers:Record<string,string>={},env:Record<string,unknown>={}) {
 const tasks:Promise<unknown>[]=[]
 const context:any={env:{DB:db,SECURITY_SECRET:SECRET,GOOGLE_CLIENT_ID:'test',GOOGLE_CLIENT_SECRET:'test',RESEND_API_KEY:'test',...env},params:{id:path.split('?')[0].split('/').pop()},request:new Request('https://www.kreatekaro.co'+path,{method,headers:{Origin:'https://www.kreatekaro.co',Cookie:'session=sa','Content-Type':'application/json',...headers},body:body===undefined?undefined:JSON.stringify(body)}),waitUntil:(p:Promise<unknown>)=>tasks.push(p)}
 const response=await handler(context);await Promise.all(tasks);return response
}
