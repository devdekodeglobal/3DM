import fs from 'fs';
import path from 'path';

const catalogContent = fs.readFileSync('scripts/asset_catalog.csv', 'utf8');
const lines = catalogContent.split('\n');
const groups = {};

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
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
    const category = parts[0].trim();
    const id = parts[2].trim();
    const zipPath = parts[4].trim();
    const zipBase = path.basename(zipPath, '.zip').toLowerCase();
    const groupKey = `${category}/${zipBase}`;
    
    if (!groups[groupKey]) groups[groupKey] = { category, baseName: zipBase, variants: [] };
    groups[groupKey].variants.push(id);
  }
}

console.log('🚀 Starting Library Cleanup...');

for (const key in groups) {
  const group = groups[key];
  const catDir = path.join('public/models', group.category);
  if (!fs.existsSync(catDir)) continue;

  let masterFound = false;
  for (const variantId of group.variants) {
    const glbPath = path.join(catDir, `${variantId}.glb`);
    if (fs.existsSync(glbPath)) {
      if (!masterFound) {
        const newPath = path.join(catDir, `${group.baseName}.glb`);
        if (glbPath !== newPath) {
          fs.renameSync(glbPath, newPath);
          console.log(`✅ Renamed: ${variantId} -> ${group.baseName}`);
        } else {
          console.log(`✅ Kept: ${group.baseName}`);
        }
        masterFound = true;
      } else {
        fs.unlinkSync(glbPath);
        console.log(`🗑️  Deleted duplicate: ${variantId}`);
      }
    }
  }
}

console.log('✨ Cleanup Complete!');
