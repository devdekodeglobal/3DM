interface AfterglowBlueprintProps {
  mode: 'space' | 'assets'
}

export function AfterglowBlueprint({ mode }: AfterglowBlueprintProps) {
  const showAssets = mode === 'assets'

  return (
    <svg viewBox="0 0 520 340" className="w-full h-full select-none" role="img" aria-label={showAssets ? 'Furnished 2D space blueprint - trial2' : '10.0m by 7.0m space blueprint'}>
      <defs>
        <pattern id={`trial2-grid-${mode}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M14 0H0V14" fill="none" stroke="#e0e7ff" strokeWidth="0.7" opacity="0.8" />
        </pattern>
        <pattern id={`trial2-grid-major-${mode}`} width="70" height="70" patternUnits="userSpaceOnUse">
          <path d="M70 0H0V70" fill="none" stroke="#c7d2fe" strokeWidth="1" opacity="0.6" />
        </pattern>
      </defs>

      {/* Blueprint Grid Canvas */}
      <rect width="520" height="340" rx="16" fill="#f8fafc" />
      <rect x="36" y="32" width="448" height="268" rx="2" fill={`url(#trial2-grid-${mode})`} />
      <rect x="36" y="32" width="448" height="268" rx="2" fill={`url(#trial2-grid-major-${mode})`} />

      {/* Compass Directions (N, S, E, W) */}
      <text x="260" y="30" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">N</text>
      <text x="260" y="318" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">S</text>
      <text x="20" y="172" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">W</text>
      <text x="500" y="172" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">E</text>

      {/* Blue Technical Dimension Lines with Tick Arrows */}
      <g fill="#0284c7" stroke="#0284c7" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8.5" fontWeight="700">
        {/* Top 10.00m */}
        <line x1="44" y1="20" x2="476" y2="20" strokeWidth="1.2" />
        <line x1="44" y1="15" x2="44" y2="25" strokeWidth="1.2" />
        <line x1="476" y1="15" x2="476" y2="25" strokeWidth="1.2" />
        <rect x="234" y="11" width="52" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" />
        <text x="260" y="23" textAnchor="middle" stroke="none">10.00m</text>

        {/* Bottom 10.00m */}
        <line x1="44" y1="305" x2="476" y2="305" strokeWidth="1.2" />
        <line x1="44" y1="300" x2="44" y2="310" strokeWidth="1.2" />
        <line x1="476" y1="300" x2="476" y2="310" strokeWidth="1.2" />
        <rect x="234" y="296" width="52" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" />
        <text x="260" y="308" textAnchor="middle" stroke="none">10.00m</text>

        {/* Left 7.00m */}
        <line x1="28" y1="42" x2="28" y2="294" strokeWidth="1.2" />
        <line x1="23" y1="42" x2="33" y2="42" strokeWidth="1.2" />
        <line x1="23" y1="294" x2="33" y2="294" strokeWidth="1.2" />
        <rect x="10" y="158" width="36" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" transform="rotate(-90 28 167)" />
        <text x="28" y="170" textAnchor="middle" stroke="none" transform="rotate(-90 28 170)">7.00m</text>

        {/* Right 7.00m */}
        <line x1="492" y1="42" x2="492" y2="294" strokeWidth="1.2" />
        <line x1="487" y1="42" x2="497" y2="42" strokeWidth="1.2" />
        <line x1="487" y1="294" x2="497" y2="294" strokeWidth="1.2" />
        <rect x="474" y="158" width="36" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" transform="rotate(-90 492 167)" />
        <text x="492" y="170" textAnchor="middle" stroke="none" transform="rotate(-90 492 170)">7.00m</text>
      </g>

      {/* Walls */}
      {/* North Wall: Solid White with Outline */}
      <rect x="44" y="40" width="432" height="5" fill="#ffffff" stroke="#334155" strokeWidth="1.2" />
      {/* West Boundary: Dashed */}
      <line x1="44" y1="45" x2="44" y2="294" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" />
      {/* East Caged-Wall: Slatted / Dashed partition */}
      <rect x="471" y="44" width="8" height="248" fill="none" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />

      {/* Top 3D Logo Overlay across North Wall */}
      <g>
        <rect x="145" y="8" width="238" height="74" rx="4" fill="#0d9488" fillOpacity="0.07" stroke="#0d9488" strokeWidth="1.2" />
        <text x="264" y="6" textAnchor="middle" fill="#0d9488" fontSize="7.5" fontWeight="800" letterSpacing="0.8">3D LOGO</text>
      </g>

      {/* STEP 0: Space Dimensions Outline Card */}
      {!showAssets && (
        <g>
          <rect x="135" y="105" width="250" height="126" rx="14" fill="#ffffff" opacity="0.85" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="260" y="152" textAnchor="middle" fill="#1e3a8a" fontSize="15" fontWeight="900">10.0m × 7.0m SPACE</text>
          <text x="260" y="176" textAnchor="middle" fill="#0284c7" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, monospace" fontWeight="700">TRIAL 2 FLOOR PLAN</text>
          <text x="260" y="198" textAnchor="middle" fill="#64748b" fontSize="8.5" letterSpacing="1">NORTH FEATURE WALL &amp; OPEN SOCIAL LAYOUT</text>
        </g>
      )}

      {/* STEP 1: Furnished Assets Blueprint matching trial2 exact layout */}
      {showAssets && (
        <g stroke="#334155" strokeWidth="1.1" fill="none">
          {/* 1. Top Right Fridge (FRIGARO GROß GLASTÜR) */}
          <g>
            <rect x="432" y="48" width="26" height="26" rx="1.5" fill="#f8fafc" />
            <line x1="432" y1="70" x2="458" y2="70" strokeWidth="1.2" />
            <rect x="434" y="71.5" width="7" height="1.5" rx="0.5" fill="#334155" stroke="none" />
            <text x="445" y="44" textAnchor="middle" fill="#475569" fontSize="5.5" fontWeight="700" stroke="none" fontFamily="sans-serif">FRIGARO GROß<tspan x="445" dy="6">GLASTÜR</tspan></text>
          </g>

          {/* 2. Left Lounge Area */}
          {/* Top POMP SQUARE */}
          <g>
            <rect x="115" y="66" width="43" height="36" rx="2" fill="#f8fafc" />
            <rect x="121" y="70" width="31" height="28" rx="1" fill="#f1f5f9" />
            <text x="136.5" y="112" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="700" stroke="none" fontFamily="sans-serif">POMP SQUARE</text>
          </g>

          {/* Bottom POMP SQUARE */}
          <g>
            <rect x="115" y="222" width="43" height="36" rx="2" fill="#f8fafc" />
            <rect x="121" y="226" width="31" height="28" rx="1" fill="#f1f5f9" />
            <text x="136.5" y="268" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="700" stroke="none" fontFamily="sans-serif">POMP SQUARE</text>
          </g>

          {/* Top Soft II Sofa */}
          <g>
            <rect x="72" y="113" width="34" height="48" rx="2" fill="#f8fafc" />
            <rect x="72" y="113" width="9" height="48" rx="1.5" fill="#e2e8f0" />
            <rect x="72" y="113" width="34" height="6" rx="1" fill="#e2e8f0" />
            <rect x="72" y="155" width="34" height="6" rx="1" fill="#e2e8f0" />
            <line x1="81" y1="137" x2="106" y2="137" stroke="#94a3b8" strokeWidth="0.9" />
            <text x="67" y="140" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="700" stroke="none" transform="rotate(-90 67 140)" fontFamily="sans-serif">Soft II</text>
          </g>

          {/* Bottom Soft II Sofa */}
          <g>
            <rect x="76" y="172" width="34" height="48" rx="2" fill="#f8fafc" />
            <rect x="76" y="172" width="9" height="48" rx="1.5" fill="#e2e8f0" />
            <rect x="76" y="172" width="34" height="6" rx="1" fill="#e2e8f0" />
            <rect x="76" y="214" width="34" height="6" rx="1" fill="#e2e8f0" />
            <line x1="85" y1="196" x2="110" y2="196" stroke="#94a3b8" strokeWidth="0.9" />
            <text x="71" y="199" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="700" stroke="none" transform="rotate(-90 71 199)" fontFamily="sans-serif">Soft II</text>
          </g>

          {/* 2x Little Friend Side Tables */}
          <g>
            <circle cx="140" cy="137" r="9.5" fill="#f8fafc" />
            <circle cx="140" cy="137" r="7.5" stroke="#94a3b8" strokeWidth="0.7" strokeDasharray="1.5 1.5" />
            <circle cx="140" cy="137" r="1.8" fill="#334155" stroke="none" />
            <text x="140" y="153" textAnchor="middle" fill="#475569" fontSize="5.5" fontWeight="700" stroke="none" fontFamily="sans-serif">Little Friend</text>
          </g>
          <g>
            <circle cx="140" cy="186" r="9.5" fill="#f8fafc" />
            <circle cx="140" cy="186" r="7.5" stroke="#94a3b8" strokeWidth="0.7" strokeDasharray="1.5 1.5" />
            <circle cx="140" cy="186" r="1.8" fill="#334155" stroke="none" />
            <text x="140" y="202" textAnchor="middle" fill="#475569" fontSize="5.5" fontWeight="700" stroke="none" fontFamily="sans-serif">Little Friend</text>
          </g>

          {/* 2x Egg Chairs (facing left) */}
          <g>
            <rect x="171" y="117" width="41" height="34" rx="2" fill="#f8fafc" />
            <path d="M 207 122 C 176 122, 176 146, 207 146" stroke="#334155" strokeWidth="1.3" fill="none" />
            <line x1="184" y1="134" x2="204" y2="134" stroke="#94a3b8" strokeWidth="0.8" />
            <text x="216" y="137" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="700" stroke="none" transform="rotate(90 216 137)" fontFamily="sans-serif">Egg Chair</text>
          </g>
          <g>
            <rect x="171" y="174" width="41" height="34" rx="2" fill="#f8fafc" />
            <path d="M 207 179 C 176 179, 176 203, 207 203" stroke="#334155" strokeWidth="1.3" fill="none" />
            <line x1="184" y1="191" x2="204" y2="191" stroke="#94a3b8" strokeWidth="0.8" />
            <text x="216" y="194" textAnchor="middle" fill="#475569" fontSize="6" fontWeight="700" stroke="none" transform="rotate(90 216 194)" fontFamily="sans-serif">Egg Chair</text>
          </g>

          {/* 3. Bar / Buffet Area (Right) */}
          {/* 3x Lumino Buffet Counters */}
          {[323, 353, 383].map((bx) => (
            <g key={`buffet-${bx}`}>
              <rect x={bx} y="96" width="30" height="42" rx="1.5" fill="#f8fafc" />
              <rect x={bx} y="96" width="8" height="42" fill="#e2e8f0" />
              <line x1={bx + 3} y1="102" x2={bx + 6} y2="105" stroke="#94a3b8" strokeWidth="0.8" />
              <text x={bx + 4} y="117" textAnchor="middle" fill="#475569" fontSize="5.5" fontWeight="700" stroke="none" transform={`rotate(90 ${bx + 4} 117)`} fontFamily="sans-serif">Lumino Buffet</text>
            </g>
          ))}

          {/* 3D LOGO Over Buffets */}
          <g>
            <rect x="331" y="116" width="63" height="34" rx="2.5" fill="#0d9488" fillOpacity="0.08" stroke="#0d9488" strokeWidth="1.2" />
            <text x="362.5" y="136" textAnchor="middle" fill="#0d9488" fontSize="6.5" fontWeight="800" stroke="none">3D LOGO</text>
          </g>

          {/* 2x Bombo Barstools in front of Buffets */}
          <g>
            <circle cx="342" cy="154" r="8" fill="#f8fafc" />
            <circle cx="342" cy="154" r="5" stroke="#64748b" strokeWidth="0.8" />
            <line x1="337" y1="149" x2="347" y2="149" stroke="#334155" strokeWidth="1.4" />
            <text x="342" y="169" textAnchor="middle" fill="#475569" fontSize="5.5" fontWeight="700" stroke="none" fontFamily="sans-serif">Bombo</text>
          </g>
          <g>
            <circle cx="389" cy="154" r="8" fill="#f8fafc" />
            <circle cx="389" cy="154" r="5" stroke="#64748b" strokeWidth="0.8" />
            <line x1="384" y1="149" x2="394" y2="149" stroke="#334155" strokeWidth="1.4" />
            <text x="389" y="169" textAnchor="middle" fill="#475569" fontSize="5.5" fontWeight="700" stroke="none" fontFamily="sans-serif">Bombo</text>
          </g>

          {/* 4. Bottom Right Cocktail Tables (FERMO 110 ALUFARBEN Ø 70) */}
          {/* Left Cocktail Table */}
          <g>
            <circle cx="325" cy="231" r="14.5" fill="#f8fafc" />
            <circle cx="325" cy="231" r="11" stroke="#94a3b8" strokeWidth="0.7" strokeDasharray="2 2" />
            <circle cx="325" cy="231" r="2.5" fill="#334155" stroke="none" />
            <text x="325" y="254" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none" fontFamily="sans-serif">FERMO 110<tspan x="325" dy="5.5">ALUFARBEN Ø 70</tspan></text>
          </g>

          {/* Left Table Stools (Angled) */}
          <g transform="translate(299 248) rotate(35)">
            <circle cx="0" cy="0" r="7.5" fill="#f8fafc" />
            <circle cx="0" cy="0" r="4.8" stroke="#64748b" strokeWidth="0.8" />
            <line x1="-5" y1="-5" x2="5" y2="-5" stroke="#334155" strokeWidth="1.3" />
            <text x="0" y="13" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none" fontFamily="sans-serif">Bombo</text>
          </g>
          <g transform="translate(351 248) rotate(-35)">
            <circle cx="0" cy="0" r="7.5" fill="#f8fafc" />
            <circle cx="0" cy="0" r="4.8" stroke="#64748b" strokeWidth="0.8" />
            <line x1="-5" y1="-5" x2="5" y2="-5" stroke="#334155" strokeWidth="1.3" />
            <text x="0" y="13" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none" fontFamily="sans-serif">Bombo</text>
          </g>

          {/* Right Cocktail Table */}
          <g>
            <circle cx="418" cy="231" r="14.5" fill="#f8fafc" />
            <circle cx="418" cy="231" r="11" stroke="#94a3b8" strokeWidth="0.7" strokeDasharray="2 2" />
            <circle cx="418" cy="231" r="2.5" fill="#334155" stroke="none" />
            <text x="418" y="254" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none" fontFamily="sans-serif">FERMO 110<tspan x="418" dy="5.5">ALUFARBEN Ø 70</tspan></text>
          </g>

          {/* Right Table Stools (Angled) */}
          <g transform="translate(394 248) rotate(35)">
            <circle cx="0" cy="0" r="7.5" fill="#f8fafc" />
            <circle cx="0" cy="0" r="4.8" stroke="#64748b" strokeWidth="0.8" />
            <line x1="-5" y1="-5" x2="5" y2="-5" stroke="#334155" strokeWidth="1.3" />
            <text x="0" y="13" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none" fontFamily="sans-serif">Bombo</text>
          </g>
          <g transform="translate(441 248) rotate(-35)">
            <circle cx="0" cy="0" r="7.5" fill="#f8fafc" />
            <circle cx="0" cy="0" r="4.8" stroke="#64748b" strokeWidth="0.8" />
            <line x1="-5" y1="-5" x2="5" y2="-5" stroke="#334155" strokeWidth="1.3" />
            <text x="0" y="13" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none" fontFamily="sans-serif">Bombo</text>
          </g>
        </g>
      )}

      {/* Live Sync Badge */}
      <g transform="translate(393 310)">
        <rect width="83" height="18" rx="9" fill="#06b6d4" opacity="0.13" />
        <circle cx="10" cy="9" r="3" fill="#06b6d4" />
        <text x="18" y="12" fill="#0891b2" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8" fontWeight="800">LIVE SYNC</text>
      </g>
    </svg>
  )
}

