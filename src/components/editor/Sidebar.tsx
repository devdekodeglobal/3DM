import { useState } from 'react'
import { Box, Layers, PlusSquare, ChevronDown, ChevronRight } from 'lucide-react'
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
}

const categories = [
  {
    folder: 'Fixtures',
    name: 'Fixtures',
    items: [
      { file: 'dustbin.svg',   label: 'Dustbin 1',  initials: 'D1' },
      { file: 'plant.svg',     label: 'Plant 1',    initials: 'P1' },
      { file: 'ceramic_pot.svg', label: 'Pot 1',    initials: 'PT' },
      { file: 'cabinet_1.svg', label: 'Cabinet 1',  initials: 'C1' },
      { file: 'sink_1.svg',    label: 'Sink 1',     initials: 'SK' },
    ],
  },
  {
    folder: 'Chairs',
    name: 'Chairs',
    items: [
      { file: 'chair_1.svg', label: 'Chair 1', initials: 'C1' },
      { file: 'chair_2.svg', label: 'Chair 2', initials: 'C2' },
    ],
  },
  {
    folder: 'Bar_Chairs',
    name: 'Bar Chairs',
    items: [
      { file: 'bar_chair_1.svg', label: 'Bar Chair 1', initials: 'B1' },
    ],
  },
  {
    folder: 'Tables',
    name: 'Tables',
    items: [
      { file: 'table1.svg', label: 'Table 1', initials: 'T1' },
      { file: 'table2.svg', label: 'Table 2', initials: 'T2' },
    ],
  },
  {
    folder: 'Round_Tables',
    name: 'Round Tables',
    items: [
      { file: 'round_table_1.svg', label: 'Round Table 1', initials: 'R1' },
    ],
  },
  {
    folder: 'Info_Desks',
    name: 'Info Desks',
    items: [
      { file: 'infodesk_1.svg', label: 'Info Desk 1', initials: 'ID' },
    ],
  },
]

export default function Sidebar({ addElement }: { addElement: (el: any) => void }) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    Fixtures: true,
    Chairs: false,
    Bar_Chairs: false,
    Tables: false,
    Round_Tables: false,
    Info_Desks: false,
  })

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

  const addAsset = (categoryFolder: string, filename: string) => {
    const assetName = filename.split('.')[0]
    const dims = ASSET_DIMENSIONS[assetName]
    const base = DEFAULT_ASSET_SIZE_PX
    // Scale so the longest side = base, shorter side = ratio * base
    const wRatio = dims ? dims.w : 1
    const hRatio = dims ? dims.h : 1
    const longest = Math.max(wRatio, hRatio)
    const w = Math.max(20, Math.round((wRatio / longest) * base))
    const h = Math.max(20, Math.round((hRatio / longest) * base))
    addElement({
      id: uuidv4(),
      type: 'asset',
      assetName,
      src: `/assets/${categoryFolder}/${filename}`,
      x: 150, y: 150,
      rotation: 0,
      width: w,
      height: h,
    })
  }

  return (
    <aside className="w-64 border-r border-[var(--line)] bg-[var(--surface-strong)] flex flex-col overflow-hidden">
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
                      key={item.file}
                      onClick={() => addAsset(cat.folder, item.file)}
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
    </aside>
  )
}
