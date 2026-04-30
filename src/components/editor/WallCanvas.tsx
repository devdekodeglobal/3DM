import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Stage, Layer, Rect, Text, Transformer, Line, Group, Circle } from 'react-konva'
import { X, Save } from 'lucide-react'

// Sub-component for the actual wall elements to prevent re-renders during transformation/drag labels
const WallElements = React.memo(({ elements, selectedId, onSelect, onDragMove, onDragEnd, onTransform, onTransformEnd }: any) => {
  const ELEMENT_TYPES: Record<string, any> = {
    door: { color: 'rgba(139,100,60,0.35)', stroke: '#7c5c3a' },
    window: { color: 'rgba(100,200,255,0.35)', stroke: '#00BFFF' },
    shelf: { color: 'rgba(180,120,60,0.5)', stroke: '#a0522d' },
    banner: { color: 'rgba(80,120,255,0.35)', stroke: '#4a6aff' },
    frame: { color: 'rgba(255,255,255,0.4)', stroke: '#444444' },
    light: { color: 'rgba(255,255,0,0.4)', stroke: '#FFD700', model: 'wall_light_1' },
  }

  const [images, setImages] = useState<Record<string, HTMLImageElement>>({})

  useEffect(() => {
    elements.forEach((el: any) => {
      if (el.type === 'banner' && el.url && !images[el.url]) {
        const img = new window.Image()
        img.src = el.url
        img.onload = () => {
          if (img.width > 0 && img.height > 0) {
            setImages(prev => ({ ...prev, [el.url]: img }))
          }
        }
      }
    })
  }, [elements])

  return (
    <>
      {elements.map((el: any, i: number) => {
        const cfg = ELEMENT_TYPES[el.type] || ELEMENT_TYPES.window
        const isSelected = selectedId === el.id
        const hasImage = (el.type === 'banner' || el.type === 'frame') && el.url && images[el.url]
        const patternImg = hasImage ? images[el.url] : undefined

        if (el.type === 'frame' && el.shape === 'circle') {
          return (
            <Circle
              key={el.id}
              id={'el-' + el.id}
              x={el.x + el.width / 2}
              y={el.y + el.height / 2}
              radius={Math.min(el.width, el.height) / 2}
              fill={hasImage ? undefined : cfg.color}
              fillPatternImage={patternImg}
              fillPatternScaleX={patternImg ? el.width / patternImg.width : undefined}
              fillPatternScaleY={patternImg ? el.height / patternImg.height : undefined}
              fillPatternOffsetX={patternImg ? patternImg.width / 2 : undefined}
              fillPatternOffsetY={patternImg ? patternImg.height / 2 : undefined}
              stroke={isSelected ? '#0d7a75' : cfg.stroke}
              strokeWidth={isSelected ? 2.5 : 1.5}
              draggable
              shadowEnabled={isSelected}
              shadowColor="#0d7a75"
              shadowBlur={10}
              shadowOpacity={0.4}
              onMouseDown={() => onSelect(el.id)}
              onClick={() => onSelect(el.id)}
              onTap={() => onSelect(el.id)}
              onDragMove={(e) => {
                const nx = e.target.x() - el.width / 2
                const ny = e.target.y() - el.height / 2
                onDragMove(i, { target: { x: () => nx, y: () => ny } })
              }}
              onDragEnd={(e) => {
                const nx = e.target.x() - el.width / 2
                const ny = e.target.y() - el.height / 2
                onDragEnd(i, { target: { x: () => nx, y: () => ny } })
              }}
              onTransform={(e) => {
                const node = e.target as any
                const scale = node.scaleX()
                node.scaleX(1)
                node.scaleY(1)
                const newR = node.radius() * scale
                node.radius(newR)
                // This is complex for Transformer, maybe just stick to Rect for simplicity or handle scaling
                onTransform(i, e)
              }}
              onTransformEnd={onTransformEnd}
            />
          )
        }

        return (
          <Rect
            key={el.id}
            id={'el-' + el.id}
            x={el.x}
            y={el.y}
            width={el.width}
            height={el.height}
            fill={hasImage ? undefined : cfg.color}
            fillPatternImage={patternImg}
            fillPatternScaleX={patternImg ? el.width / patternImg.width : undefined}
            fillPatternScaleY={patternImg ? el.height / patternImg.height : undefined}
            stroke={isSelected ? '#0d7a75' : cfg.stroke}
            strokeWidth={isSelected ? 2.5 : 1.5}
            draggable
            shadowEnabled={isSelected}
            shadowColor="#0d7a75"
            shadowBlur={10}
            shadowOpacity={0.4}
            onMouseDown={() => onSelect(el.id)}
            onClick={() => onSelect(el.id)}
            onTap={() => onSelect(el.id)}
            onDragMove={(e) => onDragMove(i, e)}
            onDragEnd={(e) => onDragEnd(i, e)}
            onTransform={(e) => onTransform(i, e)}
            onTransformEnd={(e) => onTransformEnd(i, e)}
          />
        )
      })}
    </>
  )
})

