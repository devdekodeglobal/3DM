interface PavilionBlueprintProps {
  mode: 'space' | 'assets';
}

export function PavilionBlueprint({ mode }: PavilionBlueprintProps) {
  const showAssets = mode === 'assets';

  // 9.50m x 5.00m enterprise pavilion aspect ratio (9.5:5 = 1.9).
  // Coordinate frame in 520x340 viewport:
  // Space bounds: x: 40 to 480 (width 440), y: 55 to 286 (height 231)
  // Scale factor: 440px / 9.5m ≈ 46.3px/m. 5.0m * 46.3 ≈ 231.5px.
  // Enclosed pavilion perimeter:
  // North Wall: x: 40 to 480, y: 55 (Solid perimeter wall with graphic murals)
  // South Wall: x: 40 to 480, y: 286 with entry openings
  // West Wall: x: 40, y: 55 to 286 (with green moss acoustic wall)
  // East Wall: x: 480, y: 55 to 286
  // Inner Zones:
  // Left Zone (x: 40 to 260): Green acoustic wall, Soft II sofas, lounge chairs, round coffee table
  // Center Zone (x: 260 to 350): Yellow circulation runner walkway (x: 275 to 335, y: 55 to 286), hanging swing egg chair at top, cocktail bar table & stools at bottom
  // Right Zone (x: 350 to 480): Pergola timber rafters overhead (x: 350 to 475, y: 55 to 280), Baggio II sofa with logo wall, conference meeting table with 4 Aiko chairs

  return (
    <svg
      viewBox="0 0 520 340"
      className="w-full h-full select-none"
      role="img"
      aria-label={showAssets ? 'Furnished 2D Pavilion Blueprint - 9.5m × 5.0m' : '9.5m by 5.0m Pavilion Space Blueprint'}
    >
      <defs>
        <pattern id={`pavilion-grid-${mode}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M14 0H0V14" fill="none" stroke="#e0e7ff" strokeWidth="0.7" opacity="0.8" />
        </pattern>
        <pattern id={`pavilion-grid-major-${mode}`} width="70" height="70" patternUnits="userSpaceOnUse">
          <path d="M70 0H0V70" fill="none" stroke="#c7d2fe" strokeWidth="1" opacity="0.6" />
        </pattern>
        <pattern id={`pavilion-pergola-${mode}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="18" y2="0" stroke="#b45309" strokeWidth="1.6" opacity="0.6" />
        </pattern>
      </defs>

      {/* Blueprint Grid Canvas */}
      <rect width="520" height="340" rx="16" fill="#f8fafc" />
      <rect x="24" y="20" width="472" height="300" rx="2" fill={`url(#pavilion-grid-${mode})`} />
      <rect x="24" y="20" width="472" height="300" rx="2" fill={`url(#pavilion-grid-major-${mode})`} />

      {/* Compass Directions */}
      <text x="260" y="36" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">N</text>
      <text x="260" y="318" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">S</text>
      <text x="18" y="174" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">W</text>
      <text x="502" y="174" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">E</text>

      {/* Blue Technical Dimension Lines with Tick Arrows */}
      <g fill="#0284c7" stroke="#0284c7" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8.5" fontWeight="700">
        {/* Top 9.50m */}
        <line x1="40" y1="42" x2="480" y2="42" strokeWidth="1.2" />
        <line x1="40" y1="36" x2="40" y2="48" strokeWidth="1.2" />
        <line x1="480" y1="36" x2="480" y2="48" strokeWidth="1.2" />
        <rect x="234" y="33" width="52" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" />
        <text x="260" y="45" textAnchor="middle" stroke="none">9.50m</text>

        {/* Bottom 9.50m */}
        <line x1="40" y1="300" x2="480" y2="300" strokeWidth="1.2" />
        <line x1="40" y1="294" x2="40" y2="306" strokeWidth="1.2" />
        <line x1="480" y1="294" x2="480" y2="306" strokeWidth="1.2" />
        <rect x="234" y="291" width="52" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" />
        <text x="260" y="303" textAnchor="middle" stroke="none">9.50m</text>

        {/* Left 5.00m */}
        <line x1="28" y1="55" x2="28" y2="286" strokeWidth="1.2" />
        <line x1="22" y1="55" x2="34" y2="55" strokeWidth="1.2" />
        <line x1="22" y1="286" x2="34" y2="286" strokeWidth="1.2" />
        <rect x="10" y="161" width="36" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" transform="rotate(-90 28 170)" />
        <text x="28" y="173" textAnchor="middle" stroke="none" transform="rotate(-90 28 173)">5.00m</text>

        {/* Right 5.00m */}
        <line x1="492" y1="55" x2="492" y2="286" strokeWidth="1.2" />
        <line x1="486" y1="55" x2="498" y2="55" strokeWidth="1.2" />
        <line x1="486" y1="286" x2="498" y2="286" strokeWidth="1.2" />
        <rect x="474" y="161" width="36" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" transform="rotate(-90 492 170)" />
        <text x="492" y="173" textAnchor="middle" stroke="none" transform="rotate(-90 492 173)">5.00m</text>
      </g>

      {/* Main Floor Surface Area */}
      <rect x="40" y="55" width="440" height="231" fill="#f1f5f9" fillOpacity="0.4" stroke="none" />

      {/* Yellow Runner Walkway through Central Axis */}
      <rect x="280" y="55" width="44" height="231" fill="#fde047" fillOpacity="0.35" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3 3" />
      <text x="302" y="278" textAnchor="middle" fill="#ca8a04" fontSize="5.5" fontWeight="700" letterSpacing="0.5">RUNNER</text>

      {/* Perimeter Walls */}
      {/* North Wall: Solid perimeter with art murals */}
      <rect x="40" y="52" width="440" height="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
      {/* West Wall: Solid acoustic wall */}
      <rect x="37" y="55" width="5" height="231" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
      {/* Green Acoustic Moss Wall Feature on West */}
      <rect x="42" y="65" width="5" height="211" fill="#22c55e" fillOpacity="0.5" stroke="#16a34a" strokeWidth="0.8" />
      {/* East Wall: Solid wall with pergola tie-in */}
      <rect x="478" y="55" width="5" height="231" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
      {/* South Wall with Entry Portals */}
      <rect x="40" y="284" width="130" height="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
      <line x1="170" y1="286" x2="270" y2="286" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" />
      <rect x="270" y="284" width="8" height="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
      <line x1="278" y1="286" x2="340" y2="286" stroke="#eab308" strokeWidth="1.4" strokeDasharray="4 3" />
      <rect x="340" y="284" width="140" height="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />

      {/* Pergola Overhead Zone (Right side: x: 350 to 476, y: 56 to 284) */}
      <rect x="350" y="57" width="128" height="227" fill={`url(#pavilion-pergola-${mode})`} />
      <rect x="350" y="57" width="128" height="227" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="5 3" />
      <text x="414" y="68" textAnchor="middle" fill="#b45309" fontSize="6.5" fontWeight="800" letterSpacing="0.8">PERGOLA RAFTER CEILING</text>

      {/* STEP 0: Space Dimensions Outline Card */}
      {!showAssets && (
        <g>
          <rect x="135" y="115" width="250" height="110" rx="14" fill="#ffffff" opacity="0.9" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="260" y="152" textAnchor="middle" fill="#1e3a8a" fontSize="15" fontWeight="900">9.5m × 5.0m SPACE</text>
          <text x="260" y="174" textAnchor="middle" fill="#0284c7" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, monospace" fontWeight="700">DESIGN 1X PAVILION</text>
          <text x="260" y="196" textAnchor="middle" fill="#64748b" fontSize="8" letterSpacing="0.8">MULTI-ZONE EXHIBIT WITH TIMBER PERGOLA &amp; LOUNGE</text>
        </g>
      )}

      {/* STEP 1: Furnished Assets Blueprint matching Design 1x */}
      {showAssets && (
        <g stroke="#334155" strokeWidth="1.1" fill="none">
          {/* ZONE 1: LEFT LOUNGE (x: 40 to 270) */}
          {/* 1. Soft II Sofa (Left boundary against moss wall) */}
          <g>
            <rect x="52" y="145" width="28" height="52" rx="2" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.2" />
            <rect x="52" y="145" width="8" height="52" rx="1" fill="#cbd5e1" />
            <line x1="60" y1="171" x2="80" y2="171" stroke="#94a3b8" strokeWidth="0.8" />
            <text x="48" y="172" textAnchor="middle" fill="#475569" fontSize="5.5" fontWeight="700" stroke="none" transform="rotate(-90 48 172)">Soft II</text>
          </g>

          {/* 2. Top Lounge Seating: Amagni Soft Frontpolster & Coffee Table */}
          <g>
            <rect x="75" y="78" width="26" height="24" rx="2" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.1" />
            <rect x="75" y="78" width="26" height="7" rx="1" fill="#cbd5e1" />
            <text x="88" y="112" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none">Amagni</text>
          </g>
          {/* Red Tripod Side Table */}
          <g>
            <circle cx="120" cy="90" r="11" fill="#f8fafc" stroke="#dc2626" strokeWidth="1.2" />
            <circle cx="120" cy="90" r="2.5" fill="#dc2626" stroke="none" />
            <text x="120" y="110" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none">Tripod Table</text>
          </g>

          {/* 3. Zone Partition Wall (Central Left Divider at x: 230, y: 195, w: 5, h: 90) */}
          <g>
            <rect x="230" y="195" width="5" height="90" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
            <text x="224" y="240" textAnchor="middle" fill="#64748b" fontSize="5" fontWeight="700" stroke="none" transform="rotate(-90 224 240)">PARTITION</text>
          </g>

          {/* 4. Casual Meeting Bar Table & Catifa Stools (Left Zone bottom) */}
          <g>
            <circle cx="180" cy="225" r="14" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.2" />
            <circle cx="180" cy="225" r="2.5" fill="#334155" stroke="none" />
            <text x="180" y="222" textAnchor="middle" fill="#1e293b" fontSize="5.2" fontWeight="800" stroke="none">BAR TABLE</text>
            <text x="180" y="230" textAnchor="middle" fill="#64748b" fontSize="4.8" fontWeight="600" stroke="none">Ø 60cm</text>
            {/* 2 Stools */}
            <g transform="translate(180 203)">
              <circle cx="0" cy="0" r="5.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="0.9" />
              <line x1="-3" y1="-3" x2="3" y2="-3" stroke="#334155" strokeWidth="1.1" />
            </g>
            <g transform="translate(180 247)">
              <circle cx="0" cy="0" r="5.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="0.9" />
              <line x1="-3" y1="-3" x2="3" y2="-3" stroke="#334155" strokeWidth="1.1" />
            </g>
          </g>

          {/* ZONE 2: CENTRAL RUNNER & STATEMENT PIECES (x: 270 to 345) */}
          {/* Hanging Egg Chair (Top of Runner with Geometric Carpet) */}
          <g>
            {/* Circular Carpet Rug */}
            <circle cx="302" cy="92" r="20" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
            {/* Hanging Egg Chair Shape */}
            <ellipse cx="302" cy="92" rx="13" ry="15" fill="#f8fafc" stroke="#0284c7" strokeWidth="1.4" />
            <circle cx="302" cy="80" r="3" fill="#0284c7" stroke="none" />
            <path d="M 292 94 C 292 104, 312 104, 312 94" fill="none" stroke="#0284c7" strokeWidth="1.1" />
            <text x="302" y="122" textAnchor="middle" fill="#0369a1" fontSize="5.5" fontWeight="800" stroke="none">HANGING SWING</text>
          </g>

          {/* Central Consultation Lounge Chairs (Catifa Lounge) */}
          <g>
            <rect x="288" y="165" width="28" height="24" rx="2" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.1" />
            <path d="M 290 183 C 290 172, 314 172, 314 183" stroke="#475569" strokeWidth="1.1" fill="none" />
            <text x="302" y="198" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none">Catifa</text>
          </g>

          {/* ZONE 3: RIGHT PERGOLA MEETING & VIP LOUNGE (x: 350 to 480) */}
          {/* 1. Conference Meeting Zone (Middle of Pergola) */}
          {/* Conference Meeting Table */}
          <g>
            <rect x="395" y="120" width="38" height="50" rx="3" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.3" />
            <text x="414" y="143" textAnchor="middle" fill="#1e293b" fontSize="5.5" fontWeight="800" stroke="none">MEETING</text>
            <text x="414" y="151" textAnchor="middle" fill="#64748b" fontSize="5" fontWeight="600" stroke="none">TABLE</text>
            {/* 4x Aiko Chairs around Table */}
            {/* Top Chair */}
            <g transform="translate(414 105)">
              <rect x="-9" y="-7" width="18" height="14" rx="1.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <rect x="-9" y="-7" width="18" height="4" fill="#cbd5e1" />
            </g>
            {/* Bottom Chair */}
            <g transform="translate(414 185)">
              <rect x="-9" y="-7" width="18" height="14" rx="1.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <rect x="-9" y="3" width="18" height="4" fill="#cbd5e1" />
            </g>
            {/* Left Chair */}
            <g transform="translate(378 145) rotate(90)">
              <rect x="-9" y="-7" width="18" height="14" rx="1.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <rect x="-9" y="-7" width="18" height="4" fill="#cbd5e1" />
            </g>
            {/* Right Chair */}
            <g transform="translate(450 145) rotate(-90)">
              <rect x="-9" y="-7" width="18" height="14" rx="1.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <rect x="-9" y="-7" width="18" height="4" fill="#cbd5e1" />
            </g>
          </g>

          {/* 2. VIP Lounge (Bottom-Right: Baggio II Sofa + Brand Logo Back Wall) */}
          {/* Logo Wall Partition at x: 380, y: 228, w: 85, h: 5 */}
          <g>
            <rect x="375" y="218" width="90" height="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
            <rect x="390" y="215" width="60" height="3" fill="#0d9488" stroke="none" />
            <text x="420" y="213" textAnchor="middle" fill="#0d9488" fontSize="5.5" fontWeight="800" stroke="none">BRAND BANNER WALL</text>
          </g>

          {/* Baggio II Sofa Facing Downwards */}
          <g>
            <rect x="388" y="226" width="64" height="28" rx="2" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.2" />
            <rect x="388" y="226" width="64" height="8" rx="1" fill="#cbd5e1" />
            <rect x="388" y="226" width="8" height="28" rx="1" fill="#cbd5e1" />
            <rect x="444" y="226" width="8" height="28" rx="1" fill="#cbd5e1" />
            <text x="420" y="246" textAnchor="middle" fill="#475569" fontSize="5.5" fontWeight="700" stroke="none">BAGGIO II SOFA</text>
          </g>
          {/* Circular Rug in VIP Lounge */}
          <circle cx="420" cy="265" r="14" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
      )}

      {/* Live Sync Badge */}
      <g transform="translate(393 310)">
        <rect width="83" height="18" rx="9" fill="#06b6d4" opacity="0.13" />
        <circle cx="10" cy="9" r="3" fill="#06b6d4" />
        <text x="18" y="12" fill="#0891b2" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8" fontWeight="800">LIVE SYNC</text>
      </g>
    </svg>
  );
}
