import { ASSET_REGISTRY } from './assetRegistry';
import { getArchitecturalSymbolSvgString } from '../components/editor/ArchitecturalSymbolSVG';

export async function generateReport(
  boothConfig: any, 
  elements: any[], 
  screenshots: Record<string, string>, 
  targetWindow?: Window | null
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

  // Generate full-page drawing sheets
  let drawingSheetNumber = 2;

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
        <span>SHEET: <strong>DWG-02</strong></span>
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

  // BOM Visual Catalog Cards
  const bomCatalogHtml = Object.values(assetCounts).map(item => `
    <div class="bom-card">
      <div class="bom-card-header">
        <div class="bom-card-thumb">${item.svgSymbol || ''}</div>
        <span class="bom-card-qty">${item.count}×</span>
        <div class="bom-card-title">
          <h4>${item.label}</h4>
          <span class="bom-card-cat">${item.category}</span>
        </div>
      </div>
      <div class="bom-card-body">
        <div class="bom-card-row">
          <label>Dimensions:</label>
          <code>${item.dims}</code>
        </div>
        <div class="bom-card-row">
          <label>Specs:</label>
          <span class="bom-card-specs">${item.specs}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Wall Schedule Rows
  const wallRows = walls.map(w => `
    <tr>
      <td class="bold"><code>${w.id.substring(0, 12)}</code></td>
      <td>${w.isOuter ? '<span class="tag">Outer Structural</span>' : '<span class="tag inner">Internal Partition</span>'}</td>
      <td><strong>${w.realWidth || (w.width / 100).toFixed(2)}m (W)</strong> × <strong>${(w.thickness / 100).toFixed(2)}m (T)</strong> × <strong>${(2.5 * (w.verticalScale || 1)).toFixed(2)}m (H)</strong></td>
      <td>${w.material || 'Standard Matte'}${w.color ? ` (${w.color})` : ''}</td>
      <td>${(w.wallElements || []).length > 0 ? (w.wallElements.map((we: any) => `${we.type === 'door' ? '🚪 Door' : we.type === 'window' ? '🪟 Window' : we.type} (${(we.width / 100).toFixed(2)}m)`).join(', ')) : 'Solid full wall'}</td>
    </tr>`).join('');

  // Parametric & Core Structures Rows
  const structureRows = structures.map(st => {
    let typeTag = '<span class="tag brand">Structure</span>';
    let details = '';
    const wM = (st.realWidth || st.width / 100).toFixed(2);
    const dM = (st.realDepth || st.height / 100).toFixed(2);
    const hM = (st.realHeight || (st.type === 'pillar' ? 3.0 : st.type === 'caged-panel' ? 0.2 : 2.5)).toFixed(2);

    if (st.type === 'caged-wall') {
      typeTag = '<span class="tag brand">Caged Slat Wall</span>';
      details = `${st.platesCount || 5} slats · Thickness: ${((st.plateThickness || 0.05) * 100).toFixed(1)}cm · Gap: ${((st.plateGap ?? 0.2) * 100).toFixed(1)}cm · ${st.orientation || 'horizontal'}`;
    } else if (st.type === 'caged-panel') {
      typeTag = '<span class="tag warm">Caged Roof / Canopy</span>';
      details = `Elevation: ${(st.yOffset || 2.5).toFixed(2)}m · ${st.platesCount || 5} slats · Gap: ${((st.plateGap ?? 0.3) * 100).toFixed(1)}cm`;
    } else if (st.type === 'pillar') {
      typeTag = '<span class="tag">Structural Pillar</span>';
      details = `Profile: ${st.profile === 'round' ? 'Cylindrical (Ø ' + wM + 'm)' : 'Square Section'} · Height: ${hM}m`;
    } else if (st.type === 'panel') {
      typeTag = '<span class="tag inner">Modular Panel</span>';
      details = `Style: ${st.style || 'Flat'} · Thickness: ${dM}m`;
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

  // Mounted Fixtures Rows
  const elemRows = [
    ...allBanners.map(e => `<tr><td><span class="tag">Banner</span></td><td><code>${e.id.substring(0, 10)}</code></td><td>${e.width}px × ${e.height}px</td><td>${e.shape || 'Rectangle'}</td><td>Wall Graphic</td></tr>`),
    ...allWindows.map(e => `<tr><td><span class="tag inner">Window / Cutout</span></td><td><code>${e.id.substring(0, 10)}</code></td><td>${e.width}px × ${e.height}px</td><td>${e.shape || 'Aperture'}</td><td>Aperture</td></tr>`),
    ...allLogos.map(e => `<tr><td><span class="tag brand">3D Brand Logo</span></td><td><code>${e.id.substring(0, 10)}</code></td><td>${e.width}px × ${e.height}px</td><td>3D Illuminated</td><td>${e.logoStyle || 'Custom'}</td></tr>`),
    ...allLights.map(e => `<tr><td><span class="tag warm">Lighting Fixture</span></td><td><code>${e.id.substring(0, 10)}</code></td><td>${e.width || '-'}px × ${e.height || '-'}px</td><td>Spotlight / Downlight</td><td>${e.color || '#fff8e7'}</td></tr>`),
  ].join('');

  const totalSheets = drawingSheetNumber + 1; // Cover (1) + Summary (1) + Drawings + BOM (1)

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
    background: #e2e8f0; 
    font-size: 12px; 
    line-height: 1.4; 
    margin: 0;
    padding: 20px 0;
  }

  /* ── FULL-PAGE SHEETS (A4 LANDSCAPE: 297mm × 210mm RATIO) ── */
  .sheet {
    width: 1080px;
    height: 720px;
    max-height: 720px;
    min-height: 720px;
    margin: 24px auto;
    background: var(--white);
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    padding: 24px 32px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    page-break-after: always;
    page-break-inside: avoid;
    break-after: page;
    break-inside: avoid;
  }

  /* ── COVER SHEET ── */
  .cover-sheet {
    width: 1080px;
    height: 720px;
    max-height: 720px;
    min-height: 720px;
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
    padding: 48px 56px; 
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
    margin-bottom: 16px; 
    font-family: 'JetBrains Mono', monospace;
    background: rgba(99, 102, 241, 0.2);
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid rgba(99, 102, 241, 0.4);
  }
  .cover-body h1 { 
    font-size: 42px; 
    font-weight: 800; 
    letter-spacing: -0.02em; 
    line-height: 1.15; 
    margin-bottom: 10px; 
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
    font-size: 20px;
    color: #cbd5e1;
    font-weight: 500;
    margin-bottom: 36px;
  }
  .cover-meta-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 20px; 
    border-top: 1px solid rgba(255,255,255,0.15);
    padding-top: 24px;
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
    font-size: 13px; 
    font-weight: 600; 
    font-family: 'JetBrains Mono', monospace; 
    color: #f8fafc; 
  }
  .cover-footer { 
    background: #090d16 !important; 
    padding: 16px 56px; 
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
    gap: 12px; 
    margin: 12px 0 16px; 
  }
  .stat-card { 
    background: var(--bg); 
    border: 1px solid var(--border); 
    border-radius: 8px; 
    padding: 12px 14px; 
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
    font-size: 9.5px; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 0.08em; 
    color: var(--soft); 
    margin-bottom: 4px; 
  }
  .stat-value { 
    font-size: 24px; 
    font-weight: 800; 
    color: var(--text); 
    line-height: 1; 
    font-family: 'Outfit', sans-serif;
  }
  .stat-unit { 
    font-size: 12px; 
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
    padding-bottom: 10px;
    margin-bottom: 12px;
    flex-shrink: 0;
  }
  .sheet-tag {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: var(--brand);
    background: rgba(79,70,229,0.08);
    padding: 2px 6px;
    border-radius: 3px;
    margin-bottom: 4px;
  }
  .sheet-title-group h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: var(--navy);
    line-height: 1.2;
  }
  .sheet-sub {
    font-size: 11px;
    color: var(--soft);
    margin-top: 2px;
  }
  .sheet-meta {
    display: flex;
    gap: 16px;
    text-align: right;
  }
  .sheet-meta label {
    font-size: 8.5px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--soft);
    display: block;
    margin-bottom: 2px;
  }
  .sheet-meta span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    font-weight: 700;
    color: var(--navy);
  }

  .drawing-frame {
    flex: 1 1 auto;
    height: 520px;
    max-height: 520px;
    min-height: 500px;
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
    padding: 10px;
  }
  .blueprint-img {
    max-width: 100%;
    max-height: 500px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }

  /* ── SHEET TITLE BLOCK ── */
  .sheet-title-block {
    margin-top: 10px;
    border-top: 1.5px solid var(--navy);
    padding-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: var(--soft);
    flex-shrink: 0;
  }
  .tb-left strong { color: var(--navy); }
  .tb-right { display: flex; gap: 20px; }
  .tb-right strong { color: var(--navy); }

  /* ── TABLES & SCHEDULES ── */
  table { 
    width: 100%; 
    border-collapse: collapse; 
    font-size: 10.5px; 
    margin-top: 6px;
  }
  thead tr { 
    background: var(--navy) !important; 
    color: white !important; 
  }
  thead th { 
    padding: 6px 10px; 
    text-align: left; 
    font-size: 9px; 
    font-weight: 700; 
    letter-spacing: 0.08em; 
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
    padding: 6px 10px; 
    vertical-align: middle; 
  }
  td.bold { font-weight: 600; color: var(--navy); }
  td code { 
    font-family: 'JetBrains Mono', monospace; 
    background: #eef2ff; 
    color: var(--brand); 
    padding: 1px 4px; 
    border-radius: 3px; 
    font-size: 9.5px; 
  }
  .tag { 
    display: inline-block; 
    background: var(--navy); 
    color: white; 
    font-size: 8.5px; 
    font-weight: 700; 
    padding: 2px 6px; 
    border-radius: 3px; 
    letter-spacing: 0.04em; 
    text-transform: uppercase; 
  }
  .tag.inner { background: var(--cyan); color: var(--navy); }
  .tag.brand { background: var(--brand); color: white; }
  .tag.warm { background: var(--amber); color: var(--navy); }

  /* ── BOM VISUAL CARDS GRID ── */
  .bom-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 10px;
    max-height: 540px;
    overflow: hidden;
  }
  .bom-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    background: var(--bg);
  }
  .bom-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border-light);
  }
  .bom-card-thumb {
    width: 32px;
    height: 32px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 1px;
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
    font-size: 13px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .bom-card-title h4 {
    font-size: 11.5px;
    font-weight: 700;
    color: var(--navy);
  }
  .bom-card-cat {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--soft);
  }
  .bom-card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5px;
    margin-bottom: 2px;
  }
  .bom-card-row label {
    font-weight: 600;
    color: var(--soft);
  }
  .bom-card-specs {
    font-size: 9.5px;
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
      box-sizing: border-box !important;
      margin: 0 !important;
      padding: 10mm 14mm !important;
      box-shadow: none !important;
      border: none !important;
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

<!-- 2. PROJECT OVERVIEW & METRICS SHEET -->
<div class="sheet full-page">
  <div class="sheet-header">
    <div class="sheet-title-group">
      <span class="sheet-tag">PROJECT SUMMARY</span>
      <h2>Spatial Specifications & Metric Overview</h2>
      <p class="sheet-sub">Comprehensive architectural metrics, wall schedule, and mounted fixtures</p>
    </div>
    <div class="sheet-meta">
      <div><label>Project</label><span>${projectName}</span></div>
      <div><label>Doc Ref</label><span>${docId}</span></div>
    </div>
  </div>

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
  </div>

  ${walls.length > 0 ? `
  <div style="margin-top: 16px;">
    <h3 style="font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;margin-bottom:8px;color:var(--navy);">Structural & Partition Walls</h3>
    <table>
      <thead><tr><th>Wall Reference</th><th>Classification</th><th>Real Dimensions (W × T × H)</th><th>Material Finish</th><th>Mounted Elements / Details</th></tr></thead>
      <tbody>${wallRows}</tbody>
    </table>
  </div>` : ''}

  ${structures.length > 0 ? `
  <div style="margin-top: 20px;">
    <h3 style="font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;margin-bottom:8px;color:var(--navy);">Parametric & Core Structures</h3>
    <table>
      <thead><tr><th>Element Reference</th><th>Structure Type</th><th>Real Dimensions (W × D × H)</th><th>Material / Color</th><th>Structural Specifications</th></tr></thead>
      <tbody>${structureRows}</tbody>
    </table>
  </div>` : ''}

  ${elemRows ? `
  <div style="margin-top: 24px;">
    <h3 style="font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;margin-bottom:8px;color:var(--navy);">Mounted Wall Fixtures & Branding</h3>
    <table>
      <thead><tr><th>Category</th><th>Element Reference</th><th>Dimensions</th><th>Type / Style</th><th>Specification</th></tr></thead>
      <tbody>${elemRows}</tbody>
    </table>
  </div>` : ''}

  <div class="sheet-title-block" style="margin-top: auto;">
    <div class="tb-left"><strong>krafc</strong> · EXECUTIVE SPECIFICATION</div>
    <div class="tb-right"><span>REF: <strong>${docId}</strong></span><span>SHEET: <strong>DWG-01</strong></span></div>
  </div>
</div>

<!-- 3. DRAWING SHEETS (2D FLOOR PLAN + 3D ORTHOGRAPHIC ELEVATIONS) -->
${floorPlanSheetHtml}
${blueprintSheetsHtml}

<!-- 4. BILL OF MATERIALS (BOM) & ASSET PROCUREMENT CATALOG -->
<div class="sheet full-page">
  <div class="sheet-header">
    <div class="sheet-title-group">
      <span class="sheet-tag">SCHEDULE OF ASSETS</span>
      <h2>Bill of Materials & Furniture Schedule</h2>
      <p class="sheet-sub">Consolidated asset procurement breakdown with physical dimensions and quantities</p>
    </div>
    <div class="sheet-meta">
      <div><label>Total Item Count</label><span>${allAssets.length}</span></div>
      <div><label>Unique Models</label><span>${Object.keys(assetCounts).length}</span></div>
    </div>
  </div>

  <div class="bom-grid">
    ${bomCatalogHtml || '<p style="color:var(--soft);font-style:italic;grid-column:span 3;padding:24px 0;">No furniture assets placed in this design.</p>'}
  </div>

  <div class="sheet-title-block" style="margin-top: auto;">
    <div class="tb-left"><strong>krafc</strong> · BILL OF MATERIALS & PROCUREMENT SCHEDULE</div>
    <div class="tb-right"><span>PROJECT: <strong>${projectName}</strong></span><span>FINAL SCHEDULE</span></div>
  </div>
</div>

</body>
</html>`;

  return {
    html,
    docId,
    projectName,
  };
}
