import { useEffect, useRef, useState } from 'react'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

interface Preview3DProps {
  boothConfig: any;
  elements: any[];
}

const PPM = 100;

export default function Preview3D({ boothConfig, elements }: Preview3DProps) {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'flight'>('orbit');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const shadowGeneratorRef = useRef<BABYLON.ShadowGenerator | null>(null);

  const meshRegistryRef = useRef<Map<string, BABYLON.AbstractMesh>>(new Map());
  const structureRegistryRef = useRef<BABYLON.AbstractMesh[]>([]);
  const lastBoothDimRef = useRef({ w: 0, d: 0 });

  // 1. Initial Setup Hook
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true, stencil: true, antialias: true
    });
    engineRef.current = engine;

    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new BABYLON.Color4(0.07, 0.07, 0.09, 1.0);

    // Camera 1: Orbit Camera
    const orbitCam = new BABYLON.ArcRotateCamera("orbitCam",
      BABYLON.Tools.ToRadians(-45), BABYLON.Tools.ToRadians(55),
      20,
      new BABYLON.Vector3(0, 0.5, 0),
      scene
    );
    orbitCam.lowerRadiusLimit = 0.1;
    orbitCam.upperRadiusLimit = 100.0;
    orbitCam.wheelPrecision = 100;
    orbitCam.minZ = 0.01;
    orbitCam.panningSensibility = 50;

    // Camera 2: Flight Camera
    const flightCam = new BABYLON.UniversalCamera("flightCam", new BABYLON.Vector3(0, 3, -10), scene);
    flightCam.setTarget(new BABYLON.Vector3(0, 1, 0));
    flightCam.keysUp.push(87);    // W
    flightCam.keysDown.push(83);  // S
    flightCam.keysLeft.push(65);  // A
    flightCam.keysRight.push(68); // D
    flightCam.keysUpward.push(69);   // E
    flightCam.keysDownward.push(81); // Q
    flightCam.speed = 0.2;
    flightCam.angularSensibility = 2000;
    flightCam.minZ = 0.05;

    // Set default
    scene.activeCamera = orbitCam;
    orbitCam.attachControl(canvasRef.current, true);

    // Lighting setup
    const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemi.intensity = 0.6;
    hemi.diffuse = new BABYLON.Color3(1.0, 0.98, 0.95);
    hemi.groundColor = new BABYLON.Color3(0.4, 0.35, 0.28);

    const dirLight = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-1, -2, -1), scene);
    dirLight.intensity = 0.8;
    dirLight.diffuse = new BABYLON.Color3(1.0, 0.95, 0.85);

    const shadowGenerator = new BABYLON.ShadowGenerator(2048, dirLight);
    shadowGeneratorRef.current = shadowGenerator;
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 16;

    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    setIsSceneReady(true);

    return () => {
      setIsSceneReady(false);
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);

  // 2. Sync Booth Config
  useEffect(() => {
    if (!isSceneReady || !boothConfig) return;
    const scene = sceneRef.current;
    const shadowGenerator = shadowGeneratorRef.current;
    if (!scene || !shadowGenerator) return;

    structureRegistryRef.current.forEach(mesh => mesh.dispose());
    structureRegistryRef.current = [];

    const centerX = boothConfig.width / 2;
    const centerZ = boothConfig.depth / 2;

    if (lastBoothDimRef.current.w !== boothConfig.width || lastBoothDimRef.current.d !== boothConfig.depth) {
      const orbitCam = scene.getCameraByName("orbitCam") as BABYLON.ArcRotateCamera;
      if (orbitCam) {
        orbitCam.setTarget(new BABYLON.Vector3(centerX, 0.5, centerZ));
        orbitCam.radius = Math.max(boothConfig.width, boothConfig.depth) * 1.5 + 2;
      }
      lastBoothDimRef.current = { w: boothConfig.width, d: boothConfig.depth };
    }

    const floor = BABYLON.MeshBuilder.CreateGround("floor", { width: boothConfig.width, height: boothConfig.depth }, scene);
    floor.position = new BABYLON.Vector3(centerX, -0.02, centerZ);
    floor.receiveShadows = true;

    const floorMat = new BABYLON.StandardMaterial("floorMat", scene);
    floorMat.maxSimultaneousLights = 16; // Support many wall lights
    const floorType = boothConfig.floorType || 'hardwood';

    if (floorType === 'carpet') {
      floorMat.diffuseColor = new BABYLON.Color3(0.18, 0.25, 0.31);
      floorMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    } else {
      const texPath = `/assets/textures/${floorType}.png`;
      const texture = new BABYLON.Texture(texPath, scene);
      // Tile textures roughly every 2 meters
      texture.uScale = boothConfig.width / 2;
      texture.vScale = boothConfig.depth / 2;
      floorMat.diffuseTexture = texture;

      if (floorType === 'marble') {
        floorMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        floorMat.specularPower = 64;
      } else if (floorType === 'hardwood') {
        floorMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        floorMat.specularPower = 32;
      } else if (floorType === 'concrete') {
        floorMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        floorMat.specularPower = 16;
      }
    }

    floor.material = floorMat;
    structureRegistryRef.current.push(floor);

  }, [boothConfig, isSceneReady]);

  // 3. Sync Elements
  useEffect(() => {
    if (!isSceneReady || !elements || !boothConfig) return;
    const scene = sceneRef.current;
    const shadowGenerator = shadowGeneratorRef.current;
    if (!scene || !shadowGenerator) return;

    const currentIds = new Set(elements.map(el => el.id));
    const registry = meshRegistryRef.current;

    registry.forEach((mesh, id) => {
      if (!currentIds.has(id)) {
        mesh.dispose();
        registry.delete(id);
      }
    });

    elements.forEach(el => {
      const x = el.x / PPM;
      const z = boothConfig.depth - (el.y / PPM);
      const rotY = BABYLON.Tools.ToRadians(el.rotation || 0);
      const h = 2.5;

      let needsRecreate = false;
      const currentWallState = JSON.stringify({
        elements: el.wallElements || [],
        thickness: el.thickness || 10,
        material: el.material || 'Solid Wall'
      });
      if (registry.has(el.id) && el.type === 'wall') {
        const mesh = registry.get(el.id)!;
        if (!mesh.metadata || mesh.metadata.wallState !== currentWallState) {
          needsRecreate = true;
        }
      }

      if (registry.has(el.id) && !needsRecreate) {
        const mesh = registry.get(el.id)!;
        mesh.position.x = x;
        mesh.position.z = z;
        if (mesh.rotationQuaternion) mesh.rotationQuaternion = null;
        mesh.rotation.y = rotY;
        if (el.type !== 'wall' && mesh.metadata && mesh.metadata.nativeLength) {
          const targetW = el.width / PPM;
          const scale = targetW / mesh.metadata.nativeLength;
          mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
        }
      } else {
        if (needsRecreate) {
          const oldMesh = registry.get(el.id)!;
          oldMesh.dispose();
          registry.delete(el.id);
        }

        if (el.type === 'wall') {
          const wVal = el.width / PPM;
          const dVal = (el.thickness || 10) / PPM;
          let mesh = BABYLON.MeshBuilder.CreateBox(el.id + "_base", { width: wVal, height: h, depth: dVal }, scene);

          if (el.wallElements && el.wallElements.length > 0) {
            const cutoutTypes = ['door', 'window'];
            const cutouts = el.wallElements.filter((we: any) => cutoutTypes.includes(we.type));
            const mounted = el.wallElements.filter((we: any) => !cutoutTypes.includes(we.type));

            let wallCSG = BABYLON.CSG.FromMesh(mesh);
            const attachments: BABYLON.Mesh[] = [];
            const trimColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Anodized Charcoal
            const frameThick = 0.04;

            cutouts.forEach((wel: any, index: number) => {
              const cutW = wel.width / PPM, cutH = wel.height / PPM, cutD = dVal + 0.1;
              const localX = (wel.x / PPM) - (wVal / 2) + (cutW / 2);
              const localY = (h / 2) - (wel.y / PPM) - (cutH / 2);
              const cutBox = BABYLON.MeshBuilder.CreateBox("cut_" + el.id + index, { width: cutW, height: cutH, depth: cutD }, scene);
              cutBox.position.set(localX, localY, 0);
              wallCSG = wallCSG.subtract(BABYLON.CSG.FromMesh(cutBox));
              cutBox.dispose();
               if (wel.type === 'window') {
                const frameMat = new BABYLON.StandardMaterial("frameMat_" + el.id + index, scene);
                frameMat.diffuseColor = trimColor;
                
                // Build frame from 4 edge strips — leaving center OPEN so glass is truly transparent
                const ft = frameThick; // shorthand
                // Top bar
                const fTop = BABYLON.MeshBuilder.CreateBox("fTop_" + el.id + index, { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                fTop.position.set(localX, localY + (cutH / 2) - (ft / 2), 0);
                fTop.material = frameMat; attachments.push(fTop);
                // Bottom bar
                const fBot = BABYLON.MeshBuilder.CreateBox("fBot_" + el.id + index, { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                fBot.position.set(localX, localY - (cutH / 2) + (ft / 2), 0);
                fBot.material = frameMat; attachments.push(fBot);
                // Left bar
                const fLeft = BABYLON.MeshBuilder.CreateBox("fLeft_" + el.id + index, { width: ft, height: cutH - ft * 2, depth: dVal + 0.02 }, scene);
                fLeft.position.set(localX - (cutW / 2) + (ft / 2), localY, 0);
                fLeft.material = frameMat; attachments.push(fLeft);
                // Right bar
                const fRight = BABYLON.MeshBuilder.CreateBox("fRight_" + el.id + index, { width: ft, height: cutH - ft * 2, depth: dVal + 0.02 }, scene);
                fRight.position.set(localX + (cutW / 2) - (ft / 2), localY, 0);
                fRight.material = frameMat; attachments.push(fRight);
                // Center cross-mullion (thin horizontal bar)
                const mullH = BABYLON.MeshBuilder.CreateBox("mullH_" + el.id + index, { width: cutW - ft * 2, height: 0.012, depth: dVal + 0.025 }, scene);
                mullH.position.set(localX, localY, 0);
                mullH.material = frameMat; attachments.push(mullH);
                // Center cross-mullion (thin vertical bar)
                const mullV = BABYLON.MeshBuilder.CreateBox("mullV_" + el.id + index, { width: 0.012, height: cutH - ft * 2, depth: dVal + 0.025 }, scene);
                mullV.position.set(localX, localY, 0);
                mullV.material = frameMat; attachments.push(mullV);

                // Glass plane — in the open center, offset slightly toward interior
                const glass = BABYLON.MeshBuilder.CreatePlane("glass_" + el.id + index, { width: cutW - ft * 2, height: cutH - ft * 2 }, scene);
                glass.position.set(localX, localY, dVal / 2 + 0.005);
                const glassMat = new BABYLON.StandardMaterial("glassMat_" + el.id + index, scene);
                glassMat.diffuseColor = new BABYLON.Color3(0.6, 0.85, 1.0);
                glassMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
                glassMat.specularPower = 128;
                glassMat.alpha = 0.25;
                glassMat.backFaceCulling = false;
                glass.material = glassMat; attachments.push(glass);
              } else if (wel.type === 'door') {
                const frame = BABYLON.MeshBuilder.CreateBox("frame_" + el.id + index, { width: cutW, height: cutH, depth: dVal + 0.02 }, scene);
                frame.position.set(localX, localY, 0);
                const frameMat = new BABYLON.StandardMaterial("frameMat_" + el.id + index, scene);
                frameMat.diffuseColor = trimColor;
                frame.material = frameMat;
                attachments.push(frame);

                const door = BABYLON.MeshBuilder.CreateBox("door_" + el.id + index, { width: cutW - frameThick * 2, height: cutH - frameThick, depth: 0.04 }, scene);
                door.position.set(localX, localY - frameThick / 2, 0);
                const doorMat = new BABYLON.StandardMaterial("doorMat_" + el.id + index, scene);
                doorMat.diffuseColor = trimColor.scale(1.1); 
                door.material = doorMat; attachments.push(door);

                // Door Handle
                const handle = BABYLON.MeshBuilder.CreateSphere("handle_" + el.id + index, { diameter: 0.04 }, scene);
                handle.position.set(localX + (cutW / 2) - 0.12, localY - 0.1, 0.05);
                const handleMat = new BABYLON.StandardMaterial("handleMat", scene);
                handleMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
                handle.material = handleMat; attachments.push(handle);
              }
            });

            mounted.forEach((wel: any, index: number) => {
              const mW = wel.width / PPM, mH = wel.height / PPM;
              const localX = (wel.x / PPM) - (wVal / 2) + (mW / 2);
              const localY = (h / 2) - (wel.y / PPM) - (mH / 2);
              const faceZ = dVal / 2 + 0.01;

              if (wel.type === 'shelf') {
                const shelfDepth = 0.25;
                const shelf = BABYLON.MeshBuilder.CreateBox("shelf_" + el.id + index, { width: mW, height: 0.03, depth: shelfDepth }, scene);
                shelf.position.set(localX, localY, faceZ + shelfDepth / 2);
                const shelfMat = new BABYLON.StandardMaterial("shelfMat_" + el.id + index, scene);
                shelfMat.diffuseColor = new BABYLON.Color3(0.42, 0.28, 0.18);
                shelf.material = shelfMat; attachments.push(shelf);
              } else if (wel.type === 'banner' || wel.type === 'frame') {
                let banner;
                if (wel.type === 'frame' && wel.shape === 'circle') {
                  // Use a Disc for circular frames to ensure perfect UV orientation
                  banner = BABYLON.MeshBuilder.CreateDisc("frame_" + el.id + index, { radius: Math.min(mW, mH) / 2, tessellation: 64 }, scene);
                  banner.rotation.y = Math.PI; 
                } else {
                  banner = BABYLON.MeshBuilder.CreatePlane("banner_" + el.id + index, { width: mW, height: mH }, scene);
                  banner.rotation.y = Math.PI;
                }
                banner.position.set(localX, localY, faceZ + 0.005);
                const bannerMat = new BABYLON.StandardMaterial("bannerMat_" + el.id + index, scene);
                if (wel.url) {
                  const texture = new BABYLON.Texture(wel.url, scene);
                  bannerMat.diffuseTexture = texture;
                  bannerMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                } else {
                  bannerMat.diffuseColor = wel.type === 'frame' ? new BABYLON.Color3(0.9, 0.9, 0.9) : new BABYLON.Color3(0.22, 0.36, 0.82);
                  bannerMat.emissiveColor = wel.type === 'frame' ? new BABYLON.Color3(0.1, 0.1, 0.1) : new BABYLON.Color3(0.05, 0.1, 0.3);
                }
                banner.material = bannerMat; attachments.push(banner);
              } else if (wel.type === 'light') {
                const modelName = wel.model || 'wall_light_1';
                // wall_light_1 = Square panel, wall_light_2 = Circle disc, wall_light_3 = Tube
                const style = modelName === 'wall_light_1' ? 'square' : modelName === 'wall_light_2' ? 'circle' : 'tube';
                const lCol = wel.lightColor ? BABYLON.Color3.FromHexString(wel.lightColor) : new BABYLON.Color3(1, 0.87, 0.55);
                const lIntensity = wel.intensity || 1.2;
                const lRange = wel.range || 3;

                const glowMat = new BABYLON.StandardMaterial("glowMat_" + el.id + index, scene);
                glowMat.emissiveColor = lCol;
                glowMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);

                let fixture: BABYLON.Mesh;

                if (style === 'square') {
                  // Dark backplate + glowing square face — slim border
                  const bp = BABYLON.MeshBuilder.CreateBox("bp_" + el.id + index, { width: mW * 0.84, height: mH * 0.84, depth: 0.03 }, scene);
                  const bpMat = new BABYLON.StandardMaterial("bpMat_" + el.id + index, scene);
                  bpMat.diffuseColor = new BABYLON.Color3(0.12, 0.12, 0.12);
                  bp.material = bpMat;
                  bp.position.set(localX, localY, faceZ + 0.015);
                  attachments.push(bp);

                  fixture = BABYLON.MeshBuilder.CreateBox("light_" + el.id + index, { width: mW * 0.72, height: mH * 0.72, depth: 0.01 }, scene);
                  fixture.position.set(localX, localY, faceZ + 0.03);

                } else if (style === 'circle') {
                  // Dark round backplate + glowing sphere — slim border
                  const bpC = BABYLON.MeshBuilder.CreateCylinder("bpC_" + el.id + index, { diameter: Math.min(mW, mH) * 0.87, height: 0.03, tessellation: 48 }, scene);
                  bpC.rotation.x = Math.PI / 2;
                  const bpCMat = new BABYLON.StandardMaterial("bpCMat_" + el.id + index, scene);
                  bpCMat.diffuseColor = new BABYLON.Color3(0.12, 0.12, 0.12);
                  bpC.material = bpCMat;
                  bpC.position.set(localX, localY, faceZ + 0.015);
                  attachments.push(bpC);

                  fixture = BABYLON.MeshBuilder.CreateSphere("light_" + el.id + index, { diameter: Math.min(mW, mH) * 0.6, segments: 16 }, scene);
                  fixture.position.set(localX, localY, faceZ + 0.045);

                } else {
                  // Tube — horizontal glowing cylinder, flush to wall, no backplate
                  fixture = BABYLON.MeshBuilder.CreateCylinder("light_" + el.id + index, { height: mW * 0.9, diameter: 0.06, tessellation: 24 }, scene);
                  fixture.rotation.z = Math.PI / 2;
                  fixture.position.set(localX, localY, faceZ + 0.04);
                }

                fixture.material = glowMat;
                attachments.push(fixture);

                // Point light for all 3 types, parented to fixture
                const pLight = new BABYLON.PointLight("plight_" + el.id + index, new BABYLON.Vector3(0, 0, 0), scene);
                pLight.parent = fixture;
                pLight.diffuse = lCol;
                pLight.specular = lCol.scale(0.3);
                pLight.intensity = lIntensity * (style === 'tube' ? 1.5 : 1.0); // tubes spread wider
                pLight.range = lRange;
              }
            });

            const finalMesh = wallCSG.toMesh(el.id, null, scene);
            mesh.dispose(); mesh = finalMesh;
            attachments.forEach(att => { att.parent = mesh; });
          }

          mesh.position = new BABYLON.Vector3(x, h / 2, z);
          mesh.rotation.y = rotY;
          shadowGenerator.addShadowCaster(mesh);
          const mat = new BABYLON.StandardMaterial(el.id + "_mat", scene);
          if (el.material === 'Glass Wall') {
            mat.diffuseColor = new BABYLON.Color3(0.5, 0.8, 1.0);
            mat.alpha = 0.4;
            mat.specularColor = new BABYLON.Color3(1, 1, 1);
            mat.specularPower = 128;
          } else if (el.material === 'Wood') {
            const tex = new BABYLON.Texture("/assets/textures/hardwood.png", scene);
            tex.uScale = el.width / PPM; // Tile every 1m
            tex.vScale = h;
            mat.diffuseTexture = tex;
          } else if (el.material === 'Brick') {
            const tex = new BABYLON.Texture("/assets/textures/brick.png", scene);
            tex.uScale = (el.width / PPM) * 2; // Bricks are smaller
            tex.vScale = h * 2;
            mat.diffuseTexture = tex;
          } else {
            mat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
            mat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
          }
          mesh.material = mat;
          mat.maxSimultaneousLights = 16; // Support many wall lights
          if (!mesh.metadata) mesh.metadata = {};
          mesh.metadata.wallState = currentWallState;
          registry.set(el.id, mesh);
        } else {
          const modelName = el.assetName?.toLowerCase() || 'box';
          const pivot = BABYLON.MeshBuilder.CreateBox("pivot_" + el.id, { size: 0.01 }, scene);
          pivot.isVisible = false;
          pivot.position = new BABYLON.Vector3(x, 0, z);
          pivot.rotation.y = rotY;
          registry.set(el.id, pivot);
          BABYLON.SceneLoader.ImportMesh("", "/models/", `${modelName}.glb`, scene, (meshes) => {
            if (!registry.has(el.id)) { meshes.forEach(m => m.dispose()); return; }
            const root = meshes[0]; root.parent = pivot; root.position = BABYLON.Vector3.Zero();
            const targetW = el.width / PPM;
            setTimeout(() => {
              // Compute world-space bbox while parented (preserves glTF axis corrections)
              root.computeWorldMatrix(true);
              const bbox = root.getHierarchyBoundingVectors(true);
              const sz = bbox.max.subtract(bbox.min);
              const longest = Math.max(sz.x, sz.z);

              // Pivot world position (y=0 always for floor assets)
              const pPos = pivot.getAbsolutePosition();

              // Local correction = how much to shift root so bbox center aligns with pivot x/z
              // and bbox bottom sits on the floor (y=0)
              const worldCenterX = (bbox.min.x + bbox.max.x) / 2;
              const worldCenterZ = (bbox.min.z + bbox.max.z) / 2;

              root.position.x -= (worldCenterX - pPos.x);
              root.position.z -= (worldCenterZ - pPos.z);
              root.position.y += (pPos.y - bbox.min.y); // lift so bottom = floor

              // Scale pivot to match target 2D width
              if (longest > 0) {
                pivot.metadata = { nativeLength: longest };
                pivot.scaling = new BABYLON.Vector3(1, 1, 1);
                pivot.scaling.scaleInPlace(targetW / longest);
              }
            }, 100);
            meshes.forEach(m => { m.receiveShadows = true; shadowGenerator.addShadowCaster(m, true); });
          }, null, () => {
            if (!registry.has(el.id)) return;
            const fw = el.width / PPM, fd = el.height / PPM, fh = 0.8;
            const placeholder = BABYLON.MeshBuilder.CreateBox(`ph_${el.id}`, { width: fw, height: fh, depth: fd }, scene);
            placeholder.parent = pivot; placeholder.position.y = fh / 2;
          }
          );
        }
      }
    });
  }, [elements, isSceneReady, boothConfig]);

  // 4. Handle Camera Mode Switching
  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas) return;
    const orbitCam = scene.getCameraByName("orbitCam") as BABYLON.ArcRotateCamera;
    const flightCam = scene.getCameraByName("flightCam") as BABYLON.UniversalCamera;
    if (!orbitCam || !flightCam) return;
    if (cameraMode === 'flight') {
      orbitCam.detachControl(); flightCam.position = orbitCam.position.clone(); flightCam.setTarget(orbitCam.getTarget());
      scene.activeCamera = flightCam; flightCam.attachControl(canvas, true);
    } else {
      flightCam.detachControl(); orbitCam.setTarget(flightCam.position.clone().add(flightCam.getForwardRay().direction.scale(5)));
      orbitCam.setPosition(flightCam.position.clone()); scene.activeCamera = orbitCam; orbitCam.attachControl(canvas, true);
    }
  }, [cameraMode]);

  return (
    <div className="w-full h-full relative" style={{ backgroundColor: '#0d0d0f' }}>
      <canvas ref={canvasRef} className="w-full h-full block outline-none touch-none" />
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.1)] text-[10px] font-bold text-white uppercase backdrop-blur-md">
          {cameraMode === 'orbit' ? 'Orbit Mode 🌐' : 'Flight Mode 🛸'}
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <button onClick={() => setCameraMode(prev => prev === 'orbit' ? 'flight' : 'orbit')} className="px-4 py-2 bg-[rgba(0,0,0,0.6)] hover:bg-[var(--sea-ink)] border border-[rgba(255,255,255,0.1)] text-xs font-bold text-white uppercase rounded-lg backdrop-blur-md transition-colors">
          {cameraMode === 'orbit' ? "Switch to Flight Mode" : "Switch to Orbit Mode"}
        </button>
      </div>
    </div>
  );
}
