import { useState, useEffect } from 'react'
import { ArchitecturalSymbolSVG } from './editor/ArchitecturalSymbolSVG'
import Preview3D from './editor/Preview3D'
import { Check, Cloud } from 'lucide-react'

export function InteractiveWorkflowShowcase() {
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance loop every 3.5 seconds if user hasn't manually clicked
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4 as any)
    }, 3500)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const steps = [
    {
      num: '01',
      title: '1. Set Your Space',
      subtitle: 'Define dimensions & outer walls',
      desc: 'Set room footprint and boundary walls.',
    },
    {
      num: '02',
      title: '2. Place Fixtures',
      subtitle: 'Drag & drop scaled 2D symbols',
      desc: 'Position furniture with automatic snap alignment.',
    },
    {
      num: '03',
      title: '3. Preview in 3D',
      subtitle: 'Instant 3D spatial walkthrough',
      desc: 'Materialize your blueprint in 3D.',
    },
    {
      num: '04',
      title: '4. Save to Cloud',
      subtitle: 'Instant sync & device access',
      desc: 'Sync and access your layout anywhere.',
    },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 bg-[var(--bg-card)] border border-[var(--border-brand)] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--brand)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid: Left Controls + Right Animated Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Step selector cards */}
        <div className="md:col-span-5 space-y-3">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx
            return (
              <button
                key={s.num}
                onClick={() => {
                  setActiveStep(idx as any)
                  setIsAutoPlaying(false)
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                  isActive
                    ? 'bg-[var(--surface-strong)] border-[var(--brand)] shadow-lg shadow-[var(--brand)]/10'
                    : 'bg-[var(--bg-page)]/60 border-[var(--line)] hover:border-[var(--brand)]/40 hover:bg-[var(--surface-strong)]'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--brand)] rounded-r" />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[var(--brand)] text-white'
                        : 'bg-[var(--brand-bg)] text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white'
                    }`}
                  >
                    {s.num}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--fg)]">{s.title}</h4>
                    <p className="text-xs text-[var(--fg-soft)] mt-0.5">{s.subtitle}</p>
                  </div>
                </div>

                {/* Progress bar inside active step */}
                {isActive && isAutoPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--brand)]/10">
                    <div className="h-full bg-[var(--brand)] animate-progress-fill" style={{ animationDuration: '3.5s' }} />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Right Side: Animated Mock Canvas Showcase */}
        <div className="md:col-span-7 bg-[var(--bg-subtle)] border border-[var(--line)] rounded-2xl p-4 md:p-6 min-h-[360px] flex flex-col justify-between relative overflow-hidden shadow-inner">
          
          {/* Header Bar of Mock Canvas */}
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[11px] font-mono text-[var(--fg-dim)] ml-2 font-semibold">
                Krafc Workspace
              </span>
            </div>

            {/* Viewport Badge */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all duration-300 ${
                activeStep === 2
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md'
                  : 'bg-[var(--brand-bg)] text-[var(--brand)]'
              }`}>
                {activeStep === 2 ? '3D VIEWPORT' : '2D BLUEPRINT'}
              </span>
            </div>
          </div>

          {/* Canvas Display Content based on Step */}
          <div className="flex-1 flex items-center justify-center relative min-h-[240px]">
            
            {/* Step 0: Set Your Space Animation */}
            {activeStep === 0 && (
              <div className="w-full max-w-[280px] h-[220px] relative border-2 border-dashed border-[var(--brand)] rounded-xl flex items-center justify-center bg-[var(--brand-bg)]/20 animate-fade-in">
                {/* Grid dots */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 3px 3px, var(--brand) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                
                {/* Walls Drawing Motion */}
                <div className="w-48 h-36 border-4 border-[var(--brand)] bg-[var(--bg-card)]/80 rounded-lg shadow-xl relative flex items-center justify-center transition-all duration-700">
                  <span className="text-xs font-mono font-bold text-[var(--brand)] bg-[var(--bg-card)] px-2 py-1 rounded border border-[var(--border-brand)]">
                    6.0m × 5.0m SPACE
                  </span>
                  {/* Measurement Lines */}
                  <div className="absolute -top-6 left-0 right-0 border-b border-sky-500 text-[9px] font-mono text-sky-500 text-center font-bold">6.00m</div>
                  <div className="absolute -left-6 top-0 bottom-0 border-r border-sky-500 text-[9px] font-mono text-sky-500 text-center font-bold flex items-center">5.0m</div>
                </div>
              </div>
            )}

            {/* Step 1: Place Fixtures Animation */}
            {activeStep === 1 && (
              <div className="w-full max-w-[280px] h-[220px] relative border-2 border-[var(--brand)] rounded-xl bg-[var(--bg-card)] p-4 shadow-xl animate-fade-in overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 3px 3px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                
                <div className="w-full h-full border border-slate-300 dark:border-slate-700 rounded relative flex items-center justify-center">
                  {/* Table symbol */}
                  <div className="w-24 h-14 border-2 border-slate-700 dark:border-slate-200 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 shadow-md transform animate-bounce-short">
                    <ArchitecturalSymbolSVG category="table" assetName="table" className="w-full h-full p-1 text-slate-800 dark:text-slate-200" />
                  </div>

                  {/* Chairs around table */}
                  <div className="absolute top-2 w-8 h-8">
                    <ArchitecturalSymbolSVG category="chairs" assetName="catifa" className="w-full h-full text-slate-800 dark:text-slate-200" />
                  </div>
                  <div className="absolute bottom-2 w-8 h-8">
                    <ArchitecturalSymbolSVG category="chairs" assetName="catifa" className="w-full h-full text-slate-800 dark:text-slate-200" />
                  </div>

                  {/* Floating drag-and-drop badge */}
                  <div className="absolute -top-2 right-2 bg-[var(--cta)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow animate-pulse">
                    + Dropped Table
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: 3D Viewport Room Showcase with 2 Clean Architectural Walls, 1 Table, 2 Chairs */}
            {activeStep === 2 && (
              <div className="w-full max-w-[440px] h-[260px] rounded-xl overflow-hidden border border-indigo-500/30 shadow-2xl relative animate-fade-in bg-[var(--bg-card)]">
                <Preview3D
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
                    }
                  ]}
                  activeView="perspective"
                  backgroundColor="#1e293b"
                />
              </div>
            )}

            {/* Step 3: Save to Cloud Animation */}
            {activeStep === 3 && (
              <div className="w-full max-w-[280px] h-[220px] rounded-xl bg-[var(--bg-card)] border border-[var(--border-brand)] p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-3 animate-fade-in relative">
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
            )}
          </div>

          {/* Footer note inside mock canvas */}
          <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--fg-soft)]">
            <span className="font-semibold">{steps[activeStep].desc}</span>
            <span className="font-mono text-[10px] text-[var(--fg-dim)]">Step {activeStep + 1} / 4</span>
          </div>
        </div>

      </div>
    </div>
  )
}
