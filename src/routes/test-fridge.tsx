import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

export const Route = createFileRoute('/test-fridge')({
  component: TestFridge,
})

function TestFridge() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const engine = new BABYLON.Engine(canvasRef.current, true)
    const scene = new BABYLON.Scene(engine)
    
    scene.clearColor = new BABYLON.Color4(0.9, 0.9, 0.9, 1)

    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 4, Math.PI / 3, 300, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvasRef.current, true)
    
    // Adjust wheel precision for large objects
    camera.wheelPrecision = 10;

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)
    light.intensity = 1.0

    const dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), scene)
    dirLight.position = new BABYLON.Vector3(20, 40, 20)
    dirLight.intensity = 0.8

    BABYLON.SceneLoader.ImportMeshAsync('', '/models/kitchen-and-miscellaneous/', 'Fridge.glb', scene).then((result) => {
      // The Fridge obj was exported in cm/mm, so it's quite large (approx 71x68x202)
      // Center the camera on the imported meshes
      camera.setTarget(result.meshes[0])
    }).catch(console.error)

    engine.runRenderLoop(() => {
      scene.render()
    })

    const onResize = () => engine.resize()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      scene.dispose()
      engine.dispose()
    }
  }, [])

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold">Fridge Test Render</h1>
        <p className="text-sm text-gray-500">Rendered with Draco Compression directly from OBJ</p>
      </div>
      <canvas ref={canvasRef} className="flex-1 w-full h-full outline-none" />
    </div>
  )
}
