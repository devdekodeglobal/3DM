import { useEffect, useRef, useState } from 'react'
import { Box } from 'lucide-react'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

interface AssetModelThumbnailProps {
  assetName: string
  categoryFolder: string
  label: string
  className?: string
}

// In-memory dataURL cache for rendered thumbnails so we only render each GLB snapshot once per session
const thumbnailDataUrlCache = new Map<string, string>()

// Simple queue to render thumbnails sequentially with a single shared offscreen canvas/engine
type RenderTask = {
  key: string
  assetName: string
  categoryFolder: string
  resolve: (dataUrl: string | null) => void
}

const renderQueue: RenderTask[] = []
let isProcessingQueue = false
let sharedEngine: BABYLON.NullEngine | BABYLON.Engine | null = null
let sharedCanvas: HTMLCanvasElement | null = null

async function processNextThumbnailTask() {
  if (renderQueue.length === 0) {
    isProcessingQueue = false
    if (sharedEngine) {
      sharedEngine.dispose()
      sharedEngine = null
    }
    if (sharedCanvas) {
      sharedCanvas = null
    }
    return
  }

  isProcessingQueue = true
  const task = renderQueue.shift()!

  if (thumbnailDataUrlCache.has(task.key)) {
    task.resolve(thumbnailDataUrlCache.get(task.key)!)
    processNextThumbnailTask()
    return
  }

  try {
    if (!sharedCanvas) {
      sharedCanvas = document.createElement('canvas')
      sharedCanvas.width = 160
      sharedCanvas.height = 160
    }
    if (!sharedEngine || sharedEngine.isDisposed) {
      sharedEngine = new BABYLON.Engine(sharedCanvas, true, {
        preserveDrawingBuffer: true,
        stencil: false,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
      }, false)
    }

    const scene = new BABYLON.Scene(sharedEngine)
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

    const camera = new BABYLON.ArcRotateCamera(
      'thumb-cam',
      -Math.PI / 4,
      Math.PI / 3,
      3,
      BABYLON.Vector3.Zero(),
      scene,
    )
    camera.fov = 0.75

    const ambientLight = new BABYLON.HemisphericLight('thumb-amb', new BABYLON.Vector3(0, 1, 0), scene)
    ambientLight.intensity = 1.3
    const keyLight = new BABYLON.DirectionalLight('thumb-key', new BABYLON.Vector3(-1, -2, 1), scene)
    keyLight.position = new BABYLON.Vector3(4, 7, -4)
    keyLight.intensity = 1.1

    const { meshes } = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      `/models/${task.categoryFolder}/`,
      `${task.assetName}.glb`,
      scene,
    )

    const renderableMeshes = meshes.filter(mesh => mesh.getTotalVertices() > 0)
    if (renderableMeshes.length === 0) {
      scene.dispose()
      task.resolve(null)
      processNextThumbnailTask()
      return
    }

    let min = new BABYLON.Vector3(Infinity, Infinity, Infinity)
    let max = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity)
    renderableMeshes.forEach(mesh => {
      mesh.computeWorldMatrix(true)
      const bounds = mesh.getBoundingInfo().boundingBox
      min = BABYLON.Vector3.Minimize(min, bounds.minimumWorld)
      max = BABYLON.Vector3.Maximize(max, bounds.maximumWorld)
    })

    const center = min.add(max).scale(0.5)
    const span = max.subtract(min)
    camera.target = center
    camera.radius = Math.max(span.length() * 1.45, 0.5)

    // Render 2 frames to ensure materials are fully uploaded and drawn
    scene.render()
    scene.render()

    const dataUrl = sharedCanvas.toDataURL('image/png')
    scene.dispose()

    if (dataUrl && dataUrl.length > 500) {
      thumbnailDataUrlCache.set(task.key, dataUrl)
      task.resolve(dataUrl)
    } else {
      task.resolve(null)
    }
  } catch (err) {
    console.warn('Thumbnail generation failed for', task.assetName, err)
    task.resolve(null)
  }

  // Small delay before next task to prevent browser rendering starvation
  setTimeout(processNextThumbnailTask, 16)
}

function requestThumbnail(assetName: string, categoryFolder: string): Promise<string | null> {
  const key = `${categoryFolder}/${assetName}`
  if (thumbnailDataUrlCache.has(key)) {
    return Promise.resolve(thumbnailDataUrlCache.get(key)!)
  }

  return new Promise((resolve) => {
    renderQueue.push({ key, assetName, categoryFolder, resolve })
    if (!isProcessingQueue) {
      processNextThumbnailTask()
    }
  })
}

/** Renders the real GLB model as an optimized cached image snapshot without holding persistent WebGL contexts. */
export default function AssetModelThumbnail({
  assetName,
  categoryFolder,
  label,
  className = '',
}: AssetModelThumbnailProps) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(() => {
    const key = `${categoryFolder}/${assetName}`
    return thumbnailDataUrlCache.get(key) || null
  })
  const [failedToLoad, setFailedToLoad] = useState(false)

  useEffect(() => {
    let cancelled = false
    const key = `${categoryFolder}/${assetName}`
    if (thumbnailDataUrlCache.has(key)) {
      setThumbUrl(thumbnailDataUrlCache.get(key)!)
      setFailedToLoad(false)
      return
    }

    requestThumbnail(assetName, categoryFolder).then((url) => {
      if (cancelled) return
      if (url) {
        setThumbUrl(url)
        setFailedToLoad(false)
      } else {
        setFailedToLoad(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [assetName, categoryFolder])

  if (failedToLoad) {
    return (
      <div className={`flex items-center justify-center text-[var(--sea-ink-soft)] ${className}`} title={`${label} preview unavailable`}>
        <Box className="w-10 h-10 opacity-60" />
      </div>
    )
  }

  if (!thumbUrl) {
    return (
      <div className={`flex items-center justify-center text-[var(--sea-ink-soft)] ${className}`}>
        <div className="w-6 h-6 border-2 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <img
      src={thumbUrl}
      alt={`${label} 3D preview`}
      className={`block object-contain pointer-events-none select-none ${className}`}
      loading="lazy"
    />
  )
}
