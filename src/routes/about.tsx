import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Monitor, Layers, Box, Palette, FolderOpen, Save, FileText, Camera } from 'lucide-react'
import { useEffect } from 'react'
import { ArchitecturalSymbolSVG } from '../components/editor/ArchitecturalSymbolSVG'
import { ScrollReveal } from '../components/ScrollReveal'

export const Route = createFileRoute('/about')({
  component: OverviewPage,
})

function OverviewPage() {
  useEffect(() => {
    document.title = 'Overview | krafc'
  }, [])

  return (
    <main className="page-wrap px-4 py-12 md:py-24 max-w-7xl mx-auto space-y-32">
      
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] font-bold text-sm tracking-wide animate-fade-in">
          <Monitor className="w-4 h-4" /> The Professional Spatial Platform
        </div>
        <h1 className="display-title text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--fg)] tracking-tight leading-tight">
          Design in 2D. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--lagoon)] to-[var(--brand)]">Experience in 3D.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--fg-soft)] leading-relaxed">
          krafc is a professional, browser-based spatial design platform. Plan your rooms and exhibition spaces in a lightning-fast 2D blueprint editor, and watch them instantly materialize into immersive, real-time 3D environments.
        </p>
        <div className="pt-8 flex justify-center gap-4">
          <Link to="/editor" className="btn btn-primary" style={{ padding: '15px 36px', fontSize: '1.1rem' }}>
            Open Designer <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* The Interface Diagram */}
      <section className="space-y-12">
        <ScrollReveal animation="fade-up">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--fg)]">The Professional Workspace</h2>
            <p className="text-[var(--fg-soft)] mt-4 max-w-2xl mx-auto">
              Everything you need, perfectly organized. Our split-panel interface allows you to design, edit, and visualize simultaneously without constantly switching tabs.
            </p>
          </div>
        </ScrollReveal>

        {/* Abstract UI Diagram */}
        <ScrollReveal animation="zoom-in" delay={150}>
          <div className="relative max-w-5xl mx-auto bg-[var(--bg-base)] border border-[var(--line)] rounded-2xl p-2 shadow-2xl">
            <div className="w-full">
              {/* Mock Header */}
              <div className="h-6 md:h-10 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-2 md:px-4 rounded-t-xl overflow-hidden">
               <div className="flex gap-1 md:gap-2 shrink-0"><div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-red-400"></div><div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-amber-400"></div><div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-green-400"></div></div>
               <div className="flex gap-2 md:gap-4 text-[5px] md:text-[10px] font-bold text-[var(--fg-dim)] uppercase tracking-widest whitespace-nowrap ml-2">
                 <span>Undo</span><span>Redo</span><span>Save Project</span><span className="hidden sm:inline">Export Report</span>
               </div>
              </div>
            
            {/* Mock Workspace Grid */}
            <div className="grid grid-cols-12 gap-1 md:gap-2 p-1 md:p-2 h-[200px] md:h-[400px]">
              
              {/* Sidebar Diagram */}
              <div className="col-span-3 bg-[var(--surface-strong)] rounded-lg border border-[var(--line)] p-1 md:p-4 flex flex-col gap-1 md:gap-4 group hover:border-[var(--lagoon)] transition-colors relative overflow-hidden">
                <div className="flex items-center gap-1 md:gap-2 text-[var(--fg)] font-bold mb-1 md:mb-2 text-[6px] md:text-base leading-tight"><FolderOpen className="w-2 h-2 md:w-4 md:h-4 text-[var(--lagoon)]" /> Asset Lib</div>
                <div className="h-8 bg-[var(--bg-base)] rounded-md w-full border border-[var(--line)] px-2 flex items-center text-[5px] md:text-[9px] text-[var(--fg-dim)]">Search lounge assets</div>
                <div className="flex-1 space-y-1.5 md:space-y-2">
                  {[
                    { category: 'lounge', assetName: 'soft', label: 'Soft II Sofa' },
                    { category: 'lounge', assetName: 'egg', label: 'Egg Chair' },
                    { category: 'counter', assetName: 'buffet', label: 'Lumino Buffet' },
                  ].map((asset, index) => (
                    <div key={asset.label} className={`h-10 md:h-14 rounded-md w-full border px-1.5 md:px-2 flex items-center gap-1.5 md:gap-2 ${index === 2 ? 'bg-[var(--brand)]/10 border-[var(--brand)]' : 'bg-[var(--bg-base)] border-[var(--line)]'}`}>
                      <div className="w-6 h-6 md:w-9 md:h-9 rounded bg-[var(--surface)] p-0.5 md:p-1 shrink-0">
                        <ArchitecturalSymbolSVG category={asset.category} assetName={asset.assetName} className="w-full h-full text-[var(--brand)]" />
                      </div>
                      <span className="text-[5px] md:text-[9px] font-bold text-[var(--fg)] truncate">{asset.label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-[var(--lagoon)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Canvas Diagram */}
              <div className="col-span-3 bg-[#2a2c2e] rounded-lg border border-[var(--line)] relative group hover:border-[var(--brand)] transition-colors overflow-hidden">
                 {/* Grid Pattern */}
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '10px 10px md:20px md:20px' }}></div>
                 <div className="absolute inset-0 flex items-center justify-center p-3 md:p-7 pt-7 md:pt-14">
                   <div className="w-full aspect-[10/7] border-t-2 border-l-2 border-[#9f7aea] bg-[#514A68]/35 relative shadow-inner overflow-hidden">
                      <div className="absolute left-[3%] top-[12%] w-[40%] h-[57%] border border-[#B47AD4]/80 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_7%,rgba(180,122,212,.75)_8%,rgba(180,122,212,.75)_10%)]" />
                      <div className="absolute left-[8%] top-[25%] w-[8%] h-[24%] rounded-sm bg-slate-300/80" />
                      <div className="absolute left-[8%] top-[53%] w-[8%] h-[24%] rounded-sm bg-slate-300/80" />
                      <div className="absolute left-[29%] top-[29%] w-[9%] h-[13%] rounded-full bg-slate-800" />
                      <div className="absolute left-[29%] top-[54%] w-[9%] h-[13%] rounded-full bg-slate-800" />
                      <div className="absolute left-[65%] top-[17%] w-[22%] h-[11%] rounded-sm bg-cyan-400/70" />
                      {[66, 75, 84].map((left) => <div key={left} className="absolute top-[36%] w-[4%] aspect-square rounded-full border border-slate-200" style={{ left: `${left}%` }} />)}
                      {[63, 82].map((left) => <div key={left} className="absolute top-[69%] w-[10%] aspect-square rounded-full border border-slate-300" style={{ left: `${left}%` }} />)}
                      <div className="absolute right-[13%] top-[18%] text-white text-[4px] md:text-[7px] font-black drop-shadow">krafc<span className="text-fuchsia-400">.</span></div>
                   </div>
                 </div>
                 <div className="absolute top-1 left-1 md:top-4 md:left-4 flex items-center gap-1 md:gap-2 text-white font-bold text-[6px] md:text-base leading-tight"><Layers className="w-2 h-2 md:w-4 md:h-4 text-[var(--brand)]" /> 2D Blueprint</div>
                 <div className="absolute inset-0 bg-[var(--brand)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              {/* Properties Diagram */}
              <div className="col-span-3 bg-[var(--surface-strong)] rounded-lg border border-[var(--line)] p-1 md:p-4 flex flex-col gap-1 md:gap-4 group hover:border-[var(--cta)] transition-colors relative overflow-hidden">
                <div className="flex items-center gap-1 md:gap-2 text-[var(--fg)] font-bold mb-1 md:mb-2 text-[6px] md:text-base leading-tight"><Palette className="w-2 h-2 md:w-4 md:h-4 text-[var(--cta)]" /> Props</div>
                <div className="w-2/3 h-4 bg-[var(--bg-base)] rounded-sm px-1 flex items-center text-[5px] md:text-[8px] font-bold text-[var(--fg-dim)]">SPACE</div>
                <div className="grid grid-cols-2 gap-1 md:gap-2">
                  {[
                    { label: 'Tile floor', color: '#514A68' },
                    { label: 'Plum wall', color: '#30254F' },
                    { label: 'Neon lights', color: '#00EEFF' },
                    { label: 'Caged roof', color: '#B47AD4' },
                  ].map((material, index) => (
                    <div key={material.label} className={`h-12 md:h-16 rounded-md border p-1 md:p-2 flex flex-col justify-between ${index === 3 ? 'bg-[var(--brand)]/10 border-[var(--brand)]' : 'bg-[var(--bg-base)] border-[var(--line)]'}`}>
                      <div className="w-full h-5 md:h-7 rounded-sm shadow-inner" style={{ backgroundColor: material.color }} />
                      <span className="text-[4px] md:text-[8px] font-bold text-[var(--fg)] truncate">{material.label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-[var(--cta)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* 3D View Render */}
              <div className="col-span-3 bg-[#5d6163] rounded-lg border border-[var(--line)] relative group hover:border-[var(--brand-dark)] transition-colors overflow-hidden shadow-inner">
                <img
                  src="/afterglow-3d-preview.png"
                  alt="3D view of the furnished social space"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute top-1 left-1 md:top-3 md:left-3 z-10 flex items-center gap-1 md:gap-2 rounded-md bg-slate-950/80 px-1.5 py-1 md:px-2.5 md:py-1.5 text-white font-bold text-[6px] md:text-sm leading-tight shadow-lg backdrop-blur-sm ring-1 ring-white/15">
                  <Box className="w-2 h-2 md:w-4 md:h-4 text-cyan-300" /> 3D View
                </div>
              </div>

            </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Feature Deep Dives */}
      <section className="space-y-24">
        
        {/* Feature 1 */}
        <ScrollReveal animation="slide-left">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--lagoon)]/10 flex items-center justify-center text-[var(--lagoon)]">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Comprehensive Asset Library</h3>
              <p className="text-[var(--fg-soft)] text-lg leading-relaxed">
                Browse through our extensive, categorized library of professional 3D models. From standard structures and exhibition walls to detailed furniture like sofas, tables, and ambient decor. Simply drag and drop an item into the scene.
              </p>
            </div>
            <div className="w-full md:flex-1 island-shell p-6 rounded-3xl border border-[var(--line)]">
               <ul className="space-y-3">
                 {/* Sofa */}
                 <li className="flex items-center gap-4 p-3 bg-[var(--bg-base)] rounded-lg hover:bg-[var(--surface)] transition-colors cursor-default border border-transparent hover:border-[var(--line)]">
                   <div className="w-9 h-9 bg-[var(--brand)]/10 rounded-md flex items-center justify-center p-1">
                     <ArchitecturalSymbolSVG category="lounge" assetName="format" className="w-full h-full text-[var(--brand)]" />
                   </div>
                   <div><p className="font-bold text-[var(--fg)] text-sm">Alcove Sofa</p><p className="text-[10px] text-[var(--fg-dim)]">Armchairs & Lounges</p></div>
                 </li>
                 
                 {/* Table */}
                 <li className="flex items-center gap-4 p-3 bg-[var(--bg-base)] rounded-lg border border-[var(--brand)] relative shadow-[var(--shadow-brand)]">
                   <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--brand)] rounded-full border-4 border-[var(--bg-page)]" />
                   <div className="w-9 h-9 bg-[var(--brand)]/20 rounded-md flex items-center justify-center p-1">
                     <ArchitecturalSymbolSVG category="table" assetName="round" className="w-full h-full text-[var(--brand)]" />
                   </div>
                   <div><p className="font-bold text-[var(--fg)] text-sm">Round Table</p><p className="text-[10px] text-[var(--fg-dim)]">Tables & Desks</p></div>
                 </li>
                 
                 {/* Plant */}
                 <li className="flex items-center gap-4 p-3 bg-[var(--bg-base)] rounded-lg hover:bg-[var(--surface)] transition-colors cursor-default border border-transparent hover:border-[var(--line)]">
                   <div className="w-9 h-9 bg-[var(--brand)]/5 rounded-md flex items-center justify-center p-1">
                     <svg viewBox="-16 -16 32 32" className="w-full h-full text-[var(--brand)]" fill="none" stroke="currentColor" strokeWidth="1.5">
                       <circle cx="0" cy="0" r="10" className="fill-current opacity-20" />
                       <path d="M-6 -6 Q0 -12 6 -6 Q12 0 6 6 Q0 12 -6 6 Q-12 0 -6 -6" className="fill-current opacity-40" />
                       <circle cx="0" cy="0" r="3" className="fill-current" />
                     </svg>
                   </div>
                   <div><p className="font-bold text-[var(--fg)] text-sm">Potted Plant</p><p className="text-[10px] text-[var(--fg-dim)]">Decorations</p></div>
                 </li>
               </ul>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature 2 */}
        <ScrollReveal animation="slide-right">
          <div className="flex flex-col md:flex-row-reverse items-stretch md:items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Precision 2D Blueprint Editor</h3>
              <p className="text-[var(--fg-soft)] text-lg leading-relaxed">
                Design with architectural accuracy. The blueprint canvas acts as your floor plan, complete with a measurable snap-grid. Move objects, adjust rotations, define room dimensions, and toggle individual structural walls with mathematical precision.
              </p>
            </div>
            <div className="w-full md:flex-1 bg-[#2a2c2e] rounded-3xl h-64 border border-[var(--line)] shadow-inner relative overflow-hidden flex items-center justify-center shrink-0">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 4px 4px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="w-32 h-32 sm:w-48 sm:h-48 border-l-4 border-b-4 border-r-4 border-orange-500/80 bg-orange-500/10 flex items-center justify-center relative">
                   <div className="absolute top-0 left-0 w-full h-1 border-t-4 border-dashed border-orange-500/30" />
                   <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/10 border border-white/30 rotate-45 rounded-sm" />
                   <div className="absolute -bottom-8 text-xs text-orange-400 font-mono tracking-widest">5M X 5M SPACE</div>
                </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature 3 */}
        <ScrollReveal animation="slide-left">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--cta)]/10 flex items-center justify-center text-[var(--cta)]">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Contextual Properties & Materials</h3>
              <p className="text-[var(--fg-soft)] text-lg leading-relaxed">
                Select any object or the floor itself to access the dynamic properties panel. Instantly swap out floor surfaces like Hardwood, Polished Marble, or Carpet. Adjust object scales, tweak custom color codes, and toggle structural ceilings on the fly.
              </p>
            </div>
            <div className="w-full md:flex-1 island-shell p-8 rounded-3xl border border-[var(--line)]">
               <h4 className="text-xs font-bold text-[var(--fg-dim)] tracking-widest uppercase mb-4">Floor Surface</h4>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--line)]">
                    <div className="flex items-center gap-3"><div className="w-6 h-6 bg-amber-700 rounded-sm" /><span className="font-bold text-[var(--fg)]">Hardwood</span></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[var(--brand)]/10 rounded-xl border border-[var(--brand)]">
                    <div className="flex items-center gap-3"><div className="w-6 h-6 bg-slate-100 rounded-sm border border-slate-300" /><span className="font-bold text-[var(--brand)]">Polished Marble</span></div>
                    <div className="w-2 h-2 rounded-full bg-[var(--brand)]" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--line)]">
                    <div className="flex items-center gap-3"><div className="w-6 h-6 bg-slate-700 rounded-sm" /><span className="font-bold text-[var(--fg)]">Carpet</span></div>
                  </div>
               </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature 4 */}
        <ScrollReveal animation="slide-right">
          <div className="flex flex-col md:flex-row-reverse items-stretch md:items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--brand-dark)]/10 flex items-center justify-center text-[var(--brand-dark)]">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Immersive Live 3D View</h3>
              <p className="text-[var(--fg-soft)] text-lg leading-relaxed">
                Every change you make in the blueprint instantly updates in the beautiful, hardware-accelerated 3D viewport. Orbit around your creation, switch to Flight Mode for a first-person walkthrough, and capture high-resolution snapshot renders with a single click.
              </p>
            </div>
            <div className="w-full md:flex-1 island-shell p-2 rounded-3xl border border-[var(--line)] shrink-0">
               <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-400 rounded-2xl relative shadow-inner flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap max-w-[80%]">
                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-bold tracking-widest">ORBIT MODE</div>
                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-bold tracking-widest">HQ: ON</div>
                  </div>
                  {/* Fake 3D Environment */}
                  <div className="w-full h-1/2 absolute bottom-0 bg-slate-500/20 transform perspective-500 rotateX-60" />
                  <div className="w-32 h-32 bg-white/90 shadow-2xl rounded-lg border border-slate-200 transform rotate-12 scale-110 z-10 flex items-center justify-center">
                     <div className="w-16 h-16 bg-slate-800 rounded-full shadow-inner" />
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                     <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white"><Camera className="w-4 h-4" /></div>
                  </div>
               </div>
            </div>
          </div>
        </ScrollReveal>

      </section>

      {/* Global Actions Bar Section */}
      <section className="border-t border-[var(--line)] pt-24 text-center">
        <ScrollReveal animation="fade-up">
          <h2 className="text-3xl font-bold text-[var(--fg)] mb-8">Seamless Project Management</h2>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <ScrollReveal animation="fade-up" delay={100}>
             <div className="p-6 bg-[var(--surface-strong)] border border-[var(--line)] rounded-2xl h-full">
                <Save className="w-8 h-8 text-[var(--lagoon)] mx-auto mb-4" />
                <h3 className="font-bold text-[var(--fg)] mb-2">Cloud Save</h3>
                <p className="text-sm text-[var(--fg-soft)]">Log in to securely save and sync your projects instantly to our cloud database.</p>
             </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
             <div className="p-6 bg-[var(--surface-strong)] border border-[var(--line)] rounded-2xl h-full">
                <Monitor className="w-8 h-8 text-[var(--brand)] mx-auto mb-4" />
                <h3 className="font-bold text-[var(--fg)] mb-2">Import & Resume</h3>
                <p className="text-sm text-[var(--fg-soft)]">Switch devices? No problem. Pull up your saved spaces and continue designing.</p>
             </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={300}>
             <div className="p-6 bg-[var(--surface-strong)] border border-[var(--line)] rounded-2xl h-full">
                <FileText className="w-8 h-8 text-[var(--cta)] mx-auto mb-4" />
                <h3 className="font-bold text-[var(--fg)] mb-2">Professional Reports</h3>
                <p className="text-sm text-[var(--fg-soft)]">Generate formatted technical reports containing dimensions, item lists, and 3D screenshots.</p>
             </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  )
}

