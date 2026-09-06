import React, { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Line, Transformer, Group, Text, Arc, Circle } from 'react-konva'
import { ArchitecturalSymbol2D } from './ArchitecturalSymbol2D'

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
  Electronics: { fill: 'rgba(14,165,233,0.15)', badge: '#0ea5e9', text: '#075985' },
}

const LetterMarkAsset = ({ shapeProps, onSelect, onChange, isDarkMode }: any) => {
  const label = shapeProps.label || shapeProps.assetName?.replace(/_/g, ' ') || 'Asset'
  const category = shapeProps.categoryFolder || shapeProps.category || shapeProps.src?.split('/')[2] || 'chairs'
  const palette = CATEGORY_PALETTE[category] || { fill: 'rgba(255,255,255,0.9)', badge: '#0ea5e9', text: '#0f172a' }
  const w = shapeProps.width
  const h = shapeProps.height

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
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY),
        })
      }}
    >
      {/* 2D Architectural Line-Art Symbol */}
      <ArchitecturalSymbol2D
        w={w}
        h={h}
        category={category}
        assetName={shapeProps.assetName}
        label={label}
        isDarkMode={isDarkMode}
        palette={{
          fill: palette.fill,
          stroke: '#1e293b',
          accent: palette.badge,
          text: palette.text
        }}
      />

      {/* Label: below object */}
      <Text
        x={-w * 0.2}
        y={h + 4}
        text={label}
        fontSize={Math.max(8, Math.min(10, w * 0.15))}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        fill={isDarkMode ? 'rgba(255,255,255,0.85)' : '#334155'}
        align="center"
        width={w * 1.4}
      />
    </Group>
  )
}

