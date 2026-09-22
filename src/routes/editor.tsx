import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import Sidebar from '../components/editor/Sidebar'
import Canvas from '../components/editor/Canvas'
import WallCanvas from '../components/editor/WallCanvas'
import Properties from '../components/editor/Properties'
import Preview3D from '../components/editor/Preview3D'
import ColorPickerPanel from '../components/editor/ColorPickerPanel'
import RoofCanvas from '../components/editor/RoofCanvas'
import UserMenuDropdown from '../components/UserMenuDropdown'
import { PanelLeftClose, PanelRightClose, Check, RotateCcw, RotateCw, Trash2, Box, ArrowRight, Settings, LogIn, X, Lock, AlertCircle, CheckCircle, AlertTriangle, Info, Pencil, LayoutGrid, Sliders, Monitor, Folder, CloudCheck, Loader2, Copy } from 'lucide-react'
import { ASSET_DIMENSIONS, ASSET_REGISTRY } from '../lib/assetRegistry'
import { getWallMaterialProps } from '../lib/materials'
import { generateReport } from '../lib/reportGenerator'
import { getCurrentUser, saveDesign, updateDesign, listProjects, listDesigns } from '../lib/authClient'
import { AuthModal } from '../components/editor/AuthModal'
import { CloudProjectsDrawer } from '../components/editor/CloudProjectsDrawer'
import { saveAssetBlob, getAssetBlob, deleteAssetBlob } from '../lib/customAssetDB'
import { ConfirmModal } from '../components/editor/ConfirmModal'
import { ReportModal } from '../components/editor/ReportModal'

const DEFAULT_ASSET_SIZE_PX = 100

export const Route = createFileRoute('/editor')({
  component: EditorPage,
})

interface BoothConfig {
  width: number;
  depth: number;
  wallThickness: number;
  walls: { north: boolean; south: boolean; east: boolean; west: boolean };
  floorType?: string;
  floorColor?: string;
}

function getInitialData() {
  if (typeof window === 'undefined') return { config: null, elements: null, id: null, name: null };
  const savedStall = window.localStorage.getItem('stall-config');
  const savedElements = window.localStorage.getItem('stall-elements');
  const savedId = window.localStorage.getItem('current-design-id');
  const savedName = window.localStorage.getItem('current-design-name');
  if (!savedStall) return { config: null, elements: null, id: savedId, name: savedName };

  let config: any = savedStall;
  while (typeof config === 'string') {
    try { config = JSON.parse(config); } catch { break; }
  }

  let parsedElements: any = savedElements ? savedElements : [];
  while (typeof parsedElements === 'string') {
    try { parsedElements = JSON.parse(parsedElements); } catch { break; }
  }
  if (!Array.isArray(parsedElements)) parsedElements = [];

  // MIGRATION: Only convert old structural walls in config if savedElements was never created (initial load of an old save format)
  if (savedElements === null && config && typeof config === 'object' && config.width && config.depth) {
    if (config.walls) {
      const PPM = 100;
      const W = config.width * PPM;
      const D = config.depth * PPM;
      const T = (config.wallThickness || 0.1) * 100;

      const migrationWalls: any[] = [];
      if (config.walls.north) migrationWalls.push({ id: 'outer-north', type: 'wall', isOuter: true, x: W / 2, y: 0, width: W, thickness: T, rotation: 0, fill: '#333333', opacity: 1, wallElements: [] });
      if (config.walls.south) migrationWalls.push({ id: 'outer-south', type: 'wall', isOuter: true, x: W / 2, y: D, width: W, thickness: T, rotation: 180, fill: '#333333', opacity: 1, wallElements: [] });
      if (config.walls.west) migrationWalls.push({ id: 'outer-west', type: 'wall', isOuter: true, x: 0, y: D / 2, width: D, thickness: T, rotation: 90, fill: '#333333', opacity: 1, wallElements: [] });
      if (config.walls.east) migrationWalls.push({ id: 'outer-east', type: 'wall', isOuter: true, x: W, y: D / 2, width: D, thickness: T, rotation: -90, fill: '#333333', opacity: 1, wallElements: [] });

      parsedElements = [...migrationWalls, ...parsedElements];
    }
  }

  return { config, elements: parsedElements, id: savedId, name: savedName };
}



