import React, { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Line, Transformer, Group, Text } from 'react-konva'

export interface BoothConfig {
  width: number;
  depth: number;
  wallThickness: number;
  walls: { north: boolean; south: boolean; east: boolean; west: boolean };
}

interface CanvasProps {
  elements: any[]
  setElements: (elements: any[]) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  boothConfig: BoothConfig
  gridVisible: boolean
}

// Color palette matching sidebar categories
const CATEGORY_PALETTE: Record<string, { fill: string; badge: string; text: string }> = {
  Fixtures: { fill: 'rgba(245,158,11,0.15)', badge: '#f59e0b', text: '#78350f' },
  Chairs: { fill: 'rgba(99,102,241,0.15)', badge: '#6366f1', text: '#312e81' },
  Bar_Chairs: { fill: 'rgba(168,85,247,0.15)', badge: '#a855f7', text: '#4c1d95' },
  Tables: { fill: 'rgba(6,182,212,0.15)', badge: '#06b6d4', text: '#164e63' },
  Round_Tables: { fill: 'rgba(16,185,129,0.15)', badge: '#10b981', text: '#064e3b' },
  Info_Desks: { fill: 'rgba(244,63,94,0.15)', badge: '#f43f5e', text: '#881337' },
}

const getInitials = (label: string) =>
  label.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

const LetterMarkAsset = ({ shapeProps, onSelect, onChange }: any) => {
  const label = shapeProps.assetName?.replace(/_/g, ' ') || 'Asset'
  const category = shapeProps.src?.split('/')[2] || 'Fixtures'
  const palette = CATEGORY_PALETTE[category] || CATEGORY_PALETTE.Fixtures
  const initials = getInitials(label)
  const w = shapeProps.width
  const h = shapeProps.height
  const badgeSize = Math.min(w, h) * 0.45
  // In group-local space, (0,0) is the tile top-left, (w,h) is bottom-right
  const badgeCX = w / 2
  const badgeCY = h * 0.38

  return (
    <Group
      name={shapeProps.name}
      x={shapeProps.x}
      y={shapeProps.y}
      width={w}
      height={h}
      rotation={shapeProps.rotation}
      offsetX={w / 2}
      offsetY={h / 2}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e: any) => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e: any) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        node.scaleX(1)
        node.scaleY(1)
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(10, w * scaleX),
          height: Math.max(10, h * scaleY),
        })
      }}
    >
      {/* Background tile: fills (0,0)→(w,h) in group-local space */}
      <Rect
        x={0} y={0}
        width={w} height={h}
        fill={palette.fill}
        stroke={palette.badge}
        strokeWidth={1.5}
        cornerRadius={6}
      />
      {/* Badge: centered at (badgeCX, badgeCY) in local space */}
      <Rect
        x={badgeCX} y={badgeCY}
        width={badgeSize} height={badgeSize}
        offsetX={badgeSize / 2} offsetY={badgeSize / 2}
        fill={palette.badge}
        cornerRadius={badgeSize * 0.25}
        opacity={0.9}
      />
      {/* Initials text: same center as badge */}
      <Text
        x={badgeCX - badgeSize / 2}
        y={badgeCY - badgeSize / 2}
        text={initials}
        fontSize={badgeSize * 0.42}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        fill="white"
        align="center"
        verticalAlign="middle"
        width={badgeSize}
        height={badgeSize}
      />
      {/* Label: below badge */}
      <Text
        x={0}
        y={h * 0.72}
        text={label}
        fontSize={Math.max(8, Math.min(10, w * 0.15))}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        fill={palette.text}
        align="center"
        width={w}
      />
    </Group>
  )
}

const WallShape = ({ shapeProps, onSelect, onChange }: any) => {
  return (
    <Rect
      name={shapeProps.name}
      x={shapeProps.x}
      y={shapeProps.y}
      width={shapeProps.width}
      height={shapeProps.thickness || 10}
      rotation={shapeProps.rotation}
      fill={shapeProps.fill}
      opacity={shapeProps.opacity}
      offsetX={shapeProps.width / 2}
      offsetY={(shapeProps.thickness || 10) / 2}
      draggable={!shapeProps.isOuter}
      hitStrokeWidth={20}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })
      }}
      onTransformEnd={(e) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        node.scaleX(1)
        node.scaleY(1)
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        })
      }}
    />
  )
}

