import { ArchitecturalSymbolSVG } from './ArchitecturalSymbolSVG'

export function BoothIllustration() {
  return (
    <svg
      viewBox="0 0 320 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto' }}
      className="text-slate-800 dark:text-slate-200"
    >
      <defs>
        <pattern id="grid-p" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1"/>
          <path d="M 0 20 L 20 20" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1"/>
        </pattern>
      </defs>

      {/* Background with Theme colors */}
      <rect width="320" height="380" className="fill-slate-50 dark:fill-slate-950" rx="12"/>
      
      {/* Grid */}
      <rect width="320" height="380" fill="url(#grid-p)" rx="12"/>

      {/* Blueprint Dimension Lines */}
      {/* Top Outer Dimension */}
      <g className="stroke-sky-500 fill-sky-500 font-sans text-[10px] font-bold">
        <line x1="30" y1="40" x2="290" y2="40" strokeWidth="1.5"/>
        <line x1="30" y1="35" x2="30" y2="45" strokeWidth="1.5"/>
        <line x1="290" y1="35" x2="290" y2="45" strokeWidth="1.5"/>
        <rect x="135" y="32" width="50" height="16" rx="4" className="fill-slate-50 dark:fill-slate-900 stroke-sky-500" strokeWidth="1"/>
        <text x="160" y="44" textAnchor="middle">4.10m</text>
      </g>
      
      {/* Left Outer Dimension */}
      <g className="stroke-sky-500 fill-sky-500 font-sans text-[10px] font-bold">
        <line x1="10" y1="60" x2="10" y2="340" strokeWidth="1.5"/>
        <line x1="5" y1="60" x2="15" y2="60" strokeWidth="1.5"/>
        <line x1="5" y1="340" x2="15" y2="340" strokeWidth="1.5"/>
        <rect x="2" y="175" width="16" height="50" rx="4" className="fill-slate-50 dark:fill-slate-900 stroke-sky-500" strokeWidth="1"/>
        <text x="10" y="200" textAnchor="middle" transform="rotate(-90, 10, 200)">5.50m</text>
      </g>

      {/* Door Width Dimension (Inner) */}
      <g className="stroke-sky-400/80 fill-sky-500/80 font-sans text-[8px] font-semibold">
        <line x1="295" y1="170" x2="295" y2="230" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="292" y1="170" x2="298" y2="170" strokeWidth="1"/>
        <line x1="292" y1="230" x2="298" y2="230" strokeWidth="1"/>
        <text x="302" y="200" textAnchor="middle" transform="rotate(-90, 302, 200)">0.90m</text>
      </g>

      {/* Window Width Dimension (Inner) */}
      <g className="stroke-sky-400/80 fill-sky-500/80 font-sans text-[8px] font-semibold">
        <line x1="22" y1="160" x2="22" y2="220" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="19" y1="160" x2="25" y2="160" strokeWidth="1"/>
        <line x1="19" y1="220" x2="25" y2="220" strokeWidth="1"/>
        <text x="17" y="190" textAnchor="middle" transform="rotate(-90, 17, 190)">1.20m</text>
      </g>

      {/* Room Inner Dimension (Horizontal) */}
      <g className="stroke-slate-400/50 fill-slate-500/80 font-sans text-[8px] font-medium">
        <line x1="40" y1="325" x2="280" y2="325" strokeWidth="1" />
        <line x1="40" y1="322" x2="40" y2="328" strokeWidth="1"/>
        <line x1="280" y1="322" x2="280" y2="328" strokeWidth="1"/>
        <text x="160" y="321" textAnchor="middle">3.80m</text>
      </g>

      {/* Architectural Walls */}
      <g className="stroke-slate-700 dark:stroke-slate-400 fill-slate-100 dark:fill-slate-800" strokeWidth="1.5">
        {/* Top Wall */}
        <rect x="30" y="50" width="260" height="10" />
        
        {/* Left Wall (Split for Window) */}
        <rect x="30" y="60" width="10" height="100" />
        <rect x="30" y="220" width="10" height="120" />
        
        {/* Right Wall (Split for Door) */}
        <rect x="280" y="60" width="10" height="110" />
        <rect x="280" y="230" width="10" height="110" />
      </g>

      {/* Window */}
      <g className="stroke-sky-400" strokeWidth="2">
        <line x1="32" y1="160" x2="32" y2="220" />
        <line x1="38" y1="160" x2="38" y2="220" />
        <line x1="30" y1="160" x2="40" y2="160" strokeWidth="1.5" className="stroke-slate-700 dark:stroke-slate-400"/>
        <line x1="30" y1="220" x2="40" y2="220" strokeWidth="1.5" className="stroke-slate-700 dark:stroke-slate-400"/>
      </g>

      {/* Door Swing */}
      <g className="stroke-sky-600 dark:stroke-sky-400">
        {/* Door Fill */}
        <path d="M 280 230 L 220 230 A 60 60 0 0 1 280 170 Z" fill="rgba(14,165,233,0.1)" stroke="none" />
        {/* Door Arc Line */}
        <path d="M 220 230 A 60 60 0 0 1 280 170" fill="none" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* Door Panel */}
        <line x1="220" y1="230" x2="280" y2="230" strokeWidth="4" className="stroke-amber-700 dark:stroke-amber-600" strokeLinecap="round" />
        <line x1="280" y1="170" x2="290" y2="170" strokeWidth="1.5" className="stroke-slate-700 dark:stroke-slate-400"/>
      </g>

      {/* Furniture Symbols using ArchitecturalSymbolSVG via nested SVG */}
      <g className="text-[7.5px] font-sans font-semibold fill-slate-700 dark:fill-slate-300" textAnchor="middle">
        
        {/* TV on the left wall */}
        <g transform="translate(30, 90)">
          {/* Mount */}
          <rect x="0" y="15" width="4" height="20" className="fill-slate-400" />
          {/* Screen Profile */}
          <rect x="4" y="0" width="6" height="50" rx="2" className="fill-slate-800 dark:fill-slate-200" />
          {/* Screen glow */}
          <rect x="10" y="5" width="2" height="40" className="fill-sky-400 opacity-80" />
        </g>
        <text x="60" y="118">85" TV</text>

        {/* Conference Table */}
        <g transform="translate(160, 160)">
          <svg x="-60" y="-40" width="120" height="80">
            <ArchitecturalSymbolSVG category="table" assetName="table" className="w-full h-full text-slate-800 dark:text-slate-200" />
          </svg>
          <text x="0" y="2" className="fill-slate-500/70 text-[6.5px] font-medium tracking-widest">CONF. TABLE</text>
        </g>

        {/* Top Chair (tucked in) */}
        <g transform="translate(160, 112) rotate(180)">
          <svg x="-16" y="-16" width="32" height="32">
            <ArchitecturalSymbolSVG category="chairs" assetName="catifa" className="w-full h-full text-slate-800 dark:text-slate-200" />
          </svg>
        </g>

        {/* Bottom Chair (tucked in) */}
        <g transform="translate(160, 208) rotate(0)">
          <svg x="-16" y="-16" width="32" height="32">
            <ArchitecturalSymbolSVG category="chairs" assetName="catifa" className="w-full h-full text-slate-800 dark:text-slate-200" />
          </svg>
        </g>

        {/* Left Chair (tucked in) */}
        <g transform="translate(100, 160) rotate(90)">
          <svg x="-16" y="-16" width="32" height="32">
            <ArchitecturalSymbolSVG category="chairs" assetName="catifa" className="w-full h-full text-slate-800 dark:text-slate-200" />
          </svg>
        </g>

        {/* Right Chair (tucked in) */}
        <g transform="translate(220, 160) rotate(-90)">
          <svg x="-16" y="-16" width="32" height="32">
            <ArchitecturalSymbolSVG category="chairs" assetName="catifa" className="w-full h-full text-slate-800 dark:text-slate-200" />
          </svg>
        </g>

        {/* Corner Plant */}
        <g transform="translate(260, 70)">
          <circle cx="0" cy="0" r="14" className="fill-emerald-100 dark:fill-emerald-900 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />
          <path d="M-8 -8 Q0 -15 8 -8 Q15 0 8 8 Q0 15 -8 8 Q-15 0 -8 -8" className="fill-emerald-200 dark:fill-emerald-800 opacity-70" />
          <circle cx="0" cy="0" r="4" className="fill-emerald-700 dark:fill-emerald-300" />
        </g>
        
      </g>

      {/* Live badge */}
      <g transform="translate(240, 350)">
        <rect x="0" y="0" width="62" height="14" rx="7" fill="#06b6d4" opacity="0.15"/>
        <circle cx="8" cy="7" r="3" fill="#06b6d4">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite"/>
        </circle>
        <text x="14" y="10" fontSize="7" fill="#06b6d4" fontWeight="700" fontFamily="Inter">LIVE SYNC</text>
      </g>
    </svg>
  )
}
