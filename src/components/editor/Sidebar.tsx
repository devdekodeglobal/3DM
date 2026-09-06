import { useState, useMemo } from 'react'
import { Box, PlusSquare, ChevronDown, ChevronRight, LayoutGrid, Search, Upload, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { ASSET_DIMENSIONS, ASSET_CATEGORIES, ASSET_REGISTRY } from '../../lib/assetRegistry'
import ColorPickerPanel from './ColorPickerPanel'
import { ArchitecturalSymbolSVG } from './ArchitecturalSymbolSVG'

const DEFAULT_ASSET_SIZE_PX = 100

export default function Sidebar({
  addElement,
  backgroundColor,
  setBackgroundColor,
  customAssets = [],
  onUploadCustomAsset,
  onDeleteCustomAsset,
  showAlert
}: {
  addElement: (el: any) => void;
  activeView?: string;
  onViewChange?: (view: any) => void;
  backgroundColor?: string;
  setBackgroundColor?: (color: string) => void;
  customAssets?: any[];
  onUploadCustomAsset?: (file: File) => void;
  onDeleteCustomAsset?: (id: string) => void;
  showAlert?: (message: string, type?: 'info' | 'success' | 'warning' | 'error', title?: string) => void;
}) {
  const [isCoreOpen, setIsCoreOpen] = useState(false)
  const [isUploadsOpen, setIsUploadsOpen] = useState(true)
  const [isModelsOpen, setIsModelsOpen] = useState(true)
  const [isBgOpen, setIsBgOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(ASSET_CATEGORIES[0].id)
  const [searchQuery, setSearchQuery] = useState('')

  const addCustomAsset = (asset: any) => {
    addElement({
      id: uuidv4(),
      type: 'asset',
      assetName: asset.id,
      isCustomAsset: true,
      assetUrl: asset.assetUrl,
      label: asset.label,
      details: 'Custom 3D Upload',
      x: 150, y: 150,
      rotation: 0,
      facingOffset: 0,
      width: 100,
      height: 100,
      specH: asset.specH || 1.0,
      realWidth: 1.0,
      realHeight: 1.0,
      realDepth: 1.0,
      yOffset: 0,
      verticalScale: 1
    })
  }

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

  const addWallWithDoor = () => {
    addElement({
      id: uuidv4(),
      type: 'wall',
      x: 150, y: 150,
      width: 200, height: 20,
      thickness: 10, rotation: 0,
      realWidth: 2.0,
      realHeight: 2.5,
      realDepth: 0.1,
      fill: '#333333', opacity: 1,
      material: 'Solid Wall',
      wallElements: [
        {
          id: uuidv4().substr(0, 8),
          type: 'door',
          x: 55,
          y: 50,
          width: 90,
          height: 200,
          swingSide: 'right',
          swingDirection: 'inward',
          color: '#8b643c'
        }
      ]
    })
  }

  const addWallWithWindow = () => {
    addElement({
      id: uuidv4(),
      type: 'wall',
      x: 150, y: 150,
      width: 200, height: 20,
      thickness: 10, rotation: 0,
      realWidth: 2.0,
      realHeight: 2.5,
      realDepth: 0.1,
      fill: '#333333', opacity: 1,
      material: 'Solid Wall',
      wallElements: [
        {
          id: uuidv4().substr(0, 8),
          type: 'window',
          x: 40,
          y: 75,
          width: 120,
          height: 100,
          color: '#00BFFF'
        }
      ]
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

  const addPillar = () => {
    addElement({
      id: uuidv4(),
      type: 'pillar',
      x: 150, y: 150,
      width: 40, height: 40,
      rotation: 0,
      realWidth: 0.4,
      realHeight: 3.0,
      realDepth: 0.4,
      profile: 'square',
      fill: '#aaaaaa'
    })
  }

  const addCagedWall = () => {
    addElement({
      id: uuidv4(),
      type: 'caged-wall',
      x: 150, y: 150,
      width: 200, height: 20,
      rotation: 0,
      realWidth: 2.0,
      realHeight: 2.5,
      realDepth: 0.2,
      platesCount: 5,
      plateThickness: 0.05,
      plateGap: 0.2,
      orientation: 'horizontal',
      fill: '#444444'
    })
  }

  const addModularPanel = () => {
    addElement({
      id: uuidv4(),
      type: 'panel',
      x: 150, y: 150,
      width: 200, height: 10,
      rotation: 0,
      realWidth: 2.0,
      realHeight: 2.5,
      realDepth: 0.1,
      style: 'flat',
      fill: '#0055ff'
    })
  }

  const addCagedPanel = () => {
    addElement({
      id: uuidv4(),
      type: 'caged-panel',
      x: 150, y: 150,
      width: 200, height: 200,
      rotation: 0,
      yOffset: 2.5, // defaults to a roof
      realWidth: 2.0,
      realHeight: 0.2, // total thickness of the grid
      realDepth: 2.0,
      platesCount: 5,
      plateThickness: 0.05,
      plateGap: 0.3,
      orientation: 'horizontal',
      fill: '#444444'
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
      verticalScale: 1,
      facingOffset: asset ? (asset as any).facingOffset || 0 : 0
    })
  }

  /* const TECHNICAL_VIEWS = [
    { id: 'perspective', label: '3D Orbit', icon: <Box className="w-3 h-3" /> },
    { id: 'top', label: 'Top View', icon: <Download className="w-3 h-3" /> },
    { id: 'north', label: 'North Elev', icon: <Download className="w-3 h-3" /> },
    { id: 'south', label: 'South Elev', icon: <Download className="w-3 h-3" /> },
    { id: 'east', label: 'East Elev', icon: <Download className="w-3 h-3" /> },
    { id: 'west', label: 'West Elev', icon: <Download className="w-3 h-3" /> },
  ] */

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

      <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
        {/* Core Structures Accordion */}
        <div className="border-b border-[var(--line)] shrink-0">
          <button
            onClick={() => setIsCoreOpen(!isCoreOpen)}
            className="w-full p-4 flex items-center justify-between group hover:bg-[var(--surface-light)] transition-colors"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              Core Structures
            </p>
            {isCoreOpen ? <ChevronDown className="h-4 w-4 text-[var(--sea-ink-soft)]" /> : <ChevronRight className="h-4 w-4 text-[var(--sea-ink-soft)]" />}
          </button>
          {isCoreOpen && (
            <div className="px-4 pb-4 grid grid-cols-2 gap-2 animate-in fade-in duration-200">
              <button onClick={addWall} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group">
                <Box className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Wall</span>
              </button>
              <button onClick={addPillar} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group">
                <Box className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Pillar</span>
              </button>
              <button onClick={addCagedWall} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group">
                <LayoutGrid className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Caged Wall</span>
              </button>
              <button onClick={addModularPanel} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group">
                <LayoutGrid className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Panel</span>
              </button>
              <button onClick={addCagedPanel} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group">
                <LayoutGrid className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Caged Roof</span>
              </button>
              <button onClick={addWallWithDoor} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group">
                <span className="text-base leading-none">🚪</span>
                <span className="text-[10px] font-bold tracking-wide text-center">Door Wall</span>
              </button>
              <button onClick={addWallWithWindow} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group">
                <span className="text-base leading-none">🪟</span>
                <span className="text-[10px] font-bold tracking-wide text-center">Window Wall</span>
              </button>
              <button onClick={add3DLogo} className="col-span-2 flex items-center justify-center gap-2 p-2.5 mt-1 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group">
                <PlusSquare className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide">3D Logo</span>
              </button>
            </div>
          )}
        </div>

        {/* My Custom Uploads Accordion */}
        <div className="border-b border-[var(--line)] shrink-0">
          <button
            onClick={() => setIsUploadsOpen(!isUploadsOpen)}
            className="w-full p-4 flex items-center justify-between group hover:bg-[var(--surface-light)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-[var(--brand)]" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink)]">
                My Custom Uploads
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[var(--brand)] font-bold bg-[var(--sand)] px-1.5 py-0.5 rounded border border-[var(--line)]">
                {customAssets.length}/5
              </span>
              {isUploadsOpen ? <ChevronDown className="h-4 w-4 text-[var(--sea-ink-soft)]" /> : <ChevronRight className="h-4 w-4 text-[var(--sea-ink-soft)]" />}
            </div>
          </button>

          {isUploadsOpen && (
            <div className="px-4 pb-4 flex flex-col gap-3 animate-in fade-in duration-200">
              <label className="w-full py-2.5 px-3 bg-[var(--sand)] hover:bg-[var(--chip-bg)] border border-dashed border-[var(--brand)] rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[var(--sea-ink)] cursor-pointer transition shadow-sm">
                <Upload className="w-4 h-4 text-[var(--brand)]" />
                <span>Upload 3D Asset (.glb)</span>
                <input
                  type="file"
                  accept=".glb,.gltf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (customAssets.length >= 5) {
                        showAlert?.('You have reached the maximum limit of 5 custom 3D assets. Please delete an asset from "My Custom Uploads" to upload a new one.', 'warning', 'Upload Limit Reached');
                        e.target.value = '';
                        return;
                      }
                      onUploadCustomAsset?.(file);
                      e.target.value = '';
                    }
                  }}
                />
              </label>

              {customAssets.length === 0 ? (
                <div className="text-xs text-center text-gray-400 py-4 px-2 border border-dashed border-[var(--line)] rounded-xl bg-black/5">
                  <p className="font-bold text-[var(--sea-ink-soft)] text-[11px] mb-1">No custom models uploaded</p>
                  <p className="text-[9px] text-gray-400">Upload up to 5 custom .glb files to place inside your booth.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {customAssets.map(asset => (
                    <div
                      key={asset.id}
                      className="w-full p-2.5 rounded-xl border border-[var(--line)] bg-[var(--sand)] hover:bg-white hover:border-[var(--brand)] transition group flex items-center justify-between gap-2"
                    >
                      <button
                        onClick={() => addCustomAsset(asset)}
                        className="flex-1 flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] flex items-center justify-center text-[10px] font-black text-[var(--brand)] shrink-0">
                          3D
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[var(--sea-ink)] truncate group-hover:text-[var(--brand)]">
                            {asset.label}
                          </p>
                          <p className="text-[9px] text-gray-400 truncate mt-0.5 uppercase tracking-wider">
                            Custom Model
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => onDeleteCustomAsset?.(asset.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Custom Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3D Models Accordion */}
        <div className={`border-b border-[var(--line)] flex flex-col ${isModelsOpen ? 'flex-1 min-h-[200px]' : 'shrink-0'}`}>
          <button
            onClick={() => setIsModelsOpen(!isModelsOpen)}
            className="w-full p-4 flex items-center justify-between group hover:bg-[var(--surface-light)] transition-colors shrink-0"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              3D Models
            </p>
            {isModelsOpen ? <ChevronDown className="h-4 w-4 text-[var(--sea-ink-soft)]" /> : <ChevronRight className="h-4 w-4 text-[var(--sea-ink-soft)]" />}
          </button>

          {isModelsOpen && (
            <div className="px-4 pb-4 flex flex-col gap-3 flex-1 overflow-hidden animate-in fade-in duration-200">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-[var(--surface-strong)] border border-[var(--line)] rounded-lg text-xs font-bold text-[var(--sea-ink)] outline-none focus:border-[var(--lagoon)] shrink-0"
              >
                <option value="all">All Categories</option>
                <option value="custom-uploads">⭐ My Uploads ({customAssets.length}/5)</option>
                {ASSET_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>

              <div className="relative shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-[var(--surface-strong)] border border-[var(--line)] rounded-lg text-xs text-[var(--sea-ink)] outline-none focus:border-[var(--lagoon)] shadow-sm placeholder:text-[var(--sea-ink-soft)]"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-0">
                {selectedCategory === 'custom-uploads' ? (
                  customAssets.length === 0 ? (
                    <div className="text-xs text-center text-gray-400 py-6 px-2 border border-dashed border-[var(--line)] rounded-xl">
                      <p className="font-bold text-[var(--sea-ink-soft)] mb-1">No custom models yet</p>
                      <p className="text-[10px] text-gray-400">Click "Upload 3D Asset" above to add up to 5 custom .glb files.</p>
                    </div>
                  ) : (
                    customAssets.map(asset => (
                      <div
                        key={asset.id}
                        className="w-full text-left p-2.5 rounded-xl border border-[var(--line)] bg-[var(--sand)] hover:bg-white hover:border-[var(--lagoon)] transition group flex items-center justify-between gap-2"
                      >
                        <button
                          onClick={() => addCustomAsset(asset)}
                          className="flex-1 flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] flex items-center justify-center text-[10px] font-black text-[var(--brand)] shrink-0">
                            3D
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[var(--sea-ink)] truncate group-hover:text-[var(--lagoon-deep)]">
                              {asset.label}
                            </p>
                            <p className="text-[9px] text-gray-400 truncate mt-0.5 uppercase tracking-wider">
                              Custom Model
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() => onDeleteCustomAsset?.(asset.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Custom Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )
                ) : filteredAssets.length === 0 ? (
                  <div className="text-xs text-center text-gray-400 py-4">No assets found</div>
                ) : (
                  filteredAssets.map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => addAsset((asset as any).categoryFolder || asset.category, asset.id)}
                      className="w-full text-left p-2.5 rounded-xl border border-[var(--line)] bg-[var(--sand)] hover:bg-white hover:border-[var(--lagoon)] transition group flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] flex items-center justify-center shrink-0 p-1 text-[var(--sea-ink)] group-hover:border-[var(--lagoon)] transition-colors">
                        <ArchitecturalSymbolSVG
                          category={asset.category}
                          assetName={asset.id}
                          className="w-6 h-6"
                        />
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
          )}
        </div>

        {/* Background Color Accordion */}
        <div className="shrink-0">
          <button
            onClick={() => setIsBgOpen(!isBgOpen)}
            className="w-full p-4 flex items-center justify-between group hover:bg-[var(--surface-light)] transition-colors"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              Background Color
            </p>
            {isBgOpen ? <ChevronDown className="h-4 w-4 text-[var(--sea-ink-soft)]" /> : <ChevronRight className="h-4 w-4 text-[var(--sea-ink-soft)]" />}
          </button>

          {isBgOpen && (
            <div className="px-4 pb-4 animate-in fade-in duration-200">
              {setBackgroundColor && backgroundColor && (
                <ColorPickerPanel initialColor={backgroundColor} onChange={setBackgroundColor} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Technical Drawings - temporarily commented out
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
                className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-[10px] font-bold transition-all ${activeView === view.id
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
      */}
    </aside>
  )
}