const WallShape = ({ shapeProps, isSelected, onSelect, onChange, isDarkMode }: any) => {
  const wallWidth = shapeProps.width || 100
  const wallThickness = shapeProps.thickness || 10
  const wallFill = shapeProps.fill || '#333333'
  const wallElements = shapeProps.wallElements || []
  const hasCutouts = wallElements.some((el: any) => el.type === 'door' || el.type === 'window')
  const rad = ((shapeProps.rotation || 0) * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  // Calculate non-overlapping wall segments around cutouts
  const segments = React.useMemo(() => {
    if (!hasCutouts) return [{ x: 0, w: wallWidth }]
    const sorted = [...wallElements]
      .filter((el: any) => el.type === 'door' || el.type === 'window')
      .sort((a, b) => a.x - b.x)
    
    const segs: { x: number; w: number }[] = []
    let curr = 0
    sorted.forEach((el: any) => {
      const start = Math.max(0, Math.min(wallWidth, el.x))
      const end = Math.max(0, Math.min(wallWidth, el.x + el.width))
      if (start > curr) {
        segs.push({ x: curr, w: start - curr })
      }
      curr = Math.max(curr, end)
    })
    if (curr < wallWidth) {
      segs.push({ x: curr, w: wallWidth - curr })
    }
    return segs
  }, [hasCutouts, wallElements, wallWidth])

  // Collect all visual intervals (segments + doors/windows) sorted for architectural dimension chains
  const dimensionIntervals = React.useMemo(() => {
    const list: { start: number; end: number; label: string; isOpening?: boolean }[] = []
    segments.forEach((seg) => {
      if (seg.w >= 10) {
        list.push({
          start: seg.x,
          end: seg.x + seg.w,
          label: `${(seg.w / 100).toFixed(2)}m`,
          isOpening: false
        })
      }
    })
    wallElements
      .filter((el: any) => el.type === 'door' || el.type === 'window')
      .forEach((el: any) => {
        list.push({
          start: el.x,
          end: el.x + el.width,
          label: `${(el.width / 100).toFixed(2)}m`,
          isOpening: true
        })
      })
    return list.sort((a, b) => a.start - b.start)
  }, [segments, wallElements])

  // Endpoint resizing and rotation drag handles
  // Handle start vertex (x=0)
  const handleStartHandleDragMove = (e: any) => {
    e.cancelBubble = true
    const node = e.target
    const dxLocal = node.x()
    // Constrain y to midline
    node.y(wallThickness / 2)

    const newWidth = Math.max(30, Math.round(wallWidth - dxLocal))
    const actualDx = wallWidth - newWidth

    const updatedWallElements = wallElements.map((wel: any) => ({
      ...wel,
      x: Math.max(0, Math.min(newWidth - wel.width, wel.x - actualDx))
    }))

    const shiftX = (actualDx / 2) * cos
    const shiftY = (actualDx / 2) * sin

    onChange({
      ...shapeProps,
      x: shapeProps.x + shiftX,
      y: shapeProps.y + shiftY,
      width: newWidth,
      wallElements: updatedWallElements,
      realWidth: Number((newWidth / 100).toFixed(2)),
      realDepth: Number(((shapeProps.thickness || 10) / 100).toFixed(2)),
      realHeight: Number((2.5 * (shapeProps.verticalScale || 1)).toFixed(2))
    })
  }

  const handleStartHandleDragEnd = (e: any) => {
    e.cancelBubble = true
    e.target.x(0)
    e.target.y(wallThickness / 2)
  }

  // Handle end vertex (x=wallWidth)
  const handleEndHandleDragMove = (e: any) => {
    e.cancelBubble = true
    const node = e.target
    const currentEndLocal = node.x()
    // Constrain y to midline
    node.y(wallThickness / 2)

    const minCutoutBoundary = wallElements.reduce((maxEdge: number, wel: any) => {
      return Math.max(maxEdge, (wel.x || 0) + (wel.width || 0) + 5)
    }, 30)

    const rawWidth = Math.max(minCutoutBoundary, Math.round(currentEndLocal))
    const actualDw = rawWidth - wallWidth

    const shiftX = (actualDw / 2) * cos
    const shiftY = (actualDw / 2) * sin

    onChange({
      ...shapeProps,
      x: shapeProps.x + shiftX,
      y: shapeProps.y + shiftY,
      width: rawWidth,
      realWidth: Number((rawWidth / 100).toFixed(2)),
      realDepth: Number(((shapeProps.thickness || 10) / 100).toFixed(2)),
      realHeight: Number((2.5 * (shapeProps.verticalScale || 1)).toFixed(2))
    })
  }

  const handleEndHandleDragEnd = (e: any) => {
    e.cancelBubble = true
    e.target.x(wallWidth)
    e.target.y(wallThickness / 2)
  }

  // Handle angle / rotation drag handle
  const handleRotateDragMove = (e: any) => {
    e.cancelBubble = true
    const stage = e.target.getStage()
    if (!stage) return
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    // Calculate angle in degrees from wall center (shapeProps.x, shapeProps.y)
    // Stage coordinates to canvas space
    const stageScale = stage.scaleX()
    const stageX = stage.x()
    const stageY = stage.y()

    const worldMouseX = (pointer.x - stageX) / stageScale
    const worldMouseY = (pointer.y - stageY) / stageScale

    const angleRad = Math.atan2(worldMouseY - shapeProps.y, worldMouseX - shapeProps.x)
    let deg = Math.round((angleRad * 180) / Math.PI)
    // Snap to 15-degree increments if close
    const snapThreshold = 4
    const snapMod = ((deg % 15) + 15) % 15
    if (snapMod < snapThreshold) {
      deg = deg - snapMod
    } else if (snapMod > 15 - snapThreshold) {
      deg = deg + (15 - snapMod)
    }

    onChange({
      ...shapeProps,
      rotation: deg
    })
  }

  const handleRotateDragEnd = (e: any) => {
    e.cancelBubble = true
    e.target.x(wallWidth / 2)
    e.target.y(-36)
  }

  // Slide a door or window along the wall with live preview
  const handleCutoutDragMove = (elId: string, e: any) => {
    e.cancelBubble = true
    const currentEl = wallElements.find((wel: any) => wel.id === elId)
    if (!currentEl) return

    const initialX = currentEl.x || 0
    const deltaX = e.target.x()
    
    // Reset the drag node's local position to prevent double-applying the drag offset
    // since the React state update will shift the actual rendered position.
    e.target.x(0)
    e.target.y(0)

    const rawX = initialX + deltaX
    const minX = 0
    const maxX = Math.max(0, wallWidth - currentEl.width)
    const clampedX = Math.max(minX, Math.min(maxX, Math.round(rawX)))

    const updatedWallElements = wallElements.map((wel: any) => {
      if (wel.id === elId) {
        return { ...wel, x: clampedX }
      }
      return wel
    })

    onChange({
      ...shapeProps,
      wallElements: updatedWallElements
    })
  }

  const handleCutoutDragEnd = (_elId: string, e: any) => {
    e.cancelBubble = true
    // Reset the node's local translate offset so it renders cleanly from the updated x in state
    e.target.x(0)
    e.target.y(0)
  }

  return (
    <Group
      name={shapeProps.name}
      x={shapeProps.x}
      y={shapeProps.y}
      rotation={shapeProps.rotation}
      offsetX={wallWidth / 2}
      offsetY={wallThickness / 2}
      draggable={true}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })
      }}
    >
      {/* Invisible broad hit box so wall is always easily selectable/draggable */}
      <Rect
        x={0}
        y={-10}
        width={wallWidth}
        height={wallThickness + 20}
        fill="transparent"
        hitStrokeWidth={24}
      />

      {/* Solid Wall Segments */}
      {segments.map((seg, idx) => (
        <Rect
          key={`seg-${idx}`}
          x={seg.x}
          y={0}
          width={seg.w}
          height={wallThickness}
          fill={wallFill}
          stroke={isSelected ? "#0d7a75" : (isDarkMode ? "rgba(255,255,255,0.25)" : "#1e293b")}
          strokeWidth={isSelected ? 1.5 : 1}
          opacity={shapeProps.opacity || 1}
          shadowColor={isSelected ? "#0d7a75" : undefined}
          shadowBlur={isSelected ? 6 : 0}
          shadowOpacity={0.3}
        />
      ))}

      {/* 2D Architectural Doors & Windows - Draggable along the wall */}
      {wallElements.map((el: any) => {
        const cutX = Math.max(0, el.x)
        const cutW = el.width
        const isDoor = el.type === 'door'
        const isWindow = el.type === 'window'

        if (isDoor) {
          const hingeLeft = (el.swingSide || 'right') === 'left'
          const swingInward = (el.swingDirection || 'inward') === 'inward'
          const hingeX = hingeLeft ? cutX : cutX + cutW
          const hingeY = swingInward ? wallThickness : 0
          const doorThickness = Math.max(3, wallThickness * 0.35)

          return (
            <Group
              key={`wel-${el.id}`}
              draggable
              dragBoundFunc={(pos) => pos}
              onDragMove={(e) => handleCutoutDragMove(el.id, e)}
              onDragEnd={(e) => handleCutoutDragEnd(el.id, e)}
              onClick={(e) => {
                e.cancelBubble = true
                onSelect()
              }}
            >
              {/* Sliding handle grip / hitzone */}
              <Rect
                x={cutX}
                y={-6}
                width={cutW}
                height={wallThickness + 12}
                fill="transparent"
                hitStrokeWidth={10}
              />

              {/* Door Jambs (End Caps) */}
              <Line
                points={[cutX, 0, cutX, wallThickness]}
                stroke={isDarkMode ? "rgba(255,255,255,0.4)" : "#475569"}
                strokeWidth={1.5}
              />
              <Line
                points={[cutX + cutW, 0, cutX + cutW, wallThickness]}
                stroke={isDarkMode ? "rgba(255,255,255,0.4)" : "#475569"}
                strokeWidth={1.5}
              />

              {/* Threshold Floor Line */}
              <Line
                points={[cutX, wallThickness / 2, cutX + cutW, wallThickness / 2]}
                stroke={isDarkMode ? "rgba(255,255,255,0.2)" : "#cbd5e1"}
                strokeWidth={1}
                dash={[3, 3]}
              />

              {/* Architectural 90° Swing Arc */}
              <Arc
                x={hingeX}
                y={hingeY}
                innerRadius={0}
                outerRadius={cutW}
                angle={90}
                rotation={
                  hingeLeft
                    ? (swingInward ? 0 : 270)
                    : (swingInward ? 90 : 180)
                }
                stroke={isDarkMode ? "#38bdf8" : "#0284c7"}
                strokeWidth={1.2}
                dash={[4, 3]}
                fill={isDarkMode ? "rgba(56, 189, 248, 0.08)" : "rgba(2, 132, 199, 0.06)"}
              />

              {/* Open Door Leaf Standing at 90° */}
              <Rect
                x={hingeLeft ? hingeX : hingeX - doorThickness}
                y={swingInward ? hingeY : hingeY - cutW}
                width={doorThickness}
                height={cutW}
                fill={el.color || "#b45309"}
                stroke="#78350f"
                strokeWidth={1}
                cornerRadius={1}
              />

              {/* Move Indicator badge if selected */}
              {isSelected && (
                <Group x={cutX + cutW / 2} y={wallThickness / 2}>
                  <Circle
                    radius={5}
                    fill="#0ea5e9"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                </Group>
              )}
            </Group>
          )
        }

        if (isWindow) {
          return (
            <Group
              key={`wel-${el.id}`}
              draggable
              dragBoundFunc={(pos) => pos}
              onDragMove={(e) => handleCutoutDragMove(el.id, e)}
              onDragEnd={(e) => handleCutoutDragEnd(el.id, e)}
              onClick={(e) => {
                e.cancelBubble = true
                onSelect()
              }}
            >
              {/* Window Hit Zone */}
              <Rect
                x={cutX}
                y={-6}
                width={cutW}
                height={wallThickness + 12}
                fill="transparent"
                hitStrokeWidth={10}
              />

              {/* Window Jamb Caps */}
              <Line
                points={[cutX, 0, cutX, wallThickness]}
                stroke={isDarkMode ? "rgba(255,255,255,0.6)" : "#1e293b"}
                strokeWidth={1.5}
              />
              <Line
                points={[cutX + cutW, 0, cutX + cutW, wallThickness]}
                stroke={isDarkMode ? "rgba(255,255,255,0.6)" : "#1e293b"}
                strokeWidth={1.5}
              />

              {/* Exterior/Interior Sill Frames */}
              <Line
                points={[cutX, 1.5, cutX + cutW, 1.5]}
                stroke={isDarkMode ? "rgba(255,255,255,0.4)" : "#64748b"}
                strokeWidth={1}
              />
              <Line
                points={[cutX, wallThickness - 1.5, cutX + cutW, wallThickness - 1.5]}
                stroke={isDarkMode ? "rgba(255,255,255,0.4)" : "#64748b"}
                strokeWidth={1}
              />

              {/* Architectural Glass Glazing Centerline */}
              <Line
                points={[cutX, wallThickness / 2, cutX + cutW, wallThickness / 2]}
                stroke="#0ea5e9"
                strokeWidth={2}
              />

              {/* Center point grab indicator when wall selected */}
              {isSelected && (
                <Group x={cutX + cutW / 2} y={wallThickness / 2}>
                  <Circle
                    radius={5}
                    fill="#0ea5e9"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                </Group>
              )}
            </Group>
          )
        }

        return null
      })}

      {/* Architectural Segment Dimension Chains */}
      {(isSelected || hasCutouts) && (
        <Group y={-24} opacity={isSelected ? 1 : 0.75}>
          {dimensionIntervals.map((interval, i) => {
            const intW = interval.end - interval.start
            const midX = interval.start + intW / 2
            const strokeColor = interval.isOpening
              ? (isDarkMode ? "#38bdf8" : "#0284c7")
              : (isDarkMode ? "#94a3b8" : "#475569")

            return (
              <Group key={`dim-${i}`}>
                {/* Witness lines */}
                <Line points={[interval.start, 6, interval.start, 18]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#cbd5e1"} strokeWidth={1} />
                <Line points={[interval.end, 6, interval.end, 18]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#cbd5e1"} strokeWidth={1} />
                {/* Dimension segment line */}
                <Line points={[interval.start, 12, interval.end, 12]} stroke={strokeColor} strokeWidth={1.2} dash={interval.isOpening ? [3, 2] : undefined} />
                {/* Architectural 45° ticks */}
                <Line points={[interval.start - 3, 15, interval.start + 3, 9]} stroke={strokeColor} strokeWidth={1.5} />
                <Line points={[interval.end - 3, 15, interval.end + 3, 9]} stroke={strokeColor} strokeWidth={1.5} />
                {/* Dimension badge */}
                {intW >= 18 && (
                  <Group x={midX} y={2}>
                    <Rect
                      x={-18}
                      y={0}
                      width={36}
                      height={14}
                      fill={isDarkMode ? "#0f172a" : "#ffffff"}
                      stroke={strokeColor}
                      strokeWidth={1}
                      cornerRadius={3}
                    />
                    <Text
                      x={-18}
                      y={2}
                      width={36}
                      text={interval.label}
                      fontSize={8.5}
                      fontFamily="monospace"
                      fontStyle="bold"
                      fill={strokeColor}
                      align="center"
                    />
                  </Group>
                )}
              </Group>
            )
          })}
        </Group>
      )}

      {/* Interactive SmartDraw-Style Vertex Handles & Rotation (Only shown when wall is selected) */}
      {isSelected && (
        <Group>
          {/* Rotation Stalk Line */}
          <Line
            points={[wallWidth / 2, 0, wallWidth / 2, -36]}
            stroke="#0d7a75"
            strokeWidth={1.5}
            dash={[3, 2]}
          />

          {/* Rotation Handle (Angle / Orientation control) */}
          <Group
            x={wallWidth / 2}
            y={-36}
            draggable
            dragBoundFunc={(pos) => pos}
            onDragMove={handleRotateDragMove}
            onDragEnd={handleRotateDragEnd}
            onMouseEnter={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'grab'
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'default'
            }}
          >
            <Circle
              radius={8}
              fill="#0d7a75"
              stroke="#ffffff"
              strokeWidth={2}
              shadowColor="#000000"
              shadowBlur={5}
              shadowOpacity={0.3}
            />
            {/* Small circular rotation icon/ring */}
            <Arc
              innerRadius={3.5}
              outerRadius={5}
              angle={270}
              fill="#ffffff"
              stroke="transparent"
            />
          </Group>

          {/* Start Vertex Handle (x = 0) */}
          <Circle
            x={0}
            y={wallThickness / 2}
            radius={7}
            fill="#ffffff"
            stroke="#0d7a75"
            strokeWidth={2.5}
            shadowColor="#000000"
            shadowBlur={4}
            shadowOpacity={0.25}
            draggable
            dragBoundFunc={(pos) => pos}
            onDragMove={handleStartHandleDragMove}
            onDragEnd={handleStartHandleDragEnd}
            onMouseEnter={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'ew-resize'
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'default'
            }}
          />

          {/* End Vertex Handle (x = wallWidth) */}
          <Circle
            x={wallWidth}
            y={wallThickness / 2}
            radius={7}
            fill="#ffffff"
            stroke="#0d7a75"
            strokeWidth={2.5}
            shadowColor="#000000"
            shadowBlur={4}
            shadowOpacity={0.25}
            draggable
            dragBoundFunc={(pos) => pos}
            onDragMove={handleEndHandleDragMove}
            onDragEnd={handleEndHandleDragEnd}
            onMouseEnter={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'ew-resize'
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage()
              if (stage) stage.container().style.cursor = 'default'
            }}
          />
        </Group>
      )}
    </Group>
  )
}


