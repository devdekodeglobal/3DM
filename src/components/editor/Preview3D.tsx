import { useEffect, useRef, useState } from 'react'
import { Camera, Maximize, Minimize } from 'lucide-react'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import { GLTF2Export } from '@babylonjs/serializers/glTF/2.0/glTFSerializer'
import { OBJExport } from '@babylonjs/serializers/OBJ/objSerializer'
import * as GUI from '@babylonjs/gui';
import { calculateBlueprintMeasurements } from '../../lib/blueprintMath';
import { GridMaterial } from '@babylonjs/materials';
import { ASSET_REGISTRY } from '../../lib/assetRegistry';

interface Preview3DProps {
  boothConfig: any;
  elements: any[];
  activeView?: 'perspective' | 'top' | 'north' | 'south' | 'east' | 'west' | string;
  onExportComplete?: (baseView: any, base64Data?: string) => void;
  selectedId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onUpdateElement?: (id: string, newProps: any) => void;
  backgroundColor?: string;
  setBackgroundColor?: (color: string) => void;
}

const PPM = 100;

export default function Preview3D({ 
  boothConfig, 
  elements, 
  activeView = 'perspective', 
  onExportComplete,
  selectedId,
  onSelectElement,
  onUpdateElement,
  backgroundColor = '#1d1f21',
}: Preview3DProps) {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'flight'>('orbit');
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const shadowGeneratorRef = useRef<BABYLON.ShadowGenerator | null>(null);
  const guiRef = useRef<GUI.AdvancedDynamicTexture | null>(null);
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Set background color for sky
    const colorHex = backgroundColor || '#556677';
    sceneRef.current.clearColor = BABYLON.Color4.FromHexString(colorHex.length === 7 ? colorHex + 'ff' : colorHex);

    // Create or update shadow catcher ground plane color
    let catcher = sceneRef.current.getMeshByName("shadowCatcher") as BABYLON.Mesh;
    if (!catcher) {
      catcher = BABYLON.MeshBuilder.CreatePlane("shadowCatcher", { size: 500 }, sceneRef.current);
      catcher.rotation.x = Math.PI / 2;
      catcher.position.y = -0.05; // 5cm below 0 to prevent z-fighting with the floor
      catcher.receiveShadows = true;
      
      const shadowMat = new BABYLON.BackgroundMaterial("shadowOnly", sceneRef.current);
      shadowMat.shadowLevel = 0.6; // Adjust shadow darkness
      shadowMat.useRGBColor = false;
      shadowMat.zOffset = 10; // Push behind floor mesh in depth buffer
      catcher.material = shadowMat;
    }

    if (catcher.material && catcher.material instanceof BABYLON.BackgroundMaterial) {
      catcher.material.primaryColor = BABYLON.Color3.FromHexString(colorHex);
    }
  }, [backgroundColor, isSceneReady]);

  const measurementLinesRef = useRef<BABYLON.LinesMesh[]>([]);

  const meshRegistryRef = useRef<Map<string, BABYLON.AbstractMesh>>(new Map());
  const structureRegistryRef = useRef<BABYLON.AbstractMesh[]>([]);
  const modelCacheRef = useRef<Map<string, Promise<BABYLON.AssetContainer>>>(new Map());
  const textureCacheRef = useRef<Map<string, BABYLON.Texture>>(new Map());
  const wallDecorationRegistryRef = useRef<Map<string, BABYLON.AbstractMesh[]>>(new Map());
  const ceilingLightsRef = useRef<BABYLON.Light[]>([]);
  const lastBoothDimRef = useRef({ w: 0, d: 0 });
  const prevElementsRef = useRef<any[]>([]);

  const isShiftPressedRef = useRef(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Shift') isShiftPressedRef.current = true; };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.key === 'Shift') isShiftPressedRef.current = false; };
    const handleBlur = () => { isShiftPressedRef.current = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
  const [debouncedElements, setDebouncedElements] = useState(elements);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedElements(elements);
    }, 100);
    return () => clearTimeout(handler);
  }, [elements]);

  // 1. Initial Setup Hook
  useEffect(() => {
    if (!canvasRef.current) return;

    // Configure Draco Decoder for compressed GLB files
    BABYLON.DracoCompression.Configuration = {
      decoder: {
        wasmUrl: "https://preview.babylonjs.com/draco_wasm_wrapper_gltf.js",
        wasmBinaryUrl: "https://preview.babylonjs.com/draco_decoder_gltf.wasm",
        fallbackUrl: "https://preview.babylonjs.com/draco_decoder_gltf.js"
      }
    };

    const engine = new BABYLON.Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true, stencil: true, antialias: true
    }, true);
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
    orbitCam.minZ = 0.1;
    orbitCam.maxZ = 200.0;
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
    flightCam.minZ = 0.1;
    flightCam.maxZ = 200.0;

    // Camera 3: Blueprint Orthographic Camera
    const blueprintCam = new BABYLON.FreeCamera("blueprintCam", new BABYLON.Vector3(0, 10, 0), scene);
    blueprintCam.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    blueprintCam.minZ = 0.1;
    blueprintCam.maxZ = 100;

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

    const isHQ = window.localStorage.getItem('hq_3d') === 'true';

    const shadowGenerator = new BABYLON.ShadowGenerator(isHQ ? 2048 : 1024, dirLight);
    shadowGeneratorRef.current = shadowGenerator;
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = isHQ ? 16 : 8;

    // --- Premium Rendering Pipeline (SSAO + Bloom) ---
    const pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [orbitCam, flightCam, blueprintCam]);
    pipeline.samples = isHQ ? 4 : 2;
    pipeline.sharpenEnabled = true;
    pipeline.sharpen.edgeAmount = 0.2;

    if (isHQ) {
      pipeline.bloomEnabled = true;
      pipeline.bloomThreshold = 0.8;
      pipeline.bloomWeight = 0.3;
      pipeline.bloomKernel = 64;

      // SSAO uses its own pipeline in BabylonJS
      const ssao = new BABYLON.SSAO2RenderingPipeline("ssao", scene, { ssaoRatio: 0.5, blurRatio: 1 });
      ssao.radius = 3.5;
      ssao.totalStrength = 1.2;
      ssao.expensiveBlur = true;
      ssao.samples = 16;
      scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", orbitCam);
    }

    const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    guiRef.current = gui;

    engine.runRenderLoop(() => {
      scene.render();
    });

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (engineRef.current) engineRef.current.resize();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    (window as any).export3DModel = async (format: 'glb' | 'gltf' | 'obj' = 'glb') => {
      const shouldExportNode = (node: BABYLON.Node) => {
        if (node.name === "blueprintGrid" || node.name === "background" || node.name === "shadowCatcher" || node instanceof BABYLON.Camera) {
          return false;
        }
        return true;
      };

      if (format === 'obj') {
        const exportableMeshes = scene.meshes.filter(m => {
          if (!shouldExportNode(m)) return false;
          return m.isVisible && m instanceof BABYLON.Mesh && m.geometry;
        }) as BABYLON.Mesh[];
        const objText = OBJExport.OBJ(exportableMeshes, true, "booth_material", true);
        return new Blob([objText], { type: 'text/plain' });
      } else if (format === 'gltf') {
        const gltfData = await GLTF2Export.GLTFAsync(scene, "booth.gltf", { shouldExportNode });
        return gltfData.glTFFiles["booth.gltf"];
      } else {
        const glbData = await GLTF2Export.GLBAsync(scene, "booth.glb", { shouldExportNode });
        return glbData.glTFFiles["booth.glb"];
      }
    };
    (window as any).exportSceneToGLB = () => (window as any).export3DModel('glb');

    setIsSceneReady(true);

    return () => {
      delete (window as any).exportSceneToGLB;
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

    if (shadowGenerator) {
      shadowGenerator.bias = 0.0015;
      shadowGenerator.normalBias = 0.02;
    }

    structureRegistryRef.current.forEach(mesh => mesh.dispose());
    structureRegistryRef.current = [];

    const centerX = boothConfig.width / 2;
    const centerZ = boothConfig.depth / 2;

    const dir = scene.getLightByName("dir") as BABYLON.DirectionalLight;
    if (dir) {
      dir.position = new BABYLON.Vector3(centerX + 15, 25, centerZ + 15);
      dir.shadowOrthoScale = 1.5;
    }

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

    if (floorType === 'custom_color') {
      const cHex = boothConfig.floorColor || '#ffffff';
      floorMat.albedoColor = BABYLON.Color3.FromHexString(cHex);
      floorMat.roughness = 0.5;
    } else if (floorType === 'carpet') {
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

    // 2.1 Technical Grid (Visible only in technical views)
    const grid = BABYLON.MeshBuilder.CreateGround("blueprintGrid", { width: boothConfig.width, height: boothConfig.depth }, scene);
    grid.position = new BABYLON.Vector3(centerX, 0.01, centerZ); // Slightly above floor
    const gridMat = new GridMaterial("gridMat", scene) as any;
    gridMat.majorUnitFrequency = 5; // 1m major lines (since 1 unit = 1m)
    gridMat.minorUnitVisibility = 0.45;
    gridMat.gridRatio = 0.2; // 20cm minor lines
    gridMat.mainColor = new BABYLON.Color3(0, 0, 0);
    gridMat.lineColor = new BABYLON.Color3(0.2, 0.5, 1.0); // Blueprint blue
    gridMat.opacity = 0.8;
    gridMat.backFaceCulling = false;
    grid.material = gridMat as BABYLON.Material;
    grid.isVisible = activeView !== 'perspective';
    structureRegistryRef.current.push(grid);

    // --- 2.2 ROOF & CEILING LIGHTS RENDERING ---
    if (ceilingLightsRef.current) {
      ceilingLightsRef.current.forEach(l => l.dispose());
      ceilingLightsRef.current = [];
    }

    const roofConfig = boothConfig?.roof;
    if (roofConfig && roofConfig.enabled) {
      const rColor = roofConfig.color || '#e2e8f0';
      const rThickness = roofConfig.thickness || 0.1;
      const rHeight = roofConfig.height || 2.5;
      const panels = roofConfig.panels || [];
      const lights = roofConfig.lights || [];

      // Create Material for Roof Panels
      const roofMat = new BABYLON.PBRMaterial("roofMat", scene);
      roofMat.maxSimultaneousLights = 16;
      roofMat.albedoColor = BABYLON.Color3.FromHexString(rColor);
      roofMat.roughness = 0.6;
      roofMat.metallic = 0.1;

      panels.forEach((panel: any, index: number) => {
        const wVal = panel.width / PPM;
        const dVal = panel.height / PPM; // height in 2D is depth in 3D
        const pX = panel.x / PPM;
        const pY = panel.y / PPM;

        const roofPanelMesh = BABYLON.MeshBuilder.CreateBox("roofPanel_" + panel.id, {
          width: wVal,
          height: rThickness,
          depth: dVal
        }, scene);

        // Position: center x and z, y is above wall height (with a tiny offset to prevent Z-fighting)
        const cX = pX + wVal / 2;
        const cZ = boothConfig.depth - (pY + dVal / 2);
        const cY = rHeight + rThickness / 2 + index * 0.002;

        roofPanelMesh.position.set(cX, cY, cZ);
        roofPanelMesh.material = roofMat;
        roofPanelMesh.receiveShadows = true;
        shadowGenerator.addShadowCaster(roofPanelMesh);

        structureRegistryRef.current.push(roofPanelMesh);
      });

      // Create lights
      lights.forEach((light: any) => {
        const wVal = light.width / PPM;
        const dVal = light.height / PPM;
        const pX = light.x / PPM;
        const pY = light.y / PPM;

        const cX = pX + wVal / 2;
        const cZ = boothConfig.depth - (pY + dVal / 2);
        const cY = rHeight - 0.01; // slightly below ceiling

        let lightMesh: BABYLON.Mesh;
        const lightMat = new BABYLON.PBRMaterial("ceilingLightMat_" + light.id, scene);
        const lColor = BABYLON.Color3.FromHexString(light.color || '#ffffff');
        lightMat.albedoColor = lColor;
        lightMat.emissiveColor = lColor;
        lightMat.emissiveIntensity = (light.intensity || 1.0) * 2.5;
        lightMat.roughness = 0.1;

        if (light.type === 'circular') {
          lightMesh = BABYLON.MeshBuilder.CreateCylinder("ceilingLightMesh_" + light.id, {
            diameter: Math.min(wVal, dVal),
            height: 0.03
          }, scene);
        } else {
          lightMesh = BABYLON.MeshBuilder.CreateBox("ceilingLightMesh_" + light.id, {
            width: wVal,
            height: 0.03,
            depth: dVal
          }, scene);
        }

        lightMesh.position.set(cX, cY, cZ);
        lightMesh.material = lightMat;
        structureRegistryRef.current.push(lightMesh);

        // Add real spotlight pointing down
        const spotLight = new BABYLON.SpotLight(
          "ceilingSpot_" + light.id,
          new BABYLON.Vector3(cX, cY - 0.02, cZ),
          new BABYLON.Vector3(0, -1, 0),
          Math.PI / 3, // 60 degree cone
          2.0, // falloff exponent
          scene
        );
        spotLight.diffuse = lColor;
        spotLight.intensity = (light.intensity || 1.0) * 6.0;
        spotLight.range = 8.0;

        ceilingLightsRef.current.push(spotLight);
      });
    }

  }, [boothConfig, isSceneReady]);

  // 2.1 Camera View & Wall Masking Sync
  useEffect(() => {
    if (!isSceneReady || !sceneRef.current || !boothConfig) return;
    const scene = sceneRef.current;
    const blueprintCam = scene.getCameraByName("blueprintCam") as BABYLON.FreeCamera;
    const orbitCam = scene.getCameraByName("orbitCam") as BABYLON.ArcRotateCamera;
    
    if (!blueprintCam || !orbitCam) return;

    // --- BLUEPRINT VISUAL POLISH: DIM LIGHTS ---
    const baseView = activeView.replace('_download', '').replace('_capture', '');
    const isBlueprint = baseView !== 'perspective';
    scene.lights.forEach(l => {
      if (l instanceof BABYLON.HemisphericLight) {
        l.intensity = isBlueprint ? 0.3 : 0.8;
      }
      if (l instanceof BABYLON.DirectionalLight) {
        l.intensity = isBlueprint ? 0.2 : 1.0;
      }
    });
    if (scene.environmentIntensity !== undefined) {
      scene.environmentIntensity = isBlueprint ? 0.2 : 1.0;
    }

    // --- VISIBILITY RESET ---
    // Make all standard meshes visible to recover from any isolated elevation views
    scene.meshes.forEach(m => {
      m.isVisible = true;
    });

    // --- AUTOMATIC WALL HIDING FOR ELEVATIONS ---
    scene.meshes.forEach(m => {
      if (m.metadata && m.metadata.wallDir) {
        // If we are looking from North, hide the North wall so we can see the interior
        if (m.metadata.wallDir === baseView) {
          m.isVisible = false;
        }
      }
      if (m.name === 'blueprintGrid') {
        m.isVisible = activeView !== 'perspective';
      }
    });

    if (activeView === 'perspective') {
      scene.activeCamera = orbitCam;
      orbitCam.attachControl(canvasRef.current, true);
      
      // Standard Lighting
      const hemi = scene.getLightByName("hemi") as BABYLON.HemisphericLight;
      if (hemi) hemi.intensity = 0.6;
      const dir = scene.getLightByName("dir") as BABYLON.DirectionalLight;
      if (dir) dir.intensity = 0.8;
    } else {
      scene.activeCamera = blueprintCam;
      blueprintCam.attachControl(canvasRef.current, true);
      
      // Blueprint Lighting (Softer, flat look)
      const hemi = scene.getLightByName("hemi") as BABYLON.HemisphericLight;
      if (hemi) hemi.intensity = 1.0;
      const dir = scene.getLightByName("dir") as BABYLON.DirectionalLight;
      if (dir) dir.intensity = 0.2; // Reduce harsh shadows
      
      const centerX = boothConfig.width / 2;
      const centerZ = boothConfig.depth / 2;
      const maxDim = Math.max(boothConfig.width, boothConfig.depth);
      
      // Update Orthographic scale to fit the booth
      const aspect = engineRef.current ? engineRef.current.getAspectRatio(blueprintCam) : 1;
      const zoom = maxDim * 0.8;
      
      blueprintCam.orthoTop = zoom;
      blueprintCam.orthoBottom = -zoom;
      blueprintCam.orthoLeft = -zoom * aspect;
      blueprintCam.orthoRight = zoom * aspect;

      let camPos = new BABYLON.Vector3(centerX, 10, centerZ);
      let targetPos = new BABYLON.Vector3(centerX, 0, centerZ);
      let hiddenWall = '';

      if (baseView.startsWith('elevation_')) {
        const wallId = baseView.replace('elevation_', '');
        const wallEl = elements.find(el => el.id === wallId);
        
        if (wallEl) {
          const rot = (wallEl.rotation || 0) * (Math.PI / 180);
          const wX = wallEl.x / PPM;
          const wZ = boothConfig.depth - (wallEl.y / PPM);
          
          // Camera should look AT the wall (target) from the INNER side (interior)
          // We flip the normal (nx, nz) to look from inside the booth outwards
          const nx = -Math.sin(rot);
          const nz = -Math.cos(rot);
          
          camPos = new BABYLON.Vector3(wX + nx * 5, 1.25, wZ + nz * 5);
          targetPos = new BABYLON.Vector3(wX, 1.25, wZ);
          
          // Hide everything
          scene.meshes.forEach(m => { m.isVisible = false; });
          
          // Show only the selected wall and its accessories
          const wallMesh = meshRegistryRef.current.get(wallId);
          if (wallMesh) {
            wallMesh.isVisible = true;
            wallMesh.getChildMeshes().forEach(c => c.isVisible = true);
          }
          const decos = wallDecorationRegistryRef.current.get(wallId);
          if (decos) {
            decos.forEach(d => {
              d.isVisible = true;
              d.getChildMeshes().forEach(c => c.isVisible = true);
            });
          }
        }
      } else {
        switch (baseView) {
          case 'top':
            camPos = new BABYLON.Vector3(centerX, 10, centerZ);
            targetPos = new BABYLON.Vector3(centerX, 0, centerZ);
            break;
          case 'north':
            camPos = new BABYLON.Vector3(centerX, 1.5, -5);
            targetPos = new BABYLON.Vector3(centerX, 1.5, 5);
            hiddenWall = 'north';
            break;
          case 'south':
            camPos = new BABYLON.Vector3(centerX, 1.5, boothConfig.depth + 5);
            targetPos = new BABYLON.Vector3(centerX, 1.5, -5);
            hiddenWall = 'south';
            break;
          case 'east':
            camPos = new BABYLON.Vector3(boothConfig.width + 5, 1.5, centerZ);
            targetPos = new BABYLON.Vector3(-5, 1.5, centerZ);
            hiddenWall = 'east';
            break;
          case 'west':
            camPos = new BABYLON.Vector3(-5, 1.5, centerZ);
            targetPos = new BABYLON.Vector3(5, 1.5, centerZ);
            hiddenWall = 'west';
            break;
        }

        if (hiddenWall) {
          scene.meshes.forEach(m => {
            if (m.metadata?.isOuter && m.metadata?.wallDir === hiddenWall) {
              m.isVisible = false;
            }
          });
        }
      }

      blueprintCam.position = camPos;
      blueprintCam.setTarget(targetPos);
    }
  }, [activeView, isSceneReady, boothConfig, elements]);

  // 2.15 Selection Outline Highlight Effect
  useEffect(() => {
    if (!isSceneReady || !sceneRef.current) return;
    const registry = meshRegistryRef.current;
    
    // Clear all outlines first
    registry.forEach((mesh) => {
      mesh.renderOutline = false;
      mesh.getChildMeshes().forEach(c => {
        c.renderOutline = false;
      });
    });

    if (selectedId) {
      const selectedMesh = registry.get(selectedId);
      if (selectedMesh) {
        selectedMesh.renderOutline = true;
        selectedMesh.outlineColor = new BABYLON.Color3(0, 0.7, 1);
        selectedMesh.outlineWidth = 0.01;
      }
    }
  }, [selectedId, isSceneReady]);

  // 2.16 Pointer Pick Selection
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !isSceneReady) return;

    scene.onPointerDown = (_evt, pickResult) => {
      if (pickResult.hit && pickResult.pickedMesh) {
        let current: BABYLON.Node | null = pickResult.pickedMesh;
        let foundId: string | null = null;
        
        while (current) {
          if (current instanceof BABYLON.AbstractMesh) {
            for (const [id, regMesh] of meshRegistryRef.current.entries()) {
              if (regMesh === current) {
                foundId = id;
                break;
              }
            }
            if (foundId) break;
          }
          current = current.parent;
        }

        if (foundId) {
          const el = elements.find(e => e.id === foundId);
          if (el) {
            onSelectElement?.(foundId);
            return;
          }
        }
      }

      // Deselect if clicking on empty floor or grid
      if (pickResult.hit && (pickResult.pickedMesh?.name === 'floor' || pickResult.pickedMesh?.name === 'blueprintGrid')) {
        onSelectElement?.(null);
      }
    };
  }, [isSceneReady, onSelectElement, elements]);

  // 2.2 Measurement & GUI Sync
  useEffect(() => {
    if (!isSceneReady || !sceneRef.current || !guiRef.current) return;
    const scene = sceneRef.current;
    const gui = guiRef.current;
    
    // Clear old measurements with explicit unlinking
    if (gui) {
      gui.getDescendants().forEach(c => {
        if (c instanceof GUI.Control) {
          c.linkWithMesh(null);
          c.dispose();
        }
      });
    }
    measurementLinesRef.current.forEach(m => {
      if (m) m.dispose();
    });
    measurementLinesRef.current = [];

    if (activeView === 'perspective') return;

    const baseView = activeView.replace('_download', '').replace('_capture', '');
    const chains = calculateBlueprintMeasurements(baseView, elements, boothConfig);
    
    // --- BLUEPRINT VISUAL POLISH ---
    const grid = scene.getMeshByName("blueprintGrid");
    if (grid && grid.material) {
      grid.material.alpha = 0.15; // Fade the grid significantly
    }

    chains.forEach(chain => {
      // 1. Render Extension Lines (Whiskers)
      chain.extensionLines.forEach(pointsArr => {
        const p = pointsArr.map(pt => new BABYLON.Vector3(pt.x, pt.y, pt.z));
        const extMesh = BABYLON.MeshBuilder.CreateLines("ext", { points: p }, scene);
        extMesh.color = new BABYLON.Color3(0.3, 0.3, 0.3); // Faded grey
        extMesh.alpha = 0.5;
        measurementLinesRef.current.push(extMesh);
      });

      // 2. Render Main Dimension Line
      const points = chain.mainLine.map(p => new BABYLON.Vector3(p.x, p.y, p.z));
      const lineMesh = BABYLON.MeshBuilder.CreateLines("ml", { points }, scene);
      
      let color = new BABYLON.Color3(0.3, 0.3, 0.3); // Default Grey
      if (chain.type === 'asset') color = new BABYLON.Color3(0, 0.7, 1); // Blue
      if (chain.type === 'neighbor') color = new BABYLON.Color3(0, 1, 0.5); // Green
      
      lineMesh.color = color;
      lineMesh.isPickable = false;
      measurementLinesRef.current.push(lineMesh);

      // --- ADD ARROWS ---
      if ((chain.type === 'asset' || chain.type === 'neighbor') && points.length >= 2) {
        const p1 = points[0];
        const p2 = points[points.length - 1];
        const dir = p2.subtract(p1).normalize();
        
        let up = BABYLON.Vector3.Up();
        if (Math.abs(BABYLON.Vector3.Dot(dir, up)) > 0.9) up = BABYLON.Vector3.Right();
        const perp = BABYLON.Vector3.Cross(dir, up).normalize().scale(0.05);
        
        const addArrow = (tip: BABYLON.Vector3, d: BABYLON.Vector3) => {
          const arrowPoints = [
            tip.subtract(d.scale(0.1)).add(perp),
            tip,
            tip.subtract(d.scale(0.1)).subtract(perp)
          ];
          const arrowMesh = BABYLON.MeshBuilder.CreateLines("arrow", { points: arrowPoints }, scene);
          arrowMesh.color = lineMesh.color;
          measurementLinesRef.current.push(arrowMesh);
        };

        addArrow(p1, dir.scale(-1));
        addArrow(p2, dir);
      }

      // Add labels (centered on lines)
      if (points.length >= 2) {
        const p1 = points[0];
        const p2 = points[points.length - 1];
        const mid = BABYLON.Vector3.Center(p1, p2);
        
        const rect = new GUI.Rectangle();
        rect.width = "48px";
        rect.height = "16px";
        rect.cornerRadius = 2;
        rect.thickness = 0;
        rect.background = "rgba(0,0,0,0.7)";
        gui.addControl(rect);
        
        const labelText = new GUI.TextBlock();
        labelText.text = chain.label;
        labelText.color = chain.type === 'gap' ? "#aaaaaa" : "white";
        labelText.fontSize = 9;
        labelText.fontWeight = "bold";
        rect.addControl(labelText);

        const node = new BABYLON.TransformNode("ln", scene);
        node.position = mid;
        rect.linkWithMesh(node);
        measurementLinesRef.current.push(node as any);
      }
    });

    // Add Rulers (Faded for blueprint mode)
    const isTop = baseView === 'top';
    const maxDim = Math.max(boothConfig.width, boothConfig.depth);
    for (let i = 0; i <= maxDim; i++) {
      // X-Axis Marker (Top or Bottom edge)
      if (i <= boothConfig.width) {
        const xNode = new BABYLON.TransformNode("rx", scene);
        xNode.position = new BABYLON.Vector3(i, 0, isTop ? -0.4 : 0);
        const xLabel = new GUI.TextBlock();
        xLabel.text = `${i}m`;
        xLabel.color = "rgba(255,255,255,0.7)";
        xLabel.fontSize = 9;
        gui.addControl(xLabel);
        xLabel.linkWithMesh(xNode);
        measurementLinesRef.current.push(xNode as any);
      }
      
      // Z-Axis Marker (Left or Right edge)
      if (i <= boothConfig.depth && isTop) {
        const zNode = new BABYLON.TransformNode("rz", scene);
        zNode.position = new BABYLON.Vector3(-0.4, 0, i);
        const zLabel = new GUI.TextBlock();
        zLabel.text = `${i}m`;
        zLabel.color = "rgba(255,255,255,0.7)";
        zLabel.fontSize = 9;
        gui.addControl(zLabel);
        zLabel.linkWithMesh(zNode);
        measurementLinesRef.current.push(zNode as any);
      }
    }

  }, [activeView, debouncedElements, boothConfig, isSceneReady]);

  const isCapturingRef = useRef(false);

  // 2.3 Handle Export/Download/Capture Trigger
  useEffect(() => {
    if (!isSceneReady || isCapturingRef.current) return;
    
    const isDownload = activeView.endsWith('_download');
    const isCapture = activeView.endsWith('_capture');
    
    if (!isDownload && !isCapture) return;

    const capture = async () => {
      if (isCapturingRef.current) return;
      isCapturingRef.current = true;
      
      const baseView = activeView.replace('_download', '').replace('_capture', '');
      
      // Wait for camera, measurements and UI to settle (crucial for labels)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const scene = sceneRef.current;
      const engine = engineRef.current;
      if (!scene || !engine || !canvasRef.current) {
        isCapturingRef.current = false;
        return;
      }

      // Force the engine to physically render at full resolution before capturing.
      // This avoids blurry upsampling from a small on-screen canvas.
      const captureW = 2560, captureH = 1440;
      engine.setSize(captureW, captureH);
      scene.render(); // Force one render at the new size

      BABYLON.Tools.CreateScreenshot(engine, scene.activeCamera!, { width: captureW, height: captureH }, (data) => {
        // Restore the canvas to the natural container size after capture
        engine.resize();

        if (isDownload) {
          const link = document.createElement('a');
          link.download = `booth_${baseView}_blueprint.png`;
          link.href = data;
          link.click();
        }
        
        isCapturingRef.current = false;
        onExportComplete?.(baseView, data);
      });
    };

    capture();
  }, [activeView, isSceneReady, onExportComplete]);

  // 3. Sync Elements
  useEffect(() => {
    if (!isSceneReady || !debouncedElements || !boothConfig) return;
    const elements = debouncedElements;

    const attachDragBehavior = (pivotMesh: BABYLON.AbstractMesh, elementId: string) => {
      const scene = sceneRef.current;
      if (!scene) return;

      const existing = pivotMesh.getBehaviorByName("PointerDrag");
      if (existing) return;

      const dragBehavior = new BABYLON.PointerDragBehavior({
        dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)
      });
      dragBehavior.moveAttached = false; // We handle position and rotation manually

      let isRotating = false;
      let startRotY = 0;
      let startX = 0;

      dragBehavior.onDragStartObservable.add(() => {
        const activeCam = scene.activeCamera;
        if (activeCam) {
          activeCam.detachControl();
        }
        onSelectElement?.(elementId);

        isRotating = isShiftPressedRef.current;
        startRotY = pivotMesh.rotation.y;
        startX = scene.pointerX;
      });

      dragBehavior.onDragObservable.add((evt) => {
        if (isRotating) {
           const deltaX = scene.pointerX - startX;
           // Roughly 1 degree per pixel
           pivotMesh.rotation.y = startRotY + (deltaX * Math.PI / 180);
        } else {
           pivotMesh.position.addInPlace(evt.delta);
        }
      });

      dragBehavior.onDragEndObservable.add(() => {
        const activeCam = scene.activeCamera;
        if (activeCam && canvasRef.current) {
          activeCam.attachControl(canvasRef.current, true);
        }

        if (isRotating) {
           const nativeOffset = pivotMesh.metadata?.nativeOffset || 0;
           const facingOffsetRad = BABYLON.Tools.ToRadians(pivotMesh.metadata?.facingOffset || 0);
           const pureRotY = pivotMesh.rotation.y - nativeOffset - facingOffsetRad;
           
           const finalRot = pureRotY * (180 / Math.PI);
           let normalized = Math.round(finalRot) % 360;
           if (normalized < 0) normalized += 360;
           onUpdateElement?.(elementId, { rotation: normalized });
        } else {
           const newX = pivotMesh.position.x * PPM;
           const newY = (boothConfig.depth - pivotMesh.position.z) * PPM;

           // Snap to nearest 10px (0.1m) to match 2D grid snapping
           const fineSnapSize = 10;
           const snapToGrid = (val: number) => Math.round(val / fineSnapSize) * fineSnapSize;

           onUpdateElement?.(elementId, { 
             x: snapToGrid(newX), 
             y: snapToGrid(newY) 
           });
        }
        
        // Reset shift state after drag ends just in case
        isRotating = false;
        isShiftPressedRef.current = false;
      });

      pivotMesh.addBehavior(dragBehavior);
    };

    prevElementsRef.current = elements;

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

    // --- SMART BUTT JOINT CALCULATION ---
    const wallConnections = new Map();
    const walls = elements.filter(el => el.type === 'wall');
    
    walls.forEach(el => {
      const r = BABYLON.Tools.ToRadians(el.rotation || 0);
      const hw = el.width / 2;
      const dx = Math.cos(r) * hw;
      const dy = Math.sin(r) * hw;
      wallConnections.set(el.id, {
        p1: { x: el.x - dx, y: el.y - dy },
        p2: { x: el.x + dx, y: el.y + dy },
        r,
        t: el.thickness || 10,
        s1: 0,
        s2: 0,
        l1: 0,
        l2: 0
      });
    });

    const threshold = 15; // 15 pixels snapping radius
    const dist = (a: any, b: any) => Math.hypot(a.x - b.x, a.y - b.y);

    for (let i = 0; i < walls.length; i++) {
      for (let j = i + 1; j < walls.length; j++) {
        const w1 = walls[i];
        const w2 = walls[j];
        const d1 = wallConnections.get(w1.id);
        const d2 = wallConnections.get(w2.id);

        const isW1Horiz = Math.abs(Math.cos(d1.r)) > Math.abs(Math.sin(d1.r));
        const isW2Horiz = Math.abs(Math.cos(d2.r)) > Math.abs(Math.sin(d2.r));

        let through = null, butt = null;
        if (isW1Horiz && !isW2Horiz) { through = d1; butt = d2; }
        else if (!isW1Horiz && isW2Horiz) { through = d2; butt = d1; }
        else { through = d1; butt = d2; } 

        if (dist(butt.p1, through.p1) < threshold) {
          butt.s1 = Math.max(butt.s1, through.t / 2);
          through.l1 = Math.max(through.l1, butt.t / 2);
        }
        if (dist(butt.p1, through.p2) < threshold) {
          butt.s1 = Math.max(butt.s1, through.t / 2);
          through.l2 = Math.max(through.l2, butt.t / 2);
        }
        if (dist(butt.p2, through.p1) < threshold) {
          butt.s2 = Math.max(butt.s2, through.t / 2);
          through.l1 = Math.max(through.l1, butt.t / 2);
        }
        if (dist(butt.p2, through.p2) < threshold) {
          butt.s2 = Math.max(butt.s2, through.t / 2);
          through.l2 = Math.max(through.l2, butt.t / 2);
        }
      }
    }
    // --- END SMART BUTT JOINT CALCULATION ---

    elements.forEach(el => {
      let vX = el.x, vY = el.y, vW = el.width;
      let delta1 = 0, delta2 = 0;
      
      if (el.type === 'wall') {
        const conn = wallConnections.get(el.id);
        if (conn) {
          delta1 = conn.l1 - conn.s1; 
          delta2 = conn.l2 - conn.s2;
          vW = Math.max(1, el.width + delta1 + delta2);
          const shiftMag = (delta2 - delta1) / 2;
          vX = el.x + Math.cos(conn.r) * shiftMag;
          vY = el.y + Math.sin(conn.r) * shiftMag;
        }
      }

      const x = vX / PPM;
      const z = boothConfig.depth - (vY / PPM);
      const rotY = BABYLON.Tools.ToRadians(el.rotation || 0);
      const h = 2.5;

      let needsRecreate = false;
      const hasWallElements = el.wallElements && el.wallElements.length > 0;

      if (registry.has(el.id)) {
        const mesh = registry.get(el.id)!;
        if (el.type === 'wall') {
          const cutouts = (el.wallElements || []).filter((wel: any) => ['door', 'window'].includes(wel.type));
          const geometryState = JSON.stringify({
            w: vW,
            t: el.thickness || 10,
            v: el.verticalScale || 1,
            c: cutouts.map((c: any) => ({ t: c.type, x: c.x + delta1, y: c.y, w: c.width, h: c.height }))
          });

          if (!mesh.metadata || mesh.metadata.geometryState !== geometryState) {
            needsRecreate = true;
          }
        } else if (el.type === '3d_logo') {
          if (!mesh.metadata || mesh.metadata.svgData !== el.svgData || mesh.metadata.depth !== el.depth || mesh.metadata.logoStyle !== el.logoStyle || mesh.metadata.width !== el.width || mesh.metadata.height !== el.height) {
            needsRecreate = true;
          }
        } else if (['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(el.type)) {
          const stateStr = JSON.stringify({
            w: el.width, h: el.height, d: el.realDepth, rh: el.realHeight, f: el.fill,
            p: el.profile, pc: el.platesCount, pt: el.plateThickness, pg: el.plateGap, o: el.orientation, s: el.style, sx: el.scaleX
          });
          if (!mesh.metadata || mesh.metadata.geometryState !== stateStr) {
            needsRecreate = true;
          }
        }
      }

      if (registry.has(el.id) && !needsRecreate && el.type !== 'wall') {
        const mesh = registry.get(el.id)!;
        const vScale = el.verticalScale || 1;
        const hActual = ['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(el.type) ? (el.realHeight || 2.5) : (el.type === 'wall' ? 2.5 : 1);
        
        mesh.position.x = x;
        mesh.position.z = z;
        
        if (el.type === 'asset') {
          mesh.position.y = el.yOffset || 0;
        } else {
          mesh.position.y = (hActual * vScale / 2) + (el.yOffset || 0);
        }
        
        if (mesh.rotationQuaternion) mesh.rotationQuaternion = null;
        mesh.rotation.y = rotY + (mesh.metadata?.nativeOffset || 0) + BABYLON.Tools.ToRadians(el.facingOffset || 0);
        if (el.type !== 'asset') {
          mesh.scaling.y = vScale;
        }

        if (el.type === 'asset' && mesh.metadata && mesh.metadata.nativeLength) {
          if (!el.isCustomAsset) {
            const targetDim = Math.max(el.width, el.height) / PPM;
            const s = targetDim / mesh.metadata.nativeLength;
            let sY = s * (el.verticalScale || 1);
            if (el.specH && mesh.metadata.nativeHeight && mesh.metadata.nativeHeight > 0) {
              sY = el.specH / mesh.metadata.nativeHeight;
            }
            mesh.scaling = new BABYLON.Vector3(s, sY, s);
          } else {
            const s = el.customScale || 1.0;
            const sY = s * (el.verticalScale || 1);
            mesh.scaling = new BABYLON.Vector3(s, sY, s);
          }
        }

        if (el.type === '3d_logo') {
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
          const wVal = vW / PPM;
          const dVal = (el.thickness || 10) / PPM;
          const vScale = el.verticalScale || 1;
          const wallHeight = h * vScale;
          const cutouts = (el.wallElements || []).filter((wel: any) => ['door', 'window'].includes(wel.type));
          const decorations = (el.wallElements || []).filter((wel: any) => !['door', 'window'].includes(wel.type));
          
          const geometryState = JSON.stringify({
            w: vW,
            t: el.thickness || 10,
            v: vScale,
            c: cutouts.map((c: any) => ({ t: c.type, x: c.x + delta1, y: c.y, w: c.width, h: c.height }))
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

            mesh = BABYLON.MeshBuilder.CreateBox(el.id, { width: wVal, height: wallHeight, depth: dVal }, scene);
            
            if (cutouts.length > 0) {
              let wallCSG = BABYLON.CSG.FromMesh(mesh);
              const trimColor = new BABYLON.Color3(0.2, 0.2, 0.2);
              const ft = 0.04;

              cutouts.forEach((wel: any, index: number) => {
                const cutW = wel.width / PPM, cutH = wel.height / PPM, cutD = dVal + 0.5;
                const localX = ((wel.x + delta1) / PPM) - (wVal / 2) + (cutW / 2);
                const localY = (wallHeight / 2) - (wel.y / PPM) - (cutH / 2);
                
                const cutBox = BABYLON.MeshBuilder.CreateBox("cut", { width: cutW, height: cutH, depth: cutD }, scene);
                cutBox.position.set(localX, localY, 0);
                wallCSG = wallCSG.subtract(BABYLON.CSG.FromMesh(cutBox));
                cutBox.dispose();

                // Cutout accessories (frames/glass)
                const accessoryGroup = new BABYLON.Mesh("acc_" + index, scene);
                accessoryGroup.position.set(localX, localY, 0);
                accessoryGroup.parent = mesh;

                const cColor = wel.color ? BABYLON.Color3.FromHexString(wel.color) : null;
                const frameMat = new BABYLON.StandardMaterial("fmat", scene);
                frameMat.diffuseColor = (wel.type === 'window' && cColor) ? cColor : trimColor;
                frameMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

                if (wel.type === 'window') {
                   const fTop = BABYLON.MeshBuilder.CreateBox("ft", { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                   fTop.position.y = cutH/2 - ft/2; fTop.material = frameMat; fTop.parent = accessoryGroup;
                   const fBot = BABYLON.MeshBuilder.CreateBox("fb", { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                   fBot.position.y = -cutH/2 + ft/2; fBot.material = frameMat; fBot.parent = accessoryGroup;
                   const fLeft = BABYLON.MeshBuilder.CreateBox("fl", { width: ft, height: cutH - ft*2, depth: dVal + 0.02 }, scene);
                   fLeft.position.x = -cutW/2 + ft/2; fLeft.material = frameMat; fLeft.parent = accessoryGroup;
                   const fRight = BABYLON.MeshBuilder.CreateBox("fr", { width: ft, height: cutH - ft*2, depth: dVal + 0.02 }, scene);
                   fRight.position.x = cutW/2 - ft/2; fRight.material = frameMat; fRight.parent = accessoryGroup;
                   
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
                   const fTop = BABYLON.MeshBuilder.CreateBox("dt", { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                   fTop.position.y = cutH/2 - ft/2; fTop.material = frameMat; fTop.parent = accessoryGroup;
                   const fLeft = BABYLON.MeshBuilder.CreateBox("dlf", { width: ft, height: cutH - ft, depth: dVal + 0.02 }, scene);
                   fLeft.position.x = -cutW/2 + ft/2; fLeft.position.y = -ft/2; fLeft.material = frameMat; fLeft.parent = accessoryGroup;
                   const fRight = BABYLON.MeshBuilder.CreateBox("drf", { width: ft, height: cutH - ft, depth: dVal + 0.02 }, scene);
                   fRight.position.x = cutW/2 - ft/2; fRight.position.y = -ft/2; fRight.material = frameMat; fRight.parent = accessoryGroup;

                   const leaf = BABYLON.MeshBuilder.CreateBox("dl", { width: cutW - ft*2, height: cutH - ft, depth: 0.04 }, scene);
                   leaf.position.y = -ft/2; 
                   const leafMat = new BABYLON.StandardMaterial("leafMat", scene);
                   leafMat.diffuseColor = cColor ? cColor : new BABYLON.Color3(0.39, 0.26, 0.13); 
                   leafMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
                   leaf.material = leafMat;
                   leaf.parent = accessoryGroup;

                   const handle = BABYLON.MeshBuilder.CreateSphere("handle", { diameter: 0.05 }, scene);
                   handle.position.set(cutW/2 - ft*3, -0.1, 0.03); 
                   handle.parent = leaf;
                   const hMat = new BABYLON.StandardMaterial("hmat", scene);
                   hMat.diffuseColor = new BABYLON.Color3(0.8, 0.7, 0.3); 
                   hMat.specularColor = new BABYLON.Color3(1, 0.9, 0.5);
                   handle.material = hMat;
                }
              });

              const finalMesh = wallCSG.toMesh(el.id, null, scene);
              mesh.getChildren().forEach(child => child.parent = finalMesh);
              mesh.dispose(); mesh = finalMesh as BABYLON.Mesh;
            }
            
            shadowGenerator.addShadowCaster(mesh);
            registry.set(el.id, mesh);
          } else {
            mesh = registry.get(el.id) as BABYLON.Mesh;
          }

          const decorationState = JSON.stringify(decorations);
          if (!mesh.metadata || mesh.metadata.decorationState !== decorationState) {
            wallDecorationRegistryRef.current.get(el.id)?.forEach(m => m.dispose());
            const newDecorations: BABYLON.AbstractMesh[] = [];

            decorations.forEach((wel: any, index: number) => {
              const cutW = wel.width / PPM, cutH = wel.height / PPM;
              const localX = ((wel.x + delta1) / PPM) - (wVal / 2) + (cutW / 2);
              const localY = (wallHeight / 2) - (wel.y / PPM) - (cutH / 2);
              let mount: BABYLON.Mesh;

              if (wel.type === 'shelf') {
                mount = BABYLON.MeshBuilder.CreateBox("shelf", { width: cutW, height: 0.03, depth: 0.3 }, scene);
                mount.position.set(localX, localY, -dVal/2 - 0.15);
                const sMat = new BABYLON.StandardMaterial("sMat", scene);
                sMat.diffuseColor = wel.color ? BABYLON.Color3.FromHexString(wel.color) : new BABYLON.Color3(0.6, 0.4, 0.2);
                mount.material = sMat;
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
                mount = BABYLON.MeshBuilder.CreatePlane("banner", { width: cutW, height: cutH, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
                const layerOffset = 0.003 + (index * 0.002);
                mount.position.set(localX, localY, -dVal/2 - layerOffset);
                const bMat = new BABYLON.PBRMaterial("bm_" + index, scene);
                bMat.zOffset = -index * 2;
                if (wel.url) {
                  const tex = new BABYLON.Texture(wel.url, scene);
                  tex.hasAlpha = true;
                  bMat.albedoTexture = tex;
                  bMat.useAlphaFromAlbedoTexture = true;
                  bMat.transparencyMode = 2; 
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

          mesh.position.set(x, (h * vScale / 2) + (el.yOffset || 0), z);
          mesh.scaling.y = el.type === 'wall' ? 1 : vScale;
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
            
            if (el.material === 'custom_color') {
              mat.albedoColor = BABYLON.Color3.FromHexString(el.color || '#f0f0f0'); 
              mat.albedoTexture = null;
            } else if (texName) {
              const texUrl = `/assets/textures/${texName}.png`;
              if (!mat.albedoTexture || (mat.albedoTexture as BABYLON.Texture).url !== texUrl) {
                let cachedTex = textureCacheRef.current.get(texUrl);
                if (!cachedTex) {
                  cachedTex = new BABYLON.Texture(texUrl, scene);
                  textureCacheRef.current.set(texUrl, cachedTex);
                }
                mat.albedoTexture = cachedTex.clone();
              }
              const currentTex = mat.albedoTexture as BABYLON.Texture;
              if (currentTex) {
                currentTex.uScale = wVal / 2; 
                currentTex.vScale = (h * vScale) / 2;
              }
            } else {
              mat.albedoColor = new BABYLON.Color3(0.92, 0.92, 0.92); mat.albedoTexture = null;
            }
          }
          mesh.material = mat;
          mesh.metadata = { 
            geometryState, 
            decorationState, 
            baseWidth: wVal,
            isOuter: el.isOuter,
            wallDir: el.id.split('-')[1] 
          };
          registry.set(el.id, mesh);

        } else if (el.type === '3d_logo') {
          const depth = (el.depth || 5) / PPM;
          const w = el.width / PPM;
          const h = el.height / PPM;
          const baseColor = BABYLON.Color3.FromHexString(el.logoColor || '#ffffff');

          const pivot = new BABYLON.Mesh(el.id, scene);
          pivot.position.set(x, (h / 2) + (el.yOffset || 0), z);
          pivot.rotation.y = rotY;

          // Helper to create a plane layer at a given z offset
          const makeLayer = (zOffset: number, mat: BABYLON.StandardMaterial) => {
            const p = BABYLON.MeshBuilder.CreatePlane(el.id + "_layer" + zOffset, { width: w, height: h }, scene);
            p.parent = pivot;
            p.position.z = zOffset;
            p.material = mat;
            return p;
          };

          // ---- FRONT FACE PLANE: SVG via Canvas ----
          const faceMat = new BABYLON.StandardMaterial(el.id + "_face_mat", scene);
          faceMat.backFaceCulling = true; // Don't render the back

          // ---- DEPTH LAYERS: stack of solid-color planes behind the front ----
          const sideMat = new BABYLON.StandardMaterial(el.id + "_side_mat", scene);
          sideMat.diffuseColor = baseColor;
          sideMat.backFaceCulling = false; // Sides visible from all angles
          if (el.logoStyle === 'chrome') { sideMat.specularColor = new BABYLON.Color3(1, 1, 1); sideMat.specularPower = 128; }
          if (el.logoStyle === 'glowing') { sideMat.emissiveColor = baseColor; }

          const steps = Math.max(1, Math.round(depth / 0.005));
          const stepSize = depth / steps;
          for (let i = 1; i <= steps; i++) {
            makeLayer(i * stepSize, sideMat);
          }

          // Front face on top
          const facePlane = makeLayer(0, faceMat);
          shadowGenerator.addShadowCaster(facePlane);

          if (el.svgData) {
            const PX_W = Math.round(el.width * 4);
            const PX_H = Math.round(el.height * 4);
            
            let url = '';
            let isBlobUrl = false;
            if (el.svgData.startsWith('data:')) {
              url = el.svgData;
            } else {
              const blob = new Blob([el.svgData], { type: 'image/svg+xml;charset=utf-8' });
              url = URL.createObjectURL(blob);
              isBlobUrl = true;
            }

            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = PX_W;
              canvas.height = PX_H;
              const ctx = canvas.getContext('2d')!;
              ctx.clearRect(0, 0, PX_W, PX_H);
              
              // BabylonJS applies textures upside down on CreatePlane
              ctx.translate(0, PX_H);
              ctx.scale(1, -1);
              
              ctx.drawImage(img, 0, 0, PX_W, PX_H);
              if (isBlobUrl) URL.revokeObjectURL(url);

              const dynTex = new BABYLON.DynamicTexture(el.id + "_tex", { width: PX_W, height: PX_H }, scene, false);
              dynTex.getContext().drawImage(canvas, 0, 0);
              dynTex.update(false);
              dynTex.hasAlpha = true;

              faceMat.diffuseTexture = dynTex;
              faceMat.opacityTexture = dynTex;
              faceMat.useAlphaFromDiffuseTexture = true;

              // Apply same opacity mask to depth layers so they clip to logo shape
              sideMat.opacityTexture = dynTex;

              if (el.logoStyle === 'glowing') {
                faceMat.emissiveTexture = dynTex;
                faceMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
              }
            };
            img.src = url;
          } else {
            faceMat.diffuseColor = baseColor;
          }

          pivot.metadata = { 
            svgData: el.svgData, 
            depth: el.depth, 
            logoStyle: el.logoStyle,
            width: el.width,
            height: el.height
          };
          registry.set(el.id, pivot);
          attachDragBehavior(pivot, el.id);

        } else if (['pillar', 'caged-wall', 'caged-panel', 'panel'].includes(el.type)) {
          const w = (el.width / PPM) * Math.abs(el.scaleX || 1);
          const h = el.realHeight || 2.5;
          const d = el.realDepth || 0.1;
          const baseColor = BABYLON.Color3.FromHexString(el.fill || '#aaaaaa');

          let mesh: BABYLON.Mesh;
          
          if (el.type === 'pillar') {
            if (el.profile === 'round') {
              mesh = BABYLON.MeshBuilder.CreateCylinder(el.id, { diameter: Math.max(w, d), height: h }, scene);
            } else {
              mesh = BABYLON.MeshBuilder.CreateBox(el.id, { width: w, height: h, depth: d }, scene);
            }
          } else if (el.type === 'caged-wall' || el.type === 'caged-panel') {
            mesh = new BABYLON.Mesh(el.id, scene);
            const platesCount = el.platesCount || 5;
            const plateThickness = el.plateThickness || 0.05;
            const plateGap = el.plateGap || 0.2;
            const orientation = el.orientation || 'horizontal';
            
            if (el.type === 'caged-wall') {
              // Generate plates starting from bottom (horizontal) or left (vertical)
              let offset = orientation === 'horizontal' 
                ? (-h / 2 + plateThickness / 2) 
                : (-w / 2 + plateThickness / 2);
              
              for (let i = 0; i < platesCount; i++) {
                const plateName = `${el.id}_plate_${i}`;
                let plate: BABYLON.Mesh;
                if (orientation === 'horizontal') {
                  plate = BABYLON.MeshBuilder.CreateBox(plateName, { width: w, height: plateThickness, depth: d }, scene);
                  plate.position.y = offset;
                } else {
                  plate = BABYLON.MeshBuilder.CreateBox(plateName, { width: plateThickness, height: h, depth: d }, scene);
                  plate.position.x = offset;
                }
                plate.parent = mesh;
                shadowGenerator.addShadowCaster(plate);
                plate.receiveShadows = true;
                offset += plateThickness + plateGap;
                
                const pMat = new BABYLON.StandardMaterial(`${plateName}_mat`, scene);
                pMat.diffuseColor = baseColor;
                plate.material = pMat;
              }
            } else { // caged-panel
              // Generate plates starting from back (horizontal) or left (vertical)
              let offset = orientation === 'horizontal' 
                ? (-d / 2 + plateThickness / 2) 
                : (-w / 2 + plateThickness / 2);
              
              for (let i = 0; i < platesCount; i++) {
                const plateName = `${el.id}_plate_${i}`;
                let plate: BABYLON.Mesh;
                if (orientation === 'horizontal') {
                  // Plates parallel to X axis, spaced along Z axis
                  plate = BABYLON.MeshBuilder.CreateBox(plateName, { width: w, height: h, depth: plateThickness }, scene);
                  plate.position.z = offset;
                } else {
                  // Plates parallel to Z axis, spaced along X axis
                  plate = BABYLON.MeshBuilder.CreateBox(plateName, { width: plateThickness, height: h, depth: d }, scene);
                  plate.position.x = offset;
                }
                plate.parent = mesh;
                shadowGenerator.addShadowCaster(plate);
                plate.receiveShadows = true;
                offset += plateThickness + plateGap;
                
                const pMat = new BABYLON.StandardMaterial(`${plateName}_mat`, scene);
                pMat.diffuseColor = baseColor;
                plate.material = pMat;
              }
            }
          } else { // panel
            mesh = BABYLON.MeshBuilder.CreateBox(el.id, { width: w, height: h, depth: d }, scene);
          }

          mesh.position.set(x, (h / 2) + (el.yOffset || 0), z);
          mesh.rotation.y = rotY;

          if (el.type !== 'caged-wall' && el.type !== 'caged-panel') {
            const mat = new BABYLON.StandardMaterial(el.id + "_mat", scene);
            mat.diffuseColor = baseColor;
            mesh.material = mat;
            shadowGenerator.addShadowCaster(mesh);
            mesh.receiveShadows = true;
          }

          const stateStr = JSON.stringify({
            w: el.width, h: el.height, d: el.realDepth, rh: el.realHeight, f: el.fill,
            p: el.profile, pc: el.platesCount, pt: el.plateThickness, pg: el.plateGap, o: el.orientation, s: el.style, sx: el.scaleX
          });
          mesh.metadata = { width: el.width, height: el.height, fill: el.fill, geometryState: stateStr };
          registry.set(el.id, mesh);
          attachDragBehavior(mesh, el.id);

        } else if (el.type === 'asset') {
          // Preserve original case for filename (e.g. Fridge.glb, MicrowaveOven.glb, WallOven.glb)
          const modelFileName = el.assetName || 'box';
          const modelName = modelFileName.toLowerCase();
          const pivot = BABYLON.MeshBuilder.CreateBox("pivot_" + el.id, { size: 0.01 }, scene);
          pivot.isVisible = false;
          pivot.position.set(x, el.yOffset || 0, z);
          
          const regEntry = ASSET_REGISTRY.find(a => a.id === el.assetName) as any;
          const facingOffset = (regEntry?.facingOffset) ?? el.facingOffset ?? 0;
          
          // Original git orientation: no nativeOffset applied — models load in their native .glb orientation
          pivot.rotation.y = rotY + BABYLON.Tools.ToRadians(facingOffset);
          
          pivot.metadata = { nativeLength: 0, nativeHeight: 0 };
          
          registry.set(el.id, pivot);
          attachDragBehavior(pivot, el.id);

          const instantiateAndSetup = (container: BABYLON.AssetContainer) => {
            if (!registry.has(el.id)) return;
            pivot.getChildMeshes().forEach(m => { if (m.name === "ph") m.dispose(); });
            const entries = container.instantiateModelsToScene();
            
            const wrapper = new BABYLON.TransformNode("wrapper_" + el.id, scene);
            wrapper.parent = pivot;

            entries.rootNodes.forEach(node => {
              node.parent = wrapper;
              node.getChildMeshes().forEach(m => {
                if (m.getTotalVertices() > 20) {
                  m.receiveShadows = true;
                  shadowGenerator.addShadowCaster(m, true);
                }
              });
            });

            wrapper.computeWorldMatrix(true);
            const bbox = wrapper.getHierarchyBoundingVectors(true);
            const sz = bbox.max.subtract(bbox.min);
            const longest = Math.max(sz.x, sz.z);
            if (longest > 0) {
              pivot.metadata = { nativeLength: longest, nativeHeight: sz.y };
              let s = 1.0;
              if (!el.isCustomAsset) {
                s = (Math.max(el.width, el.height) / PPM) / longest;
              } else if (el.customScale) {
                s = el.customScale;
              }
              let sY = s * (el.verticalScale || 1);
              if (!el.isCustomAsset && el.specH && sz.y > 0) {
                sY = el.specH / sz.y;
              }
              pivot.scaling.set(s, sY, s);
              
              // Use inverse pivot world matrix to correctly convert world-space bbox center
              // to pivot-local space, accounting for pivot position and scale.
              // Without this, wrapper.position -= center.x/z subtracts world coords
              // instead of the local offset, causing assets to fly to wrong positions.
              const center = bbox.min.add(sz.scale(0.5));
              const worldOffset = center.subtract(pivot.position);
              const invPivotMatrix = new BABYLON.Matrix();
              pivot.getWorldMatrix().invertToRef(invPivotMatrix);
              const localOffset = BABYLON.Vector3.TransformNormal(worldOffset, invPivotMatrix);
              wrapper.position.x -= localOffset.x;
              wrapper.position.z -= localOffset.z;
              // Floor the model to ground level (bbox.min.y is world-space bottom before scaling)
              wrapper.position.y -= bbox.min.y;
            }
          };

          const cacheKey = el.assetUrl || modelName;
          const cache = modelCacheRef.current;
          if (cache.has(cacheKey)) {
            cache.get(cacheKey)!.then(container => instantiateAndSetup(container));
          } else {
            const ph = BABYLON.MeshBuilder.CreateBox("ph", { width: el.width/PPM, height: 0.8, depth: el.height/PPM }, scene);
            ph.parent = pivot; ph.position.y = 0.4;
            const phMat = new BABYLON.StandardMaterial("phMat", scene);
            phMat.wireframe = true; phMat.emissiveColor = new BABYLON.Color3(0, 0.8, 1); phMat.alpha = 0.5;
            ph.material = phMat;
            
            const basePath = el.categoryFolder ? `/models/${el.categoryFolder}/` : "/models/";
            const ext = el.fileName?.toLowerCase().endsWith('.gltf') ? '.gltf' : '.glb';
            // Preserve original filename case (e.g. Fridge.glb, MicrowaveOven.glb, WallOven.glb)
            const loadPromise = el.assetUrl
              ? BABYLON.SceneLoader.LoadAssetContainerAsync("", el.assetUrl, scene, undefined, ext)
              : BABYLON.SceneLoader.LoadAssetContainerAsync(basePath, `${modelFileName}.glb`, scene);
            
            cache.set(cacheKey, loadPromise);
            loadPromise.then(container => instantiateAndSetup(container)).catch(e => console.error("Failed to load model", cacheKey, e));
          }
        }
      }
    });
  }, [debouncedElements, isSceneReady, boothConfig]);

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => {
        if (engineRef.current) engineRef.current.resize();
      }, 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const takeScreenshot = () => {
    const scene = sceneRef.current;
    const engine = engineRef.current;
    if (!scene || !engine || !canvasRef.current) return;
    
    // Hide grid for screenshot if visible
    const grid = scene.getMeshByName("blueprintGrid");
    const wasGridVisible = grid ? grid.isVisible : false;
    if (grid) grid.isVisible = false;
    
    const captureW = 3840, captureH = 2160; // 4K Resolution
    engine.setSize(captureW, captureH);
    scene.render();
    
    BABYLON.Tools.CreateScreenshot(engine, scene.activeCamera!, { width: captureW, height: captureH }, (data) => {
      if (grid) grid.isVisible = wasGridVisible;
      engine.resize();
      const link = document.createElement('a');
      link.href = data;
      link.download = `3d-snapshot-${Date.now()}.png`;
      link.click();
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const setCameraAngle = (alpha: number, beta: number) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const orbitCam = scene.getCameraByName("orbitCam") as BABYLON.ArcRotateCamera;
    if (!orbitCam) return;
    
    if (cameraMode !== 'orbit') {
      setCameraMode('orbit');
    }

    const ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    BABYLON.Animation.CreateAndStartAnimation('camMoveAlpha', orbitCam, 'alpha', 60, 30, orbitCam.alpha, alpha, 2, ease);
    BABYLON.Animation.CreateAndStartAnimation('camMoveBeta', orbitCam, 'beta', 60, 30, orbitCam.beta, beta, 2, ease);
    
    const centerX = boothConfig?.width / 2 || 0;
    const centerZ = boothConfig?.depth / 2 || 0;
    const target = new BABYLON.Vector3(centerX, 0.5, centerZ);
    
    BABYLON.Animation.CreateAndStartAnimation('camTarget', orbitCam, 'target', 60, 30, orbitCam.getTarget(), target, 2, ease);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--bg-base)] p-4 gap-4">
      {activeView === 'perspective' && !isFullscreen && (
        <div className="w-full flex justify-between items-center max-w-[calc(100vh*16/9)]">
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.1)] text-[10px] font-bold text-white uppercase backdrop-blur-md">
              {cameraMode === 'orbit' ? 'Orbit Mode 🌐' : 'Flight Mode 🛸'}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[rgba(0,180,255,0.2)] border border-[rgba(0,180,255,0.3)] text-[10px] font-bold text-[#bbf] uppercase backdrop-blur-md">
              Hold Shift to Rotate Assets
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const currentHQ = localStorage.getItem('hq_3d') === 'true';
                localStorage.setItem('hq_3d', currentHQ ? 'false' : 'true');
                window.location.reload();
              }} 
              className="px-4 py-2 bg-[rgba(0,0,0,0.6)] hover:bg-[var(--brand)] border border-[rgba(255,255,255,0.1)] text-xs font-bold text-white uppercase rounded-lg backdrop-blur-md transition-colors cursor-pointer"
            >
              {localStorage.getItem('hq_3d') === 'true' ? "HQ: ON" : "HQ: OFF"}
            </button>
            <button onClick={() => setCameraMode(prev => prev === 'orbit' ? 'flight' : 'orbit')} className="px-4 py-2 bg-[rgba(0,0,0,0.6)] hover:bg-[var(--sea-ink)] border border-[rgba(255,255,255,0.1)] text-xs font-bold text-white uppercase rounded-lg backdrop-blur-md transition-colors cursor-pointer">
              {cameraMode === 'orbit' ? "Flight Mode" : "Orbit Mode"}
            </button>
          </div>
        </div>
      )}
      <div ref={containerRef} className={`w-full relative overflow-hidden shadow-2xl ring-1 ring-white/10 ${isFullscreen ? 'h-screen max-w-none rounded-none' : 'max-h-full aspect-video rounded-2xl'}`} style={{ backgroundColor: '#0d0d0f' }}>
        <canvas ref={canvasRef} className="w-full h-full block outline-none touch-none" />
        
        {/* UI Overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={takeScreenshot}
            className="p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white backdrop-blur-md transition-all shadow-lg group flex items-center justify-center"
            title="Take High-Res Snapshot"
          >
            <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white backdrop-blur-md transition-all shadow-lg group flex items-center justify-center"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5 group-hover:scale-110 transition-transform" /> : <Maximize className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          </button>
        </div>
        
        {isFullscreen && activeView === 'perspective' && (
          <>
            <div className="absolute top-4 left-4 flex gap-2">
               <div className="px-3 py-1.5 rounded-lg bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.1)] text-[10px] font-bold text-white uppercase backdrop-blur-md">
                  {cameraMode === 'orbit' ? 'Orbit Mode 🌐' : 'Flight Mode 🛸'}
                </div>
                <button onClick={() => setCameraMode(prev => prev === 'orbit' ? 'flight' : 'orbit')} className="px-3 py-1.5 bg-[rgba(0,0,0,0.6)] hover:bg-[var(--sea-ink)] border border-[rgba(255,255,255,0.1)] text-[10px] font-bold text-white uppercase rounded-lg backdrop-blur-md transition-colors cursor-pointer">
                  Switch Camera
                </button>
            </div>

            {/* Camera Presets Menu */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
              <button onClick={() => setCameraAngle(-Math.PI / 2, 0.01)} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition">Top</button>
              <button onClick={() => setCameraAngle(-Math.PI / 2, Math.PI / 3)} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition">Front</button>
              <button onClick={() => setCameraAngle(Math.PI / 2, Math.PI / 3)} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition">Back</button>
              <button onClick={() => setCameraAngle(Math.PI, Math.PI / 3)} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition">Left</button>
              <button onClick={() => setCameraAngle(0, Math.PI / 3)} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition">Right</button>
              <div className="w-px bg-white/20 mx-1"></div>
              <button onClick={() => setCameraAngle(-Math.PI / 4, Math.PI / 3)} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition">Iso L</button>
              <button onClick={() => setCameraAngle(-3 * Math.PI / 4, Math.PI / 3)} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition">Iso R</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
