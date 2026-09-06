import { it,expect } from 'vitest'
import { validateGlb,imageDimensions } from '../src/lib/assetValidation'
function glb(model:unknown){const text=JSON.stringify(model);const bytes=new TextEncoder().encode(text.padEnd(Math.ceil(text.length/4)*4,' '));const buffer=new ArrayBuffer(bytes.length+20);const view=new DataView(buffer);view.setUint32(0,0x46546c67,true);view.setUint32(4,2,true);view.setUint32(8,buffer.byteLength,true);view.setUint32(12,bytes.length,true);view.setUint32(16,0x4e4f534a,true);new Uint8Array(buffer,20).set(bytes);return new Blob([buffer])}
it('accepts a minimal GLB and rejects extension spoofing, oversized and cyclic models',async()=>{
 await expect(validateGlb(glb({asset:{version:'2.0'},nodes:[{}]}),'model.glb')).resolves.toBeUndefined()
 await expect(validateGlb(new Blob(['not a model']),'bad.glb')).rejects.toThrow()
 await expect(validateGlb(glb({asset:{version:'2.0'}}),'bad.gltf')).rejects.toThrow()
 await expect(validateGlb(glb({asset:{version:'2.0'},nodes:[{children:[0]}]}),'cycle.glb')).rejects.toThrow()
 await expect(validateGlb(glb({asset:{version:'2.0'},buffers:[{uri:'https://evil.test/a.bin',byteLength:0}]}),'external.glb')).rejects.toThrow()
 await expect(validateGlb(glb({asset:{version:'2.0'},extensionsUsed:['KHR_draco_mesh_compression']}),'compressed.glb')).rejects.toThrow()
 await expect(validateGlb(glb({asset:{version:'2.0'},accessors:[{count:1000001}]}),'huge.glb')).rejects.toThrow()
})
it('rejects invalid raster headers before browser decoding',()=>{expect(()=>imageDimensions(new Uint8Array(30))).toThrow()})
