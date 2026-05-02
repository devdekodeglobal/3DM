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
  const modelCacheRef = useRef<Map<string, BABYLON.AssetContainer>>(new Map());
  const wallDecorationRegistryRef = useRef<Map<string, BABYLON.AbstractMesh[]>>(new Map());
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

    // --- Premium Rendering Pipeline (SSAO + Bloom) ---
    const pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [orbitCam, flightCam]);
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.8;
    pipeline.bloomWeight = 0.3;
    pipeline.bloomKernel = 64;
    pipeline.samples = 4;
    pipeline.sharpenEnabled = true;
    pipeline.sharpen.edgeAmount = 0.2;

    // SSAO uses its own pipeline in BabylonJS
    const ssao = new BABYLON.SSAO2RenderingPipeline("ssao", scene, { ssaoRatio: 0.5, blurRatio: 1 });
    ssao.radius = 3.5;
    ssao.totalStrength = 1.2;
    ssao.expensiveBlur = true;
    ssao.samples = 16;
    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", orbitCam);

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
    floor.position = new BABYLON.Vector3(centerX, 0, centerZ);
    floor.receiveShadows = true;

    const floorMat = new BABYLON.PBRMaterial("floorMat", scene);
    floorMat.maxSimultaneousLights = 16;
    floorMat.roughness = 0.15; // Polished look
    floorMat.metallic = 0.1;
    
    const floorType = boothConfig.floorType || 'hardwood';

    if (floorType === 'carpet') {
      floorMat.albedoColor = new BABYLON.Color3(0.18, 0.25, 0.31);
      floorMat.roughness = 0.9; // Matte
    } else {
      const texPath = `/assets/textures/${floorType}.png`;
      const texture = new BABYLON.Texture(texPath, scene);
      texture.uScale = boothConfig.width / 2;
      texture.vScale = boothConfig.depth / 2;
      floorMat.albedoTexture = texture;

      if (floorType === 'marble') {
        floorMat.roughness = 0.05; // Extremely glossy
        floorMat.metallic = 0.2;
      } else if (floorType === 'hardwood') {
        floorMat.roughness = 0.25;
      } else if (floorType === 'concrete') {
        floorMat.roughness = 0.5;
      }
    }

    // Add environmental reflection (simulated)
    floorMat.reflectionColor = new BABYLON.Color3(1, 1, 1);
    
    floor.material = floorMat;
    structureRegistryRef.current.push(floor);

  }, [boothConfig, isSceneReady]);

  const lastSyncRef = useRef<number>(0);

  // 3. Sync Elements
  useEffect(() => {
    if (!isSceneReady || !elements || !boothConfig) return;
    
    const now = Date.now();
    if (now - lastSyncRef.current < 32) {
      const timeout = setTimeout(() => {
        lastSyncRef.current = 0; 
      }, 50);
      return () => clearTimeout(timeout);
    }
    lastSyncRef.current = now;

    const scene = sceneRef.current;
    const shadowGenerator = shadowGeneratorRef.current;
    if (!scene || !shadowGenerator) return;

    const currentIds = new Set(elements.map(el => el.id));
    const registry = meshRegistryRef.current;

    registry.forEach((mesh, id) => {
      if (!currentIds.has(id)) {
        mesh.dispose();
        registry.delete(id);
        if (wallDecorationRegistryRef.current.has(id)) {
          wallDecorationRegistryRef.current.get(id)?.forEach(m => m.dispose());
          wallDecorationRegistryRef.current.delete(id);
        }
      }
    });

    elements.forEach(el => {
      const x = el.x / PPM;
      const z = boothConfig.depth - (el.y / PPM);
      const rotY = BABYLON.Tools.ToRadians(el.rotation || 0);
      const h = 2.5;

      let needsRecreate = false;
      const hasWallElements = el.wallElements && el.wallElements.length > 0;

      if (registry.has(el.id)) {
        const mesh = registry.get(el.id)!;
        if (el.type === 'wall') {
          const cutouts = (el.wallElements || []).filter((wel: any) => ['door', 'window'].includes(wel.type));
          const geometryState = JSON.stringify({
            w: el.width,
            t: el.thickness || 10,
            c: cutouts.map((c: any) => ({ t: c.type, x: c.x, y: c.y, w: c.width, h: c.height }))
          });

          if (!mesh.metadata || mesh.metadata.geometryState !== geometryState) {
            needsRecreate = true;
          }
        } else if (el.type === 'volumetric') {
          if (!mesh.metadata || mesh.metadata.shape !== el.shape || mesh.metadata.logoSide !== el.logoSide) {
            needsRecreate = true;
          }
        } else if (el.type === '3d_logo') {
          if (!mesh.metadata || mesh.metadata.svgData !== el.svgData || mesh.metadata.depth !== el.depth || mesh.metadata.logoStyle !== el.logoStyle) {
            needsRecreate = true;
          }
        }
      }

      if (registry.has(el.id) && !needsRecreate && el.type !== 'wall') {
        const mesh = registry.get(el.id)!;
        const vScale = el.verticalScale || 1;
        const hActual = el.type === 'wall' ? 2.5 : 1; 
        
        mesh.position.x = x;
        mesh.position.z = z;
        
        if (el.type === 'asset') {
          mesh.position.y = el.yOffset || 0;
        } else {
          mesh.position.y = (hActual * vScale / 2) + (el.yOffset || 0);
        }
        
        if (mesh.rotationQuaternion) mesh.rotationQuaternion = null;
        mesh.rotation.y = rotY;
        mesh.scaling.y = vScale;



        if (el.type === 'asset' && mesh.metadata && mesh.metadata.nativeLength) {
          const targetW = el.width / PPM;
          const s = targetW / mesh.metadata.nativeLength;
          mesh.scaling = new BABYLON.Vector3(s, s * (el.verticalScale || 1), s);
        }

        if (el.type === 'volumetric') {
          mesh.scaling.x = el.width / PPM;
          mesh.scaling.z = el.height / PPM;
          const mat = mesh.material as BABYLON.PBRMaterial;
          if (mat) {
            const color = BABYLON.Color3.FromHexString(el.volumetricColor || '#ec4899');
            // If we have a logo, we use white as base to avoid tinting the logo too much, 
            // otherwise use the block color
            mat.albedoColor = el.logoUrl ? BABYLON.Color3.White() : color;
            
            // Handle Emissive
            if (el.emissive) {
              mat.emissiveColor = color;
              mat.emissiveIntensity = el.intensity || 1.5;
            } else {
              mat.emissiveColor = BABYLON.Color3.Black();
            }

            // Handle Logo / Texture
            if (el.logoUrl) {
              if (!mat.albedoTexture || (mat.albedoTexture as BABYLON.Texture).url !== el.logoUrl) {
                const tex = new BABYLON.Texture(el.logoUrl, scene);
                tex.hasAlpha = true;
                tex.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                tex.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                mat.albedoTexture = tex;
                // If emissive is on, the logo should also glow
                if (el.emissive) {
                  mat.emissiveTexture = tex;
                }
              } else if (el.emissive) {
                mat.emissiveTexture = mat.albedoTexture;
              }
            } else {
              mat.albedoTexture = null;
              mat.emissiveTexture = null;
            }
          }
        } else if (el.type === '3d_logo') {
          const multimat = mesh.material as BABYLON.MultiMaterial;
          if (multimat && multimat.subMaterials) {
            const frontMat = multimat.subMaterials[0] as BABYLON.PBRMaterial;
            const sideMat = multimat.subMaterials[1] as BABYLON.PBRMaterial;
            const baseColor = BABYLON.Color3.FromHexString(el.logoColor || '#ffffff');
            if (frontMat) {
              frontMat.albedoColor = baseColor;
              if (el.logoStyle === 'glowing') {
                frontMat.emissiveColor = baseColor;
              }
            }
            if (sideMat) {
              sideMat.albedoColor = baseColor;
            }
          }
        }
      } else {
        if (needsRecreate) {
          registry.get(el.id)?.dispose();
          registry.delete(el.id);
        }

        if (el.type === 'wall') {
          const wVal = el.width / PPM;
          const dVal = (el.thickness || 10) / PPM;
          const vScale = el.verticalScale || 1;
          const cutouts = (el.wallElements || []).filter((wel: any) => ['door', 'window'].includes(wel.type));
          const decorations = (el.wallElements || []).filter((wel: any) => !['door', 'window'].includes(wel.type));
          
          const geometryState = JSON.stringify({
            w: el.width,
            t: el.thickness || 10,
            c: cutouts.map((c: any) => ({ t: c.type, x: c.x, y: c.y, w: c.width, h: c.height }))
          });

          let mesh: BABYLON.Mesh;
          
          if (needsRecreate || !registry.has(el.id)) {
            // Dispose old mesh and its decorations
            const oldMesh = registry.get(el.id);
            if (oldMesh) {
              oldMesh.dispose();
              registry.delete(el.id);
            }
            if (wallDecorationRegistryRef.current.has(el.id)) {
              wallDecorationRegistryRef.current.get(el.id)?.forEach(m => m.dispose());
              wallDecorationRegistryRef.current.delete(el.id);
            }

            mesh = BABYLON.MeshBuilder.CreateBox(el.id, { width: wVal, height: h, depth: dVal }, scene);
            
            if (cutouts.length > 0) {
              let wallCSG = BABYLON.CSG.FromMesh(mesh);
              const trimColor = new BABYLON.Color3(0.2, 0.2, 0.2);
              const ft = 0.04;

              cutouts.forEach((wel: any, index: number) => {
                const cutW = wel.width / PPM, cutH = wel.height / PPM, cutD = dVal + 0.5;
                const localX = (wel.x / PPM) - (wVal / 2) + (cutW / 2);
                const localY = (h / 2) - (wel.y / PPM) - (cutH / 2);
                
                const cutBox = BABYLON.MeshBuilder.CreateBox("cut", { width: cutW, height: cutH, depth: cutD }, scene);
                cutBox.position.set(localX, localY, 0);
                wallCSG = wallCSG.subtract(BABYLON.CSG.FromMesh(cutBox));
                cutBox.dispose();

                // Cutout accessories (frames/glass)
                const accessoryGroup = new BABYLON.Mesh("acc_" + index, scene);
                accessoryGroup.position.set(localX, localY, 0);
                accessoryGroup.parent = mesh;

                const frameMat = new BABYLON.StandardMaterial("fmat", scene);
                frameMat.diffuseColor = trimColor;
                frameMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

                if (wel.type === 'window') {
                  // Window Frame (4 sides)
                  const fTop = BABYLON.MeshBuilder.CreateBox("ft", { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                  fTop.position.y = cutH/2 - ft/2; fTop.material = frameMat; fTop.parent = accessoryGroup;
                  const fBot = BABYLON.MeshBuilder.CreateBox("fb", { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                  fBot.position.y = -cutH/2 + ft/2; fBot.material = frameMat; fBot.parent = accessoryGroup;
                  const fLeft = BABYLON.MeshBuilder.CreateBox("fl", { width: ft, height: cutH - ft*2, depth: dVal + 0.02 }, scene);
                  fLeft.position.x = -cutW/2 + ft/2; fLeft.material = frameMat; fLeft.parent = accessoryGroup;
                  const fRight = BABYLON.MeshBuilder.CreateBox("fr", { width: ft, height: cutH - ft*2, depth: dVal + 0.02 }, scene);
                  fRight.position.x = cutW/2 - ft/2; fRight.material = frameMat; fRight.parent = accessoryGroup;
                  
                  // Glass (Centered)
                  const glass = BABYLON.MeshBuilder.CreateBox("glass", { width: cutW - ft*2, height: cutH - ft*2, depth: 0.01 }, scene);
                  glass.position.z = 0; glass.parent = accessoryGroup;
                  const gMat = new BABYLON.PBRMaterial("gmat", scene);
                  gMat.albedoColor = new BABYLON.Color3(0.8, 0.9, 1);
                  gMat.alpha = 0.2;
                  gMat.roughness = 0.05;
                  gMat.metallic = 0;
                  gMat.transparencyMode = 2; // ALPHABLEND
                  glass.material = gMat;
                } else if (wel.type === 'door') {
                  // Door Frame (Top, Left, Right)
                  const fTop = BABYLON.MeshBuilder.CreateBox("dt", { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                  fTop.position.y = cutH/2 - ft/2; fTop.material = frameMat; fTop.parent = accessoryGroup;
                  const fLeft = BABYLON.MeshBuilder.CreateBox("dlf", { width: ft, height: cutH - ft, depth: dVal + 0.02 }, scene);
                  fLeft.position.x = -cutW/2 + ft/2; fLeft.position.y = -ft/2; fLeft.material = frameMat; fLeft.parent = accessoryGroup;
                  const fRight = BABYLON.MeshBuilder.CreateBox("drf", { width: ft, height: cutH - ft, depth: dVal + 0.02 }, scene);
                  fRight.position.x = cutW/2 - ft/2; fRight.position.y = -ft/2; fRight.material = frameMat; fRight.parent = accessoryGroup;

                  // Door Leaf
                  const leaf = BABYLON.MeshBuilder.CreateBox("dl", { width: cutW - ft*2, height: cutH - ft, depth: 0.04 }, scene);
                  leaf.position.y = -ft/2; 
                  const leafMat = new BABYLON.StandardMaterial("leafMat", scene);
                  leafMat.diffuseColor = new BABYLON.Color3(0.39, 0.26, 0.13); // Warm Brown
                  leafMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
                  leaf.material = leafMat;
                  leaf.parent = accessoryGroup;

                  // Door Handle
                  const handle = BABYLON.MeshBuilder.CreateSphere("handle", { diameter: 0.05 }, scene);
                  handle.position.set(cutW/2 - ft*3, -0.1, 0.03); // Positioned slightly below center
                  handle.parent = leaf;
                  const hMat = new BABYLON.StandardMaterial("hmat", scene);
                  hMat.diffuseColor = new BABYLON.Color3(0.8, 0.7, 0.3); // Brass
                  hMat.specularColor = new BABYLON.Color3(1, 0.9, 0.5);
                  handle.material = hMat;
                }
              });

              const finalMesh = wallCSG.toMesh(el.id, null, scene);
              // Transfer children (accessories) to final mesh
              mesh.getChildren().forEach(child => child.parent = finalMesh);
              mesh.dispose(); mesh = finalMesh as BABYLON.Mesh;
            }
            
            shadowGenerator.addShadowCaster(mesh);
            registry.set(el.id, mesh);
          } else {
            mesh = registry.get(el.id) as BABYLON.Mesh;
          }

          // Update Decorations (Lights, Shelves, Banners)
          const decorationState = JSON.stringify(decorations);
          if (!mesh.metadata || mesh.metadata.decorationState !== decorationState) {
            // Dispose old decorations for this wall
            wallDecorationRegistryRef.current.get(el.id)?.forEach(m => m.dispose());
            const newDecorations: BABYLON.AbstractMesh[] = [];

            decorations.forEach((wel: any) => {
              const cutW = wel.width / PPM, cutH = wel.height / PPM;
              const localX = (wel.x / PPM) - (wVal / 2) + (cutW / 2);
              const localY = (h / 2) - (wel.y / PPM) - (cutH / 2);
              let mount: BABYLON.Mesh;

              if (wel.type === 'shelf') {
                mount = BABYLON.MeshBuilder.CreateBox("shelf", { width: cutW, height: 0.03, depth: 0.3 }, scene);
                mount.position.set(localX, localY, -dVal/2 - 0.15);
              } else if (wel.type === 'light') {
                const lColor = BABYLON.Color3.FromHexString(wel.lightColor || '#fff8e7');
                const lIntensity = wel.intensity || 1.2;
                const model = wel.model || 'wall_light_1';

                if (model === 'wall_light_2') {
                  mount = BABYLON.MeshBuilder.CreateCylinder("light", { diameter: Math.min(cutW, cutH), height: 0.05 }, scene);
                  mount.rotation.x = Math.PI / 2;
                } else if (model === 'wall_light_3') {
                  mount = BABYLON.MeshBuilder.CreateBox("light", { width: cutW, height: 0.04, depth: 0.05 }, scene);
                } else {
                  mount = BABYLON.MeshBuilder.CreateBox("light", { width: cutW, height: cutH, depth: 0.05 }, scene);
                }

                const lMat = new BABYLON.PBRMaterial("lm", scene);
                lMat.emissiveColor = lColor; lMat.emissiveIntensity = lIntensity * 2;
                lMat.albedoColor = lColor; mount.material = lMat;
                mount.position.set(localX, localY, -dVal/2 - 0.025);

                const spot = new BABYLON.SpotLight("spot", new BABYLON.Vector3(0,0,-0.05), new BABYLON.Vector3(0,0,-1), Math.PI/2, 2, scene);
                spot.diffuse = lColor; spot.intensity = lIntensity * 5; spot.parent = mount;
              } else {
                mount = BABYLON.MeshBuilder.CreatePlane("banner", { width: cutW, height: cutH }, scene);
                mount.position.set(localX, localY, -dVal/2 - 0.01);
                const bMat = new BABYLON.PBRMaterial("bm", scene);
                if (wel.url) {
                  const tex = new BABYLON.Texture(wel.url, scene);
                  tex.hasAlpha = true;
                  bMat.albedoTexture = tex;
                  bMat.useAlphaFromAlbedoTexture = true;
                  bMat.transparencyMode = 2; // ALPHABLEND
                  bMat.roughness = 0.5;
                  bMat.metallic = 0.1;
                } else {
                  bMat.albedoColor = wel.type === 'frame' ? new BABYLON.Color3(0.8, 0.8, 0.8) : BABYLON.Color3.Blue();
                }
                mount.material = bMat;
              }
              mount.parent = mesh;
              newDecorations.push(mount);
            });
            wallDecorationRegistryRef.current.set(el.id, newDecorations);
          }

          // Update Wall Common Properties
          mesh.position.set(x, (h * vScale / 2) + (el.yOffset || 0), z);
          mesh.scaling.y = vScale;
          mesh.rotation.y = rotY;
          if (!hasWallElements && mesh.metadata && mesh.metadata.baseWidth) {
            mesh.scaling.x = wVal / mesh.metadata.baseWidth;
          }

          const mat = (mesh.material as BABYLON.PBRMaterial) || new BABYLON.PBRMaterial(el.id + "_mat", scene);
          mat.roughness = 0.4; mat.metallic = 0.05;
          if (el.material === 'Glass Wall') { mat.albedoColor = new BABYLON.Color3(0.5, 0.8, 1); mat.alpha = 0.4; mat.transparencyMode = 2; mat.albedoTexture = null; }
          else {
            mat.alpha = 1.0;
            mat.transparencyMode = 0;
            mat.albedoColor = BABYLON.Color3.White();
            let texName = '';
            if (el.material === 'Wood') texName = 'hardwood';
            else if (el.material === 'Brick') texName = 'brick';
            else if (el.material === 'Marble') { texName = 'marble'; mat.roughness = 0.1; mat.metallic = 0.2; }
            else if (el.material === 'Concrete') texName = 'concrete';
            
            if (texName) {
              const texUrl = `/assets/textures/${texName}.png`;
              if (!mat.albedoTexture || (mat.albedoTexture as BABYLON.Texture).url !== texUrl) {
                mat.albedoTexture = new BABYLON.Texture(texUrl, scene);
              }
              const currentTex = mat.albedoTexture as BABYLON.Texture;
              if (currentTex) {
                currentTex.uScale = wVal / 2; 
                currentTex.vScale = h / 2;
              }
            } else {
              mat.albedoColor = new BABYLON.Color3(0.92, 0.92, 0.92); mat.albedoTexture = null;
            }
          }
          mesh.material = mat;
          mesh.metadata = { geometryState, decorationState, baseWidth: wVal };
          registry.set(el.id, mesh);

        } else if (el.type === 'volumetric') {
          let vMesh: BABYLON.Mesh;
          const logoSide = el.logoSide || 'front';
          
          // Define faceUV to isolate logo to one side
          // Babylon Box sides: 0:Front, 1:Back, 2:Right, 3:Left, 4:Top, 5:Bottom
          const faceUV = new Array(6).fill(new BABYLON.Vector4(0, 0, 0, 0));
          if (el.logoUrl) {
            let sideIndex = 0; // Front
            if (logoSide === 'back') sideIndex = 1;
            else if (logoSide === 'right') sideIndex = 2;
            else if (logoSide === 'left') sideIndex = 3;
            else if (logoSide === 'top') sideIndex = 4;
            else if (logoSide === 'bottom') sideIndex = 5;
            faceUV[sideIndex] = new BABYLON.Vector4(0, 1, 1, 0);
          } else {
            // No logo? All sides show the color
            faceUV.fill(new BABYLON.Vector4(0, 0, 1, 1));
          }

          if (el.shape === 'cylinder') {
            const cylUV = new Array(3).fill(new BABYLON.Vector4(0,0,0,0));
            if (el.logoUrl) {
               if (logoSide === 'top') cylUV[2] = new BABYLON.Vector4(0, 1, 1, 0);
               else if (logoSide === 'bottom') cylUV[0] = new BABYLON.Vector4(0, 1, 1, 0);
               else cylUV[1] = new BABYLON.Vector4(0, 1, 1, 0); // Side
            } else {
               cylUV.fill(new BABYLON.Vector4(0,0,1,1));
            }
            vMesh = BABYLON.MeshBuilder.CreateCylinder(el.id, { diameter: 1, height: 1, faceUV: cylUV }, scene);
          } else if (el.shape === 'pill') {
            vMesh = BABYLON.MeshBuilder.CreateCapsule(el.id, { height: 1, radius: 0.5 }, scene);
          } else {
            vMesh = BABYLON.MeshBuilder.CreateBox(el.id, { size: 1, faceUV }, scene);
          }
          
          vMesh.position.set(x, (1 * (el.verticalScale || 1) / 2) + (el.yOffset || 0), z);
          vMesh.scaling.set(el.width / PPM, el.verticalScale || 1, el.height / PPM);
          vMesh.rotation.y = rotY;
          shadowGenerator.addShadowCaster(vMesh);

          const mat = new BABYLON.PBRMaterial(el.id + "_mat", scene);
          const color = BABYLON.Color3.FromHexString(el.volumetricColor || '#ec4899');
          mat.albedoColor = el.logoUrl ? BABYLON.Color3.White() : color;
          mat.roughness = 0.2;
          
          if (el.emissive) { 
            mat.emissiveColor = color; 
            mat.emissiveIntensity = el.intensity || 1.5; 
          }
          
          if (el.logoUrl) {
            const tex = new BABYLON.Texture(el.logoUrl, scene);
            tex.hasAlpha = true;
            tex.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
            tex.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
            mat.albedoTexture = tex;
            if (el.emissive) {
              mat.emissiveTexture = tex;
            }
          }
          
          vMesh.material = mat;
          vMesh.metadata = { shape: el.shape, logoSide: el.logoSide };
          registry.set(el.id, vMesh);

        } else if (el.type === '3d_logo') {
          const depth = (el.depth || 5) / PPM;
          const w = el.width / PPM;
          const h = el.height / PPM;
          
          // Define faceUV to isolate logo to front face only
          // 0:Front, 1:Back, 2:Right, 3:Left, 4:Top, 5:Bottom
          const faceUV = new Array(6).fill(new BABYLON.Vector4(0, 0, 0, 0));
          faceUV[0] = new BABYLON.Vector4(0, 1, 1, 0);

          // Create the logo box
          const logoMesh = BABYLON.MeshBuilder.CreateBox(el.id, { width: w, height: h, depth: depth, faceUV }, scene);
          logoMesh.position.set(x, (h / 2) + (el.yOffset || 0), z);
          logoMesh.rotation.y = rotY;
          shadowGenerator.addShadowCaster(logoMesh);

          const mat = new BABYLON.PBRMaterial(el.id + "_mat", scene);
          const baseColor = BABYLON.Color3.FromHexString(el.logoColor || '#ffffff');
          
          mat.albedoColor = baseColor;
          mat.metallic = 0;
          mat.roughness = 0.5;

          if (el.logoStyle === 'chrome') {
            mat.metallic = 1.0;
            mat.roughness = 0.1;
          } else if (el.logoStyle === 'glowing') {
            mat.emissiveColor = baseColor;
            mat.emissiveIntensity = 2.0;
          } else if (el.logoStyle === 'glass') {
            mat.alpha = 0.5;
            mat.metallic = 0;
            mat.roughness = 0.1;
            mat.indexOfRefraction = 1.5;
            mat.transparencyMode = 2; // ALPHABLEND
          }

          // Define sub-meshes: 0 is the front face, 1 is the rest
          logoMesh.subMeshes = [];
          new BABYLON.SubMesh(0, 0, logoMesh.getTotalVertices(), 0, 6, logoMesh); // Front face (indices 0-5)
          new BABYLON.SubMesh(1, 0, logoMesh.getTotalVertices(), 6, 30, logoMesh); // Other faces

          const multimat = new BABYLON.MultiMaterial(el.id + "_multimat", scene);
          
          // Material for front face
          const frontMat = new BABYLON.PBRMaterial(el.id + "_front", scene);
          frontMat.albedoColor = baseColor;
          frontMat.metallic = mat.metallic;
          frontMat.roughness = mat.roughness;
          frontMat.transparencyMode = 2; // Always enable alpha blend for logos
          
          if (el.logoStyle === 'glowing') {
            frontMat.emissiveColor = baseColor;
            frontMat.emissiveIntensity = 2.0;
          }
          if (el.logoStyle === 'glass') {
            frontMat.alpha = 0.5;
            frontMat.indexOfRefraction = 1.5;
          }
          
          if (el.svgData) {
            const blob = new Blob([el.svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const tex = new BABYLON.Texture(url, scene);
            tex.hasAlpha = true;
            
            frontMat.albedoTexture = tex;
            frontMat.opacityTexture = tex; // This makes the "white corners" transparent
            
            if (el.logoStyle === 'glowing') frontMat.emissiveTexture = tex;
            tex.onLoadObservable.addOnce(() => URL.revokeObjectURL(url));
          }

          // Material for sides/back
          const sideMat = new BABYLON.PBRMaterial(el.id + "_side", scene);
          sideMat.albedoColor = baseColor;
          sideMat.metallic = mat.metallic;
          sideMat.roughness = mat.roughness;
          sideMat.transparencyMode = 2;

          if (el.svgData) {
            // Apply the same opacity texture to sides to help with the "cutout" look
            const blob = new Blob([el.svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const tex = new BABYLON.Texture(url, scene);
            sideMat.opacityTexture = tex;
            tex.onLoadObservable.addOnce(() => URL.revokeObjectURL(url));
          }

          multimat.subMaterials.push(frontMat);
          multimat.subMaterials.push(sideMat);
          
          logoMesh.material = multimat;
          logoMesh.metadata = { svgData: el.svgData, depth: el.depth, logoStyle: el.logoStyle, logoColor: el.logoColor };
          registry.set(el.id, logoMesh);

        } else if (el.type === 'asset') {
          const modelName = el.assetName?.toLowerCase() || 'box';
          const pivot = BABYLON.MeshBuilder.CreateBox("pivot_" + el.id, { size: 0.01 }, scene);
          pivot.isVisible = false;
          pivot.position.set(x, el.yOffset || 0, z);
          pivot.rotation.y = rotY;
          registry.set(el.id, pivot);

          const cache = modelCacheRef.current;
          if (cache.has(modelName)) {
            const container = cache.get(modelName)!;
            const entries = container.instantiateModelsToScene();
            entries.rootNodes.forEach(node => {
              node.parent = pivot;
              // Add shadows to all meshes in the instance
              node.getChildMeshes().forEach(m => {
                m.receiveShadows = true;
                shadowGenerator.addShadowCaster(m, true);
              });
            });
            // Native length logic needs a slight delay for bounds calculation
            setTimeout(() => {
              if (!pivot.metadata || !pivot.metadata.nativeLength) {
                 const root = entries.rootNodes[0];
                 root.computeWorldMatrix(true);
                 const bbox = root.getHierarchyBoundingVectors(true);
                 const sz = bbox.max.subtract(bbox.min);
                 const longest = Math.max(sz.x, sz.z);
                 pivot.metadata = { ...pivot.metadata, nativeLength: longest };
                 const s = (el.width / PPM) / longest;
                 pivot.scaling.set(s, s * (el.verticalScale || 1), s);
              }
            }, 10);
          } else {
            BABYLON.SceneLoader.LoadAssetContainer("/models/", `${modelName}.glb`, scene, (container) => {
              if (!registry.has(el.id)) { container.dispose(); return; }
              cache.set(modelName, container);
              const entries = container.instantiateModelsToScene();
              entries.rootNodes.forEach(node => {
                node.parent = pivot;
                node.getChildMeshes().forEach(m => {
                  m.receiveShadows = true;
                  shadowGenerator.addShadowCaster(m, true);
                });
              });
              
              setTimeout(() => {
                const root = entries.rootNodes[0];
                root.computeWorldMatrix(true);
                const bbox = root.getHierarchyBoundingVectors(true);
                const sz = bbox.max.subtract(bbox.min);
                const longest = Math.max(sz.x, sz.z);
                if (longest > 0) {
                  pivot.metadata = { nativeLength: longest };
                  const s = (el.width / PPM) / longest;
                  pivot.scaling.set(s, s * (el.verticalScale || 1), s);
                }
              }, 100);
            }, null, () => {
               const ph = BABYLON.MeshBuilder.CreateBox("ph", { width: el.width/PPM, height: 0.8, depth: el.height/PPM }, scene);
               ph.parent = pivot; ph.position.y = 0.4;
            });
          }
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
