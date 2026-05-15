import { useEffect, useRef, useState } from 'react'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import * as GUI from '@babylonjs/gui';
import { calculateBlueprintMeasurements } from '../../lib/blueprintMath';
import { GridMaterial } from '@babylonjs/materials';

interface Preview3DProps {
  boothConfig: any;
  elements: any[];
  activeView?: 'perspective' | 'top' | 'north' | 'south' | 'east' | 'west' | string;
  onExportComplete?: (baseView: any) => void;
}

const PPM = 100;

export default function Preview3D({ boothConfig, elements, activeView = 'perspective', onExportComplete }: Preview3DProps) {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'flight'>('orbit');
  const [isCapturing, setIsCapturing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const shadowGeneratorRef = useRef<BABYLON.ShadowGenerator | null>(null);
  const guiRef = useRef<GUI.AdvancedDynamicTexture | null>(null);
  const measurementLinesRef = useRef<BABYLON.LinesMesh[]>([]);

  const meshRegistryRef = useRef<Map<string, BABYLON.AbstractMesh>>(new Map());
  const structureRegistryRef = useRef<BABYLON.AbstractMesh[]>([]);
  const modelCacheRef = useRef<Map<string, Promise<BABYLON.AssetContainer>>>(new Map());
  const textureCacheRef = useRef<Map<string, BABYLON.Texture>>(new Map());
  const wallDecorationRegistryRef = useRef<Map<string, BABYLON.AbstractMesh[]>>(new Map());
  const lastBoothDimRef = useRef({ w: 0, d: 0 });
  const prevElementsRef = useRef<any[]>([]);
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

    // 2.1 Technical Grid (Visible only in technical views)
    const grid = BABYLON.MeshBuilder.CreateGround("blueprintGrid", { width: boothConfig.width, height: boothConfig.depth }, scene);
    grid.position = new BABYLON.Vector3(centerX, 0.01, centerZ); // Slightly above floor
    const gridMat = new GridMaterial("gridMat", scene);
    gridMat.majorUnitFrequency = 5; // 1m major lines (since 1 unit = 1m)
    gridMat.minorUnitVisibility = 0.45;
    gridMat.gridRatio = 0.2; // 20cm minor lines
    gridMat.mainColor = new BABYLON.Color3(0, 0, 0);
    gridMat.lineColor = new BABYLON.Color3(0.2, 0.5, 1.0); // Blueprint blue
    gridMat.opacity = 0.8;
    gridMat.backFaceCulling = false;
    grid.material = gridMat;
    grid.isVisible = activeView !== 'perspective';
    structureRegistryRef.current.push(grid);

  }, [boothConfig, isSceneReady]);

  // 2.1 Camera View & Wall Masking Sync
  useEffect(() => {
    if (!isSceneReady || !sceneRef.current || !boothConfig) return;
    const scene = sceneRef.current;
    const blueprintCam = scene.getCameraByName("blueprintCam") as BABYLON.FreeCamera;
    const orbitCam = scene.getCameraByName("orbitCam") as BABYLON.ArcRotateCamera;
    
    if (!blueprintCam || !orbitCam) return;

    // --- BLUEPRINT VISUAL POLISH: DIM LIGHTS ---
    const baseView = activeView.replace('_download', '');
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

    // --- AUTOMATIC WALL HIDING FOR ELEVATIONS ---
    scene.meshes.forEach(m => {
      if (m.metadata && m.metadata.wallDir) {
        // If we are looking from North, hide the North wall so we can see the interior
        if (m.metadata.wallDir === baseView) {
          m.isVisible = false;
        } else {
          m.isVisible = true;
        }
      }
    });

    // Reset visibility of all outer walls and grid
    scene.meshes.forEach(m => {
      if (m.metadata?.isOuter) {
        m.isVisible = true;
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

      switch (activeView) {
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

      blueprintCam.position = camPos;
      blueprintCam.setTarget(targetPos);
      
      if (hiddenWall) {
        scene.meshes.forEach(m => {
          if (m.metadata?.isOuter && m.metadata?.wallDir === hiddenWall) {
            m.isVisible = false;
          }
        });
      }
    }
  }, [activeView, isSceneReady, boothConfig]);

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

    const baseView = activeView.replace('_download', '');
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
    const isTop = activeView === 'top';
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

  // 2.3 Handle Export/Download Trigger
  useEffect(() => {
    if (!isSceneReady || !activeView.endsWith('_download') || isCapturing) return;

    const capture = async () => {
      setIsCapturing(true);
      const baseView = activeView.replace('_download', '');
      
      // Wait for camera and elements to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      const scene = sceneRef.current;
      const engine = engineRef.current;
      if (!scene || !engine || !canvasRef.current) return;

      // Use Babylon's native screenshot tool which is much more reliable for 3D
      BABYLON.Tools.CreateScreenshot(engine, scene.activeCamera!, { precision: 2 }, (data) => {
        const link = document.createElement('a');
        link.download = `booth_${baseView}_blueprint.png`;
        link.href = data;
        link.click();
        
        setIsCapturing(false);
        onExportComplete?.(baseView);
      });
    };

    capture();
  }, [activeView, isSceneReady, isCapturing, onExportComplete]);

  // 3. Sync Elements
  useEffect(() => {
    if (!isSceneReady || !debouncedElements || !boothConfig) return;
    const elements = debouncedElements;

    // Fix 2: Dirty Flag for Assets
    const prevElements = prevElementsRef.current;
    let onlyAssetsMoved = false;
    if (prevElements.length === elements.length && prevElements.length > 0) {
      const nonAssetsPrev = prevElements.filter(e => e.type !== 'asset');
      const nonAssetsCurr = elements.filter(e => e.type !== 'asset');
      if (JSON.stringify(nonAssetsPrev) === JSON.stringify(nonAssetsCurr)) {
         onlyAssetsMoved = true;
      }
    }
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
    if (!onlyAssetsMoved) {
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
    } // Close if (!onlyAssetsMoved)
    // --- END SMART BUTT JOINT CALCULATION ---

    elements.forEach(el => {
      if (onlyAssetsMoved && el.type !== 'asset') return;
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
            c: cutouts.map((c: any) => ({ t: c.type, x: c.x + delta1, y: c.y, w: c.width, h: c.height }))
          });

          if (!mesh.metadata || mesh.metadata.geometryState !== geometryState) {
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
          const targetDim = Math.max(el.width, el.height) / PPM;
          const s = targetDim / mesh.metadata.nativeLength;
          let sY = s * (el.verticalScale || 1);
          if (el.specH && mesh.metadata.nativeHeight && mesh.metadata.nativeHeight > 0) {
            sY = el.specH / mesh.metadata.nativeHeight;
          }
          mesh.scaling = new BABYLON.Vector3(s, sY, s);
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
          const cutouts = (el.wallElements || []).filter((wel: any) => ['door', 'window'].includes(wel.type));
          const decorations = (el.wallElements || []).filter((wel: any) => !['door', 'window'].includes(wel.type));
          
          const geometryState = JSON.stringify({
            w: vW,
            t: el.thickness || 10,
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

            mesh = BABYLON.MeshBuilder.CreateBox(el.id, { width: wVal, height: h, depth: dVal }, scene);
            
            if (cutouts.length > 0) {
              let wallCSG = BABYLON.CSG.FromMesh(mesh);
              const trimColor = new BABYLON.Color3(0.2, 0.2, 0.2);
              const ft = 0.04;

              cutouts.forEach((wel: any, index: number) => {
                const cutW = wel.width / PPM, cutH = wel.height / PPM, cutD = dVal + 0.5;
                const localX = ((wel.x + delta1) / PPM) - (wVal / 2) + (cutW / 2);
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
                   leafMat.diffuseColor = new BABYLON.Color3(0.39, 0.26, 0.13); 
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

            decorations.forEach((wel: any) => {
              const cutW = wel.width / PPM, cutH = wel.height / PPM;
              const localX = ((wel.x + delta1) / PPM) - (wVal / 2) + (cutW / 2);
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
                currentTex.vScale = h / 2;
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
          const faceUV = new Array(6).fill(new BABYLON.Vector4(0, 0, 0, 0));
          faceUV[0] = new BABYLON.Vector4(0, 1, 1, 0);

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
            mat.metallic = 1.0; mat.roughness = 0.1;
          } else if (el.logoStyle === 'glowing') {
            mat.emissiveColor = baseColor; mat.emissiveIntensity = 2.0;
          } else if (el.logoStyle === 'glass') {
            mat.alpha = 0.5; mat.metallic = 0; mat.roughness = 0.1; mat.indexOfRefraction = 1.5; mat.transparencyMode = 2;
          }

          logoMesh.subMeshes = [];
          new BABYLON.SubMesh(0, 0, logoMesh.getTotalVertices(), 0, 6, logoMesh);
          new BABYLON.SubMesh(1, 0, logoMesh.getTotalVertices(), 6, 30, logoMesh);

          const multimat = new BABYLON.MultiMaterial(el.id + "_multimat", scene);
          const frontMat = new BABYLON.PBRMaterial(el.id + "_front", scene);
          frontMat.albedoColor = baseColor; frontMat.metallic = mat.metallic; frontMat.roughness = mat.roughness; frontMat.transparencyMode = 2;
          
          if (el.logoStyle === 'glowing') { frontMat.emissiveColor = baseColor; frontMat.emissiveIntensity = 2.0; }
          if (el.logoStyle === 'glass') { frontMat.alpha = 0.5; frontMat.indexOfRefraction = 1.5; }
          
          if (el.svgData) {
            const blob = new Blob([el.svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const tex = new BABYLON.Texture(url, scene);
            tex.hasAlpha = true;
            frontMat.albedoTexture = tex; frontMat.opacityTexture = tex;
            if (el.logoStyle === 'glowing') frontMat.emissiveTexture = tex;
            tex.onLoadObservable.addOnce(() => URL.revokeObjectURL(url));
          }

          const sideMat = new BABYLON.PBRMaterial(el.id + "_side", scene);
          sideMat.albedoColor = baseColor; sideMat.metallic = mat.metallic; sideMat.roughness = mat.roughness; sideMat.transparencyMode = 2;
          if (el.svgData) {
            const blob = new Blob([el.svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const tex = new BABYLON.Texture(url, scene);
            sideMat.opacityTexture = tex;
            tex.onLoadObservable.addOnce(() => URL.revokeObjectURL(url));
          }

          multimat.subMaterials.push(frontMat); multimat.subMaterials.push(sideMat);
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

          const instantiateAndSetup = (container: BABYLON.AssetContainer) => {
            if (!registry.has(el.id)) return;
            pivot.getChildMeshes().forEach(m => { if (m.name === "ph") m.dispose(); });
            const entries = container.instantiateModelsToScene();
            entries.rootNodes.forEach(node => {
              node.parent = pivot;
              node.getChildMeshes().forEach(m => {
                if (m.getTotalVertices() > 20) {
                  m.receiveShadows = true; shadowGenerator.addShadowCaster(m, true);
                }
              });
            });
            const root = entries.rootNodes[0];
            if (root) {
              root.computeWorldMatrix(true);
              const bbox = root.getHierarchyBoundingVectors(true);
              const sz = bbox.max.subtract(bbox.min);
              const longest = Math.max(sz.x, sz.z);
              if (longest > 0) {
                pivot.metadata = { nativeLength: longest, nativeHeight: sz.y };
                const s = (Math.max(el.width, el.height) / PPM) / longest;
                let sY = s * (el.verticalScale || 1);
                if (el.specH && sz.y > 0) {
                  sY = el.specH / sz.y;
                }
                pivot.scaling.set(s, sY, s);
                const center = bbox.min.add(sz.scale(0.5));
                const worldOffset = center.subtract(pivot.position);
                const invPivotMatrix = new BABYLON.Matrix();
                pivot.getWorldMatrix().invertToRef(invPivotMatrix);
                const localOffset = BABYLON.Vector3.TransformNormal(worldOffset, invPivotMatrix);
                const rootMesh = root as BABYLON.AbstractMesh;
                rootMesh.position.x -= localOffset.x; rootMesh.position.z -= localOffset.z;
              }
            }
          };

          const cache = modelCacheRef.current;
          if (cache.has(modelName)) {
            cache.get(modelName)!.then(container => instantiateAndSetup(container));
          } else {
            const ph = BABYLON.MeshBuilder.CreateBox("ph", { width: el.width/PPM, height: 0.8, depth: el.height/PPM }, scene);
            ph.parent = pivot; ph.position.y = 0.4;
            const phMat = new BABYLON.StandardMaterial("phMat", scene);
            phMat.wireframe = true; phMat.emissiveColor = new BABYLON.Color3(0, 0.8, 1); phMat.alpha = 0.5;
            ph.material = phMat;
            
            const basePath = el.categoryFolder ? `/models/${el.categoryFolder}/` : "/models/";
            const loadPromise = BABYLON.SceneLoader.LoadAssetContainerAsync(basePath, `${modelName}.glb`, scene);
            
            cache.set(modelName, loadPromise);
            loadPromise.then(container => instantiateAndSetup(container)).catch(e => console.error("Failed to load model", modelName, e));
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

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ backgroundColor: '#0d0d0f' }}>
      <canvas ref={canvasRef} className="w-full h-full block outline-none touch-none" />
      {activeView === 'perspective' && (
        <>
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.1)] text-[10px] font-bold text-white uppercase backdrop-blur-md">
              {cameraMode === 'orbit' ? 'Orbit Mode 🌐' : 'Flight Mode 🛸'}
            </div>
          </div>
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button 
              onClick={() => {
                const currentHQ = localStorage.getItem('hq_3d') === 'true';
                localStorage.setItem('hq_3d', currentHQ ? 'false' : 'true');
                window.location.reload();
              }} 
              className="px-4 py-2 bg-[rgba(0,0,0,0.6)] hover:bg-[var(--brand)] border border-[rgba(255,255,255,0.1)] text-xs font-bold text-white uppercase rounded-lg backdrop-blur-md transition-colors"
            >
              {localStorage.getItem('hq_3d') === 'true' ? "HQ: ON" : "HQ: OFF"}
            </button>
            <button onClick={() => setCameraMode(prev => prev === 'orbit' ? 'flight' : 'orbit')} className="px-4 py-2 bg-[rgba(0,0,0,0.6)] hover:bg-[var(--sea-ink)] border border-[rgba(255,255,255,0.1)] text-xs font-bold text-white uppercase rounded-lg backdrop-blur-md transition-colors">
              {cameraMode === 'orbit' ? "Flight Mode" : "Orbit Mode"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
