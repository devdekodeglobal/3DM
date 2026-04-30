# 3DM | Advanced 3D Booth Designer

**3DM** is a high-performance, browser-based design suite for creating professional exhibition booths. It bridges the gap between precise 2D floor planning and immersive 3D visualization, offering a seamless workflow for architects and designers.

---

## ✨ Key Features

- **🚀 Real-time 3D Sync**: Powered by BabylonJS, witness your 2D designs come to life instantly in a hardware-accelerated 3D environment.
- **🏗️ Elevation Editor**: Go beyond the floor plan. Design the faces of your walls with doors, windows, banners, and integrated lighting.
- **📏 Precision Tools**: Snap-to-grid movement, precise dimensioning (PPM = 100), and dynamic wall thickness controls.
- **💡 Premium Rendering**: Built-in PBR materials, SSAO (Ambient Occlusion), Bloom, and high-fidelity shadow mapping.
- **🛸 Dual Camera Modes**: Switch between an isometric **Orbit Mode** for overview and a WASD **Flight Mode** for walkthroughs.
- **💾 Local Persistence**: Automatic saving to browser local storage so you never lose your progress.
- **🎨 Custom Assets**: Drag-and-drop 3D models (.glb) and customize materials with ease.

---

## 🛠 Technology Stack

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router)
- **2D Engine**: [Konva](https://konvajs.org/) (Canvas manipulation)
- **3D Engine**: [BabylonJS](https://www.babylonjs.com/) (Real-time PBR rendering)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State**: React State Hooks + Local Storage Persistence

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vansshparikh-arch/3dproj.git
   cd 3dproj
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

- **`src/routes/`**: File-based routing and main application logic (`editor.tsx`).
- **`src/components/editor/`**: 
    - `Canvas.tsx`: The 2D floor plan engine.
    - `WallCanvas.tsx`: The 2D elevation/wall editor.
    - `Preview3D.tsx`: The BabylonJS 3D visualization bridge.
    - `Properties.tsx`: The inspector panel for object modification.
- **`public/models/`**: Repository for `.glb` assets used in the designer.

---

## 📖 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run Vitest suite |

---

## 🤝 Contributing

Contributions are welcome! Please ensure you follow the coding standards outlined in the [PROJECT_GUIDELINES.md](./PROJECT_GUIDELINES.md).

