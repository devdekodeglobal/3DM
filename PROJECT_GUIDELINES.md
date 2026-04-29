# 3DM | Project Guidelines & Architecture

This document serves as a reference for the project structure, technology stack, and core logic.

## 🚀 Project Overview
**3DM** is an advanced 3D Booth Designer application. It allows users to design exhibition booths in a 2D floor plan and visualize them in a high-performance, real-time 3D environment.

---

## 🛠 Technology Stack
- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router).
- **2D Editor**: [Konva](https://konvajs.org/) & `react-konva` for the floor plan interactions.
- **3D Engine**: [BabylonJS](https://www.babylonjs.com/) for high-performance 3D rendering.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom theme (using CSS variables).
- **Icons**: [Lucide React](https://lucide.dev/).
- **State Management**: React `useState` and `useEffect` (local storage persistence).

---

## 📂 Project Structure
- `src/routes/`: Contains page definitions using TanStack Router.
  - `editor.tsx`: **Main Application Logic**. Manages the state of the booth and elements.
- `src/components/editor/`: Core editor components.
  - `Canvas.tsx`: The 2D Konva-based floor plan. Handles drag-and-drop, selection, wall thickness visuals, and snapping.
  - `Preview3D.tsx`: The BabylonJS-based 3D preview. Handles real-time synchronization, dual cameras, and asset loading.
  - `Sidebar.tsx`: Library of draggable elements/assets.
  - `Properties.tsx`: UI for editing selected element properties (rotation, dimensions, thickness, materials).
- `public/models/`: **Store your binary .glb files here.**

---

## 🧩 Core Architecture: The "Sync Loop"
The application uses a persistent engine architecture to ensure 60FPS real-time updates:
1. **Persistent Engine**: The BabylonJS engine initializes once when `Preview3D` mounts and sets `isSceneReady`. This prevents race conditions where local storage tries to inject models before the engine is ready.
2. **The Registry System**: The system maintains a `meshRegistryRef` (Map) mapping element IDs to their corresponding BabylonJS meshes/pivots.
3. **The Diffing Loop**: When `elements` JSON updates, the engine does *not* re-render. Instead, a `useEffect` diffs the JSON against the registry:
   - **Removed**: Items no longer in JSON are disposed.
   - **Moved/Scaled**: Existing items have their positions (`mesh.position.x`, `z`) and rotations updated instantly.
   - **Added**: New items are instantiated or loaded asynchronously via `.glb`.

---

## ⚠️ Important Implementation Notes

### Coordinate System & Mapping
To keep the 2D Canvas (Konva) and 3D World (BabylonJS) perfectly mirrored, we handle two major differences:
1. **Scale**: `PPM = 100` (100 pixels in 2D = 1 meter in 3D).
2. **Y-Axis Inversion**: Konva treats the **Top-Left** as `(0,0)`. BabylonJS treats the **Bottom-Left** as `(0,0)`. 
   - We invert the Z-axis mapping during sync: `z = boothConfig.depth - (el.y / PPM)`.
   - The **North Wall** (top of 2D canvas) sits at `z = depth`.
   - The **South Wall** (bottom of 2D canvas) sits at `z = 0`.
   - Rotation is also correspondingly adjusted.

### 3D Asset Loading (The Pivot Wrapper)
All external `.glb` models are loaded using a "Pivot-Wrapped" container strategy.
- Instead of moving the raw `.glb` root node, we create an invisible `pivot` box.
- The `.glb` is attached as a child to the pivot, allowing BabylonJS to handle the model's native coordinate handedness (e.g., `scaling.z = -1`) without our manual position updates overriding it.
- **Dynamic Scaling**: On load, we calculate the `nativeLength` of the model's bounding box and store it in `pivot.metadata`. The Sync Loop uses this native length to dynamically scale the pivot to match the user's 2D dimensions.

### Dual-Camera System
- **Orbit Mode (`ArcRotateCamera`)**: The default view. An isometric-style camera that locks its target to the center of the booth (or the flight cam's last position).
- **Flight Mode (`UniversalCamera`)**: A free-roam WASD camera.
- The system prevents "camera snapping" during browser resizes by tracking `lastBoothDimRef` and only resetting the camera position when the actual booth footprint changes.

### Dynamic Wall Thickness
- Both the structural outer walls (`boothConfig.wallThickness`) and interior partition elements (`el.thickness`) are fully adjustable.
- These updates are reflected in real-time in both the 2D bounding lines and the generated 3D meshes.

---

## 📝 Guidelines for Future Edits
- All external 3D models MUST be in binary `.glb` format. Avoid ascii `.gltf` to prevent loading failures.
- When adding new element types, ensure they are integrated into `Sidebar.tsx`, `Properties.tsx` (for custom controls), and `Preview3D.tsx` (for the generator logic).
- Never destroy the BabylonJS engine to force an update. Always rely on the `meshRegistryRef` diffing loop for modifying existing meshes.
