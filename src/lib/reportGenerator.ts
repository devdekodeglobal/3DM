import pkg from 'file-saver';
const { saveAs } = pkg;

export async function generateReport(boothConfig: any, elements: any[], screenshots: Record<string, string>) {
  const docId = `DKD-${Date.now().toString(36).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Export JSON
  const rawData = { booth: boothConfig, elements: elements.map(el => ({ ...el, svgData: el.type === '3d_logo' ? undefined : el.svgData })) };
  saveAs(new Blob([JSON.stringify(rawData, null, 2)], { type: 'application/json' }), 'project_details.json');

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

  const assetCounts: Record<string, { count: number; label: string; dims: string; specs: string }> = {};
  allAssets.forEach(a => {
    const key = a.assetName || a.id;
    if (!assetCounts[key]) assetCounts[key] = {
      count: 0, label: a.label || a.assetName || 'Asset',
      dims: a.realWidth ? `${a.realWidth}m × ${a.realDepth}m × ${a.realHeight}m` : `${(a.width / 100).toFixed(2)}m × ${(a.height / 100).toFixed(2)}m × 1.0m`,
      specs: a.details || '—'
    };
    assetCounts[key].count++;
  });

  const boothArea = (boothConfig.width * boothConfig.depth).toFixed(2);
  const perimeterM = (2 * (boothConfig.width + boothConfig.depth)).toFixed(2);

  const views = Object.keys(screenshots).sort((a, b) => a === 'top' ? -1 : b === 'top' ? 1 : 0);

  const viewSections = views.map(view => {
    const img = screenshots[view];
    if (!img) return '';
    let title = view.charAt(0).toUpperCase() + view.slice(1) + ' View';
    if (view.startsWith('elevation_')) title = `Wall Elevation — ID: ${view.replace('elevation_', '').substring(0, 8).toUpperCase()}`;
    return `
    <div class="view-block">
      <div class="view-label"><span class="badge">VIEW</span>${title}</div>
      <div class="view-img-wrap"><img src="${img}" alt="${title}" /></div>
    </div>`;
  }).join('');

  const bomRows = Object.values(assetCounts).map((item, i) => `
    <tr class="${i % 2 === 0 ? 'even' : ''}">
      <td class="center bold accent">${item.count}</td>
      <td class="bold">${item.label}</td>
      <td><code>${item.dims}</code></td>
      <td class="soft">${item.specs}</td>
    </tr>`).join('');

  const elemRows = [
    ...allBanners.map(e => `<tr><td>Banner</td><td>${e.id}</td><td>${e.width}px × ${e.height}px</td><td>${e.shape || 'square'}</td><td>—</td></tr>`),
    ...allWindows.map(e => `<tr><td>Window</td><td>${e.id}</td><td>${e.width}px × ${e.height}px</td><td>${e.shape || 'square'}</td><td>—</td></tr>`),
    ...allLogos.map(e => `<tr><td>3D Logo</td><td>${e.id}</td><td>${e.width}px × ${e.height}px</td><td>—</td><td>${e.logoStyle || 'standard'}</td></tr>`),
    ...allLights.map(e => `<tr><td>Light</td><td>${e.id}</td><td>${e.width || '—'}px × ${e.height || '—'}px</td><td>—</td><td>${e.lightType || e.color || 'standard'}</td></tr>`),
  ].join('');

  const wallRows = walls.map(w => `
    <tr>
      <td class="bold">${w.id}</td>
      <td>${w.isOuter ? '<span class="tag">Outer</span>' : '<span class="tag inner">Inner</span>'}</td>
      <td>${w.width}px × ${w.thickness}px</td>
      <td>${w.material || '—'}</td>
      <td>${(w.wallElements || []).length} element(s)</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Booth Design Report — ${docId}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #0f1724;
    --navy2: #1a2640;
    --blue: #2563eb;
    --blue-light: #3b82f6;
    --cyan: #06b6d4;
    --green: #10b981;
    --amber: #f59e0b;
    --red: #ef4444;
    --text: #1e293b;
    --soft: #64748b;
    --border: #e2e8f0;
    --bg: #f8fafc;
    --white: #ffffff;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; color: var(--text); background: var(--white); font-size: 14px; line-height: 1.6; }

  /* ── PRINT BUTTON ── */
  .fab { position: fixed; top: 24px; right: 24px; background: var(--blue); color: #fff; border: none; padding: 12px 24px; border-radius: 99px; font-weight: 700; font-size: 14px; cursor: pointer; box-shadow: 0 4px 20px rgba(37,99,235,.4); transition: all .2s; z-index: 999; display: flex; align-items: center; gap: 8px; }
  .fab:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,99,235,.5); }

  /* ── COVER ── */
  .cover { background: var(--navy); color: white; padding: 0; min-height: 320px; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  .cover-accent { position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: linear-gradient(180deg, var(--blue), var(--cyan)); }
  .cover-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
  .cover-body { padding: 60px 72px; position: relative; z-index: 1; flex: 1; }
  .cover-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; color: var(--cyan); text-transform: uppercase; margin-bottom: 20px; }
  .cover h1 { font-size: 48px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 12px; }
  .cover h1 span { color: var(--blue-light); }
  .cover-sub { font-size: 16px; color: rgba(255,255,255,.6); font-weight: 300; margin-bottom: 48px; }
  .cover-meta { display: flex; gap: 48px; }
  .cover-meta-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,.4); display: block; margin-bottom: 4px; }
  .cover-meta-item span { font-size: 15px; font-weight: 600; font-family: 'JetBrains Mono', monospace; color: white; }
  .cover-footer { background: var(--navy2); padding: 16px 72px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: rgba(255,255,255,.35); letter-spacing: 0.05em; position: relative; z-index: 1; }
  .cover-footer strong { color: rgba(255,255,255,.7); }

  /* ── LAYOUT ── */
  .page { max-width: 1100px; margin: 0 auto; padding: 64px 72px; }
  
  /* ── STATS ROW ── */
  .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 64px; }
  .stat-card { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--blue); border-radius: 2px 2px 0 0; }
  .stat-card.cyan::before { background: var(--cyan); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.amber::before { background: var(--amber); }
  .stat-card.red::before { background: var(--red); }
  .stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--soft); margin-bottom: 8px; }
  .stat-value { font-size: 28px; font-weight: 800; color: var(--text); line-height: 1; }
  .stat-unit { font-size: 13px; font-weight: 400; color: var(--soft); margin-left: 2px; }

  /* ── SECTION ── */
  .section { margin-bottom: 56px; }
  .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid var(--border); }
  .section-num { width: 32px; height: 32px; background: var(--blue); color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex-shrink: 0; }
  .section-header h2 { font-size: 20px; font-weight: 700; color: var(--navy); }
  .section-desc { font-size: 13px; color: var(--soft); margin-bottom: 20px; }

  /* ── VIEWS ── */
  .views-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .views-grid .view-block:first-child:nth-last-child(odd) { grid-column: span 2; }
  .view-block { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--bg); }
  .view-label { padding: 12px 16px; font-size: 12px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border); background: white; }
  .badge { background: var(--navy); color: white; font-size: 9px; letter-spacing: 0.1em; padding: 2px 7px; border-radius: 4px; font-weight: 700; }
  .view-img-wrap { background: #0d1117; display: flex; justify-content: center; align-items: center; min-height: 200px; }
  .view-img-wrap img { display: block; max-width: 100%; height: auto; }

  /* ── TABLES ── */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead tr { background: var(--navy); color: white; }
  thead th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
  tbody tr { border-bottom: 1px solid var(--border); }
  tbody tr:hover { background: var(--bg); }
  tbody tr.even { background: #fbfcfd; }
  td { padding: 11px 16px; vertical-align: top; }
  td.center { text-align: center; }
  td.bold { font-weight: 600; }
  td.accent { color: var(--blue); font-family: 'JetBrains Mono', monospace; font-size: 16px; }
  td.soft { color: var(--soft); font-size: 12px; }
  code { font-family: 'JetBrains Mono', monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: var(--navy); }
  .tag { display: inline-block; background: var(--blue); color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.05em; text-transform: uppercase; }
  .tag.inner { background: var(--cyan); color: var(--navy); }

  /* ── INFO BOXES ── */
  .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .info-card { border: 1px solid var(--border); border-radius: 10px; padding: 16px 20px; }
  .info-card-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--soft); margin-bottom: 6px; }
  .info-card-value { font-size: 18px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: var(--navy); }
  .info-card-sub { font-size: 12px; color: var(--soft); margin-top: 2px; }

  /* ── FOOTER ── */
  .report-footer { margin-top: 80px; padding-top: 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--soft); }
  .report-footer strong { color: var(--text); }

  /* ── DIVIDER ── */
  .divider { height: 1px; background: var(--border); margin: 48px 0; }

  @media print {
    .fab { display: none !important; }
    .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .cover-accent, .stat-card::before, thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 40px 48px; }
    .section { page-break-inside: avoid; }
    .view-block { page-break-inside: avoid; }
  }
