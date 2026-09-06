// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { beforeEach,it,expect } from 'vitest'
import { prepareWorkspace,writeWorkspace,isCurrentScope,WORKSPACE_OWNER } from '../src/lib/workspacePrivacy'
import { saveAssetBlob,getAssetBlob,clearAssetBlobs } from '../src/lib/customAssetDB'
beforeEach(async()=>{localStorage.clear();await clearAssetBlobs()})
it('clears private drafts and blobs on logout, and prevents an old tab from restoring them',async()=>{
 const a=await prepareWorkspace('a')
 writeWorkspace(a,'stall-config','private-A');writeWorkspace(a,'stall-elements','private-elements')
 await saveAssetBlob('asset-a',new Blob(['private-model']),a.token)
 const guest=await prepareWorkspace(null)
 expect(localStorage.getItem('stall-config')).toBeNull();expect(localStorage.getItem('stall-elements')).toBeNull()
 expect(await getAssetBlob('asset-a')).toBeNull()
 writeWorkspace(a,'stall-config','stale-write')
 expect(localStorage.getItem('stall-config')).toBeNull()
 expect(isCurrentScope(a)).toBe(false);expect(isCurrentScope(guest)).toBe(true)
 await expect(saveAssetBlob('asset-a',new Blob(['old']),a.token)).rejects.toThrow()
})
it('separates direct account changes and preserves guest work only after explicit sign-in',async()=>{
 const a=await prepareWorkspace('a');writeWorkspace(a,'stall-config','private-A')
 const b=await prepareWorkspace('b');expect(localStorage.getItem('stall-config')).toBeNull();expect(b.owner).toBe('b')
 const guest=await prepareWorkspace(null);writeWorkspace(guest,'stall-config','guest-draft')
 await prepareWorkspace('a',true);expect(localStorage.getItem('stall-config')).toBe('guest-draft')
})
it('does not expose an unfinished cleanup scope',async()=>{
 localStorage.setItem(WORKSPACE_OWNER,JSON.stringify({owner:'a',token:'pending',ready:false}))
 expect(isCurrentScope({owner:'a',token:'pending',ready:false})).toBe(false)
 const result=await prepareWorkspace('a');expect(result.ready).toBe(true);expect(result.token).not.toBe('pending')
})