const ParametricStructureShape = ({ shapeProps, onSelect, onChange }: any) => {
  const isCaged = shapeProps.type === 'caged-wall' || shapeProps.type === 'caged-panel';
  const isRound = shapeProps.profile === 'round';
  
  return (
    <Group
      name={shapeProps.name}
      x={shapeProps.x}
      y={shapeProps.y}
      rotation={shapeProps.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })
      }}
      onTransform={(e) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        
        node.setAttrs({
          width: Math.max(5, shapeProps.width * scaleX),
          height: Math.max(5, shapeProps.height * scaleY),
          scaleX: 1,
          scaleY: 1
        })
      }}
      onTransformEnd={(e) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        
        node.scaleX(1)
        node.scaleY(1)
        
        const newWidth = Math.max(5, shapeProps.width * scaleX)
        const newHeight = Math.max(5, shapeProps.height * scaleY)
        
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: newWidth,
          height: newHeight,
          realWidth: Number((newWidth / 100).toFixed(2)),
          realDepth: Number((newHeight / 100).toFixed(2))
        })
      }}
    >
      {/* Background shape */}
      <Rect
        x={-shapeProps.width / 2}
        y={-shapeProps.height / 2}
        width={shapeProps.width}
        height={shapeProps.height}
        fill={isCaged ? 'transparent' : (shapeProps.fill || '#aaaaaa')}
        stroke={isCaged ? (shapeProps.fill || '#444') : undefined}
        strokeWidth={isCaged ? 2 : 0}
        dash={isCaged ? [5, 5] : undefined}
        cornerRadius={isRound ? Math.max(shapeProps.width, shapeProps.height) : 0}
      />
      {/* Pattern for caged wall */}
      {isCaged && (
        <Rect
          x={-shapeProps.width / 2 + 2}
          y={-shapeProps.height / 2 + 2}
          width={shapeProps.width - 4}
          height={shapeProps.height - 4}
          fill={shapeProps.fill || '#444'}
          opacity={0.3}
        />
      )}
    </Group>
  )
}

