import React from 'react'
import { Group, Rect, Circle, Line } from 'react-konva'

export interface SymbolRenderProps {
  w: number
  h: number
  category?: string
  assetName?: string
  label?: string
  isDarkMode?: boolean
  palette?: { fill: string; stroke: string; accent: string; text: string }
}

/**
 * Architectural 2D Top-Down Vector Symbols (SmartDraw / Floorplan style)
 * Renders crisp architectural line-art with real-world proportions:
 * - Sofas & Lounges: outer casing, backrest cushion bar, side armrests, cushion split dividers
 * - Chairs: curved backrest arc, ergonomic seat pad
 * - Stools & Barstools: circular / rounded seat with swivel stem or cross-bracing
 * - Tables & Desks: perimeter edge, inner bevel, workspace partition lines, round pedestals
 * - Counters & Showcases: display glass area, front service lip, register / divider line
 * - Kitchen & Appliances: fridge doors with handle indent, stove burners, oven controls, sinks
 */
export const ArchitecturalSymbol2D: React.FC<SymbolRenderProps> = ({
  w,
  h,
  category = 'chairs',
  assetName = '',
  label = '',
  isDarkMode = false,
  palette
}) => {

  // 2D generic symbols are procedurally drawn facing South (downwards).
  // They ALL require a static 180° rotation to face North — no per-asset logic needed.
  return (
    <Group x={w / 2} y={h / 2} rotation={180} offsetX={w / 2} offsetY={h / 2}>
      <ArchitecturalSymbolContent
        w={w}
        h={h}
        category={category}
        assetName={assetName}
        label={label}
        isDarkMode={isDarkMode}
        palette={palette}
      />
    </Group>
  )
}

