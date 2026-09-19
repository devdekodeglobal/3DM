import { ASSET_REGISTRY } from './assetRegistry';
import { getArchitecturalSymbolSvgString } from '../components/editor/ArchitecturalSymbolSVG';

export async function generateReport(
  boothConfig: any, 
  elements: any[], 
  screenshots: Record<string, string>
) {
  const docId = `KRAFC-${Date.now().toString(36).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const projectName = typeof window !== 'undefined' ? (localStorage.getItem('current-design-name') || 'Untitled Space Design') : 'Space Design';

  // BOM & Element Collection
  const walls = elements.filter(el => el.type === 'wall');
  const structures = elements.filter(el => ['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(el.type));
  const topLevelAssets = elements.filter(el => el.type === 'asset');
  const topLevelLogos = elements.filter(el => el.type === '3d_logo');
  const topLevelBanners = elements.filter(el => el.type === 'banner');
  const topLevelWindows = elements.filter(el => el.type === 'window');
  const topLevelLights = elements.filter(el => el.type === 'light');

  // Collect ALL elements (top-level + nested in walls)
  const allBanners = [...topLevelBanners];
  const allWindows = [...topLevelWindows];
  const allLogos = [...topLevelLogos];
  const allAssets = [...topLevelAssets];
  const allLights = [...topLevelLights];

  walls.forEach(wall => {
    if (wall.wallElements) {
      wall.wallElements.forEach((we: any) => {
        if (we.type === 'banner') allBanners.push(we);
        if (we.type === 'window') allWindows.push(we);
        if (we.type === '3d_logo') allLogos.push(we);
        if (we.type === 'asset') allAssets.push(we);
        if (we.type === 'light') allLights.push(we);
      });
    }
  });

  const assetCounts: Record<string, { 
    id: string;
    count: number; 
    label: string; 
    category: string; 
    dims: string; 
    specs: string;
    svgSymbol?: string;
  }> = {};

  // Add structural items into BOM procurement schedule
  structures.forEach(st => {
    const key = `struct_${st.type}_${st.profile || ''}_${st.realWidth || (st.width / 100).toFixed(2)}x${st.realDepth || (st.height / 100).toFixed(2)}`;
    let label = 'Modular Structure';
    let cat = 'STRUCTURE';
    let specs = 'Custom fabrication';
    const wStr = (st.realWidth || st.width / 100).toFixed(2);
    const dStr = (st.realDepth || st.height / 100).toFixed(2);
    const hStr = (st.realHeight || (st.type === 'pillar' ? 3.0 : st.type === 'caged-panel' ? 0.2 : 2.5)).toFixed(2);
    const dims = `${wStr}m × ${dStr}m × ${hStr}m`;

    if (st.type === 'caged-wall') {
      label = 'Caged Slat Wall';
      cat = 'WALL FEATURE';
      specs = `${st.platesCount || 5} slats · Thick: ${((st.plateThickness || 0.05) * 100).toFixed(1)}cm · Gap: ${((st.plateGap ?? 0.2) * 100).toFixed(1)}cm`;
    } else if (st.type === 'caged-panel') {
      label = 'Caged Roof / Slat Ceiling';
      cat = 'OVERHEAD / CEILING';
      specs = `Elevation: ${(st.yOffset || 2.5).toFixed(2)}m · ${st.platesCount || 5} slats · Gap: ${((st.plateGap ?? 0.3) * 100).toFixed(1)}cm`;
    } else if (st.type === 'pillar') {
      label = `Structural Pillar (${st.profile === 'round' ? 'Round' : 'Square'})`;
      cat = 'COLUMNS & PILLARS';
      specs = `Profile: ${st.profile === 'round' ? 'Cylindrical' : 'Square'} · Height: ${hStr}m`;
    } else if (st.type === 'panel') {
      label = 'Modular Architectural Panel';
      cat = 'PARTITIONS & PANELS';
      specs = `Style: ${st.style || 'Flat'} · Thick: ${dStr}m`;
    }

    if (!assetCounts[key]) {
      assetCounts[key] = {
        id: key,
        count: 0,
        label,
        category: cat,
        dims,
        specs,
        svgSymbol: getArchitecturalSymbolSvgString(cat, st.type)
      };
    }
    assetCounts[key].count++;
  });

  allAssets.forEach(a => {
    const key = a.assetName || a.id;
    const reg = ASSET_REGISTRY.find(r => r.id === a.assetName || r.id === a.id);
    const categoryName = reg?.category || a.categoryFolder || 'general';
    if (!assetCounts[key]) {
      assetCounts[key] = {
        id: key,
        count: 0,
        label: a.label || reg?.label || a.assetName || 'Asset',
        category: categoryName.replace(/-/g, ' ').toUpperCase(),
        dims: a.realWidth ? `${a.realWidth}m × ${a.realDepth || 1.0}m × ${a.realHeight || 1.0}m` : `${(a.width / 100).toFixed(2)}m × ${(a.height / 100).toFixed(2)}m × 1.0m`,
        specs: reg?.details || a.details || 'Standard specification',
        svgSymbol: getArchitecturalSymbolSvgString(categoryName, key)
      };
    }
    assetCounts[key].count++;
  });

  const boothArea = (boothConfig.width * boothConfig.depth).toFixed(2);
  const perimeterM = (2 * (boothConfig.width + boothConfig.depth)).toFixed(2);
  const floorplan2D = screenshots['floorplan_2d'];

  // Filter 3D blueprint views
  const standardViews = ['top', 'north', 'south', 'east', 'west'];
  const elevationViews = Object.keys(screenshots).filter(k => k.startsWith('elevation_'));
  const otherViews = Object.keys(screenshots).filter(k => !standardViews.includes(k) && !k.startsWith('elevation_') && k !== 'floorplan_2d');

  const getSheetTitle = (viewKey: string) => {
    switch (viewKey) {
      case 'top': return '3D Orthographic Top Plan';
      case 'north': return 'North Elevation (Front/Rear)';
      case 'south': return 'South Elevation (Front/Rear)';
      case 'east': return 'East Elevation (Side View)';
      case 'west': return 'West Elevation (Side View)';
      default:
        if (viewKey.startsWith('elevation_')) {
          const wallId = viewKey.replace('elevation_', '').substring(0, 8).toUpperCase();
          return `Wall Detail Elevation · ID: ${wallId}`;
        }
        return `${viewKey.charAt(0).toUpperCase() + viewKey.slice(1)} View`;
    }
  };

  const getSheetSubtitle = (viewKey: string) => {
    switch (viewKey) {
      case 'top': return 'Spatial layout, boundary clearance, and asset footprint';
      case 'north': return 'Exterior/interior vertical elevation with height and opening markers';
      case 'south': return 'Exterior/interior vertical elevation with height and opening markers';
      case 'east': return 'Side perspective with architectural wall dimensions';
      case 'west': return 'Side perspective with architectural wall dimensions';
      default:
        return 'Custom architectural elevation sheet with mounted fixtures';
    }
  };

  // ── PAGINATED FIXTURES ──
  const allFixtureElements = [
    ...allBanners.map(e => ({ cat: 'Banner Graphic', tagClass: 'tag', ref: e.id, dims: `${e.width}px × ${e.height}px`, type: e.shape || 'Rectangle', spec: 'Wall Graphic / Decal' })),
    ...allWindows.map(e => ({ cat: 'Window / Cutout', tagClass: 'tag inner', ref: e.id, dims: `${e.width}px × ${e.height}px`, type: e.shape || 'Aperture', spec: 'Architectural Aperture' })),
    ...allLogos.map(e => ({ cat: '3D Brand Logo', tagClass: 'tag brand', ref: e.id, dims: `${e.width}px × ${e.height}px`, type: '3D Illuminated', spec: e.logoStyle || 'Custom Brand Sign' })),
    ...allLights.map(e => ({ cat: 'Lighting Fixture', tagClass: 'tag warm', ref: e.id, dims: `${e.width || '-'}px × ${e.height || '-'}px`, type: 'Spotlight / Luminaire', spec: e.color || '#fff8e7' })),
  ];

  const FIXTURES_PER_PAGE = 9;
  const totalFixturePages = Math.ceil(allFixtureElements.length / FIXTURES_PER_PAGE);

  const fixturesSheetsHtml = Array.from({ length: totalFixturePages }).map((_, pageIdx) => {
    const pageItems = allFixtureElements.slice(pageIdx * FIXTURES_PER_PAGE, (pageIdx + 1) * FIXTURES_PER_PAGE);
    const pageNum = pageIdx + 1;
    const sheetNum = String(pageNum).padStart(2, '0');

    const rows = pageItems.map(f => `
      <tr>
        <td><span class="${f.tagClass}">${f.cat}</span></td>
        <td class="bold"><code>${f.ref.substring(0, 12)}</code></td>
        <td><strong>${f.dims}</strong></td>
        <td>${f.type}</td>
        <td>${f.spec}</td>
      </tr>
    `).join('');

    return `
    <div class="sheet full-page">
      <div class="sheet-header">
        <div class="sheet-title-group">
          <span class="sheet-tag">FIXTURES SCHEDULE · PART ${pageNum} OF ${totalFixturePages}</span>
          <h2>Mounted Wall Fixtures & Brand Elements</h2>
          <p class="sheet-sub">Specifications for wall signage, architectural cutouts, graphics, and illumination</p>
        </div>
        <div class="sheet-meta">
          <div><label>Total Items</label><span>${allFixtureElements.length}</span></div>
          <div><label>Schedule Page</label><span>${pageNum} / ${totalFixturePages}</span></div>
          <div><label>Doc Ref</label><span>${docId}</span></div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width:20%;">Classification</th>
              <th style="width:20%;">Element ID</th>
              <th style="width:20%;">Dimensions</th>
              <th style="width:20%;">Type / Mounting</th>
              <th>Specification</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div class="sheet-title-block" style="margin-top: auto;">
        <div class="tb-left"><strong>krafc</strong> · MOUNTED FIXTURE SPECIFICATION</div>
        <div class="tb-right">
          <span>PROJECT: <strong>${projectName}</strong></span>
          <span>SHEET: <strong>DWG-FX-${sheetNum}</strong></span>
        </div>
      </div>
    </div>`;
  }).join('');

  // ── PAGINATED STRUCTURES (IF SEPARATED) ──
  const STRUCT_PER_PAGE = 8;
  const totalStructPages = structures.length > 0 ? Math.ceil(structures.length / STRUCT_PER_PAGE) : 0;

  const structuresSheetsHtml = Array.from({ length: totalStructPages }).map((_, pageIdx) => {
    const pageItems = structures.slice(pageIdx * STRUCT_PER_PAGE, (pageIdx + 1) * STRUCT_PER_PAGE);
    const pageNum = pageIdx + 1;
    const sheetNum = String(pageNum).padStart(2, '0');

    const rows = pageItems.map(st => {
      let typeTag = '<span class="tag brand">Structure</span>';
      let details = '';
      const wM = (st.realWidth || st.width / 100).toFixed(2);
      const dM = (st.realDepth || st.height / 100).toFixed(2);
      const hM = (st.realHeight || (st.type === 'pillar' ? 3.0 : st.type === 'caged-panel' ? 0.2 : 2.5)).toFixed(2);

      if (st.type === 'caged-wall') {
        typeTag = '<span class="tag brand">Caged Slat Wall</span>';
        details = `${st.platesCount || 5} slats · Thick: ${((st.plateThickness || 0.05) * 100).toFixed(1)}cm · Gap: ${((st.plateGap ?? 0.2) * 100).toFixed(1)}cm`;
      } else if (st.type === 'caged-panel') {
        typeTag = '<span class="tag warm">Caged Roof</span>';
        details = `Elev: ${(st.yOffset || 2.5).toFixed(2)}m · ${st.platesCount || 5} slats · Gap: ${((st.plateGap ?? 0.3) * 100).toFixed(1)}cm`;
      } else if (st.type === 'pillar') {
        typeTag = '<span class="tag">Structural Pillar</span>';
        details = `Profile: ${st.profile === 'round' ? 'Round' : 'Square'} · Height: ${hM}m`;
      } else if (st.type === 'panel') {
        typeTag = '<span class="tag inner">Modular Panel</span>';
        details = `Style: ${st.style || 'Flat'} · Thick: ${dM}m`;
      }

      return `
      <tr>
        <td class="bold"><code>${st.id.substring(0, 12)}</code></td>
        <td>${typeTag}</td>
        <td><strong>${wM}m (W)</strong> × <strong>${dM}m (D)</strong> × <strong>${hM}m (H)</strong></td>
        <td>${st.fill || '#444444'}</td>
        <td>${details}</td>
      </tr>`;
    }).join('');

    return `
    <div class="sheet full-page">
      <div class="sheet-header">
        <div class="sheet-title-group">
          <span class="sheet-tag">STRUCTURES SCHEDULE · PART ${pageNum} OF ${totalStructPages}</span>
          <h2>Parametric & Architectural Structures</h2>
          <p class="sheet-sub">Slat walls, pillars, modular panels, and overhead ceiling frameworks</p>
        </div>
        <div class="sheet-meta">
          <div><label>Total Structures</label><span>${structures.length}</span></div>
          <div><label>Schedule Page</label><span>${pageNum} / ${totalStructPages}</span></div>
          <div><label>Doc Ref</label><span>${docId}</span></div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width:20%;">Element ID</th>
              <th style="width:20%;">Structure Type</th>
              <th style="width:26%;">Real Dimensions (W × D × H)</th>
              <th style="width:16%;">Color / Finish</th>
              <th>Structural Details</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div class="sheet-title-block" style="margin-top: auto;">
        <div class="tb-left"><strong>krafc</strong> · ARCHITECTURAL STRUCTURES</div>
        <div class="tb-right">
          <span>PROJECT: <strong>${projectName}</strong></span>
          <span>SHEET: <strong>DWG-ST-${sheetNum}</strong></span>
        </div>
      </div>
    </div>`;
  }).join('');

  // ── PAGINATED WALLS (IF WALLS > 7) ──
  const WALLS_PER_PAGE = 7;
  const totalWallPages = Math.max(1, Math.ceil(walls.length / WALLS_PER_PAGE));
  const wallSheetsHtml = Array.from({ length: totalWallPages }).map((_, pageIdx) => {
    const pageItems = walls.slice(pageIdx * WALLS_PER_PAGE, (pageIdx + 1) * WALLS_PER_PAGE);
    const pageNum = pageIdx + 1;
    const sheetNum = String(pageNum).padStart(2, '0');

    const rows = pageItems.map(w => `
      <tr>
        <td class="bold"><code>${w.id.substring(0, 12)}</code></td>
        <td>${w.isOuter ? '<span class="tag">Outer Structural</span>' : '<span class="tag inner">Internal Partition</span>'}</td>
        <td><strong>${w.realWidth || (w.width / 100).toFixed(2)}m (W)</strong> × <strong>${(w.thickness / 100).toFixed(2)}m (T)</strong> × <strong>${(2.5 * (w.verticalScale || 1)).toFixed(2)}m (H)</strong></td>
        <td>${w.material || 'Standard Matte'}${w.color ? ` (${w.color})` : ''}</td>
        <td>${(w.wallElements || []).length > 0 ? (w.wallElements.map((we: any) => `${we.type === 'door' ? '🚪 Door' : we.type === 'window' ? '🪟 Window' : we.type} (${(we.width / 100).toFixed(2)}m)`).join(', ')) : 'Solid wall'}</td>
      </tr>
    `).join('');

    return `
    <div class="sheet full-page">
      <div class="sheet-header">
        <div class="sheet-title-group">
          <span class="sheet-tag">${pageNum === 1 ? 'PROJECT SUMMARY & WALL SCHEDULE' : `WALL SCHEDULE · PART ${pageNum} OF ${totalWallPages}`}</span>
          <h2>${pageNum === 1 ? 'Spatial Specifications & Wall Overview' : 'Architectural Wall Schedule (Continued)'}</h2>
          <p class="sheet-sub">Structural boundaries, partition thicknesses, finishes, and wall cutout markers</p>
        </div>
        <div class="sheet-meta">
          <div><label>Total Walls</label><span>${walls.length}</span></div>
          <div><label>Schedule Page</label><span>${pageNum} / ${totalWallPages}</span></div>
          <div><label>Doc Ref</label><span>${docId}</span></div>
        </div>
      </div>

      ${pageNum === 1 ? `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Floor Area</div>
          <div class="stat-value">${boothArea}<span class="stat-unit">m²</span></div>
        </div>
        <div class="stat-card cyan">
          <div class="stat-label">Boundary Perimeter</div>
          <div class="stat-value">${perimeterM}<span class="stat-unit">m</span></div>
        </div>
        <div class="stat-card green">
          <div class="stat-label">Furniture & Assets</div>
          <div class="stat-value">${allAssets.length}</div>
        </div>
        <div class="stat-card amber">
          <div class="stat-label">Structural Elements</div>
          <div class="stat-value">${walls.length + structures.length}</div>
        </div>
      </div>` : ''}

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width:20%;">Wall Reference</th>
              <th style="width:18%;">Classification</th>
              <th style="width:28%;">Real Dimensions (W × T × H)</th>
              <th style="width:16%;">Material Finish</th>
              <th>Openings / Details</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:var(--soft);">No architectural walls configured.</td></tr>'}</tbody>
        </table>
      </div>

      <div class="sheet-title-block" style="margin-top: auto;">
        <div class="tb-left"><strong>krafc</strong> · ARCHITECTURAL WALL SCHEDULE</div>
        <div class="tb-right">
          <span>PROJECT: <strong>${projectName}</strong></span>
          <span>SHEET: <strong>DWG-WALL-${sheetNum}</strong></span>
        </div>
      </div>
    </div>`;
  }).join('');

  // Count drawings and pages
  let drawingSheetNumber = 1;

  // 2D Floor Plan Sheet
  const floorPlanSheetHtml = floorplan2D ? `
  <div class="sheet full-page">
    <div class="sheet-header">
      <div class="sheet-title-group">
        <span class="sheet-tag">DRAWING DWG-${String(drawingSheetNumber++).padStart(2, '0')}</span>
        <h2>2D Floor Plan & Spatial Layout</h2>
        <p class="sheet-sub">2D Technical schematic with element coordinates and workspace boundary</p>
      </div>
      <div class="sheet-meta">
        <div><label>Scale</label><span>1:50</span></div>
        <div><label>Floor Size</label><span>${boothConfig.width}m × ${boothConfig.depth}m</span></div>
      </div>
    </div>
    <div class="drawing-frame drawing-frame-light">
      <div class="drawing-canvas-wrap">
        <img src="${floorplan2D}" alt="2D Floor Plan" class="blueprint-img" />
      </div>
    </div>
    <div class="sheet-title-block">
      <div class="tb-left">
        <strong>krafc</strong> · 2D ARCHITECTURAL FLOOR PLAN
      </div>
      <div class="tb-right">
        <span>PROJECT: <strong>${projectName}</strong></span>
        <span>SHEET: <strong>DWG-01</strong></span>
      </div>
    </div>
  </div>` : '';

  // 3D Elevation & Blueprint Sheets
  const blueprintSheetsHtml = [...standardViews, ...elevationViews, ...otherViews].map((viewKey) => {
    const img = screenshots[viewKey];
    if (!img) return '';
    const sheetNum = String(drawingSheetNumber++).padStart(2, '0');
    const title = getSheetTitle(viewKey);
    const subtitle = getSheetSubtitle(viewKey);

    return `
    <div class="sheet full-page">
      <div class="sheet-header">
        <div class="sheet-title-group">
          <span class="sheet-tag">DRAWING DWG-${sheetNum}</span>
          <h2>${title}</h2>
          <p class="sheet-sub">${subtitle}</p>
        </div>
        <div class="sheet-meta">
          <div><label>Projection</label><span>Orthographic</span></div>
          <div><label>Space Size</label><span>${boothConfig.width}m × ${boothConfig.depth}m</span></div>
        </div>
      </div>
      <div class="drawing-frame">
        <div class="drawing-canvas-wrap blueprint-dark">
          <img src="${img}" alt="${title}" class="blueprint-img" />
        </div>
      </div>
      <div class="sheet-title-block">
        <div class="tb-left">
          <strong>krafc</strong> · ${title.toUpperCase()}
        </div>
        <div class="tb-right">
          <span>PROJECT: <strong>${projectName}</strong></span>
          <span>SHEET: <strong>DWG-${sheetNum}</strong></span>
        </div>
      </div>
    </div>`;
  }).join('');

  // ── PAGINATED BOM SHEETS (6 cards per sheet in 2 columns × 3 rows) ──
  const assetItems = Object.values(assetCounts);
  const BOM_ITEMS_PER_PAGE = 6;
  const totalBomPages = Math.max(1, Math.ceil(assetItems.length / BOM_ITEMS_PER_PAGE));
  
  const bomSheetsHtml = Array.from({ length: totalBomPages }).map((_, pageIdx) => {
    const pageItems = assetItems.slice(pageIdx * BOM_ITEMS_PER_PAGE, (pageIdx + 1) * BOM_ITEMS_PER_PAGE);
    const pageNum = pageIdx + 1;
    
    const pageCardsHtml = pageItems.map(item => `
      <div class="bom-card">
        <div class="bom-card-header">
          <div class="bom-card-thumb">${item.svgSymbol || ''}</div>
          <span class="bom-card-qty">${item.count}×</span>
          <div class="bom-card-title">
            <h4 title="${item.label}">${item.label}</h4>
            <span class="bom-card-cat">${item.category}</span>
          </div>
        </div>
        <div class="bom-card-body">
          <div class="bom-card-row">
            <label>Dimensions</label>
            <code>${item.dims}</code>
          </div>
          <div class="bom-card-row">
            <label>Specs</label>
            <span class="bom-card-specs" title="${item.specs}">${item.specs}</span>
          </div>
        </div>
      </div>
    `).join('');

    return `
    <div class="sheet full-page">
      <div class="sheet-header">
        <div class="sheet-title-group">
          <span class="sheet-tag">BOM SCHEDULE · PART ${pageNum} OF ${totalBomPages}</span>
          <h2>Bill of Materials & Furniture Schedule</h2>
          <p class="sheet-sub">Consolidated asset procurement breakdown with physical dimensions and model counts</p>
        </div>
        <div class="sheet-meta">
          <div><label>Total Items</label><span>${allAssets.length}</span></div>
          <div><label>Unique Models</label><span>${assetItems.length}</span></div>
          <div><label>Schedule Page</label><span>${pageNum} / ${totalBomPages}</span></div>
        </div>
      </div>

      <div class="bom-grid">
        ${pageCardsHtml || '<p style="color:var(--soft);font-style:italic;grid-column:span 2;padding:24px 0;">No furniture assets placed in this design.</p>'}
      </div>

      <div class="sheet-title-block" style="margin-top: auto;">
        <div class="tb-left"><strong>krafc</strong> · BILL OF MATERIALS & PROCUREMENT SCHEDULE</div>
        <div class="tb-right"><span>PROJECT: <strong>${projectName}</strong></span><span>SCHEDULE PART ${pageNum} OF ${totalBomPages}</span></div>
      </div>
    </div>`;
  }).join('');

  const totalSheets = 1 + totalWallPages + totalStructPages + totalFixturePages + (floorplan2D ? 1 : 0) + (drawingSheetNumber - (floorplan2D ? 2 : 1)) + totalBomPages;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Architectural Space Specification - ${projectName} - ${docId}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page {
    size: A4 landscape;
    margin: 0;
  }
  :root {
    --navy: #090d16;
    --navy2: #111827;
    --navy3: #1e293b;
    --brand: #4f46e5;
    --brand-light: #818cf8;
    --cyan: #06b6d4;
    --green: #10b981;
    --amber: #f59e0b;
    --text: #0f172a;
    --soft: #475569;
    --border: #cbd5e1;
    --border-light: #e2e8f0;
    --bg: #f8fafc;
    --white: #ffffff;
  }
  * { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  body { 
    font-family: 'Inter', system-ui, -apple-system, sans-serif; 
    color: var(--text); 
    background: #cbd5e1; 
    font-size: 12px; 
    line-height: 1.4; 
    margin: 0;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ── FULL-PAGE SHEETS (A4 LANDSCAPE: 297mm × 210mm RATIO) ── */
  .sheet {
    width: 1040px;
    max-width: 100%;
    height: 700px;
    max-height: 700px;
    min-height: 700px;
    margin: 16px auto;
    background: var(--white);
    box-shadow: 0 8px 30px rgba(0,0,0,0.14);
    padding: 22px 28px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    border-radius: 4px;
    page-break-after: always;
    page-break-inside: avoid;
    break-after: page;
    break-inside: avoid;
  }

  /* ── COVER SHEET ── */
  .cover-sheet {
    width: 1040px;
    max-width: 100%;
    height: 700px;
    max-height: 700px;
    min-height: 700px;
    background: #0f172a !important;
    color: white;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #1e293b;
    position: relative;
  }
  .cover-accent { 
    position: absolute; 
    top: 0; 
    left: 0; 
    width: 8px; 
    height: 100%; 
    background: linear-gradient(180deg, var(--brand), var(--cyan)); 
  }
  .cover-grid { 
    position: absolute; 
    inset: 0; 
    background-image: 
      linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), 
      linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px); 
    background-size: 32px 32px; 
    pointer-events: none; 
  }
  .cover-body { 
    padding: 44px 52px; 
    position: relative; 
    z-index: 1; 
  }
  .cover-tag { 
    display: inline-block;
    font-size: 11px; 
    font-weight: 800; 
    letter-spacing: 0.15em; 
    color: var(--brand-light); 
    text-transform: uppercase; 
    margin-bottom: 14px; 
    font-family: 'JetBrains Mono', monospace;
    background: rgba(99, 102, 241, 0.2);
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid rgba(99, 102, 241, 0.4);
  }
  .cover-body h1 { 
    font-size: 40px; 
    font-weight: 800; 
    letter-spacing: -0.02em; 
    line-height: 1.15; 
    margin-bottom: 8px; 
    font-family: 'Outfit', sans-serif;
    color: #ffffff;
  }
  .cover-body h1 span { 
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #818cf8;
  }
  .cover-project-title {
    font-size: 19px;
    color: #cbd5e1;
    font-weight: 500;
    margin-bottom: 32px;
  }
  .cover-meta-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 16px; 
    border-top: 1px solid rgba(255,255,255,0.15);
    padding-top: 22px;
  }
  .cover-meta-item label { 
    font-size: 9px; 
    text-transform: uppercase; 
    letter-spacing: 0.12em; 
    color: rgba(255,255,255,.6); 
    display: block; 
    margin-bottom: 4px; 
  }
  .cover-meta-item span { 
    font-size: 12.5px; 
    font-weight: 600; 
    font-family: 'JetBrains Mono', monospace; 
    color: #f8fafc; 
  }
  .cover-footer { 
    background: #090d16 !important; 
    padding: 14px 52px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    font-size: 11px; 
    color: rgba(255,255,255,.6); 
    letter-spacing: 0.05em; 
    position: relative; 
    z-index: 1; 
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  .cover-footer strong { color: #ffffff; }

  /* ── STATS ROW ── */
  .stats-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 10px; 
    margin: 8px 0 12px; 
    flex-shrink: 0;
  }
  .stat-card { 
    background: var(--bg); 
    border: 1px solid var(--border); 
    border-radius: 6px; 
    padding: 10px 12px; 
    position: relative; 
    overflow: hidden; 
  }
  .stat-card::before { 
    content: ''; 
    position: absolute; 
    top: 0; 
    left: 0; 
    right: 0; 
    height: 3px; 
    background: var(--brand); 
    border-radius: 2px 2px 0 0; 
  }
  .stat-card.cyan::before { background: var(--cyan); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.amber::before { background: var(--amber); }
  .stat-label { 
    font-size: 9px; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 0.08em; 
    color: var(--soft); 
    margin-bottom: 3px; 
  }
  .stat-value { 
    font-size: 22px; 
    font-weight: 800; 
    color: var(--text); 
    line-height: 1; 
    font-family: 'Outfit', sans-serif;
  }
  .stat-unit { 
    font-size: 11px; 
    font-weight: 500; 
    color: var(--soft); 
    margin-left: 2px; 
  }

  /* ── DRAWING SHEET HEADERS & FRAMES ── */
  .sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1.5px solid var(--navy);
    padding-bottom: 8px;
    margin-bottom: 10px;
    flex-shrink: 0;
  }
  .sheet-tag {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    color: var(--brand);
    background: rgba(79,70,229,0.08);
    padding: 2px 6px;
    border-radius: 3px;
    margin-bottom: 3px;
  }
  .sheet-title-group h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: var(--navy);
    line-height: 1.2;
  }
  .sheet-sub {
    font-size: 10.5px;
    color: var(--soft);
    margin-top: 2px;
  }
  .sheet-meta {
    display: flex;
    gap: 14px;
    text-align: right;
  }
  .sheet-meta label {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--soft);
    display: block;
    margin-bottom: 1px;
  }
  .sheet-meta span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--navy);
  }

  .drawing-frame {
    flex: 1 1 auto;
    height: 510px;
    max-height: 510px;
    min-height: 480px;
    border: 1.5px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
    background: #0b0f19;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .drawing-frame-light {
    background: #f8fafc;
  }
  .drawing-canvas-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }
  .blueprint-img {
    max-width: 100%;
    max-height: 490px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }

  /* ── SHEET TITLE BLOCK ── */
  .sheet-title-block {
    margin-top: 8px;
    border-top: 1.5px solid var(--navy);
    padding-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    color: var(--soft);
    flex-shrink: 0;
  }
  .tb-left strong { color: var(--navy); }
  .tb-right { display: flex; gap: 16px; }
  .tb-right strong { color: var(--navy); }

  /* ── TABLES & SCHEDULES ── */
  .table-container {
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  table { 
    width: 100%; 
    border-collapse: collapse; 
    font-size: 10px; 
    margin-top: 4px;
    table-layout: fixed;
  }
  thead tr { 
    background: var(--navy) !important; 
    color: white !important; 
  }
  thead th { 
    padding: 5px 8px; 
    text-align: left; 
    font-size: 8.5px; 
    font-weight: 700; 
    letter-spacing: 0.06em; 
    text-transform: uppercase; 
    font-family: 'Outfit', sans-serif;
    color: #ffffff !important;
  }
  tbody tr { 
    border-bottom: 1px solid var(--border-light); 
  }
  tbody tr:nth-child(even) { 
    background: #f8fafc; 
  }
  td { 
    padding: 5px 8px; 
    vertical-align: middle; 
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  td.bold { font-weight: 600; color: var(--navy); }
  td code { 
    font-family: 'JetBrains Mono', monospace; 
    background: #eef2ff; 
    color: var(--brand); 
    padding: 1px 4px; 
    border-radius: 3px; 
    font-size: 9px; 
  }
  .tag { 
    display: inline-block; 
    background: var(--navy); 
    color: white; 
    font-size: 8px; 
    font-weight: 700; 
    padding: 2px 5px; 
    border-radius: 3px; 
    letter-spacing: 0.04em; 
    text-transform: uppercase; 
  }
  .tag.inner { background: var(--cyan); color: var(--navy); }
  .tag.brand { background: var(--brand); color: white; }
  .tag.warm { background: var(--amber); color: var(--navy); }

  /* ── BOM VISUAL CARDS GRID (2 Columns × 3 Rows: 6 items per sheet) ── */
  .bom-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 6px;
    width: 100%;
    box-sizing: border-box;
    flex: 1 1 auto;
    align-content: start;
  }
  .bom-card {
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    background: var(--bg);
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 124px;
  }
  .bom-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--border-light);
    min-width: 0;
  }
  .bom-card-thumb {
    width: 32px;
    height: 32px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 2px;
  }
  .bom-card-thumb svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .bom-card-qty {
    background: var(--brand);
    color: white;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .bom-card-title {
    overflow: hidden;
    min-width: 0;
    flex: 1;
  }
  .bom-card-title h4 {
    font-size: 11.5px;
    font-weight: 700;
    color: var(--navy);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bom-card-cat {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--soft);
    display: block;
  }
  .bom-card-body {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: 3px;
  }
  .bom-card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    gap: 8px;
    min-width: 0;
  }
  .bom-card-row label {
    font-weight: 600;
    color: var(--soft);
    flex-shrink: 0;
    font-size: 9px;
  }
  .bom-card-row code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 600;
    color: var(--navy);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bom-card-specs {
    font-size: 9px;
    color: var(--soft);
    max-width: 65%;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── PRINT MEDIA RULES (EXACT 1-PAGE PER SHEET IN A4 LANDSCAPE) ── */
  @media print {
    @page {
      size: A4 landscape;
      margin: 0;
    }
    html, body {
      width: 297mm !important;
      height: auto !important;
      min-height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      display: block !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    .no-print, .action-bar {
      display: none !important;
    }
    .sheet {
      width: 297mm !important;
      height: 210mm !important;
      max-height: 210mm !important;
      min-height: 210mm !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      margin: 0 !important;
      padding: 10mm 14mm !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      page-break-after: always !important;
      break-after: page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
    }
    .cover-sheet {
      padding: 0 !important;
      background: #0f172a !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .cover-body {
      padding: 16mm 20mm !important;
    }
    .cover-footer {
      padding: 6mm 20mm !important;
      background: #090d16 !important;
    }
    .drawing-frame {
      flex: 1 1 auto !important;
      height: 135mm !important;
      max-height: 135mm !important;
      min-height: 135mm !important;
      background: #0b0f19 !important;
    }
    .drawing-frame-light {
      background: #ffffff !important;
    }
    .blueprint-img {
      max-width: 100% !important;
      max-height: 130mm !important;
      object-fit: contain !important;
    }
    .bom-card {
      height: 38mm !important;
    }
  }
</style>
</head>
<body>

<!-- 1. COVER SHEET -->
<div class="sheet cover-sheet full-page">
  <div class="cover-accent"></div>
  <div class="cover-grid"></div>
  <div class="cover-body">
    <div class="cover-tag">krafc · ARCHITECTURAL SPECIFICATION</div>
    <h1>Architectural Space<br><span>Technical Report</span></h1>
    <div class="cover-project-title">${projectName}</div>
    
    <div class="cover-meta-grid">
      <div class="cover-meta-item"><label>Document ID</label><span>${docId}</span></div>
      <div class="cover-meta-item"><label>Date Generated</label><span>${dateStr}</span></div>
      <div class="cover-meta-item"><label>Timestamp</label><span>${timeStr}</span></div>
      <div class="cover-meta-item"><label>Space Dimensions</label><span>${boothConfig.width}m × ${boothConfig.depth}m</span></div>
    </div>
  </div>
  <div class="cover-footer">
    <span>OFFICIAL SPECIFICATION DOCUMENT</span>
    <strong>krafc</strong>
    <span>PAGE 1 OF ${totalSheets}</span>
  </div>
</div>

<!-- 2. ARCHITECTURAL WALL SCHEDULES (PAGINATED) -->
${wallSheetsHtml}

<!-- 3. PARAMETRIC & STRUCTURAL ELEMENTS (PAGINATED IF PRESENT) -->
${structuresSheetsHtml}

<!-- 4. MOUNTED FIXTURES & BRAND GRAPHICS (PAGINATED IF PRESENT) -->
${fixturesSheetsHtml}

<!-- 5. DRAWING SHEETS (2D FLOOR PLAN + 3D ORTHOGRAPHIC ELEVATIONS) -->
${floorPlanSheetHtml}
${blueprintSheetsHtml}

<!-- 6. BILL OF MATERIALS (BOM) PAGINATED SHEETS -->
${bomSheetsHtml}

</body>
</html>`;

  return {
    html,
    docId,
    projectName,
  };
}
