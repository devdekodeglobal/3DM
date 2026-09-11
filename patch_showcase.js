const fs = require('fs');
let content = fs.readFileSync('src/components/InteractiveWorkflowShowcase.tsx', 'utf8');

const replacement = `          {/* Canvas Display Content based on Step */}
          <div className="flex-1 flex items-center justify-center relative min-h-[260px] w-full">
            
            {/* Step 0: Set Your Space Animation */}
            <div className={\`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform \${activeStep === 0 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'}\`}>
              <div className="w-full max-w-[280px] h-[220px] relative border-2 border-dashed border-[var(--brand)] rounded-xl flex items-center justify-center bg-[var(--brand-bg)]/20">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 3px 3px, var(--brand) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                <div className="w-48 h-36 border-4 border-[var(--brand)] bg-[var(--bg-card)]/80 rounded-lg shadow-xl relative flex items-center justify-center transition-all duration-700">
                  <span className="text-xs font-mono font-bold text-[var(--brand)] bg-[var(--bg-card)] px-2 py-1 rounded border border-[var(--border-brand)]">
                    6.0m × 5.0m SPACE
                  </span>
                  <div className="absolute -top-6 left-0 right-0 border-b border-sky-500 text-[9px] font-mono text-sky-500 text-center font-bold">6.00m</div>
                  <div className="absolute -left-6 top-0 bottom-0 border-r border-sky-500 text-[9px] font-mono text-sky-500 text-center font-bold flex items-center">5.0m</div>
                </div>
              </div>
            </div>

            {/* Step 1: Place Fixtures Animation */}
            <div className={\`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform \${activeStep === 1 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'}\`}>
              <div className="w-full max-w-[440px] h-[260px] rounded-xl overflow-hidden border border-[var(--brand)]/30 shadow-2xl relative bg-[var(--bg-card)] flex items-center justify-center p-4">
                <BoothIllustration />
              </div>
            </div>

            {/* Step 2: 3D Viewport Room Showcase with 2 Clean Architectural Walls, 1 Table, 4 Chairs */}
            <div className={\`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform \${activeStep === 2 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'}\`}>
              <div className="w-full max-w-[440px] h-[260px] rounded-xl overflow-hidden border border-indigo-500/30 shadow-2xl relative bg-[var(--bg-card)] pointer-events-none">
                <Preview3D
                  autoRotate={true}
                  boothConfig={{
                    width: 6,
                    depth: 5,
                    wallThickness: 0.15,
                    walls: { north: false, south: false, east: false, west: false },
                    floorType: 'hardwood',
                    floorColor: '#e0a96d',
                  }}
                  elements={[
                    // North Wall with Door (Door sits at floor level with y: 40)
                    {
                      id: 'wall-north',
                      type: 'wall',
                      x: 300,
                      y: 20,
                      width: 560,
                      height: 20,
                      thickness: 15,
                      rotation: 0,
                      realWidth: 5.6,
                      realHeight: 2.5,
                      realDepth: 0.15,
                      fill: '#e2e8f0',
                      opacity: 1,
                      material: 'Solid Wall',
                      wallElements: [
                        {
                          id: 'door-north',
                          type: 'door',
                          x: 220,
                          y: 40,
                          width: 90,
                          height: 210,
                          swingSide: 'right',
                          swingDirection: 'inward',
                          color: '#523a28'
                        }
                      ]
                    },
                    // West Wall with Window (Window sits at eye level with y: 70)
                    {
                      id: 'wall-west',
                      type: 'wall',
                      x: 20,
                      y: 250,
                      width: 460,
                      height: 20,
                      thickness: 15,
                      rotation: 90,
                      realWidth: 4.6,
                      realHeight: 2.5,
                      realDepth: 0.15,
                      fill: '#e2e8f0',
                      opacity: 1,
                      material: 'Solid Wall',
                      wallElements: [
                        {
                          id: 'window-west',
                          type: 'window',
                          x: 170,
                          y: 70,
                          width: 120,
                          height: 110,
                          color: '#1e293b'
                        }
                      ]
                    },
                    // South Glass Wall
                    {
                      id: 'wall-south',
                      type: 'wall',
                      x: 300,
                      y: 480,
                      width: 560,
                      height: 20,
                      thickness: 15,
                      rotation: 0,
                      realWidth: 5.6,
                      realHeight: 2.5,
                      realDepth: 0.15,
                      fill: '#38bdf8',
                      opacity: 0.4,
                      material: 'Glass Wall',
                    },
                    // East Glass Wall
                    {
                      id: 'wall-east',
                      type: 'wall',
                      x: 580,
                      y: 250,
                      width: 460,
                      height: 20,
                      thickness: 15,
                      rotation: 90,
                      realWidth: 4.6,
                      realHeight: 2.5,
                      realDepth: 0.15,
                      fill: '#38bdf8',
                      opacity: 0.4,
                      material: 'Glass Wall',
                    },
                    // 1 Executive Table
                    {
                      id: 'demo-table-1',
                      type: 'asset',
                      assetName: 'medola_conference',
                      categoryFolder: 'tables-and-bar-tables',
                      x: 300,
                      y: 250,
                      width: 140,
                      depth: 85,
                      height: 75,
                      rotation: 0,
                    },
                    // Chair 1 (Facing Table from Top)
                    {
                      id: 'demo-chair-1',
                      type: 'asset',
                      assetName: 'catifa',
                      categoryFolder: 'chairs',
                      x: 300,
                      y: 175,
                      width: 55,
                      depth: 55,
                      height: 80,
                      rotation: 180,
                    },
                    // Chair 2 (Facing Table from Bottom)
                    {
                      id: 'demo-chair-2',
                      type: 'asset',
                      assetName: 'catifa',
                      categoryFolder: 'chairs',
                      x: 300,
                      y: 325,
                      width: 55,
                      depth: 55,
                      height: 80,
                      rotation: 0,
                    },
                    // Chair 3 (Facing Table from Left)
                    {
                      id: 'demo-chair-3',
                      type: 'asset',
                      assetName: 'catifa',
                      categoryFolder: 'chairs',
                      x: 225,
                      y: 250,
                      width: 55,
                      depth: 55,
                      height: 80,
                      rotation: 90,
                    },
                    // Chair 4 (Facing Table from Right)
                    {
                      id: 'demo-chair-4',
                      type: 'asset',
                      assetName: 'catifa',
                      categoryFolder: 'chairs',
                      x: 375,
                      y: 250,
                      width: 55,
                      depth: 55,
                      height: 80,
                      rotation: 270,
                    }
                  ]}
                  activeView="perspective"
                  backgroundColor="#1e293b"
                />
              </div>
            </div>

            {/* Step 3: Save to Cloud Animation */}
            <div className={\`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform \${activeStep === 3 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'}\`}>
              <div className="w-full max-w-[280px] h-[220px] rounded-xl bg-[var(--bg-card)] border border-[var(--border-brand)] p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-3 relative">
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center border border-[var(--brand)]/20 shadow-inner">
                  <Cloud className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h5 className="font-extrabold text-sm text-[var(--fg)] flex items-center justify-center gap-1">
                    <Check className="w-4 h-4 text-emerald-500" /> Synced
                  </h5>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Auto-Sync Active
                </div>
              </div>
            </div>
          </div>`;

const regex = /\{\/\* Canvas Display Content based on Step \*\/\}\n[\s\S]*?<\/div>\n\n          \{\/\* Footer note inside mock canvas \*\/\}/;
content = content.replace(regex, replacement + '\n\n          {/* Footer note inside mock canvas */}');
fs.writeFileSync('src/components/InteractiveWorkflowShowcase.tsx', content);