const Logo3DShape = ({ shapeProps, onSelect, onChange }: any) => {
  const w = shapeProps.width
  const h = shapeProps.height
  const [svgImg, setSvgImg] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (shapeProps.svgData) {
      const img = new window.Image()
      const blob = new Blob([shapeProps.svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      img.src = url
      img.onload = () => setSvgImg(img)
      return () => URL.revokeObjectURL(url)
    } else {
      setSvgImg(null)
    }
  }, [shapeProps.svgData])

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
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY),
        })
      }}
    >
      <Rect
        width={w} height={h}
        fill="rgba(13, 122, 117, 0.08)"
        stroke="#0d7a75"
        strokeWidth={1.5}
        cornerRadius={4}
      />
      {svgImg && (
        <Rect
          width={w * 0.9}
          height={h * 0.9}
          x={w * 0.05}
          y={h * 0.05}
          fillPatternImage={svgImg}
          fillPatternScaleX={(w * 0.9) / svgImg.width}
          fillPatternScaleY={(h * 0.9) / svgImg.height}
          fillPatternRepeat="no-repeat"
        />
      )}
      <Text
        y={h + 5}
        text="3D LOGO"
        fontSize={10}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        fill="#0d7a75"
        align="center"
        width={w}
      />
    </Group>
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
  const [isDarkMode, setIsDarkMode] = useState(false)

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
    
    // Check dark mode
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      observer.disconnect()
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
      const selectedObj = elements.find(el => el.id === selectedId)
      // Wall has its own SmartDraw-style interactive handles and sliding cutouts
      if (selectedObj?.type === 'wall') {
        transformerRef.current.nodes([])
        transformerRef.current.getLayer().batchDraw()
        return
      }

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
      y: snapToGrid(newProps.y),
      width: snapToGrid(newProps.width),
      height: snapToGrid(newProps.height)
    }

    const newElements = elements.slice()
    newElements[index] = snappedProps
    setElements(newElements)
  }

  const boothW = boothConfig.width * PPM
  const boothD = boothConfig.depth * PPM

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
      {hasMounted && dimensions.width > 0 && dimensions.height > 0 && (
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
            </Group>
            {/* Cardinal Directions */}
            <Group name="cardinalDirections" listening={false}>
              <Text
                x={boothW / 2 - 20}
                y={-70}
                text="N"
                fontSize={32}
                fontFamily="Inter, sans-serif"
                fontStyle="bold"
                fill={isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.1)"}
                align="center"
                width={40}
              />
              <Text
                x={boothW / 2 - 20}
                y={boothD + 45}
                text="S"
                fontSize={32}
                fontFamily="Inter, sans-serif"
                fontStyle="bold"
                fill={isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.1)"}
                align="center"
                width={40}
              />
              <Text
                x={-70}
                y={boothD / 2 - 16}
                text="W"
                fontSize={32}
                fontFamily="Inter, sans-serif"
                fontStyle="bold"
                fill={isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.1)"}
                align="center"
                width={40}
              />
              <Text
                x={boothW + 30}
                y={boothD / 2 - 16}
                text="E"
                fontSize={32}
                fontFamily="Inter, sans-serif"
                fontStyle="bold"
                fill={isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.1)"}
                align="center"
                width={40}
              />
            </Group>

            {/* Architectural Dimension Chains around Space Boundaries */}
            <Group name="architecturalDimensions">
              {/* North Dimension Line */}
              <Group>
                {/* Witness / Extension lines */}
                <Line points={[0, 0, 0, -32]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#94a3b8"} strokeWidth={1} />
                <Line points={[boothW, 0, boothW, -32]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#94a3b8"} strokeWidth={1} />
                {/* Main dimension line */}
                <Line points={[0, -24, boothW, -24]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={1.5} />
                {/* 45° Architectural Ticks */}
                <Line points={[-4, -20, 4, -28]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={2} />
                <Line points={[boothW - 4, -20, boothW + 4, -28]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={2} />
                {/* Dimension Label Tag */}
                <Rect
                  x={boothW / 2 - 28}
                  y={-34}
                  width={56}
                  height={18}
                  fill={isDarkMode ? "#0f172a" : "#ffffff"}
                  stroke={isDarkMode ? "#38bdf8" : "#0284c7"}
                  strokeWidth={1}
                  cornerRadius={4}
                />
                <Text
                  x={boothW / 2 - 28}
                  y={-31}
                  width={56}
                  text={`${boothConfig.width.toFixed(2)}m`}
                  fontSize={11}
                  fontFamily="monospace"
                  fontStyle="bold"
                  fill={isDarkMode ? "#38bdf8" : "#0284c7"}
                  align="center"
                />
              </Group>

              {/* South Dimension Line */}
              <Group>
                <Line points={[0, boothD, 0, boothD + 32]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#94a3b8"} strokeWidth={1} />
                <Line points={[boothW, boothD, boothW, boothD + 32]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#94a3b8"} strokeWidth={1} />
                <Line points={[0, boothD + 24, boothW, boothD + 24]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={1.5} />
                <Line points={[-4, boothD + 28, 4, boothD + 20]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={2} />
                <Line points={[boothW - 4, boothD + 28, boothW + 4, boothD + 20]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={2} />
                <Rect
                  x={boothW / 2 - 28}
                  y={boothD + 16}
                  width={56}
                  height={18}
                  fill={isDarkMode ? "#0f172a" : "#ffffff"}
                  stroke={isDarkMode ? "#38bdf8" : "#0284c7"}
                  strokeWidth={1}
                  cornerRadius={4}
                />
                <Text
                  x={boothW / 2 - 28}
                  y={boothD + 19}
                  width={56}
                  text={`${boothConfig.width.toFixed(2)}m`}
                  fontSize={11}
                  fontFamily="monospace"
                  fontStyle="bold"
                  fill={isDarkMode ? "#38bdf8" : "#0284c7"}
                  align="center"
                />
              </Group>

              {/* West Dimension Line */}
              <Group>
                <Line points={[0, 0, -32, 0]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#94a3b8"} strokeWidth={1} />
                <Line points={[0, boothD, -32, boothD]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#94a3b8"} strokeWidth={1} />
                <Line points={[-24, 0, -24, boothD]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={1.5} />
                <Line points={[-28, -4, -20, 4]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={2} />
                <Line points={[-28, boothD - 4, -20, boothD + 4]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={2} />
                <Rect
                  x={-34}
                  y={boothD / 2 - 14}
                  width={20}
                  height={56}
                  fill={isDarkMode ? "#0f172a" : "#ffffff"}
                  stroke={isDarkMode ? "#38bdf8" : "#0284c7"}
                  strokeWidth={1}
                  cornerRadius={4}
                />
                <Text
                  x={-21}
                  y={boothD / 2 - 14}
                  text={`${boothConfig.depth.toFixed(2)}m`}
                  fontSize={11}
                  fontFamily="monospace"
                  fontStyle="bold"
                  fill={isDarkMode ? "#38bdf8" : "#0284c7"}
                  rotation={90}
                  offsetX={-4}
                  offsetY={-4}
                />
              </Group>

              {/* East Dimension Line */}
              <Group>
                <Line points={[boothW, 0, boothW + 32, 0]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#94a3b8"} strokeWidth={1} />
                <Line points={[boothW, boothD, boothW + 32, boothD]} stroke={isDarkMode ? "rgba(255,255,255,0.25)" : "#94a3b8"} strokeWidth={1} />
                <Line points={[boothW + 24, 0, boothW + 24, boothD]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={1.5} />
                <Line points={[boothW + 20, -4, boothW + 28, 4]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={2} />
                <Line points={[boothW + 20, boothD - 4, boothW + 28, boothD + 4]} stroke={isDarkMode ? "#38bdf8" : "#0284c7"} strokeWidth={2} />
                <Rect
                  x={boothW + 14}
                  y={boothD / 2 - 14}
                  width={20}
                  height={56}
                  fill={isDarkMode ? "#0f172a" : "#ffffff"}
                  stroke={isDarkMode ? "#38bdf8" : "#0284c7"}
                  strokeWidth={1}
                  cornerRadius={4}
                />
                <Text
                  x={boothW + 27}
                  y={boothD / 2 - 14}
                  text={`${boothConfig.depth.toFixed(2)}m`}
                  fontSize={11}
                  fontFamily="monospace"
                  fontStyle="bold"
                  fill={isDarkMode ? "#38bdf8" : "#0284c7"}
                  rotation={90}
                  offsetX={-4}
                  offsetY={-4}
                />
              </Group>
            </Group>

            {/* Render Elements */}
            {elements.map((obj, i) => {
              if (obj.type === 'wall') {
                return (
                  <WallShape
                    key={obj.id}
                    shapeProps={{ ...obj, name: obj.id, fill: obj.material === 'custom_color' ? (obj.color || '#f0f0f0') : obj.fill }}
                    isSelected={obj.id === selectedId}
                    onSelect={() => onSelect(obj.id)}
                    onChange={(newProps: any) => handleDragEndAndSnap(i, newProps)}
                    isDarkMode={isDarkMode}
                  />
                )
              }
              if (['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(obj.type)) {
                return (
                  <ParametricStructureShape
                    key={obj.id}
                    shapeProps={{ ...obj, name: obj.id }}
                    onSelect={() => onSelect(obj.id)}
                    onChange={(newProps: any) => handleDragEndAndSnap(i, newProps)}
                  />
                )
              }
              if (['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(obj.type)) {
                return (
                  <ParametricStructureShape
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
                    isDarkMode={isDarkMode}
                  />
                )
              }

              if (obj.type === '3d_logo') {
                return (
                  <Logo3DShape
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
                let minW = 20
                let minH = 5

                if (selectedElement?.type === 'wall') {
                  const cutouts = (selectedElement.wallElements || []).filter((el: any) => el.type === 'door' || el.type === 'window')
                  if (cutouts.length > 0) {
                    // Wall cannot be resized smaller than the furthest edge of any door or window
                    const furthestEdge = cutouts.reduce((max: number, c: any) => Math.max(max, (c.x || 0) + (c.width || 0) + 10), 50)
                    minW = Math.max(minW, furthestEdge)
                  } else {
                    minW = 20
                  }
                }

                if (Math.abs(newBox.width) < minW || Math.abs(newBox.height) < minH) {
                  return oldBox
                }
                return newBox
              }}
              enabledAnchors={
                selectedElement?.type === 'wall'
                  ? ['middle-left', 'middle-right']
                  : selectedElement?.type === 'asset'
                  ? [] // Furniture assets cannot be resized
                  : ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']
              }
              keepRatio={selectedElement?.type === 'asset'}
              padding={selectedElement?.type === 'wall' ? 2 : 6}
              anchorSize={selectedElement?.type === 'wall' ? 8 : 12}
              anchorCornerRadius={3}
              borderStroke="#0d7a75"
              borderStrokeWidth={2}
              anchorStroke="#0d7a75"
              anchorFill="white"
              anchorStrokeWidth={2}
              rotateEnabled={true}
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
