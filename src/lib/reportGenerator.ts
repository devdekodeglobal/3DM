import pkg from 'file-saver';
const { saveAs } = pkg;
import { ASSET_REGISTRY } from './assetRegistry';
import { getArchitecturalSymbolSvgString } from '../components/editor/ArchitecturalSymbolSVG';

export async function generateReport(boothConfig: any, elements: any[], screenshots: Record<string, string>) {
  const docId = `DKD-${Date.now().toString(36).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const projectName = typeof window !== 'undefined' ? (localStorage.getItem('current-design-name') || 'Untitled Space Design') : 'Space Design';

  // BOM & Element Collection
  const walls = elements.filter(el => el.type === 'wall');
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
    <div class="drawing-frame">
      <div class="drawing-canvas-wrap">
        <img src="${floorplan2D}" alt="2D Floor Plan" class="blueprint-img" />
      </div>
    </div>
    <div class="sheet-title-block">
      <div class="tb-left">
        <strong>DEKODE SPACE DESIGNER</strong> · 2D ARCHITECTURAL FLOOR PLAN
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
          <strong>DEKODE ARCHITECTURAL SYSTEM</strong> · ${title.toUpperCase()}
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
      <td><strong>${w.realWidth || (w.width / 100).toFixed(2)}m</strong> × <strong>${(w.thickness / 100).toFixed(2)}m</strong></td>
      <td>${w.material || 'Standard Matte'}</td>
      <td>${(w.wallElements || []).length} mounted fixture(s)</td>
    </tr>`).join('');

  // Mounted Fixtures Rows
  const elemRows = [
    ...allBanners.map(e => `<tr><td><span class="tag">Banner</span></td><td><code>${e.id.substring(0, 10)}</code></td><td>${e.width}px × ${e.height}px</td><td>${e.shape || 'Rectangle'}</td><td>Wall Graphic</td></tr>`),
    ...allWindows.map(e => `<tr><td><span class="tag inner">Window / Cutout</span></td><td><code>${e.id.substring(0, 10)}</code></td><td>${e.width}px × ${e.height}px</td><td>${e.shape || 'Aperture'}</td><td>Aperture</td></tr>`),
    ...allLogos.map(e => `<tr><td><span class="tag brand">3D Brand Logo</span></td><td><code>${e.id.substring(0, 10)}</code></td><td>${e.width}px × ${e.height}px</td><td>3D Illuminated</td><td>${e.logoStyle || 'Custom'}</td></tr>`),
    ...allLights.map(e => `<tr><td><span class="tag warm">Lighting Fixture</span></td><td><code>${e.id.substring(0, 10)}</code></td><td>${e.width || '-'}px × ${e.height || '-'}px</td><td>Spotlight / Downlight</td><td>${e.color || '#fff8e7'}</td></tr>`),
  ].join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Architectural Space Specification - ${projectName} - ${docId}</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
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
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { 
    font-family: 'Inter', system-ui, -apple-system, sans-serif; 
    color: var(--text); 
    background: #e2e8f0; 
    font-size: 13px; 
    line-height: 1.5; 
  }

  /* ── PRINT & ACTION BUTTONS ── */
  .action-bar { 
    position: fixed; 
    top: 20px; 
    right: 20px; 
    display: flex; 
    gap: 12px; 
    z-index: 9999; 
  }
  .btn-print { 
    background: var(--brand); 
    color: #fff; 
    border: none; 
    padding: 12px 24px; 
    border-radius: 99px; 
    font-weight: 700; 
    font-size: 14px; 
    cursor: pointer; 
    box-shadow: 0 4px 20px rgba(79,70,229,.4); 
    transition: all .2s; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
    font-family: 'Outfit', sans-serif;
  }
  .btn-print:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 8px 28px rgba(79,70,229,.5); 
    background: #4338ca;
  }

  /* ── FULL-PAGE SHEETS (A4/LANDSCAPE READY) ── */
  .sheet {
    max-width: 1200px;
    margin: 32px auto;
    background: var(--white);
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    border-radius: 8px;
    padding: 44px 52px;
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 840px;
  }

  /* ── COVER SHEET ── */
  .cover-sheet {
    background: #0f172a;
    color: white;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #1e293b;
  }
  .cover-accent { 
    position: absolute; 
    top: 0; 
    left: 0; 
    width: 6px; 
    height: 100%; 
    background: linear-gradient(180deg, var(--brand), var(--cyan)); 
  }
  .cover-grid { 
    position: absolute; 
    inset: 0; 
    background-image: 
      linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), 
      linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px); 
    background-size: 32px 32px; 
    pointer-events: none; 
  }
  .cover-body { 
    padding: 72px 80px; 
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
    margin-bottom: 20px; 
    font-family: 'JetBrains Mono', monospace;
    background: rgba(99, 102, 241, 0.15);
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid rgba(99, 102, 241, 0.3);
  }
  .cover h1 { 
    font-size: 44px; 
    font-weight: 800; 
    letter-spacing: -0.02em; 
    line-height: 1.15; 
    margin-bottom: 12px; 
    font-family: 'Outfit', sans-serif;
    color: #ffffff;
  }
  .cover h1 span { 
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .cover-project-title {
    font-size: 22px;
    color: #94a3b8;
    font-weight: 500;
    margin-bottom: 48px;
  }
  .cover-meta-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 24px; 
    border-top: 1px solid rgba(255,255,255,0.12);
    padding-top: 28px;
  }
  .cover-meta-item label { 
    font-size: 10px; 
    text-transform: uppercase; 
    letter-spacing: 0.12em; 
    color: rgba(255,255,255,.5); 
    display: block; 
    margin-bottom: 6px; 
  }
  .cover-meta-item span { 
    font-size: 14px; 
    font-weight: 600; 
    font-family: 'JetBrains Mono', monospace; 
    color: #f8fafc; 
  }
  .cover-footer { 
    background: #090d16; 
    padding: 20px 80px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    font-size: 11px; 
    color: rgba(255,255,255,.45); 
    letter-spacing: 0.05em; 
    position: relative; 
    z-index: 1; 
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  .cover-footer strong { color: rgba(255,255,255,.8); }

  /* ── STATS ROW ── */
  .stats-grid { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 16px; 
    margin: 28px 0 36px; 
  }
  .stat-card { 
    background: var(--bg); 
    border: 1px solid var(--border); 
    border-radius: 12px; 
    padding: 20px; 
    position: relative; 
    overflow: hidden; 
  }
  .stat-card::before { 
    content: ''; 
    position: absolute; 
    top: 0; 
    left: 0; 
    right: 0; 
    height: 4px; 
    background: var(--brand); 
    border-radius: 2px 2px 0 0; 
  }
  .stat-card.cyan::before { background: var(--cyan); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.amber::before { background: var(--amber); }
  .stat-label { 
    font-size: 11px; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 0.1em; 
    color: var(--soft); 
    margin-bottom: 8px; 
  }
  .stat-value { 
    font-size: 32px; 
    font-weight: 800; 
    color: var(--text); 
    line-height: 1; 
    font-family: 'Outfit', sans-serif;
  }
  .stat-unit { 
    font-size: 14px; 
    font-weight: 500; 
    color: var(--soft); 
    margin-left: 3px; 
  }

  /* ── DRAWING SHEET HEADERS & FRAMES ── */
  .sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid var(--navy);
    padding-bottom: 16px;
    margin-bottom: 20px;
  }
  .sheet-tag {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--brand);
    background: rgba(79,70,229,0.08);
    padding: 3px 8px;
    border-radius: 4px;
    margin-bottom: 6px;
  }
  .sheet-title-group h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 24px;
    font-weight: 800;
    color: var(--navy);
    line-height: 1.2;
  }
  .sheet-sub {
    font-size: 12px;
    color: var(--soft);
    margin-top: 4px;
  }
  .sheet-meta {
    display: flex;
    gap: 20px;
    text-align: right;
  }
  .sheet-meta label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--soft);
    display: block;
    margin-bottom: 2px;
  }
  .sheet-meta span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--navy);
  }

  .drawing-frame {
    flex: 1;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    background: #0d1117;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 580px;
    position: relative;
  }
  .drawing-canvas-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .drawing-canvas-wrap.blueprint-dark {
    background: #0b0f19;
  }
  .blueprint-img {
    max-width: 100%;
    max-height: 600px;
    object-fit: contain;
    display: block;
  }

  /* ── SHEET TITLE BLOCK ── */
  .sheet-title-block {
    margin-top: 16px;
    border-top: 2px solid var(--navy);
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: var(--soft);
  }
  .tb-left strong { color: var(--navy); }
  .tb-right { display: flex; gap: 24px; }
  .tb-right strong { color: var(--navy); }

  /* ── TABLES & SCHEDULES ── */
  table { 
    width: 100%; 
    border-collapse: collapse; 
    font-size: 12px; 
    margin-top: 12px;
  }
  thead tr { 
    background: var(--navy); 
    color: white; 
  }
  thead th { 
    padding: 12px 16px; 
    text-align: left; 
    font-size: 10px; 
    font-weight: 700; 
    letter-spacing: 0.1em; 
    text-transform: uppercase; 
    font-family: 'Outfit', sans-serif;
  }
  tbody tr { 
    border-bottom: 1px solid var(--border-light); 
  }
  tbody tr:nth-child(even) { 
    background: #f8fafc; 
  }
  td { 
    padding: 12px 16px; 
    vertical-align: middle; 
  }
  td.bold { font-weight: 600; color: var(--navy); }
  td code { 
    font-family: 'JetBrains Mono', monospace; 
    background: #eef2ff; 
    color: var(--brand); 
    padding: 2px 6px; 
    border-radius: 4px; 
    font-size: 11px; 
  }
  .tag { 
    display: inline-block; 
    background: var(--navy); 
    color: white; 
    font-size: 9px; 
    font-weight: 700; 
    padding: 3px 8px; 
    border-radius: 4px; 
    letter-spacing: 0.05em; 
    text-transform: uppercase; 
  }
  .tag.inner { background: var(--cyan); color: var(--navy); }
  .tag.brand { background: var(--brand); }
  .tag.warm { background: var(--amber); color: var(--navy); }

  /* ── BOM VISUAL CARDS GRID ── */
  .bom-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  .bom-card {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 18px;
    background: var(--bg);
  }
  .bom-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-light);
  }
  .bom-card-thumb {
    width: 48px;
    height: 48px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 8px;
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
    font-size: 16px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
  }
  .bom-card-title h4 {
    font-size: 14px;
    font-weight: 700;
    color: var(--navy);
  }
  .bom-card-cat {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--soft);
  }
  .bom-card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-bottom: 4px;
  }
  .bom-card-row label {
    font-weight: 600;
    color: var(--soft);
  }
  .bom-card-specs {
    font-size: 11px;
    color: var(--soft);
    max-width: 65%;
    text-align: right;
  }

  /* ── PRINT RULES (PAGE-BREAK PER SHEET) ── */
  @media print {
    body { background: white; }
    .no-print, .action-bar { display: none !important; }
    .sheet {
      margin: 0;
      padding: 24px 32px;
      box-shadow: none;
      border-radius: 0;
      min-height: 100vh;
      page-break-after: always;
      break-after: page;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .drawing-frame {
      min-height: 720px;
    }
    .blueprint-img {
      max-height: 700px;
    }
  }
</style>
</head>
<body>

<div class="action-bar no-print">
  <button class="btn-print" onclick="window.print()">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    Print / Save as PDF
  </button>
</div>

<!-- 1. COVER SHEET -->
<div class="sheet cover-sheet full-page">
  <div class="cover-accent"></div>
  <div class="cover-grid"></div>
  <div class="cover-body">
    <div class="cover-tag">DEKODE SPACE DESIGNER · ARCHITECTURAL SPECIFICATION</div>
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
    <strong>DEKODE SPACE DESIGNER</strong>
    <span>PAGE 1 OF ${drawingSheetNumber}</span>
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
      <div class="stat-label">Structural Walls</div>
      <div class="stat-value">${walls.length}</div>
    </div>
  </div>

  ${walls.length > 0 ? `
  <div style="margin-top: 16px;">
    <h3 style="font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;margin-bottom:8px;color:var(--navy);">Structural & Partition Walls</h3>
    <table>
      <thead><tr><th>Wall Reference</th><th>Classification</th><th>Real Dimensions (W × T)</th><th>Material Finish</th><th>Mounted Elements</th></tr></thead>
      <tbody>${wallRows}</tbody>
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
    <div class="tb-left"><strong>DEKODE ARCHITECTURAL SYSTEM</strong> · EXECUTIVE SPECIFICATION</div>
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
    ${bomCatalogHtml || '<p style="color:var(--soft);font-style:italic;grid-column:span 2;padding:24px 0;">No furniture assets placed in this design.</p>'}
  </div>

  <div class="sheet-title-block" style="margin-top: auto;">
    <div class="tb-left"><strong>DEKODE SPACE DESIGNER</strong> · BILL OF MATERIALS & PROCUREMENT SCHEDULE</div>
    <div class="tb-right"><span>PROJECT: <strong>${projectName}</strong></span><span>FINAL SCHEDULE</span></div>
  </div>
</div>

</body>
</html>`;

  saveAs(new Blob([html], { type: 'text/html' }), `space_report_${docId}.html`);
}
