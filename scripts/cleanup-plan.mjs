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
    const displayName = parts[1].trim();
    const id = parts[2].trim();
    const details = parts[3].trim();
    const zipPath = parts[4].trim();
    
    // Extract base name from ZIP path
    const zipBase = path.basename(zipPath, '.zip').toLowerCase();
    const groupKey = `${category}/${zipBase}`;
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        category,
        baseName: zipBase,
        variants: []
      };
    }
    groups[groupKey].variants.push({ id, displayName, details });
  }
}

const plan = { keep: [], delete: [], rename: [] };

for (const key in groups) {
  const group = groups[key];
  const catDir = path.join('public/models', group.category);
  
  let foundMaster = false;
  for (const variant of group.variants) {
    const glbPath = path.join(catDir, `${variant.id}.glb`);
    if (fs.existsSync(glbPath)) {
      if (!foundMaster) {
        // This will be our new generic file
        const newName = `${group.baseName}.glb`;
        const newPath = path.join(catDir, newName);
        
        plan.rename.push({ from: glbPath, to: newPath, baseId: group.baseName });
        foundMaster = true;
      } else {
        // Already have a master for this group, delete this variant
        plan.delete.push(glbPath);
      }
    }
  }
}

console.log(JSON.stringify(plan, null, 2));
