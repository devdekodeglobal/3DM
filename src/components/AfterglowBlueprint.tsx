import { ArchitecturalSymbolSVG } from './editor/ArchitecturalSymbolSVG'

interface AfterglowBlueprintProps {
  mode: 'space' | 'assets'
}

const Symbol = ({
  x,
  y,
  width,
  height,
  rotation = 0,
  category,
  assetName,
  className = 'text-slate-700',
}: {
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  category: string
  assetName: string
  className?: string
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    <svg x={-width / 2} y={-height / 2} width={width} height={height}>
      <ArchitecturalSymbolSVG category={category} assetName={assetName} className={`w-full h-full ${className}`} />
    </svg>
  </g>
)

export function AfterglowBlueprint({ mode }: AfterglowBlueprintProps) {
  const showAssets = mode === 'assets'

  return (
    <svg viewBox="0 0 520 340" className="w-full h-full" role="img" aria-label={showAssets ? 'Furnished 2D space blueprint' : '10 by 7 metre space blueprint'}>
      <defs>
        <pattern id={`afterglow-grid-${mode}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M18 0H0V18" fill="none" stroke="#cbd5e1" strokeWidth="0.65" opacity="0.55" />
        </pattern>
        <linearGradient id={`afterglow-floor-${mode}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#faf9ff" />
          <stop offset="1" stopColor="#f1eff9" />
        </linearGradient>
      </defs>

      <rect width="520" height="340" rx="18" fill="#f8fafc" />
      <rect x="44" y="42" width="432" height="252" rx="4" fill={`url(#afterglow-floor-${mode})`} />
      <rect x="44" y="42" width="432" height="252" rx="4" fill={`url(#afterglow-grid-${mode})`} />

      <g fill="#0ea5e9" stroke="#0ea5e9" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="9" fontWeight="700">
        <line x1="44" y1="24" x2="476" y2="24" strokeWidth="1.3" />
        <line x1="44" y1="19" x2="44" y2="29" strokeWidth="1.3" />
        <line x1="476" y1="19" x2="476" y2="29" strokeWidth="1.3" />
        <rect x="234" y="14" width="52" height="19" rx="8" fill="#f8fafc" />
        <text x="260" y="27" textAnchor="middle" stroke="none">10.0m</text>
        <line x1="25" y1="42" x2="25" y2="294" strokeWidth="1.3" />
        <line x1="20" y1="42" x2="30" y2="42" strokeWidth="1.3" />
        <line x1="20" y1="294" x2="30" y2="294" strokeWidth="1.3" />
        <rect x="8" y="145" width="34" height="19" rx="8" fill="#f8fafc" transform="rotate(-90 25 154.5)" />
        <text x="25" y="158" textAnchor="middle" stroke="none" transform="rotate(-90 25 158)">7.0m</text>
      </g>

      <rect x="41" y="38" width="438" height="13" rx="3" fill="#30254f" />
      <rect x="41" y="51" width="6" height="243" rx="3" fill="#794b8d" opacity="0.9" />
      <rect x="473" y="110" width="6" height="135" rx="3" fill="#367785" opacity="0.9" />
      <text x="260" y="47" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="800" letterSpacing="1.4">SPACE FEATURE WALL</text>

      {!showAssets && (
        <g>
          <rect x="128" y="104" width="264" height="128" rx="16" fill="#ffffff" opacity="0.78" stroke="#8b5cf6" strokeDasharray="6 5" />
          <text x="260" y="156" textAnchor="middle" fill="#312e81" fontSize="16" fontWeight="900">SPACE</text>
          <text x="260" y="181" textAnchor="middle" fill="#6366f1" fontSize="12" fontFamily="ui-monospace, SFMono-Regular, monospace" fontWeight="700">10.0m × 7.0m SPACE</text>
          <text x="260" y="204" textAnchor="middle" fill="#64748b" fontSize="9" letterSpacing="1.1">OPEN SOCIAL FLOOR PLAN</text>
        </g>
      )}

      {showAssets && (
        <g>
          <g opacity="0.9">
            <rect x="60" y="66" width="178" height="158" rx="5" fill="#b47ad4" fillOpacity="0.07" stroke="#b47ad4" strokeWidth="1.3" />
            {[78, 92, 106, 120, 134, 148, 162, 176, 190, 204].map((y) => (
              <line key={y} x1="68" y1={y} x2="230" y2={y} stroke="#b47ad4" strokeWidth="2" />
            ))}
          </g>

          <Symbol x={83} y={111} width={34} height={58} rotation={90} category="sofas-and-lounges" assetName="soft_ii" />
          <Symbol x={83} y={177} width={34} height={58} rotation={90} category="sofas-and-lounges" assetName="soft_ii" />
          <Symbol x={186} y={112} width={37} height={37} rotation={-90} category="chairs" assetName="egg_chair" className="text-slate-900" />
          <Symbol x={186} y={179} width={37} height={37} rotation={-90} category="chairs" assetName="egg_chair" className="text-slate-900" />
          <Symbol x={135} y={112} width={24} height={24} category="tables-and-bar-tables" assetName="round" />
          <Symbol x={135} y={179} width={24} height={24} category="tables-and-bar-tables" assetName="round" />

          {[330, 365, 400].map((x) => (
            <Symbol key={`buffet-${x}`} x={x} y={92} width={42} height={31} rotation={90} category="counters-and-showcases" assetName="lumino_buffet" className="text-cyan-700" />
          ))}
          {[330, 365, 400].map((x) => (
            <Symbol key={`barstool-${x}`} x={x} y={139} width={22} height={22} category="barstools-and-stools" assetName="petilia" />
          ))}
          <Symbol x={450} y={72} width={28} height={37} rotation={180} category="kitchen-and-miscellaneous" assetName="frigaro" />

          {[326, 414].map((x) => (
            <Symbol key={`cocktail-${x}`} x={x} y={238} width={39} height={39} category="tables-and-bar-tables" assetName="round" />
          ))}
          {[292, 354, 386, 450].map((x, index) => (
            <Symbol key={`social-stool-${x}`} x={x} y={269 + (index % 2) * 8} width={20} height={20} category="barstools-and-stools" assetName="petilia" />
          ))}

          <rect x="348" y="83" width="68" height="16" rx="3" fill="#22b8bd" />
          <text x="382" y="94" textAnchor="middle" fill="white" fontSize="8" fontWeight="900">krafc<tspan fill="#ff2bc2">.</tspan></text>

          <g fill="#64748b" fontSize="8" fontWeight="800" letterSpacing="1">
            <text x="149" y="239" textAnchor="middle">LOUNGE</text>
            <text x="366" y="167" textAnchor="middle">SOCIAL BAR</text>
            <text x="369" y="298" textAnchor="middle">COCKTAIL</text>
          </g>
        </g>
      )}

      <g transform="translate(393 310)">
        <rect width="83" height="18" rx="9" fill="#06b6d4" opacity="0.13" />
        <circle cx="10" cy="9" r="3" fill="#06b6d4" />
        <text x="18" y="12" fill="#0891b2" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8" fontWeight="800">LIVE SYNC</text>
      </g>
    </svg>
  )
}