function EditorPage() {
  const [initialData] = useState(getInitialData)
  const [boothConfig, setBoothConfig] = useState<BoothConfig | null>(initialData.config)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    document.title = '3D Editor | krafc'
  }, [])

  // Supabase Auth and Cloud states
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [cloudDrawerOpen, setCloudDrawerOpen] = useState(false)
  const [showSavePrompt, setShowSavePrompt] = useState(false)
  const [pendingSaveTrigger, setPendingSaveTrigger] = useState<boolean>(false)
  const [userProjects, setUserProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('current-project-id') || ''
    }
    return ''
  })
  const [projectName, setProjectName] = useState(initialData.name || 'Untitled Design')
  const [isCloudSaving, setIsCloudSaving] = useState(false)
  const [toastModal, setToastModal] = useState<{ title?: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' } | null>(null)
  const [confirmModalState, setConfirmModalState] = useState<{ isOpen: boolean; title?: string; message: string; confirmText?: string; onConfirm: () => void } | null>(null)

  const showAlert = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', title?: string) => {
    setToastModal({ message, type, title })
  }

  const activeProjectObj = selectedProjectId ? userProjects.find(p => p.id === selectedProjectId) : null

  // Custom 3D Assets state (limit 5 per user)
  const [customAssets, setCustomAssets] = useState<any[]>([]);


  const [elements, setElements] = useState<any[]>(initialData.elements || [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [gridVisible, setGridVisible] = useState(true)
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(initialData.id || null)
  const [cloudIdValidated, setCloudIdValidated] = useState(false)

  // Refs to access latest editor state inside syncCurrentDesignToProfile without recreating it
  const boothConfigRef = useRef(boothConfig)
  boothConfigRef.current = boothConfig
  const elementsRef = useRef(elements)
  elementsRef.current = elements
  const currentDesignIdRef = useRef(currentDesignId)
  currentDesignIdRef.current = currentDesignId
  const projectNameRef = useRef(projectName)
  projectNameRef.current = projectName

  // Clean elements to keep cloud design payloads compact
  const sanitizeDesignElements = (els: any[]) => {
    if (!Array.isArray(els)) return [];
    return els.map(el => {
      if (!el) return el;
      let cleaned = { ...el };
      // Strip top-level data: URLs
      if (typeof cleaned.customTexture === 'string' && cleaned.customTexture.startsWith('data:')) {
        delete cleaned.customTexture;
      }
      if (typeof cleaned.assetUrl === 'string' && cleaned.assetUrl.startsWith('data:')) {
        delete cleaned.assetUrl;
      }
      if (typeof cleaned.url === 'string' && cleaned.url.startsWith('data:')) {
        delete cleaned.url;
      }
      if (typeof cleaned.svgData === 'string' && cleaned.svgData.length > 500000) {
        // truncate oversized uncompressed image data URLs attached to 3D logos
        delete cleaned.svgData;
      }
      // Strip data: URLs nested inside wallElements (banners, frames, etc.)
      // These can be multi-MB base64 strings that blow the D1 payload limit
      if (Array.isArray(cleaned.wallElements)) {
        cleaned.wallElements = cleaned.wallElements.map((wel: any) => {
          if (!wel) return wel;
          const cleanedWel = { ...wel };
          if (typeof cleanedWel.url === 'string' && cleanedWel.url.startsWith('data:')) {
            delete cleanedWel.url;
          }
          if (typeof cleanedWel.customTexture === 'string' && cleanedWel.customTexture.startsWith('data:')) {
            delete cleanedWel.customTexture;
          }
          return cleanedWel;
        });
      }
      return cleaned;
    });
  };

  // Helper to sync or resume current editor design into user's account
  const syncCurrentDesignToProfile = useCallback(async (user: any, reason: 'login' | 'space_cleared' = 'login', existingDesigns?: any[]) => {
    const activeConfig = boothConfigRef.current
    const activeElements = sanitizeDesignElements(elementsRef.current)
    const activeDesignId = currentDesignIdRef.current
    const activeProjectName = projectNameRef.current

    if (!user || (!activeConfig && activeElements.length === 0)) return
    try {
      const userDesigns = existingDesigns || (await listDesigns())
      const storedId = localStorage.getItem('current-design-id')
      const targetId = activeDesignId || storedId

      // 1. Check if user already owns this design ID
      const matchingDesignById = targetId ? userDesigns.find(d => d.id === targetId) : null
      if (matchingDesignById) {
        // Design already belongs to this user. Resume it and save any offline/logged-out changes (including any offline rename).
        const resolvedName = (activeProjectName && activeProjectName.trim()) || matchingDesignById.name || 'Untitled Design'
        setCurrentDesignId(matchingDesignById.id)
        setProjectName(resolvedName)
        localStorage.setItem('current-design-id', matchingDesignById.id)
        localStorage.setItem('current-design-name', resolvedName)
        setSyncStatus('saving')
        await updateDesign(matchingDesignById.id, {
          name: resolvedName,
          config: activeConfig,
          elements: activeElements
        })
        setSyncStatus('saved')
        return
      }

      // 2. If no design ID, but user has existing cloud designs and canvas wasn't explicitly started as a brand-new design
      const isFreshGuestDesign = localStorage.getItem('is-fresh-guest-design') === 'true'
      if (!isFreshGuestDesign && userDesigns.length > 0) {
        // Automatically attach to their most recently updated design or match
        const mostRecent = userDesigns[0]
        const resolvedName = (activeProjectName && activeProjectName.trim()) || mostRecent.name || 'Untitled Design'
        setCurrentDesignId(mostRecent.id)
        setProjectName(resolvedName)
        localStorage.setItem('current-design-id', mostRecent.id)
        localStorage.setItem('current-design-name', resolvedName)
        setSyncStatus('saving')
        await updateDesign(mostRecent.id, {
          name: resolvedName,
          config: activeConfig,
          elements: activeElements
        })
        setSyncStatus('saved')
        return
      }

      // 3. User genuinely created a fresh guest design from scratch:
      if (userDesigns.length >= 6) {
        showAlert('Account design limit reached (6 maximum). Choose an existing design from "Cloud Projects" to overwrite, or delete old designs.', 'warning', 'Limit Reached')
        return
      }

      // Save as a brand new design
      const designNameToSave = activeProjectName?.trim() || 'Untitled Design'
      const newDesign = await saveDesign(null, designNameToSave, activeConfig, activeElements)
      setCurrentDesignId(newDesign.id)
      setProjectName(newDesign.name)
      localStorage.setItem('current-design-id', newDesign.id)
      localStorage.setItem('current-design-name', newDesign.name)
      localStorage.removeItem('is-fresh-guest-design')
      localStorage.removeItem('current-project-id')
      setSelectedProjectId('')
      setSyncStatus('saved')
      const successMessage = reason === 'space_cleared'
        ? 'Space cleared! Your current design has now been saved to your account.'
        : 'Your design has been saved to your account and auto-sync is active.'
      showAlert(successMessage, 'success', 'Design Saved')
    } catch (err: any) {
      console.error('Failed to save current design to profile:', err)
    }
  }, [])

  // Track the last synced user ID to avoid re-running login sync on every render
  const lastSyncedUserIdRef = useRef<string | null>(null)

  // Fetch projects and sync active design whenever user logs in
  useEffect(() => {
    if (sessionUser) {
      if (lastSyncedUserIdRef.current === sessionUser.id) return
      lastSyncedUserIdRef.current = sessionUser.id

      Promise.all([listProjects(), listDesigns()])
        .then(([res, allDesigns]) => {
          setUserProjects(res || [])
          const current = localStorage.getItem('current-project-id')
          if (current && res?.some(p => p.id === current)) {
            setSelectedProjectId(current)
          }

          setCloudIdValidated(true)
          syncCurrentDesignToProfile(sessionUser, 'login', allDesigns)
        })
        .catch(err => {
          console.error(err)
          setCloudIdValidated(true)
        })
    } else {
      lastSyncedUserIdRef.current = null
      setUserProjects([])
      setSelectedProjectId('')
      setSyncStatus('idle')
      setCloudIdValidated(false)
    }
  }, [sessionUser, syncCurrentDesignToProfile])

  // Hydrate custom assets from IndexedDB on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('user-custom-assets');
      if (!saved) return;
      const metaList: any[] = JSON.parse(saved);
      
      Promise.all(
        metaList.map(async (meta) => {
          const blob = await getAssetBlob(meta.id);
          if (blob) {
            const assetUrl = URL.createObjectURL(blob);
            return { ...meta, assetUrl };
          }
          return meta;
        })
      ).then((loaded) => {
        setCustomAssets(loaded.filter(a => a.assetUrl));
      });
    } catch (err) {
      console.warn('Failed to load custom assets metadata', err);
    }
  }, []);

  const handleUploadCustomAsset = async (file: File) => {
    // Enforce 15MB file size limit on 3D asset uploads (KK 07)
    const MAX_ASSET_BYTES = 15 * 1024 * 1024;
    if (file.size > MAX_ASSET_BYTES) {
      showAlert('Custom 3D model exceeds the 15MB size limit.', 'error', 'File Too Large');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.glb')) {
      showAlert('Only .glb files are supported for custom 3D models.', 'error', 'Invalid File Type');
      return;
    }

    if (customAssets.length >= 5) {
      showAlert('You have reached the maximum limit of 5 custom 3D assets. Please delete an asset from "My Custom Uploads" to upload a new one.', 'warning', 'Upload Limit Reached');
      return;
    }

    const assetId = 'custom_' + Date.now().toString(36);
    const objectUrl = URL.createObjectURL(file);

    // Save binary file into IndexedDB
    await saveAssetBlob(assetId, file);

    const newAsset = {
      id: assetId,
      label: file.name.replace(/\.[^/.]+$/, ""),
      assetUrl: objectUrl,
      fileName: file.name,
      w: 1, h: 1,
      specW: 1.0, specD: 1.0, specH: 1.0
    };

    const updated = [...customAssets, newAsset];
    setCustomAssets(updated);

    // Save lightweight metadata only to localStorage
    const metaList = updated.map(a => ({ id: a.id, label: a.label, fileName: a.fileName }));
    try {
      localStorage.setItem('user-custom-assets', JSON.stringify(metaList));
    } catch (err) {
      console.warn('Skipping user-custom-assets localStorage write due to quota:', err);
    }
    showAlert(`"${newAsset.label}" uploaded successfully!`, 'success', '3D Asset Uploaded');
  };

  const handleDeleteCustomAsset = async (assetId: string) => {
    await deleteAssetBlob(assetId);
    const updated = customAssets.filter(a => a.id !== assetId);
    setCustomAssets(updated);
    
    const metaList = updated.map(a => ({ id: a.id, label: a.label, fileName: a.fileName }));
    try {
      localStorage.setItem('user-custom-assets', JSON.stringify(metaList));
    } catch (err) {
      console.warn('Failed to update custom assets in storage', err);
    }
    showAlert('Custom asset removed.', 'info', 'Asset Deleted');
  };

  // Setup Wizard State
  const [wizardStep, setWizardStep] = useState(1)
  const [setupWidth, setSetupWidth] = useState<number>(3)
  const [setupDepth, setSetupDepth] = useState<number>(3)
  const [setupWallThickness, setSetupWallThickness] = useState<number>(0.1)
  const [setupWalls, setSetupWalls] = useState({ north: true, south: false, east: true, west: true })

  // New Wizard States
  const [setupFloorType, setSetupFloorType] = useState('hardwood')
  const [setupFloorColor, setSetupFloorColor] = useState('#ffffff')
  const [setupWallMaterial, setSetupWallMaterial] = useState('White Paint')
  const [setupWallColor, setSetupWallColor] = useState('#f0f0f0')
  const [setupAssets, setSetupAssets] = useState<Record<string, number>>({
    'petilia': 1,
    'catifa_bar': 1,
    'catifa': 1,
    'neos_s': 1,
    'medola_conference': 0,
    'brio_70': 0,
  })


  // Sync id and name to localStorage
  useEffect(() => {
    if (currentDesignId) {
      localStorage.setItem('current-design-id', currentDesignId)
      localStorage.setItem('current-design-name', projectName)
    } else {
      localStorage.removeItem('current-design-id')
      localStorage.removeItem('current-design-name')
    }
  }, [currentDesignId, projectName])

  // Layout States
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth >= 768
    return true
  })
  const [previewerOpen, setPreviewerOpen] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth >= 768
    return true
  })
  const [propertiesOpen, setPropertiesOpen] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth >= 768
    return true
  })
  const [mobileTab, setMobileTab] = useState<'canvas' | 'assets' | 'properties' | '3d'>('canvas')
  const [mobileScreenBannerDismissed, setMobileScreenBannerDismissed] = useState(false)
  const [splitWidth, setSplitWidth] = useState(60)
  const splitContainerRef = useRef<HTMLDivElement>(null)
  const [is3DGenerated, setIs3DGenerated] = useState(true)
  const [editingWallId, setEditingWallId] = useState<string | null>(null)
  const [editingRoof, setEditingRoof] = useState(false)
  const [blueprintView, setBlueprintView] = useState<'perspective' | 'top' | 'north' | 'south' | 'east' | 'west'>('perspective')

  // Report Generation State
  const [isCapturingReport, setIsCapturingReport] = useState(false)
  const [captureQueue, setCaptureQueue] = useState<string[]>([])
  const [backgroundColor, setBackgroundColor] = useState('#1d1f21')
  const [reportModalData, setReportModalData] = useState<{
    isOpen: boolean;
    html: string;
    projectName: string;
    docId: string;
  }>({
    isOpen: false,
    html: '',
    projectName: '',
    docId: '',
  })


  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  // Auth state listener
  const checkAuth = async () => {
    const user = await getCurrentUser()
    setSessionUser(user)
  }

  useEffect(() => {
    checkAuth()

    // Check if redirecting back from Google auth
    if ((window as any).isAuthRedirect) {
      setTimeout(checkAuth, 1000)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // When transitioning to desktop screen, ensure sidebars and previewer are open
        setSidebarOpen(true)
        setPropertiesOpen(true)
        setPreviewerOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCloudSaveAs = async () => {
    if (!sessionUser) {
      setAuthModalOpen(true)
      return
    }

    const projectId = selectedProjectId ? selectedProjectId : null

    setIsCloudSaving(true)
    try {
      const newDesign = await saveDesign(projectId, projectName || 'Untitled Design', boothConfig, elements)
      setCurrentDesignId(newDesign.id)
      if (projectId) {
        localStorage.setItem('current-project-id', projectId)
      } else {
        localStorage.removeItem('current-project-id')
      }
      showAlert(`Created copy "${newDesign.name}" with auto-sync active`, 'success', 'Design Copied')
      setShowSavePrompt(false)
    } catch (err: any) {
      console.error('Cloud save failed:', err)
      showAlert(err.message || 'Failed to create copy.', 'error', 'Copy Failed')
    } finally {
      setIsCloudSaving(false)
    }
  };

  const loadCloudDesign = (loadedConfig: any, loadedElements: any[], designId?: string, designName?: string) => {
    let cleanConfig = loadedConfig;
    while (typeof cleanConfig === 'string') {
      try { cleanConfig = JSON.parse(cleanConfig); } catch { break; }
    }
    let cleanElements = loadedElements;
    while (typeof cleanElements === 'string') {
      try { cleanElements = JSON.parse(cleanElements); } catch { break; }
    }
    if (!Array.isArray(cleanElements)) cleanElements = [];

    setBoothConfig(cleanConfig)
    if (!cleanConfig) {
      setWizardStep(1)
      localStorage.removeItem('stall-config')
    }
    setElements(cleanElements)
    setHistory([{
      boothConfig: cleanConfig ? JSON.parse(JSON.stringify(cleanConfig)) : null,
      elements: JSON.parse(JSON.stringify(cleanElements)),
    }])
    setHistoryStep(0)
    if (designId) {
      setCurrentDesignId(designId)
      localStorage.setItem('current-design-id', designId)
    }
    if (designName) {
      setProjectName(designName)
      localStorage.setItem('current-design-name', designName)
    }
    const currentProj = localStorage.getItem('current-project-id') || ''
    setSelectedProjectId(currentProj)

    // Force canvas refresh
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
  };

  // Auto-save to local storage (safely stripped of data URLs)
  useEffect(() => {
    if (boothConfig && Array.isArray(elements)) {
      try {
        localStorage.setItem('stall-config', JSON.stringify(boothConfig));
        const cleanElements = elements.map(el => {
          if (!el) return el;
          let cleaned = { ...el };
          if (cleaned.customTexture?.startsWith('data:image/')) {
            delete cleaned.customTexture;
          }
          if (cleaned.assetUrl?.startsWith('data:')) {
            delete cleaned.assetUrl;
          }
          if (cleaned.url?.startsWith('data:')) {
            delete cleaned.url;
          }
          if (Array.isArray(cleaned.wallElements)) {
            cleaned.wallElements = cleaned.wallElements.map((wel: any) => {
              if (wel?.url && typeof wel.url === 'string' && wel.url.startsWith('data:image/')) {
                // If data url is too large for local storage, don't let it blow the 5MB quota
                if (wel.url.length > 100000) {
                  return { ...wel, url: null };
                }
              }
              return wel;
            });
          }
          return cleaned;
        });
        localStorage.setItem('stall-elements', JSON.stringify(cleanElements));
      } catch (e) {
        console.warn('Local storage save failed:', e);
      }
    }
  }, [boothConfig, elements])

  // Auto-save to cloud (automatically syncs for all existing designs)
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'idle'>('idle')

  useEffect(() => {
    if (!currentDesignId || !sessionUser || !cloudIdValidated) {
      setSyncStatus('idle')
      return;
    }
    
    setSyncStatus('saving')
    const handler = setTimeout(async () => {
      try {
        await updateDesign(currentDesignId, {
          name: projectName || 'Untitled Design',
          config: boothConfig,
          elements: sanitizeDesignElements(elements || [])
        });
        setSyncStatus('saved')
      } catch (err: any) {
        console.error('Auto-save to cloud failed:', err);
        setSyncStatus('idle')
        if (err.message === 'Design not found' || err.message.includes('404')) {
          setCurrentDesignId(null)
          localStorage.removeItem('current-design-id')
          showAlert('This design was deleted or no longer exists. Auto-save disabled. Please create a new copy.', 'error', 'Design Missing')
        }
      }
    }, 2000);

    return () => clearTimeout(handler);
  }, [boothConfig, elements, projectName, currentDesignId, sessionUser, cloudIdValidated]);

  interface HistorySnapshot {
    boothConfig: any;
    elements: any[];
  }

  const [history, setHistory] = useState<HistorySnapshot[]>(() => {
    if (initialData.config || initialData.elements) {
      return [{
        boothConfig: JSON.parse(JSON.stringify(initialData.config || null)),
        elements: JSON.parse(JSON.stringify(initialData.elements || [])),
      }];
    }
    return [];
  });
  const [historyStep, setHistoryStep] = useState(initialData.config || initialData.elements ? 0 : -1);
  const isUndoingRef = useRef(false);

  // Push state snapshot to history
  const saveToHistory = useCallback((newConfig: any, newElements: any[]) => {
    if (isUndoingRef.current) return;
    try {
      const snap: HistorySnapshot = {
        boothConfig: newConfig ? JSON.parse(JSON.stringify(newConfig)) : null,
        elements: Array.isArray(newElements) ? JSON.parse(JSON.stringify(newElements)) : [],
      };

      setHistory(prev => {
        const next = prev.slice(0, historyStep + 1);
        // Avoid duplicate identical snapshots
        if (next.length > 0) {
          const last = next[next.length - 1];
          if (
            JSON.stringify(last.boothConfig) === JSON.stringify(snap.boothConfig) &&
            JSON.stringify(last.elements) === JSON.stringify(snap.elements)
          ) {
            return prev;
          }
        }
        return [...next, snap];
      });
      setHistoryStep(prev => prev + 1);
    } catch (e) {
      console.warn('Failed to snapshot history:', e);
    }
  }, [historyStep]);

  const undo = () => {
    if (historyStep > 0) {
      const targetStep = historyStep - 1;
      const targetSnap = history[targetStep];
      if (targetSnap) {
        isUndoingRef.current = true;
        if (targetSnap.boothConfig) setBoothConfig(JSON.parse(JSON.stringify(targetSnap.boothConfig)));
        setElements(JSON.parse(JSON.stringify(targetSnap.elements || [])));
        setHistoryStep(targetStep);
        setSelectedId(null);
        setTimeout(() => {
          isUndoingRef.current = false;
        }, 50);
      }
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const targetStep = historyStep + 1;
      const targetSnap = history[targetStep];
      if (targetSnap) {
        isUndoingRef.current = true;
        if (targetSnap.boothConfig) setBoothConfig(JSON.parse(JSON.stringify(targetSnap.boothConfig)));
        setElements(JSON.parse(JSON.stringify(targetSnap.elements || [])));
        setHistoryStep(targetStep);
        setSelectedId(null);
        setTimeout(() => {
          isUndoingRef.current = false;
        }, 50);
      }
    }
  };

  const handleUpdateElement = useCallback((id: string, newProps: any) => {
    setElements(prev => {
      const updated = prev.map((el) => (el.id === id ? { ...el, ...newProps } : el));
      saveToHistory(boothConfigRef.current, updated);
      return updated;
    });
  }, [saveToHistory]);

  const handleDeleteElement = useCallback((id: string) => {
    setElements(prev => {
      const filtered = prev.filter((el) => el.id !== id);
      const deletedEl = prev.find(el => el.id === id);
      if (deletedEl?.isOuter && boothConfigRef.current?.walls) {
        const wallKey = id === 'outer-north' ? 'north' : id === 'outer-south' ? 'south' : id === 'outer-west' ? 'west' : id === 'outer-east' ? 'east' : null;
        if (wallKey) {
          const updatedConfig = {
            ...boothConfigRef.current,
            walls: {
              ...boothConfigRef.current.walls,
              [wallKey]: false
            }
          };
          setBoothConfig(updatedConfig);
          saveToHistory(updatedConfig, filtered);
          return filtered;
        }
      }
      saveToHistory(boothConfigRef.current, filtered);
      return filtered;
    });
    if (selectedId === id) setSelectedId(null);
  }, [selectedId, saveToHistory]);

  const addElement = useCallback((newEl: any) => {
    setElements(prev => {
      const updated = [...prev, newEl];
      saveToHistory(boothConfigRef.current, updated);
      return updated;
    });
  }, [saveToHistory]);

  // Wrapper for canvas setElements so drag & transform are recorded in history
  const handleCanvasSetElements = useCallback((newElements: any[]) => {
    setElements(newElements);
    saveToHistory(boothConfigRef.current, newElements);
  }, [saveToHistory]);

  // Handle Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo / Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) redo();
        else undo();
      }

      // Deletion
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedId && !editingWallId) {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
        handleDeleteElement(selectedId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, historyStep, history, editingWallId]);

  const reportScreenshotsRef = useRef<Record<string, string>>({})

  const submitExport = () => {
    if (!is3DGenerated) {
      setIs3DGenerated(true)
    }

    setIsCapturingReport(true)
    reportScreenshotsRef.current = {}
    
    // Capture high-res 2D Floor Plan directly from 2D Stage
    let floorplan2D: string | null = null
    if (typeof window !== 'undefined' && typeof (window as any).export2DCanvasDataURL === 'function') {
      try {
        floorplan2D = (window as any).export2DCanvasDataURL()
      } catch (err) {
        console.warn('Failed to capture 2D floor plan snapshot:', err)
      }
    }

    if (floorplan2D) {
      reportScreenshotsRef.current['floorplan_2d'] = floorplan2D
    }

    // Queue: 1m metric grid top view + standard top view + standard directional elevations + specific wall elevations
    const queue = ['grid_top', 'top', 'north', 'south', 'east', 'west'];

    // Find walls with customizations and append their specific elevations
    const customWalls = elements.filter(el => el.type === 'wall' && el.wallElements && el.wallElements.length > 0);
    customWalls.forEach(w => queue.push(`elevation_${w.id}`));

    setCaptureQueue(queue)
  }

  useEffect(() => {
    if (!isCapturingReport) return;

    if (captureQueue.length > 0) {
      const nextView = captureQueue[0];
      console.log(`[Report] Switching to view: ${nextView}`);
      setBlueprintView(nextView + '_capture' as any);

      // Watchdog timeout to prevent queue stalling if screenshot hangs
      const watchdog = setTimeout(() => {
        console.warn(`[Report] Capture watchdog timeout for ${nextView}, advancing queue...`);
        setCaptureQueue(prev => prev.slice(1));
      }, 4500);

      return () => clearTimeout(watchdog);
    } else {
      console.log('[Report] All captures complete. Generating document...');
      setIsCapturingReport(false);
      setBlueprintView('perspective');

      // Allow final states to settle before rendering PDF
      setTimeout(() => {
        const finalScreenshots = { ...reportScreenshotsRef.current };

        generateReport(boothConfig, elements, finalScreenshots).then((res) => {
          console.log('[Report] Document generated.');
          setReportModalData({
            isOpen: true,
            html: res.html,
            projectName: res.projectName,
            docId: res.docId,
          });
        }).catch((err) => {
          console.error('[Report] Generation failed:', err);
          showAlert('Failed to compile engineering report. Please try again.', 'error', 'Report Error');
        });
      }, 300);
    }
  }, [captureQueue, isCapturingReport, boothConfig, elements]);

  const handleExportComplete = useCallback((baseView: any, base64Data?: string) => {
    if (isCapturingReport && base64Data) {
      reportScreenshotsRef.current[baseView] = base64Data
      console.log(`[Report] Successfully captured: ${baseView}`)
      setCaptureQueue(prev => prev.slice(1))
    } else if (!isCapturingReport) {
      setBlueprintView(baseView as any)
    }
  }, [isCapturingReport])

  const handleNewProject = () => {
    setConfirmModalState({
      isOpen: true,
      title: 'Create New Design',
      message: 'Create a new design? Any unsaved changes in this session will be cleared.',
      confirmText: 'New Design',
      onConfirm: () => {
        setBoothConfig(null)
        setWizardStep(1)
        setElements([])
        saveToHistory(null, [])
        setCurrentDesignId(null)
        setProjectName('Untitled Design')
        localStorage.setItem('is-fresh-guest-design', 'true')
        localStorage.removeItem('stall-config')
        localStorage.removeItem('stall-elements')
        localStorage.removeItem('current-design-id')
        localStorage.removeItem('current-design-name')
        localStorage.removeItem('current-project-id')
        setSelectedProjectId('')
        setConfirmModalState(null)
      }
    })
  }

  const clearAll = () => {
    setConfirmModalState({
      isOpen: true,
      title: 'Clear Workspace',
      message: 'Are you sure you want to clear the workspace? This cannot be undone.',
      confirmText: 'Clear',
      onConfirm: () => {
        setElements([])
        saveToHistory(boothConfigRef.current, [])
        setCurrentDesignId(null)
        setProjectName('Untitled Design')
        localStorage.removeItem('stall-elements')
        localStorage.removeItem('current-design-id')
        localStorage.removeItem('current-design-name')
        setConfirmModalState(null)
      }
    })
  }

  const selectedElement = (elements || []).find((el) => el.id === selectedId)
  const editingWall = editingWallId ? (elements || []).find((el) => el.id === editingWallId) : null

  if (!isMounted) {
    return <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">Loading editor...</div>
  }

  if (!boothConfig) {
    return (
      <div key="setup-screen" suppressHydrationWarning className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-base)] p-4">
        <div className="island-shell p-8 rounded-2xl w-full max-w-[500px] flex flex-col gap-6 text-center rise-in">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-[var(--sea-ink)] display-title">Space Setup Wizard</h2>
            <button
              onClick={() => {
                const PPM = 100
                const W = 6 * PPM
                const D = 5 * PPM
                const T = 0.1 * 100
                const wallProps = { material: 'White Paint' }
                
                const newConfig = { width: 6, depth: 5, wallThickness: 0.1, walls: { north: true, south: true, east: true, west: true }, floorType: 'hardwood', floorColor: '#eee' }
                const initialWalls = [
                  { id: 'outer-north', type: 'wall', isOuter: true, x: W / 2, y: 0, width: W, thickness: T, rotation: 0, wallElements: [], ...wallProps },
                  { id: 'outer-south', type: 'wall', isOuter: true, x: W / 2, y: D, width: W, thickness: T, rotation: 0, wallElements: [], ...wallProps },
                  { id: 'outer-west', type: 'wall', isOuter: true, x: 0, y: D / 2, width: D, thickness: T, rotation: 90, wallElements: [], ...wallProps },
                  { id: 'outer-east', type: 'wall', isOuter: true, x: W, y: D / 2, width: D, thickness: T, rotation: 90, wallElements: [], ...wallProps }
                ]
                setBoothConfig(newConfig)
                setElements(initialWalls)
                saveToHistory(newConfig, initialWalls)

                if (sessionUser) {
                  if (currentDesignId) {
                    updateDesign(currentDesignId, { config: newConfig, elements: initialWalls }).catch(console.error)
                  } else {
                    // Automatically create as standalone design so auto-saving is instantly active
                    listDesigns().then(async (userDesigns) => {
                      if (userDesigns.length >= 6) {
                        showAlert('Account design limit reached (6 maximum). New design will not be auto-saved to cloud.', 'warning', 'Limit Reached')
                      } else {
                        try {
                          const newDesign = await saveDesign(null, projectName || 'Untitled Design', newConfig, initialWalls)
                          setCurrentDesignId(newDesign.id)
                          setProjectName(newDesign.name)
                          localStorage.setItem('current-design-id', newDesign.id)
                          localStorage.setItem('current-design-name', newDesign.name)
                          localStorage.removeItem('current-project-id')
                          setSelectedProjectId('')
                          setSyncStatus('saved')
                        } catch (err: any) {
                          console.error('Auto-create standalone design failed:', err)
                        }
                      }
                    }).catch(console.error)
                  }
                }
              }}
              className="text-xs font-bold text-[var(--sea-ink-soft)] hover:text-[var(--brand)] transition px-3 py-1.5 rounded-full bg-[var(--sand)] hover:bg-gray-200"
            >
              Skip Setup
            </button>
          </div>

          <div className="flex gap-2 mb-2">
            <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 1 ? 'bg-[var(--lagoon)]' : 'bg-[var(--line)]'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 2 ? 'bg-[var(--lagoon)]' : 'bg-[var(--line)]'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 3 ? 'bg-[var(--lagoon)]' : 'bg-[var(--line)]'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${wizardStep >= 4 ? 'bg-[var(--lagoon)]' : 'bg-[var(--line)]'}`} />
          </div>

          {wizardStep === 1 && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
              <p className="text-sm text-[var(--sea-ink-soft)] font-semibold">Step 1: Determine real-world footprint</p>

              <div className="space-y-4">
                <div className="text-left bg-[var(--sand)] p-4 rounded-xl border border-[var(--line)]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-[var(--sea-ink)]">Width (meters)</label>
                    <span className="text-[var(--lagoon-deep)] font-mono font-bold">{setupWidth.toFixed(1)}m</span>
                  </div>
                  <input type="range" min="2" max="20" step="0.1" value={setupWidth} onChange={(e) => setSetupWidth(parseFloat(e.target.value))} className="w-full accent-[var(--lagoon-deep)]" />
                </div>

                <div className="text-left bg-[var(--sand)] p-4 rounded-xl border border-[var(--line)]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-[var(--sea-ink)]">Depth (meters)</label>
                    <span className="text-[var(--lagoon-deep)] font-mono font-bold">{setupDepth.toFixed(1)}m</span>
                  </div>
                  <input type="range" min="2" max="20" step="0.1" value={setupDepth} onChange={(e) => setSetupDepth(parseFloat(e.target.value))} className="w-full accent-[var(--lagoon-deep)]" />
                </div>
              </div>

              <button
                onClick={() => setWizardStep(2)}
                className="rounded-full bg-[var(--brand)] text-white font-bold py-3 hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2 mt-2 shadow-lg"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
              <p className="text-sm text-[var(--sea-ink-soft)] font-semibold">Step 2: Configure structural walls</p>

              <div className="grid grid-cols-2 gap-4 text-left">
                {['north', 'south', 'east', 'west'].map((wallDir) => {
                  const isClosed = (setupWalls as any)[wallDir]
                  return (
                    <button
                      key={wallDir}
                      onClick={() => setSetupWalls((prev: any) => ({ ...prev, [wallDir]: !isClosed }))}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-start gap-2 ${isClosed
                        ? 'bg-[var(--surface-strong)] border-[var(--sea-ink)] shadow-md'
                        : 'bg-[var(--sand)] border-transparent text-[var(--sea-ink-soft)]'
                        }`}
                    >
                      <span className="text-xs uppercase tracking-wider font-bold capitalize block">{wallDir} Wall</span>
                      <span className={`text-sm font-semibold flex items-center gap-2 ${isClosed ? 'text-[var(--sea-ink)]' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full ${isClosed ? 'bg-red-500' : 'bg-transparent border border-gray-400'}`} />
                        {isClosed ? 'Solid / Closed' : 'Open / Hidden'}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="text-left bg-[var(--sand)] p-4 rounded-xl border border-[var(--line)]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-[var(--sea-ink)]">Wall Thickness (m)</label>
                  <span className="text-[var(--lagoon-deep)] font-mono font-bold">{setupWallThickness.toFixed(2)}m</span>
                </div>
                <input type="range" min="0.05" max="0.5" step="0.01" value={setupWallThickness} onChange={(e) => setSetupWallThickness(parseFloat(e.target.value))} className="w-full accent-[var(--lagoon-deep)]" />
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setWizardStep(1)} className="rounded-full bg-[var(--sand)] text-[var(--sea-ink)] font-bold py-3 px-6 hover:bg-gray-200 transition">Back</button>
                <button
                  onClick={() => setWizardStep(3)}
                  className="rounded-full bg-[var(--brand)] flex-1 text-white font-bold py-3 hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2"
                >
                  Next Step <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
              <p className="text-sm text-[var(--sea-ink-soft)] font-semibold">Step 3: Materials & Ambience</p>

              <div className="text-left space-y-4">
                <div>
                  <label className="text-sm font-bold text-[var(--sea-ink)] mb-2 block">Floor Surface</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'hardwood', name: 'Hardwood', img: '/assets/textures/hardwood.png' },
                      { id: 'carpet', name: 'Carpet', img: null, color: '#2e3f50' },
                      { id: 'marble', name: 'Marble', img: '/assets/textures/marble.png' },
                      { id: 'concrete', name: 'Concrete', img: '/assets/textures/concrete.png' },
                      { id: 'custom_color', name: 'Custom Color', img: null, color: setupFloorColor }
                    ].map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => setSetupFloorType(mat.id)}
                        className={`p-3 rounded-xl border-2 text-left font-bold text-sm transition-all flex items-center gap-3 ${setupFloorType === mat.id ? 'border-[var(--lagoon)] bg-[var(--chip-bg)] text-[var(--sea-ink)] shadow-sm' : 'border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink-soft)] hover:border-[var(--lagoon)]'}`}
                      >
                        <div className="w-8 h-8 rounded bg-cover bg-center border border-black/10 shrink-0" style={{ backgroundImage: mat.img ? `url('${mat.img}')` : 'none', backgroundColor: mat.color || '#eee' }} />
                        {mat.name}
                      </button>
                    ))}
                  </div>
                  {setupFloorType === 'custom_color' && (
                    <ColorPickerPanel initialColor={setupFloorColor} onChange={setSetupFloorColor} />
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-[var(--sea-ink)] mb-2 block">Default Wall Material</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'White Paint', name: 'White Paint', color: '#f0f0f0' },
                      { id: 'Wood', name: 'Wood Planks', color: '#8B4513' },
                      { id: 'Brick', name: 'Brick Wall', color: '#9a4a30' },
                      { id: 'Concrete', name: 'Concrete', color: '#898989' },
                      { id: 'Marble', name: 'Marble', color: '#d8d0c8' },
                      { id: 'custom_color', name: 'Custom Color', color: setupWallColor }
                    ].map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => setSetupWallMaterial(mat.id)}
                        className={`p-3 rounded-xl border-2 text-left font-bold text-sm transition-all flex items-center gap-3 ${setupWallMaterial === mat.id ? 'border-[var(--lagoon)] bg-[var(--chip-bg)] text-[var(--sea-ink)] shadow-sm' : 'border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink-soft)] hover:border-[var(--lagoon)]'}`}
                      >
                        <div className="w-8 h-8 rounded bg-cover bg-center border border-black/10 shrink-0" style={{ backgroundColor: mat.color }} />
                        {mat.name}
                      </button>
                    ))}
                  </div>
                  {setupWallMaterial === 'custom_color' && (
                    <ColorPickerPanel initialColor={setupWallColor} onChange={setSetupWallColor} />
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setWizardStep(2)} className="rounded-full bg-[var(--sand)] text-[var(--sea-ink)] font-bold py-3 px-6 hover:bg-gray-200 transition">Back</button>
                <button
                  onClick={() => setWizardStep(4)}
                  className="rounded-full bg-[var(--brand)] flex-1 text-white font-bold py-3 hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2"
                >
                  Next Step <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
              <p className="text-sm text-[var(--sea-ink-soft)] font-semibold">Step 4: Select Your Asset Palette</p>
              <p className="text-xs text-gray-500">Assets will spawn next to your space for easy placement.</p>

              <div className="grid grid-cols-2 gap-3 text-left">
                {[
                  { id: 'petilia', name: 'Bar Stool (Bombo)' },
                  { id: 'catifa_bar', name: 'High Stool (Catifa)' },
                  { id: 'catifa', name: 'Chair (Catifa)' },
                  { id: 'neos_s', name: 'Office Chair (Neos S)' },
                  { id: 'medola_conference', name: 'Meeting Table' },
                  { id: 'brio_70', name: 'Bar Table (Brio)' },
                ].map(asset => (
                  <div key={asset.id} className="flex items-center justify-between bg-[var(--sand)] p-3 rounded-xl border border-[var(--line)]">
                    <span className="text-xs font-bold text-[var(--sea-ink)]">{asset.name}</span>
                    <select
                      value={setupAssets[asset.id] ?? 0}
                      onChange={(e) => setSetupAssets(prev => ({ ...prev, [asset.id]: parseInt(e.target.value) }))}
                      className="bg-[var(--surface-strong)] border border-[var(--line)] rounded text-xs p-1 font-mono text-[var(--sea-ink)]"
                    >
                      {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setWizardStep(3)} className="rounded-full bg-[var(--sand)] text-[var(--sea-ink)] font-bold py-3 px-6 hover:bg-gray-200 transition">Back</button>
                <button
                  onClick={() => {
                    const PPM = 100
                    const W = setupWidth * PPM
                    const D = setupDepth * PPM
                    const T = setupWallThickness * 100

                    const wallProps = setupWallMaterial === 'custom_color'
                      ? { material: 'custom_color', color: setupWallColor }
                      : getWallMaterialProps(setupWallMaterial)
                    const initialElements: any[] = []
                    if (setupWalls.north) initialElements.push({ id: 'outer-north', type: 'wall', isOuter: true, x: W / 2, y: 0, width: W, thickness: T, rotation: 0, wallElements: [], ...wallProps })
                    if (setupWalls.south) initialElements.push({ id: 'outer-south', type: 'wall', isOuter: true, x: W / 2, y: D, width: W, thickness: T, rotation: 0, wallElements: [], ...wallProps })
                    if (setupWalls.west) initialElements.push({ id: 'outer-west', type: 'wall', isOuter: true, x: 0, y: D / 2, width: D, thickness: T, rotation: 90, wallElements: [], ...wallProps })
                    if (setupWalls.east) initialElements.push({ id: 'outer-east', type: 'wall', isOuter: true, x: W, y: D / 2, width: D, thickness: T, rotation: 90, wallElements: [], ...wallProps })

                    // Generate Assets inside the Booth
                    let spawnX = 0.5 * PPM; // Start 0.5m from left wall
                    let spawnY = 0.5 * PPM; // Start 0.5m from top wall

                    Object.entries(setupAssets).forEach(([assetId, count]) => {
                      for (let i = 0; i < count; i++) {
                        const dims = ASSET_DIMENSIONS[assetId] || { w: 1, h: 1 };
                        const reg = ASSET_REGISTRY.find(a => a.id === assetId);
                        initialElements.push({
                          id: `${assetId}_${Math.random().toString(36).substring(2, 7)}`,
                          type: 'asset',
                          assetName: assetId,
                          categoryFolder: reg ? (reg.categoryFolder || reg.category) : 'models',
                          label: reg ? reg.label : assetId,
                          details: reg ? reg.details : '',
                          x: spawnX,
                          y: spawnY,
                          width: DEFAULT_ASSET_SIZE_PX * dims.w,
                          height: DEFAULT_ASSET_SIZE_PX * dims.h,
                          specH: reg ? reg.specH : undefined,
                          facingOffset: reg ? (reg as any).facingOffset : 0,
                          rotation: 0
                        });
                        spawnX += 0.8 * PPM; // Move right by 0.8m
                        // Wrap to next row if we get close to the right wall
                        if (spawnX > W - (0.8 * PPM)) {
                          spawnX = 0.5 * PPM; // reset X to left
                          spawnY += 0.8 * PPM; // move down a row
                        }
                      }
                    });

                    const newConfig = { width: setupWidth, depth: setupDepth, wallThickness: setupWallThickness, walls: setupWalls, floorType: setupFloorType, floorColor: setupFloorColor }
                    setBoothConfig(newConfig)
                    setElements(initialElements)
                    saveToHistory(newConfig, initialElements)

                    if (sessionUser) {
                      if (currentDesignId) {
                        updateDesign(currentDesignId, { config: newConfig, elements: initialElements }).catch(console.error)
                      } else {
                        // Automatically create as standalone design so auto-saving starts right away
                        listDesigns().then(async (userDesigns) => {
                          if (userDesigns.length >= 6) {
                            showAlert('Account design limit reached (6 maximum). New design will not be auto-saved to cloud.', 'warning', 'Limit Reached')
                          } else {
                            try {
                              const newDesign = await saveDesign(null, projectName || 'Untitled Design', newConfig, initialElements)
                              setCurrentDesignId(newDesign.id)
                              setProjectName(newDesign.name)
                              localStorage.setItem('current-design-id', newDesign.id)
                              localStorage.setItem('current-design-name', newDesign.name)
                              localStorage.removeItem('current-project-id')
                              setSelectedProjectId('')
                              setSyncStatus('saved')
                            } catch (err: any) {
                              console.error('Auto-create standalone design failed:', err)
                            }
                          }
                        }).catch(console.error)
                      }
                    }
                  }}
                  className="rounded-full bg-[var(--lagoon-deep)] flex-1 text-white font-bold py-3 hover:bg-[var(--palm)] transition flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Initialize Space
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    )
  }

  // Editor layout using split panels
  return (
    <div key="editor-workspace" className="flex flex-col h-screen overflow-hidden bg-[var(--bg-base)]">
      {/* Mobile Experience Notice Banner */}
      {!mobileScreenBannerDismissed && (
        <div className="md:hidden bg-gradient-to-r from-amber-500/15 via-brand/10 to-amber-500/15 border-b border-amber-500/30 px-3 py-2 flex items-center justify-between gap-2 shrink-0 animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <Monitor className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-[11px] text-[var(--sea-ink)] leading-tight">
              <span className="font-bold text-amber-600 dark:text-amber-400">Notice: </span>
              For the best experience with 3D editing and canvas tools, please use a larger screen (desktop or tablet).
            </p>
          </div>
          <button
            onClick={() => setMobileScreenBannerDismissed(true)}
            className="p-1 rounded-md text-[var(--fg-dim)] hover:text-[var(--fg)] hover:bg-[var(--chip-bg)] transition shrink-0"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar */}
      <div className="h-14 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center justify-between px-4 z-30 shadow-sm transition-all shrink-0 whitespace-nowrap gap-3 relative">
        {/* Left Section: Logo + Breadcrumb (Project Name + Design Name) */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link 
            to={sessionUser ? "/dashboard" : "/"} 
            className="flex items-center gap-1.5 hover:opacity-80 transition py-1 pr-2.5 border-r border-[var(--border)] shrink-0" 
            title={sessionUser ? "Back to Dashboard" : "Back to Home"}
          >
            <img src="/krafcfavicon.png" alt="krafc Logo" className="h-6 w-auto" />
          </Link>

          {/* Project & Design Name Display */}
          <div className="flex items-center gap-1.5 min-w-0">
            {activeProjectObj && (
              <>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--chip-bg)] border border-[var(--line)] text-xs text-[var(--sea-ink-soft)] font-medium shrink-0 max-w-[150px] truncate" title={`Project: ${activeProjectObj.name}`}>
                  <Folder className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
                  <span className="truncate">{activeProjectObj.name}</span>
                </div>
                <span className="text-[var(--line)] text-sm font-semibold select-none">/</span>
              </>
            )}

            {/* Editable Design Name */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--sand)]/80 border border-[var(--line)] group shadow-xs hover:border-[var(--brand)]/40 transition-colors max-w-[220px]">
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                onKeyDown={async e => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur()
                  }
                }}
                onBlur={async () => {
                  const trimmed = projectName.trim() || 'Untitled Design'
                  setProjectName(trimmed)
                  if (currentDesignId) {
                    localStorage.setItem('current-design-name', trimmed)
                    if (sessionUser) {
                      try {
                        setSyncStatus('saving')
                        await updateDesign(currentDesignId, { name: trimmed })
                        setSyncStatus('saved')
                      } catch (err) {
                        console.error('Failed to sync design rename to cloud:', err)
                        setSyncStatus('idle')
                      }
                    }
                  }
                }}
                className="font-bold text-xs text-[var(--fg)] tracking-tight bg-transparent border-none outline-none focus:ring-1 focus:ring-[var(--brand)]/50 rounded px-1 py-0.5 transition-all flex-1 min-w-0 truncate"
                title="Click to rename design (press Enter or click away to save)"
                placeholder="Design Name"
              />
              <Pencil className="w-2.5 h-2.5 text-[var(--fg-dim)] opacity-40 group-hover:opacity-100 transition-opacity shrink-0 pointer-events-none" />
            </div>

            {/* Cloud Auto-Save Status Indicator */}
            {sessionUser && currentDesignId && (
              <div 
                className="hidden sm:flex items-center gap-1 text-[11px] text-[var(--fg-dim)] px-1 select-none transition-all"
                title={syncStatus === 'saving' ? 'Saving changes to cloud...' : 'All changes saved to cloud'}
              >
                {syncStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-3 h-3 text-[var(--brand)] animate-spin" />
                    <span className="text-[10px] text-[var(--brand)] font-medium">Saving...</span>
                  </>
                ) : (
                  <>
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] text-[var(--fg-dim)] font-medium">Saved</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Undo/Redo/Clear + View Toggles + User / Auth */}
        <div className="flex items-center gap-2.5 shrink-0 ml-auto">
          {/* Undo / Redo / Clear */}
          <div className="flex items-center gap-0.5">
            <button onClick={undo} disabled={historyStep <= 0} className="p-1.5 rounded-lg hover:bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] disabled:opacity-30 transition cursor-pointer" title="Undo (Ctrl+Z)">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button onClick={redo} disabled={historyStep >= history.length - 1} className="p-1.5 rounded-lg hover:bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] disabled:opacity-30 transition cursor-pointer" title="Redo (Ctrl+Shift+Z)">
              <RotateCw className="h-3.5 w-3.5" />
            </button>
            <button onClick={clearAll} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer" title="Clear Workspace">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="w-px h-5 bg-[var(--line)]" />

          {/* View Toggles - desktop only */}
          <div className="hidden md:flex items-center gap-1 bg-[var(--sand)] p-0.5 rounded-lg border border-[var(--line)]">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1.5 rounded-md transition cursor-pointer ${sidebarOpen ? 'bg-[var(--brand)] text-white' : 'text-[var(--fg-soft)] hover:bg-[var(--bg-subtle)]'}`}
              title="Toggle Sidebar"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPropertiesOpen(!propertiesOpen)}
              className={`p-1.5 rounded-md transition cursor-pointer ${propertiesOpen ? 'bg-[var(--brand)] text-white' : 'text-[var(--fg-soft)] hover:bg-[var(--bg-subtle)]'}`}
              title="Toggle Properties"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewerOpen(!previewerOpen)}
              className={`p-1.5 rounded-md transition cursor-pointer ${previewerOpen ? 'bg-[var(--brand)] text-white' : 'text-[var(--fg-soft)] hover:bg-[var(--bg-subtle)]'}`}
              title="Toggle 3D Preview"
            >
              <PanelRightClose className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-px h-5 bg-[var(--line)]" />

          {/* User & Auth */}
          {!sessionUser ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ml-1"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          ) : (
            <div className="flex items-center pl-1">
              <UserMenuDropdown
                user={sessionUser}
                onSignedOut={() => {
                  setSessionUser(null)
                  setCurrentDesignId(null)
                  localStorage.removeItem('current-design-id')
                  localStorage.removeItem('current-design-name')
                  localStorage.removeItem('current-project-id')
                  setSelectedProjectId('')
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Split Workspaces - clean separation between desktop layout and mobile drawer/view mode */}
      <div ref={splitContainerRef} className="flex flex-1 overflow-hidden relative">

        {/* --- DESKTOP PANELS (md and up) --- */}
        {/* Left Sidebar (Desktop) */}
        {sidebarOpen && (
          <div className="hidden md:flex h-full shrink-0 shadow-xl border-r border-[var(--line)] bg-[var(--surface-strong)]">
            <Sidebar
              addElement={addElement}
              activeView={blueprintView}
              onViewChange={setBlueprintView}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              boothConfig={boothConfig}
              setBoothConfig={setBoothConfig}
              customAssets={customAssets}
              onUploadCustomAsset={handleUploadCustomAsset}
              onDeleteCustomAsset={handleDeleteCustomAsset}
              showAlert={showAlert}
              onNewProject={handleNewProject}
              onCopyToProject={() => {
                if (!sessionUser) {
                  setPendingSaveTrigger(true)
                  setAuthModalOpen(true)
                  return
                }
                const currentProj = localStorage.getItem('current-project-id')
                setSelectedProjectId(currentProj || '')
                setShowSavePrompt(true)
              }}
              onOpenProjects={() => {
                if (sessionUser) setCloudDrawerOpen(true)
                else setAuthModalOpen(true)
              }}
              onGenerateReport={() => {
                if (!sessionUser) {
                  setAuthModalOpen(true)
                  return
                }
                submitExport()
              }}
              isCapturingReport={isCapturingReport}
            />
          </div>
        )}

        {/* Center Canvas (Desktop & Mobile when not in 3D tab) */}
        <div className={`
          ${mobileTab === '3d' ? 'hidden md:flex' : 'flex'}
          flex-1 h-full flex-col relative z-0 min-w-0 bg-[var(--bg-base)]
        `}>
          <Canvas
            elements={elements}
            setElements={handleCanvasSetElements}
            selectedId={selectedId}
            onSelect={handleSelect}
            boothConfig={boothConfig}
            gridVisible={gridVisible}
          />
        </div>

        {/* Properties Panel (Desktop) */}
        {propertiesOpen && (
          <div className="hidden md:flex shrink-0 h-full border-l border-[var(--line)] shadow-[-8px_0_20px_rgba(0,0,0,0.05)] bg-[var(--surface-strong)]">
            <Properties
              selectedElement={selectedElement}
              onUpdate={handleUpdateElement}
              onDelete={() => handleDeleteElement(selectedId!)}
              onEditElevation={() => setEditingWallId(selectedId)}
              onViewElevation={() => setBlueprintView(`elevation_${selectedId}` as any)}
              boothConfig={boothConfig}
              onBoothConfigUpdate={(updates: any) => {
                setBoothConfig((prev: any) => {
                  const updated = { ...prev, ...updates };
                  saveToHistory(updated, elementsRef.current);
                  return updated;
                });
              }}
              onEditRoof={() => setEditingRoof(true)}
            />
          </div>
        )}

        {/* Resizer handle (Desktop only) */}
        {previewerOpen && (
          <div
            className="hidden md:block w-1.5 shrink-0 bg-[var(--line)] hover:bg-[var(--lagoon)] cursor-col-resize z-30 transition-colors"
            onMouseDown={() => {
              const container = splitContainerRef.current
              const onMove = (e: MouseEvent) => {
                if (e.buttons !== 1) return
                const rect = container ? container.getBoundingClientRect() : { left: 0, width: window.innerWidth }
                const pct = ((e.clientX - rect.left) / rect.width) * 100
                if (pct > 20 && pct < 85) setSplitWidth(pct)
              }
              const onUp = () => {
                window.removeEventListener('mousemove', onMove)
                window.removeEventListener('mouseup', onUp)
              }
              window.addEventListener('mousemove', onMove)
              window.addEventListener('mouseup', onUp)
            }}
          />
        )}

        {/* 3D Previewer Panel (Desktop split panel) */}
        {previewerOpen && (
          <div
            style={{ width: `${100 - splitWidth}%` }}
            className="hidden md:flex shrink-0 min-w-[180px] border-l border-[#2a2d30] bg-[#121415] flex-col shadow-2xl z-20 relative h-full"
          >
            {!sessionUser ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181a1d] to-[#121415] relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[var(--brand)] shadow-lg">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-white font-bold mb-1 text-sm font-[Outfit]">3D Preview Locked</h4>
                <p className="text-gray-400 text-xs max-w-[200px] mb-4 leading-relaxed">
                  Sign in to unlock your 3D space.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In to Unlock 3D
                </button>
              </div>
            ) : is3DGenerated ? (
              <div className="flex-1 w-full relative">
                <Preview3D
                  boothConfig={boothConfig}
                  elements={elements}
                  activeView={blueprintView}
                  onExportComplete={handleExportComplete}
                  onUpdateElement={handleUpdateElement}
                  onSelectElement={handleSelect}
                  selectedId={selectedId}
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-[#121415]">
                <Box className="w-14 h-14 text-gray-800 mb-4 opacity-50" />
                <h4 className="text-gray-300 font-bold mb-1 text-sm">3D Engine Offline</h4>
                <p className="text-gray-500 text-[10px] max-w-[180px] mb-3">Place objects in the 2D layout and generate 3D.</p>
                <button
                  onClick={() => setIs3DGenerated(true)}
                  className="px-4 py-1.5 rounded-full bg-[var(--lagoon-deep)] text-white font-bold text-xs hover:bg-[var(--palm)] transition"
                >
                  Start 3D Engine
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- MOBILE-ONLY OVERLAYS & VIEWS (< 768px) --- */}
        {/* Mobile Asset Library Drawer */}
        {mobileTab === 'assets' && (
          <div className="md:hidden">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 animate-in fade-in duration-150"
              onClick={() => setMobileTab('canvas')}
            />
            <div className="fixed inset-x-0 bottom-14 top-0 z-40 flex flex-col shadow-xl border-r border-[var(--line)] bg-[var(--surface-strong)]">
              <Sidebar
                addElement={(el) => {
                  addElement(el)
                  setMobileTab('canvas')
                }}
                activeView={blueprintView}
                onViewChange={setBlueprintView}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                boothConfig={boothConfig}
                setBoothConfig={setBoothConfig}
                customAssets={customAssets}
                onUploadCustomAsset={handleUploadCustomAsset}
                onDeleteCustomAsset={handleDeleteCustomAsset}
                showAlert={showAlert}
                onClose={() => setMobileTab('canvas')}
                onNewProject={handleNewProject}
                onCopyToProject={() => {
                  if (!sessionUser) {
                    setPendingSaveTrigger(true)
                    setAuthModalOpen(true)
                    return
                  }
                  const currentProj = localStorage.getItem('current-project-id')
                  setSelectedProjectId(currentProj || '')
                  setShowSavePrompt(true)
                }}
                onOpenProjects={() => {
                  if (sessionUser) setCloudDrawerOpen(true)
                  else setAuthModalOpen(true)
                }}
                onGenerateReport={() => {
                  if (!sessionUser) {
                    setAuthModalOpen(true)
                    return
                  }
                  submitExport()
                }}
                isCapturingReport={isCapturingReport}
              />
            </div>
          </div>
        )}

        {/* Mobile Properties Drawer */}
        {mobileTab === 'properties' && (
          <div className="md:hidden">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 animate-in fade-in duration-150"
              onClick={() => setMobileTab('canvas')}
            />
            <div className="fixed inset-x-0 bottom-14 top-0 z-40 flex flex-col border-l border-[var(--line)] shadow-[-8px_0_20px_rgba(0,0,0,0.05)] bg-[var(--surface-strong)]">
              <Properties
                selectedElement={selectedElement}
                onUpdate={handleUpdateElement}
                onDelete={() => {
                  handleDeleteElement(selectedId!)
                  setMobileTab('canvas')
                }}
                onEditElevation={() => setEditingWallId(selectedId)}
                onViewElevation={() => setBlueprintView(`elevation_${selectedId}` as any)}
                boothConfig={boothConfig}
                onBoothConfigUpdate={(updates: any) => setBoothConfig((prev: any) => ({ ...prev, ...updates }))}
                onEditRoof={() => setEditingRoof(true)}
                onClose={() => setMobileTab('canvas')}
              />
            </div>
          </div>
        )}

        {/* Mobile Fullscreen 3D View (Mobile only when 3D tab active) */}
        {mobileTab === '3d' && (
          <div className="md:hidden flex flex-1 w-full border-l border-[#2a2d30] bg-[#121415] flex-col shadow-2xl z-20 relative h-full">
            {!sessionUser ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181a1d] to-[#121415] relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[var(--brand)] shadow-lg">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-white font-bold mb-1 text-sm font-[Outfit]">3D Preview Locked</h4>
                <p className="text-gray-400 text-xs max-w-[200px] mb-4 leading-relaxed">
                  Sign in to unlock your 3D space.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In to Unlock 3D
                </button>
              </div>
            ) : is3DGenerated ? (
              <div className="flex-1 w-full relative">
                <Preview3D
                  boothConfig={boothConfig}
                  elements={elements}
                  activeView={blueprintView}
                  onExportComplete={handleExportComplete}
                  onUpdateElement={handleUpdateElement}
                  onSelectElement={handleSelect}
                  selectedId={selectedId}
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-[#121415]">
                <Box className="w-14 h-14 text-gray-800 mb-4 opacity-50" />
                <h4 className="text-gray-300 font-bold mb-1 text-sm">3D Engine Offline</h4>
                <p className="text-gray-500 text-[10px] max-w-[180px] mb-3">Place objects in the 2D layout and generate 3D.</p>
                <button
                  onClick={() => setIs3DGenerated(true)}
                  className="px-4 py-1.5 rounded-full bg-[var(--lagoon-deep)] text-white font-bold text-xs hover:bg-[var(--palm)] transition"
                >
                  Start 3D Engine
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Status Bar (Desktop only) */}
      <div className="hidden md:flex h-6 border-t border-[var(--line)] bg-[var(--surface-strong)] items-center justify-between px-4 text-[10px] uppercase tracking-tighter font-bold text-[var(--sea-ink-soft)] select-none shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setGridVisible(!gridVisible)}
            className={`px-2 py-1 rounded bg-[var(--line)] hover:bg-[var(--sand)] flex items-center gap-1 ${gridVisible ? 'text-[var(--sea-ink)]' : 'text-gray-400'}`}
          >
            SNAP GRID (1M) {gridVisible ? 'ON' : 'OFF'}
          </button>
          <span>Objects: {elements.length}</span>
          <span>Workspace: {boothConfig.width}m x {boothConfig.depth}m</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> WebGL Ready
          </span>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Option 2) */}
      <nav className="md:hidden h-14 border-t border-[var(--line)] bg-[var(--surface-strong)]/95 backdrop-blur-md flex items-center justify-around px-2 z-50 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        {/* Assets Button */}
        <button
          onClick={() => setMobileTab(prev => prev === 'assets' ? 'canvas' : 'assets')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            mobileTab === 'assets'
              ? 'text-[var(--brand)] font-extrabold scale-105'
              : 'text-[var(--sea-ink-soft)] hover:text-[var(--fg)] font-medium'
          }`}
        >
          <Box className={`w-5 h-5 transition-transform ${mobileTab === 'assets' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Assets</span>
        </button>

        {/* 2D Canvas View Button */}
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            mobileTab === 'canvas'
              ? 'text-[var(--brand)] font-extrabold scale-105'
              : 'text-[var(--sea-ink-soft)] hover:text-[var(--fg)] font-medium'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 transition-transform ${mobileTab === 'canvas' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">2D Canvas</span>
        </button>

        {/* 3D Preview View Button */}
        <button
          onClick={() => {
            if (!is3DGenerated && sessionUser) {
              setIs3DGenerated(true)
            }
            setMobileTab('3d')
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
            mobileTab === '3d'
              ? 'text-[var(--brand)] font-extrabold scale-105'
              : 'text-[var(--sea-ink-soft)] hover:text-[var(--fg)] font-medium'
          }`}
        >
          <div className="relative">
            <RotateCw className={`w-5 h-5 transition-transform ${mobileTab === '3d' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {is3DGenerated && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[var(--surface-strong)]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">3D View</span>
        </button>

        {/* Properties Button */}
        <button
          onClick={() => setMobileTab(prev => prev === 'properties' ? 'canvas' : 'properties')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
            mobileTab === 'properties'
              ? 'text-[var(--brand)] font-extrabold scale-105'
              : 'text-[var(--sea-ink-soft)] hover:text-[var(--fg)] font-medium'
          }`}
        >
          <div className="relative">
            <Sliders className={`w-5 h-5 transition-transform ${mobileTab === 'properties' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {selectedElement && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--brand)] ring-2 ring-[var(--surface-strong)]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Properties</span>
        </button>
      </nav>
      {/* Wall Elevation Modal Overlay */}
      {editingWallId && editingWall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-7xl h-full max-h-[85vh] bg-[var(--bg-base)] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative border border-[var(--border)] scale-in-center">
            <WallCanvas
              wall={editingWall}
              onSave={(wallElements: any) => {
                handleUpdateElement(editingWall.id, { wallElements })
                setEditingWallId(null)
              }}
              onClose={() => setEditingWallId(null)}
            />
          </div>
        </div>
      )}
      {/* Roof Configuration Modal Overlay */}
      {editingRoof && boothConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-7xl h-full max-h-[85vh] bg-[var(--bg-base)] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative border border-[var(--border)] scale-in-center">
            <RoofCanvas
              boothConfig={boothConfig}
              onSave={(roofConfig: any) => {
                setBoothConfig((prev: any) => {
                  const updated = { ...prev, roof: roofConfig };
                  saveToHistory(updated, elementsRef.current);
                  return updated;
                });
                setEditingRoof(false);
              }}
              onClose={() => setEditingRoof(false)}
            />
          </div>
        </div>
      )}
      {/* Supabase Integration Overlays */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false)
          setPendingSaveTrigger(false)
        }}
        onSuccess={() => {
          getCurrentUser().then(async user => {
            setSessionUser(user)
            if (user) {
              try {
                const projects = await listProjects().catch(() => [])
                setUserProjects(projects || [])

                // Check user's current designs for limit check
                const userDesigns = await listDesigns().catch(() => [])
                const isLimitReached = userDesigns.length >= 6

                // If user was prompted by clicking Save
                if (pendingSaveTrigger) {
                  setPendingSaveTrigger(false)
                  if (isLimitReached) {
                    showAlert('Account design limit reached (6 maximum). Please delete an existing design to save a new one.', 'warning', 'Limit Reached')
                  } else {
                    const currentProj = localStorage.getItem('current-project-id')
                    setSelectedProjectId(currentProj || '')
                    setShowSavePrompt(true)
                  }
                } else if (!currentDesignId && (elements.length > 0 || boothConfig)) {
                  // User signed in naturally while having an unsaved design in editor
                  if (isLimitReached) {
                    showAlert('Account design limit reached (6 maximum). Your current design was not auto-saved.', 'warning', 'Limit Reached')
                  } else {
                    try {
                      const designNameToSave = projectName?.trim() || 'Untitled Design'
                      const newDesign = await saveDesign(null, designNameToSave, boothConfig, elements)
                      setCurrentDesignId(newDesign.id)
                      setProjectName(newDesign.name)
                      localStorage.setItem('current-design-id', newDesign.id)
                      localStorage.setItem('current-design-name', newDesign.name)
                      localStorage.removeItem('current-project-id')
                      setSelectedProjectId('')
                      showAlert('Your design was saved as a standalone design and auto-sync is now active.', 'success', 'Design Saved')
                    } catch (saveErr: any) {
                      console.error('Auto-save guest design failed:', saveErr)
                      showAlert(saveErr.message || 'Could not auto-save design.', 'error', 'Save Failed')
                    }
                  }
                }
              } catch (err) {
                console.error('Post-login initialization error:', err)
              }
            }
          }).catch(console.error)
        }}
      />

      <CloudProjectsDrawer
        isOpen={cloudDrawerOpen}
        onClose={() => setCloudDrawerOpen(false)}
        onLoadProject={loadCloudDesign}
        userId={sessionUser?.id || null}
        onDesignDeleted={({ designId, projectId }) => {
          if (!sessionUser) return
          const deletedOpenDesign = designId
            ? currentDesignId === designId
            : selectedProjectId === projectId
          if (deletedOpenDesign) {
            setCurrentDesignId(null)
            setSyncStatus('idle')
            setSelectedProjectId('')
            localStorage.removeItem('current-design-id')
            localStorage.removeItem('current-design-name')
            localStorage.removeItem('current-project-id')
            showAlert('This design was deleted from the cloud. Your work stays on screen as an unsaved copy and will not auto-save until you save it again.', 'info', 'Design Deleted')
          } else {
            syncCurrentDesignToProfile(sessionUser, 'space_cleared')
          }
        }}
      />

      {/* Sleek Save Project Dialog */}
      {showSavePrompt && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/15 bg-[var(--bg-card)] dark:bg-[#16181d] backdrop-blur-2xl p-8 sm:p-9 shadow-2xl transition-all text-[var(--fg)] dark:text-white"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}
          >
            <button
              onClick={() => setShowSavePrompt(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[var(--fg-soft)] dark:text-white/80 hover:text-[var(--fg)] dark:hover:text-white hover:bg-[var(--bg-subtle)] dark:hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold font-[Outfit] text-[var(--fg)] dark:text-white mb-6 tracking-tight">
              Copy Design To...
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-[var(--fg-soft)] dark:text-white/85 block">
                  Target Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-[var(--surface-light)] dark:bg-white/5 border border-[var(--border)] dark:border-white/15 text-[var(--fg)] dark:text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[var(--brand)] transition appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[var(--bg-card)] dark:bg-[#16181d] text-[var(--fg)] dark:text-white">None (Standalone Design)</option>
                  {userProjects.map(p => (
                    <option key={p.id} value={p.id} className="bg-[var(--bg-card)] dark:bg-[#16181d] text-[var(--fg)] dark:text-white">{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-[var(--fg-soft)] dark:text-white/70 block">
                  New Copy Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-[var(--surface-light)] dark:bg-white/5 border border-[var(--border)] dark:border-white/15 text-[var(--fg)] dark:text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[var(--brand)] transition"
                  placeholder="E.g., Tech Summit 2026 Stand"
                />
              </div>

              <div className="space-y-3 pt-3">
                <button
                  onClick={handleCloudSaveAs}
                  disabled={isCloudSaving}
                  className="w-full bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3] text-white text-base font-bold py-3.5 px-5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(79,70,229,0.35)] disabled:opacity-50"
                >
                  <Copy className="w-5 h-5 text-white" />
                  <span className="text-white">{isCloudSaving ? 'Copying...' : sessionUser ? 'Copy Design' : 'Login to Copy'}</span>
                </button>
                
                <button
                  onClick={() => setShowSavePrompt(false)}
                  disabled={isCloudSaving}
                  className="w-full bg-transparent text-[var(--fg-dim)] dark:text-white/60 hover:text-[var(--fg)] dark:hover:text-white text-sm font-semibold py-2.5 px-4 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
                {/* 
                <div className="text-[10px] font-black tracking-wider uppercase text-white/50 pt-3 block border-t border-white/10">
                  Export 3D Model Formats
                </div>

                <div className="grid grid-cols-2 gap-3">
                  // GLB 
                  <button
                    onClick={async () => {
                      if (!is3DGenerated || !(window as any).export3DModel) {
                        showAlert("Please click 'Generate 3D' first to export the 3D model.", 'warning', '3D Required');
                        return;
                      }
                      try {
                        const blob = await (window as any).export3DModel('glb');
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${projectName.replace(/\\s+/g, '_')}_space.glb`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        setShowSavePrompt(false);
                      } catch (err) {
                        console.error("GLB export failed:", err);
                        showAlert("Failed to export 3D model.", 'error', 'Export Error');
                      }
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <Box className="w-5 h-5 text-amber-400" />
                    <span className="text-[11px]">Download GLB</span>
                    <span className="text-[8px] text-white/50 leading-none">Binary 3D (All-in-one)</span>
                  </button>

                  // OBJ
                  <button
                    onClick={async () => {
                      if (!is3DGenerated || !(window as any).export3DModel) {
                        showAlert("Please click 'Generate 3D' first to export the 3D model.", 'warning', '3D Required');
                        return;
                      }
                      try {
                        const blob = await (window as any).export3DModel('obj');
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${projectName.replace(/\\s+/g, '_')}_space.obj`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        setShowSavePrompt(false);
                      } catch (err) {
                        console.error("OBJ export failed:", err);
                        showAlert("Failed to export 3D model.", 'error', 'Export Error');
                      }
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <Download className="w-5 h-5 text-emerald-400" />
                    <span className="text-[11px]">Download OBJ</span>
                    <span className="text-[8px] text-white/50 leading-none">CAD / Blender Mesh</span>
                  </button>
                </div>
                */}
          </div>
        </div>
      )}
      {/* Custom Alert/Notification Modal */}
      {toastModal && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setToastModal(null)}
        >
          <div 
            className="relative w-full max-w-[480px] overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/15 bg-[var(--bg-card)] dark:bg-[#181a1d] backdrop-blur-2xl p-8 sm:p-9 shadow-2xl transition-all text-center flex flex-col items-center text-[var(--fg)] dark:text-white"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
              toastModal.type === 'error' ? 'bg-red-500/15 border border-red-500/25 text-red-500 dark:text-red-400' :
              toastModal.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400' :
              toastModal.type === 'warning' ? 'bg-amber-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400' :
              'bg-[var(--brand)]/15 border border-[var(--brand)]/25 text-[var(--brand)]'
            }`}>
              {toastModal.type === 'error' ? <AlertCircle className="w-8 h-8" /> :
               toastModal.type === 'success' ? <CheckCircle className="w-8 h-8" /> :
               toastModal.type === 'warning' ? <AlertTriangle className="w-8 h-8" /> :
               <Info className="w-8 h-8" />}
            </div>

            <h3 className="text-2xl font-bold font-[Outfit] text-[var(--fg)] dark:text-white mb-2 tracking-tight">
              {toastModal.title || (toastModal.type === 'error' ? 'Error' : toastModal.type === 'success' ? 'Success' : toastModal.type === 'warning' ? 'Notice' : 'Information')}
            </h3>

            <p className="text-base text-[var(--fg-soft)] dark:text-white/80 mb-7 leading-relaxed px-2">
              {toastModal.message}
            </p>

            <button
              onClick={() => setToastModal(null)}
              className="w-full py-3.5 px-5 bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3] text-white font-bold text-base rounded-xl shadow-[0_4px_16px_rgba(79,70,229,0.35)] transition cursor-pointer"
            >
              <span className="text-white font-bold">Got it</span>
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmModalState}
        title={confirmModalState?.title}
        message={confirmModalState?.message || ''}
        confirmText={confirmModalState?.confirmText}
        onConfirm={() => confirmModalState?.onConfirm()}
        onCancel={() => setConfirmModalState(null)}
      />

      <ReportModal
        isOpen={reportModalData.isOpen}
        onClose={() => setReportModalData(prev => ({ ...prev, isOpen: false }))}
        reportHtml={reportModalData.html}
        projectName={reportModalData.projectName}
        docId={reportModalData.docId}
      />
    </div>
  )
}
