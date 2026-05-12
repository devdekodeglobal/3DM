import { useState } from 'react'
import { Box, PlusSquare, ChevronDown, ChevronRight, Download, LayoutGrid } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { ASSET_DIMENSIONS, DEFAULT_ASSET_SIZE_PX } from '../../lib/assetDimensions'

// Category color system — each category gets a unique hue
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Fixtures:     { bg: 'rgba(245,158,11,0.12)', text: '#92400e', border: 'rgba(245,158,11,0.3)', dot: '#f59e0b' },
  Chairs:       { bg: 'rgba(99,102,241,0.12)',  text: '#3730a3', border: 'rgba(99,102,241,0.3)',  dot: '#6366f1' },
  Bar_Chairs:   { bg: 'rgba(168,85,247,0.12)',  text: '#6b21a8', border: 'rgba(168,85,247,0.3)',  dot: '#a855f7' },
  Tables:       { bg: 'rgba(6,182,212,0.12)',   text: '#155e75', border: 'rgba(6,182,212,0.3)',   dot: '#06b6d4' },
  Round_Tables: { bg: 'rgba(16,185,129,0.12)',  text: '#065f46', border: 'rgba(16,185,129,0.3)',  dot: '#10b981' },
  Info_Desks:   { bg: 'rgba(244,63,94,0.12)',   text: '#9f1239', border: 'rgba(244,63,94,0.3)',   dot: '#f43f5e' },
  Electronics:  { bg: 'rgba(14,165,233,0.12)',   text: '#0369a1', border: 'rgba(14,165,233,0.3)',   dot: '#0ea5e9' },
}

const categories = [
  {
    folder: 'Fixtures',
    name: 'Fixtures',
    items: [
      { name: 'dustbin',   label: 'Dustbin 1',  initials: 'D1' },
      { name: 'plant',     label: 'Plant 1',    initials: 'P1' },
      { name: 'ceramic_pot', label: 'Pot 1',    initials: 'PT' },
      { name: 'cabinet_1', label: 'Cabinet 1',  initials: 'C1' },
      { name: 'sink_1',    label: 'Sink 1',     initials: 'SK' },
    ],
  },
  {
    folder: 'Chairs',
    name: 'Chairs',
    items: [
      { name: '03_black_draco', label: 'Pro Chair Black', initials: 'CB' },
      { name: '03_red_draco', label: 'Pro Chair Red', initials: 'CR' },
      { name: 'chair_1', label: 'Dining Chair', initials: 'C1' },
      { name: 'chair_2', label: 'Armchair', initials: 'C2' },
      { name: 'modern_dining_chair', label: 'Modern Chair', initials: 'MC' },
      { name: 'bar_chair_1', label: 'Bar Stool', initials: 'BS' },
    ],
  },
  {
    folder: 'Bar_Chairs',
    name: 'Bar Chairs',
    items: [
      { name: 'bar_chair_1', label: 'Bar Chair 1', initials: 'B1' },
    ],
  },
  {
    folder: 'Tables',
    name: 'Tables',
    items: [
      { name: 'table1', label: 'Table 1', initials: 'T1' },
      { name: 'table2', label: 'Table 2', initials: 'T2' },
      { name: 'coffee_table', label: 'Coffee Table', initials: 'CT' },
      { name: 'rectangular_side_coffee_table', label: 'Side Table', initials: 'ST' },
      { name: 'table', label: 'Long Table', initials: 'LT' },
    ],
  },
  {
    folder: 'Electronics',
    name: 'Electronics',
    items: [
      { name: 'tv_lcd', label: 'LCD TV', initials: 'TV' },
      { name: 'game_ready_free_livingroom_tv', label: 'Modern TV', initials: 'MT' },
    ],
  },
  {
    folder: 'Round_Tables',
    name: 'Round Tables',
    items: [
      { name: 'round_table_1', label: 'Round Table 1', initials: 'R1' },
    ],
  },
  {
    folder: 'Info_Desks',
    name: 'Info Desks',
    items: [
      { name: 'infodesk_1', label: 'Info Desk 1', initials: 'ID' },
    ],
  },
]

