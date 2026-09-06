"""Check current source and build for exact local credential values; never emit values."""
from pathlib import Path
import json, subprocess
root=Path(__file__).resolve().parent.parent
secret_file=root/'.env'
values=[]
if secret_file.exists():
 for line in secret_file.read_text(encoding='utf8').splitlines():
  if '=' not in line:continue
  key,value=line.split('=',1);value=value.strip().strip('"\'')
  if ('SECRET' in key or 'KEY' in key) and len(value)>12:values.append(value.encode())
paths=subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard','-z'],cwd=root).decode().split('\0')
targets={root/x for x in paths if x}
targets.update((root/'dist').rglob('*.js'))
checked=0
for file in targets:
 if not file.is_file():continue
 data=file.read_bytes();checked+=1
 if any(value in data for value in values):raise RuntimeError('Known credential found in '+str(file.relative_to(root)))
result={'status':'PASS' if values else 'NOT TESTED: no local credential values available','files_checked':checked,'scope':'Exact locally configured secret values in current Git-visible files and built JavaScript; not a new historical pattern scan','values_emitted':False}
(root/'security-audit/known-secret-retest.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
