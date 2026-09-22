import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Stage, Layer, Rect, Text, Transformer, Line, Group, Circle } from 'react-konva'
import { X, Save, Layers, ChevronsUp, ChevronsDown } from 'lucide-react'
import { getCachedImage } from '../../lib/imageCache'
import { saveWallImageDataUrl, getWallImageDataUrl } from '../../lib/customAssetDB'
import ColorPickerPanel from './ColorPickerPanel'

// Sub-component for the actual wall elements to prevent re-renders during transformation/drag labels
const WallElements = React.memo(({ elements, activeSide, selectedId, onSelect, onDragMove, onDragEnd, onTransform, onTransformEnd }: any) => {
  const ELEMENT_TYPES: Record<string, any> = {
    door: { color: 'rgba(139,100,60,0.35)', stroke: '#7c5c3a' },
    window: { color: 'rgba(100,200,255,0.35)', stroke: '#00BFFF' },
    shelf: { color: 'rgba(180,120,60,0.5)', stroke: '#a0522d' },
    banner: { color: 'rgba(80,120,255,0.35)', stroke: '#4a6aff' },
    frame: { color: 'rgba(255,255,255,0.4)', stroke: '#444444' },
    light: { color: 'rgba(255,255,0,0.4)', stroke: '#FFD700', model: 'wall_light_1' },
    paint: { color: '#0ea5e9', stroke: '#0284c7' },
    diagonal_paint: { color: '#ec4899', stroke: '#db2777' },
  }

  const [images, setImages] = useState<Record<string, HTMLImageElement>>({})

  useEffect(() => {
    elements.forEach((el: any) => {
      if ((el.type === 'banner' || el.type === 'frame' || el.type === 'paint') && el.url && !images[el.url]) {
        getCachedImage(el.url, (img) => {
          setImages(prev => ({ ...prev, [el.url]: img }))
        });
      }
    })
  }, [elements])

  return (
    <>
      {elements.map((el: any, i: number) => {
        const isCutout = el.type === 'door' || el.type === 'window'
        const elSide = el.side || 'front'
        if (!isCutout && elSide !== activeSide) return null

        const cfg = ELEMENT_TYPES[el.type] || ELEMENT_TYPES.window
        const isSelected = selectedId === el.id
        const hasImage = (el.type === 'banner' || el.type === 'frame' || el.type === 'paint') && el.url && images[el.url]
        const patternImg = hasImage ? images[el.url] : undefined
        
        // Light color handling
        const lightFill = el.type === 'light' ? (el.lightColor || '#fff8e7') : (el.color || cfg.color)
        const lightOpacity = el.type === 'light' ? 0.6 : (el.opacity ?? 1.0)

        // Diagonal Paint rendering
        if (el.type === 'diagonal_paint') {
          const dir = el.direction || 'top-left' // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
          let points: number[] = [0, 0, el.width, 0, 0, el.height]
          if (dir === 'top-right') points = [0, 0, el.width, 0, el.width, el.height]
          else if (dir === 'bottom-left') points = [0, 0, 0, el.height, el.width, el.height]
          else if (dir === 'bottom-right') points = [el.width, 0, 0, el.height, el.width, el.height]

          const rot = el.rotation || 0

          return (
            <Group
              key={el.id}
              id={'el-' + el.id}
              x={el.x + el.width / 2}
              y={el.y + el.height / 2}
              offsetX={el.width / 2}
              offsetY={el.height / 2}
              rotation={rot}
              width={el.width}
              height={el.height}
              draggable
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
              onTransform={(e) => onTransform(i, e)}
              onTransformEnd={(e) => onTransformEnd(i, e)}
            >
              <Line
                points={points}
                closed
                fill={el.color || cfg.color}
                opacity={el.opacity ?? 1.0}
                stroke={isSelected ? '#0d7a75' : cfg.stroke}
                strokeWidth={isSelected ? 2.5 : 1}
                shadowEnabled={isSelected}
                shadowColor="#0d7a75"
                shadowBlur={10}
                shadowOpacity={0.4}
              />
              <Text
                x={el.width * 0.15}
                y={el.height * 0.4}
                text="DIAGONAL ACCENT"
                fontSize={9}
                fontFamily="monospace"
                fontStyle="bold"
                fill="rgba(255,255,255,0.85)"
                listening={false}
              />
            </Group>
          )
        }

        if ((el.type === 'frame' && el.shape === 'circle') || (el.type === 'light' && el.model === 'wall_light_2')) {
          return (
            <Circle
              key={el.id}
              id={'el-' + el.id}
              x={el.x + el.width / 2}
              y={el.y + el.height / 2}
              radius={Math.min(el.width, el.height) / 2}
              fill={hasImage ? undefined : lightFill}
              opacity={lightOpacity}
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
            fill={hasImage ? undefined : lightFill}
            opacity={lightOpacity}
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
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front')
  const [dragLabel, setDragLabel] = useState<any | null>(null)

  // On open, restore any banner/frame data URLs from IndexedDB
  // (they are stripped from localStorage/cloud to avoid quota/payload issues,
  //  but saved to IDB by idbKey when the image is first uploaded)
  useEffect(() => {
    let cancelled = false;
    const restoreImages = async () => {
      const updated = await Promise.all(
        (wall.wallElements || []).map(async (el: any) => {
          if (el.idbKey && !el.url) {
            const dataUrl = await getWallImageDataUrl(el.idbKey);
            if (dataUrl && !cancelled) return { ...el, url: dataUrl };
          }
          return el;
        })
      );
      if (!cancelled) setElements(updated);
    };
    restoreImages();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wall.id]);

  const containerRef = useRef<HTMLDivElement>(null)
  const transformerRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [stageScale, setStageScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })

  const PPM = 100
  const SNAP = 10 // 0.1m snap grid
  const wallWidth = wall.width // pixels
  const actualHeightMeters = 2.5 * (wall.verticalScale || 1)
  const wallHeight = actualHeightMeters * PPM

  const ELEMENT_TYPES: Record<string, any> = {
    door: { label: 'Door', emoji: '🚪', defaultW: 0.9, defaultH: 2.0, defaultY: 'floor' },
    window: { label: 'Window', emoji: '🪟', defaultW: 1.2, defaultH: 1.0, defaultY: 'mid' },
    shelf: { label: 'Shelf', emoji: '📦', defaultW: 1.0, defaultH: 0.1, defaultY: 'mid' },
    paint: { label: 'Paint Inset', emoji: '🎨', defaultW: 1.2, defaultH: 1.5, defaultY: 'mid' },
    diagonal_paint: { label: 'Diagonal Split', emoji: '📐', defaultW: 1.5, defaultH: 2.5, defaultY: 'floor' },
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
  }, [selectedId, elements, activeSide])

  const snap = (v: number) => Math.round(v / SNAP) * SNAP
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))

  const handleAdd = (type: string) => {
    const cfg = ELEMENT_TYPES[type]
    const w = cfg.defaultW * PPM
    const h = cfg.defaultH * PPM
    let y = wallHeight / 2 - h / 2
    if (cfg.defaultY === 'floor') y = wallHeight - h
    if (cfg.defaultY === 'top') y = 0.1 * PPM
    const lightProps = type === 'light' ? {
      lightColor: '#fff8e7',
      intensity: 1.2,
      model: 'wall_light_1'
    } : {}

    const isCutout = ['door', 'window'].includes(type)
    setElements(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      side: isCutout ? 'both' : activeSide,
      x: snap(wallWidth / 2 - w / 2),
      y: snap(y),
      width: w,
      height: h,
      shape: cfg.shape || 'square',
      ...lightProps
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
    const baseW = node.width ? node.width() : el.width
    const baseH = node.height ? node.height() : el.height
    setDragLabel({
      id: el.id,
      x: node.x(),
      y: node.y(),
      width: Math.abs(baseW * (node.scaleX?.() ?? 1)),
      height: Math.abs(baseH * (node.scaleY?.() ?? 1))
    })
  }

  const handleTransformEnd = (index: number, e: any) => {
    const node = e.target
    const el = elements[index]
    const scaleX = node.scaleX ? node.scaleX() : 1
    const scaleY = node.scaleY ? node.scaleY() : 1
    const baseW = (node.width && typeof node.width === 'function') ? node.width() : el.width
    const baseH = (node.height && typeof node.height === 'function') ? node.height() : el.height
    if (node.scaleX) node.scaleX(1)
    if (node.scaleY) node.scaleY(1)

    const rawW = (baseW || el.width) * Math.abs(scaleX)
    const rawH = (baseH || el.height) * Math.abs(scaleY)
    const newW = Math.max(10, snap(rawW))
    const newH = Math.max(10, snap(rawH))
    if (node.width && typeof node.width === 'function') node.width(newW)
    if (node.height && typeof node.height === 'function') node.height(newH)

    const nx = clamp(snap(node.x()), 0, wallWidth - newW)
    const ny = clamp(snap(node.y()), 0, wallHeight - newH)

    const newElements = [...elements]
    newElements[index] = { ...el, x: nx, y: ny, width: newW, height: newH }
    setElements(newElements)
    setDragLabel(null)
  }

  const moveLayer = (dir: 'top' | 'up' | 'down' | 'bottom') => {
    if (!selectedId) return
    const idx = elements.findIndex(el => el.id === selectedId)
    if (idx === -1) return
    const newElements = [...elements]
    const [item] = newElements.splice(idx, 1)
    if (dir === 'top') {
      newElements.push(item)
    } else if (dir === 'bottom') {
      newElements.unshift(item)
    } else if (dir === 'up') {
      newElements.splice(Math.min(newElements.length, idx + 1), 0, item)
    } else if (dir === 'down') {
      newElements.splice(Math.max(0, idx - 1), 0, item)
    }
    setElements(newElements)
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
    <div className="flex flex-col h-full w-full">
      <div className="h-16 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-[var(--sea-ink)]">Wall Elevation Editor</h2>
          <span className="text-[10px] font-mono bg-[var(--sand)] border border-[var(--line)] px-2 py-1 rounded text-[var(--sea-ink-soft)]">
            {(wallWidth / PPM).toFixed(1)}m × {actualHeightMeters.toFixed(1)}m
          </span>
        </div>

        {/* Face Switcher: Front (Interior) vs Back (Exterior) */}
        <div className="flex items-center bg-[var(--sand)] p-1 rounded-xl border border-[var(--line)] shadow-inner">
          <button
            onClick={() => { setActiveSide('front'); setSelectedId(null) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSide === 'front'
                ? 'bg-[var(--brand)] text-white shadow-sm'
                : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
            }`}
          >
            <span>◨</span> Front Face (Interior)
          </button>
          <button
            onClick={() => { setActiveSide('back'); setSelectedId(null) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSide === 'back'
                ? 'bg-[var(--brand)] text-white shadow-sm'
                : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
            }`}
          >
            <span>◧</span> Back Face (Exterior)
          </button>
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
          <p className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest mb-1">Add to Wall ({activeSide === 'front' ? 'Front' : 'Back'})</p>
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
                {/* Face Selector for Decorations */}
                {!['door', 'window'].includes(selectedEl.type) && (
                  <div className="pb-1">
                    <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1">Wall Face</label>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => {
                          setElements(prev => prev.map(el => el.id === selectedId ? { ...el, side: 'front' } : el))
                        }}
                        className={`py-1 px-2 rounded-lg border text-[10px] font-bold transition ${
                          (selectedEl.side || 'front') === 'front'
                            ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                            : 'bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)]'
                        }`}
                      >
                        Front
                      </button>
                      <button
                        onClick={() => {
                          setElements(prev => prev.map(el => el.id === selectedId ? { ...el, side: 'back' } : el))
                        }}
                        className={`py-1 px-2 rounded-lg border text-[10px] font-bold transition ${
                          selectedEl.side === 'back'
                            ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                            : 'bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)]'
                        }`}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
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

                {(selectedEl.type === 'door' || selectedEl.type === 'window' || selectedEl.type === 'shelf' || selectedEl.type === 'paint' || selectedEl.type === 'diagonal_paint') && (
                  <div className="pt-2">
                    <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1">
                      {selectedEl.type === 'paint' || selectedEl.type === 'diagonal_paint' ? 'Paint Color' : 'Color'}
                    </label>
                    <ColorPickerPanel
                      initialColor={selectedEl.color || (selectedEl.type === 'diagonal_paint' ? '#ec4899' : selectedEl.type === 'paint' ? '#0ea5e9' : ELEMENT_TYPES[selectedEl.type]?.stroke || '#ffffff')}
                      onChange={(c) => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, color: c } : el))}
                    />
                  </div>
                )}

                {/* Diagonal direction picker */}
                {/* Diagonal direction picker & rotation */}
                {selectedEl.type === 'diagonal_paint' && (
                  <div className="pt-2 space-y-2">
                    <div>
                      <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1">Diagonal Split Corner</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'top-left', label: 'Top-Left ◤' },
                          { id: 'top-right', label: 'Top-Right ◥' },
                          { id: 'bottom-left', label: 'Bottom-Left ◣' },
                          { id: 'bottom-right', label: 'Bottom-Right ◢' },
                        ].map(dir => (
                          <button
                            key={dir.id}
                            onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, direction: dir.id } : el))}
                            className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition ${
                              (selectedEl.direction || 'top-left') === dir.id
                                ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                                : 'bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)] hover:border-[var(--lagoon)]'
                            }`}
                          >
                            {dir.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold">Rotation ({selectedEl.rotation || 0}°)</label>
                        <button
                          type="button"
                          onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, rotation: ((el.rotation || 0) + 90) % 360 } : el))}
                          className="text-[10px] text-[var(--lagoon-deep)] font-bold hover:underline flex items-center gap-1"
                        >
                          ↻ Rotate +90°
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {[0, 90, 180, 270].map(deg => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, rotation: deg } : el))}
                            className={`py-1 px-1 rounded-lg border text-[10px] font-bold text-center transition ${
                              (selectedEl.rotation || 0) === deg
                                ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                                : 'bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)] hover:border-[var(--lagoon)]'
                            }`}
                          >
                            {deg}°
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Opacity slider for paint */}
                {(selectedEl.type === 'paint' || selectedEl.type === 'diagonal_paint') && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold">
                        Paint Opacity ({Math.round((selectedEl.opacity ?? 1) * 100)}%)
                      </label>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={selectedEl.opacity ?? 1}
                      onChange={(e) => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, opacity: parseFloat(e.target.value) } : el))}
                      className="w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)] cursor-pointer"
                    />
                  </div>
                )}

                {selectedEl.type === 'door' && (
                  <div className="pt-2">
                    <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1">Door Swing Direction</label>
                    <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                      <button
                        onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, swingSide: (el.swingSide || 'right') === 'right' ? 'left' : 'right' } : el))}
                        className="py-1.5 px-2 rounded-lg border border-[var(--line)] bg-[var(--sand)] text-[10px] font-bold text-[var(--sea-ink)] hover:border-[var(--brand)] transition"
                      >
                        Hinge: {(selectedEl.swingSide || 'right') === 'right' ? 'Right ⮞' : '⮜ Left'}
                      </button>
                      <button
                        onClick={() => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, swingDirection: (el.swingDirection || 'inward') === 'inward' ? 'outward' : 'inward' } : el))}
                        className="py-1.5 px-2 rounded-lg border border-[var(--line)] bg-[var(--sand)] text-[10px] font-bold text-[var(--sea-ink)] hover:border-[var(--brand)] transition"
                      >
                        Swing: {(selectedEl.swingDirection || 'inward') === 'inward' ? 'Inward ⮟' : 'Outward ⮝'}
                      </button>
                    </div>
                  </div>
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

                {(selectedEl.type === 'banner' || selectedEl.type === 'frame' || selectedEl.type === 'paint') && (
                  <div className="pt-2">
                    <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1">
                      {selectedEl.type === 'paint' ? 'Custom Mural / Texture' : 'Upload Graphic'}
                    </label>
                    <div className="flex flex-col gap-2">
                      {selectedEl.url && (
                        <div className="relative group rounded-lg overflow-hidden border border-[var(--line)] h-20 bg-black/5">
                          <img src={selectedEl.url} className="w-full h-full object-contain" alt="Preview" />
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
                                const img = new Image()
                                img.onload = () => {
                                  const canvas = document.createElement('canvas')
                                  const MAX_SIZE = 800
                                  let width = img.width
                                  let height = img.height

                                  if (width > height) {
                                    if (width > MAX_SIZE) {
                                      height *= MAX_SIZE / width
                                      width = MAX_SIZE
                                    }
                                  } else {
                                    if (height > MAX_SIZE) {
                                      width *= MAX_SIZE / height
                                      height = MAX_SIZE
                                    }
                                  }

                                  canvas.width = width
                                  canvas.height = height
                                  const ctx = canvas.getContext('2d')
                                  if (ctx) {
                                    ctx.drawImage(img, 0, 0, width, height)
                                    const isPng = file.type.includes('png') || file.name.toLowerCase().endsWith('.png')
                                    const mime = isPng ? 'image/png' : 'image/jpeg'
                                    const dataUrl = canvas.toDataURL(mime, isPng ? undefined : 0.8)
                                    // Save full data URL to IndexedDB so it survives page reload
                                    // Store a stable key on the element; the data URL itself is stripped
                                    // from localStorage and cloud saves to avoid quota/payload limits.
                                    const idbKey = `wel_${selectedId}_${Date.now()}`
                                    saveWallImageDataUrl(idbKey, dataUrl)
                                    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, url: dataUrl, idbKey } : el))
                                  }
                                }
                                img.src = re.target?.result as string
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Layer Ordering (Front / Back) */}
                <div className="pt-2">
                  <label className="text-[10px] text-[var(--sea-ink-soft)] font-bold flex items-center gap-1 mb-1">
                    <Layers className="w-3 h-3 text-[var(--lagoon)]" /> Layer Position
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => moveLayer('top')}
                      title="Bring to Front"
                      className="py-2 px-2 bg-[var(--sand)] hover:bg-[var(--chip-bg)] border border-[var(--line)] rounded-lg flex items-center justify-center gap-1.5 text-[10px] font-bold text-[var(--sea-ink)] transition cursor-pointer"
                    >
                      <ChevronsUp className="w-3.5 h-3.5 text-[var(--brand)]" />
                      Bring to Front
                    </button>
                    <button
                      onClick={() => moveLayer('bottom')}
                      title="Send to Back"
                      className="py-2 px-2 bg-[var(--sand)] hover:bg-[var(--chip-bg)] border border-[var(--line)] rounded-lg flex items-center justify-center gap-1.5 text-[10px] font-bold text-[var(--sea-ink)] transition cursor-pointer"
                    >
                      <ChevronsDown className="w-3.5 h-3.5 text-[var(--sea-ink-soft)]" />
                      Send to Back
                    </button>
                  </div>
                </div>

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
                <Rect name="wallBg" x={0} y={0} width={wallWidth} height={wallHeight} fill={wall.fill || "#f8f9fb"} stroke="#94a3b8" strokeWidth={2} shadowColor="rgba(0,0,0,0.15)" shadowBlur={24} shadowOffsetY={6} />
                {gridLines}
                <Line points={[0, 0, wallWidth, 0]} stroke="#64748b" strokeWidth={3} listening={false} />
                <Text x={5} y={4} text="▼ CEILING" fill="#94a3b8" fontSize={9} fontFamily="monospace" listening={false} />
                <Line points={[0, wallHeight, wallWidth, wallHeight]} stroke="#64748b" strokeWidth={3} listening={false} />
                <Text x={5} y={wallHeight - 14} text="▲ FLOOR" fill="#94a3b8" fontSize={9} fontFamily="monospace" listening={false} />

                <WallElements
                  elements={elements}
                  activeSide={activeSide}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  onTransform={handleTransform}
                  onTransformEnd={handleTransformEnd}
                />

                {/* Live overlay labels layer - this updates via dragLabel state without re-rendering WallElements */}
                {elements.map(el => {
                  const isCutout = el.type === 'door' || el.type === 'window'
                  const elSide = el.side || 'front'
                  if (!isCutout && elSide !== activeSide) return null

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
