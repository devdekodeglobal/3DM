import { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Circle, Line, Text, Transformer, Group } from 'react-konva'
import { X, Save, Plus, Trash2, Lightbulb } from 'lucide-react'
import ColorPickerPanel from './ColorPickerPanel'

interface RoofPanel {
  id: string
  x: number // in pixels, relative to grid center or top-left
  y: number
  width: number
  height: number
}

interface CeilingLight {
  id: string
  type: 'tube' | 'circular' | 'square'
  x: number
  y: number
  width: number
  height: number
  color: string
  intensity: number
}

interface RoofCanvasProps {
  boothConfig: any
  onSave: (roofConfig: any) => void
  onClose: () => void
}

export default function RoofCanvas({ boothConfig, onSave, onClose }: RoofCanvasProps) {
  const PPM = 100
  const SNAP = 10 // 0.1m snap
  const boothWidthPx = boothConfig.width * PPM
  const boothDepthPx = boothConfig.depth * PPM

  // Load existing roof config or set defaults
  const initialRoof = boothConfig.roof || {
    enabled: true,
    color: '#e2e8f0',
    thickness: 0.1,
    height: 2.5,
    panels: [
      {
        id: 'initial-panel',
        x: 0,
        y: 0,
        width: boothWidthPx,
        height: boothDepthPx,
      },
    ],
    lights: [],
  }

  const [panels, setPanels] = useState<RoofPanel[]>(initialRoof.panels || [])
  const [lights, setLights] = useState<CeilingLight[]>(initialRoof.lights || [])
  const [roofColor, setRoofColor] = useState<string>(initialRoof.color || '#e2e8f0')
  const [roofThickness, setRoofThickness] = useState<number>(initialRoof.thickness || 0.1)
  const [roofHeight, setRoofHeight] = useState<number>(initialRoof.height || 2.5)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragLabel, setDragLabel] = useState<any | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const transformerRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [stageScale, setStageScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })

  // Resize handler to fit stage nicely
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      const h = containerRef.current.offsetHeight
      setDimensions({ width: w, height: h })

      // Leave a border margin of 100px around the booth bounds
      const margin = 200
      const scaleX = w / (boothWidthPx + margin)
      const scaleY = h / (boothDepthPx + margin)
      const idealScale = Math.min(scaleX, scaleY, 2.5)
      setStageScale(idealScale)
      setStagePos({
        x: (w - boothWidthPx * idealScale) / 2,
        y: (h - boothDepthPx * idealScale) / 2,
      })
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [boothWidthPx, boothDepthPx])

  // Transformer node sync
  useEffect(() => {
    if (!transformerRef.current) return
    if (selectedId) {
      const stage = transformerRef.current.getStage()
      const node = stage.findOne('#el-' + selectedId)
      if (node) {
        transformerRef.current.nodes([node])
      } else {
        transformerRef.current.nodes([])
      }
    } else {
      transformerRef.current.nodes([])
    }
    transformerRef.current.getLayer()?.batchDraw()
  }, [selectedId, panels, lights])

  const snap = (v: number) => Math.round(v / SNAP) * SNAP

  const addPanel = () => {
    const newPanel: RoofPanel = {
      id: 'panel-' + Math.random().toString(36).substr(2, 9),
      x: snap(boothWidthPx / 4),
      y: snap(boothDepthPx / 4),
      width: snap(boothWidthPx / 2),
      height: snap(boothDepthPx / 2),
    }
    setPanels(prev => [...prev, newPanel])
    setSelectedId(newPanel.id)
  }

  const addLight = (type: 'tube' | 'circular' | 'square') => {
    let w = 40, h = 40
    if (type === 'tube') {
      w = 80
      h = 15
    }
    const newLight: CeilingLight = {
      id: 'light-' + Math.random().toString(36).substr(2, 9),
      type,
      x: snap(boothWidthPx / 2 - w / 2),
      y: snap(boothDepthPx / 2 - h / 2),
      width: w,
      height: h,
      color: '#ffffff',
      intensity: 1.0,
    }
    setLights(prev => [...prev, newLight])
    setSelectedId(newLight.id)
  }

  const deleteSelected = () => {
    if (!selectedId) return
    setPanels(prev => prev.filter(p => p.id !== selectedId))
    setLights(prev => prev.filter(l => l.id !== selectedId))
    setSelectedId(null)
  }

  const handleUpdatePanel = (id: string, updates: Partial<RoofPanel>) => {
    setPanels(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)))
  }

  const handleUpdateLight = (id: string, updates: Partial<CeilingLight>) => {
    setLights(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)))
  }

  const selectedLight = lights.find(l => l.id === selectedId)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return
        deleteSelected()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId])

  // Draw grid lines in background
  const gridLines = []
  const maxW = boothWidthPx * 2
  const maxH = boothDepthPx * 2
  for (let x = -boothWidthPx; x <= maxW; x += SNAP * 5) {
    gridLines.push(<Line key={`v-${x}`} points={[x, -boothDepthPx, x, maxH]} stroke="#e2e8f0" strokeWidth={1} opacity={0.5} />)
  }
  for (let y = -boothDepthPx; y <= maxH; y += SNAP * 5) {
    gridLines.push(<Line key={`h-${y}`} points={[-boothWidthPx, y, maxW, y]} stroke="#e2e8f0" strokeWidth={1} opacity={0.5} />)
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden select-none">
      {/* 2D Canvas Editor Area */}
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative" ref={containerRef}>
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={addPanel}
            className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-emerald-500" />
            Add Roof Panel
          </button>
          <div className="w-px h-8 bg-slate-200 self-center" />
          <button
            onClick={() => addLight('tube')}
            className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 transition"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            + Tube Light
          </button>
          <button
            onClick={() => addLight('circular')}
            className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 transition"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            + Circular Light
          </button>
          <button
            onClick={() => addLight('square')}
            className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 transition"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            + Square Light
          </button>
        </div>

        {selectedId && (
          <button
            onClick={deleteSelected}
            className="absolute top-4 right-4 z-10 p-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 shadow-sm flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        )}

        <Stage
          width={dimensions.width}
          height={dimensions.height}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          onClick={(e) => {
            if (e.target === e.target.getStage()) {
              setSelectedId(null)
            }
          }}
        >
          <Layer>
            {/* Background Grid */}
            {gridLines}

            {/* Booth Floor Outline / Wall reference */}
            <Rect
              x={0}
              y={0}
              width={boothWidthPx}
              height={boothDepthPx}
              stroke="#0d7a75"
              strokeWidth={3}
              dash={[6, 4]}
              opacity={0.7}
              listening={false}
            />
            <Text
              x={10}
              y={10}
              text="BOOTH WALL BOUNDS"
              fontSize={11}
              fontFamily="Outfit, Inter, sans-serif"
              fontStyle="bold"
              fill="#0d7a75"
              opacity={0.7}
            />

            {/* Render Roof Panels */}
            {panels.map((p) => {
              const isSelected = selectedId === p.id
              return (
                <Rect
                  key={p.id}
                  id={'el-' + p.id}
                  x={p.x}
                  y={p.y}
                  width={p.width}
                  height={p.height}
                  fill={roofColor}
                  stroke={isSelected ? '#0d7a75' : '#475569'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  opacity={0.8}
                  draggable
                  onMouseDown={() => setSelectedId(p.id)}
                  onDragMove={(e) => {
                    const nx = snap(e.target.x())
                    const ny = snap(e.target.y())
                    e.target.x(nx)
                    e.target.y(ny)
                    setDragLabel({ x: nx, y: ny, w: p.width, h: p.height })
                  }}
                  onDragEnd={(e) => {
                    const nx = snap(e.target.x())
                    const ny = snap(e.target.y())
                    handleUpdatePanel(p.id, { x: nx, y: ny })
                    setDragLabel(null)
                  }}
                  onTransform={(e) => {
                    const node = e.target
                    const scaleX = node.scaleX()
                    const scaleY = node.scaleY()
                    setDragLabel({
                      x: snap(node.x()),
                      y: snap(node.y()),
                      w: snap(node.width() * scaleX),
                      h: snap(node.height() * scaleY),
                    })
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target
                    const scaleX = node.scaleX()
                    const scaleY = node.scaleY()
                    node.scaleX(1)
                    node.scaleY(1)
                    handleUpdatePanel(p.id, {
                      x: snap(node.x()),
                      y: snap(node.y()),
                      width: snap(node.width() * scaleX),
                      height: snap(node.height() * scaleY),
                    })
                    setDragLabel(null)
                  }}
                />
              )
            })}

            {/* Render Ceiling Lights */}
            {lights.map((l) => {
              const isSelected = selectedId === l.id
              const isCircular = l.type === 'circular'
              const colorVal = l.color || '#ffffff'

              return (
                <Group
                  key={l.id}
                  id={'el-' + l.id}
                  x={l.x}
                  y={l.y}
                  width={l.width}
                  height={l.height}
                  draggable
                  onMouseDown={() => setSelectedId(l.id)}
                  onDragMove={(e) => {
                    const nx = snap(e.target.x())
                    const ny = snap(e.target.y())
                    e.target.x(nx)
                    e.target.y(ny)
                    setDragLabel({ x: nx, y: ny, w: l.width, h: l.height })
                  }}
                  onDragEnd={(e) => {
                    const nx = snap(e.target.x())
                    const ny = snap(e.target.y())
                    handleUpdateLight(l.id, { x: nx, y: ny })
                    setDragLabel(null)
                  }}
                >
                  {isCircular ? (
                    <Circle
                      x={l.width / 2}
                      y={l.height / 2}
                      radius={Math.min(l.width, l.height) / 2}
                      fill={colorVal}
                      stroke={isSelected ? '#0d7a75' : '#f59e0b'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      shadowColor={colorVal}
                      shadowBlur={10}
                      shadowOpacity={0.8}
                    />
                  ) : (
                    <Rect
                      x={0}
                      y={0}
                      width={l.width}
                      height={l.height}
                      fill={colorVal}
                      stroke={isSelected ? '#0d7a75' : '#f59e0b'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      cornerRadius={l.type === 'tube' ? 4 : 1}
                      shadowColor={colorVal}
                      shadowBlur={10}
                      shadowOpacity={0.8}
                    />
                  )}
                  <Text
                    x={0}
                    y={l.height + 4}
                    width={l.width}
                    text={l.type.toUpperCase()}
                    fontSize={8}
                    align="center"
                    fontStyle="bold"
                    fill="#334155"
                  />
                </Group>
              )
            })}

            {/* Transformer */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) return oldBox
                return newBox
              }}
              rotateEnabled={false}
            />

            {/* Ruler label during dragging */}
            {dragLabel && (
              <Group x={dragLabel.x} y={dragLabel.y - 25}>
                <Rect
                  fill="rgba(15,23,42,0.85)"
                  height={20}
                  width={110}
                  cornerRadius={4}
                />
                <Text
                  text={`${(dragLabel.w / PPM).toFixed(1)}m x ${(dragLabel.h / PPM).toFixed(1)}m`}
                  fill="white"
                  fontSize={10}
                  fontStyle="bold"
                  padding={5}
                />
              </Group>
            )}
          </Layer>
        </Stage>
      </div>

      {/* Editor Control Sidebar */}
      <div className="w-80 h-full border-l border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            Roof & Ceiling Editor
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          {/* Section 1: General Properties */}
          <div className="space-y-4">
            <h4 className="text-xs font-black tracking-wider uppercase text-slate-400">Roof Parameters</h4>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Roof Height (meters)</label>
                <span className="font-mono text-slate-500 font-bold">{roofHeight.toFixed(1)}m</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="5.0"
                step="0.1"
                value={roofHeight}
                onChange={(e) => setRoofHeight(parseFloat(e.target.value))}
                className="w-full accent-[var(--lagoon-deep)]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Roof Thickness (meters)</label>
                <span className="font-mono text-slate-500 font-bold">{roofThickness.toFixed(2)}m</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.50"
                step="0.01"
                value={roofThickness}
                onChange={(e) => setRoofThickness(parseFloat(e.target.value))}
                className="w-full accent-[var(--lagoon-deep)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Roof Face Color</label>
              <ColorPickerPanel initialColor={roofColor} onChange={setRoofColor} />
            </div>
          </div>

          {/* Section 2: Selected Element Settings */}
          {selectedLight && (
            <div className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-400">Ceiling Light Settings</h4>
              
              <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="text-xs font-bold text-slate-800 capitalize">{selectedLight.type} Light</div>
                  <div className="text-[10px] text-slate-500">Ceiling mounted light source</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Emission Color</label>
                <ColorPickerPanel
                  initialColor={selectedLight.color}
                  onChange={(c) => handleUpdateLight(selectedLight.id, { color: c })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700">Light Intensity</label>
                  <span className="font-mono text-slate-500 font-bold">{selectedLight.intensity.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={selectedLight.intensity}
                  onChange={(e) => handleUpdateLight(selectedLight.id, { intensity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          )}

          {!selectedId && (
            <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100">
              Select a roof panel or light fixture to edit its specific properties.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={() => {
              onSave({
                enabled: true,
                color: roofColor,
                thickness: roofThickness,
                height: roofHeight,
                panels,
                lights,
              })
            }}
            className="flex-1 bg-[var(--lagoon-deep)] hover:bg-[var(--palm)] text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  )
}