</style>
</head>
<body>

<button class="fab no-print" onclick="window.print()">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
  Export PDF
</button>

<!-- COVER -->
<div class="cover">
  <div class="cover-accent"></div>
  <div class="cover-grid"></div>
  <div class="cover-body">
    <div class="cover-tag">Dekode Booth Designer · Official Design Document</div>
    <h1>Architectural<br><span>Structure Report</span></h1>
    <p class="cover-sub">Booth Configuration · Material Specifications · Asset Inventory</p>
    <div class="cover-meta">
      <div class="cover-meta-item"><label>Document ID</label><span>${docId}</span></div>
      <div class="cover-meta-item"><label>Generated</label><span>${dateStr}</span></div>
      <div class="cover-meta-item"><label>Time</label><span>${timeStr}</span></div>
      <div class="cover-meta-item"><label>Booth Size</label><span>${boothConfig.width}m × ${boothConfig.depth}m</span></div>
    </div>
  </div>
  <div class="cover-footer">
    <span>CONFIDENTIAL — INTERNAL USE ONLY</span>
    <strong>Dekode Booth Designer</strong>
    <span>Rev. 1.0</span>
  </div>
</div>

<div class="page">

  <!-- STATS -->
  <div class="stats-grid" style="margin-top:48px;">
    <div class="stat-card">
      <div class="stat-label">Floor Area</div>
      <div class="stat-value">${boothArea}<span class="stat-unit">m²</span></div>
    </div>
    <div class="stat-card cyan">
      <div class="stat-label">Perimeter</div>
      <div class="stat-value">${perimeterM}<span class="stat-unit">m</span></div>
    </div>
    <div class="stat-card green">
      <div class="stat-label">Total Assets</div>
      <div class="stat-value">${allAssets.length}</div>
    </div>
    <div class="stat-card amber">
      <div class="stat-label">Wall Elements</div>
      <div class="stat-value">${allBanners.length + allWindows.length}</div>
    </div>
    <div class="stat-card red">
      <div class="stat-label">3D Logos</div>
      <div class="stat-value">${allLogos.length}</div>
    </div>
    <div class="stat-card" style="grid-column:span 1;">
      <div class="stat-label">Lights</div>
      <div class="stat-value">${allLights.length}</div>
    </div>
  </div>

  <!-- PROJECT OVERVIEW -->
  <div class="section">
    <div class="section-header">
      <div class="section-num">1</div>
      <h2>Project Overview</h2>
    </div>
    <div class="info-grid">
      <div class="info-card">
        <div class="info-card-label">Width</div>
        <div class="info-card-value">${boothConfig.width}m</div>
        <div class="info-card-sub">${(boothConfig.width * 100).toFixed(0)} cm total</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">Depth</div>
        <div class="info-card-value">${boothConfig.depth}m</div>
        <div class="info-card-sub">${(boothConfig.depth * 100).toFixed(0)} cm total</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">Wall Thickness</div>
        <div class="info-card-value">${((boothConfig.wallThickness || 0.1) * 100).toFixed(0)}cm</div>
        <div class="info-card-sub">${(boothConfig.wallThickness || 0.1).toFixed(3)}m</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">Booth Walls</div>
        <div class="info-card-value">${walls.length}</div>
        <div class="info-card-sub">Structural + decorative</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">Banners</div>
        <div class="info-card-value">${allBanners.length}</div>
        <div class="info-card-sub">Wall-mounted graphics</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">Windows</div>
        <div class="info-card-value">${allWindows.length}</div>
        <div class="info-card-sub">Openings / apertures</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">Lights</div>
        <div class="info-card-value">${allLights.length}</div>
        <div class="info-card-sub">Lighting fixtures</div>
      </div>
    </div>
  </div>

  <!-- VISUALIZATIONS -->
  <div class="section">
    <div class="section-header">
      <div class="section-num">2</div>
      <h2>3D Visualizations</h2>
    </div>
    <p class="section-desc">High-resolution renders captured from multiple camera positions for complete spatial documentation.</p>
    <div class="views-grid">${viewSections}</div>
  </div>

  <!-- WALL SCHEDULE -->
  ${walls.length > 0 ? `
  <div class="section">
    <div class="section-header">
      <div class="section-num">3</div>
      <h2>Wall Schedule</h2>
    </div>
    <p class="section-desc">Complete listing of all structural and decorative walls including their mounted elements.</p>
    <table>
      <thead><tr><th>Wall ID</th><th>Type</th><th>Dimensions</th><th>Material</th><th>Elements</th></tr></thead>
      <tbody>${wallRows}</tbody>
    </table>
  </div>` : ''}

  <!-- BOM -->
  <div class="section">
    <div class="section-header">
      <div class="section-num">${walls.length > 0 ? '4' : '3'}</div>
      <h2>Bill of Materials — Furniture & Assets</h2>
    </div>
    <p class="section-desc">Consolidated procurement list for all booth assets with quantity, dimensions and specifications.</p>
    ${bomRows ? `<table>
      <thead><tr><th>Qty</th><th>Item</th><th>Dimensions (W×D×H)</th><th>Specifications</th></tr></thead>
      <tbody>${bomRows}</tbody>
    </table>` : '<p style="color:var(--soft);font-style:italic;padding:16px 0;">No furniture assets placed in this design.</p>'}
  </div>

  <!-- WALL ELEMENTS -->
  ${elemRows ? `
  <div class="section">
    <div class="section-header">
      <div class="section-num">${walls.length > 0 ? '5' : '4'}</div>
      <h2>Wall Elements Register</h2>
    </div>
    <p class="section-desc">All banners, windows, and 3D logos mounted on walls within the booth structure.</p>
    <table>
      <thead><tr><th>Type</th><th>Element ID</th><th>Size</th><th>Shape</th><th>Style</th></tr></thead>
      <tbody>${elemRows}</tbody>
    </table>
  </div>` : ''}

  <div class="divider"></div>

  <div class="report-footer">
    <div>
      <strong>Document ID:</strong> ${docId} &nbsp;·&nbsp;
      <strong>Generated:</strong> ${dateStr} at ${timeStr}
    </div>
    <div>Generated by <strong>Dekode Booth Designer</strong> · All rights reserved.</div>
  </div>
</div>
</body>
</html>`;

  saveAs(new Blob([html], { type: 'text/html' }), `booth_report_${docId}.html`);
}