const ArchitecturalSymbolContent: React.FC<SymbolRenderProps> = ({
  w,
  h,
  category = 'chairs',
  assetName = '',
  label = '',
  isDarkMode = false,
  palette
}) => {
  const normCat = category.toLowerCase()
  const normName = (assetName + ' ' + label).toLowerCase()

  // Base colors for architectural blueprint rendering
  const strokeColor = palette?.stroke || (isDarkMode ? '#e2e8f0' : '#1e293b')
  const fillInner = isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.95)'
  const fillAccent = palette?.accent ? `${palette.accent}25` : (isDarkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(241, 245, 249, 0.95)')
  const strokeLight = isDarkMode ? '#64748b' : '#94a3b8'
  const strokeBold = 1.5
  const strokeThin = 1.0

  // 1. KITCHEN & UTILITY / APPLIANCES (Fridge, Oven, Sink, Microwave)
  if (
    normCat.includes('kitchen') ||
    normName.includes('fridge') ||
    normName.includes('frigaro') ||
    normName.includes('frigidaire') ||
    normName.includes('oven') ||
    normName.includes('microwave')
  ) {
    const isFridge = normName.includes('fridge') || normName.includes('frigaro') || normName.includes('frigidaire')
    const isOven = normName.includes('oven') || normName.includes('atino') || normName.includes('insolita')

    if (isFridge) {
      // Refrigerator with top-down door swing lip and dual compartment divider
      const doorDepth = Math.max(4, h * 0.15)
      return (
        <Group>
          {/* Main body */}
          <Rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill={fillInner}
            stroke={strokeColor}
            strokeWidth={strokeBold}
            cornerRadius={2}
          />
          {/* Back coils / cooling vent */}
          <Line
            points={[2, 4, w - 2, 4]}
            stroke={strokeLight}
            strokeWidth={strokeThin}
            dash={[2, 2]}
          />
          {/* Main front door line */}
          <Line
            points={[0, h - doorDepth, w, h - doorDepth]}
            stroke={strokeColor}
            strokeWidth={strokeBold}
          />
          {/* Handle notch */}
          <Rect
            x={w * 0.1}
            y={h - doorDepth + 1}
            width={w * 0.3}
            height={Math.max(2, doorDepth * 0.4)}
            fill={strokeColor}
            cornerRadius={1}
          />
        </Group>
      )
    }

    if (isOven) {
      // Cooktop / Stove with 4 round burners
      const r1 = Math.min(w, h) * 0.14
      const r2 = Math.min(w, h) * 0.11
      return (
        <Group>
          <Rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill={fillInner}
            stroke={strokeColor}
            strokeWidth={strokeBold}
            cornerRadius={2}
          />
          {/* Burner 1 (Top Left) */}
          <Circle x={w * 0.3} y={h * 0.32} radius={r1} stroke={strokeColor} strokeWidth={strokeThin} />
          <Circle x={w * 0.3} y={h * 0.32} radius={r1 * 0.4} fill={strokeLight} />
          {/* Burner 2 (Top Right) */}
          <Circle x={w * 0.7} y={h * 0.32} radius={r2} stroke={strokeColor} strokeWidth={strokeThin} />
          <Circle x={w * 0.7} y={h * 0.32} radius={r2 * 0.4} fill={strokeLight} />
          {/* Burner 3 (Bottom Left) */}
          <Circle x={w * 0.3} y={h * 0.72} radius={r2} stroke={strokeColor} strokeWidth={strokeThin} />
          <Circle x={w * 0.3} y={h * 0.72} radius={r2 * 0.4} fill={strokeLight} />
          {/* Burner 4 (Bottom Right) */}
          <Circle x={w * 0.7} y={h * 0.72} radius={r1} stroke={strokeColor} strokeWidth={strokeThin} />
          <Circle x={w * 0.7} y={h * 0.72} radius={r1 * 0.4} fill={strokeLight} />
          {/* Front control panel line */}
          <Line points={[0, h * 0.88, w, h * 0.88]} stroke={strokeLight} strokeWidth={strokeThin} />
        </Group>
      )
    }

    // Generic Kitchen Utility (Trashbin/Pushboy or Counter unit)
    const isRoundUtility = normName.includes('pushboy') || normName.includes('arona') || normName.includes('acri')
    if (isRoundUtility) {
      const radius = Math.min(w, h) / 2 - 1
      return (
        <Group>
          <Circle x={w / 2} y={h / 2} radius={radius} fill={fillInner} stroke={strokeColor} strokeWidth={strokeBold} />
          <Circle x={w / 2} y={h / 2} radius={radius * 0.7} stroke={strokeLight} strokeWidth={strokeThin} />
        </Group>
      )
    }
  }

  // 2. SOFAS & LOUNGES (Armchairs, Multi-seater sofas, Daybeds)
  if (normCat.includes('sofa') || normCat.includes('lounge') || normName.includes('sofa') || normName.includes('couch')) {
    const isMultiSeater = w / h >= 1.4 // wide aspect ratio = 2 or 3-seater sofa
    const isExtraWide = w / h >= 2.2 // large sectional or 3-seater
    const backDepth = Math.max(5, h * 0.24)
    const armWidth = Math.max(5, Math.min(w * 0.16, 18))

    return (
      <Group>
        {/* Outer sofa chassis */}
        <Rect
          x={0}
          y={0}
          width={w}
          height={h}
          fill={fillAccent}
          stroke={strokeColor}
          strokeWidth={strokeBold}
          cornerRadius={4}
        />

        {/* Backrest bar across the top */}
        <Rect
          x={0}
          y={0}
          width={w}
          height={backDepth}
          fill={fillInner}
          stroke={strokeColor}
          strokeWidth={strokeBold}
          cornerRadius={[4, 4, 0, 0]}
        />

        {/* Left Armrest */}
        <Rect
          x={0}
          y={backDepth}
          width={armWidth}
          height={h - backDepth}
          fill={fillInner}
          stroke={strokeColor}
          strokeWidth={strokeThin}
          cornerRadius={[0, 0, 0, 3]}
        />

        {/* Right Armrest */}
        <Rect
          x={w - armWidth}
          y={backDepth}
          width={armWidth}
          height={h - backDepth}
          fill={fillInner}
          stroke={strokeColor}
          strokeWidth={strokeThin}
          cornerRadius={[0, 0, 3, 0]}
        />

        {/* Cushion Area */}
        <Rect
          x={armWidth}
          y={backDepth}
          width={w - armWidth * 2}
          height={h - backDepth}
          fill={fillInner}
          stroke={strokeLight}
          strokeWidth={strokeThin}
        />

        {/* Cushion split lines */}
        {isExtraWide ? (
          <>
            {/* 3 cushions */}
            <Line
              points={[armWidth + (w - armWidth * 2) * 0.333, backDepth, armWidth + (w - armWidth * 2) * 0.333, h]}
              stroke={strokeColor}
              strokeWidth={strokeThin}
            />
            <Line
              points={[armWidth + (w - armWidth * 2) * 0.666, backDepth, armWidth + (w - armWidth * 2) * 0.666, h]}
              stroke={strokeColor}
              strokeWidth={strokeThin}
            />
          </>
        ) : isMultiSeater ? (
          /* 2 cushions */
          <Line
            points={[w / 2, backDepth, w / 2, h]}
            stroke={strokeColor}
            strokeWidth={strokeThin}
          />
        ) : (
          /* 1 armchair seat detail: front cushion stitch curve */
          <Line
            points={[armWidth + 3, h - 3, w - armWidth - 3, h - 3]}
            stroke={strokeLight}
            strokeWidth={strokeThin}
          />
        )}
      </Group>
    )
  }

  // 3. BARSTOOLS & HIGH CHAIRS (Round or square compact stools)
  if (normCat.includes('barstool') || normCat.includes('stool')) {
    const isRound = !normName.includes('cubo') && !normName.includes('pomp')
    if (isRound) {
      const radius = Math.min(w, h) / 2 - 2
      return (
        <Group>
          {/* Base / footrest outer ring */}
          <Circle
            x={w / 2}
            y={h / 2}
            radius={radius}
            fill={fillAccent}
            stroke={strokeColor}
            strokeWidth={strokeBold}
          />
          {/* Center seat cushion */}
          <Circle
            x={w / 2}
            y={h / 2}
            radius={radius * 0.72}
            fill={fillInner}
            stroke={strokeColor}
            strokeWidth={strokeThin}
          />
          {/* Small backrest bar if swivel stool */}
          <Line
            points={[w / 2 - radius * 0.6, h / 2 - radius * 0.5, w / 2 + radius * 0.6, h / 2 - radius * 0.5]}
            stroke={strokeColor}
            strokeWidth={2}
          />
        </Group>
      )
    } else {
      // Square stool (Cubo, Pomp)
      return (
        <Group>
          <Rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill={fillInner}
            stroke={strokeColor}
            strokeWidth={strokeBold}
            cornerRadius={3}
          />
          <Rect
            x={w * 0.15}
            y={h * 0.15}
            width={w * 0.7}
            height={h * 0.7}
            stroke={strokeLight}
            strokeWidth={strokeThin}
            dash={[2, 2]}
            cornerRadius={2}
          />
        </Group>
      )
    }
  }

  // 4. CHAIRS & SEATING (Office, Conference, Dining, Lounge Chairs)
  if (normCat.includes('chair')) {
    const isRoundish = normName.includes('swan') || normName.includes('egg') || normName.includes('catifa')
    const backArcHeight = Math.max(4, h * 0.25)

    return (
      <Group>
        {/* Main Seat Pan */}
        <Rect
          x={w * 0.1}
          y={backArcHeight * 0.6}
          width={w * 0.8}
          height={h - backArcHeight * 0.6 - 2}
          fill={fillInner}
          stroke={strokeColor}
          strokeWidth={strokeBold}
          cornerRadius={isRoundish ? Math.min(w, h) * 0.25 : 4}
        />

        {/* Curved Backrest Arc */}
        <Line
          points={[w * 0.08, backArcHeight, w * 0.3, 2, w * 0.7, 2, w * 0.92, backArcHeight]}
          stroke={strokeColor}
          strokeWidth={strokeBold + 0.5}
          tension={0.4}
        />

        {/* Seat cushion inner crease / stitch */}
        <Line
          points={[w * 0.25, h * 0.6, w * 0.75, h * 0.6]}
          stroke={strokeLight}
          strokeWidth={strokeThin}
        />
      </Group>
    )
  }

  // 5. TABLES & DESKS (Conference, Coffee, Dining, Bistro, Bar Tables)
  if (normCat.includes('table') || normCat.includes('office') || normCat.includes('desk') || normName.includes('table') || normName.includes('desk')) {
    const isRound = normName.includes('ø') || normName.includes('rund') || normName.includes('round') || Math.abs(w - h) < 4 && !normName.includes('lang')

    if (isRound) {
      const radius = Math.min(w, h) / 2 - 1
      return (
        <Group>
          {/* Table Top Circle */}
          <Circle
            x={w / 2}
            y={h / 2}
            radius={radius}
            fill={fillInner}
            stroke={strokeColor}
            strokeWidth={strokeBold}
          />
          {/* Inset decorative / bevel ring */}
          <Circle
            x={w / 2}
            y={h / 2}
            radius={radius * 0.85}
            stroke={strokeLight}
            strokeWidth={strokeThin}
          />
          {/* Center pedestal point */}
          <Circle
            x={w / 2}
            y={h / 2}
            radius={Math.max(2, radius * 0.12)}
            fill={strokeColor}
          />
        </Group>
      )
    }

    // Rectangular / Conference / Desk
    const isDesk = normName.includes('desk') || normName.includes('schreibtisch') || normCat.includes('office')
    return (
      <Group>
        {/* Table Top Surface */}
        <Rect
          x={0}
          y={0}
          width={w}
          height={h}
          fill={fillInner}
          stroke={strokeColor}
          strokeWidth={strokeBold}
          cornerRadius={3}
        />
        {/* Inset chamfer line */}
        <Rect
          x={3}
          y={3}
          width={Math.max(2, w - 6)}
          height={Math.max(2, h - 6)}
          stroke={strokeLight}
          strokeWidth={strokeThin}
          cornerRadius={1}
        />
        {isDesk && (
          // Cable grommet / user-side drawer indicator
          <Circle
            x={w * 0.85}
            y={h * 0.25}
            radius={Math.min(w, h) * 0.08}
            stroke={strokeColor}
            strokeWidth={strokeThin}
            fill={fillAccent}
          />
        )}
      </Group>
    )
  }

  // 6. COUNTERS & SHOWCASES (Displays, Info Desks, Vitrines)
  if (normCat.includes('counter') || normCat.includes('showcase') || normName.includes('theke') || normName.includes('vitrine')) {
    const isCurved = normName.includes('round') || normName.includes('bogen')
    const glassDepth = Math.max(4, h * 0.28)

    return (
      <Group>
        {/* Main Base Body */}
        <Rect
          x={0}
          y={0}
          width={w}
          height={h}
          fill={fillInner}
          stroke={strokeColor}
          strokeWidth={strokeBold}
          cornerRadius={isCurved ? [Math.min(w, h) * 0.3, Math.min(w, h) * 0.3, 2, 2] : 2}
        />
        {/* Display / Showcase Glass Window or Counter Top Shelf */}
        <Rect
          x={0}
          y={0}
          width={w}
          height={glassDepth}
          fill={fillAccent}
          stroke={strokeColor}
          strokeWidth={strokeThin}
        />
        {/* Diagonal glass reflection lines */}
        <Line
          points={[w * 0.2, 2, w * 0.35, glassDepth - 2]}
          stroke={strokeLight}
          strokeWidth={strokeThin}
        />
        <Line
          points={[w * 0.28, 2, w * 0.43, glassDepth - 2]}
          stroke={strokeLight}
          strokeWidth={strokeThin}
        />
        {/* Staff/Counter divider shelf line */}
        <Line
          points={[w * 0.5, glassDepth, w * 0.5, h]}
          stroke={strokeLight}
          strokeWidth={strokeThin}
          dash={[3, 3]}
        />
      </Group>
    )
  }

  // DEFAULT / FALLBACK: Clean architectural equipment symbol with cross-center and corner chamfers
  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={fillInner}
        stroke={strokeColor}
        strokeWidth={strokeBold}
        cornerRadius={2}
      />
      <Line
        points={[3, 3, w - 3, h - 3]}
        stroke={strokeLight}
        strokeWidth={0.75}
        dash={[4, 4]}
      />
      <Line
        points={[w - 3, 3, 3, h - 3]}
        stroke={strokeLight}
        strokeWidth={0.75}
        dash={[4, 4]}
      />
    </Group>
  )
}
