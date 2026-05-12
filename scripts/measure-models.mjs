#!/usr/bin/env node
/**
 * measure-models.mjs
 * Reads every GLB/GLTF in public/models/ and extracts the real-world
 * bounding box by performing a full scene graph traversal.
 * Applies node matrices/transforms to accessor min/max values.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mat4, vec3, quat } from 'gl-matrix';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = path.join(__dirname, '../public/models');

function parseGLB(buffer) {
  const magic = buffer.readUInt32LE(0);
  if (magic !== 0x46546C67) throw new Error('Not a GLB file');
  const jsonChunkLength = buffer.readUInt32LE(12);
  const jsonStr = buffer.slice(20, 20 + jsonChunkLength).toString('utf8');
  return JSON.parse(jsonStr);
}

function parseGLTF(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function getLocalMatrix(node) {
  const m = mat4.create();
  if (node.matrix) {
    mat4.copy(m, node.matrix);
  } else {
    const t = node.translation ? vec3.fromValues(...node.translation) : vec3.fromValues(0, 0, 0);
    const r = node.rotation ? quat.fromValues(...node.rotation) : quat.fromValues(0, 0, 0, 1);
    const s = node.scale ? vec3.fromValues(...node.scale) : vec3.fromValues(1, 1, 1);
    mat4.fromRotationTranslationScale(m, r, t, s);
  }
  return m;
}

function traverse(gltf, nodeIdx, parentMatrix, globalMin, globalMax) {
  const node = gltf.nodes[nodeIdx];
  if (!node) return;

  const localMatrix = getLocalMatrix(node);
  const globalMatrix = mat4.create();
  mat4.multiply(globalMatrix, parentMatrix, localMatrix);

  if (node.mesh !== undefined) {
    const mesh = gltf.meshes[node.mesh];
    for (const prim of mesh.primitives || []) {
      if (prim.attributes && prim.attributes.POSITION !== undefined) {
        const acc = gltf.accessors[prim.attributes.POSITION];
        if (acc && acc.min && acc.max) {
          const min = acc.min;
          const max = acc.max;

          // 8 corners of the local bounding box
          const corners = [
            vec3.fromValues(min[0], min[1], min[2]),
            vec3.fromValues(max[0], min[1], min[2]),
            vec3.fromValues(min[0], max[1], min[2]),
            vec3.fromValues(max[0], max[1], min[2]),
            vec3.fromValues(min[0], min[1], max[2]),
            vec3.fromValues(max[0], min[1], max[2]),
            vec3.fromValues(min[0], max[1], max[2]),
            vec3.fromValues(max[0], max[1], max[2]),
          ];

          for (const c of corners) {
            vec3.transformMat4(c, c, globalMatrix);
            globalMin[0] = Math.min(globalMin[0], c[0]);
            globalMin[1] = Math.min(globalMin[1], c[1]);
            globalMin[2] = Math.min(globalMin[2], c[2]);
            globalMax[0] = Math.max(globalMax[0], c[0]);
            globalMax[1] = Math.max(globalMax[1], c[1]);
            globalMax[2] = Math.max(globalMax[2], c[2]);
          }
        }
      }
    }
  }

  if (node.children) {
    for (const childIdx of node.children) {
      traverse(gltf, childIdx, globalMatrix, globalMin, globalMax);
    }
  }
}

function getBoundsFromGltf(gltf) {
  const globalMin = [Infinity, Infinity, Infinity];
  const globalMax = [-Infinity, -Infinity, -Infinity];

  const sceneIdx = gltf.scene !== undefined ? gltf.scene : 0;
  const scene = gltf.scenes ? gltf.scenes[sceneIdx] : null;

  if (scene && scene.nodes) {
    const identity = mat4.create();
    for (const nodeIdx of scene.nodes) {
      traverse(gltf, nodeIdx, identity, globalMin, globalMax);
    }
  }

  if (!isFinite(globalMin[0])) return null;

  const sizeX = globalMax[0] - globalMin[0];
  const sizeY = globalMax[1] - globalMin[1];
  const sizeZ = globalMax[2] - globalMin[2];

  return { sizeX, sizeY, sizeZ };
}

const results = {};

const files = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith('.glb') || f.endsWith('.gltf'));

for (const file of files) {
  const filepath = path.join(MODELS_DIR, file);
  const name = path.basename(file, path.extname(file));
  try {
    let gltf;
    if (file.endsWith('.glb')) {
      const buffer = fs.readFileSync(filepath);
      gltf = parseGLB(buffer);
    } else {
      gltf = parseGLTF(filepath);
    }
    const bounds = getBoundsFromGltf(gltf);
    if (bounds) {
      results[name] = bounds;
      console.log(`✅  ${name.padEnd(30)} X:${bounds.sizeX.toFixed(3)}  Y:${bounds.sizeY.toFixed(3)}  Z:${bounds.sizeZ.toFixed(3)}`);
    } else {
      console.log(`⚠️  ${name} — no POSITION accessors with min/max found`);
    }
  } catch (e) {
    console.log(`❌  ${name} — ${e.message}`);
  }
}

console.log('\n--- TypeScript asset dimensions map ---\n');
console.log('export const ASSET_DIMENSIONS: Record<string, { w: number; h: number }> = {');
for (const [name, b] of Object.entries(results)) {
  const longest = Math.max(b.sizeX, b.sizeZ);
  const normW = b.sizeX / longest;
  const normH = b.sizeZ / longest;
  console.log(`  '${name}': { w: ${normW.toFixed(4)}, h: ${normH.toFixed(4)} },  // raw: ${b.sizeX.toFixed(2)}m x ${b.sizeZ.toFixed(2)}m`);
}
console.log('}');
