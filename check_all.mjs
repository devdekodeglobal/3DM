import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF/index.js';
import fs from 'fs';
import path from 'path';

global.HTMLElement = class {};
global.window = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.document = {
  createElement: () => ({
    addEventListener: () => {},
    removeEventListener: () => {}
  })
};
global.navigator = { userAgent: 'node' };

const engine = new BABYLON.NullEngine();
const scene = new BABYLON.Scene(engine);

const assetsDir = '/Users/vanosski/Main/Projects/Dekode/3dproj/public/models';
const categories = fs.readdirSync(assetsDir).filter(c => fs.statSync(path.join(assetsDir, c)).isDirectory());

async function checkAsset(category, file) {
  const fullPath = path.join(assetsDir, category, file);
  if (!fullPath.endsWith('.glb')) return;
  
  const data = fs.readFileSync(fullPath);
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

  return new Promise((resolve) => {
    BABYLON.SceneLoader.LoadAssetContainerAsync("file:", arrayBuffer, scene, ".glb").then(container => {
      const root = container.createRootMesh();
      container.addAllToScene();
      
      root.computeWorldMatrix(true);
      const boundingInfo = root.getHierarchyBoundingVectors(true);
      
      let highestY = -Infinity;
      const meshes = container.meshes;
      
      meshes.forEach(m => {
        if (!m.getVerticesData) return;
        const positions = m.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        if (!positions) return;
        
        const wm = m.computeWorldMatrix(true);
        for (let i = 0; i < positions.length; i += 3) {
          const v = BABYLON.Vector3.TransformCoordinates(
            new BABYLON.Vector3(positions[i], positions[i+1], positions[i+2]),
            wm
          );
          if (v.y > highestY) highestY = v.y;
        }
      });
      
      const thresholdY = boundingInfo.min.y + (boundingInfo.max.y - boundingInfo.min.y) * 0.85;
      
      let topCenterX = 0;
      let topCenterZ = 0;
      let topCount = 0;
      
      meshes.forEach(m => {
        if (!m.getVerticesData) return;
        const positions = m.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        if (!positions) return;
        
        const wm = m.computeWorldMatrix(true);
        for (let i = 0; i < positions.length; i += 3) {
          const v = BABYLON.Vector3.TransformCoordinates(
            new BABYLON.Vector3(positions[i], positions[i+1], positions[i+2]),
            wm
          );
          if (v.y > thresholdY) {
            topCenterX += v.x;
            topCenterZ += v.z;
            topCount++;
          }
        }
      });
      
      if (topCount > 0) {
        topCenterX /= topCount;
        topCenterZ /= topCount;
        
        const cx = (boundingInfo.max.x + boundingInfo.min.x) / 2;
        const cz = (boundingInfo.max.z + boundingInfo.min.z) / 2;
        
        const dx = topCenterX - cx;
        const dz = topCenterZ - cz;
        
        console.log(`[${file}] DX=${dx.toFixed(3)}, DZ=${dz.toFixed(3)} -> Probable Backrest: ${Math.abs(dz) > Math.abs(dx) ? (dz>0?'+Z':'-Z') : (dx>0?'+X':'-X')}`);
      } else {
        console.log(`[${file}] Could not determine backrest`);
      }
      
      container.removeAllFromScene();
      resolve();
    });
  });
}

async function main() {
  for (const cat of categories) {
    if (cat === 'architecture' || cat === 'electrical') continue;
    const files = fs.readdirSync(path.join(assetsDir, cat)).filter(f => f.endsWith('.glb'));
    for (const f of files) {
      if (f.includes('aiko') || f.includes('solana') || f.includes('baggio') || f.includes('egg_chair') || f.includes('soft_ii')) {
        await checkAsset(cat, f);
      }
    }
  }
  engine.dispose();
}

main();
