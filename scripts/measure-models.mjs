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

const categories = [
  'armchairs-sofas-and-lounges',
  'barstools-and-stools',
  'chairs',
  'conference-and-office-furniture',
  'counters-and-showcases',
  'kitchen-and-miscellaneous',
  'tables-and-bar-tables'
];

function formatLabel(name) {
  return name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatCategoryLabel(cat) {
  const customLabels = {
    'armchairs-sofas-and-lounges': 'Sofas & Lounges',
    'barstools-and-stools': 'Stools & High Chairs',
    'chairs': 'Chairs & Seating',
    'conference-and-office-furniture': 'Office & Conference',
    'counters-and-showcases': 'Counters & Displays',
    'kitchen-and-miscellaneous': 'Kitchen & Utility',
    'tables-and-bar-tables': 'Tables & Desks'
  };
  return customLabels[cat] || cat;
}

const results = [];
const dimensionMap = {};

for (const cat of categories) {
  const catDir = path.join(MODELS_DIR, cat);
  if (!fs.existsSync(catDir)) {
    console.warn(`Warning: Category directory not found: ${catDir}`);
    continue;
  }
  
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.glb') || f.endsWith('.gltf'));
  
  for (const file of files) {
    const filepath = path.join(catDir, file);
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
        const longest = Math.max(bounds.sizeX, bounds.sizeZ);
        const normW = bounds.sizeX / longest;
        const normH = bounds.sizeZ / longest;
        
        results.push({
          id: name,
          category: cat,
          label: formatLabel(name),
          w: normW,
          h: normH
        });
        
        dimensionMap[name] = { w: normW, h: normH };
        console.log(`✅  [${cat}] ${name.padEnd(30)} X:${bounds.sizeX.toFixed(3)}  Y:${bounds.sizeY.toFixed(3)}  Z:${bounds.sizeZ.toFixed(3)}`);
      } else {
        console.log(`⚠️  [${cat}] ${name} — no POSITION accessors with min/max found`);
      }
    } catch (e) {
      console.log(`❌  [${cat}] ${name} — ${e.message}`);
    }
  }
}

const registryContent = `// Auto-generated by scripts/measure-models.mjs
export const ASSET_CATEGORIES = [
${categories.map(c => `  { id: '${c}', label: '${formatCategoryLabel(c)}' }`).join(',\n')}
];

export const ASSET_REGISTRY = [
${results.map(r => `  { id: '${r.id}', category: '${r.category}', label: '${r.label.replace(/'/g, "\\'")}', w: ${r.w.toFixed(4)}, h: ${r.h.toFixed(4)} }`).join(',\n')}
];

export const ASSET_DIMENSIONS: Record<string, { w: number; h: number }> = {
${Object.entries(dimensionMap).map(([k, v]) => `  '${k}': { w: ${v.w.toFixed(4)}, h: ${v.h.toFixed(4)} }`).join(',\n')}
};
`;

const destPath = path.join(__dirname, '../src/lib/assetRegistry.ts');
fs.writeFileSync(destPath, registryContent, 'utf8');
console.log(`\n✅ Generated asset registry at ${destPath}`);

