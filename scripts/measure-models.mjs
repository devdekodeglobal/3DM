#!/usr/bin/env node
/**
 * measure-models.mjs
 * Reads every GLB/GLTF in public/models/ and extracts the real-world
 * bounding box from the POSITION accessor min/max arrays stored in the
 * file's JSON chunk. Outputs a TypeScript-ready asset dimensions map.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MODELS_DIR = path.join(__dirname, '../public/models')

function parseGLB(buffer) {
  // GLB layout: 12-byte header | JSON chunk | optional BIN chunk
  const magic = buffer.readUInt32LE(0)
  if (magic !== 0x46546C67) throw new Error('Not a GLB file')
  const jsonChunkLength = buffer.readUInt32LE(12)
  const jsonStr = buffer.slice(20, 20 + jsonChunkLength).toString('utf8')
  return JSON.parse(jsonStr)
}

function parseGLTF(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'))
}

function getBoundsFromGltf(gltf) {
  // Collect min/max from all POSITION accessors (they always have min/max per spec)
  let globalMin = [Infinity, Infinity, Infinity]
  let globalMax = [-Infinity, -Infinity, -Infinity]

  const accessors = gltf.accessors || []
  const meshes = gltf.meshes || []

  // Find all accessor indices used as POSITION attributes
  const positionAccessorIndices = new Set()
  for (const mesh of meshes) {
    for (const prim of mesh.primitives || []) {
      if (prim.attributes && prim.attributes.POSITION !== undefined) {
        positionAccessorIndices.add(prim.attributes.POSITION)
      }
    }
  }

  for (const idx of positionAccessorIndices) {
    const acc = accessors[idx]
    if (!acc || !acc.min || !acc.max) continue
    for (let i = 0; i < 3; i++) {
      globalMin[i] = Math.min(globalMin[i], acc.min[i])
      globalMax[i] = Math.max(globalMax[i], acc.max[i])
    }
  }

  if (!isFinite(globalMin[0])) return null

  // x = width, y = height, z = depth
  const sizeX = globalMax[0] - globalMin[0]
  const sizeY = globalMax[1] - globalMin[1]
  const sizeZ = globalMax[2] - globalMin[2]

  return { sizeX, sizeY, sizeZ }
}

const results = {}

const files = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith('.glb') || f.endsWith('.gltf'))

for (const file of files) {
  const filepath = path.join(MODELS_DIR, file)
  const name = path.basename(file, path.extname(file))
  try {
    let gltf
    if (file.endsWith('.glb')) {
      const buffer = fs.readFileSync(filepath)
      gltf = parseGLB(buffer)
    } else {
      gltf = parseGLTF(filepath)
    }
    const bounds = getBoundsFromGltf(gltf)
    if (bounds) {
      results[name] = bounds
      console.log(`✅  ${name.padEnd(30)} X:${bounds.sizeX.toFixed(3)}  Y:${bounds.sizeY.toFixed(3)}  Z:${bounds.sizeZ.toFixed(3)}`)
    } else {
      console.log(`⚠️  ${name} — no POSITION accessors with min/max found`)
    }
  } catch (e) {
    console.log(`❌  ${name} — ${e.message}`)
  }
}

// Compute aspect ratios (footprint: width × depth)
console.log('\n--- TypeScript asset dimensions map ---\n')
console.log('export const ASSET_DIMENSIONS: Record<string, { w: number; h: number }> = {')
for (const [name, b] of Object.entries(results)) {
  // Normalize so the longest footprint side = 1.0, keep ratio
  const longest = Math.max(b.sizeX, b.sizeZ)
  const normW = b.sizeX / longest
  const normH = b.sizeZ / longest
  console.log(`  '${name}': { w: ${normW.toFixed(4)}, h: ${normH.toFixed(4)} },  // raw: ${b.sizeX.toFixed(2)}m x ${b.sizeZ.toFixed(2)}m`)
}
console.log('}')
