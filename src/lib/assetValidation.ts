import { boundedTree, HttpError } from '../../shared/validation'
export const MAX_MODEL_BYTES = 25 * 1024 * 1024
export const MAX_LOGO_BYTES = 256 * 1024

export function imageDimensions(bytes: Uint8Array): { width: number; height: number } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (bytes.length >= 24 && view.getUint32(0) === 0x89504e47 && view.getUint32(4) === 0x0d0a1a0a) return { width: view.getUint32(16), height: view.getUint32(20) }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2
    while (offset + 9 < bytes.length) {
      if (bytes[offset++] !== 0xff) throw new HttpError('Invalid JPEG')
      while (bytes[offset] === 0xff) offset++
      const marker = bytes[offset++]
      if (marker === 0xda || marker === 0xd9) break
      const size = view.getUint16(offset)
      if (size < 2 || offset + size > bytes.length) break
      if ([0xc0,0xc1,0xc2].includes(marker)) return { height: view.getUint16(offset+3), width: view.getUint16(offset+5) }
      offset += size
    }
  }
  throw new HttpError('Use a valid PNG or JPEG image')
}
function pixelBudget(bytes: Uint8Array) {
  const { width, height } = imageDimensions(bytes)
  if (!width || !height || width > 4096 || height > 4096 || width * height > 16000000) throw new HttpError('Image dimensions exceed the 4096 pixel limit')
  return width * height
}
export async function validateLogo(file: File) {
  if (file.size > MAX_LOGO_BYTES) throw new HttpError('Logo must be at most 256 KiB')
  if (file.type === 'image/svg+xml' && /\.svg$/i.test(file.name)) {
    const value = await file.text()
    if (!/<svg[\s>]/i.test(value) || /<!DOCTYPE|<!ENTITY/i.test(value)) throw new HttpError('Invalid SVG logo')
  } else pixelBudget(new Uint8Array(await file.arrayBuffer()))
}

export async function validateGlb(file: Blob, name: string) {
  if (!/\.glb$/i.test(name) || file.size > MAX_MODEL_BYTES || file.size < 20) throw new HttpError('Use a self-contained GLB file up to 25 MiB')
  const buffer = await file.arrayBuffer()
  const view = new DataView(buffer)
  if (view.getUint32(0,true) !== 0x46546c67 || view.getUint32(4,true) !== 2 || view.getUint32(8,true) !== buffer.byteLength) throw new HttpError('Invalid GLB header')
  const size = view.getUint32(12,true)
  if (size > 1024*1024 || size % 4 || size + 20 > buffer.byteLength || view.getUint32(16,true) !== 0x4e4f534a) throw new HttpError('Invalid GLB document')
  let model: any
  try { model = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,size))) } catch { throw new HttpError('Invalid GLB JSON') }
  boundedTree(model, 0, { nodes: 0, numericLimit: MAX_MODEL_BYTES })
  if (model.asset?.version !== '2.0') throw new HttpError('Use a GLB 2.0 model')
  let binStart = 20 + size, binSize = 0
  if (binStart < buffer.byteLength) {
    if (binStart+8>buffer.byteLength || view.getUint32(binStart+4,true)!==0x004e4942) throw new HttpError('Invalid GLB binary chunk')
    binSize=view.getUint32(binStart,true);binStart+=8
    if (binStart+binSize!==buffer.byteLength) throw new HttpError('Invalid GLB binary length')
  }
  const list = (key: string, max: number): any[] => {
    const value = model[key] ?? []
    if (!Array.isArray(value) || value.length > max) throw new HttpError('Model exceeds safe complexity limits')
    return value
  }
  if (list('buffers',1).some(b=>b.uri || !Number.isInteger(b.byteLength) || b.byteLength<0 || b.byteLength>binSize)) throw new HttpError('GLB must embed all buffers')
  if (list('extensionsUsed',50).some(x=>['KHR_draco_mesh_compression','EXT_meshopt_compression','KHR_texture_basisu'].includes(x))) throw new HttpError('Please export an uncompressed GLB model')
  let vertices = 0
  for (const accessor of list('accessors',1000)) {
    if (!Number.isInteger(accessor.count) || accessor.count < 0 || (vertices += accessor.count) > 1000000) throw new HttpError('Model has too many vertices or indices')
  }
  const views = list('bufferViews',1000)
  for (const entry of views) if (entry.buffer !== 0 || !Number.isInteger(entry.byteLength) || entry.byteLength < 0 || !Number.isInteger(entry.byteOffset ?? 0) || (entry.byteOffset ?? 0)<0 || (entry.byteOffset ?? 0)+entry.byteLength>binSize) throw new HttpError('Invalid GLB buffer range')
  let pixels=0
  for (const image of list('images',16)) {
    const entry=views[image.bufferView]
    if (image.uri || !entry || !['image/png','image/jpeg'].includes(image.mimeType)) throw new HttpError('Model textures must be embedded PNG or JPEG images')
    pixels+=pixelBudget(new Uint8Array(buffer,binStart+(entry.byteOffset??0),entry.byteLength))
    if (pixels>32000000) throw new HttpError('Model textures are too large')
  }
  const nodes=list('nodes',1000)
  const visited=new Set<number>(), active=new Set<number>()
  const visit=(id:number,depth=0)=>{
    if (!Number.isInteger(id) || id<0 || id>=nodes.length || depth>32 || active.has(id)) throw new HttpError('Invalid model hierarchy')
    if (visited.has(id)) return
    active.add(id)
    if (nodes[id].children !== undefined && !Array.isArray(nodes[id].children)) throw new HttpError('Invalid model hierarchy')
    for (const child of nodes[id].children??[]) visit(child,depth+1)
    active.delete(id);visited.add(id)
  }
  nodes.forEach((_:unknown,i:number)=>visit(i))
  list('meshes',500);list('animations',100);list('materials',200)
}
