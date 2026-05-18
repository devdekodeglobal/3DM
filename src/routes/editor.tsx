import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/editor/Sidebar'
import Canvas from '../components/editor/Canvas'
import WallCanvas from '../components/editor/WallCanvas'
import Properties from '../components/editor/Properties'
import Preview3D from '../components/editor/Preview3D'
import { PanelLeftClose, PanelRightClose, Check, RotateCcw, RotateCw, Trash2, Box, ArrowRight, Settings, FileText, Download, Upload } from 'lucide-react'
import { ASSET_DIMENSIONS, ASSET_REGISTRY } from '../lib/assetRegistry'
import { getWallMaterialProps } from '../lib/materials'
import { generateReport } from '../lib/reportGenerator'

const DEFAULT_ASSET_SIZE_PX = 100

export const Route = createFileRoute('/editor')({
  component: EditorPage,
})

interface BoothConfig {
  width: number;
  depth: number;
  wallThickness: number;
  walls: { north: boolean; south: boolean; east: boolean; west: boolean };
  floorType?: string;
}

function EditorPage() {
  const [boothConfig, setBoothConfig] = useState<BoothConfig | null>(null)

  // Setup Wizard State
  const [wizardStep, setWizardStep] = useState(1)
  const [setupWidth, setSetupWidth] = useState<number>(3)
  const [setupDepth, setSetupDepth] = useState<number>(3)
  const [setupWallThickness, setSetupWallThickness] = useState<number>(0.1)
  const [setupWalls, setSetupWalls] = useState({ north: true, south: false, east: true, west: true })

  // New Wizard States
  const [setupFloorType, setSetupFloorType] = useState('hardwood')
  const [setupWallMaterial, setSetupWallMaterial] = useState('White Paint')
  const [setupAssets, setSetupAssets] = useState<Record<string, number>>({
    'chair_1': 0,
    'round_table_1': 0,
    'plant': 0,
    'dustbin': 0,
    'tv_lcd': 0
  })

  const [elements, setElements] = useState<any[]>([])
  const [history, setHistory] = useState<any[][]>([])
  const [historyStep, setHistoryStep] = useState(-1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [gridVisible, setGridVisible] = useState(true)

  // Layout States
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [previewerOpen, setPreviewerOpen] = useState(true)
  const [propertiesOpen, setPropertiesOpen] = useState(true)
  const [splitWidth, setSplitWidth] = useState(60)
  const [is3DGenerated, setIs3DGenerated] = useState(false)
  const [editingWallId, setEditingWallId] = useState<string | null>(null)
  const [blueprintView, setBlueprintView] = useState<'perspective' | 'top' | 'north' | 'south' | 'east' | 'west'>('perspective')

  // Report Generation State
  const [isCapturingReport, setIsCapturingReport] = useState(false)
  const [captureQueue, setCaptureQueue] = useState<string[]>([])
  const [reportScreenshots, setReportScreenshots] = useState<Record<string, string>>({})


  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  // Auto-load from local storage
  useEffect(() => {
    const savedStall = localStorage.getItem('stall-config')
    const savedElements = localStorage.getItem('stall-elements')

    if (savedStall) {
      const config = JSON.parse(savedStall)
      setBoothConfig(config)

      // MIGRATION: If old save has structural walls in config but not in elements, convert them
      if (savedElements) {
        let parsed = JSON.parse(savedElements)
        const hasOuterWalls = parsed.some((el: any) => el.isOuter)

        if (!hasOuterWalls && config.walls) {
          const PPM = 100
          const W = config.width * PPM
          const D = config.depth * PPM
          const T = (config.wallThickness || 0.1) * 100

          const migrationWalls: any[] = []
          if (config.walls.north) migrationWalls.push({ id: 'outer-north', type: 'wall', isOuter: true, x: W / 2, y: 0, width: W, thickness: T, rotation: 0, fill: '#333333', opacity: 1, wallElements: [] })
          if (config.walls.south) migrationWalls.push({ id: 'outer-south', type: 'wall', isOuter: true, x: W / 2, y: D, width: W, thickness: T, rotation: 180, fill: '#333333', opacity: 1, wallElements: [] })
          if (config.walls.west) migrationWalls.push({ id: 'outer-west', type: 'wall', isOuter: true, x: 0, y: D / 2, width: D, thickness: T, rotation: 90, fill: '#333333', opacity: 1, wallElements: [] })
          if (config.walls.east) migrationWalls.push({ id: 'outer-east', type: 'wall', isOuter: true, x: W, y: D / 2, width: D, thickness: T, rotation: -90, fill: '#333333', opacity: 1, wallElements: [] })

          parsed = [...migrationWalls, ...parsed]
        }

        setElements(parsed)
        setHistory([parsed])
        setHistoryStep(0)
      }
    }
  }, [])

  // Auto-save to local storage
  useEffect(() => {
    if (boothConfig) {
      localStorage.setItem('stall-config', JSON.stringify(boothConfig))
      localStorage.setItem('stall-elements', JSON.stringify(elements))
    }
  }, [boothConfig, elements])

  const saveToHistory = useCallback((newElements: any[]) => {
    setHistory(prev => {
      const nextHistory = prev.slice(0, historyStep + 1)
      return [...nextHistory, newElements]
    })
    setHistoryStep(prev => prev + 1)
  }, [historyStep])

  const undo = () => {
    if (historyStep > 0) {
      const prev = history[historyStep - 1]
      setElements(prev)
      setHistoryStep(historyStep - 1)
      setSelectedId(null)
    }
  }

  const redo = () => {
    if (historyStep < history.length - 1) {
      const next = history[historyStep + 1]
      setElements(next)
      setHistoryStep(historyStep + 1)
      setSelectedId(null)
    }
  }

  const handleUpdateElement = useCallback((id: string, newProps: any) => {
    setElements(prev => {
      const updated = prev.map((el) => (el.id === id ? { ...el, ...newProps } : el))
      saveToHistory(updated)
      return updated
    })
  }, [saveToHistory])

  const handleDeleteElement = useCallback((id: string) => {
    setElements(prev => {
      const filtered = prev.filter((el) => el.id !== id)
      saveToHistory(filtered)
      return filtered
    })
    if (selectedId === id) setSelectedId(null)
  }, [selectedId, saveToHistory])

  const addElement = useCallback((newEl: any) => {
    setElements(prev => {
      const updated = [...prev, newEl]
      saveToHistory(updated)
      return updated
    })
  }, [saveToHistory])

  // Handle Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo / Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) redo()
        else undo()
      }

      // Deletion
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedId && !editingWallId) {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return
        handleDeleteElement(selectedId)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, historyStep, history, editingWallId])

  const submitExport = () => {
    setIsCapturingReport(true)
    setReportScreenshots({})
    
    // Queue: Top view + standard directional elevations + specific wall elevations
    const queue = ['top', 'north', 'south', 'east', 'west'];
    
    // Find walls with customizations and append their specific elevations
    const customWalls = elements.filter(el => el.type === 'wall' && el.wallElements && el.wallElements.length > 0);
    customWalls.forEach(w => queue.push(`elevation_${w.id}`));
    
    setCaptureQueue(queue)
  }

  useEffect(() => {
    if (!isCapturingReport) return;
    
    if (captureQueue.length > 0) {
      const nextView = captureQueue[0];
      console.log(`[Report] Switching to view: ${nextView}`);
      setBlueprintView(nextView + '_capture' as any);
    } else {
      console.log('[Report] All captures complete. Generating document...');
      setIsCapturingReport(false);
      setBlueprintView('perspective');
      
      // Small timeout to ensure state has settled
      setTimeout(() => {
        generateReport(boothConfig, elements, reportScreenshots).then(() => {
          console.log('[Report] Document generated and downloaded.');
        }).catch(err => {
          console.error('[Report] Generation failed:', err);
          alert('Failed to generate report.');
        });
      }, 600);
    }
  }, [captureQueue.length, isCapturingReport]);

  const onExportComplete = useCallback((baseView: string, data?: string) => {
    if (isCapturingReport && data) {
      setReportScreenshots(prev => ({ ...prev, [baseView]: data }))
      setCaptureQueue(prev => prev.slice(1))
    } else {
      setBlueprintView(baseView as any)
    }
  }, [isCapturingReport])

  const downloadProjectJSON = () => {
    if (!boothConfig) return;
    // We preserve the svgData here for 3D Logos, unlike the report generator
    const dataToSave = {
      booth: boothConfig,
      elements: elements
    };
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booth_design_${Date.now().toString(36)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (parsed.booth && parsed.elements) {
          setBoothConfig(parsed.booth);
          setElements(parsed.elements);
          setHistory([parsed.elements]);
          setHistoryStep(0);
          
          // Force layout refresh if needed
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 100);
        } else {
          alert("Invalid project file format.");
        }
      } catch (err) {
        console.error("Failed to parse project file:", err);
        alert("Failed to read the project file.");
      }
    };
    reader.readAsText(file);
    
    // Reset file input so the same file can be selected again if needed
    event.target.value = '';
  };

  const clearAll = () => {
    if (confirm('Clear the workspace?')) {
      setElements([])
      saveToHistory([])
      localStorage.removeItem('stall-elements')
    }
  }

  const selectedElement = elements.find((el) => el.id === selectedId)
  const editingWall = editingWallId ? elements.find((el) => el.id === editingWallId) : null

  if (!boothConfig) {
    return (
      <div key="setup-screen" suppressHydrationWarning className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[var(--bg-base)] p-4">
        <div className="island-shell p-8 rounded-2xl w-full max-w-[500px] flex flex-col gap-6 text-center rise-in">
          <h2 className="text-3xl font-bold text-[var(--sea-ink)] display-title">Booth Setup Wizard</h2>

          <div className="flex gap-2 mb-2">
            <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 1 ? 'bg-[var(--lagoon)]' : 'bg-[var(--line)]'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 2 ? 'bg-[var(--lagoon)]' : 'bg-[var(--line)]'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 3 ? 'bg-[var(--lagoon)]' : 'bg-[var(--line)]'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 4 ? 'bg-[var(--lagoon)]' : 'bg-[var(--line)]'}`} />
          </div>

          {wizardStep === 1 && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
              <p className="text-sm text-[var(--sea-ink-soft)] font-semibold">Step 1: Determine real-world footprint</p>

              <div className="space-y-4">
                <div className="text-left bg-[var(--sand)] p-4 rounded-xl border border-[var(--line)]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-[var(--sea-ink)]">Width (meters)</label>
                    <span className="text-[var(--lagoon-deep)] font-mono font-bold">{setupWidth.toFixed(1)}m</span>
                  </div>
                  <input type="range" min="2" max="20" step="0.5" value={setupWidth} onChange={(e) => setSetupWidth(parseFloat(e.target.value))} className="w-full accent-[var(--lagoon-deep)]" />
                </div>

                <div className="text-left bg-[var(--sand)] p-4 rounded-xl border border-[var(--line)]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-[var(--sea-ink)]">Depth (meters)</label>
                    <span className="text-[var(--lagoon-deep)] font-mono font-bold">{setupDepth.toFixed(1)}m</span>
                  </div>
                  <input type="range" min="2" max="20" step="0.5" value={setupDepth} onChange={(e) => setSetupDepth(parseFloat(e.target.value))} className="w-full accent-[var(--lagoon-deep)]" />
                </div>
              </div>

              <button
                onClick={() => setWizardStep(2)}
                className="rounded-full bg-[var(--brand)] text-white font-bold py-3 hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2 mt-2 shadow-lg"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
              <p className="text-sm text-[var(--sea-ink-soft)] font-semibold">Step 2: Configure structural walls</p>

              <div className="grid grid-cols-2 gap-4 text-left">
                {['north', 'south', 'east', 'west'].map((wallDir) => {
                  const isClosed = (setupWalls as any)[wallDir]
                  return (
                    <button
                      key={wallDir}
                      onClick={() => setSetupWalls((prev: any) => ({ ...prev, [wallDir]: !isClosed }))}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-start gap-2 ${isClosed
                          ? 'bg-[var(--surface-strong)] border-[var(--sea-ink)] shadow-md'
                          : 'bg-[var(--sand)] border-transparent text-[var(--sea-ink-soft)]'
                        }`}
                    >
                      <span className="text-xs uppercase tracking-wider font-bold capitalize block">{wallDir} Wall</span>
                      <span className={`text-sm font-semibold flex items-center gap-2 ${isClosed ? 'text-[var(--sea-ink)]' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full ${isClosed ? 'bg-red-500' : 'bg-transparent border border-gray-400'}`} />
                        {isClosed ? 'Solid / Closed' : 'Open / Hidden'}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="text-left bg-[var(--sand)] p-4 rounded-xl border border-[var(--line)]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-[var(--sea-ink)]">Wall Thickness (m)</label>
                  <span className="text-[var(--lagoon-deep)] font-mono font-bold">{setupWallThickness.toFixed(2)}m</span>
                </div>
                <input type="range" min="0.05" max="0.5" step="0.01" value={setupWallThickness} onChange={(e) => setSetupWallThickness(parseFloat(e.target.value))} className="w-full accent-[var(--lagoon-deep)]" />
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setWizardStep(1)} className="rounded-full bg-[var(--sand)] text-[var(--sea-ink)] font-bold py-3 px-6 hover:bg-gray-200 transition">Back</button>
                <button
                  onClick={() => setWizardStep(3)}
                  className="rounded-full bg-[var(--brand)] flex-1 text-white font-bold py-3 hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2"
                >
                  Next Step <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
              <p className="text-sm text-[var(--sea-ink-soft)] font-semibold">Step 3: Materials & Ambience</p>

              <div className="text-left space-y-4">
                <div>
                  <label className="text-sm font-bold text-[var(--sea-ink)] mb-2 block">Floor Surface</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'hardwood', name: 'Hardwood', img: '/assets/textures/hardwood.png' },
                      { id: 'carpet', name: 'Carpet', img: null, color: '#2e3f50' },
                      { id: 'marble', name: 'Marble', img: '/assets/textures/marble.png' },
                      { id: 'concrete', name: 'Concrete', img: '/assets/textures/concrete.png' }
                    ].map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => setSetupFloorType(mat.id)}
                        className={`p-3 rounded-xl border-2 text-left font-bold text-sm transition-all flex items-center gap-3 ${setupFloorType === mat.id ? 'border-[var(--lagoon)] bg-[var(--chip-bg)] text-[var(--sea-ink)] shadow-sm' : 'border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink-soft)] hover:border-[var(--lagoon)]'}`}
                      >
                        <div className="w-8 h-8 rounded bg-cover bg-center border border-black/10 shrink-0" style={{ backgroundImage: mat.img ? `url('${mat.img}')` : 'none', backgroundColor: mat.color || '#eee' }} />
                        {mat.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-bold text-[var(--sea-ink)] mb-2 block">Default Wall Material</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'White Paint', name: 'White Paint', color: '#f0f0f0' },
                      { id: 'Wood', name: 'Wood Planks', color: '#8B4513' },
                      { id: 'Brick', name: 'Brick Wall', color: '#9a4a30' },
                      { id: 'Concrete', name: 'Concrete', color: '#898989' },
                      { id: 'Marble', name: 'Marble', color: '#d8d0c8' }
                    ].map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => setSetupWallMaterial(mat.id)}
                        className={`p-3 rounded-xl border-2 text-left font-bold text-sm transition-all flex items-center gap-3 ${setupWallMaterial === mat.id ? 'border-[var(--lagoon)] bg-[var(--chip-bg)] text-[var(--sea-ink)] shadow-sm' : 'border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink-soft)] hover:border-[var(--lagoon)]'}`}
                      >
                        <div className="w-8 h-8 rounded bg-cover bg-center border border-black/10 shrink-0" style={{ backgroundColor: mat.color }} />
                        {mat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setWizardStep(2)} className="rounded-full bg-[var(--sand)] text-[var(--sea-ink)] font-bold py-3 px-6 hover:bg-gray-200 transition">Back</button>
                <button
                  onClick={() => setWizardStep(4)}
                  className="rounded-full bg-[var(--brand)] flex-1 text-white font-bold py-3 hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2"
                >
                  Next Step <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
              <p className="text-sm text-[var(--sea-ink-soft)] font-semibold">Step 4: Select Your Asset Palette</p>
              <p className="text-xs text-gray-500">Assets will spawn next to your booth for easy placement.</p>

              <div className="grid grid-cols-2 gap-3 text-left">
                {[
                  { id: 'bombo', name: 'Bar Stool' },
                  { id: 'catifa_bar', name: 'High Stool' },
                  { id: 'catifa_46', name: 'Chair' },
                  { id: 'berthe', name: 'Office Chair' },
                  { id: 'medola_weiss', name: 'Meeting Table' },
                  { id: 'luna_110', name: 'Bar Table' },
                ].map(asset => (
                  <div key={asset.id} className="flex items-center justify-between bg-[var(--sand)] p-3 rounded-xl border border-[var(--line)]">
                    <span className="text-xs font-bold text-[var(--sea-ink)]">{asset.name}</span>
                    <select
                      value={setupAssets[asset.id] || 0}
                      onChange={(e) => setSetupAssets(prev => ({ ...prev, [asset.id]: parseInt(e.target.value) }))}
                      className="bg-[var(--surface-strong)] border border-[var(--line)] rounded text-xs p-1 font-mono text-[var(--sea-ink)]"
                    >
                      {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setWizardStep(3)} className="rounded-full bg-[var(--sand)] text-[var(--sea-ink)] font-bold py-3 px-6 hover:bg-gray-200 transition">Back</button>
                <button
                  onClick={() => {
                    const PPM = 100
                    const W = setupWidth * PPM
                    const D = setupDepth * PPM
                    const T = setupWallThickness * 100

                    const wallProps = getWallMaterialProps(setupWallMaterial)
                    const initialElements: any[] = []
                    if (setupWalls.north) initialElements.push({ id: 'outer-north', type: 'wall', isOuter: true, x: W / 2, y: 0, width: W, thickness: T, rotation: 0, wallElements: [], ...wallProps })
                    if (setupWalls.south) initialElements.push({ id: 'outer-south', type: 'wall', isOuter: true, x: W / 2, y: D, width: W, thickness: T, rotation: 0, wallElements: [], ...wallProps })
                    if (setupWalls.west) initialElements.push({ id: 'outer-west', type: 'wall', isOuter: true, x: 0, y: D / 2, width: D, thickness: T, rotation: 90, wallElements: [], ...wallProps })
                    if (setupWalls.east) initialElements.push({ id: 'outer-east', type: 'wall', isOuter: true, x: W, y: D / 2, width: D, thickness: T, rotation: 90, wallElements: [], ...wallProps })

                    // Generate Assets inside the Booth
                    let spawnX = 0.5 * PPM; // Start 0.5m from left wall
                    let spawnY = 0.5 * PPM; // Start 0.5m from top wall
                    
                    Object.entries(setupAssets).forEach(([assetId, count]) => {
                      for (let i = 0; i < count; i++) {
                        const dims = ASSET_DIMENSIONS[assetId] || { w: 1, h: 1 };
                        const reg = ASSET_REGISTRY.find(a => a.id === assetId);
                        initialElements.push({
                          id: `${assetId}_${Math.random().toString(36).substring(2, 7)}`,
                          type: 'asset',
                          assetName: assetId,
                          categoryFolder: reg ? reg.category : 'models',
                          label: reg ? reg.label : assetId,
                          details: reg ? reg.details : '',
                          x: spawnX,
                          y: spawnY,
                          width: DEFAULT_ASSET_SIZE_PX * dims.w,
                          height: DEFAULT_ASSET_SIZE_PX * dims.h,
                          rotation: 0
                        });
                        spawnX += 0.8 * PPM; // Move right by 0.8m
                        // Wrap to next row if we get close to the right wall
                        if (spawnX > W - (0.8 * PPM)) {
                           spawnX = 0.5 * PPM; // reset X to left
                           spawnY += 0.8 * PPM; // move down a row
                        }
                      }
                    });

                    setBoothConfig({ width: setupWidth, depth: setupDepth, wallThickness: setupWallThickness, walls: setupWalls, floorType: setupFloorType })
                    setElements(initialElements)
                    saveToHistory(initialElements)
                  }}
                  className="rounded-full bg-[var(--lagoon-deep)] flex-1 text-white font-bold py-3 hover:bg-[var(--palm)] transition flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Initialize Booth
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    )
  }

  // Editor layout using split panels
  return (
    <div key="editor-workspace" className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[var(--bg-base)]">
      {/* Top Bar */}
      <div className="h-14 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center justify-between px-4 z-20 shadow-sm transition-all shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-[var(--border)]">
            <div className="h-8 w-8 rounded-lg bg-[var(--brand)] flex items-center justify-center text-white font-bold shadow-sm">D</div>
            <span className="font-extrabold text-[var(--fg)] tracking-tight">
              Dekode Booth Designer
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (confirm('Return to Setup Wizard? Current booth dimensions will be reset.')) {
                  setBoothConfig(null)
                  setWizardStep(1)
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink)] text-xs font-bold transition hover:bg-[var(--lagoon)] hover:text-white"
            >
              Edit Booth Setup
            </button>
            <div className="w-px h-6 bg-[var(--line)] mx-2" />
            <button onClick={undo} disabled={historyStep <= 0} className="p-2 rounded-lg hover:bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] disabled:opacity-30 transition" title="Undo (Ctrl+Z)">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={redo} disabled={historyStep >= history.length - 1} className="p-2 rounded-lg hover:bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] disabled:opacity-30 transition" title="Redo (Ctrl+Shift+Z)">
              <RotateCw className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-[var(--line)] mx-1" />
            <button onClick={clearAll} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Clear Workspace">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-[var(--sand)] p-1 rounded-xl border border-[var(--line)] mr-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1.5 rounded-lg transition ${sidebarOpen ? 'bg-[var(--brand)] text-white' : 'text-[var(--fg-soft)] hover:bg-[var(--bg-subtle)]'}`}
              title="Toggle Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPropertiesOpen(!propertiesOpen)}
              className={`p-1.5 rounded-lg transition ${propertiesOpen ? 'bg-[var(--brand)] text-white' : 'text-[var(--fg-soft)] hover:bg-[var(--bg-subtle)]'}`}
              title="Toggle Properties"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewerOpen(!previewerOpen)}
              className={`p-1.5 rounded-lg transition ${previewerOpen ? 'bg-[var(--brand)] text-white' : 'text-[var(--fg-soft)] hover:bg-[var(--bg-subtle)]'}`}
              title="Toggle 3D Preview"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>

          <label className="cursor-pointer px-3 py-2 rounded-lg text-[var(--sea-ink-soft)] text-xs font-bold transition hover:bg-[var(--chip-bg)] flex items-center gap-1">
            <Upload className="h-4 w-4" /> Import Project
            <input type="file" accept=".json" onChange={handleImportProject} className="hidden" />
          </label>
          <button
            onClick={downloadProjectJSON}
            className="px-3 py-2 rounded-lg text-[var(--sea-ink-soft)] text-xs font-bold transition hover:bg-[var(--chip-bg)] flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> Save Project
          </button>
          <button
            onClick={submitExport}
            className="px-3 py-2 rounded-lg text-[var(--sea-ink-soft)] text-xs font-bold transition hover:bg-[var(--chip-bg)] flex items-center gap-1"
          >
            <FileText className="h-4 w-4" /> Report
          </button>
          <button
            onClick={() => setIs3DGenerated(true)}
            className="px-5 py-2 rounded-full bg-[var(--lagoon-deep)] text-white text-sm font-bold flex items-center gap-2 hover:bg-[var(--palm)] transition shadow-md"
          >
            <Box className="h-4 w-4" /> {is3DGenerated ? 'Live 3D Syncing' : 'Generate 3D'}
          </button>
        </div>
      </div>

      {/* Split Workspaces — all panels are flex siblings, canvas is flex-1 */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        {sidebarOpen && (
          <div className="flex h-full shrink-0 z-10 shadow-xl border-r border-[var(--line)]">
            <Sidebar 
              addElement={addElement} 
              activeView={blueprintView} 
              onViewChange={setBlueprintView} 
            />
          </div>
        )}

        {/* Center Canvas — flex-1 always fills remaining space */}
        <div className="flex-1 flex h-full flex-col relative z-0 min-w-0 bg-[var(--bg-base)]">
          <Canvas
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            onSelect={handleSelect}
            boothConfig={boothConfig}
            gridVisible={gridVisible}
          />
        </div>

        {/* Properties Panel — in flow, not absolute */}
        {propertiesOpen && (
          <div className="shrink-0 h-full border-l border-[var(--line)] z-20 shadow-[-8px_0_20px_rgba(0,0,0,0.05)]">
            <Properties
              selectedElement={selectedElement}
              onUpdate={handleUpdateElement}
              onDelete={() => handleDeleteElement(selectedId!)}
              onEditElevation={() => setEditingWallId(selectedId)}
              onViewElevation={() => setBlueprintView(`elevation_${selectedId}` as any)}
              boothConfig={boothConfig}
              onBoothConfigUpdate={(updates: any) => setBoothConfig((prev: any) => ({ ...prev, ...updates }))}
            />
          </div>
        )}

        {/* Resizer handle */}
        {previewerOpen && (
          <div
            className="w-1 shrink-0 bg-[var(--line)] hover:bg-[var(--lagoon)] cursor-col-resize z-30 transition-colors"
            onMouseDown={() => {
              const onMove = (e: MouseEvent) => {
                if (e.buttons !== 1) return
                const pct = (e.clientX / window.innerWidth) * 100
                if (pct > 20 && pct < 85) setSplitWidth(pct)
              }
              const onUp = () => {
                window.removeEventListener('mousemove', onMove)
                window.removeEventListener('mouseup', onUp)
              }
              window.addEventListener('mousemove', onMove)
              window.addEventListener('mouseup', onUp)
            }}
          />
        )}

        {/* Right Panel (3D Previewer) */}
        {previewerOpen && (
          <div
            style={{ width: `${100 - splitWidth}%` }}
            className="shrink-0 min-w-[180px] border-l border-[#2a2d30] bg-[#121415] flex flex-col shadow-2xl z-20 relative"
          >

            {is3DGenerated ? (
              <div className="flex-1 w-full relative">
                <Preview3D 
                  boothConfig={boothConfig} 
                  elements={elements} 
                  activeView={blueprintView}
                  onExportComplete={onExportComplete}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-[#121415]">
                <Box className="w-14 h-14 text-gray-800 mb-4 opacity-50" />
                <h4 className="text-gray-300 font-bold mb-1 text-sm">3D Engine Offline</h4>
                <p className="text-gray-500 text-[10px] max-w-[180px]">Place objects in the 2D layout and click "Generate 3D".</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Status Bar */}
      <div className="h-6 border-t border-[var(--line)] bg-[var(--surface-strong)] flex items-center justify-between px-4 text-[10px] uppercase tracking-tighter font-bold text-[var(--sea-ink-soft)] select-none shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setGridVisible(!gridVisible)}
            className={`px-2 py-1 rounded bg-[var(--line)] hover:bg-[var(--sand)] flex items-center gap-1 ${gridVisible ? 'text-[var(--sea-ink)]' : 'text-gray-400'}`}
          >
            SNAP GRID (1M) {gridVisible ? 'ON' : 'OFF'}
          </button>
          <span>Objects: {elements.length}</span>
          <span>Workspace: {boothConfig.width}m x {boothConfig.depth}m</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> WebGL Ready
          </span>
        </div>
      </div>
      {/* Wall Elevation Modal Overlay */}
      {editingWallId && editingWall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-7xl h-full max-h-[85vh] bg-[var(--bg-base)] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative border border-[var(--border)] scale-in-center">
            <WallCanvas
              wall={editingWall}
              onSave={(wallElements: any) => {
                handleUpdateElement(editingWall.id, { wallElements })
                setEditingWallId(null)
              }}
              onClose={() => setEditingWallId(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
