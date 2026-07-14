export function IsometricKLogo({ size = 32, className = "" }: { size?: number, className?: string }) {
  // Center is (50, 50), Radius is 40
  // W = 40 * cos(30) = 34.641
  // H = 40 * sin(30) = 20

  const mapLeft = (u: number, v: number) => `${15.359 + 34.641 * u},${30 + 20 * u + 40 * v}`;
  const mapRight = (u: number, v: number) => `${50 + 34.641 * u},${50 - 20 * u + 40 * v}`;

  // Perfectly symmetrical blocky 'K' coordinates in u,v space [0, 1]
  const kPolys = [
    // Stem
    [[0.05, 0.05], [0.35, 0.05], [0.35, 0.95], [0.05, 0.95]],
    // Top arm
    [[0.35, 0.2], [0.95, 0.05], [0.95, 0.35], [0.35, 0.5]],
    // Bottom arm
    [[0.35, 0.5], [0.95, 0.65], [0.95, 0.95], [0.35, 0.8]]
  ];

  const renderPolys = (mapFn: (u: number, v: number) => string, fill: string) => (
    <g fill={fill}>
      {kPolys.map((poly, i) => (
        <polygon key={i} points={poly.map(([u, v]) => mapFn(u, v)).join(' ')} />
      ))}
    </g>
  );

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      style={{ overflow: 'visible', filter: 'drop-shadow(0px 3px 4px rgba(0,0,0,0.15))' }}
    >
      {/* Top Face */}
      <polygon points="50,50 15.359,30 50,10 84.641,30" fill="var(--brand)" />
      <polygon points="50,50 15.359,30 50,10 84.641,30" fill="white" fillOpacity="0.25" />

      {/* Left Face Background */}
      <polygon points="50,50 15.359,30 15.359,70 50,90" fill="var(--brand)" />
      
      {/* Right Face Background */}
      <polygon points="50,50 84.641,30 84.641,70 50,90" fill="var(--brand)" />
      <polygon points="50,50 84.641,30 84.641,70 50,90" fill="black" fillOpacity="0.2" />

      {/* The K carved into Left Face (using background color) */}
      {renderPolys(mapLeft, "var(--bg)")}
      
      {/* The K carved into Right Face (using background color) */}
      {renderPolys(mapRight, "var(--bg)")}
    </svg>
  );
}
