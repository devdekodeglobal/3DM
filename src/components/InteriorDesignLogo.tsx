export function InteriorDesignLogo({ size = 34, className = "" }: { size?: number, className?: string }) {
  // Mapping for the 3D K Block in the center of the room
  // Block center bottom is (50, 70). Radius = 18. W = 15.588, H = 9
  // Top Face center = (50, 52).
  const mapLeft = (u: number, v: number) => `${34.412 + 15.588 * u},${43 + 9 * u + 18 * v}`;
  const mapRight = (u: number, v: number) => `${50 + 15.588 * u},${52 - 9 * u + 18 * v}`;

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
      style={{ overflow: 'visible', filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.15))' }}
    >
      {/* Left Wall */}
      <polygon points="50,45 50,5 15,25 15,65" fill="var(--brand)" />
      
      {/* Right Wall */}
      <polygon points="50,45 50,5 85,25 85,65" fill="var(--brand)" />
      <polygon points="50,45 50,5 85,25 85,65" fill="black" fillOpacity="0.15" />

      {/* Floor */}
      <polygon points="50,45 15,65 50,85 85,65" fill="var(--brand)" />
      <polygon points="50,45 15,65 50,85 85,65" fill="black" fillOpacity="0.3" />

      {/* Blueprint Grid Lines on Floor */}
      <path 
        d="M 22,61 L 57,81 M 29,57 L 64,77 M 36,53 L 71,73 M 43,49 L 78,69" 
        stroke="white" strokeWidth="0.75" strokeOpacity="0.2" 
      />
      <path 
        d="M 78,61 L 43,81 M 71,57 L 36,77 M 64,53 L 29,73 M 57,49 L 22,69" 
        stroke="white" strokeWidth="0.75" strokeOpacity="0.2" 
      />

      {/* 3D Kreatekaro Block Inside the Room */}
      <g>
        {/* Block Shadow on Floor */}
        <polygon points="50,70 34.412,61 40,55 55.588,64" fill="black" fillOpacity="0.25" />
        
        {/* Block Top Face */}
        <polygon points="50,52 34.412,43 50,34 65.588,43" fill="white" />
        
        {/* Block Left Face */}
        <polygon points="34.412,43 50,52 50,70 34.412,61" fill="#f0f0f0" />
        
        {/* Block Right Face */}
        <polygon points="50,52 65.588,43 65.588,61 50,70" fill="#e0e0e0" />

        {/* The K carved into Left Face (shows floor color / dark brand) */}
        {renderPolys(mapLeft, "var(--brand)")}
        {renderPolys(mapLeft, "rgba(0,0,0,0.2)")}
        
        {/* The K carved into Right Face (shows floor color / dark brand) */}
        {renderPolys(mapRight, "var(--brand)")}
        {renderPolys(mapRight, "rgba(0,0,0,0.3)")}
      </g>
    </svg>
  );
}
