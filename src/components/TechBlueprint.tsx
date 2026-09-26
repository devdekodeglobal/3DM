interface TechBlueprintProps {
  mode: 'space' | 'assets';
}

export function TechBlueprint({ mode }: TechBlueprintProps) {
  const showAssets = mode === 'assets';

  // 7.00m x 3.00m space aspect ratio (7:3).
  // Coordinate frame in 520x340 viewport:
  // Space bounds: x: 45 to 475 (width 430), y: 70 to 254 (height 184)
  // Scale factor: 430px / 7.0m ≈ 61.4px/m. 3.0m * 61.4 ≈ 184.2px.
  // Walls:
  // North Wall: x: 45 to 475, y: 70 (Solid wall)
  // West Wall: x: 45, y: 70 to 254 (Solid wall)
  // East Wall: x: 475, y: 70 to 254 (Solid wall)
  // South: Open floor / entrance boundary (dashed line)
  // Storage Room:
  // Top-left corner from x: 45 to 168 (2.0m width), y: 70 to 162 (1.5m depth)
  // East wall of storage room: x: 168, y: 70 to 162 with door opening & swing
  // South wall of storage room: x: 45 to 168, y: 162

  return (
    <svg
      viewBox="0 0 520 340"
      className="w-full h-full select-none"
      role="img"
      aria-label={showAssets ? 'Furnished 2D Tech Showcase Blueprint - 7.0m × 3.0m' : '7.0m by 3.0m Space Blueprint'}
    >
      <defs>
        <pattern id={`tech-grid-${mode}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M14 0H0V14" fill="none" stroke="#e0e7ff" strokeWidth="0.7" opacity="0.8" />
        </pattern>
        <pattern id={`tech-grid-major-${mode}`} width="70" height="70" patternUnits="userSpaceOnUse">
          <path d="M70 0H0V70" fill="none" stroke="#c7d2fe" strokeWidth="1" opacity="0.6" />
        </pattern>
        <pattern id={`tech-slat-pattern-${mode}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#94a3b8" strokeWidth="1.2" opacity="0.7" />
        </pattern>
      </defs>

      {/* Blueprint Grid Canvas */}
      <rect width="520" height="340" rx="16" fill="#f8fafc" />
      <rect x="28" y="24" width="464" height="292" rx="2" fill={`url(#tech-grid-${mode})`} />
      <rect x="28" y="24" width="464" height="292" rx="2" fill={`url(#tech-grid-major-${mode})`} />

      {/* Compass Directions */}
      <text x="260" y="44" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">N</text>
      <text x="260" y="300" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">S (OPEN FRONT)</text>
      <text x="22" y="166" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">W</text>
      <text x="498" y="166" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="900" fontFamily="sans-serif">E</text>

      {/* Blue Technical Dimension Lines with Tick Arrows */}
      <g fill="#0284c7" stroke="#0284c7" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8.5" fontWeight="700">
        {/* Top 7.00m dimension */}
        <line x1="45" y1="50" x2="475" y2="50" strokeWidth="1.2" />
        <line x1="45" y1="44" x2="45" y2="56" strokeWidth="1.2" />
        <line x1="475" y1="44" x2="475" y2="56" strokeWidth="1.2" />
        <rect x="234" y="41" width="52" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" />
        <text x="260" y="53" textAnchor="middle" stroke="none">7.00m</text>

        {/* Bottom 7.00m dimension (Open front perimeter) */}
        <line x1="45" y1="272" x2="475" y2="272" strokeWidth="1.2" />
        <line x1="45" y1="266" x2="45" y2="278" strokeWidth="1.2" />
        <line x1="475" y1="266" x2="475" y2="278" strokeWidth="1.2" />
        <rect x="234" y="263" width="52" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" />
        <text x="260" y="275" textAnchor="middle" stroke="none">7.00m</text>

        {/* Left 3.00m dimension */}
        <line x1="32" y1="70" x2="32" y2="254" strokeWidth="1.2" />
        <line x1="26" y1="70" x2="38" y2="70" strokeWidth="1.2" />
        <line x1="26" y1="254" x2="38" y2="254" strokeWidth="1.2" />
        <rect x="14" y="153" width="36" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" transform="rotate(-90 32 162)" />
        <text x="32" y="165" textAnchor="middle" stroke="none" transform="rotate(-90 32 165)">3.00m</text>

        {/* Right 3.00m dimension */}
        <line x1="488" y1="70" x2="488" y2="254" strokeWidth="1.2" />
        <line x1="482" y1="70" x2="494" y2="70" strokeWidth="1.2" />
        <line x1="482" y1="254" x2="494" y2="254" strokeWidth="1.2" />
        <rect x="470" y="153" width="36" height="18" rx="5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" transform="rotate(-90 488 162)" />
        <text x="488" y="165" textAnchor="middle" stroke="none" transform="rotate(-90 488 165)">3.00m</text>
      </g>

      {/* Main Floor Surface Area */}
      <rect x="45" y="70" width="430" height="184" fill="#f1f5f9" fillOpacity="0.4" stroke="none" />

      {/* Walls (U-Shaped perimeter) */}
      {/* North Solid Wall */}
      <rect x="45" y="67" width="430" height="6" fill="#ffffff" stroke="#1e293b" strokeWidth="1.4" />
      {/* West Solid Wall */}
      <rect x="42" y="70" width="6" height="184" fill="#ffffff" stroke="#1e293b" strokeWidth="1.4" />
      {/* East Solid Wall */}
      <rect x="472" y="70" width="6" height="184" fill="#ffffff" stroke="#1e293b" strokeWidth="1.4" />
      {/* South Open Front Boundary */}
      <line x1="45" y1="254" x2="475" y2="254" stroke="#0284c7" strokeWidth="1.4" strokeDasharray="5 4" />

      {/* North Graphic Mural Marker */}
      <g>
        <rect x="175" y="60" width="290" height="6" rx="2" fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="1" />
        <text x="320" y="56" textAnchor="middle" fill="#059669" fontSize="6.5" fontWeight="800" letterSpacing="0.8">BRAND GRAPHIC MURAL (7.0m × 2.5m)</text>
      </g>

      {/* Storage Room Structure (Top-Left 2.0m x 1.5m) */}
      {/* Storage area fill */}
      <rect x="48" y="73" width="120" height="89" fill="#e2e8f0" fillOpacity="0.5" stroke="none" />
      {/* Storage Room Louver / Ceiling Slats */}
      <rect x="48" y="73" width="120" height="89" fill={`url(#tech-slat-pattern-${mode})`} />
      {/* Storage South Partition Wall */}
      <rect x="45" y="159" width="123" height="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
      {/* Storage East Partition Wall with Doorway */}
      <rect x="165" y="70" width="5" height="30" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
      <rect x="165" y="140" width="5" height="24" fill="#ffffff" stroke="#1e293b" strokeWidth="1.3" />
      {/* Door Swing Arc */}
      <path d="M 167 100 A 40 40 0 0 1 138 136" fill="none" stroke="#64748b" strokeWidth="0.9" strokeDasharray="2 2" />
      <line x1="167" y1="100" x2="138" y2="136" stroke="#475569" strokeWidth="1.2" />
      <text x="105" y="115" textAnchor="middle" fill="#475569" fontSize="6.5" fontWeight="800" fontFamily="sans-serif">STORAGE ROOM</text>
      <text x="105" y="127" textAnchor="middle" fill="#64748b" fontSize="5.5" fontWeight="600" fontFamily="sans-serif">2.0m × 1.5m</text>

      {/* STEP 0: Space Dimensions Outline Card */}
      {!showAssets && (
        <g>
          <rect x="135" y="115" width="250" height="106" rx="14" fill="#ffffff" opacity="0.9" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="260" y="152" textAnchor="middle" fill="#1e3a8a" fontSize="15" fontWeight="900">7.0m × 3.0m SPACE</text>
          <text x="260" y="174" textAnchor="middle" fill="#0284c7" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, monospace" fontWeight="700">TECH SHOWCASE BOOTH</text>
          <text x="260" y="194" textAnchor="middle" fill="#64748b" fontSize="8" letterSpacing="0.8">U-SHAPED 3-WALL PERIMETER &amp; OPEN FRONT</text>
        </g>
      )}

      {/* STEP 1: Furnished Assets Blueprint matching Tech Showcase */}
      {showAssets && (
        <g stroke="#334155" strokeWidth="1.1" fill="none">
          {/* Reception Counter (Front-Left: BARI MIT AUFSATZ at x: 48, y: 220, w: 62, h: 32) */}
          <g>
            <rect x="52" y="218" width="65" height="32" rx="2" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.3" />
            <rect x="52" y="218" width="16" height="32" rx="1" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
            <line x1="68" y1="218" x2="68" y2="250" stroke="#334155" strokeWidth="1" />
            <text x="84" y="236" textAnchor="middle" fill="#1e293b" fontSize="5.8" fontWeight="800" stroke="none" fontFamily="sans-serif">RECEPTION</text>
            <text x="84" y="244" textAnchor="middle" fill="#64748b" fontSize="5" fontWeight="600" stroke="none" fontFamily="sans-serif">DESK</text>
          </g>

          {/* Reception Stool (Behind counter: Amagni Bar steel weiß) */}
          <g transform="translate(84 198)">
            <circle cx="0" cy="0" r="7.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.1" />
            <circle cx="0" cy="0" r="4.5" stroke="#64748b" strokeWidth="0.8" />
            <line x1="-5" y1="-5" x2="5" y2="-5" stroke="#334155" strokeWidth="1.3" />
            <text x="0" y="12" textAnchor="middle" fill="#475569" fontSize="5" fontWeight="700" stroke="none" fontFamily="sans-serif">Stool</text>
          </g>

          {/* Meeting Table 1 (Center-Left: FERMO 110 Ø 70 at x: 250, y: 156) */}
          <g>
            <circle cx="250" cy="156" r="18" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.3" />
            <circle cx="250" cy="156" r="13" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
            <circle cx="250" cy="156" r="3.2" fill="#334155" stroke="none" />
            <text x="250" y="153" textAnchor="middle" fill="#1e293b" fontSize="5.5" fontWeight="800" stroke="none" fontFamily="sans-serif">HIGH TABLE 1</text>
            <text x="250" y="163" textAnchor="middle" fill="#64748b" fontSize="5" fontWeight="700" stroke="none" fontFamily="sans-serif">Ø 70cm</text>

            {/* 3x Stools around Table 1 */}
            {/* Top Stool */}
            <g transform="translate(250 125) rotate(0)">
              <circle cx="0" cy="0" r="6.8" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" stroke="#64748b" strokeWidth="0.7" />
              <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#334155" strokeWidth="1.2" />
            </g>
            {/* Left Stool */}
            <g transform="translate(218 172) rotate(120)">
              <circle cx="0" cy="0" r="6.8" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" stroke="#64748b" strokeWidth="0.7" />
              <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#334155" strokeWidth="1.2" />
            </g>
            {/* Right Stool */}
            <g transform="translate(282 172) rotate(-120)">
              <circle cx="0" cy="0" r="6.8" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" stroke="#64748b" strokeWidth="0.7" />
              <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#334155" strokeWidth="1.2" />
            </g>
          </g>

          {/* Meeting Table 2 (Center-Right: FERMO 110 Ø 70 at x: 390, y: 156) */}
          <g>
            <circle cx="390" cy="156" r="18" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.3" />
            <circle cx="390" cy="156" r="13" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
            <circle cx="390" cy="156" r="3.2" fill="#334155" stroke="none" />
            <text x="390" y="153" textAnchor="middle" fill="#1e293b" fontSize="5.5" fontWeight="800" stroke="none" fontFamily="sans-serif">HIGH TABLE 2</text>
            <text x="390" y="163" textAnchor="middle" fill="#64748b" fontSize="5" fontWeight="700" stroke="none" fontFamily="sans-serif">Ø 70cm</text>

            {/* 3x Stools around Table 2 */}
            {/* Top Stool */}
            <g transform="translate(390 125) rotate(0)">
              <circle cx="0" cy="0" r="6.8" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" stroke="#64748b" strokeWidth="0.7" />
              <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#334155" strokeWidth="1.2" />
            </g>
            {/* Left Stool */}
            <g transform="translate(358 172) rotate(120)">
              <circle cx="0" cy="0" r="6.8" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" stroke="#64748b" strokeWidth="0.7" />
              <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#334155" strokeWidth="1.2" />
            </g>
            {/* Right Stool */}
            <g transform="translate(422 172) rotate(-120)">
              <circle cx="0" cy="0" r="6.8" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" stroke="#64748b" strokeWidth="0.7" />
              <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#334155" strokeWidth="1.2" />
            </g>
          </g>

          {/* East Wall Accent / Tech Display Banner */}
          <g>
            <rect x="466" y="90" width="6" height="120" rx="1" fill="#0284c7" fillOpacity="0.4" stroke="#0284c7" strokeWidth="0.9" />
            <text x="458" y="150" textAnchor="middle" fill="#0369a1" fontSize="5.5" fontWeight="700" stroke="none" transform="rotate(-90 458 150)">PRODUCT GRAPHICS</text>
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
  );
}
