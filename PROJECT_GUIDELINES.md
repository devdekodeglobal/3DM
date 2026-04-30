# 3DM | Project Guidelines & Architecture

This document serves as the primary technical reference for the **3DM Booth Designer**. It outlines the core architecture, state management patterns, and the "Sync Loop" that powers the real-time 3D visualization.

---

## 🛠 Technology Stack
- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router).
- **Routing**: File-based routing via `src/routes/`.
- **2D Engine**: [Konva](https://konvajs.org/) (`react-konva`) for the floor plan and elevation editor.
- **3D Engine**: [BabylonJS](https://www.babylonjs.com/) for hardware-accelerated 3D rendering.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a CSS-variable driven theme.
- **Icons**: [Lucide React](https://lucide.dev/).
- **Persistence**: Local Storage (`stall-config` and `stall-elements`).

---

## 📂 Core Architecture & Directories

### 1. The Editor Router (`src/routes/editor.tsx`)
This is the "Brain" of the application. It manages:
- **Global State**: `boothConfig` (footprint, thickness) and `elements` (the JSON tree of all objects).
- **History**: Custom `undo`/`redo` logic using a state stack.
- **Setup Wizard**: Initial multi-step flow for defining booth dimensions before entering the workspace.
- **Split View**: Managing the resizable panels for 2D/3D views.

### 2. 2D Floor Plan (`src/components/editor/Canvas.tsx`)
- Handles the top-down design experience.
- Implements **Snap-to-Grid** (1m major, 0.1m minor).
- Manages selection and drag-and-drop transformations.

### 3. Elevation Editor (`src/components/editor/WallCanvas.tsx`)
- Activated via the "Edit Wall" button in the Properties panel.
- Allows users to design the *face* of a wall (adding doors, windows, banners, lights).
- **Logic**: It modifies the `wallElements` array inside a specific wall element's JSON.

### 4. 3D Engine (`src/components/editor/Preview3D.tsx`)
- A high-performance BabylonJS implementation.
- **Persistent Engine**: The engine and scene initialize once. Updates are handled via a diffing loop.
- **PBR Pipeline**: Uses `DefaultRenderingPipeline` for Bloom, SSAO, and Sharpening.

---

## 🧩 The "Sync Loop" Logic
To ensure 60FPS performance, we never "re-render" the 3D scene from scratch. Instead:
1. **Registry**: We maintain a `meshRegistryRef` (Map) that links Element IDs to BabylonJS Meshes.
2. **Diffing**: A `useEffect` watches the `elements` array.
   - **New ID**: Create mesh/pivot and add to registry.
   - **Missing ID**: Dispose mesh and remove from registry.
   - **Same ID**: Update properties (position, rotation, scaling) directly on the existing BabylonJS object.
3. **Wall Generation**: Walls are generated using **CSG (Constructive Solid Geometry)**. When a wall has `wallElements`, we subtract "cutout" shapes (doors/windows) from the solid wall mesh and parent "mounted" shapes (banners/lights) to it.

---

## ⚠️ Coordinate System & Units
Bridging the 2D (Pixels) and 3D (Meters) worlds requires careful mapping:
- **PPM (Pixels Per Meter)**: `100`. (100px = 1m).
- **X-Axis**: Direct mapping (`el.x / PPM`).
- **Y/Z Inversion**: 
  - Konva Y-axis (top-down) maps to BabylonJS Z-axis (forward-back).
  - **Formula**: `z = boothConfig.depth - (el.y / PPM)`.
  - This ensures the "North" wall in 2D is at the "Back" of the 3D scene.
- **Rotations**: Konva is clockwise degrees; BabylonJS is counter-clockwise radians. We normalize these in the sync loop.

---

## 📝 Development Guidelines

### 1. Adding 3D Models
- **Format**: MUST be binary `.glb`. Avoid `.gltf` (JSON) as it requires multiple files.
- **Pivot Strategy**: Models are loaded into an invisible `pivot` box. We calculate the model's `nativeLength` on load and scale the pivot to match the user's 2D dimensions.
- **Path**: Store in `/public/models/`.

### 2. State Mutability
- Never mutate `elements` directly. Always use the `setElements` or `handleUpdateElement` helpers in `editor.tsx` to ensure history and persistence are triggered.

### 3. Performance
- Use `React.memo` for 2D canvas sub-components (like `WallElements`) to prevent expensive Konva re-renders during drag operations.
- Limit 3D sync frequency (e.g., using a `lastSyncRef` timestamp check) to avoid overwhelming the engine during rapid property slider changes.

### 4. Icons & UI
- Use Lucide icons.
- Follow the custom theme tokens defined in `index.css` (e.g., `var(--brand)`, `var(--lagoon)`).

