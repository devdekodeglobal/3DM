import { useState, useMemo } from 'react'
import { Box, PlusSquare, ChevronDown, ChevronRight, Download, LayoutGrid, Search } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { ASSET_DIMENSIONS, ASSET_CATEGORIES, ASSET_REGISTRY } from '../../lib/assetRegistry'

const DEFAULT_ASSET_SIZE_PX = 100

export default function Sidebar({ 
  addElement, 
  activeView = 'perspective', 
  onViewChange 
}: { 
  addElement: (el: any) => void;
  activeView?: string;
  onViewChange?: (view: any) => void;
}) {
  const [isTechOpen, setIsTechOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(ASSET_CATEGORIES[0].id)
  const [searchQuery, setSearchQuery] = useState('')

  const addWall = () => {
    addElement({
      id: uuidv4(),
      type: 'wall',
      x: 100, y: 100,
      width: 200, height: 20,
      thickness: 10, rotation: 0,
      realWidth: 2.0,
      realHeight: 2.5,
      realDepth: 0.1, // same as thickness
      fill: '#333333', opacity: 1,
      material: 'Solid Wall',
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

  const addAsset = (categoryFolder: string, assetName: string) => {
    const asset = ASSET_REGISTRY.find(a => a.id === assetName)
    const dims = ASSET_DIMENSIONS[assetName] as any
    const base = DEFAULT_ASSET_SIZE_PX
    
    let w, h;
    if (dims && dims.specW && dims.specD) {
      w = dims.specW * 100;
      h = dims.specD * 100;
    } else {
      const wRatio = dims ? dims.w : 1
      const hRatio = dims ? dims.h : 1
      const longest = Math.max(wRatio, hRatio)
      w = Math.max(20, Math.round((wRatio / longest) * base))
      h = Math.max(20, Math.round((hRatio / longest) * base))
    }
    
    addElement({
      id: uuidv4(),
      type: 'asset',
      assetName,
      categoryFolder,
      label: asset ? asset.label : assetName,
      details: asset ? asset.details : '',
      x: 150, y: 150,
      rotation: 0,
      width: w,
      height: h,
      specH: dims ? dims.specH : null,
      realWidth: Number((w / 100).toFixed(2)),
      realHeight: dims?.specH ? Number(dims.specH.toFixed(2)) : 1.0,
      realDepth: Number((h / 100).toFixed(2)),
      yOffset: 0,
      verticalScale: 1
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

  const filteredAssets = useMemo(() => {
    let filtered = ASSET_REGISTRY
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory)
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(a => a.label.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
    }
    return filtered
  }, [selectedCategory, searchQuery])

  return (
    <aside className="w-64 h-full border-r border-[var(--line)] bg-[var(--surface-strong)] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[var(--line)] shrink-0">
        <h3 className="font-bold text-[var(--sea-ink)] flex items-center gap-2">
          <Box className="h-5 w-5 text-[var(--lagoon-deep)]" />
          Asset Library
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
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

        <div className="flex flex-col gap-3 flex-1 overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
            3D Models
          </p>
          
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full p-2 bg-[var(--sand)] border border-[var(--line)] rounded-lg text-xs font-bold text-[var(--sea-ink)] outline-none focus:border-[var(--lagoon)]"
          >
            <option value="all">All Categories</option>
            {ASSET_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-[var(--line)] rounded-lg text-xs outline-none focus:border-[var(--lagoon)] shadow-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto mt-2 space-y-2 pr-1 custom-scrollbar">
            {filteredAssets.length === 0 ? (
              <div className="text-xs text-center text-gray-400 py-4">No assets found</div>
            ) : (
              filteredAssets.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => addAsset(asset.category, asset.id)}
                  className="w-full text-left p-2.5 rounded-xl border border-[var(--line)] bg-[var(--sand)] hover:bg-white hover:border-[var(--lagoon)] transition group flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] flex items-center justify-center text-[10px] font-black text-[var(--lagoon-deep)] shrink-0">
                    {asset.id.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--sea-ink)] truncate group-hover:text-[var(--lagoon-deep)]">
                      {asset.label}
                    </p>
                    <p className="text-[9px] text-gray-400 truncate mt-0.5 uppercase tracking-wider">
                      {asset.category.replace(/-/g, ' ')}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
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

