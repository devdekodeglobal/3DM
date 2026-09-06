import subprocess, re, json, pathlib
root=pathlib.Path.cwd()
patterns={
 'private_key':r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
 'google_secret':r'GOCSPX-[A-Za-z0-9_-]{16,}',
 'resend_key':r'\bre_[A-Za-z0-9]{20,}',
 'github_token':r'\b(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}',
 'aws_key':r'\bAKIA[A-Z0-9]{16}',
 'jwt':r'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}',
 'assigned_secret':r'(?i)(?:api[_-]?key|client[_-]?secret|password|access[_-]?token)\s*[:=]\s*[\x22\x27]([^\x22\x27\r\n]{16,})[\x22\x27]',
}
hits=[]; scanned=0
def scan(label,raw):
 global scanned
 scanned+=1
 text=raw.decode('utf8',errors='ignore')
 for kind,pat in patterns.items():
  for m in re.finditer(pat,text):
   hits.append({'location':label,'line':text.count('\n',0,m.start())+1,'kind':kind})
files=subprocess.check_output(['git','ls-files','-z']).decode().split('\0')
for f in files:
 p=root/f
 if p.is_file() and p.stat().st_size<2_000_000:scan(f,p.read_bytes())
for f in ['.env','.env.example']:
 p=root/f
 if p.exists():
  scan(f,p.read_bytes())
  print(f+' keys only: '+', '.join(re.findall(r'^([A-Za-z_][A-Za-z0-9_]*)=',p.read_text(),re.M)))
# Inspect every unique reachable historical textual blob, never emit contents.
objects=subprocess.check_output(['git','rev-list','--objects','--all']).decode().splitlines()
for line in objects:
 parts=line.split(' ',1)
 if len(parts)<2:continue
 oid,path=parts
 if not re.search(r'\.(?:tsx?|jsx?|mjs|cjs|json|ya?ml|toml|md|sql|env|txt)$|(?:^|/)\.env',path):continue
 raw=subprocess.check_output(['git','cat-file','blob',oid],stderr=subprocess.DEVNULL)
 if len(raw)<2_000_000:scan('history:'+oid[:12]+':'+path,raw)
for p in (root/'dist').rglob('*.js'):
 scan('dist/'+str(p.relative_to(root/'dist')),p.read_bytes())
(root/'security-audit/secret-scan.json').write_text(json.dumps({'objects_scanned':scanned,'matches_metadata_only':hits},indent=2))
print('Scanned',scanned,'objects; candidate metadata saved. No values emitted.')
audit=json.loads((root/'security-audit/dependency-audit-online.json').read_text(encoding='utf-8-sig'))
summary=[{k:a.get(k) for k in ['module_name','severity','title','url','patched_versions']}|{'findings':a.get('findings')} for a in audit.get('advisories',{}).values()]
(root/'security-audit/dependency-summary.json').write_text(json.dumps(summary,indent=2))
print('Dependency counts:',audit.get('metadata',{}))
print(json.dumps([{k:a[k] for k in ['module_name','severity','title']} for a in summary],indent=2))
