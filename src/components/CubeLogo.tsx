import React from 'react'

export function CubeLogo({ size = 28, animate = false, flat = false }: { size?: number, animate?: boolean, flat?: boolean }) {
  const halfSize = size / 2
  const fontSize = size * 0.55
  const s = Math.round(size)

  return (
    <div style={{ width: size, height: size, perspective: size * 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .k-cube-${s} {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transform: ${flat ? 'rotateX(0deg) rotateY(0deg) scale(1)' : 'rotateX(-20deg) rotateY(35deg) scale(0.85)'};
          transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .k-cube-${s}.animate {
          animation: spinCubeLogo-${s} 4s infinite linear;
        }
        .k-cube-wrapper:hover .k-cube-${s}:not(.animate) {
          transform: rotateX(-20deg) rotateY(125deg) scale(0.85);
        }
        .k-cube-face-${s} {
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: var(--brand);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: ${fontSize}px;
          color: white;
          border-radius: ${flat ? '6px' : '2px'};
          transition: border-radius 1.2s ease, box-shadow 1.2s ease;
          box-shadow: ${flat ? 'none' : `inset 0 0 ${size/3}px rgba(0,0,0,0.2)`};
        }
        .k-cube-face-${s}.top-${s}, .k-cube-face-${s}.bottom-${s} {
          background: var(--brand);
          filter: brightness(1.2);
        }
        .front-${s}  { transform: rotateY(  0deg) translateZ(${halfSize}px); }
        .right-${s}  { transform: rotateY( 90deg) translateZ(${halfSize}px); }
        .back-${s}   { transform: rotateY(180deg) translateZ(${halfSize}px); }
        .left-${s}   { transform: rotateY(-90deg) translateZ(${halfSize}px); }
        .top-${s}    { transform: rotateX( 90deg) translateZ(${halfSize}px); }
        .bottom-${s} { transform: rotateX(-90deg) translateZ(${halfSize}px); }
        
        @keyframes spinCubeLogo-${s} {
          0% { transform: rotateX(-20deg) rotateY(0deg) scale(0.85); }
          100% { transform: rotateX(-20deg) rotateY(360deg) scale(0.85); }
        }
      `}} />
      <div className="k-cube-wrapper" style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
        <div className={`k-cube-${s} ${animate ? 'animate' : ''}`}>
          <div className={`k-cube-face-${s} front-${s}`}>K</div>
          <div className={`k-cube-face-${s} right-${s}`}>K</div>
          <div className={`k-cube-face-${s} back-${s}`}>K</div>
          <div className={`k-cube-face-${s} left-${s}`}>K</div>
          <div className={`k-cube-face-${s} top-${s}`}></div>
          <div className={`k-cube-face-${s} bottom-${s}`}></div>
        </div>
      </div>
    </div>
  )
}