export default function Canvas({ elements, setElements, selectedId, onSelect, boothConfig, gridVisible }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const transformerRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [stageScale, setStageScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  const PPM = 100 // 100px = 1 Metre
  const gridSnapSize = 50 // 0.5m visual grid (50px)
  const fineSnapSize = 10 // 0.1m snapping interval (10px)

  useEffect(() => {
    setHasMounted(true)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Control' || e.key === 'Meta') setIsSpacePressed(true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Control' || e.key === 'Meta') setIsSpacePressed(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !hasMounted) return

    const updateDimensions = () => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      const h = containerRef.current.offsetHeight
      setDimensions({ width: w, height: h })

      // Auto-fit 80% Scale calculation
      const boothPixelW = boothConfig.width * PPM
      const boothPixelH = boothConfig.depth * PPM
      const scaleX = (w * 0.8) / boothPixelW
      const scaleY = (h * 0.8) / boothPixelH
      const idealScale = Math.min(scaleX, scaleY, 1.5)

      setStageScale(idealScale)
      setStagePos({
        x: (w - boothPixelW * idealScale) / 2,
        y: (h - boothPixelH * idealScale) / 2,
      })
    }

    // Use ResizeObserver so Stage updates whenever the container resizes
    // (e.g. when panels are toggled, not just window resize)
    const observer = new ResizeObserver(() => {
      updateDimensions()
    })
    observer.observe(containerRef.current)
    updateDimensions() // Initial measurement

    return () => observer.disconnect()
  }, [hasMounted, boothConfig])

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const stage = transformerRef.current.getStage()
      const selectedNode = stage.findOne(`.${selectedId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
      } else {
        transformerRef.current.nodes([])
      }
      transformerRef.current.getLayer().batchDraw()
    } else if (transformerRef.current) {
      transformerRef.current.nodes([])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [selectedId, elements])

  const handleWheel = (e: any) => {
    e.evt.preventDefault()
    const scaleBy = 1.05
    const stage = e.target.getStage()
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy

    setStageScale(newScale)
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    })
  }

  const handleDragEndAndSnap = (index: number, newProps: any) => {
    const snapToGrid = (pos: number) => {
      if (!gridVisible) return pos
      // Snap to fineSnapSize intervals for precise placement
      return Math.round(pos / fineSnapSize) * fineSnapSize
    }

    const snappedProps = {
      ...newProps,
      x: snapToGrid(newProps.x),
      y: snapToGrid(newProps.y)
    }

    const newElements = elements.slice()
    newElements[index] = snappedProps
    setElements(newElements)
  }

  const boothW = boothConfig.width * PPM
  const boothD = boothConfig.depth * PPM

  const boundaryLines = [
    { dir: 'north', points: [0, 0, boothW, 0], isOpen: !boothConfig.walls.north, labelX: boothW / 2, labelY: -20, dim: boothConfig.width },
    { dir: 'east', points: [boothW, 0, boothW, boothD], isOpen: !boothConfig.walls.east, labelX: boothW + 20, labelY: boothD / 2, dim: boothConfig.depth, rotate: 90 },
    { dir: 'south', points: [boothW, boothD, 0, boothD], isOpen: !boothConfig.walls.south, labelX: boothW / 2, labelY: boothD + 20, dim: boothConfig.width },
    { dir: 'west', points: [0, boothD, 0, 0], isOpen: !boothConfig.walls.west, labelX: -20, labelY: boothD / 2, dim: boothConfig.depth, rotate: -90 },
  ]

  // Draw huge visual grid (1m x 1m)
  const gridLines = []
  if (gridVisible) {
    const vSize = 4000
    const offset = 1000
    const subStep = 20 // 0.1m subdivisions

    for (let i = -offset; i <= vSize / subStep; i++) {
      const isMajor = (i * subStep) % gridSnapSize === 0
      gridLines.push(
        <Line
          key={`v-${i}`}
          points={[i * subStep, -offset * subStep, i * subStep, vSize]}
          stroke={isMajor ? "rgba(23, 58, 64, 0.3)" : "rgba(23, 58, 64, 0.15)"}
          strokeWidth={isMajor ? 1.5 : 1}
        />
      )
    }
    for (let j = -offset; j <= vSize / subStep; j++) {
      const isMajor = (j * subStep) % gridSnapSize === 0
      gridLines.push(
        <Line
          key={`h-${j}`}
          points={[-offset * subStep, j * subStep, vSize, j * subStep]}
          stroke={isMajor ? "rgba(23, 58, 64, 0.3)" : "rgba(23, 58, 64, 0.15)"}
          strokeWidth={isMajor ? 1.5 : 1}
        />
      )
    }
  }

  const selectedElement = elements.find(el => el.id === selectedId)

  return (
    <div ref={containerRef} className="flex-1 bg-[var(--bg-base)] overflow-hidden relative cursor-crosshair">
      {hasMounted && (
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          draggable={isSpacePressed}
          onWheel={handleWheel}
          onDragEnd={(e) => {
            if (e.target === e.target.getStage()) {
              setStagePos({ x: e.target.x(), y: e.target.y() })
            }
          }}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage() || e.target.name() === 'floorBg') {
              onSelect(null)
            }
          }}
        >
          <Layer>
            {gridLines}

            {/* Booth Floor Area */}
            <Group name="boothBoundaries">
              <Rect
                name="floorBg"
                x={0}
                y={0}
                width={boothW}
                height={boothD}
                fill="rgba(255,255,255,0.3)"
                shadowColor="rgba(0,0,0,0.1)"
                shadowBlur={40}
              />

              {boundaryLines.map((line) => (
                <React.Fragment key={line.dir}>
                  {line.isOpen && (
                    <Line
                      points={line.points}
                      stroke="rgba(23,58,64,0.3)"
                      strokeWidth={2}
                      dash={[10, 10]}
                    />
                  )}
                  <Text
                    x={line.labelX}
                    y={line.labelY}
                    text={`${line.dim}m`}
                    fontSize={16}
                    fontFamily="monospace"
                    fill="var(--sea-ink)"
                    fontStyle="bold"
                    offset={{ x: 20, y: 10 }}
                    rotation={line.rotate || 0}
                    opacity={0.6}
                  />
                </React.Fragment>
              ))}
            </Group>

            {/* Render Elements */}
            {elements.map((obj, i) => {
              if (obj.type === 'wall') {
                return (
                  <WallShape
                    key={obj.id}
                    shapeProps={{ ...obj, name: obj.id }}
                    onSelect={() => onSelect(obj.id)}
                    onChange={(newProps: any) => handleDragEndAndSnap(i, newProps)}
                  />
                )
              }
              if (obj.type === 'asset') {
                return (
                  <LetterMarkAsset
                    key={obj.id}
                    shapeProps={{ ...obj, name: obj.id }}
                    onSelect={() => onSelect(obj.id)}
                    onChange={(newProps: any) => handleDragEndAndSnap(i, newProps)}
                  />
                )
              }
              return null
            })}

            {/* Transformer */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox
                return newBox
              }}
              enabledAnchors={
                selectedElement?.type === 'wall'
                  ? ['middle-left', 'middle-right']
                  : ['top-left', 'top-right', 'bottom-left', 'bottom-right']
              }
              keepRatio={selectedElement?.type === 'asset'}
              padding={6}
              anchorSize={12}
              anchorCornerRadius={3}
              borderStroke="#0d7a75"
              borderStrokeWidth={2}
              anchorStroke="#0d7a75"
              anchorFill="white"
              anchorStrokeWidth={2}
              rotateEnabled={!selectedElement?.isOuter}
              rotateAnchorOffset={40}
              rotateAnchorCursor="crosshair"
            />
          </Layer>
        </Stage>
      )}

      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider shadow-sm flex items-center gap-2">
          <span>Zoom: {Math.round(stageScale * 100)}%</span>
          <div className="w-px h-3 bg-[var(--line)]" />
          <span>Pan: Space+Drag</span>
        </div>
      </div>
    </div>
  )
}
