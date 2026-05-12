import React, { useMemo } from 'react';
import * as BABYLON from '@babylonjs/core';
import { calculateBlueprintMeasurements } from '../../lib/blueprintMath';
import type { MeasurementChain } from '../../lib/blueprintMath';

interface BlueprintOverlayProps {
  scene: BABYLON.Scene | null;
  activeView: string;
  elements: any[];
  boothConfig: any;
}

const BlueprintOverlay: React.FC<BlueprintOverlayProps> = ({ scene, activeView, elements, boothConfig }) => {
  if (!scene || activeView === 'perspective') return null;

  const chains = useMemo(() => {
    return calculateBlueprintMeasurements(activeView, elements, boothConfig);
  }, [activeView, elements, boothConfig]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <p className="text-[10px] font-black tracking-[0.2em] text-white uppercase opacity-80 text-center">
          {activeView.toUpperCase()} ELEVATION • SCALE 1:100
        </p>
      </div>
      <svg className="w-full h-full">
        {chains.map((chain, cIdx) => (
          <MeasurementLine 
            key={cIdx} 
            chain={chain} 
            scene={scene} 
            activeView={activeView}
          />
        ))}
      </svg>
    </div>
  );
};

const MeasurementLine: React.FC<{ chain: MeasurementChain; scene: BABYLON.Scene; activeView: string }> = ({ chain, scene, activeView }) => {
  const engine = scene.getEngine();
  
  // Project all points to 2D screen coordinates
  const projectedPoints = chain.points.map(p => {
    const vector = new BABYLON.Vector3(p.x, p.y, p.z);
    const projected = BABYLON.Vector3.Project(
      vector,
      BABYLON.Matrix.Identity(),
      scene.getTransformMatrix(),
      scene.activeCamera!.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
    );
    return { x: projected.x, y: projected.y, world: p };
  });

  if (projectedPoints.length < 2) return null;

  return (
    <g>
      {/* Main Dimension Line */}
      <polyline
        points={projectedPoints.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="rgba(59, 130, 246, 0.8)"
        strokeWidth="1"
      />

      {/* Ticks, Labels, and Extension Lines */}
      {projectedPoints.map((p, i) => {
        const prev = i > 0 ? projectedPoints[i-1] : null;
        
        // Calculate a "base" point (closer to the object) for extension lines
        // For top view X-axis, the object is at Z=...
        let extX = p.x, extY = p.y;
        if (activeView === 'top') {
           // We need to project the actual object boundary to draw the extension line
           const baseVector = new BABYLON.Vector3(p.world.x, p.world.y, chain.axis === 'x' ? 0 : 0);
           const baseProj = BABYLON.Vector3.Project(
             baseVector, BABYLON.Matrix.Identity(), scene.getTransformMatrix(),
             scene.activeCamera!.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
           );
           extX = baseProj.x; extY = baseProj.y;
        }

        return (
          <g key={i}>
            {/* Extension Line */}
            <line 
              x1={p.x} y1={p.y} 
              x2={extX} y2={extY} 
              stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" 
            />

            {/* Architectural Tick */}
            <line 
              x1={p.x - 4} y1={p.y + 4} 
              x2={p.x + 4} y2={p.y - 4} 
              stroke="#3b82f6" strokeWidth="1.5" 
            />

            {/* Label for the segment leading to this point */}
            {prev && (
              <g>
                {/* Alternate label position to avoid overlap */}
                <text
                  x={(p.x + prev.x) / 2}
                  y={(p.y + prev.y) / 2 - (i % 2 === 0 ? 12 : 24)}
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-blue-400 select-none"
                  style={{ textShadow: '0 0 4px rgba(0,0,0,0.5)' }}
                >
                  {chain.labels[i - 1]}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default BlueprintOverlay;
