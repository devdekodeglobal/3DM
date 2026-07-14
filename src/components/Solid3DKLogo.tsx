import { useEffect, useState } from 'react';

export function Solid3DKLogo({ size = 36, className = "", progress = 1 }: { size?: number, className?: string, progress?: number }) {
  // Scale and offset to perfectly frame the front-facing cube
  const scale = 0.95;
  const offsetX = 50;
  const offsetY = 82; 
  
  // Isometric projection: u = Right Face (Right-Up), v = Left Face (Left-Up), y = Vertical (Up)
  const iso = (u: number, v: number, y: number) => {
    const su = u * scale;
    const sv = v * scale;
    const sy = y * scale;
    const pX = offsetX + su * 0.866 - sv * 0.866;
    const pY = offsetY - su * 0.5 - sv * 0.5 - sy;
    return `${pX.toFixed(2)},${pY.toFixed(2)}`;
  };

  // 2D K Profile Vertices - Standard K (Stems at the center corner)
  const kProfile = [
    [0, 0], [14, 0], [14, 18], [32, 0], [47, 0],
    [22, 25], [47, 50], [32, 50], [14, 32], [14, 50], [0, 50]
  ];

  // Draw an extrusion quad with dynamic CSS variables
  const drawQuad = (u1: number, v1: number, y1: number, u2: number, v2: number, y2: number, du: number, dv: number, dy: number, fillRule: string) => (
    <polygon 
      points={`${iso(u1, v1, y1)} ${iso(u2, v2, y2)} ${iso(u2+du, v2+dv, y2+dy)} ${iso(u1+du, v1+dv, y1+dy)}`} 
      fill={fillRule}
      stroke={fillRule}
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  );

  const drawRightQuad = (u1: number, y1: number, u2: number, y2: number, fillRule: string) => 
    drawQuad(u1, 0, y1, u2, 0, y2, 0, 14, 0, fillRule);

  const drawLeftQuad = (v1: number, y1: number, v2: number, y2: number, fillRule: string) => 
    drawQuad(0, v1, y1, 0, v2, y2, 14, 0, 0, fillRule);

  // Calculate slide transforms based on progress
  const currentGap = 2 + (1 - progress) * 58;
  const rightTx = currentGap * scale * 0.866;
  const rightTy = -currentGap * scale * 0.5;
  const rightTransform = `translate(${rightTx}px, ${rightTy}px)`;
  const leftTx = -currentGap * scale * 0.866;
  const leftTy = -currentGap * scale * 0.5;
  const leftTransform = `translate(${leftTx}px, ${leftTy}px)`;

  // Theme-synced shading rules using explicit CSS variables
  const leftFront = "var(--logo-left-front)";
  const leftTop = "var(--logo-left-top)";
  const leftSlope = "var(--logo-left-slope)";

  const rightFront = "var(--logo-right-front)";
  const rightTop = "var(--logo-right-top)";
  const rightSlope = "var(--logo-right-slope)";

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className} 
      style={{ overflow: 'visible', filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.15))' }}
    >
      {/* RIGHT K GROUP */}
      <g style={{ transform: rightTransform, transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        {/* Right K Extrusions */}
        {drawRightQuad(32, 50, 47, 50, rightTop)} {/* Top Arm Top */}
        {drawRightQuad(14, 32, 32, 50, rightSlope)} {/* Top Arm Slope */}
        {drawRightQuad(22, 25, 47, 0, rightSlope)}  {/* Bottom Arm Slope */}
        {drawRightQuad(0, 50, 14, 50, rightTop)}  {/* Stem Top */}

        {/* Right K Front Face */}
        <polygon 
          points={kProfile.map(([u, y]) => iso(u, 0, y)).join(' ')} 
          fill={rightFront}
          stroke={rightFront}
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </g>

      {/* LEFT K GROUP */}
      <g style={{ transform: leftTransform, transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        {/* Left K Extrusions (Mapped for |< shape) */}
        {drawLeftQuad(47, 50, 33, 50, leftTop)}   {/* Stem Top */}
        {drawLeftQuad(15, 50, 0, 50, leftTop)}    {/* Top Arm Top */}
        {drawLeftQuad(25, 25, 0, 50, leftSlope)}  {/* Top Arm Outer Slope */}
        {drawLeftQuad(15, 0, 33, 18, leftTop)}    {/* Bottom Arm Inner Slope */}
        
        {/* Stem Gap Face (Visible from viewer angle) */}
        {drawLeftQuad(33, 18, 33, 32, leftSlope)}

        {/* Left K Front Face */}
        <polygon 
          points={kProfile.map(([u, y]) => iso(0, 47 - u, y)).join(' ')} 
          fill={leftFront}
          stroke={leftFront}
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
