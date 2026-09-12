# krafc | Project Architecture & Guidelines

This document serves as the primary technical reference and development guide for the **krafc** platform for 3D spaces and architecture. It outlines the core architecture, state management patterns, 2D/3D synchronization loop, backend/database conventions, mobile layout rules, and OAuth configurations.

---

## 🛠 Technology Stack

- **Framework**: React 19 + TypeScript + [TanStack Router](https://tanstack.com/router)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/) with `@tailwindcss/vite`
- **2D Canvas Engine**: [Konva](https://konvajs.org/) (`react-konva`) for floor plan and wall elevation editing
- **3D Engine**: [BabylonJS](https://www.babylonjs.com/) (`@babylonjs/core`, `@babylonjs/loaders`, `@babylonjs/materials`, `@babylonjs/serializers`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS variable-based design tokens (`var(--surface-strong)`, `var(--lagoon)`, `var(--brand)`, `var(--sea-ink)`, etc.)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Serverless**: Cloudflare Pages Functions (`functions/api/*`)
- **Database & Auth**: Cloudflare D1 (SQLite) with session cookies & Google OAuth 2.0
- **Email Service**: Resend API for transactional verification & password reset emails

---

## 📂 Core Architecture & Directories

### 1. Editor Route (`src/routes/editor.tsx`)
The central coordinator of the design workspace:
- **State Management**:
  - `boothConfig`: Dimensions (width, depth, height), perimeter wall configuration, default materials.
  - `elements`: Flat JSON array of all workspace elements (walls, doors, assets, logos, lighting, pillars).
- **Undo / Redo Stack**: State history management for all element transformations.
- **Responsive Workspace Layout**:
  - **Desktop**: Resizable split pane (`splitWidth%`) displaying the 2D floor plan and live 3D preview simultaneously side by side.
  - **Mobile (< 768px)**: Bottom tab navigation (`2D Canvas`, `3D View`, `Assets`, `Properties`) with fixed `z-50` overlay drawers positioned between the 64px site header and 56px bottom navigation bar.
- **Wall Elevation Modal**: Launches `WallCanvas.tsx` modal for editing specific wall faces.

### 2. 2D Floor Plan (`src/components/editor/Canvas.tsx`)
- Top-down floor planning with snap-to-grid (`SNAP = 10` for 0.1m snap).
- Draggable and transformable shapes with real-time bounding limit enforcement.
- Visual display of wall cutouts (doors and windows) along the wall lines.

### 3. Elevation Editor (`src/components/editor/WallCanvas.tsx`)
- Full-face wall editor accessed via Properties or double-clicking a wall.
- Add and position cutouts (doors, windows) and surface mounts (shelves, lights, frames, banners).
- Direct color, dimension, and swing direction controls for door cutouts.

### 4. 3D Preview Engine (`src/components/editor/Preview3D.tsx`)
- Hardware-accelerated BabylonJS canvas with persistent engine & scene.
- Real-time PBR material rendering, shadow generation, and post-processing (Bloom, SSAO, auto-rotation).
- Dual camera controls:
  - **Orbit Camera**: Spherical arc-rotate camera around the center of the space.
  - **Flight / Walkthrough Camera**: First-person WASD walkthrough navigation.

### 5. Properties Inspector (`src/components/editor/Properties.tsx`)
- Context-sensitive sidebar for inspecting and editing properties of selected elements:
  - Wall materials (White Paint, Wood, Brick, Marble, Concrete, Glass, Custom Color).
  - Wall openings & cutouts (doors/windows) with inline color pickers and removal tools.
  - Transform properties (position, dimensions, rotation, elevation offset).
  - Space setup & booth footprint dimension modifications without resetting design contents.

### 6. Cloudflare Pages Backend (`functions/`)
- `functions/api/auth/*`: Session authentication, login, registration, email verification, password reset, and Google OAuth flow.
- `functions/api/projects/*`: D1 database CRUD operations for saved user projects.
- `functions/_auth-utils.ts`: Password hashing, token generation, D1 session cookie management, and transactional email sender.

---

## 🧩 The 2D / 3D "Sync Loop"

To maintain 60 FPS performance, BabylonJS meshes are **never destroyed and recreated unnecessarily**:
1. **Registry Mapping**: `meshRegistryRef` maintains a `Map<string, BABYLON.AbstractMesh>` correlating element IDs to their 3D BabylonJS meshes.
2. **Diffing Lifecycle**:
   - **Removed Element**: Mesh is disposed and deleted from the registry.
   - **New Element**: Mesh is created, materials applied, shadow caster assigned, and added to the registry.
   - **Existing Element**: Updates coordinates, rotations, scale, and materials directly on the live mesh.
3. **Geometry Fingerprinting (`geometryState`)**:
   - For walls with cutouts (doors/windows), CSG (Constructive Solid Geometry) creates holes through the wall box.
   - A `geometryState` fingerprint tracks `w`, `t`, `v`, and cutouts (`t`, `x`, `y`, `w`, `h`, `color`, `swingSide`, `swingDirection`).
   - CSG reconstruction only triggers if the geometry fingerprint changes.
4. **Reactive Material Application (`applyWallMaterial`)**:
   - Both new and existing wall meshes execute `applyWallMaterial` reactively on every state update, ensuring color and texture adjustments reflect live in the 3D viewport without requiring a browser reload.

---

## ⚠️ Units & Coordinate System

Bridging 2D screen pixels and 3D metric space:
- **PPM (Pixels Per Meter)**: `100` (100 pixels = 1.0 meter).
- **Horizontal (X)**: Direct mapping: `3D X = 2D X / PPM`.
- **Vertical (Y to Z inversion)**:
  - 2D Canvas Y (top-to-bottom) maps to 3D Z (back-to-front).
  - **Formula**: `3D Z = boothConfig.depth - (2D Y / PPM)`.
  - Ensures the North wall in 2D sits at the back of the 3D scene.
- **Rotation**:
  - 2D Konva uses clockwise degrees.
  - 3D BabylonJS uses counter-clockwise radians (`BABYLON.Tools.ToRadians`).

---

## 🔒 Authentication & Google OAuth Configuration

### Redirect URI Structure
Google OAuth redirects to `/api/auth/google`. The handler dynamically determines host and protocol:
- Production: `https://krafc.com/api/auth/google`
- Production (www): Automatically canonicalized to `https://krafc.com/api/auth/google` to prevent `redirect_uri_mismatch`.

### Authorized Redirect URIs in Google Cloud Console
When configuring the OAuth 2.0 Web Client in Google Cloud Console, ensure the following URIs are added under **Authorized redirect URIs**:
```text
https://krafc.com/api/auth/google
https://www.krafc.com/api/auth/google
https://3dm.pages.dev/api/auth/google
http://localhost:5173/api/auth/google
http://localhost:8788/api/auth/google
```

---

## 📱 Mobile Responsiveness Guidelines

- Mobile breakpoint is `< 768px` (`md:` in Tailwind).
- Top navigation header is fixed at 64px (`h-16`).
- Mobile tab bar is fixed at bottom (`h-14`, 56px) at `z-50`.
- Mobile drawers (`Sidebar` and `Properties`) must occupy `top-0 pt-16 bottom-14` so they stay strictly between the site header and the bottom tab bar.
- Never bind desktop panel visibility to mobile tab selection state; keep desktop layout driven by `splitWidth` and mobile layout driven by `mobileTab`.

---

## 💻 Development & Code Standards

1. **State Immutability**: Always update element state through immutable copies (`elements.map(...)` or `[...prev, newEl]`). Never mutate element properties in-place.
2. **3D Assets**: Store all 3D assets as binary `.glb` files in `/public/models/`. Avoid `.gltf` with separate bin/texture files.
3. **Design Tokens**: Never hardcode generic hex colors for UI elements. Use the project theme CSS variables (`var(--surface-strong)`, `var(--brand)`, `var(--sea-ink)`, `var(--line)`, `var(--sand)`, etc.).
4. **Verification**: Always run `npx tsc --noEmit` before committing code to ensure TypeScript types and JSX syntax are strictly valid.
