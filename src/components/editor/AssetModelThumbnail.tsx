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

/** Renders the real GLB model used by the editor as a lightweight picker preview. */
export default function AssetModelThumbnail({
  assetName,
  categoryFolder,
  label,
  className = '',
}: AssetModelThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failedToLoad, setFailedToLoad] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true }, false)
    const scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

    const camera = new BABYLON.ArcRotateCamera(
      'asset-thumbnail-camera',
      -Math.PI / 4,
      Math.PI / 3,
      3,
      BABYLON.Vector3.Zero(),
      scene,
    )
    camera.lowerRadiusLimit = 0.1
    camera.upperRadiusLimit = 100
    camera.fov = 0.75

    const ambientLight = new BABYLON.HemisphericLight('asset-thumbnail-ambient', new BABYLON.Vector3(0, 1, 0), scene)
    ambientLight.intensity = 1.25
    const keyLight = new BABYLON.DirectionalLight('asset-thumbnail-key', new BABYLON.Vector3(-1, -2, 1), scene)
    keyLight.position = new BABYLON.Vector3(4, 7, -4)
    keyLight.intensity = 1.1

    BABYLON.SceneLoader.ImportMeshAsync(
      '',
      `/models/${categoryFolder}/`,
      `${assetName}.glb`,
      scene,
    ).then(({ meshes }) => {
      if (disposed) return

      const renderableMeshes = meshes.filter(mesh => mesh.getTotalVertices() > 0)
      if (renderableMeshes.length === 0) {
        setFailedToLoad(true)
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

      engine.runRenderLoop(() => {
        if (!scene.isDisposed) scene.render()
      })
    }).catch(() => {
      if (!disposed) setFailedToLoad(true)
    })

    const resizeObserver = new ResizeObserver(() => engine.resize())
    resizeObserver.observe(canvas)

    return () => {
      disposed = true
      resizeObserver.disconnect()
      engine.stopRenderLoop()
      scene.dispose()
      engine.dispose()
    }
  }, [assetName, categoryFolder])

  if (failedToLoad) {
    return (
      <div className={`flex items-center justify-center text-[var(--sea-ink-soft)] ${className}`} title={`${label} preview unavailable`}>
        <Box className="w-12 h-12" />
      </div>
    )
  }

  return <canvas ref={canvasRef} className={`block ${className}`} aria-label={`${label} 3D preview`} />
}
