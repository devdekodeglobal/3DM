import React from 'react'

export function ThreeDK({ text = "k" }: { text?: string }) {
  const depth = 14; // How thick the 3D extrusion is

  return (
    <div className="inline-flex items-center justify-center relative" style={{ perspective: '500px', width: '1em', height: '1.2em' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .text-3d-container {
          transform-style: preserve-3d;
          animation: wobble-3d 6s ease-in-out infinite;
          display: inline-flex;
          position: absolute;
          inset: 0;
          align-items: center;
          justify-content: center;
        }
        .text-3d-container:hover {
          animation: none;
          transform: rotateY(-15deg) rotateX(15deg) scale(1.1) !important;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes wobble-3d {
          0%, 100% { transform: rotateY(-25deg) rotateX(5deg); }
          50% { transform: rotateY(25deg) rotateX(-10deg); }
        }
        .text-3d-layer {
          position: absolute;
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: 1.5rem;
          line-height: 1;
        }
      `}} />
      <div className="text-3d-container cursor-pointer z-20">
        {Array.from({ length: depth }).map((_, i) => {
          const isFront = i === 0;
          const isBack = i === depth - 1;
          return (
            <span 
              key={i} 
              className="text-3d-layer" 
              style={{ 
                transform: `translateZ(${-i * 1.5}px)`,
                color: isFront ? 'var(--brand)' : 'var(--brand)',
                filter: isFront ? 'brightness(1.2) drop-shadow(0px 0px 2px rgba(255,255,255,0.2))' : `brightness(${0.9 - i * 0.04})`,
                textShadow: isBack ? '-4px 8px 12px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {text}
            </span>
          )
        })}
      </div>
    </div>
  )
}
