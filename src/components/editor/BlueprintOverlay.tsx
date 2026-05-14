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
          />
        ))}
      </svg>
    </div>
  );
};

const MeasurementLine: React.FC<{ chain: MeasurementChain; scene: BABYLON.Scene }> = ({ chain, scene }) => {
  const engine = scene.getEngine();
  
  // Project all points to 2D screen coordinates
  const projectedPoints = chain.mainLine.map((p: { x: number; y: number; z: number }) => {
    const vector = new BABYLON.Vector3(p.x, p.y, p.z);
    const projected = BABYLON.Vector3.Project(
      vector,
      BABYLON.Matrix.Identity(),
      scene.getTransformMatrix(),
      scene.activeCamera!.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
    );
    return { x: projected.x, y: projected.y, world: p };
  });

  // Project extension lines
  const projectedExtensionLines = (chain.extensionLines || []).map(line => 
    line.map((p: { x: number; y: number; z: number }) => {
      const vector = new BABYLON.Vector3(p.x, p.y, p.z);
      const projected = BABYLON.Vector3.Project(
        vector,
        BABYLON.Matrix.Identity(),
        scene.getTransformMatrix(),
        scene.activeCamera!.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
      );
      return { x: projected.x, y: projected.y };
    })
  );

  if (projectedPoints.length < 2) return null;

  return (
    <g>
      {/* Extension Lines */}
      {projectedExtensionLines.map((line, idx) => line.length >= 2 && (
        <line 
          key={`ext-${idx}`}
          x1={line[0].x} y1={line[0].y} 
          x2={line[1].x} y2={line[1].y} 
          stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" 
        />
      ))}

      {/* Main Dimension Line */}
      <polyline
        points={projectedPoints.map((p: { x: number; y: number }) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="rgba(59, 130, 246, 0.8)"
        strokeWidth="1"
      />

      {/* Architectural Ticks */}
      {projectedPoints.map((p: { x: number; y: number }, i: number) => (
        <line 
          key={`tick-${i}`}
          x1={p.x - 4} y1={p.y + 4} 
          x2={p.x + 4} y2={p.y - 4} 
          stroke="#3b82f6" strokeWidth="1.5" 
        />
      ))}

      {/* Label (centered on the segment) */}
      <text
        x={(projectedPoints[0].x + projectedPoints[projectedPoints.length - 1].x) / 2}
        y={(projectedPoints[0].y + projectedPoints[projectedPoints.length - 1].y) / 2 - 12}
        textAnchor="middle"
        className="text-[9px] font-bold fill-blue-400 select-none"
        style={{ textShadow: '0 0 4px rgba(0,0,0,0.5)' }}
      >
        {chain.label}
      </text>
    </g>
  );
};

export default BlueprintOverlay;
