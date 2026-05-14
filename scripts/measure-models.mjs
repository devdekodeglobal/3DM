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
  const colorKeywords = [
    'white', 'black', 'red', 'blue', 'grey', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 
    'ivory', 'beige', 'sand', 'anthracite', 'beech', 'oak', 'natural', 'ash', 'chrome', 'plated', 
    'stainless', 'steel', 'laquered', 'metal', 'plastic', 'wood', 'upholstered', 'fabric', 'kunstleder',
    'stoff', 'alu', 'weiss', 'schwarz', 'dunkelblau', 'edelstahl', 'wei', 'grau', 'rot', 'blau', 'grün',
    'chrom', 'leder', 'kunst', 'buche', 'eiche', 'natur', 'lackiert', 'matt'
  ];
  const regex = new RegExp(`\\b(${colorKeywords.join('|')})\\b`, 'gi');
  
  return name.replace(regex, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || name;
}

function genericizeCatalogLabel(label) {
  const parts = label.split(' - ');
  return parts[0].trim(); // Usually the first part is the model name, second is color
}

function cleanDetails(details) {
  if (!details) return '';
  const fieldsToRemove = ['Color', 'Color Name', 'Frame color', 'Backrest color'];
  return details.split(';')
    .map(d => d.trim())
    .filter(d => {
      const [key] = d.split(':').map(s => s.trim());
      return !fieldsToRemove.includes(key);
    })
    .join('; ');
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

// Parse asset_catalog.csv for better labels and details
const CATALOG_PATH = path.join(__dirname, 'asset_catalog.csv');
const catalogLookup = {};

if (fs.existsSync(CATALOG_PATH)) {
  const catalogContent = fs.readFileSync(CATALOG_PATH, 'utf8');
  const lines = catalogContent.split('\n');
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split CSV while respecting quotes
    const parts = [];
    let cur = '';
    let inQuotes = false;
    for (let char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        parts.push(cur);
        cur = '';
      } else {
        cur += char;
      }
    }
    parts.push(cur);
    
    if (parts.length >= 5) {
      const label = genericizeCatalogLabel(parts[1].trim());
      const id = parts[2].trim();
      const details = cleanDetails(parts[3].trim());
      const zipPath = parts[4].trim();
      const zipBase = path.basename(zipPath, '.zip').toLowerCase();
      
      catalogLookup[id] = { label, details };
      catalogLookup[zipBase] = { label, details }; // Add lookup by base name too
    }
  }
  console.log(`📖 Loaded catalog for ${Object.keys(catalogLookup).length} assets.`);
} else {
  console.warn(`⚠️ Catalog not found at ${CATALOG_PATH}`);
}

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
        
        const catalogEntry = catalogLookup[name];
        const label = catalogEntry ? catalogEntry.label : formatLabel(name);
        const details = catalogEntry ? catalogEntry.details : '';
        
        results.push({
          id: name,
          category: cat,
          label: label,
          details: details,
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
${results.map(r => `  { id: '${r.id}', category: '${r.category}', label: '${r.label.replace(/'/g, "\\'")}', details: '${r.details.replace(/'/g, "\\'")}', w: ${r.w.toFixed(4)}, h: ${r.h.toFixed(4)} }`).join(',\n')}
];

export const ASSET_DIMENSIONS: Record<string, { w: number; h: number }> = {
${Object.entries(dimensionMap).map(([k, v]) => `  '${k}': { w: ${v.w.toFixed(4)}, h: ${v.h.toFixed(4)} }`).join(',\n')}
};
`;

const destPath = path.join(__dirname, '../src/lib/assetRegistry.ts');
fs.writeFileSync(destPath, registryContent, 'utf8');
console.log(`\n✅ Generated asset registry at ${destPath}`);