export default function Sidebar({ 
  addElement, 
  activeView = 'perspective', 
  onViewChange 
}: { 
  addElement: (el: any) => void;
  activeView?: string;
  onViewChange?: (view: any) => void;
}) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    Fixtures: true,
    Chairs: false,
    Bar_Chairs: false,
    Tables: false,
    Round_Tables: false,
    Info_Desks: false,
    Electronics: false,
    Technical: false,
  })

  const [isTechOpen, setIsTechOpen] = useState(false)

  const toggleCategory = (folder: string) => {
    setOpenCategories(prev => ({ ...prev, [folder]: !prev[folder] }))
  }

  const addWall = () => {
    addElement({
      id: uuidv4(),
      type: 'wall',
      x: 100, y: 100,
      width: 200, height: 20,
      thickness: 10, rotation: 0,
      fill: '#333333', opacity: 1,
      material: 'Solid Wall',
    })
  }

  const addAsset = (categoryFolder: string, assetName: string) => {
    const dims = ASSET_DIMENSIONS[assetName]
    const base = DEFAULT_ASSET_SIZE_PX
    const wRatio = dims ? dims.w : 1
    const hRatio = dims ? dims.h : 1
    const longest = Math.max(wRatio, hRatio)
    const w = Math.max(20, Math.round((wRatio / longest) * base))
    const h = Math.max(20, Math.round((hRatio / longest) * base))
    addElement({
      id: uuidv4(),
      type: 'asset',
      assetName,
      src: `/assets/${categoryFolder}/${assetName}`,
      x: 150, y: 150,
      rotation: 0,
      width: w,
      height: h,
    })
  }



  const add3DLogo = () => {
    addElement({
      id: uuidv4(),
      type: '3d_logo',
      svgData: null,
      x: 250, y: 250,
      width: 100, height: 100,
      rotation: 0,
      depth: 5, // cm
      logoStyle: 'matte', // matte, chrome, glowing, glass
      logoColor: '#ffffff',
      yOffset: 1.2,
      verticalScale: 1,
    })
  }

  const TECHNICAL_VIEWS = [
    { id: 'perspective', label: '3D Orbit',  icon: <Box className="w-3 h-3" /> },
    { id: 'top',         label: 'Top View', icon: <Download className="w-3 h-3" /> },
    { id: 'north',       label: 'North Elev', icon: <Download className="w-3 h-3" /> },
    { id: 'south',       label: 'South Elev', icon: <Download className="w-3 h-3" /> },
    { id: 'east',        label: 'East Elev',  icon: <Download className="w-3 h-3" /> },
    { id: 'west',        label: 'West Elev',  icon: <Download className="w-3 h-3" /> },
  ]

  return (
    <aside className="w-64 h-full border-r border-[var(--line)] bg-[var(--surface-strong)] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[var(--line)] shrink-0">
        <h3 className="font-bold text-[var(--sea-ink)] flex items-center gap-2">
          <Box className="h-5 w-5 text-[var(--lagoon-deep)]" />
          Asset Library
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">


        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-2">
            Core Structures
          </p>
          <button
            onClick={addWall}
            className="w-full flex items-center justify-center gap-2 p-3 bg-[var(--brand)] text-white rounded-xl font-semibold hover:bg-[var(--brand-h)] transition shadow-sm"
          >
            <PlusSquare className="h-4 w-4" /> Add Wall
          </button>
          <button
            onClick={add3DLogo}
            className="w-full mt-2 flex items-center justify-center gap-2 p-3 bg-[var(--lagoon-deep)] text-white rounded-xl font-semibold hover:bg-[var(--palm)] transition shadow-sm"
          >
            <PlusSquare className="h-4 w-4" /> Add 3D Logo
          </button>
        </div>

        <div className="w-full h-px bg-[var(--line)] my-2" />

        {categories.map((cat) => {
          const isOpen = openCategories[cat.folder]
          const colors = CATEGORY_COLORS[cat.folder]
          return (
            <div key={cat.folder} className="border-b border-[var(--line)] pb-3 last:border-0">
              <button
                onClick={() => toggleCategory(cat.folder)}
                className="w-full flex items-center justify-between py-2 group"
              >
                <span className="flex items-center gap-2">
                  {/* Category color dot */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: colors.dot }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)] transition-colors">
                    {cat.name}
                  </span>
                </span>
                {isOpen
                  ? <ChevronDown className="h-3 w-3 text-[var(--sea-ink-soft)]" />
                  : <ChevronRight className="h-3 w-3 text-[var(--sea-ink-soft)]" />
                }
              </button>

              {isOpen && (
                <div className="grid grid-cols-2 gap-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {cat.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => addAsset(cat.folder, item.name)}
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 group"
                      style={{
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                      }}
                    >
                      {/* Letter-Mark Badge */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-black tracking-tight border transition-transform duration-150 group-hover:scale-110"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.6)',
                          color: colors.text,
                          borderColor: colors.border,
                        }}
                      >
                        {item.initials}
                      </div>
                      <span
                        className="text-[9px] font-bold uppercase tracking-tight text-center leading-tight"
                        style={{ color: colors.text }}
                      >
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fixed Bottom Technical Section */}
      <div className="border-t border-[var(--line)] bg-[var(--surface-light)] shrink-0">
        <button 
          onClick={() => setIsTechOpen(!isTechOpen)}
          className="w-full p-4 flex items-center justify-between group hover:bg-[var(--surface-strong)] transition-colors"
        >
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--sea-ink-soft)] flex items-center gap-2">
            <LayoutGrid className="w-3 h-3 text-[var(--lagoon-deep)]" />
            Technical Drawings
          </p>
          {isTechOpen 
            ? <ChevronDown className="h-3 w-3 text-[var(--sea-ink-soft)]" /> 
            : <ChevronRight className="h-3 w-3 text-[var(--sea-ink-soft)]" />
          }
        </button>
        
        {isTechOpen && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {TECHNICAL_VIEWS.map(view => (
              <button
                key={view.id}
                onClick={() => onViewChange?.(view.id)}
                className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-[10px] font-bold transition-all ${
                  activeView === view.id 
                    ? 'bg-[var(--lagoon)] text-white border-[var(--lagoon-deep)] shadow-sm' 
                    : 'bg-[var(--sand)] text-[var(--sea-ink-soft)] border-transparent hover:border-[var(--line)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {view.id === 'perspective' ? <Box className="w-2.5 h-2.5" /> : null}
                  {view.label}
                </div>
                {view.id !== 'perspective' && (
                    <div 
                    onClick={(e) => { e.stopPropagation(); onViewChange?.(view.id + '_download' as any); }}
                    className="p-1 hover:bg-white/20 rounded-md transition-colors"
                    >
                      <Download className="w-3 h-3" />
                    </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
