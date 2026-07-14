export function HouseKLogo({ size = 32, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
    >
      {/* 
        The logo is a perfect geometric house shape (pentagon) 
        flawlessly divided into 4 architectural blocks.
        The negative space between these blocks forms a precise, dynamic 'K'.
      */}
      <g 
        fill="var(--brand)" 
        stroke="var(--brand)" 
        strokeWidth="4" 
        strokeLinejoin="round" 
        strokeLinecap="round"
      >
        {/* Left Pillar (Left side of the house) */}
        <polygon points="12,88 12,50 30,32 30,88" />
        
        {/* Roof Tip (Top right wedge) */}
        <polygon points="44,47 44,18 50,12 65.5,27.5" />
        
        {/* Middle Block (Right wall and roof slope) */}
        <polygon points="52,55 73.5,33.5 88,48 88,88 85,88" />
        
        {/* Bottom Right Block (Base of the house) */}
        <polygon points="44,63 69,88 44,88" />
      </g>
    </svg>
  );
}
