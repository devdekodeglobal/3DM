/**
 * blueprintMath.ts
 * Logic for calculating tiered CAD-style measurements with support for rotated assets.
 */

export interface MeasurementChain {
  id?: string;
  type: 'asset' | 'gap' | 'neighbor' | 'total';
  axis: 'x' | 'y' | 'z';
  mainLine: { x: number; y: number; z: number }[];
  extensionLines: { x: number; y: number; z: number }[][];
  label: string;
}

export function calculateBlueprintMeasurements(
  view: string,
  elements: any[],
  boothConfig: { width: number; depth: number }
): MeasurementChain[] {
  const chains: MeasurementChain[] = [];
  const PPM = 100;

  const items = elements.filter(el => el.type === 'asset' && !el.isOuter).map(el => {
    const w = el.width / PPM;
    const h = el.height / PPM;
    const x = el.x / PPM;
    const z = boothConfig.depth - (el.y / PPM);
    const rot = (el.rotation || 0) * (Math.PI / 180);
    const vH = (el.verticalScale || 1);
    const yOff = el.yOffset || 0;

    // Standard Rotated Corners (0:BL, 1:BR, 2:TR, 3:TL)
    const corners = [
      { x: -w/2, z: -h/2 }, { x: w/2, z: -h/2 },
      { x: w/2, z: h/2 }, { x: -w/2, z: h/2 }
    ].map(p => ({
      x: x + p.x * Math.cos(rot) - p.z * Math.sin(rot),
      z: z + p.x * Math.sin(rot) + p.z * Math.cos(rot)
    }));

    const xMin = Math.min(...corners.map(c => c.x));
    const xMax = Math.max(...corners.map(c => c.x));
    const zMin = Math.min(...corners.map(c => c.z));
    const zMax = Math.max(...corners.map(c => c.z));

    return {
      id: el.id,
      x, z, w, h, rot,
      corners,
      xMin, xMax, zMin, zMax,
      yMin: yOff, yMax: yOff + vH
    };
  });

  if (view === 'top') {
    const OFFSET = 0.35;

    items.forEach(item => {
      // Helper for aligned lines
      const addDim = (pA: any, pB: any, label: string, type: any) => {
        const dx = pB.x - pA.x;
        const dz = pB.z - pA.z;
        const len = Math.sqrt(dx*dx + dz*dz);
        if (len < 0.05) return;
        const nx = dx / len, nz = dz / len;
        const px = -nz, pz = nx; // Perpendicular

        const m1 = { x: pA.x + px * OFFSET, z: pA.z + pz * OFFSET };
        const m2 = { x: pB.x + px * OFFSET, z: pB.z + pz * OFFSET };

        chains.push({
          type, axis: Math.abs(nx) > Math.abs(nz) ? 'x' : 'z', label,
          mainLine: [{ x: m1.x, y: 0.1, z: m1.z }, { x: m2.x, y: 0.1, z: m2.z }],
          extensionLines: [
            [{ x: pA.x, y: 0, z: pA.z }, { x: m1.x + px * 0.05, y: 0, z: m1.z + pz * 0.05 }],
            [{ x: pB.x, y: 0, z: pB.z }, { x: m2.x + px * 0.05, y: 0, z: m2.z + pz * 0.05 }]
          ]
        });
      };

      // 1. Asset Dims (Aligned)
      addDim(item.corners[3], item.corners[2], `${item.w.toFixed(2)}m`, 'asset'); // Width
      addDim(item.corners[0], item.corners[3], `${item.h.toFixed(2)}m`, 'asset'); // Depth

      // 2. Wall Gaps (Horizontal - X)
      const leftC = item.corners.reduce((a, b) => a.x < b.x ? a : b);
      const rightC = item.corners.reduce((a, b) => a.x > b.x ? a : b);
      
      chains.push({
        type: 'gap', axis: 'x', label: `${leftC.x.toFixed(2)}m`,
        mainLine: [{ x: 0, y: 0.05, z: leftC.z }, { x: leftC.x, y: 0.05, z: leftC.z }],
        extensionLines: []
      });
      chains.push({
        type: 'gap', axis: 'x', label: `${(boothConfig.width - rightC.x).toFixed(2)}m`,
        mainLine: [{ x: rightC.x, y: 0.05, z: rightC.z }, { x: boothConfig.width, y: 0.05, z: rightC.z }],
        extensionLines: []
      });

      // 3. Wall Gaps (Vertical - Z)
      const backC = item.corners.reduce((a, b) => a.z < b.z ? a : b);
      const frontC = item.corners.reduce((a, b) => a.z > b.z ? a : b);

      chains.push({
        type: 'gap', axis: 'z', label: `${backC.z.toFixed(2)}m`,
        mainLine: [{ x: backC.x, y: 0.05, z: 0 }, { x: backC.x, y: 0.05, z: backC.z }],
        extensionLines: []
      });
      chains.push({
        type: 'gap', axis: 'z', label: `${(boothConfig.depth - frontC.z).toFixed(2)}m`,
        mainLine: [{ x: frontC.x, y: 0.05, z: frontC.z }, { x: frontC.x, y: 0.05, z: boothConfig.depth }],
        extensionLines: []
      });
    });
  }

  if (['north', 'south', 'east', 'west'].includes(view)) {
    const isH = view === 'north' || view === 'south';
    items.forEach(item => {
      const pMin = isH ? item.xMin : item.zMin, pMax = isH ? item.xMax : item.zMax;
      
      // Height (Main dimension for elevations)
      chains.push({
        type: 'asset', axis: 'y', label: `${(item.yMax - item.yMin).toFixed(2)}m`,
        mainLine: [createPoint(view, (pMin + pMax)/2 + 0.15, item.yMin, boothConfig), createPoint(view, (pMin + pMax)/2 + 0.15, item.yMax, boothConfig)],
        extensionLines: [
          [createPoint(view, (pMin + pMax)/2, item.yMin, boothConfig), createPoint(view, (pMin + pMax)/2 + 0.2, item.yMin, boothConfig)],
          [createPoint(view, (pMin + pMax)/2, item.yMax, boothConfig), createPoint(view, (pMin + pMax)/2 + 0.2, item.yMax, boothConfig)]
        ]
      });

      // Gap to floor
      if (item.yMin > 0.05) {
        chains.push({
          type: 'gap', axis: 'y', label: `${item.yMin.toFixed(2)}m`,
          mainLine: [createPoint(view, (pMin + pMax)/2, 0, boothConfig), createPoint(view, (pMin + pMax)/2, item.yMin, boothConfig)],
          extensionLines: []
        });
      }
    });
  }

  return chains;
}

function createPoint(view: string, pos: number, height: number, boothConfig: any) {
  switch (view) {
    case 'north': return { x: pos, y: height, z: 0.01 };
    case 'south': return { x: pos, y: height, z: boothConfig.depth - 0.01 };
    case 'east': return { x: boothConfig.width - 0.01, y: height, z: pos };
    case 'west': return { x: 0.01, y: height, z: pos };
    default: return { x: pos, y: 0, z: 0 };
  }
}
