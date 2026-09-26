import { useState, useMemo, useEffect } from 'react'
import { Box, PlusSquare, ChevronDown, ChevronRight, ChevronLeft, LayoutGrid, Search, Trash2, Palette, Plus, Folder, FileText, DoorClosed, AppWindow, Copy, X, Circle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { ASSET_DIMENSIONS, ASSET_CATEGORIES, ASSET_REGISTRY } from '../../lib/assetRegistry'
import ColorPickerPanel from './ColorPickerPanel'
import { ArchitecturalSymbolSVG } from './ArchitecturalSymbolSVG'
import AssetModelThumbnail from './AssetModelThumbnail'

const DEFAULT_ASSET_SIZE_PX = 100
const GALLERY_PAGE_SIZE = 12

export default function Sidebar({
  addElement,
  backgroundColor,
  setBackgroundColor,
  boothConfig,
  setBoothConfig,
  customAssets = [],
  // onUploadCustomAsset,
  onDeleteCustomAsset,
  // showAlert
  onClose,
  onNewProject,
  onCopyToProject,
  onOpenProjects,
  onGenerateReport,
  isCapturingReport = false,
}: {
  addElement: (el: any) => void;
  activeView?: string;
  onViewChange?: (view: any) => void;
  backgroundColor?: string;
  setBackgroundColor?: (color: string) => void;
  boothConfig?: any;
  setBoothConfig?: (config: any) => void;
  customAssets?: any[];
  onUploadCustomAsset?: (file: File) => void;
  onDeleteCustomAsset?: (id: string) => void;
  showAlert?: (message: string, type?: 'info' | 'success' | 'warning' | 'error', title?: string) => void;
  onClose?: () => void;
  onNewProject?: () => void;
  onCopyToProject?: () => void;
  onOpenProjects?: () => void;
  onGenerateReport?: () => void;
  isCapturingReport?: boolean;
}) {
  const [isSpaceOpen, setIsSpaceOpen] = useState(false)
  const [isCoreOpen, setIsCoreOpen] = useState(false)
  // const [isUploadsOpen, setIsUploadsOpen] = useState(true)
  const [isModelsOpen, setIsModelsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(ASSET_CATEGORIES[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAssetGalleryOpen, setIsAssetGalleryOpen] = useState(false)
  const [galleryPage, setGalleryPage] = useState(0)

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

  const addCarpet = (shape: 'rect' | 'circle' | 'polygon' = 'rect', fill: string = '#f59e0b') => {
    addElement({
      id: uuidv4(),
      type: 'carpet',
      shape, // 'rect' | 'circle' | 'polygon'
      x: 150, y: 150,
      width: 200, height: 150,
      rotation: 0,
      fill,
      textureType: 'solid', // 'solid' | 'carpet' | 'marble' | 'hardwood' | 'custom'
      roughness: 0.8,
      metallic: 0.05,
      opacity: 1.0,
      url: null,
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

  const galleryPageCount = Math.max(1, Math.ceil(filteredAssets.length / GALLERY_PAGE_SIZE))
  const visibleGalleryAssets = useMemo(
    () => filteredAssets.slice(galleryPage * GALLERY_PAGE_SIZE, (galleryPage + 1) * GALLERY_PAGE_SIZE),
    [filteredAssets, galleryPage],
  )

  useEffect(() => {
    setGalleryPage(0)
  }, [selectedCategory, searchQuery])

  const selectAssetFromGallery = (asset: (typeof ASSET_REGISTRY)[number]) => {
    addAsset((asset as any).categoryFolder || asset.category, asset.id)
    setIsAssetGalleryOpen(false)
  }

  return (
    <aside className="w-full md:w-56 h-full border-r border-[var(--line)] bg-[var(--surface-strong)] flex flex-col overflow-visible relative z-20">
      {/* Sidebar Header with Close (Mobile) */}
      {onClose && (
        <div className="p-2 border-b border-[var(--line)] flex justify-end items-center md:hidden shrink-0">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--fg-dim)] hover:text-[var(--fg)] hover:bg-[var(--chip-bg)] transition text-xs font-bold px-2.5 py-1 bg-[var(--sand)]"
            title="Close Sidebar"
          >
            Done
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
        {/* Project Actions as clean list options */}
        {(onNewProject || onCopyToProject || onOpenProjects || onGenerateReport) && (
          <div className="p-2 border-b border-[var(--line)] flex flex-col gap-0.5 shrink-0 bg-[var(--surface-light)]/20">
            {onNewProject && (
              <button
                onClick={onNewProject}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-[var(--sea-ink)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-md bg-[var(--surface-light)] border border-[var(--line)] flex items-center justify-center shrink-0 group-hover:border-[var(--brand)] transition-colors">
                  <Plus className="w-3.5 h-3.5 text-[var(--sea-ink-soft)] group-hover:text-[var(--brand)] transition-colors" />
                </div>
                <span>New</span>
              </button>
            )}
            {onCopyToProject && (
              <button
                onClick={onCopyToProject}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-[var(--sea-ink)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition cursor-pointer group"
                title="Make a copy into another project or standalone"
              >
                <div className="w-6 h-6 rounded-md bg-[var(--surface-light)] border border-[var(--line)] flex items-center justify-center shrink-0 group-hover:border-[var(--brand)] transition-colors">
                  <Copy className="w-3.5 h-3.5 text-[var(--sea-ink-soft)] group-hover:text-[var(--brand)] transition-colors" />
                </div>
                <span>Copy to...</span>
              </button>
            )}
            {onOpenProjects && (
              <button
                onClick={onOpenProjects}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-[var(--sea-ink)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-md bg-[var(--surface-light)] border border-[var(--line)] flex items-center justify-center shrink-0 group-hover:border-[var(--brand)] transition-colors">
                  <Folder className="w-3.5 h-3.5 text-[var(--sea-ink-soft)] group-hover:text-[var(--brand)] transition-colors" />
                </div>
                <span>Projects</span>
              </button>
            )}
            {onGenerateReport && (
              <button
                onClick={onGenerateReport}
                disabled={isCapturingReport}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-[var(--sea-ink)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition cursor-pointer group disabled:opacity-50"
              >
                <div className="w-6 h-6 rounded-md bg-[var(--surface-light)] border border-[var(--line)] flex items-center justify-center shrink-0 group-hover:border-[var(--brand)] transition-colors">
                  <FileText className="w-3.5 h-3.5 text-[var(--sea-ink-soft)] group-hover:text-[var(--brand)] transition-colors" />
                </div>
                <span>{isCapturingReport ? 'Generating...' : 'Generate Report'}</span>
              </button>
            )}
          </div>
        )}

        {/* Space & Environment Collapsible Section */}
        <div className="border-b border-[var(--line)] shrink-0">
          <button
            onClick={() => setIsSpaceOpen(!isSpaceOpen)}
            className="w-full p-4 flex items-center justify-between group hover:bg-[var(--surface-light)] transition-colors"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--sea-ink)]">
              Space & Environment
            </p>
            {isSpaceOpen ? <ChevronDown className="h-4 w-4 text-[var(--sea-ink-soft)]" /> : <ChevronRight className="h-4 w-4 text-[var(--sea-ink-soft)]" />}
          </button>

          {isSpaceOpen && (
            <div className="px-4 pb-4 flex flex-col gap-4 animate-in fade-in duration-150">
              {boothConfig ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[var(--sea-ink)] font-semibold">Width</label>
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[var(--sand)] text-[var(--brand)] border border-[var(--line)]">
                        {boothConfig.width}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={20}
                      step={0.5}
                      value={boothConfig.width}
                      onChange={e => setBoothConfig?.({ ...boothConfig, width: parseFloat(e.target.value) })}
                      className="w-full accent-[var(--brand)] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[var(--fg-dim)] font-mono">
                      <span>2m</span>
                      <span>10m</span>
                      <span>20m</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[var(--sea-ink)] font-semibold">Depth</label>
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[var(--sand)] text-[var(--brand)] border border-[var(--line)]">
                        {boothConfig.depth}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={20}
                      step={0.5}
                      value={boothConfig.depth}
                      onChange={e => setBoothConfig?.({ ...boothConfig, depth: parseFloat(e.target.value) })}
                      className="w-full accent-[var(--brand)] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[var(--fg-dim)] font-mono">
                      <span>2m</span>
                      <span>10m</span>
                      <span>20m</span>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--line)]">
                    <span className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider">Quick Presets</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: '3x3m', w: 3, d: 3 },
                        { label: '4x3m', w: 4, d: 3 },
                        { label: '6x4m', w: 6, d: 4 },
                        { label: '6x5m', w: 6, d: 5 },
                        { label: '8x6m', w: 8, d: 6 },
                        { label: '10x8m', w: 10, d: 8 },
                      ].map(preset => (
                        <button
                          key={preset.label}
                          onClick={() => setBoothConfig?.({ ...boothConfig, width: preset.w, depth: preset.d })}
                          className={`py-1 px-1.5 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                            boothConfig.width === preset.w && boothConfig.depth === preset.d
                              ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                              : 'bg-[var(--sand)] text-[var(--sea-ink-soft)] border-[var(--line)] hover:border-[var(--brand)]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-[var(--fg-dim)]">No space configuration available.</p>
              )}

              {/* Background Color within Space & Environment */}
              <div className="pt-2 border-t border-[var(--line)] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-[var(--brand)]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                    Background Color
                  </span>
                </div>
                {setBackgroundColor && backgroundColor && (
                  <ColorPickerPanel initialColor={backgroundColor} onChange={setBackgroundColor} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Core Structures Collapsible Section */}
        <div className="border-b border-[var(--line)] shrink-0">
          <button
            onClick={() => setIsCoreOpen(!isCoreOpen)}
            className="w-full p-4 flex items-center justify-between group hover:bg-[var(--surface-light)] transition-colors"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--sea-ink)]">
              Core Structures
            </p>
            {isCoreOpen ? <ChevronDown className="h-4 w-4 text-[var(--sea-ink-soft)]" /> : <ChevronRight className="h-4 w-4 text-[var(--sea-ink-soft)]" />}
          </button>
          {isCoreOpen && (
            <div className="px-4 pb-4 grid grid-cols-2 gap-2 animate-in fade-in duration-200">
              <button onClick={addWall} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <Box className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Wall</span>
              </button>
              <button onClick={addPillar} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <Box className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Pillar</span>
              </button>
              <button onClick={addCagedWall} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <LayoutGrid className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Caged Wall</span>
              </button>
              <button onClick={addModularPanel} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <LayoutGrid className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Panel</span>
              </button>
              <button onClick={addCagedPanel} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <LayoutGrid className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Caged Roof</span>
              </button>
              <button onClick={addWallWithDoor} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <DoorClosed className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Door Wall</span>
              </button>
              <button onClick={addWallWithWindow} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <AppWindow className="h-4 w-4 mb-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Window Wall</span>
              </button>
              <button onClick={() => addCarpet('rect', '#f59e0b')} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <LayoutGrid className="h-4 w-4 mb-0.5 text-amber-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Floor Rug / Inset</span>
              </button>
              <button onClick={() => addCarpet('circle', '#0ea5e9')} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <Circle className="h-4 w-4 mb-0.5 text-sky-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide text-center">Circle Rug</span>
              </button>
              <button onClick={add3DLogo} className="col-span-2 flex items-center justify-center gap-2 p-2.5 mt-1 bg-[var(--surface-light)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg hover:border-[var(--brand)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition group cursor-pointer">
                <PlusSquare className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-wide">3D Logo</span>
              </button>
            </div>
          )}
        </div>

        {/* 3D Models Collapsible Section */}
        <div className={`border-b border-[var(--line)] flex flex-col ${isModelsOpen ? 'flex-1 min-h-[200px]' : 'shrink-0'}`}>
          <button
            onClick={() => setIsModelsOpen(!isModelsOpen)}
            className="w-full p-4 flex items-center justify-between group hover:bg-[var(--surface-light)] transition-colors shrink-0"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--sea-ink)]">
              3D Assets
            </p>
            {isModelsOpen ? <ChevronDown className="h-4 w-4 text-[var(--sea-ink-soft)]" /> : <ChevronRight className="h-4 w-4 text-[var(--sea-ink-soft)]" />}
          </button>

          {isModelsOpen && (
            <div className="px-4 pb-4 flex flex-col gap-3 flex-1 overflow-hidden animate-in fade-in duration-200">
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAssetGalleryOpen(prev => !prev)}
                  aria-pressed={isAssetGalleryOpen}
                  title={isAssetGalleryOpen ? 'Close visual asset gallery' : 'Show visual asset gallery'}
                  className={`w-9 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                    isAssetGalleryOpen
                      ? 'bg-[var(--lagoon)] border-[var(--lagoon)] text-white shadow-sm'
                      : 'bg-[var(--surface-strong)] border-[var(--line)] text-[var(--sea-ink-soft)] hover:border-[var(--lagoon)] hover:text-[var(--lagoon-deep)]'
                  }`}
                >
                  {isAssetGalleryOpen ? <X className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                  <span className="sr-only">{isAssetGalleryOpen ? 'Close visual asset gallery' : 'Show visual asset gallery'}</span>
                </button>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="flex-1 min-w-0 p-2 bg-[var(--surface-strong)] border border-[var(--line)] rounded-lg text-xs font-bold text-[var(--sea-ink)] outline-none focus:border-[var(--lagoon)]"
                >
                  <option value="all">All Categories</option>
                  {customAssets && customAssets.length > 0 && (
                    <option value="custom-uploads">My Uploads ({customAssets.length}/5)</option>
                  )}
                  {ASSET_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

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
                    <div className="text-xs text-center text-gray-400 py-4">No custom models uploaded</div>
                  ) : (
                    customAssets.map(asset => (
                      <div
                        key={asset.id}
                        className="w-full text-left p-2.5 rounded-xl border border-[var(--line)] bg-[var(--sand)] hover:bg-[var(--surface-strong)] hover:border-[var(--brand)] transition group flex items-center justify-between gap-2"
                      >
                        <button
                          onClick={() => addCustomAsset(asset)}
                          className="flex-1 flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] flex items-center justify-center text-[10px] font-black text-[var(--brand)] shrink-0">
                            3D
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[var(--sea-ink)] truncate group-hover:text-[var(--brand)] transition-colors">
                              {asset.label}
                            </p>
                            <p className="text-[9px] text-[var(--sea-ink-soft)] truncate mt-0.5 uppercase tracking-wider">
                              Custom Model
                            </p>
                          </div>
                        </button>
                        {onDeleteCustomAsset && (
                          <button
                            onClick={() => onDeleteCustomAsset(asset.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                            title="Delete Custom Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
                      className="w-full text-left p-2.5 rounded-xl border border-[var(--line)] bg-[var(--sand)] hover:bg-[var(--surface-strong)] hover:border-[var(--brand)] transition group flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] flex items-center justify-center shrink-0 p-1 text-[var(--sea-ink)] group-hover:border-[var(--brand)] transition-colors">
                        <ArchitecturalSymbolSVG
                          category={asset.category}
                          assetName={asset.id}
                          className="w-6 h-6"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--sea-ink)] truncate group-hover:text-[var(--brand)] transition-colors">
                          {asset.label}
                        </p>
                        <p className="text-[9px] text-[var(--sea-ink-soft)] truncate mt-0.5 uppercase tracking-wider">
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
      </div>

      {isAssetGalleryOpen && selectedCategory !== 'custom-uploads' && (
        <section
          aria-label="Visual asset picker"
          className="hidden md:flex absolute left-full top-3 ml-3 w-[min(620px,calc(100vw-19rem))] max-h-[calc(100%-24px)] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface-light)] px-5 py-4 shrink-0">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--sea-ink)]">Choose an asset</p>
              <p className="text-[11px] text-[var(--sea-ink-soft)] mt-0.5 truncate">
                {selectedCategory === 'all' ? 'All categories' : ASSET_CATEGORIES.find(category => category.id === selectedCategory)?.label}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAssetGalleryOpen(false)}
              className="p-2 rounded-lg text-[var(--sea-ink-soft)] hover:bg-[var(--sand)] hover:text-[var(--sea-ink)] transition cursor-pointer"
              title="Close visual asset picker"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close visual asset picker</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 overflow-y-auto p-5 custom-scrollbar content-start">
            {visibleGalleryAssets.map(asset => (
              <button
                key={asset.id}
                onClick={() => selectAssetFromGallery(asset)}
                title={`Add ${asset.label}`}
                className="group h-[190px] rounded-xl border border-[var(--line)] bg-[var(--sand)] hover:bg-[var(--surface-strong)] hover:border-[var(--brand)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] transition cursor-pointer overflow-hidden text-left flex flex-col"
              >
                <div className="h-[135px] shrink-0 p-3 bg-[var(--surface-strong)] border-b border-[var(--line)] flex items-center justify-center transition-colors group-hover:bg-[var(--bg-subtle)]">
                  <AssetModelThumbnail
                    assetName={asset.id}
                    categoryFolder={(asset as any).categoryFolder || asset.category}
                    label={asset.label}
                    className="w-full h-full"
                  />
                </div>
                <div className="px-3 py-2.5 flex-1 min-h-0 flex flex-col justify-center">
                  <p className="text-xs leading-4 font-bold text-[var(--sea-ink)] group-hover:text-[var(--brand)] break-words transition-colors">
                    {asset.label}
                  </p>
                  <p className="text-[10px] text-[var(--sea-ink-soft)] mt-1 group-hover:text-[var(--sea-ink)] transition-colors">Click to add</p>
                </div>
              </button>
            ))}
          </div>
          {filteredAssets.length > GALLERY_PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-[var(--line)] px-5 py-3 bg-[var(--surface-light)] shrink-0">
              <p className="text-[11px] text-[var(--sea-ink-soft)]">
                {galleryPage * GALLERY_PAGE_SIZE + 1}–{Math.min((galleryPage + 1) * GALLERY_PAGE_SIZE, filteredAssets.length)} of {filteredAssets.length} assets
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGalleryPage(page => Math.max(0, page - 1))}
                  disabled={galleryPage === 0}
                  className="p-1.5 rounded-lg border border-[var(--line)] text-[var(--sea-ink)] hover:border-[var(--lagoon)] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Previous assets"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-semibold text-[var(--sea-ink)]">{galleryPage + 1} / {galleryPageCount}</span>
                <button
                  type="button"
                  onClick={() => setGalleryPage(page => Math.min(galleryPageCount - 1, page + 1))}
                  disabled={galleryPage >= galleryPageCount - 1}
                  className="p-1.5 rounded-lg border border-[var(--line)] text-[var(--sea-ink)] hover:border-[var(--lagoon)] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Next assets"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

    </aside>
  )
}

