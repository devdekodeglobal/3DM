// Isolated browser profile, synthetic API, loopback server, no outbound network.
const {chromium}=require('C:/Users/abc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const http=require('node:http'), fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict')
const root=path.resolve('dist')
const headers=Object.fromEntries(fs.readFileSync('public/_headers','utf8').split(/\r?\n/).filter(s=>s.startsWith('  ')).map(s=>{const n=s.indexOf(':');return [s.slice(0,n).trim(),s.slice(n+1).trim()]}))
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'}
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname))
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end()}
 if(!fs.existsSync(file)||fs.statSync(file).isDirectory())file=path.join(root,'index.html')
 res.writeHead(200,{...headers,'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)
})
;(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port
 let browser
 try {
  try{browser=await chromium.launch({channel:'msedge',headless:true})}catch{browser=await chromium.launch({channel:'chrome',headless:true})}
  const context=await browser.newContext({viewport:{width:1440,height:1000}})
  let user={id:'synthetic-user-a',email:'local@example.test'}
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url())
   if(url.origin!==origin)return route.abort()
   if(url.pathname==='/api/auth/me') {if(route.request().method()==='DELETE')user=null;return route.fulfill({json:{user},headers:{'Cache-Control':'no-store'}})}
   if(url.pathname.startsWith('/api/'))return route.fulfill({json:{designs:[]},headers:{'Cache-Control':'no-store'}})
   return route.continue()
  })
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.addInitScript(()=>{window.cspViolations=[];document.addEventListener('securitypolicyviolation',e=>window.cspViolations.push(e.violatedDirective+': '+e.blockedURI))})
  await page.goto(origin+'/editor');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('kreatekaro-workspace-owner')||'null')?.ready)
  // Seed a valid draft under the authenticated ownership boundary, then render it.
  await page.evaluate(()=>{localStorage.setItem('stall-config',JSON.stringify({width:3,depth:3,wallThickness:0.1,walls:{north:false,south:false,east:false,west:false}}));localStorage.setItem('stall-elements',JSON.stringify([{id:'fixture-text',type:'text',x:50,y:50,text:'Private fixture',fontSize:20,fill:'#000'}]))})
  await page.reload();await page.getByTitle('Log Out',{exact:true}).waitFor({timeout:30000})
  assert.equal(await page.locator('canvas').count()>0,true)
  assert.deepEqual(errors,[])
  assert.deepEqual(await page.evaluate(()=>window.cspViolations),[])
  const other=await context.newPage();await other.goto(origin+'/editor');await other.getByTitle('Log Out',{exact:true}).waitFor()
  await page.getByTitle('Log Out',{exact:true}).click()
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('kreatekaro-workspace-owner')||'null')?.owner==='guest')
  await other.waitForFunction(()=>!localStorage.getItem('stall-elements'))
  await other.getByTitle('Log Out',{exact:true}).waitFor({state:'hidden'})
  assert.equal(await page.evaluate(()=>localStorage.getItem('stall-config')),null)
  assert.deepEqual(errors,[])
  console.log('PASS built editor renders a valid draft under enforced CSP; no page errors or CSP violations')
  console.log('PASS sign-out clears private drafts and unmounts the authenticated editor in both tabs')
 } finally {await browser?.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1})
