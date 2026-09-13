# krafc | Professional Platform for 3D Spaces & Architecture

**krafc** is an advanced, high-performance browser-based 3D design and space planning suite built for architects, booth designers, and interior specialists. It seamlessly bridges precise 2D architectural planning with real-time, hardware-accelerated 3D visualization.

---

## ✨ Key Features

- **🚀 Real-Time 2D/3D Sync**: Powered by BabylonJS, see your 2D architectural floor plan update instantly in hardware-accelerated 3D with realistic shadows and materials.
- **🏗️ Elevation & Wall Face Editor**: Design the faces of walls with doors, windows, shelving, artwork, and spotlights.
- **🚪 Instant Door & Cutout Customization**: Add and customize door opening widths, colors, and swing directions directly from the canvas or properties panel.
- **📏 Architectural Precision**: Snap-to-grid movement (0.1m / 1m grid, PPM = 100), metric measurements, and perimeter wall thickness controls.
- **💡 Photorealistic PBR Rendering**: Physically-based rendering with ambient occlusion (SSAO), bloom, glass transparency, realistic textures (Hardwood, Marble, Brick, Concrete), and auto-rotation.
- **🛸 Dual Camera Modes**: Switch between an intuitive **Orbit Camera** for 360° overview and a **Flight Walkthrough Camera** (WASD) for first-person perspective.
- **📱 Fully Responsive Mobile Workspace**: Dedicated bottom tab bar (`2D Canvas`, `3D View`, `Assets`, `Properties`) and clean slide-over drawers optimized for mobile and tablet screens.
- **☁️ Cloudflare Pages & D1 Database**: Seamless project saving, cloud persistence, and account authentication.
- **🔒 Secure Authentication**: Email/password authentication, transactional email verification (Resend API), password change/reset, account deletion, and Google OAuth 2.0 single sign-on.

---

## 🛠 Technology Stack

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Bundler**: [Vite](https://vitejs.dev/)
- **2D Engine**: [Konva](https://konvajs.org/) (`react-konva`)
- **3D Engine**: [BabylonJS](https://www.babylonjs.com/) (`@babylonjs/core`, `@babylonjs/loaders`, `@babylonjs/materials`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS variable-based design tokens
- **Backend & Serverless**: Cloudflare Pages Functions (`functions/api/*`)
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages (`wrangler pages deploy`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devdekodeglobal/3DM.git
   cd 3DM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional for local auth & D1)
   Copy `.env.example` to `.env` or create `.dev.vars` for Cloudflare functions:
   ```bash
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   RESEND_API_KEY="your-resend-api-key"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start Vite local development server on port `5173` |
| `npm run build` | Build production client bundle into `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build and deploy directly to Cloudflare Pages |
| `npm run test` | Run test suite via Vitest |

---

## 📂 Project Structure

```text
├── functions/               # Cloudflare Pages Functions (Serverless Backend)
│   ├── api/
│   │   ├── auth/            # Auth endpoints (login, register, google oauth, session)
│   │   └── projects/        # D1 project CRUD endpoints
│   └── _auth-utils.ts       # D1 session cookies, hashing & Resend email utilities
├── public/
│   ├── assets/textures/     # Wall & floor textures (hardwood, marble, brick, concrete)
│   └── models/              # Pre-loaded 3D asset library (.glb)
├── src/
│   ├── components/
│   │   ├── editor/          # Core editor components
│   │   │   ├── Canvas.tsx       # 2D floor plan designer (Konva)
│   │   │   ├── WallCanvas.tsx   # Wall elevation & face editor
│   │   │   ├── Preview3D.tsx    # BabylonJS 3D preview engine
│   │   │   ├── Properties.tsx   # Element properties inspector
│   │   │   └── Sidebar.tsx      # Asset & architectural library drawer
│   │   └── ...              # Shared navigation, modal, and branding components
│   ├── lib/                 # Utilities, asset registry, material definitions
│   └── routes/              # TanStack file-based routes (editor, dashboard, legal)
├── wrangler.toml            # Cloudflare Pages & D1 database bindings
└── PROJECT_GUIDELINES.md    # In-depth architectural rules & sync engine guide
```

---

## 🤝 Development & Technical Guidelines

For detailed technical documentation on the BabylonJS 2D/3D sync loop, metric coordinate mappings, state immutability, and Google OAuth setup, see [PROJECT_GUIDELINES.md](./PROJECT_GUIDELINES.md).
