import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Sidebar from '../components/editor/Sidebar'
import Canvas from '../components/editor/Canvas'
import WallCanvas from '../components/editor/WallCanvas'
import Properties from '../components/editor/Properties'
import Preview3D from '../components/editor/Preview3D'
import { PanelLeftClose, PanelRightClose, Save, Check, RotateCcw, RotateCw, Trash2, Box, ArrowRight, Settings } from 'lucide-react'

export const Route = createFileRoute('/editor')({
  component: EditorPage,
})

interface BoothConfig {
  width: number;
  depth: number;
  wallThickness: number;
  walls: { north: boolean; south: boolean; east: boolean; west: boolean };
}

function EditorPage() {
  const [boothConfig, setBoothConfig] = useState<BoothConfig | null>(null)

  // Setup Wizard State
  const [wizardStep, setWizardStep] = useState(1)
  const [setupWidth, setSetupWidth] = useState<number>(3)
  const [setupDepth, setSetupDepth] = useState<number>(3)
  const [setupWallThickness, setSetupWallThickness] = useState<number>(0.1)
  const [setupWalls, setSetupWalls] = useState({ north: true, south: false, east: true, west: true })

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


  const handleSelect = (id: string | null) => {
    setSelectedId(id)
  }

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

  const saveToHistory = (newElements: any[]) => {
    const nextHistory = history.slice(0, historyStep + 1)
    setHistory([...nextHistory, newElements])
    setHistoryStep(nextHistory.length)
  }

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

  const handleUpdateElement = (id: string, newProps: any) => {
    const updated = elements.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    setElements(updated)
    saveToHistory(updated)
  }

  const handleDeleteElement = (id: string) => {
    const filtered = elements.filter((el) => el.id !== id)
    setElements(filtered)
    saveToHistory(filtered)
    if (selectedId === id) setSelectedId(null)
  }

  const addElement = (newEl: any) => {
    const updated = [...elements, newEl]
    setElements(updated)
    saveToHistory(updated)
  }

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
    const exportedElements = elements.map((el) => ({
      id: el.id,
      type: el.type,
      assetName: el.assetName,
      material: el.material,
      x: el.x,
      y: el.y,
      rotation: el.rotation || 0,
      width: el.width,
      height: el.height,
    }))

    const finalExport = {
      booth: {
        width: boothConfig?.width,
        length: boothConfig?.depth,
        wallThickness: boothConfig?.wallThickness,
        size: (boothConfig?.width || 0) * (boothConfig?.depth || 0),
        walls: boothConfig?.walls,
      },
      elements: exportedElements,
    }

    console.log(JSON.stringify(finalExport, null, 2))
    alert('Export successful! Check console for JSON.')
  }

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
                  onClick={() => {
                    const PPM = 100
                    const W = setupWidth * PPM
                    const D = setupDepth * PPM
                    const T = setupWallThickness * 100

                    const initialElements: any[] = []
                    if (setupWalls.north) initialElements.push({ id: 'outer-north', type: 'wall', isOuter: true, x: W / 2, y: 0, width: W, thickness: T, rotation: 0, fill: '#333333', opacity: 1, wallElements: [] })
                    if (setupWalls.south) initialElements.push({ id: 'outer-south', type: 'wall', isOuter: true, x: W / 2, y: D, width: W, thickness: T, rotation: 0, fill: '#333333', opacity: 1, wallElements: [] })
                    if (setupWalls.west) initialElements.push({ id: 'outer-west', type: 'wall', isOuter: true, x: 0, y: D / 2, width: D, thickness: T, rotation: 90, fill: '#333333', opacity: 1, wallElements: [] })
                    if (setupWalls.east) initialElements.push({ id: 'outer-east', type: 'wall', isOuter: true, x: W, y: D / 2, width: D, thickness: T, rotation: 90, fill: '#333333', opacity: 1, wallElements: [] })

                    setBoothConfig({ width: setupWidth, depth: setupDepth, wallThickness: setupWallThickness, walls: setupWalls })
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

          <button
            onClick={submitExport}
            className="px-3 py-2 rounded-lg text-[var(--sea-ink-soft)] text-xs font-bold transition hover:bg-[var(--chip-bg)] flex items-center gap-1"
          >
            <Save className="h-4 w-4" /> Save
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
            <Sidebar addElement={addElement} />
          </div>
        )}

        {/* Center Canvas — flex-1 always fills remaining space */}
        <div className="flex-1 flex h-full flex-col relative z-0 min-w-0 bg-[var(--bg-base)]">
          {editingWallId && editingWall ? (
            <WallCanvas
              wall={editingWall}
              onSave={(wallElements: any) => {
                handleUpdateElement(editingWall.id, { wallElements })
                setEditingWallId(null)
              }}
              onClose={() => setEditingWallId(null)}
            />
          ) : (
            <Canvas
              elements={elements}
              setElements={setElements}
              selectedId={selectedId}
              onSelect={handleSelect}
              boothConfig={boothConfig}
              gridVisible={gridVisible}
            />
          )}
        </div>

        {/* Properties Panel — in flow, not absolute */}
        {propertiesOpen && (
          <div className="shrink-0 h-full border-l border-[var(--line)] z-20 shadow-[-8px_0_20px_rgba(0,0,0,0.05)]">
            <Properties
              selectedElement={selectedElement}
              onUpdate={handleUpdateElement}
              onDelete={() => handleDeleteElement(selectedId!)}
              onEditElevation={() => setEditingWallId(selectedId)}
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
            className="shrink-0 min-w-[180px] border-l border-[#1f2326] bg-[#121415] flex flex-col shadow-2xl z-20"
          >
            <div className="h-10 border-b border-gray-800 flex items-center px-4 shrink-0 bg-[#0a0b0d]">
              <span className="text-xs uppercase tracking-widest text-[#a1a1aa] font-bold">3D Previewer</span>
            </div>

            {is3DGenerated ? (
              <div className="flex-1 w-full relative">
                <Preview3D boothConfig={boothConfig} elements={elements} />
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
    </div>
  )
}
