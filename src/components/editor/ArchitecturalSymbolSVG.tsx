import React from 'react'

export interface SymbolThumbnailProps {
  category: string
  assetName: string
  className?: string
}

/**
 * Clean SVG Architectural Vector Thumbnails for the Sidebar Asset Library.
 * Matches SmartDraw's 2D symbol palette icons.
 */
export const ArchitecturalSymbolSVG: React.FC<SymbolThumbnailProps> = ({
  category = '',
  assetName = '',
  className = 'w-6 h-6'
}) => {
  const normCat = category.toLowerCase()
  const normName = assetName.toLowerCase()

  // 1. Kitchen / Appliance (Fridge, Stove, Oven)
  if (
    normCat.includes('kitchen') ||
    normName.includes('fridge') ||
    normName.includes('frigaro') ||
    normName.includes('frigidaire') ||
    normName.includes('oven') ||
    normName.includes('microwave')
  ) {
    if (normName.includes('fridge') || normName.includes('frigaro') || normName.includes('frigidaire')) {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="4" width="22" height="24" rx="2" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
          <line x1="5" y1="21" x2="27" y2="21" className="stroke-slate-700 dark:stroke-slate-300" strokeWidth="1.5" />
          <rect x="7" y="23" width="7" height="2" rx="0.5" className="fill-slate-700 dark:fill-slate-300" />
          <line x1="7" y1="7" x2="25" y2="7" strokeDasharray="2 2" className="stroke-slate-400" />
        </svg>
      )
    }
    if (normName.includes('oven') || normName.includes('atino') || normName.includes('insolita')) {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="4" width="24" height="24" rx="2" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
          <circle cx="11" cy="11" r="3.5" className="stroke-slate-700 dark:stroke-slate-300" />
          <circle cx="11" cy="11" r="1.5" className="fill-slate-500" />
          <circle cx="21" cy="11" r="2.8" className="stroke-slate-700 dark:stroke-slate-300" />
          <circle cx="21" cy="11" r="1.2" className="fill-slate-500" />
          <circle cx="11" cy="21" r="2.8" className="stroke-slate-700 dark:stroke-slate-300" />
          <circle cx="11" cy="21" r="1.2" className="fill-slate-500" />
          <circle cx="21" cy="21" r="3.5" className="stroke-slate-700 dark:stroke-slate-300" />
          <circle cx="21" cy="21" r="1.5" className="fill-slate-500" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="16" r="11" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
        <circle cx="16" cy="16" r="7" className="stroke-slate-400" strokeDasharray="2 2" />
      </svg>
    )
  }

  // 2. Sofas & Lounges
  if (normCat.includes('sofa') || normCat.includes('lounge')) {
    const isLong = normName.includes('ii') || normName.includes('iii') || normName.includes('format')
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="6" width="24" height="20" rx="3" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
        {/* Backrest */}
        <rect x="4" y="6" width="24" height="6" rx="2" className="fill-slate-200 dark:fill-slate-700 stroke-slate-700 dark:stroke-slate-300" />
        {/* Armrests */}
        <rect x="4" y="12" width="5" height="14" rx="1" className="fill-slate-200 dark:fill-slate-700 stroke-slate-700 dark:stroke-slate-300" />
        <rect x="23" y="12" width="5" height="14" rx="1" className="fill-slate-200 dark:fill-slate-700 stroke-slate-700 dark:stroke-slate-300" />
        {/* Cushion split */}
        {isLong ? (
          <line x1="16" y1="12" x2="16" y2="26" className="stroke-slate-400" />
        ) : null}
      </svg>
    )
  }

  // 3. Barstools & Stools
  if (normCat.includes('barstool') || normCat.includes('stool')) {
    const isSquare = normName.includes('cubo') || normName.includes('pomp')
    if (isSquare) {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="7" y="7" width="18" height="18" rx="2" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
          <rect x="10" y="10" width="12" height="12" rx="1" className="stroke-slate-400" strokeDasharray="2 2" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="16" r="10" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
        <circle cx="16" cy="16" r="6.5" className="stroke-slate-500 dark:stroke-slate-400" />
        <line x1="10" y1="10" x2="22" y2="10" className="stroke-slate-700 dark:stroke-slate-300" strokeWidth="2" />
      </svg>
    )
  }

  // 4. Chairs & Seating
  if (normCat.includes('chair')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Seat Pan */}
        <rect x="7" y="11" width="18" height="16" rx="3" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
        {/* Curved Backrest */}
        <path d="M6 13 C 6 6, 26 6, 26 13" className="stroke-slate-700 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" />
        <line x1="11" y1="19" x2="21" y2="19" className="stroke-slate-400" />
      </svg>
    )
  }

  // 5. Tables & Desks
  if (normCat.includes('table') || normCat.includes('office') || normName.includes('table') || normName.includes('desk')) {
    const isRound = normName.includes('ø') || normName.includes('rund') || normName.includes('round')
    if (isRound) {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="16" cy="16" r="11" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
          <circle cx="16" cy="16" r="8.5" className="stroke-slate-400" strokeDasharray="2 2" />
          <circle cx="16" cy="16" r="2" className="fill-slate-700 dark:fill-slate-300" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="7" width="24" height="18" rx="2" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
        <rect x="7" y="10" width="18" height="12" rx="1" className="stroke-slate-400" />
      </svg>
    )
  }

  // 6. Counters & Showcases
  if (normCat.includes('counter') || normCat.includes('showcase')) {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="7" width="24" height="18" rx="2" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
        <rect x="4" y="7" width="24" height="6" className="fill-slate-200 dark:fill-slate-700 stroke-slate-700 dark:stroke-slate-300" />
        <line x1="9" y1="8.5" x2="13" y2="11.5" className="stroke-slate-400" />
        <line x1="16" y1="13" x2="16" y2="25" className="stroke-slate-400" strokeDasharray="2 2" />
      </svg>
    )
  }

  // Fallback
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="6" width="20" height="20" rx="2" className="fill-slate-100 dark:fill-slate-800 stroke-slate-700 dark:stroke-slate-300" />
      <line x1="6" y1="6" x2="26" y2="26" className="stroke-slate-300 dark:stroke-slate-600" strokeDasharray="2 2" />
      <line x1="26" y1="6" x2="6" y2="26" className="stroke-slate-300 dark:stroke-slate-600" strokeDasharray="2 2" />
    </svg>
  )
}