export default function WallCanvas({ wall, onSave, onClose }: any) {
  const [elements, setElements] = useState<any[]>(wall.wallElements || [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragLabel, setDragLabel] = useState<any | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const transformerRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [stageScale, setStageScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })

  const PPM = 100
  const SNAP = 10 // 0.1m snap grid
  const wallWidth = wall.width // pixels
  const wallHeight = 2.5 * PPM // 2.5m fixed height

  const ELEMENT_TYPES: Record<string, any> = {
    door: { label: 'Door', emoji: '🚪', defaultW: 0.9, defaultH: 2.0, defaultY: 'floor' },
    window: { label: 'Window', emoji: '🪟', defaultW: 1.2, defaultH: 1.0, defaultY: 'mid' },
    shelf: { label: 'Shelf', emoji: '📦', defaultW: 1.0, defaultH: 0.1, defaultY: 'mid' },
    banner: { label: 'Banner', emoji: '🖼️', defaultW: 1.5, defaultH: 0.8, defaultY: 'top' },
    frame: { label: 'Frame', emoji: '🖼️', defaultW: 0.6, defaultH: 0.6, defaultY: 'mid', shape: 'square' },
    light: { label: 'Light', emoji: '💡', defaultW: 0.2, defaultH: 0.2, defaultY: 'top' },
  }

  // Resize observer to auto-fit canvas
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      const h = containerRef.current.offsetHeight
      setDimensions({ width: w, height: h })
      const scaleX = (w * 0.85) / wallWidth
      const scaleY = (h * 0.85) / wallHeight
      const idealScale = Math.min(scaleX, scaleY, 2.5)
      setStageScale(idealScale)
      setStagePos({
        x: (w - wallWidth * idealScale) / 2,
        y: (h - wallHeight * idealScale) / 2,
      })
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [wallWidth, wallHeight])

  // Sync transformer
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
  }, [selectedId, elements])

  const snap = (v: number) => Math.round(v / SNAP) * SNAP
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))

  const handleAdd = (type: string) => {
    const cfg = ELEMENT_TYPES[type]
    const w = cfg.defaultW * PPM
    const h = cfg.defaultH * PPM
    let y = wallHeight / 2 - h / 2
    if (cfg.defaultY === 'floor') y = wallHeight - h
    if (cfg.defaultY === 'top') y = 0.1 * PPM
    setElements(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: snap(wallWidth / 2 - w / 2),
      y: snap(y),
      width: w,
      height: h,
      shape: cfg.shape || 'square',
      model: cfg.model || undefined
    }])
  }

  const handleDragMove = (index: number, e: any) => {
    const el = elements[index]
    const nx = clamp(snap(e.target.x()), 0, wallWidth - el.width)
    const ny = clamp(snap(e.target.y()), 0, wallHeight - el.height)
    e.target.x(nx)
    e.target.y(ny)
    setDragLabel({ id: el.id, x: nx, y: ny, width: el.width, height: el.height })
  }

  const handleDragEnd = (index: number, e: any) => {
    const el = elements[index]
    const nx = clamp(snap(e.target.x()), 0, wallWidth - el.width)
    const ny = clamp(snap(e.target.y()), 0, wallHeight - el.height)
    const newElements = [...elements]
    newElements[index] = { ...el, x: nx, y: ny }
    setElements(newElements)
    setDragLabel(null)
  }

  const handleTransform = (index: number, e: any) => {
    const node = e.target
    const el = elements[index]
    setDragLabel({
      id: el.id,
      x: node.x(),
      y: node.y(),
      width: node.width() * node.scaleX(),
      height: node.height() * node.scaleY()
    })
  }

  const handleTransformEnd = (index: number, e: any) => {
    const node = e.target
    const el = elements[index]
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    node.scaleX(1)
    node.scaleY(1)

    const newW = Math.max(10, snap(node.width() * scaleX))
    const newH = Math.max(10, snap(node.height() * scaleY))
    const nx = clamp(snap(node.x()), 0, wallWidth - newW)
    const ny = clamp(snap(node.y()), 0, wallHeight - newH)

    const newElements = [...elements]
    newElements[index] = { ...el, x: nx, y: ny, width: newW, height: newH }
    setElements(newElements)
    setDragLabel(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedId) {
        if (document.activeElement?.tagName === 'INPUT') return
        e.preventDefault()
        e.stopPropagation()
        setElements(prev => prev.filter(el => el.id !== selectedId))
        setSelectedId(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId])

  const gridLines = useMemo(() => {
    const lines = []
    const subStep = SNAP
    for (let i = 0; i <= Math.ceil(wallWidth / subStep); i++) {
      const isMajor = (i * subStep) % (PPM / 2) === 0
      lines.push(
        <Line key={`v-${i}`} points={[i * subStep, 0, i * subStep, wallHeight]}
          stroke={isMajor ? 'rgba(100,120,140,0.25)' : 'rgba(100,120,140,0.1)'}
          strokeWidth={isMajor ? 1 : 0.5} listening={false} />
      )
    }
    for (let j = 0; j <= Math.ceil(wallHeight / subStep); j++) {
      const isMajor = (j * subStep) % (PPM / 2) === 0
      lines.push(
        <Line key={`h-${j}`} points={[0, j * subStep, wallWidth, j * subStep]}
          stroke={isMajor ? 'rgba(100,120,140,0.25)' : 'rgba(100,120,140,0.1)'}
          strokeWidth={isMajor ? 1 : 0.5} listening={false} />
      )
    }
    return lines
  }, [wallWidth, wallHeight])

  const selectedEl = elements.find(el => el.id === selectedId) || null

  return (
    <div className="absolute inset-0 z-50 bg-[var(--bg-base)] flex flex-col">
      <div className="h-14 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-[var(--sea-ink)]">Wall Elevation Editor</h2>
          <span className="text-[10px] font-mono bg-[var(--sand)] border border-[var(--line)] px-2 py-1 rounded text-[var(--sea-ink-soft)]">
            {(wallWidth / PPM).toFixed(1)}m × 2.5m
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onSave(elements)} className="px-4 py-1.5 rounded-lg bg-[var(--lagoon-deep)] text-white text-xs font-bold flex items-center gap-2 hover:bg-[var(--palm)] transition shadow-sm">
            <Save className="w-4 h-4" /> Save Wall
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--sea-ink-soft)] hover:bg-gray-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-52 shrink-0 border-r border-[var(--line)] bg-[var(--surface-strong)] flex flex-col p-3 gap-2 overflow-y-auto">
          <p className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest mb-1">Add to Wall</p>
          {Object.entries(ELEMENT_TYPES).map(([type, cfg]: [string, any]) => (
            <button key={type} onClick={() => handleAdd(type)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--sand)] border border-[var(--line)] text-left hover:border-[var(--lagoon)] hover:bg-[var(--chip-bg)] transition">
              <span className="text-xl leading-none">{cfg.emoji}</span>
              <div>
                <p className="text-xs font-bold text-[var(--sea-ink)]">{cfg.label}</p>
                <p className="text-[10px] text-[var(--sea-ink-soft)]">{cfg.defaultW}m × {cfg.defaultH}m</p>
              </div>
            </button>
          ))}

          {selectedEl && (
            <div className="mt-3 pt-3 border-t border-[var(--line)]">
              <p className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest mb-2">Selected: {ELEMENT_TYPES[selectedEl.type]?.label}</p>
              <div className="space-y-2">
                {[
                  { label: 'X pos (m)', key: 'x' },
                  { label: 'Y pos (m)', key: 'y' },
                  { label: 'Width (m)', key: 'width' },
                  { label: 'Height (m)', key: 'height' },
                ].map(({ label, key }) => {
                  const isDragging = dragLabel?.id === selectedId
                  const val = isDragging ? dragLabel[key] : (selectedEl[key] || 0)

                  return (
                    <div key={key}>
                      <label htmlFor={`prop-${key}`} className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-0.5">{label}</label>
                      <input
                        id={`prop-${key}`}
                        name={key}
                        type="number"
                        step="0.05"
                        value={(val / PPM).toFixed(2)}
                        onChange={(e) => {
                          const v = snap(parseFloat(e.target.value) * PPM || 0)
                          setElements(prev => prev.map(el => el.id === selectedId ? { ...el, [key]: v } : el))
                        }}
                        className="w-full bg-[var(--bg-base)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded px-2 py-1 text-xs text-[var(--sea-ink)] outline-none"
                      />
                    </div>
                  )
                })}

                {selectedEl.type === 'light' && (
                  <>
                    {/* --- Fixture Type Picker --- */}
                    <div className="pt-2">
                      <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1.5">Fixture Type</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { val: 'wall_light_3', label: 'Tube', icon: '▬' },
                          { val: 'wall_light_1', label: 'Square', icon: '■' },
                          { val: 'wall_light_2', label: 'Circle', icon: '●' },
                        ].map(opt => {
                          const isActive = (selectedEl.model || 'wall_light_1') === opt.val
                          return (
                            <button
                              key={opt.val}
                              onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, model: opt.val } : el))}
                              className={`flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg border text-[10px] font-bold transition-all ${isActive ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-md scale-105' : 'bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)] hover:border-[var(--lagoon)]'}`}
                            >
                              <span className="text-base leading-none">{opt.icon}</span>
                              <span>{opt.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* --- Color Palette --- */}
                    <div className="pt-2">
                      <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1.5">Light Color</label>
                      <div className="grid grid-cols-6 gap-1.5">
                        {[
                          { name: 'Warm White', hex: '#fff8e7' },
                          { name: 'Gold', hex: '#ffaa00' },
                          { name: 'Amber', hex: '#ff6600' },
                          { name: 'Cool White', hex: '#e8f4ff' },
                          { name: 'Sky Blue', hex: '#00aaff' },
                          { name: 'Cyber Blue', hex: '#00eeff' },
                          { name: 'Mint', hex: '#00ffcc' },
                          { name: 'Lime', hex: '#aaff00' },
                          { name: 'Rose', hex: '#ff6699' },
                          { name: 'Magenta', hex: '#ff00ff' },
                          { name: 'Violet', hex: '#9966ff' },
                          { name: 'Red', hex: '#ff2222' },
                        ].map(c => {
                          const isActive = (selectedEl.lightColor || '#fff8e7') === c.hex
                          return (
                            <button
                              key={c.hex}
                              onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, lightColor: c.hex } : el))}
                              title={c.name}
                              className={`aspect-square rounded-md border-2 transition-all ${isActive ? 'border-[var(--brand)] scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                              style={{ backgroundColor: c.hex }}
                            />
                          )
                        })}
                      </div>
                    </div>

                    {/* --- Luminosity Slider --- */}
                    <div className="pt-2">
                      <label htmlFor="light-intensity" className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1">
                        Luminosity <span className="font-normal opacity-60">({(selectedEl.intensity || 1.2).toFixed(1)})</span>
                      </label>
                      <input
                        id="light-intensity"
                        name="light-intensity"
                        type="range" min="0.1" max="5" step="0.1"
                        value={selectedEl.intensity || 1.2}
                        onChange={(e) => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, intensity: parseFloat(e.target.value) } : el))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: selectedEl.lightColor || '#ffaa00' }}
                      />
                      <div className="flex justify-between text-[9px] text-[var(--sea-ink-soft)] mt-0.5">
                        <span>Dim</span><span>Bright</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedEl.type === 'frame' && (
                  <div className="pt-2">
                    <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1">Frame Shape</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, shape: 'square' } : el))}
                        className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition ${selectedEl.shape === 'square' ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)]'}`}
                      >
                        Square
                      </button>
                      <button
                        onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, shape: 'circle' } : el))}
                        className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition ${selectedEl.shape === 'circle' ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)]'}`}
                      >
                        Circle
                      </button>
                    </div>
                  </div>
                )}

                {(selectedEl.type === 'banner' || selectedEl.type === 'frame') && (
                  <div className="pt-2">
                    <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1">Upload Graphic</label>
                    <div className="flex flex-col gap-2">
                      {selectedEl.url && (
                        <div className="relative group rounded-lg overflow-hidden border border-[var(--line)] h-20 bg-black/5">
                          <img src={selectedEl.url} className="w-full h-full object-contain" alt="Banner Preview" />
                          <button
                            onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, url: null } : el))}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                      <label className="cursor-pointer w-full py-2 rounded-lg bg-[var(--sand)] border border-[var(--line)] text-[10px] font-bold text-[var(--sea-ink)] text-center hover:bg-[var(--chip-bg)] hover:border-[var(--lagoon)] transition">
                        {selectedEl.url ? 'Replace Image' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (re) => {
                                setElements(prev => prev.map(el => el.id === selectedId ? { ...el, url: re.target?.result } : el))
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}

                <button onClick={() => { setElements(prev => prev.filter(el => el.id !== selectedId)); setSelectedId(null) }} className="w-full mt-1 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 text-xs font-bold hover:bg-red-100 transition">Delete Element</button>
              </div>
            </div>
          )}
          <div className="mt-auto pt-3 border-t border-[var(--line)]">
            <p className="text-[10px] text-[var(--sea-ink-soft)] leading-relaxed">
              <span className="font-bold block mb-0.5">Tips</span>
              Drag to move · Handles to resize · Snap: 0.1m · Del to remove
            </p>
          </div>
        </div>

        <div ref={containerRef} className="flex-1 relative bg-[#eceff4] overflow-hidden">
          {dimensions.width > 0 && dimensions.height > 0 && (
            <Stage width={dimensions.width} height={dimensions.height} scaleX={stageScale} scaleY={stageScale} x={stagePos.x} y={stagePos.y} onMouseDown={(e) => {
              if (e.target === e.target.getStage() || e.target.name() === 'wallBg') setSelectedId(null)
            }}>
              <Layer>
                <Rect name="wallBg" x={0} y={0} width={wallWidth} height={wallHeight} fill="#f8f9fb" stroke="#94a3b8" strokeWidth={2} shadowColor="rgba(0,0,0,0.15)" shadowBlur={24} shadowOffsetY={6} />
                {gridLines}
                <Line points={[0, 0, wallWidth, 0]} stroke="#64748b" strokeWidth={3} listening={false} />
                <Text x={5} y={4} text="▼ CEILING" fill="#94a3b8" fontSize={9} fontFamily="monospace" listening={false} />
                <Line points={[0, wallHeight, wallWidth, wallHeight]} stroke="#64748b" strokeWidth={3} listening={false} />
                <Text x={5} y={wallHeight - 14} text="▲ FLOOR" fill="#94a3b8" fontSize={9} fontFamily="monospace" listening={false} />

                <WallElements
                  elements={elements}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  onTransform={handleTransform}
                  onTransformEnd={handleTransformEnd}
                />

                {/* Live overlay labels layer - this updates via dragLabel state without re-rendering WallElements */}
                {elements.map(el => {
                  const isSelected = selectedId === el.id
                  const isActive = dragLabel?.id === el.id
                  const displayX = isActive ? dragLabel.x : el.x
                  const displayY = isActive ? dragLabel.y : el.y
                  const displayW = isActive ? dragLabel.width : el.width
                  const displayH = isActive ? dragLabel.height : el.height
                  const cfg = ELEMENT_TYPES[el.type] || {}

                  return (
                    <Group key={'overlay-' + el.id} listening={false}>
                      <Text x={displayX + 4} y={displayY + 4} text={`${cfg.emoji || ''} ${cfg.label || ''}`} fontSize={10} fontFamily="monospace" fill={isSelected ? '#0d7a75' : '#475569'} scaleX={1 / stageScale} scaleY={1 / stageScale} />
                      {(isSelected || isActive) && (
                        <Group>
                          {/* Horizontal measurement background */}
                          <Rect
                            x={displayX + displayW / 2 - 25} y={displayY - 20}
                            width={50} height={14}
                            fill="rgba(255,255,255,0.85)" cornerRadius={4}
                          />
                          <Text x={displayX + displayW / 2} y={displayY - 16} text={`${(displayW / PPM).toFixed(2)}m`} fontSize={10} fontFamily="monospace" fontStyle="bold" fill="#0d7a75" offsetX={(displayW / PPM).toFixed(2).length * 3.2} />

                          {/* Vertical measurement background */}
                          <Rect
                            x={displayX + displayW + 1} y={displayY + displayH / 2 - 25}
                            width={14} height={50}
                            fill="rgba(255,255,255,0.85)" cornerRadius={4}
                          />
                          <Text x={displayX + displayW + 5} y={displayY + displayH / 2} text={`${(displayH / PPM).toFixed(2)}m`} fontSize={10} fontFamily="monospace" fontStyle="bold" fill="#0d7a75" rotation={90} offsetY={4} />

                          <Text x={displayX} y={displayY + displayH + 5} text={`x:${(displayX / PPM).toFixed(2)}m  ${((wallHeight - displayY - displayH) / PPM).toFixed(2)}m from floor`} fontSize={9} fontFamily="monospace" fill="#64748b" />
                        </Group>
                      )}
                    </Group>
                  )
                })}

                <Transformer
                  ref={transformerRef}
                  keepRatio={false}
                  rotateEnabled={false}
                  padding={4}
                  anchorSize={10}
                  anchorCornerRadius={2}
                  borderStroke="#0d7a75"
                  anchorStroke="#0d7a75"
                  anchorFill="white"
                  boundBoxFunc={(oldBox, newBox) => {
                    if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox
                    return newBox
                  }}
                />
              </Layer>
            </Stage>
          )}
          <div className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-white/80 border border-[var(--line)] text-[10px] text-[var(--sea-ink-soft)] font-mono shadow-sm pointer-events-none select-none">
            Zoom {Math.round(stageScale * 100)}% · Grid 0.1m
          </div>
        </div>
      </div>
    </div>
  )
}
