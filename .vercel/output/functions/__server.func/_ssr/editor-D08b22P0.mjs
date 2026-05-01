import { r as reactExports, j as jsxRuntimeExports, R as React } from "../_libs/react.mjs";
import { c as constantsExports, R as ReactFiberReconciler } from "../_libs/react-reconciler.mjs";
import { s as schedulerExports } from "../_libs/scheduler.mjs";
import { m, x } from "../_libs/its-fine.mjs";
import { ah as Engine, ai as Scene, C as Color4, aj as ArcRotateCamera, T as Tools, c as Vector3, ak as UniversalCamera, H as HemisphericLight, j as Color3, n as DirectionalLight, al as ShadowGenerator, am as DefaultRenderingPipeline, an as SSAO2RenderingPipeline, ao as MeshBuilder, a5 as PBRMaterial, e as Texture, ap as CSG, q as Mesh, i as StandardMaterial, V as Vector4, u as SubMesh, s as MultiMaterial, aq as SceneLoader } from "../_libs/babylonjs__core.mjs";
import "../_libs/babylonjs__loaders.mjs";
import { A as ArrowRight, C as Check, R as RotateCcw, a as RotateCw, T as Trash2, P as PanelLeftClose, S as Settings, b as PanelRightClose, c as Save, B as Box, d as SquarePlus, e as ChevronDown, f as ChevronRight, X, L as Layers, g as Code } from "../_libs/lucide-react.mjs";
import { v as v4 } from "../_libs/uuid.mjs";
import "node:crypto";
const ASSET_DIMENSIONS = {
  "bar_chair_1": { w: 0.8858, h: 1 },
  "cabinet_1": { w: 0.1963, h: 1 },
  "ceramic_pot": { w: 1, h: 1 },
  "chair_1": { w: 0.9917, h: 1 },
  "chair_2": { w: 0.65, h: 1 },
  "coffee_table": { w: 1, h: 0.7457 },
  "dustbin": { w: 0.2421, h: 1 },
  "game_ready_free_livingroom_tv": { w: 1, h: 0.4083 },
  "modern_dining_chair": { w: 0.7792, h: 1 },
  "plant": { w: 1, h: 0.9505 },
  "rectangular_side_coffee_table": { w: 1, h: 0.5 },
  "round_table_1": { w: 1, h: 1 },
  "sink_1": { w: 1, h: 0.6042 },
  "table": { w: 0.2243, h: 1 },
  "table1": { w: 1, h: 0.5455 },
  "table2": { w: 1, h: 0.9212 },
  "tv_lcd": { w: 1, h: 0.5577 },
  "wall_light_1": { w: 1, h: 1 },
  "wall_light_2": { w: 0.4004, h: 1 },
  "wall_light_3": { w: 0.6828, h: 1 }
};
const DEFAULT_ASSET_SIZE_PX = 80;
const CATEGORY_COLORS = {
  Fixtures: { bg: "rgba(245,158,11,0.12)", text: "#92400e", border: "rgba(245,158,11,0.3)", dot: "#f59e0b" },
  Chairs: { bg: "rgba(99,102,241,0.12)", text: "#3730a3", border: "rgba(99,102,241,0.3)", dot: "#6366f1" },
  Bar_Chairs: { bg: "rgba(168,85,247,0.12)", text: "#6b21a8", border: "rgba(168,85,247,0.3)", dot: "#a855f7" },
  Tables: { bg: "rgba(6,182,212,0.12)", text: "#155e75", border: "rgba(6,182,212,0.3)", dot: "#06b6d4" },
  Round_Tables: { bg: "rgba(16,185,129,0.12)", text: "#065f46", border: "rgba(16,185,129,0.3)", dot: "#10b981" },
  Info_Desks: { bg: "rgba(244,63,94,0.12)", text: "#9f1239", border: "rgba(244,63,94,0.3)", dot: "#f43f5e" },
  Electronics: { bg: "rgba(14,165,233,0.12)", text: "#0369a1", border: "rgba(14,165,233,0.3)", dot: "#0ea5e9" },
  Volumetric: { bg: "rgba(236,72,153,0.12)", text: "#831843", border: "rgba(236,72,153,0.3)", dot: "#ec4899" }
};
const categories = [
  {
    folder: "Fixtures",
    name: "Fixtures",
    items: [
      { name: "dustbin", label: "Dustbin 1", initials: "D1" },
      { name: "plant", label: "Plant 1", initials: "P1" },
      { name: "ceramic_pot", label: "Pot 1", initials: "PT" },
      { name: "cabinet_1", label: "Cabinet 1", initials: "C1" },
      { name: "sink_1", label: "Sink 1", initials: "SK" }
    ]
  },
  {
    folder: "Chairs",
    name: "Chairs",
    items: [
      { name: "chair_1", label: "Chair 1", initials: "C1" },
      { name: "chair_2", label: "Chair 2", initials: "C2" },
      { name: "modern_dining_chair", label: "Modern Chair", initials: "MC" }
    ]
  },
  {
    folder: "Bar_Chairs",
    name: "Bar Chairs",
    items: [
      { name: "bar_chair_1", label: "Bar Chair 1", initials: "B1" }
    ]
  },
  {
    folder: "Tables",
    name: "Tables",
    items: [
      { name: "table1", label: "Table 1", initials: "T1" },
      { name: "table2", label: "Table 2", initials: "T2" },
      { name: "coffee_table", label: "Coffee Table", initials: "CT" },
      { name: "rectangular_side_coffee_table", label: "Side Table", initials: "ST" },
      { name: "table", label: "Long Table", initials: "LT" }
    ]
  },
  {
    folder: "Electronics",
    name: "Electronics",
    items: [
      { name: "tv_lcd", label: "LCD TV", initials: "TV" },
      { name: "game_ready_free_livingroom_tv", label: "Modern TV", initials: "MT" }
    ]
  },
  {
    folder: "Round_Tables",
    name: "Round Tables",
    items: [
      { name: "round_table_1", label: "Round Table 1", initials: "R1" }
    ]
  },
  {
    folder: "Info_Desks",
    name: "Info Desks",
    items: [
      { name: "infodesk_1", label: "Info Desk 1", initials: "ID" }
    ]
  }
];
function Sidebar({ addElement }) {
  const [openCategories, setOpenCategories] = reactExports.useState({
    Fixtures: true,
    Chairs: false,
    Bar_Chairs: false,
    Tables: false,
    Round_Tables: false,
    Info_Desks: false,
    Electronics: false
  });
  const toggleCategory = (folder) => {
    setOpenCategories((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };
  const addWall = () => {
    addElement({
      id: v4(),
      type: "wall",
      x: 100,
      y: 100,
      width: 200,
      height: 20,
      thickness: 10,
      rotation: 0,
      fill: "#333333",
      opacity: 1,
      material: "Solid Wall"
    });
  };
  const addAsset = (categoryFolder, assetName) => {
    const dims = ASSET_DIMENSIONS[assetName];
    const base = DEFAULT_ASSET_SIZE_PX;
    const wRatio = dims ? dims.w : 1;
    const hRatio = dims ? dims.h : 1;
    const longest = Math.max(wRatio, hRatio);
    const w = Math.max(20, Math.round(wRatio / longest * base));
    const h = Math.max(20, Math.round(hRatio / longest * base));
    addElement({
      id: v4(),
      type: "asset",
      assetName,
      src: `/assets/${categoryFolder}/${assetName}`,
      x: 150,
      y: 150,
      rotation: 0,
      width: w,
      height: h
    });
  };
  const VOLUMETRIC_PRESETS = [
    { id: "header", label: "Header", initials: "HD", w: 200, h: 60, shape: "box", color: "#ec4899", yOffset: 2.5, verticalScale: 0.15 },
    { id: "slab", label: "Ceiling", initials: "CG", w: 150, h: 150, shape: "box", color: "#c026d3", yOffset: 2.8, verticalScale: 0.08 },
    { id: "beam", label: "Beam", initials: "BM", w: 300, h: 30, shape: "box", color: "#9333ea", yOffset: 2.4, verticalScale: 0.2 },
    { id: "column", label: "Column", initials: "CL", w: 40, h: 40, shape: "cylinder", color: "#7c3aed", yOffset: 0, verticalScale: 2.5 },
    { id: "pill", label: "Pill", initials: "PL", w: 160, h: 60, shape: "pill", color: "#ec4899", yOffset: 2.5, verticalScale: 0.2 }
  ];
  const addVolumetric = (preset) => {
    addElement({
      id: v4(),
      type: "volumetric",
      shape: preset.shape,
      volumetricColor: preset.color,
      x: 200,
      y: 200,
      width: preset.w,
      height: preset.h,
      rotation: 0,
      yOffset: preset.yOffset,
      verticalScale: preset.verticalScale,
      emissive: false,
      logoUrl: null,
      logoSide: "front"
    });
  };
  const add3DLogo = () => {
    addElement({
      id: v4(),
      type: "3d_logo",
      svgData: null,
      x: 250,
      y: 250,
      width: 100,
      height: 100,
      rotation: 0,
      depth: 5,
      // cm
      logoStyle: "matte",
      // matte, chrome, glowing, glass
      logoColor: "#ffffff",
      yOffset: 1.2,
      verticalScale: 1
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 h-full border-r border-[var(--line)] bg-[var(--surface-strong)] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-[var(--line)] shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-[var(--sea-ink)] flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "h-5 w-5 text-[var(--lagoon-deep)]" }),
      "Asset Library"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-2", children: "Core Structures" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: addWall,
            className: "w-full flex items-center justify-center gap-2 p-3 bg-[var(--brand)] text-white rounded-xl font-semibold hover:bg-[var(--brand-h)] transition shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePlus, { className: "h-4 w-4" }),
              " Add Wall"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: add3DLogo,
            className: "w-full mt-2 flex items-center justify-center gap-2 p-3 bg-[var(--lagoon-deep)] text-white rounded-xl font-semibold hover:bg-[var(--palm)] transition shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePlus, { className: "h-4 w-4" }),
              " Add 3D Logo"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)] mt-3 mb-2", children: "Volumetric Blocks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: VOLUMETRIC_PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => addVolumetric(preset),
            className: "flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 hover:scale-105",
            style: { backgroundColor: "rgba(236,72,153,0.08)", borderColor: "rgba(236,72,153,0.3)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-black tracking-tight",
                  style: { backgroundColor: preset.color + "22", color: preset.color, border: `1.5px solid ${preset.color}55` },
                  children: preset.initials
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold uppercase tracking-tight text-center", style: { color: "#831843" }, children: preset.label })
            ]
          },
          preset.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-px bg-[var(--line)] my-2" }),
      categories.map((cat) => {
        const isOpen = openCategories[cat.folder];
        const colors = CATEGORY_COLORS[cat.folder];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-[var(--line)] pb-3 last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => toggleCategory(cat.folder),
              className: "w-full flex items-center justify-between py-2 group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-2 h-2 rounded-full shrink-0",
                      style: { backgroundColor: colors.dot }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)] transition-colors", children: cat.name })
                ] }),
                isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-[var(--sea-ink-soft)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-[var(--sea-ink-soft)]" })
              ]
            }
          ),
          isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-200", children: cat.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => addAsset(cat.folder, item.name),
              className: "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 group",
              style: {
                backgroundColor: colors.bg,
                borderColor: colors.border
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-black tracking-tight border transition-transform duration-150 group-hover:scale-110",
                    style: {
                      backgroundColor: "rgba(255,255,255,0.6)",
                      color: colors.text,
                      borderColor: colors.border
                    },
                    children: item.initials
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[9px] font-bold uppercase tracking-tight text-center leading-tight",
                    style: { color: colors.text },
                    children: item.label
                  }
                )
              ]
            },
            item.name
          )) })
        ] }, cat.folder);
      })
    ] })
  ] });
}
const PI_OVER_180 = Math.PI / 180;
function detectBrowser() {
  return typeof window !== "undefined" && ({}.toString.call(window) === "[object Window]" || {}.toString.call(window) === "[object global]");
}
const glob = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof WorkerGlobalScope !== "undefined" ? self : {};
const Konva$1 = {
  _global: glob,
  version: "10.2.3",
  isBrowser: detectBrowser(),
  isUnminified: /param/.test((function(param) {
  }).toString()),
  dblClickWindow: 400,
  getAngle(angle) {
    return Konva$1.angleDeg ? angle * PI_OVER_180 : angle;
  },
  enableTrace: false,
  pointerEventsEnabled: true,
  autoDrawEnabled: true,
  hitOnDragEnabled: false,
  capturePointerEventsEnabled: false,
  _mouseListenClick: false,
  _touchListenClick: false,
  _pointerListenClick: false,
  _mouseInDblClickWindow: false,
  _touchInDblClickWindow: false,
  _pointerInDblClickWindow: false,
  _mouseDblClickPointerId: null,
  _touchDblClickPointerId: null,
  _pointerDblClickPointerId: null,
  _renderBackend: "web",
  legacyTextRendering: false,
  pixelRatio: typeof window !== "undefined" && window.devicePixelRatio || 1,
  dragDistance: 3,
  angleDeg: true,
  showWarnings: true,
  dragButtons: [0, 1],
  isDragging() {
    return Konva$1["DD"].isDragging;
  },
  isTransforming() {
    var _a, _b;
    return (_b = (_a = Konva$1["Transformer"]) === null || _a === void 0 ? void 0 : _a.isTransforming()) !== null && _b !== void 0 ? _b : false;
  },
  isDragReady() {
    return !!Konva$1["DD"].node;
  },
  releaseCanvasOnDestroy: true,
  document: glob.document,
  _injectGlobal(Konva2) {
    if (typeof glob.Konva !== "undefined") {
      console.error("Several Konva instances detected. It is not recommended to use multiple Konva instances in the same environment.");
    }
    glob.Konva = Konva2;
  }
};
const _registerNode = (NodeClass) => {
  Konva$1[NodeClass.prototype.getClassName()] = NodeClass;
};
Konva$1._injectGlobal(Konva$1);
const NODE_ERROR = `Konva.js unsupported environment.

Looks like you are trying to use Konva.js in Node.js environment. because "document" object is undefined.

To use Konva.js in Node.js environment, you need to use the "canvas-backend" or "skia-backend" module.

bash: npm install canvas
js: import "konva/canvas-backend";

or

bash: npm install skia-canvas
js: import "konva/skia-backend";
`;
const ensureBrowser = () => {
  if (typeof document === "undefined") {
    throw new Error(NODE_ERROR);
  }
};
class Transform {
  constructor(m2 = [1, 0, 0, 1, 0, 0]) {
    this.dirty = false;
    this.m = m2 && m2.slice() || [1, 0, 0, 1, 0, 0];
  }
  reset() {
    this.m[0] = 1;
    this.m[1] = 0;
    this.m[2] = 0;
    this.m[3] = 1;
    this.m[4] = 0;
    this.m[5] = 0;
  }
  copy() {
    return new Transform(this.m);
  }
  copyInto(tr) {
    tr.m[0] = this.m[0];
    tr.m[1] = this.m[1];
    tr.m[2] = this.m[2];
    tr.m[3] = this.m[3];
    tr.m[4] = this.m[4];
    tr.m[5] = this.m[5];
  }
  point(point) {
    const m2 = this.m;
    return {
      x: m2[0] * point.x + m2[2] * point.y + m2[4],
      y: m2[1] * point.x + m2[3] * point.y + m2[5]
    };
  }
  translate(x2, y) {
    this.m[4] += this.m[0] * x2 + this.m[2] * y;
    this.m[5] += this.m[1] * x2 + this.m[3] * y;
    return this;
  }
  scale(sx, sy) {
    this.m[0] *= sx;
    this.m[1] *= sx;
    this.m[2] *= sy;
    this.m[3] *= sy;
    return this;
  }
  rotate(rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const m11 = this.m[0] * c + this.m[2] * s;
    const m12 = this.m[1] * c + this.m[3] * s;
    const m21 = this.m[0] * -s + this.m[2] * c;
    const m22 = this.m[1] * -s + this.m[3] * c;
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    return this;
  }
  getTranslation() {
    return {
      x: this.m[4],
      y: this.m[5]
    };
  }
  skew(sx, sy) {
    const m11 = this.m[0] + this.m[2] * sy;
    const m12 = this.m[1] + this.m[3] * sy;
    const m21 = this.m[2] + this.m[0] * sx;
    const m22 = this.m[3] + this.m[1] * sx;
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    return this;
  }
  multiply(matrix) {
    const m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
    const m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
    const m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
    const m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
    const dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
    const dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    this.m[4] = dx;
    this.m[5] = dy;
    return this;
  }
  invert() {
    const d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
    const m0 = this.m[3] * d;
    const m1 = -this.m[1] * d;
    const m2 = -this.m[2] * d;
    const m3 = this.m[0] * d;
    const m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
    const m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    this.m[0] = m0;
    this.m[1] = m1;
    this.m[2] = m2;
    this.m[3] = m3;
    this.m[4] = m4;
    this.m[5] = m5;
    return this;
  }
  getMatrix() {
    return this.m;
  }
  decompose() {
    const a = this.m[0];
    const b = this.m[1];
    const c = this.m[2];
    const d = this.m[3];
    const e = this.m[4];
    const f = this.m[5];
    const delta = a * d - b * c;
    const result = {
      x: e,
      y: f,
      rotation: 0,
      scaleX: 0,
      scaleY: 0,
      skewX: 0,
      skewY: 0
    };
    if (a != 0 || b != 0) {
      const r = Math.sqrt(a * a + b * b);
      result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
      result.scaleX = r;
      result.scaleY = delta / r;
      result.skewX = (a * c + b * d) / delta;
      result.skewY = 0;
    } else if (c != 0 || d != 0) {
      const s = Math.sqrt(c * c + d * d);
      result.rotation = Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
      result.scaleX = delta / s;
      result.scaleY = s;
      result.skewX = 0;
      result.skewY = (a * c + b * d) / delta;
    } else ;
    result.rotation = Util._getRotation(result.rotation);
    return result;
  }
}
const OBJECT_ARRAY = "[object Array]", OBJECT_NUMBER = "[object Number]", OBJECT_STRING = "[object String]", OBJECT_BOOLEAN = "[object Boolean]", PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = "#", EMPTY_STRING$1 = "", ZERO = "0", KONVA_WARNING = "Konva warning: ", KONVA_ERROR = "Konva error: ", RGB_PAREN = "rgb(", COLORS = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 132, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 255, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 203],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [119, 128, 144],
  slategrey: [119, 128, 144],
  snow: [255, 255, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  transparent: [255, 255, 255, 0],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 5]
}, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
let animQueue = [];
let _isCanvasFarblingActive = null;
const req = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame || function(f) {
  setTimeout(f, 16);
};
const Util = {
  _isElement(obj) {
    return !!(obj && obj.nodeType == 1);
  },
  _isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  },
  _isPlainObject(obj) {
    return !!obj && obj.constructor === Object;
  },
  _isArray(obj) {
    return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
  },
  _isNumber(obj) {
    return Object.prototype.toString.call(obj) === OBJECT_NUMBER && !isNaN(obj) && isFinite(obj);
  },
  _isString(obj) {
    return Object.prototype.toString.call(obj) === OBJECT_STRING;
  },
  _isBoolean(obj) {
    return Object.prototype.toString.call(obj) === OBJECT_BOOLEAN;
  },
  isObject(val) {
    return val instanceof Object;
  },
  isValidSelector(selector) {
    if (typeof selector !== "string") {
      return false;
    }
    const firstChar = selector[0];
    return firstChar === "#" || firstChar === "." || firstChar === firstChar.toUpperCase();
  },
  _sign(number) {
    if (number === 0) {
      return 1;
    }
    if (number > 0) {
      return 1;
    } else {
      return -1;
    }
  },
  requestAnimFrame(callback) {
    animQueue.push(callback);
    if (animQueue.length === 1) {
      req(function() {
        const queue = animQueue;
        animQueue = [];
        queue.forEach(function(cb) {
          cb();
        });
      });
    }
  },
  createCanvasElement() {
    ensureBrowser();
    const canvas = document.createElement("canvas");
    try {
      canvas.style = canvas.style || {};
    } catch (e) {
    }
    return canvas;
  },
  createImageElement() {
    ensureBrowser();
    return document.createElement("img");
  },
  _isInDocument(el) {
    while (el = el.parentNode) {
      if (el == document) {
        return true;
      }
    }
    return false;
  },
  _urlToImage(url, callback) {
    const imageObj = Util.createImageElement();
    imageObj.onload = function() {
      callback(imageObj);
    };
    imageObj.src = url;
  },
  _rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  _hexToRgb(hex) {
    hex = hex.replace(HASH, EMPTY_STRING$1);
    const bigint = parseInt(hex, 16);
    return {
      r: bigint >> 16 & 255,
      g: bigint >> 8 & 255,
      b: bigint & 255
    };
  },
  getRandomColor() {
    let randColor = (Math.random() * 16777215 << 0).toString(16);
    while (randColor.length < 6) {
      randColor = ZERO + randColor;
    }
    return HASH + randColor;
  },
  isCanvasFarblingActive() {
    if (_isCanvasFarblingActive !== null) {
      return _isCanvasFarblingActive;
    }
    if (typeof document === "undefined") {
      _isCanvasFarblingActive = false;
      return false;
    }
    const c = this.createCanvasElement();
    c.width = 10;
    c.height = 10;
    const ctx = c.getContext("2d", {
      willReadFrequently: true
    });
    ctx.clearRect(0, 0, 10, 10);
    ctx.fillStyle = "#282828";
    ctx.fillRect(0, 0, 10, 10);
    const d = ctx.getImageData(0, 0, 10, 10).data;
    let isFarbling = false;
    for (let i = 0; i < 100; i++) {
      if (d[i * 4] !== 40 || d[i * 4 + 1] !== 40 || d[i * 4 + 2] !== 40 || d[i * 4 + 3] !== 255) {
        isFarbling = true;
        break;
      }
    }
    _isCanvasFarblingActive = isFarbling;
    this.releaseCanvas(c);
    return _isCanvasFarblingActive;
  },
  getHitColor() {
    const color = this.getRandomColor();
    return this.isCanvasFarblingActive() ? this.getSnappedHexColor(color) : color;
  },
  getHitColorKey(r, g, b) {
    if (this.isCanvasFarblingActive()) {
      r = Math.round(r / 5) * 5;
      g = Math.round(g / 5) * 5;
      b = Math.round(b / 5) * 5;
    }
    return HASH + this._rgbToHex(r, g, b);
  },
  getSnappedHexColor(hex) {
    const rgb = this._hexToRgb(hex);
    return HASH + this._rgbToHex(Math.round(rgb.r / 5) * 5, Math.round(rgb.g / 5) * 5, Math.round(rgb.b / 5) * 5);
  },
  getRGB(color) {
    let rgb;
    if (color in COLORS) {
      rgb = COLORS[color];
      return {
        r: rgb[0],
        g: rgb[1],
        b: rgb[2]
      };
    } else if (color[0] === HASH) {
      return this._hexToRgb(color.substring(1));
    } else if (color.substr(0, 4) === RGB_PAREN) {
      rgb = RGB_REGEX.exec(color.replace(/ /g, ""));
      return {
        r: parseInt(rgb[1], 10),
        g: parseInt(rgb[2], 10),
        b: parseInt(rgb[3], 10)
      };
    } else {
      return {
        r: 0,
        g: 0,
        b: 0
      };
    }
  },
  colorToRGBA(str) {
    str = str || "black";
    return Util._namedColorToRBA(str) || Util._hex3ColorToRGBA(str) || Util._hex4ColorToRGBA(str) || Util._hex6ColorToRGBA(str) || Util._hex8ColorToRGBA(str) || Util._rgbColorToRGBA(str) || Util._rgbaColorToRGBA(str) || Util._hslColorToRGBA(str);
  },
  _namedColorToRBA(str) {
    const c = COLORS[str.toLowerCase()];
    if (!c) {
      return null;
    }
    return {
      r: c[0],
      g: c[1],
      b: c[2],
      a: 1
    };
  },
  _rgbColorToRGBA(str) {
    if (str.indexOf("rgb(") === 0) {
      str = str.match(/rgb\(([^)]+)\)/)[1];
      const parts = str.split(/ *, */).map(Number);
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: 1
      };
    }
  },
  _rgbaColorToRGBA(str) {
    if (str.indexOf("rgba(") === 0) {
      str = str.match(/rgba\(([^)]+)\)/)[1];
      const parts = str.split(/ *, */).map((n, index) => {
        if (n.slice(-1) === "%") {
          return index === 3 ? parseInt(n) / 100 : parseInt(n) / 100 * 255;
        }
        return Number(n);
      });
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: parts[3]
      };
    }
  },
  _hex8ColorToRGBA(str) {
    if (str[0] === "#" && str.length === 9) {
      return {
        r: parseInt(str.slice(1, 3), 16),
        g: parseInt(str.slice(3, 5), 16),
        b: parseInt(str.slice(5, 7), 16),
        a: parseInt(str.slice(7, 9), 16) / 255
      };
    }
  },
  _hex6ColorToRGBA(str) {
    if (str[0] === "#" && str.length === 7) {
      return {
        r: parseInt(str.slice(1, 3), 16),
        g: parseInt(str.slice(3, 5), 16),
        b: parseInt(str.slice(5, 7), 16),
        a: 1
      };
    }
  },
  _hex4ColorToRGBA(str) {
    if (str[0] === "#" && str.length === 5) {
      return {
        r: parseInt(str[1] + str[1], 16),
        g: parseInt(str[2] + str[2], 16),
        b: parseInt(str[3] + str[3], 16),
        a: parseInt(str[4] + str[4], 16) / 255
      };
    }
  },
  _hex3ColorToRGBA(str) {
    if (str[0] === "#" && str.length === 4) {
      return {
        r: parseInt(str[1] + str[1], 16),
        g: parseInt(str[2] + str[2], 16),
        b: parseInt(str[3] + str[3], 16),
        a: 1
      };
    }
  },
  _hslColorToRGBA(str) {
    if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
      const [_, ...hsl] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str);
      const h = Number(hsl[0]) / 360;
      const s = Number(hsl[1]) / 100;
      const l = Number(hsl[2]) / 100;
      let t2;
      let t3;
      let val;
      if (s === 0) {
        val = l * 255;
        return {
          r: Math.round(val),
          g: Math.round(val),
          b: Math.round(val),
          a: 1
        };
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return {
        r: Math.round(rgb[0]),
        g: Math.round(rgb[1]),
        b: Math.round(rgb[2]),
        a: 1
      };
    }
  },
  haveIntersection(r1, r2) {
    return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
  },
  cloneObject(obj) {
    const retObj = {};
    for (const key in obj) {
      if (this._isPlainObject(obj[key])) {
        retObj[key] = this.cloneObject(obj[key]);
      } else if (this._isArray(obj[key])) {
        retObj[key] = this.cloneArray(obj[key]);
      } else {
        retObj[key] = obj[key];
      }
    }
    return retObj;
  },
  cloneArray(arr) {
    return arr.slice(0);
  },
  degToRad(deg) {
    return deg * PI_OVER_DEG180;
  },
  radToDeg(rad) {
    return rad * DEG180_OVER_PI;
  },
  _degToRad(deg) {
    Util.warn("Util._degToRad is removed. Please use public Util.degToRad instead.");
    return Util.degToRad(deg);
  },
  _radToDeg(rad) {
    Util.warn("Util._radToDeg is removed. Please use public Util.radToDeg instead.");
    return Util.radToDeg(rad);
  },
  _getRotation(radians) {
    return Konva$1.angleDeg ? Util.radToDeg(radians) : radians;
  },
  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  throw(str) {
    throw new Error(KONVA_ERROR + str);
  },
  error(str) {
    console.error(KONVA_ERROR + str);
  },
  warn(str) {
    if (!Konva$1.showWarnings) {
      return;
    }
    console.warn(KONVA_WARNING + str);
  },
  each(obj, func) {
    for (const key in obj) {
      func(key, obj[key]);
    }
  },
  _inRange(val, left, right) {
    return left <= val && val < right;
  },
  _getProjectionToSegment(x1, y1, x2, y2, x3, y3) {
    let x4, y, dist;
    const pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    if (pd2 == 0) {
      x4 = x1;
      y = y1;
      dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
    } else {
      const u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
      if (u < 0) {
        x4 = x1;
        y = y1;
        dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
      } else if (u > 1) {
        x4 = x2;
        y = y2;
        dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
      } else {
        x4 = x1 + u * (x2 - x1);
        y = y1 + u * (y2 - y1);
        dist = (x4 - x3) * (x4 - x3) + (y - y3) * (y - y3);
      }
    }
    return [x4, y, dist];
  },
  _getProjectionToLine(pt, line, isClosed) {
    const pc = Util.cloneObject(pt);
    let dist = Number.MAX_VALUE;
    line.forEach(function(p1, i) {
      if (!isClosed && i === line.length - 1) {
        return;
      }
      const p2 = line[(i + 1) % line.length];
      const proj = Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
      const px = proj[0], py = proj[1], pdist = proj[2];
      if (pdist < dist) {
        pc.x = px;
        pc.y = py;
        dist = pdist;
      }
    });
    return pc;
  },
  _prepareArrayForTween(startArray, endArray, isClosed) {
    const start = [], end = [];
    if (startArray.length > endArray.length) {
      const temp = endArray;
      endArray = startArray;
      startArray = temp;
    }
    for (let n = 0; n < startArray.length; n += 2) {
      start.push({
        x: startArray[n],
        y: startArray[n + 1]
      });
    }
    for (let n = 0; n < endArray.length; n += 2) {
      end.push({
        x: endArray[n],
        y: endArray[n + 1]
      });
    }
    const newStart = [];
    end.forEach(function(point) {
      const pr = Util._getProjectionToLine(point, start, isClosed);
      newStart.push(pr.x);
      newStart.push(pr.y);
    });
    return newStart;
  },
  _prepareToStringify(obj) {
    let desc;
    obj.visitedByCircularReferenceRemoval = true;
    for (const key in obj) {
      if (!(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == "object")) {
        continue;
      }
      desc = Object.getOwnPropertyDescriptor(obj, key);
      if (obj[key].visitedByCircularReferenceRemoval || Util._isElement(obj[key])) {
        if (desc.configurable) {
          delete obj[key];
        } else {
          return null;
        }
      } else if (Util._prepareToStringify(obj[key]) === null) {
        if (desc.configurable) {
          delete obj[key];
        } else {
          return null;
        }
      }
    }
    delete obj.visitedByCircularReferenceRemoval;
    return obj;
  },
  _assign(target, source) {
    for (const key in source) {
      target[key] = source[key];
    }
    return target;
  },
  _getFirstPointerId(evt) {
    if (!evt.touches) {
      return evt.pointerId || 999;
    } else {
      return evt.changedTouches[0].identifier;
    }
  },
  releaseCanvas(...canvases) {
    if (!Konva$1.releaseCanvasOnDestroy)
      return;
    canvases.forEach((c) => {
      c.width = 0;
      c.height = 0;
    });
  },
  drawRoundedRectPath(context, width, height, cornerRadius) {
    let xOrigin = width < 0 ? width : 0;
    let yOrigin = height < 0 ? height : 0;
    width = Math.abs(width);
    height = Math.abs(height);
    let topLeft = 0;
    let topRight = 0;
    let bottomLeft = 0;
    let bottomRight = 0;
    if (typeof cornerRadius === "number") {
      topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
    } else {
      topLeft = Math.min(cornerRadius[0] || 0, width / 2, height / 2);
      topRight = Math.min(cornerRadius[1] || 0, width / 2, height / 2);
      bottomRight = Math.min(cornerRadius[2] || 0, width / 2, height / 2);
      bottomLeft = Math.min(cornerRadius[3] || 0, width / 2, height / 2);
    }
    context.moveTo(xOrigin + topLeft, yOrigin);
    context.lineTo(xOrigin + width - topRight, yOrigin);
    context.arc(xOrigin + width - topRight, yOrigin + topRight, topRight, Math.PI * 3 / 2, 0, false);
    context.lineTo(xOrigin + width, yOrigin + height - bottomRight);
    context.arc(xOrigin + width - bottomRight, yOrigin + height - bottomRight, bottomRight, 0, Math.PI / 2, false);
    context.lineTo(xOrigin + bottomLeft, yOrigin + height);
    context.arc(xOrigin + bottomLeft, yOrigin + height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
    context.lineTo(xOrigin, yOrigin + topLeft);
    context.arc(xOrigin + topLeft, yOrigin + topLeft, topLeft, Math.PI, Math.PI * 3 / 2, false);
  },
  drawRoundedPolygonPath(context, points, sides, radius, cornerRadius) {
    radius = Math.abs(radius);
    for (let i = 0; i < sides; i++) {
      const prev = points[(i - 1 + sides) % sides];
      const curr = points[i];
      const next = points[(i + 1) % sides];
      const vec1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const vec2 = { x: next.x - curr.x, y: next.y - curr.y };
      const len1 = Math.hypot(vec1.x, vec1.y);
      const len2 = Math.hypot(vec2.x, vec2.y);
      let currCornerRadius;
      if (typeof cornerRadius === "number") {
        currCornerRadius = cornerRadius;
      } else {
        currCornerRadius = i < cornerRadius.length ? cornerRadius[i] : 0;
      }
      const maxCornerRadius = radius * Math.cos(Math.PI / sides);
      currCornerRadius = maxCornerRadius * Math.min(1, currCornerRadius / radius * 2);
      const normalVec1 = { x: vec1.x / len1, y: vec1.y / len1 };
      const normalVec2 = { x: vec2.x / len2, y: vec2.y / len2 };
      const p1 = {
        x: curr.x - normalVec1.x * currCornerRadius,
        y: curr.y - normalVec1.y * currCornerRadius
      };
      const p2 = {
        x: curr.x + normalVec2.x * currCornerRadius,
        y: curr.y + normalVec2.y * currCornerRadius
      };
      if (i === 0) {
        context.moveTo(p1.x, p1.y);
      } else {
        context.lineTo(p1.x, p1.y);
      }
      context.arcTo(curr.x, curr.y, p2.x, p2.y, currCornerRadius);
    }
  }
};
function simplifyArray(arr) {
  const retArr = [], len = arr.length, util = Util;
  for (let n = 0; n < len; n++) {
    let val = arr[n];
    if (util._isNumber(val)) {
      val = Math.round(val * 1e3) / 1e3;
    } else if (!util._isString(val)) {
      val = val + "";
    }
    retArr.push(val);
  }
  return retArr;
}
const COMMA = ",", OPEN_PAREN = "(", CLOSE_PAREN = ")", OPEN_PAREN_BRACKET = "([", CLOSE_BRACKET_PAREN = "])", SEMICOLON = ";", DOUBLE_PAREN = "()", EQUALS = "=", CONTEXT_METHODS = [
  "arc",
  "arcTo",
  "beginPath",
  "bezierCurveTo",
  "clearRect",
  "clip",
  "closePath",
  "createLinearGradient",
  "createPattern",
  "createRadialGradient",
  "drawImage",
  "ellipse",
  "fill",
  "fillText",
  "getImageData",
  "createImageData",
  "lineTo",
  "moveTo",
  "putImageData",
  "quadraticCurveTo",
  "rect",
  "roundRect",
  "restore",
  "rotate",
  "save",
  "scale",
  "setLineDash",
  "setTransform",
  "stroke",
  "strokeText",
  "transform",
  "translate"
];
const CONTEXT_PROPERTIES = [
  "fillStyle",
  "strokeStyle",
  "shadowColor",
  "shadowBlur",
  "shadowOffsetX",
  "shadowOffsetY",
  "letterSpacing",
  "lineCap",
  "lineDashOffset",
  "lineJoin",
  "lineWidth",
  "miterLimit",
  "direction",
  "font",
  "textAlign",
  "textBaseline",
  "globalAlpha",
  "globalCompositeOperation",
  "imageSmoothingEnabled",
  "filter"
];
const traceArrMax = 100;
let _cssFiltersSupported = null;
function isCSSFiltersSupported() {
  if (_cssFiltersSupported !== null) {
    return _cssFiltersSupported;
  }
  try {
    const canvas = Util.createCanvasElement();
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      _cssFiltersSupported = false;
      return false;
    }
    return !!ctx && "filter" in ctx;
  } catch (e) {
    _cssFiltersSupported = false;
    return false;
  }
}
class Context {
  constructor(canvas) {
    this.canvas = canvas;
    if (Konva$1.enableTrace) {
      this.traceArr = [];
      this._enableTrace();
    }
  }
  fillShape(shape) {
    if (shape.fillEnabled()) {
      this._fill(shape);
    }
  }
  _fill(shape) {
  }
  strokeShape(shape) {
    if (shape.hasStroke()) {
      this._stroke(shape);
    }
  }
  _stroke(shape) {
  }
  fillStrokeShape(shape) {
    if (shape.attrs.fillAfterStrokeEnabled) {
      this.strokeShape(shape);
      this.fillShape(shape);
    } else {
      this.fillShape(shape);
      this.strokeShape(shape);
    }
  }
  getTrace(relaxed, rounded) {
    let traceArr = this.traceArr, len = traceArr.length, str = "", n, trace, method, args;
    for (n = 0; n < len; n++) {
      trace = traceArr[n];
      method = trace.method;
      if (method) {
        args = trace.args;
        str += method;
        if (relaxed) {
          str += DOUBLE_PAREN;
        } else {
          if (Util._isArray(args[0])) {
            str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
          } else {
            if (rounded) {
              args = args.map((a) => typeof a === "number" ? Math.floor(a) : a);
            }
            str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
          }
        }
      } else {
        str += trace.property;
        if (!relaxed) {
          str += EQUALS + trace.val;
        }
      }
      str += SEMICOLON;
    }
    return str;
  }
  clearTrace() {
    this.traceArr = [];
  }
  _trace(str) {
    let traceArr = this.traceArr, len;
    traceArr.push(str);
    len = traceArr.length;
    if (len >= traceArrMax) {
      traceArr.shift();
    }
  }
  reset() {
    const pixelRatio = this.getCanvas().getPixelRatio();
    this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
  }
  getCanvas() {
    return this.canvas;
  }
  clear(bounds) {
    const canvas = this.getCanvas();
    if (bounds) {
      this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
    } else {
      this.clearRect(0, 0, canvas.getWidth() / canvas.pixelRatio, canvas.getHeight() / canvas.pixelRatio);
    }
  }
  _applyLineCap(shape) {
    const lineCap = shape.attrs.lineCap;
    if (lineCap) {
      this.setAttr("lineCap", lineCap);
    }
  }
  _applyOpacity(shape) {
    const absOpacity = shape.getAbsoluteOpacity();
    if (absOpacity !== 1) {
      this.setAttr("globalAlpha", absOpacity);
    }
  }
  _applyLineJoin(shape) {
    const lineJoin = shape.attrs.lineJoin;
    if (lineJoin) {
      this.setAttr("lineJoin", lineJoin);
    }
  }
  _applyMiterLimit(shape) {
    const miterLimit = shape.attrs.miterLimit;
    if (miterLimit != null) {
      this.setAttr("miterLimit", miterLimit);
    }
  }
  setAttr(attr, val) {
    this._context[attr] = val;
  }
  arc(x2, y, radius, startAngle, endAngle, counterClockwise) {
    this._context.arc(x2, y, radius, startAngle, endAngle, counterClockwise);
  }
  arcTo(x1, y1, x2, y2, radius) {
    this._context.arcTo(x1, y1, x2, y2, radius);
  }
  beginPath() {
    this._context.beginPath();
  }
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y) {
    this._context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y);
  }
  clearRect(x2, y, width, height) {
    this._context.clearRect(x2, y, width, height);
  }
  clip(...args) {
    this._context.clip.apply(this._context, args);
  }
  closePath() {
    this._context.closePath();
  }
  createImageData(width, height) {
    const a = arguments;
    if (a.length === 2) {
      return this._context.createImageData(width, height);
    } else if (a.length === 1) {
      return this._context.createImageData(width);
    }
  }
  createLinearGradient(x0, y0, x1, y1) {
    return this._context.createLinearGradient(x0, y0, x1, y1);
  }
  createPattern(image, repetition) {
    return this._context.createPattern(image, repetition);
  }
  createRadialGradient(x0, y0, r0, x1, y1, r1) {
    return this._context.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }
  drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    const a = arguments, _context = this._context;
    if (a.length === 3) {
      _context.drawImage(image, sx, sy);
    } else if (a.length === 5) {
      _context.drawImage(image, sx, sy, sWidth, sHeight);
    } else if (a.length === 9) {
      _context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
  }
  ellipse(x2, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise) {
    this._context.ellipse(x2, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
  }
  isPointInPath(x2, y, path, fillRule) {
    if (path) {
      return this._context.isPointInPath(path, x2, y, fillRule);
    }
    return this._context.isPointInPath(x2, y, fillRule);
  }
  fill(...args) {
    this._context.fill.apply(this._context, args);
  }
  fillRect(x2, y, width, height) {
    this._context.fillRect(x2, y, width, height);
  }
  strokeRect(x2, y, width, height) {
    this._context.strokeRect(x2, y, width, height);
  }
  fillText(text, x2, y, maxWidth) {
    if (maxWidth) {
      this._context.fillText(text, x2, y, maxWidth);
    } else {
      this._context.fillText(text, x2, y);
    }
  }
  measureText(text) {
    return this._context.measureText(text);
  }
  getImageData(sx, sy, sw, sh) {
    return this._context.getImageData(sx, sy, sw, sh);
  }
  lineTo(x2, y) {
    this._context.lineTo(x2, y);
  }
  moveTo(x2, y) {
    this._context.moveTo(x2, y);
  }
  rect(x2, y, width, height) {
    this._context.rect(x2, y, width, height);
  }
  roundRect(x2, y, width, height, radii) {
    this._context.roundRect(x2, y, width, height, radii);
  }
  putImageData(imageData, dx, dy) {
    this._context.putImageData(imageData, dx, dy);
  }
  quadraticCurveTo(cpx, cpy, x2, y) {
    this._context.quadraticCurveTo(cpx, cpy, x2, y);
  }
  restore() {
    this._context.restore();
  }
  rotate(angle) {
    this._context.rotate(angle);
  }
  save() {
    this._context.save();
  }
  scale(x2, y) {
    this._context.scale(x2, y);
  }
  setLineDash(segments) {
    if (this._context.setLineDash) {
      this._context.setLineDash(segments);
    } else if ("mozDash" in this._context) {
      this._context["mozDash"] = segments;
    } else if ("webkitLineDash" in this._context) {
      this._context["webkitLineDash"] = segments;
    }
  }
  getLineDash() {
    return this._context.getLineDash();
  }
  setTransform(a, b, c, d, e, f) {
    this._context.setTransform(a, b, c, d, e, f);
  }
  stroke(path2d) {
    if (path2d) {
      this._context.stroke(path2d);
    } else {
      this._context.stroke();
    }
  }
  strokeText(text, x2, y, maxWidth) {
    this._context.strokeText(text, x2, y, maxWidth);
  }
  transform(a, b, c, d, e, f) {
    this._context.transform(a, b, c, d, e, f);
  }
  translate(x2, y) {
    this._context.translate(x2, y);
  }
  _enableTrace() {
    let that = this, len = CONTEXT_METHODS.length, origSetter = this.setAttr, n, args;
    const func = function(methodName) {
      let origMethod = that[methodName], ret;
      that[methodName] = function() {
        args = simplifyArray(Array.prototype.slice.call(arguments, 0));
        ret = origMethod.apply(that, arguments);
        that._trace({
          method: methodName,
          args
        });
        return ret;
      };
    };
    for (n = 0; n < len; n++) {
      func(CONTEXT_METHODS[n]);
    }
    that.setAttr = function() {
      origSetter.apply(that, arguments);
      const prop = arguments[0];
      let val = arguments[1];
      if (prop === "shadowOffsetX" || prop === "shadowOffsetY" || prop === "shadowBlur") {
        val = val / this.canvas.getPixelRatio();
      }
      that._trace({
        property: prop,
        val
      });
    };
  }
  _applyGlobalCompositeOperation(node) {
    const op = node.attrs.globalCompositeOperation;
    const def = !op || op === "source-over";
    if (!def) {
      this.setAttr("globalCompositeOperation", op);
    }
  }
}
CONTEXT_PROPERTIES.forEach(function(prop) {
  Object.defineProperty(Context.prototype, prop, {
    get() {
      return this._context[prop];
    },
    set(val) {
      this._context[prop] = val;
    }
  });
});
class SceneContext extends Context {
  constructor(canvas, { willReadFrequently = false } = {}) {
    super(canvas);
    this._context = canvas._canvas.getContext("2d", {
      willReadFrequently
    });
  }
  _fillColor(shape) {
    const fill = shape.fill();
    this.setAttr("fillStyle", fill);
    shape._fillFunc(this);
  }
  _fillPattern(shape) {
    this.setAttr("fillStyle", shape._getFillPattern());
    shape._fillFunc(this);
  }
  _fillLinearGradient(shape) {
    const grd = shape._getLinearGradient();
    if (grd) {
      this.setAttr("fillStyle", grd);
      shape._fillFunc(this);
    }
  }
  _fillRadialGradient(shape) {
    const grd = shape._getRadialGradient();
    if (grd) {
      this.setAttr("fillStyle", grd);
      shape._fillFunc(this);
    }
  }
  _fill(shape) {
    const hasColor = shape.fill(), fillPriority = shape.getFillPriority();
    if (hasColor && fillPriority === "color") {
      this._fillColor(shape);
      return;
    }
    const hasPattern = shape.getFillPatternImage();
    if (hasPattern && fillPriority === "pattern") {
      this._fillPattern(shape);
      return;
    }
    const hasLinearGradient = shape.getFillLinearGradientColorStops();
    if (hasLinearGradient && fillPriority === "linear-gradient") {
      this._fillLinearGradient(shape);
      return;
    }
    const hasRadialGradient = shape.getFillRadialGradientColorStops();
    if (hasRadialGradient && fillPriority === "radial-gradient") {
      this._fillRadialGradient(shape);
      return;
    }
    if (hasColor) {
      this._fillColor(shape);
    } else if (hasPattern) {
      this._fillPattern(shape);
    } else if (hasLinearGradient) {
      this._fillLinearGradient(shape);
    } else if (hasRadialGradient) {
      this._fillRadialGradient(shape);
    }
  }
  _strokeLinearGradient(shape) {
    const start = shape.getStrokeLinearGradientStartPoint(), end = shape.getStrokeLinearGradientEndPoint(), colorStops = shape.getStrokeLinearGradientColorStops(), grd = this.createLinearGradient(start.x, start.y, end.x, end.y);
    if (colorStops) {
      for (let n = 0; n < colorStops.length; n += 2) {
        grd.addColorStop(colorStops[n], colorStops[n + 1]);
      }
      this.setAttr("strokeStyle", grd);
    }
  }
  _stroke(shape) {
    const dash = shape.dash(), strokeScaleEnabled = shape.getStrokeScaleEnabled();
    if (shape.hasStroke()) {
      if (!strokeScaleEnabled) {
        this.save();
        const pixelRatio = this.getCanvas().getPixelRatio();
        this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      }
      this._applyLineCap(shape);
      if (dash && shape.dashEnabled()) {
        this.setLineDash(dash);
        this.setAttr("lineDashOffset", shape.dashOffset());
      }
      this.setAttr("lineWidth", shape.strokeWidth());
      if (!shape.getShadowForStrokeEnabled()) {
        this.setAttr("shadowColor", "rgba(0,0,0,0)");
      }
      const hasLinearGradient = shape.getStrokeLinearGradientColorStops();
      if (hasLinearGradient) {
        this._strokeLinearGradient(shape);
      } else {
        this.setAttr("strokeStyle", shape.stroke());
      }
      shape._strokeFunc(this);
      if (!strokeScaleEnabled) {
        this.restore();
      }
    }
  }
  _applyShadow(shape) {
    var _a, _b, _c;
    const color = (_a = shape.getShadowRGBA()) !== null && _a !== void 0 ? _a : "black", blur = (_b = shape.getShadowBlur()) !== null && _b !== void 0 ? _b : 5, offset = (_c = shape.getShadowOffset()) !== null && _c !== void 0 ? _c : {
      x: 0,
      y: 0
    }, scale = shape.getAbsoluteScale(), ratio = this.canvas.getPixelRatio(), scaleX = scale.x * ratio, scaleY = scale.y * ratio;
    this.setAttr("shadowColor", color);
    this.setAttr("shadowBlur", blur * Math.min(Math.abs(scaleX), Math.abs(scaleY)));
    this.setAttr("shadowOffsetX", offset.x * scaleX);
    this.setAttr("shadowOffsetY", offset.y * scaleY);
  }
}
class HitContext extends Context {
  constructor(canvas) {
    super(canvas);
    this._context = canvas._canvas.getContext("2d", {
      willReadFrequently: true
    });
  }
  _fill(shape) {
    this.save();
    this.setAttr("fillStyle", shape.colorKey);
    shape._fillFuncHit(this);
    this.restore();
  }
  strokeShape(shape) {
    if (shape.hasHitStroke()) {
      this._stroke(shape);
    }
  }
  _stroke(shape) {
    if (shape.hasHitStroke()) {
      const strokeScaleEnabled = shape.getStrokeScaleEnabled();
      if (!strokeScaleEnabled) {
        this.save();
        const pixelRatio = this.getCanvas().getPixelRatio();
        this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      }
      this._applyLineCap(shape);
      const hitStrokeWidth = shape.hitStrokeWidth();
      const strokeWidth = hitStrokeWidth === "auto" ? shape.strokeWidth() : hitStrokeWidth;
      this.setAttr("lineWidth", strokeWidth);
      this.setAttr("strokeStyle", shape.colorKey);
      shape._strokeFuncHit(this);
      if (!strokeScaleEnabled) {
        this.restore();
      }
    }
  }
}
let _pixelRatio;
function getDevicePixelRatio() {
  if (_pixelRatio) {
    return _pixelRatio;
  }
  const canvas = Util.createCanvasElement();
  const context = canvas.getContext("2d");
  _pixelRatio = (function() {
    const devicePixelRatio = Konva$1._global.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
    return devicePixelRatio / backingStoreRatio;
  })();
  Util.releaseCanvas(canvas);
  return _pixelRatio;
}
let Canvas$1 = class Canvas {
  constructor(config) {
    this.pixelRatio = 1;
    this.width = 0;
    this.height = 0;
    this.isCache = false;
    const conf = config || {};
    const pixelRatio = conf.pixelRatio || Konva$1.pixelRatio || getDevicePixelRatio();
    this.pixelRatio = pixelRatio;
    this._canvas = Util.createCanvasElement();
    this._canvas.style.padding = "0";
    this._canvas.style.margin = "0";
    this._canvas.style.border = "0";
    this._canvas.style.background = "transparent";
    this._canvas.style.position = "absolute";
    this._canvas.style.top = "0";
    this._canvas.style.left = "0";
  }
  getContext() {
    return this.context;
  }
  getPixelRatio() {
    return this.pixelRatio;
  }
  setPixelRatio(pixelRatio) {
    const previousRatio = this.pixelRatio;
    this.pixelRatio = pixelRatio;
    this.setSize(this.getWidth() / previousRatio, this.getHeight() / previousRatio);
  }
  setWidth(width) {
    this.width = this._canvas.width = width * this.pixelRatio;
    this._canvas.style.width = width + "px";
    const pixelRatio = this.pixelRatio, _context = this.getContext()._context;
    _context.scale(pixelRatio, pixelRatio);
  }
  setHeight(height) {
    this.height = this._canvas.height = height * this.pixelRatio;
    this._canvas.style.height = height + "px";
    const pixelRatio = this.pixelRatio, _context = this.getContext()._context;
    _context.scale(pixelRatio, pixelRatio);
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }
  setSize(width, height) {
    this.setWidth(width || 0);
    this.setHeight(height || 0);
  }
  toDataURL(mimeType, quality) {
    try {
      return this._canvas.toDataURL(mimeType, quality);
    } catch (e) {
      try {
        return this._canvas.toDataURL();
      } catch (err) {
        Util.error("Unable to get data URL. " + err.message + " For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html.");
        return "";
      }
    }
  }
};
class SceneCanvas extends Canvas$1 {
  constructor(config = { width: 0, height: 0, willReadFrequently: false }) {
    super(config);
    this.context = new SceneContext(this, {
      willReadFrequently: config.willReadFrequently
    });
    this.setSize(config.width, config.height);
  }
}
class HitCanvas extends Canvas$1 {
  constructor(config = { width: 0, height: 0 }) {
    super(config);
    this.hitCanvas = true;
    this.context = new HitContext(this);
    this.setSize(config.width, config.height);
  }
}
const DD = {
  get isDragging() {
    let flag = false;
    DD._dragElements.forEach((elem) => {
      if (elem.dragStatus === "dragging") {
        flag = true;
      }
    });
    return flag;
  },
  justDragged: false,
  get node() {
    let node;
    DD._dragElements.forEach((elem) => {
      node = elem.node;
    });
    return node;
  },
  _dragElements: /* @__PURE__ */ new Map(),
  _drag(evt) {
    const nodesToFireEvents = [];
    DD._dragElements.forEach((elem, key) => {
      const { node } = elem;
      const stage = node.getStage();
      stage.setPointersPositions(evt);
      if (elem.pointerId === void 0) {
        elem.pointerId = Util._getFirstPointerId(evt);
      }
      const pos = stage._changedPointerPositions.find((pos2) => pos2.id === elem.pointerId);
      if (!pos) {
        return;
      }
      if (elem.dragStatus !== "dragging") {
        const dragDistance = node.dragDistance();
        const distance = Math.max(Math.abs(pos.x - elem.startPointerPos.x), Math.abs(pos.y - elem.startPointerPos.y));
        if (distance < dragDistance) {
          return;
        }
        node.startDrag({ evt });
        if (!node.isDragging()) {
          return;
        }
      }
      node._setDragPosition(evt, elem);
      nodesToFireEvents.push(node);
    });
    nodesToFireEvents.forEach((node) => {
      if (!node.getStage()) {
        return;
      }
      node.fire("dragmove", {
        type: "dragmove",
        target: node,
        evt
      }, true);
    });
  },
  _endDragBefore(evt) {
    const drawNodes = [];
    DD._dragElements.forEach((elem) => {
      const { node } = elem;
      const stage = node.getStage();
      if (evt) {
        stage.setPointersPositions(evt);
      }
      const pos = stage._changedPointerPositions.find((pos2) => pos2.id === elem.pointerId);
      if (!pos) {
        return;
      }
      if (elem.dragStatus === "dragging" || elem.dragStatus === "stopped") {
        DD.justDragged = true;
        Konva$1._mouseListenClick = false;
        Konva$1._touchListenClick = false;
        Konva$1._pointerListenClick = false;
        elem.dragStatus = "stopped";
      }
      const drawNode = elem.node.getLayer() || elem.node instanceof Konva$1["Stage"] && elem.node;
      if (drawNode && drawNodes.indexOf(drawNode) === -1) {
        drawNodes.push(drawNode);
      }
    });
    drawNodes.forEach((drawNode) => {
      drawNode.draw();
    });
  },
  _endDragAfter(evt) {
    DD._dragElements.forEach((elem, key) => {
      if (elem.dragStatus === "stopped") {
        elem.node.fire("dragend", {
          type: "dragend",
          target: elem.node,
          evt
        }, true);
      }
      if (elem.dragStatus !== "dragging") {
        DD._dragElements.delete(key);
      }
    });
  }
};
if (Konva$1.isBrowser) {
  window.addEventListener("mouseup", DD._endDragBefore, true);
  window.addEventListener("touchend", DD._endDragBefore, true);
  window.addEventListener("touchcancel", DD._endDragBefore, true);
  window.addEventListener("mousemove", DD._drag);
  window.addEventListener("touchmove", DD._drag);
  window.addEventListener("mouseup", DD._endDragAfter, false);
  window.addEventListener("touchend", DD._endDragAfter, false);
  window.addEventListener("touchcancel", DD._endDragAfter, false);
}
function _formatValue(val) {
  if (Util._isString(val)) {
    return '"' + val + '"';
  }
  if (Object.prototype.toString.call(val) === "[object Number]") {
    return val;
  }
  if (Util._isBoolean(val)) {
    return val;
  }
  return Object.prototype.toString.call(val);
}
function RGBComponent(val) {
  if (val > 255) {
    return 255;
  } else if (val < 0) {
    return 0;
  }
  return Math.round(val);
}
function getNumberValidator() {
  if (Konva$1.isUnminified) {
    return function(val, attr) {
      if (!Util._isNumber(val)) {
        Util.warn(_formatValue(val) + ' is a not valid value for "' + attr + '" attribute. The value should be a number.');
      }
      return val;
    };
  }
}
function getNumberOrArrayOfNumbersValidator(noOfElements) {
  if (Konva$1.isUnminified) {
    return function(val, attr) {
      let isNumber = Util._isNumber(val);
      let isValidArray = Util._isArray(val) && val.length == noOfElements;
      if (!isNumber && !isValidArray) {
        Util.warn(_formatValue(val) + ' is a not valid value for "' + attr + '" attribute. The value should be a number or Array<number>(' + noOfElements + ")");
      }
      return val;
    };
  }
}
function getNumberOrAutoValidator() {
  if (Konva$1.isUnminified) {
    return function(val, attr) {
      const isNumber = Util._isNumber(val);
      const isAuto = val === "auto";
      if (!(isNumber || isAuto)) {
        Util.warn(_formatValue(val) + ' is a not valid value for "' + attr + '" attribute. The value should be a number or "auto".');
      }
      return val;
    };
  }
}
function getStringValidator() {
  if (Konva$1.isUnminified) {
    return function(val, attr) {
      if (!Util._isString(val)) {
        Util.warn(_formatValue(val) + ' is a not valid value for "' + attr + '" attribute. The value should be a string.');
      }
      return val;
    };
  }
}
function getStringOrGradientValidator() {
  if (Konva$1.isUnminified) {
    return function(val, attr) {
      const isString = Util._isString(val);
      const isGradient = Object.prototype.toString.call(val) === "[object CanvasGradient]" || val && val["addColorStop"];
      if (!(isString || isGradient)) {
        Util.warn(_formatValue(val) + ' is a not valid value for "' + attr + '" attribute. The value should be a string or a native gradient.');
      }
      return val;
    };
  }
}
function getNumberArrayValidator() {
  if (Konva$1.isUnminified) {
    return function(val, attr) {
      const TypedArray = Int8Array ? Object.getPrototypeOf(Int8Array) : null;
      if (TypedArray && val instanceof TypedArray) {
        return val;
      }
      if (!Util._isArray(val)) {
        Util.warn(_formatValue(val) + ' is a not valid value for "' + attr + '" attribute. The value should be a array of numbers.');
      } else {
        val.forEach(function(item) {
          if (!Util._isNumber(item)) {
            Util.warn('"' + attr + '" attribute has non numeric element ' + item + ". Make sure that all elements are numbers.");
          }
        });
      }
      return val;
    };
  }
}
function getBooleanValidator() {
  if (Konva$1.isUnminified) {
    return function(val, attr) {
      const isBool = val === true || val === false;
      if (!isBool) {
        Util.warn(_formatValue(val) + ' is a not valid value for "' + attr + '" attribute. The value should be a boolean.');
      }
      return val;
    };
  }
}
function getComponentValidator(components) {
  if (Konva$1.isUnminified) {
    return function(val, attr) {
      if (val === void 0 || val === null) {
        return val;
      }
      if (!Util.isObject(val)) {
        Util.warn(_formatValue(val) + ' is a not valid value for "' + attr + '" attribute. The value should be an object with properties ' + components);
      }
      return val;
    };
  }
}
const GET = "get";
const SET$1 = "set";
const Factory = {
  addGetterSetter(constructor, attr, def, validator, after) {
    Factory.addGetter(constructor, attr, def);
    Factory.addSetter(constructor, attr, validator, after);
    Factory.addOverloadedGetterSetter(constructor, attr);
  },
  addGetter(constructor, attr, def) {
    const method = GET + Util._capitalize(attr);
    constructor.prototype[method] = constructor.prototype[method] || function() {
      const val = this.attrs[attr];
      return val === void 0 ? def : val;
    };
  },
  addSetter(constructor, attr, validator, after) {
    const method = SET$1 + Util._capitalize(attr);
    if (!constructor.prototype[method]) {
      Factory.overWriteSetter(constructor, attr, validator, after);
    }
  },
  overWriteSetter(constructor, attr, validator, after) {
    const method = SET$1 + Util._capitalize(attr);
    constructor.prototype[method] = function(val) {
      if (validator && val !== void 0 && val !== null) {
        val = validator.call(this, val, attr);
      }
      this._setAttr(attr, val);
      if (after) {
        after.call(this);
      }
      return this;
    };
  },
  addComponentsGetterSetter(constructor, attr, components, validator, after) {
    const len = components.length, capitalize = Util._capitalize, getter = GET + capitalize(attr), setter = SET$1 + capitalize(attr);
    constructor.prototype[getter] = function() {
      const ret = {};
      for (let n = 0; n < len; n++) {
        const component = components[n];
        ret[component] = this.getAttr(attr + capitalize(component));
      }
      return ret;
    };
    const basicValidator = getComponentValidator(components);
    constructor.prototype[setter] = function(val) {
      const oldVal = this.attrs[attr];
      if (validator) {
        val = validator.call(this, val, attr);
      }
      if (basicValidator) {
        basicValidator.call(this, val, attr);
      }
      for (const key in val) {
        if (!val.hasOwnProperty(key)) {
          continue;
        }
        this._setAttr(attr + capitalize(key), val[key]);
      }
      if (!val) {
        components.forEach((component) => {
          this._setAttr(attr + capitalize(component), void 0);
        });
      }
      this._fireChangeEvent(attr, oldVal, val);
      if (after) {
        after.call(this);
      }
      return this;
    };
    Factory.addOverloadedGetterSetter(constructor, attr);
  },
  addOverloadedGetterSetter(constructor, attr) {
    const capitalizedAttr = Util._capitalize(attr), setter = SET$1 + capitalizedAttr, getter = GET + capitalizedAttr;
    constructor.prototype[attr] = function() {
      if (arguments.length) {
        this[setter](arguments[0]);
        return this;
      }
      return this[getter]();
    };
  },
  addDeprecatedGetterSetter(constructor, attr, def, validator) {
    Util.error("Adding deprecated " + attr);
    const method = GET + Util._capitalize(attr);
    const message = attr + " property is deprecated and will be removed soon. Look at Konva change log for more information.";
    constructor.prototype[method] = function() {
      Util.error(message);
      const val = this.attrs[attr];
      return val === void 0 ? def : val;
    };
    Factory.addSetter(constructor, attr, validator, function() {
      Util.error(message);
    });
    Factory.addOverloadedGetterSetter(constructor, attr);
  },
  backCompat(constructor, methods) {
    Util.each(methods, function(oldMethodName, newMethodName) {
      const method = constructor.prototype[newMethodName];
      const oldGetter = GET + Util._capitalize(oldMethodName);
      const oldSetter = SET$1 + Util._capitalize(oldMethodName);
      function deprecated() {
        method.apply(this, arguments);
        Util.error('"' + oldMethodName + '" method is deprecated and will be removed soon. Use ""' + newMethodName + '" instead.');
      }
      constructor.prototype[oldMethodName] = deprecated;
      constructor.prototype[oldGetter] = deprecated;
      constructor.prototype[oldSetter] = deprecated;
    });
  },
  afterSetFilter() {
    this._filterUpToDate = false;
  }
};
function parseCSSFilters(cssFilter) {
  const filterRegex = /(\w+)\(([^)]+)\)/g;
  let match;
  while ((match = filterRegex.exec(cssFilter)) !== null) {
    const [, filterName, filterValue] = match;
    switch (filterName) {
      case "blur": {
        const blurRadius = parseFloat(filterValue.replace("px", ""));
        return function(imageData) {
          this.blurRadius(blurRadius * 0.5);
          const KonvaFilters = Konva$1.Filters;
          if (KonvaFilters && KonvaFilters.Blur) {
            KonvaFilters.Blur.call(this, imageData);
          }
        };
      }
      case "brightness": {
        const brightness = filterValue.includes("%") ? parseFloat(filterValue) / 100 : parseFloat(filterValue);
        return function(imageData) {
          this.brightness(brightness);
          const KonvaFilters = Konva$1.Filters;
          if (KonvaFilters && KonvaFilters.Brightness) {
            KonvaFilters.Brightness.call(this, imageData);
          }
        };
      }
      case "contrast": {
        const contrast = parseFloat(filterValue);
        return function(imageData) {
          const konvaContrast = 100 * (Math.sqrt(contrast) - 1);
          this.contrast(konvaContrast);
          const KonvaFilters = Konva$1.Filters;
          if (KonvaFilters && KonvaFilters.Contrast) {
            KonvaFilters.Contrast.call(this, imageData);
          }
        };
      }
      case "grayscale": {
        return function(imageData) {
          const KonvaFilters = Konva$1.Filters;
          if (KonvaFilters && KonvaFilters.Grayscale) {
            KonvaFilters.Grayscale.call(this, imageData);
          }
        };
      }
      case "sepia": {
        return function(imageData) {
          const KonvaFilters = Konva$1.Filters;
          if (KonvaFilters && KonvaFilters.Sepia) {
            KonvaFilters.Sepia.call(this, imageData);
          }
        };
      }
      case "invert": {
        return function(imageData) {
          const KonvaFilters = Konva$1.Filters;
          if (KonvaFilters && KonvaFilters.Invert) {
            KonvaFilters.Invert.call(this, imageData);
          }
        };
      }
      default:
        Util.warn(`CSS filter "${filterName}" is not supported in fallback mode. Consider using function filters for better compatibility.`);
        break;
    }
  }
  return () => {
  };
}
const ABSOLUTE_OPACITY = "absoluteOpacity", ALL_LISTENERS = "allEventListeners", ABSOLUTE_TRANSFORM = "absoluteTransform", ABSOLUTE_SCALE = "absoluteScale", CANVAS = "canvas", CHANGE = "Change", CHILDREN = "children", KONVA = "konva", LISTENING = "listening", MOUSEENTER$1 = "mouseenter", MOUSELEAVE$1 = "mouseleave", POINTERENTER$1 = "pointerenter", POINTERLEAVE$1 = "pointerleave", TOUCHENTER = "touchenter", TOUCHLEAVE = "touchleave", SET = "set", SHAPE = "Shape", SPACE$1 = " ", STAGE$1 = "stage", TRANSFORM = "transform", UPPER_STAGE = "Stage", VISIBLE = "visible", TRANSFORM_CHANGE_STR$1 = [
  "xChange.konva",
  "yChange.konva",
  "scaleXChange.konva",
  "scaleYChange.konva",
  "skewXChange.konva",
  "skewYChange.konva",
  "rotationChange.konva",
  "offsetXChange.konva",
  "offsetYChange.konva",
  "transformsEnabledChange.konva"
].join(SPACE$1);
let idCounter$1 = 1;
class Node {
  constructor(config) {
    this._id = idCounter$1++;
    this.eventListeners = {};
    this.attrs = {};
    this.index = 0;
    this._allEventListeners = null;
    this.parent = null;
    this._cache = /* @__PURE__ */ new Map();
    this._attachedDepsListeners = /* @__PURE__ */ new Map();
    this._lastPos = null;
    this._batchingTransformChange = false;
    this._needClearTransformCache = false;
    this._filterUpToDate = false;
    this._isUnderCache = false;
    this._dragEventId = null;
    this._shouldFireChangeEvents = false;
    this.setAttrs(config);
    this._shouldFireChangeEvents = true;
  }
  hasChildren() {
    return false;
  }
  _clearCache(attr) {
    if ((attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM) && this._cache.get(attr)) {
      this._cache.get(attr).dirty = true;
    } else if (attr) {
      this._cache.delete(attr);
    } else {
      this._cache.clear();
    }
  }
  _getCache(attr, privateGetter) {
    let cache = this._cache.get(attr);
    const isTransform = attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM;
    const invalid = cache === void 0 || isTransform && cache.dirty === true;
    if (invalid) {
      cache = privateGetter.call(this);
      this._cache.set(attr, cache);
    }
    return cache;
  }
  _calculate(name, deps, getter) {
    if (!this._attachedDepsListeners.get(name)) {
      const depsString = deps.map((dep) => dep + "Change.konva").join(SPACE$1);
      this.on(depsString, () => {
        this._clearCache(name);
      });
      this._attachedDepsListeners.set(name, true);
    }
    return this._getCache(name, getter);
  }
  _getCanvasCache() {
    return this._cache.get(CANVAS);
  }
  _clearSelfAndDescendantCache(attr) {
    this._clearCache(attr);
    if (attr === ABSOLUTE_TRANSFORM) {
      this.fire("absoluteTransformChange");
    }
  }
  clearCache() {
    if (this._cache.has(CANVAS)) {
      const { scene, filter, hit } = this._cache.get(CANVAS);
      Util.releaseCanvas(scene._canvas, filter._canvas, hit._canvas);
      this._cache.delete(CANVAS);
    }
    this._clearSelfAndDescendantCache();
    this._requestDraw();
    return this;
  }
  cache(config) {
    const conf = config || {};
    let rect = {};
    if (conf.x === void 0 || conf.y === void 0 || conf.width === void 0 || conf.height === void 0) {
      rect = this.getClientRect({
        skipTransform: true,
        relativeTo: this.getParent() || void 0
      });
    }
    let width = Math.ceil(conf.width || rect.width), height = Math.ceil(conf.height || rect.height), pixelRatio = conf.pixelRatio, x2 = conf.x === void 0 ? Math.floor(rect.x) : conf.x, y = conf.y === void 0 ? Math.floor(rect.y) : conf.y, offset = conf.offset || 0, drawBorder = conf.drawBorder || false, hitCanvasPixelRatio = conf.hitCanvasPixelRatio || 1;
    if (!width || !height) {
      Util.error("Can not cache the node. Width or height of the node equals 0. Caching is skipped.");
      return;
    }
    const extraPaddingX = Math.abs(Math.round(rect.x) - x2) > 0.5 ? 1 : 0;
    const extraPaddingY = Math.abs(Math.round(rect.y) - y) > 0.5 ? 1 : 0;
    width += offset * 2 + extraPaddingX;
    height += offset * 2 + extraPaddingY;
    x2 -= offset;
    y -= offset;
    const cachedSceneCanvas = new SceneCanvas({
      pixelRatio,
      width,
      height
    }), cachedFilterCanvas = new SceneCanvas({
      pixelRatio,
      width: 0,
      height: 0,
      willReadFrequently: true
    }), cachedHitCanvas = new HitCanvas({
      pixelRatio: hitCanvasPixelRatio,
      width,
      height
    }), sceneContext = cachedSceneCanvas.getContext(), hitContext = cachedHitCanvas.getContext();
    const bufferCanvas = new SceneCanvas({
      width: cachedSceneCanvas.width / cachedSceneCanvas.pixelRatio + Math.abs(x2),
      height: cachedSceneCanvas.height / cachedSceneCanvas.pixelRatio + Math.abs(y),
      pixelRatio: cachedSceneCanvas.pixelRatio
    }), bufferContext = bufferCanvas.getContext();
    cachedHitCanvas.isCache = true;
    cachedSceneCanvas.isCache = true;
    this._cache.delete(CANVAS);
    this._filterUpToDate = false;
    if (conf.imageSmoothingEnabled === false) {
      cachedSceneCanvas.getContext()._context.imageSmoothingEnabled = false;
      cachedFilterCanvas.getContext()._context.imageSmoothingEnabled = false;
    }
    sceneContext.save();
    hitContext.save();
    bufferContext.save();
    sceneContext.translate(-x2, -y);
    hitContext.translate(-x2, -y);
    bufferContext.translate(-x2, -y);
    bufferCanvas.x = x2;
    bufferCanvas.y = y;
    this._isUnderCache = true;
    this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
    this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
    this.drawScene(cachedSceneCanvas, this, bufferCanvas);
    this.drawHit(cachedHitCanvas, this);
    this._isUnderCache = false;
    sceneContext.restore();
    hitContext.restore();
    if (drawBorder) {
      sceneContext.save();
      sceneContext.beginPath();
      sceneContext.rect(0, 0, width, height);
      sceneContext.closePath();
      sceneContext.setAttr("strokeStyle", "red");
      sceneContext.setAttr("lineWidth", 5);
      sceneContext.stroke();
      sceneContext.restore();
    }
    Util.releaseCanvas(bufferCanvas._canvas);
    this._cache.set(CANVAS, {
      scene: cachedSceneCanvas,
      filter: cachedFilterCanvas,
      hit: cachedHitCanvas,
      x: x2,
      y
    });
    this._requestDraw();
    return this;
  }
  isCached() {
    return this._cache.has(CANVAS);
  }
  getClientRect(config) {
    throw new Error('abstract "getClientRect" method call');
  }
  _transformedRect(rect, top) {
    const points = [
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height },
      { x: rect.x, y: rect.y + rect.height }
    ];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const trans = this.getAbsoluteTransform(top);
    points.forEach(function(point) {
      const transformed = trans.point(point);
      if (minX === void 0) {
        minX = maxX = transformed.x;
        minY = maxY = transformed.y;
      }
      minX = Math.min(minX, transformed.x);
      minY = Math.min(minY, transformed.y);
      maxX = Math.max(maxX, transformed.x);
      maxY = Math.max(maxY, transformed.y);
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  _drawCachedSceneCanvas(context) {
    context.save();
    context._applyOpacity(this);
    context._applyGlobalCompositeOperation(this);
    const canvasCache = this._getCanvasCache();
    context.translate(canvasCache.x, canvasCache.y);
    const cacheCanvas = this._getCachedSceneCanvas();
    const ratio = cacheCanvas.pixelRatio;
    context.drawImage(cacheCanvas._canvas, 0, 0, cacheCanvas.width / ratio, cacheCanvas.height / ratio);
    context.restore();
  }
  _drawCachedHitCanvas(context) {
    const canvasCache = this._getCanvasCache(), hitCanvas = canvasCache.hit;
    context.save();
    context.translate(canvasCache.x, canvasCache.y);
    context.drawImage(hitCanvas._canvas, 0, 0, hitCanvas.width / hitCanvas.pixelRatio, hitCanvas.height / hitCanvas.pixelRatio);
    context.restore();
  }
  _getCachedSceneCanvas() {
    let filters = this.filters(), cachedCanvas = this._getCanvasCache(), sceneCanvas = cachedCanvas.scene, filterCanvas = cachedCanvas.filter, filterContext = filterCanvas.getContext(), len, imageData, n, filter;
    if (!filters || filters.length === 0) {
      return sceneCanvas;
    }
    if (this._filterUpToDate) {
      return filterCanvas;
    }
    let useNativeOnly = true;
    for (let i = 0; i < filters.length; i++) {
      typeof filters[i] === "string" && !isCSSFiltersSupported();
      if (typeof filters[i] !== "string" || !isCSSFiltersSupported()) {
        useNativeOnly = false;
        break;
      }
    }
    const ratio = sceneCanvas.pixelRatio;
    filterCanvas.setSize(sceneCanvas.width / sceneCanvas.pixelRatio, sceneCanvas.height / sceneCanvas.pixelRatio);
    if (useNativeOnly) {
      const finalFilter = filters.join(" ");
      filterContext.save();
      filterContext.setAttr("filter", finalFilter);
      filterContext.drawImage(sceneCanvas._canvas, 0, 0, sceneCanvas.getWidth() / ratio, sceneCanvas.getHeight() / ratio);
      filterContext.restore();
      this._filterUpToDate = true;
      return filterCanvas;
    }
    try {
      len = filters.length;
      filterContext.clear();
      filterContext.drawImage(sceneCanvas._canvas, 0, 0, sceneCanvas.getWidth() / ratio, sceneCanvas.getHeight() / ratio);
      imageData = filterContext.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
      for (n = 0; n < len; n++) {
        filter = filters[n];
        if (typeof filter === "string") {
          filter = parseCSSFilters(filter);
        }
        filter.call(this, imageData);
        filterContext.putImageData(imageData, 0, 0);
      }
    } catch (e) {
      Util.error("Unable to apply filter. " + e.message + " This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.");
    }
    this._filterUpToDate = true;
    return filterCanvas;
  }
  on(...args) {
    const evtStr = args[0];
    const selectorOrHandler = args[1];
    args[2];
    if (this._cache) {
      this._cache.delete(ALL_LISTENERS);
    }
    if (args.length === 3) {
      return this._delegate.apply(this, args);
    }
    const events = evtStr.split(SPACE$1);
    for (let n = 0; n < events.length; n++) {
      const event = events[n];
      const parts = event.split(".");
      const baseEvent = parts[0];
      const name = parts[1] || "";
      if (!this.eventListeners[baseEvent]) {
        this.eventListeners[baseEvent] = [];
      }
      this.eventListeners[baseEvent].push({ name, handler: selectorOrHandler });
    }
    return this;
  }
  off(evtStr, callback) {
    let events = (evtStr || "").split(SPACE$1), len = events.length, n, t, event, parts, baseEvent, name;
    this._cache && this._cache.delete(ALL_LISTENERS);
    if (!evtStr) {
      for (t in this.eventListeners) {
        this._off(t);
      }
    }
    for (n = 0; n < len; n++) {
      event = events[n];
      parts = event.split(".");
      baseEvent = parts[0];
      name = parts[1];
      if (baseEvent) {
        if (this.eventListeners[baseEvent]) {
          this._off(baseEvent, name, callback);
        }
      } else {
        for (t in this.eventListeners) {
          this._off(t, name, callback);
        }
      }
    }
    return this;
  }
  dispatchEvent(evt) {
    const e = {
      target: this,
      type: evt.type,
      evt
    };
    this.fire(evt.type, e);
    return this;
  }
  addEventListener(type, handler) {
    this.on(type, function(evt) {
      handler.call(this, evt.evt);
    });
    return this;
  }
  removeEventListener(type) {
    this.off(type);
    return this;
  }
  _delegate(event, selector, handler) {
    const stopNode = this;
    this.on(event, function(evt) {
      const targets = evt.target.findAncestors(selector, true, stopNode);
      for (let i = 0; i < targets.length; i++) {
        evt = Util.cloneObject(evt);
        evt.currentTarget = targets[i];
        handler.call(targets[i], evt);
      }
    });
    return this;
  }
  remove() {
    if (this.isDragging()) {
      this.stopDrag();
    }
    DD._dragElements.delete(this._id);
    DD._dragElements.forEach((elem, key) => {
      if (this.isAncestorOf(elem.node)) {
        DD._dragElements.delete(key);
      }
    });
    this._remove();
    return this;
  }
  _clearCaches() {
    this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
    this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
    this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
    this._clearSelfAndDescendantCache(STAGE$1);
    this._clearSelfAndDescendantCache(VISIBLE);
    this._clearSelfAndDescendantCache(LISTENING);
  }
  _remove() {
    this._clearCaches();
    const parent = this.getParent();
    if (parent && parent.children) {
      parent.children.splice(this.index, 1);
      parent._setChildrenIndices();
      this.parent = null;
    }
  }
  destroy() {
    this.remove();
    this.clearCache();
    return this;
  }
  getAttr(attr) {
    const method = "get" + Util._capitalize(attr);
    if (Util._isFunction(this[method])) {
      return this[method]();
    }
    return this.attrs[attr];
  }
  getAncestors() {
    let parent = this.getParent(), ancestors = [];
    while (parent) {
      ancestors.push(parent);
      parent = parent.getParent();
    }
    return ancestors;
  }
  getAttrs() {
    return this.attrs || {};
  }
  setAttrs(config) {
    this._batchTransformChanges(() => {
      let key, method;
      if (!config) {
        return this;
      }
      for (key in config) {
        if (key === CHILDREN) {
          continue;
        }
        method = SET + Util._capitalize(key);
        if (Util._isFunction(this[method])) {
          this[method](config[key]);
        } else {
          this._setAttr(key, config[key]);
        }
      }
    });
    return this;
  }
  isListening() {
    return this._getCache(LISTENING, this._isListening);
  }
  _isListening(relativeTo) {
    const listening = this.listening();
    if (!listening) {
      return false;
    }
    const parent = this.getParent();
    if (parent && parent !== relativeTo && this !== relativeTo) {
      return parent._isListening(relativeTo);
    } else {
      return true;
    }
  }
  isVisible() {
    return this._getCache(VISIBLE, this._isVisible);
  }
  _isVisible(relativeTo) {
    const visible = this.visible();
    if (!visible) {
      return false;
    }
    const parent = this.getParent();
    if (parent && parent !== relativeTo && this !== relativeTo) {
      return parent._isVisible(relativeTo);
    } else {
      return true;
    }
  }
  shouldDrawHit(top, skipDragCheck = false) {
    if (top) {
      return this._isVisible(top) && this._isListening(top);
    }
    const layer = this.getLayer();
    let layerUnderDrag = false;
    DD._dragElements.forEach((elem) => {
      if (elem.dragStatus !== "dragging") {
        return;
      } else if (elem.node.nodeType === "Stage") {
        layerUnderDrag = true;
      } else if (elem.node.getLayer() === layer) {
        layerUnderDrag = true;
      }
    });
    const dragSkip = !skipDragCheck && !Konva$1.hitOnDragEnabled && (layerUnderDrag || Konva$1.isTransforming());
    return this.isListening() && this.isVisible() && !dragSkip;
  }
  show() {
    this.visible(true);
    return this;
  }
  hide() {
    this.visible(false);
    return this;
  }
  getZIndex() {
    return this.index || 0;
  }
  getAbsoluteZIndex() {
    let depth = this.getDepth(), that = this, index = 0, nodes, len, n, child;
    function addChildren(children) {
      nodes = [];
      len = children.length;
      for (n = 0; n < len; n++) {
        child = children[n];
        index++;
        if (child.nodeType !== SHAPE) {
          nodes = nodes.concat(child.getChildren().slice());
        }
        if (child._id === that._id) {
          n = len;
        }
      }
      if (nodes.length > 0 && nodes[0].getDepth() <= depth) {
        addChildren(nodes);
      }
    }
    const stage = this.getStage();
    if (that.nodeType !== UPPER_STAGE && stage) {
      addChildren(stage.getChildren());
    }
    return index;
  }
  getDepth() {
    let depth = 0, parent = this.parent;
    while (parent) {
      depth++;
      parent = parent.parent;
    }
    return depth;
  }
  _batchTransformChanges(func) {
    this._batchingTransformChange = true;
    func();
    this._batchingTransformChange = false;
    if (this._needClearTransformCache) {
      this._clearCache(TRANSFORM);
      this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
    }
    this._needClearTransformCache = false;
  }
  setPosition(pos) {
    this._batchTransformChanges(() => {
      this.x(pos.x);
      this.y(pos.y);
    });
    return this;
  }
  getPosition() {
    return {
      x: this.x(),
      y: this.y()
    };
  }
  getRelativePointerPosition() {
    const stage = this.getStage();
    if (!stage) {
      return null;
    }
    const pos = stage.getPointerPosition();
    if (!pos) {
      return null;
    }
    const transform = this.getAbsoluteTransform().copy();
    transform.invert();
    return transform.point(pos);
  }
  getAbsolutePosition(top) {
    let haveCachedParent = false;
    let parent = this.parent;
    while (parent) {
      if (parent.isCached()) {
        haveCachedParent = true;
        break;
      }
      parent = parent.parent;
    }
    if (haveCachedParent && !top) {
      top = true;
    }
    const absoluteMatrix = this.getAbsoluteTransform(top).getMatrix(), absoluteTransform = new Transform(), offset = this.offset();
    absoluteTransform.m = absoluteMatrix.slice();
    absoluteTransform.translate(offset.x, offset.y);
    return absoluteTransform.getTranslation();
  }
  setAbsolutePosition(pos) {
    const { x: x2, y, ...origTrans } = this._clearTransform();
    this.attrs.x = x2;
    this.attrs.y = y;
    this._clearCache(TRANSFORM);
    const it = this._getAbsoluteTransform().copy();
    it.invert();
    it.translate(pos.x, pos.y);
    pos = {
      x: this.attrs.x + it.getTranslation().x,
      y: this.attrs.y + it.getTranslation().y
    };
    this._setTransform(origTrans);
    this.setPosition({ x: pos.x, y: pos.y });
    this._clearCache(TRANSFORM);
    this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
    return this;
  }
  _setTransform(trans) {
    let key;
    for (key in trans) {
      this.attrs[key] = trans[key];
    }
  }
  _clearTransform() {
    const trans = {
      x: this.x(),
      y: this.y(),
      rotation: this.rotation(),
      scaleX: this.scaleX(),
      scaleY: this.scaleY(),
      offsetX: this.offsetX(),
      offsetY: this.offsetY(),
      skewX: this.skewX(),
      skewY: this.skewY()
    };
    this.attrs.x = 0;
    this.attrs.y = 0;
    this.attrs.rotation = 0;
    this.attrs.scaleX = 1;
    this.attrs.scaleY = 1;
    this.attrs.offsetX = 0;
    this.attrs.offsetY = 0;
    this.attrs.skewX = 0;
    this.attrs.skewY = 0;
    return trans;
  }
  move(change) {
    let changeX = change.x, changeY = change.y, x2 = this.x(), y = this.y();
    if (changeX !== void 0) {
      x2 += changeX;
    }
    if (changeY !== void 0) {
      y += changeY;
    }
    this.setPosition({ x: x2, y });
    return this;
  }
  _eachAncestorReverse(func, top) {
    let family = [], parent = this.getParent(), len, n;
    if (top && top._id === this._id) {
      return;
    }
    family.unshift(this);
    while (parent && (!top || parent._id !== top._id)) {
      family.unshift(parent);
      parent = parent.parent;
    }
    len = family.length;
    for (n = 0; n < len; n++) {
      func(family[n]);
    }
  }
  rotate(theta) {
    this.rotation(this.rotation() + theta);
    return this;
  }
  moveToTop() {
    if (!this.parent) {
      Util.warn("Node has no parent. moveToTop function is ignored.");
      return false;
    }
    const index = this.index, len = this.parent.getChildren().length;
    if (index < len - 1) {
      this.parent.children.splice(index, 1);
      this.parent.children.push(this);
      this.parent._setChildrenIndices();
      return true;
    }
    return false;
  }
  moveUp() {
    if (!this.parent) {
      Util.warn("Node has no parent. moveUp function is ignored.");
      return false;
    }
    const index = this.index, len = this.parent.getChildren().length;
    if (index < len - 1) {
      this.parent.children.splice(index, 1);
      this.parent.children.splice(index + 1, 0, this);
      this.parent._setChildrenIndices();
      return true;
    }
    return false;
  }
  moveDown() {
    if (!this.parent) {
      Util.warn("Node has no parent. moveDown function is ignored.");
      return false;
    }
    const index = this.index;
    if (index > 0) {
      this.parent.children.splice(index, 1);
      this.parent.children.splice(index - 1, 0, this);
      this.parent._setChildrenIndices();
      return true;
    }
    return false;
  }
  moveToBottom() {
    if (!this.parent) {
      Util.warn("Node has no parent. moveToBottom function is ignored.");
      return false;
    }
    const index = this.index;
    if (index > 0) {
      this.parent.children.splice(index, 1);
      this.parent.children.unshift(this);
      this.parent._setChildrenIndices();
      return true;
    }
    return false;
  }
  setZIndex(zIndex) {
    if (!this.parent) {
      Util.warn("Node has no parent. zIndex parameter is ignored.");
      return this;
    }
    if (zIndex < 0 || zIndex >= this.parent.children.length) {
      Util.warn("Unexpected value " + zIndex + " for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to " + (this.parent.children.length - 1) + ".");
    }
    const index = this.index;
    this.parent.children.splice(index, 1);
    this.parent.children.splice(zIndex, 0, this);
    this.parent._setChildrenIndices();
    return this;
  }
  getAbsoluteOpacity() {
    return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
  }
  _getAbsoluteOpacity() {
    let absOpacity = this.opacity();
    const parent = this.getParent();
    if (parent && !parent._isUnderCache) {
      absOpacity *= parent.getAbsoluteOpacity();
    }
    return absOpacity;
  }
  moveTo(newContainer) {
    if (this.getParent() !== newContainer) {
      this._remove();
      newContainer.add(this);
    }
    return this;
  }
  toObject() {
    let attrs = this.getAttrs(), key, val, getter, defaultValue, nonPlainObject;
    const obj = {
      attrs: {},
      className: this.getClassName()
    };
    for (key in attrs) {
      val = attrs[key];
      nonPlainObject = Util.isObject(val) && !Util._isPlainObject(val) && !Util._isArray(val);
      if (nonPlainObject) {
        continue;
      }
      getter = typeof this[key] === "function" && this[key];
      delete attrs[key];
      defaultValue = getter ? getter.call(this) : null;
      attrs[key] = val;
      if (defaultValue !== val) {
        obj.attrs[key] = val;
      }
    }
    return Util._prepareToStringify(obj);
  }
  toJSON() {
    return JSON.stringify(this.toObject());
  }
  getParent() {
    return this.parent;
  }
  findAncestors(selector, includeSelf, stopNode) {
    const res = [];
    if (includeSelf && this._isMatch(selector)) {
      res.push(this);
    }
    let ancestor = this.parent;
    while (ancestor) {
      if (ancestor === stopNode) {
        return res;
      }
      if (ancestor._isMatch(selector)) {
        res.push(ancestor);
      }
      ancestor = ancestor.parent;
    }
    return res;
  }
  isAncestorOf(node) {
    return false;
  }
  findAncestor(selector, includeSelf, stopNode) {
    return this.findAncestors(selector, includeSelf, stopNode)[0];
  }
  _isMatch(selector) {
    if (!selector) {
      return false;
    }
    if (typeof selector === "function") {
      return selector(this);
    }
    let selectorArr = selector.replace(/ /g, "").split(","), len = selectorArr.length, n, sel;
    for (n = 0; n < len; n++) {
      sel = selectorArr[n];
      if (!Util.isValidSelector(sel)) {
        Util.warn('Selector "' + sel + '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".');
        Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".');
        Util.warn("Konva is awesome, right?");
      }
      if (sel.charAt(0) === "#") {
        if (this.id() === sel.slice(1)) {
          return true;
        }
      } else if (sel.charAt(0) === ".") {
        if (this.hasName(sel.slice(1))) {
          return true;
        }
      } else if (this.className === sel || this.nodeType === sel) {
        return true;
      }
    }
    return false;
  }
  getLayer() {
    const parent = this.getParent();
    return parent ? parent.getLayer() : null;
  }
  getStage() {
    return this._getCache(STAGE$1, this._getStage);
  }
  _getStage() {
    const parent = this.getParent();
    if (parent) {
      return parent.getStage();
    } else {
      return null;
    }
  }
  fire(eventType, evt = {}, bubble) {
    evt.target = evt.target || this;
    if (bubble) {
      this._fireAndBubble(eventType, evt);
    } else {
      this._fire(eventType, evt);
    }
    return this;
  }
  getAbsoluteTransform(top) {
    if (top) {
      return this._getAbsoluteTransform(top);
    } else {
      return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
    }
  }
  _getAbsoluteTransform(top) {
    let at;
    if (top) {
      at = new Transform();
      this._eachAncestorReverse(function(node) {
        const transformsEnabled = node.transformsEnabled();
        if (transformsEnabled === "all") {
          at.multiply(node.getTransform());
        } else if (transformsEnabled === "position") {
          at.translate(node.x() - node.offsetX(), node.y() - node.offsetY());
        }
      }, top);
      return at;
    } else {
      at = this._cache.get(ABSOLUTE_TRANSFORM) || new Transform();
      if (this.parent) {
        this.parent.getAbsoluteTransform().copyInto(at);
      } else {
        at.reset();
      }
      const transformsEnabled = this.transformsEnabled();
      if (transformsEnabled === "all") {
        at.multiply(this.getTransform());
      } else if (transformsEnabled === "position") {
        const x2 = this.attrs.x || 0;
        const y = this.attrs.y || 0;
        const offsetX = this.attrs.offsetX || 0;
        const offsetY = this.attrs.offsetY || 0;
        at.translate(x2 - offsetX, y - offsetY);
      }
      at.dirty = false;
      return at;
    }
  }
  getAbsoluteScale(top) {
    let parent = this;
    while (parent) {
      if (parent._isUnderCache) {
        top = parent;
      }
      parent = parent.getParent();
    }
    const transform = this.getAbsoluteTransform(top);
    const attrs = transform.decompose();
    return {
      x: attrs.scaleX,
      y: attrs.scaleY
    };
  }
  getAbsoluteRotation() {
    return this.getAbsoluteTransform().decompose().rotation;
  }
  getTransform() {
    return this._getCache(TRANSFORM, this._getTransform);
  }
  _getTransform() {
    var _a, _b;
    const m2 = this._cache.get(TRANSFORM) || new Transform();
    m2.reset();
    const x2 = this.x(), y = this.y(), rotation = Konva$1.getAngle(this.rotation()), scaleX = (_a = this.attrs.scaleX) !== null && _a !== void 0 ? _a : 1, scaleY = (_b = this.attrs.scaleY) !== null && _b !== void 0 ? _b : 1, skewX = this.attrs.skewX || 0, skewY = this.attrs.skewY || 0, offsetX = this.attrs.offsetX || 0, offsetY = this.attrs.offsetY || 0;
    if (x2 !== 0 || y !== 0) {
      m2.translate(x2, y);
    }
    if (rotation !== 0) {
      m2.rotate(rotation);
    }
    if (skewX !== 0 || skewY !== 0) {
      m2.skew(skewX, skewY);
    }
    if (scaleX !== 1 || scaleY !== 1) {
      m2.scale(scaleX, scaleY);
    }
    if (offsetX !== 0 || offsetY !== 0) {
      m2.translate(-1 * offsetX, -1 * offsetY);
    }
    m2.dirty = false;
    return m2;
  }
  clone(obj) {
    let attrs = Util.cloneObject(this.attrs), key, allListeners, len, n, listener;
    for (key in obj) {
      attrs[key] = obj[key];
    }
    const node = new this.constructor(attrs);
    for (key in this.eventListeners) {
      allListeners = this.eventListeners[key];
      len = allListeners.length;
      for (n = 0; n < len; n++) {
        listener = allListeners[n];
        if (listener.name.indexOf(KONVA) < 0) {
          if (!node.eventListeners[key]) {
            node.eventListeners[key] = [];
          }
          node.eventListeners[key].push(listener);
        }
      }
    }
    return node;
  }
  _toKonvaCanvas(config) {
    config = config || {};
    const box = this.getClientRect();
    const stage = this.getStage(), x2 = config.x !== void 0 ? config.x : Math.floor(box.x), y = config.y !== void 0 ? config.y : Math.floor(box.y), pixelRatio = config.pixelRatio || 1, canvas = new SceneCanvas({
      width: config.width || Math.ceil(box.width) || (stage ? stage.width() : 0),
      height: config.height || Math.ceil(box.height) || (stage ? stage.height() : 0),
      pixelRatio
    }), context = canvas.getContext();
    const bufferCanvas = new SceneCanvas({
      width: canvas.width / canvas.pixelRatio + Math.abs(x2),
      height: canvas.height / canvas.pixelRatio + Math.abs(y),
      pixelRatio: canvas.pixelRatio
    });
    if (config.imageSmoothingEnabled === false) {
      context._context.imageSmoothingEnabled = false;
    }
    context.save();
    if (x2 || y) {
      context.translate(-1 * x2, -1 * y);
    }
    this.drawScene(canvas, void 0, bufferCanvas);
    context.restore();
    return canvas;
  }
  toCanvas(config) {
    return this._toKonvaCanvas(config)._canvas;
  }
  toDataURL(config) {
    config = config || {};
    const mimeType = config.mimeType || null, quality = config.quality || null;
    const url = this._toKonvaCanvas(config).toDataURL(mimeType, quality);
    if (config.callback) {
      config.callback(url);
    }
    return url;
  }
  toImage(config) {
    return new Promise((resolve, reject) => {
      try {
        const callback = config === null || config === void 0 ? void 0 : config.callback;
        if (callback)
          delete config.callback;
        Util._urlToImage(this.toDataURL(config), function(img) {
          resolve(img);
          callback === null || callback === void 0 ? void 0 : callback(img);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  toBlob(config) {
    return new Promise((resolve, reject) => {
      try {
        const callback = config === null || config === void 0 ? void 0 : config.callback;
        if (callback)
          delete config.callback;
        this.toCanvas(config).toBlob((blob) => {
          resolve(blob);
          callback === null || callback === void 0 ? void 0 : callback(blob);
        }, config === null || config === void 0 ? void 0 : config.mimeType, config === null || config === void 0 ? void 0 : config.quality);
      } catch (err) {
        reject(err);
      }
    });
  }
  setSize(size) {
    this.width(size.width);
    this.height(size.height);
    return this;
  }
  getSize() {
    return {
      width: this.width(),
      height: this.height()
    };
  }
  getClassName() {
    return this.className || this.nodeType;
  }
  getType() {
    return this.nodeType;
  }
  getDragDistance() {
    if (this.attrs.dragDistance !== void 0) {
      return this.attrs.dragDistance;
    } else if (this.parent) {
      return this.parent.getDragDistance();
    } else {
      return Konva$1.dragDistance;
    }
  }
  _off(type, name, callback) {
    let evtListeners = this.eventListeners[type], i, evtName, handler;
    for (i = 0; i < evtListeners.length; i++) {
      evtName = evtListeners[i].name;
      handler = evtListeners[i].handler;
      if ((evtName !== "konva" || name === "konva") && (!name || evtName === name) && (!callback || callback === handler)) {
        evtListeners.splice(i, 1);
        if (evtListeners.length === 0) {
          delete this.eventListeners[type];
          break;
        }
        i--;
      }
    }
  }
  _fireChangeEvent(attr, oldVal, newVal) {
    this._fire(attr + CHANGE, {
      oldVal,
      newVal
    });
  }
  addName(name) {
    if (!this.hasName(name)) {
      const oldName = this.name();
      const newName = oldName ? oldName + " " + name : name;
      this.name(newName);
    }
    return this;
  }
  hasName(name) {
    if (!name) {
      return false;
    }
    const fullName = this.name();
    if (!fullName) {
      return false;
    }
    const names = (fullName || "").split(/\s/g);
    return names.indexOf(name) !== -1;
  }
  removeName(name) {
    const names = (this.name() || "").split(/\s/g);
    const index = names.indexOf(name);
    if (index !== -1) {
      names.splice(index, 1);
      this.name(names.join(" "));
    }
    return this;
  }
  setAttr(attr, val) {
    const func = this[SET + Util._capitalize(attr)];
    if (Util._isFunction(func)) {
      func.call(this, val);
    } else {
      this._setAttr(attr, val);
    }
    return this;
  }
  _requestDraw() {
    if (Konva$1.autoDrawEnabled) {
      const drawNode = this.getLayer() || this.getStage();
      drawNode === null || drawNode === void 0 ? void 0 : drawNode.batchDraw();
    }
  }
  _setAttr(key, val) {
    const oldVal = this.attrs[key];
    if (oldVal === val && !Util.isObject(val)) {
      return;
    }
    if (val === void 0 || val === null) {
      delete this.attrs[key];
    } else {
      this.attrs[key] = val;
    }
    if (this._shouldFireChangeEvents) {
      this._fireChangeEvent(key, oldVal, val);
    }
    this._requestDraw();
  }
  _setComponentAttr(key, component, val) {
    let oldVal;
    if (val !== void 0) {
      oldVal = this.attrs[key];
      if (!oldVal) {
        this.attrs[key] = this.getAttr(key);
      }
      this.attrs[key][component] = val;
      this._fireChangeEvent(key, oldVal, val);
    }
  }
  _fireAndBubble(eventType, evt, compareShape) {
    if (evt && this.nodeType === SHAPE) {
      evt.target = this;
    }
    const nonBubbling = [
      MOUSEENTER$1,
      MOUSELEAVE$1,
      POINTERENTER$1,
      POINTERLEAVE$1,
      TOUCHENTER,
      TOUCHLEAVE
    ];
    const shouldStop = nonBubbling.indexOf(eventType) !== -1 && (compareShape && (this === compareShape || this.isAncestorOf && this.isAncestorOf(compareShape)) || this.nodeType === "Stage" && !compareShape);
    if (!shouldStop) {
      this._fire(eventType, evt);
      const stopBubble = nonBubbling.indexOf(eventType) !== -1 && compareShape && compareShape.isAncestorOf && compareShape.isAncestorOf(this) && !compareShape.isAncestorOf(this.parent);
      if ((evt && !evt.cancelBubble || !evt) && this.parent && this.parent.isListening() && !stopBubble) {
        if (compareShape && compareShape.parent) {
          this._fireAndBubble.call(this.parent, eventType, evt, compareShape);
        } else {
          this._fireAndBubble.call(this.parent, eventType, evt);
        }
      }
    }
  }
  _getProtoListeners(eventType) {
    var _a, _b;
    const { nodeType } = this;
    const allListeners = Node.protoListenerMap.get(nodeType) || {};
    let events = allListeners === null || allListeners === void 0 ? void 0 : allListeners[eventType];
    if (events === void 0) {
      events = [];
      let obj = Object.getPrototypeOf(this);
      while (obj) {
        const hierarchyEvents = (_b = (_a = obj.eventListeners) === null || _a === void 0 ? void 0 : _a[eventType]) !== null && _b !== void 0 ? _b : [];
        events.push(...hierarchyEvents);
        obj = Object.getPrototypeOf(obj);
      }
      allListeners[eventType] = events;
      Node.protoListenerMap.set(nodeType, allListeners);
    }
    return events;
  }
  _fire(eventType, evt) {
    evt = evt || {};
    evt.currentTarget = this;
    evt.type = eventType;
    const topListeners = this._getProtoListeners(eventType);
    if (topListeners) {
      for (let i = 0; i < topListeners.length; i++) {
        topListeners[i].handler.call(this, evt);
      }
    }
    const selfListeners = this.eventListeners[eventType];
    if (selfListeners) {
      for (let i = 0; i < selfListeners.length; i++) {
        selfListeners[i].handler.call(this, evt);
      }
    }
  }
  draw() {
    this.drawScene();
    this.drawHit();
    return this;
  }
  _createDragElement(evt) {
    const pointerId = evt ? evt.pointerId : void 0;
    const stage = this.getStage();
    const ap = this.getAbsolutePosition();
    if (!stage) {
      return;
    }
    const pos = stage._getPointerById(pointerId) || stage._changedPointerPositions[0] || ap;
    DD._dragElements.set(this._id, {
      node: this,
      startPointerPos: pos,
      offset: {
        x: pos.x - ap.x,
        y: pos.y - ap.y
      },
      dragStatus: "ready",
      pointerId,
      startEvent: evt
    });
  }
  startDrag(evt, bubbleEvent = true) {
    if (!DD._dragElements.has(this._id)) {
      this._createDragElement(evt);
    }
    const elem = DD._dragElements.get(this._id);
    elem.dragStatus = "dragging";
    this.fire("dragstart", {
      type: "dragstart",
      target: this,
      evt: elem.startEvent && elem.startEvent.evt || evt && evt.evt
    }, bubbleEvent);
  }
  _setDragPosition(evt, elem) {
    const pos = this.getStage()._getPointerById(elem.pointerId);
    if (!pos) {
      return;
    }
    let newNodePos = {
      x: pos.x - elem.offset.x,
      y: pos.y - elem.offset.y
    };
    const dbf = this.dragBoundFunc();
    if (dbf !== void 0) {
      const bounded = dbf.call(this, newNodePos, evt);
      if (!bounded) {
        Util.warn("dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.");
      } else {
        newNodePos = bounded;
      }
    }
    if (!this._lastPos || this._lastPos.x !== newNodePos.x || this._lastPos.y !== newNodePos.y) {
      this.setAbsolutePosition(newNodePos);
      this._requestDraw();
    }
    this._lastPos = newNodePos;
  }
  stopDrag(evt) {
    const elem = DD._dragElements.get(this._id);
    if (elem) {
      elem.dragStatus = "stopped";
    }
    DD._endDragBefore(evt);
    DD._endDragAfter(evt);
  }
  setDraggable(draggable) {
    this._setAttr("draggable", draggable);
    this._dragChange();
  }
  isDragging() {
    const elem = DD._dragElements.get(this._id);
    return elem ? elem.dragStatus === "dragging" : false;
  }
  _listenDrag() {
    this._dragCleanup();
    this.on("mousedown.konva touchstart.konva", function(evt) {
      const shouldCheckButton = evt.evt["button"] !== void 0;
      const canDrag = !shouldCheckButton || Konva$1.dragButtons.indexOf(evt.evt["button"]) >= 0;
      if (!canDrag) {
        return;
      }
      if (this.isDragging()) {
        return;
      }
      let hasDraggingChild = false;
      DD._dragElements.forEach((elem) => {
        if (this.isAncestorOf(elem.node)) {
          hasDraggingChild = true;
        }
      });
      if (!hasDraggingChild) {
        this._createDragElement(evt);
      }
    });
  }
  _dragChange() {
    if (this.attrs.draggable) {
      this._listenDrag();
    } else {
      this._dragCleanup();
      const stage = this.getStage();
      if (!stage) {
        return;
      }
      const dragElement = DD._dragElements.get(this._id);
      const isDragging = dragElement && dragElement.dragStatus === "dragging";
      const isReady = dragElement && dragElement.dragStatus === "ready";
      if (isDragging) {
        this.stopDrag();
      } else if (isReady) {
        DD._dragElements.delete(this._id);
      }
    }
  }
  _dragCleanup() {
    this.off("mousedown.konva");
    this.off("touchstart.konva");
  }
  isClientRectOnScreen(margin = { x: 0, y: 0 }) {
    const stage = this.getStage();
    if (!stage) {
      return false;
    }
    const screenRect = {
      x: -margin.x,
      y: -margin.y,
      width: stage.width() + 2 * margin.x,
      height: stage.height() + 2 * margin.y
    };
    return Util.haveIntersection(screenRect, this.getClientRect());
  }
  static create(data, container) {
    if (Util._isString(data)) {
      data = JSON.parse(data);
    }
    return this._createNode(data, container);
  }
  static _createNode(obj, container) {
    let className = Node.prototype.getClassName.call(obj), children = obj.children, no, len, n;
    if (container) {
      obj.attrs.container = container;
    }
    if (!Konva$1[className]) {
      Util.warn('Can not find a node with class name "' + className + '". Fallback to "Shape".');
      className = "Shape";
    }
    const Class = Konva$1[className];
    no = new Class(obj.attrs);
    if (children) {
      len = children.length;
      for (n = 0; n < len; n++) {
        no.add(Node._createNode(children[n]));
      }
    }
    return no;
  }
}
Node.protoListenerMap = /* @__PURE__ */ new Map();
Node.prototype.nodeType = "Node";
Node.prototype._attrsAffectingSize = [];
Node.prototype.eventListeners = {};
Node.prototype.on(TRANSFORM_CHANGE_STR$1, function() {
  if (this._batchingTransformChange) {
    this._needClearTransformCache = true;
    return;
  }
  this._clearCache(TRANSFORM);
  this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
});
Node.prototype.on("visibleChange.konva", function() {
  this._clearSelfAndDescendantCache(VISIBLE);
});
Node.prototype.on("listeningChange.konva", function() {
  this._clearSelfAndDescendantCache(LISTENING);
});
Node.prototype.on("opacityChange.konva", function() {
  this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
});
const addGetterSetter = Factory.addGetterSetter;
addGetterSetter(Node, "zIndex");
addGetterSetter(Node, "absolutePosition");
addGetterSetter(Node, "position");
addGetterSetter(Node, "x", 0, getNumberValidator());
addGetterSetter(Node, "y", 0, getNumberValidator());
addGetterSetter(Node, "globalCompositeOperation", "source-over", getStringValidator());
addGetterSetter(Node, "opacity", 1, getNumberValidator());
addGetterSetter(Node, "name", "", getStringValidator());
addGetterSetter(Node, "id", "", getStringValidator());
addGetterSetter(Node, "rotation", 0, getNumberValidator());
Factory.addComponentsGetterSetter(Node, "scale", ["x", "y"]);
addGetterSetter(Node, "scaleX", 1, getNumberValidator());
addGetterSetter(Node, "scaleY", 1, getNumberValidator());
Factory.addComponentsGetterSetter(Node, "skew", ["x", "y"]);
addGetterSetter(Node, "skewX", 0, getNumberValidator());
addGetterSetter(Node, "skewY", 0, getNumberValidator());
Factory.addComponentsGetterSetter(Node, "offset", ["x", "y"]);
addGetterSetter(Node, "offsetX", 0, getNumberValidator());
addGetterSetter(Node, "offsetY", 0, getNumberValidator());
addGetterSetter(Node, "dragDistance", void 0, getNumberValidator());
addGetterSetter(Node, "width", 0, getNumberValidator());
addGetterSetter(Node, "height", 0, getNumberValidator());
addGetterSetter(Node, "listening", true, getBooleanValidator());
addGetterSetter(Node, "preventDefault", true, getBooleanValidator());
addGetterSetter(Node, "filters", void 0, function(val) {
  this._filterUpToDate = false;
  return val;
});
addGetterSetter(Node, "visible", true, getBooleanValidator());
addGetterSetter(Node, "transformsEnabled", "all", getStringValidator());
addGetterSetter(Node, "size");
addGetterSetter(Node, "dragBoundFunc");
addGetterSetter(Node, "draggable", false, getBooleanValidator());
Factory.backCompat(Node, {
  rotateDeg: "rotate",
  setRotationDeg: "setRotation",
  getRotationDeg: "getRotation"
});
class Container extends Node {
  constructor() {
    super(...arguments);
    this.children = [];
  }
  getChildren(filterFunc) {
    const children = this.children || [];
    if (filterFunc) {
      return children.filter(filterFunc);
    }
    return children;
  }
  hasChildren() {
    return this.getChildren().length > 0;
  }
  removeChildren() {
    this.getChildren().forEach((child) => {
      child.parent = null;
      child.index = 0;
      child.remove();
    });
    this.children = [];
    this._requestDraw();
    return this;
  }
  destroyChildren() {
    this.getChildren().forEach((child) => {
      child.parent = null;
      child.index = 0;
      child.destroy();
    });
    this.children = [];
    this._requestDraw();
    return this;
  }
  add(...children) {
    if (children.length === 0) {
      return this;
    }
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.add(children[i]);
      }
      return this;
    }
    const child = children[0];
    if (child.getParent()) {
      child.moveTo(this);
      return this;
    }
    this._validateAdd(child);
    child.index = this.getChildren().length;
    child.parent = this;
    child._clearCaches();
    this.getChildren().push(child);
    this._fire("add", {
      child
    });
    this._requestDraw();
    return this;
  }
  destroy() {
    if (this.hasChildren()) {
      this.destroyChildren();
    }
    super.destroy();
    return this;
  }
  find(selector) {
    return this._generalFind(selector, false);
  }
  findOne(selector) {
    const result = this._generalFind(selector, true);
    return result.length > 0 ? result[0] : void 0;
  }
  _generalFind(selector, findOne) {
    const retArr = [];
    this._descendants((node) => {
      const valid = node._isMatch(selector);
      if (valid) {
        retArr.push(node);
      }
      if (valid && findOne) {
        return true;
      }
      return false;
    });
    return retArr;
  }
  _descendants(fn) {
    let shouldStop = false;
    const children = this.getChildren();
    for (const child of children) {
      shouldStop = fn(child);
      if (shouldStop) {
        return true;
      }
      if (!child.hasChildren()) {
        continue;
      }
      shouldStop = child._descendants(fn);
      if (shouldStop) {
        return true;
      }
    }
    return false;
  }
  toObject() {
    const obj = Node.prototype.toObject.call(this);
    obj.children = [];
    this.getChildren().forEach((child) => {
      obj.children.push(child.toObject());
    });
    return obj;
  }
  isAncestorOf(node) {
    let parent = node.getParent();
    while (parent) {
      if (parent._id === this._id) {
        return true;
      }
      parent = parent.getParent();
    }
    return false;
  }
  clone(obj) {
    const node = Node.prototype.clone.call(this, obj);
    this.getChildren().forEach(function(no) {
      node.add(no.clone());
    });
    return node;
  }
  getAllIntersections(pos) {
    const arr = [];
    this.find("Shape").forEach((shape) => {
      if (shape.isVisible() && shape.intersects(pos)) {
        arr.push(shape);
      }
    });
    return arr;
  }
  _clearSelfAndDescendantCache(attr) {
    var _a;
    super._clearSelfAndDescendantCache(attr);
    if (this.isCached()) {
      return;
    }
    (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function(node) {
      node._clearSelfAndDescendantCache(attr);
    });
  }
  _setChildrenIndices() {
    var _a;
    (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function(child, n) {
      child.index = n;
    });
    this._requestDraw();
  }
  drawScene(can, top, bufferCanvas) {
    const layer = this.getLayer(), canvas = can || layer && layer.getCanvas(), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;
    const caching = canvas && canvas.isCache;
    if (!this.isVisible() && !caching) {
      return this;
    }
    if (cachedSceneCanvas) {
      context.save();
      const m2 = this.getAbsoluteTransform(top).getMatrix();
      context.transform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
      this._drawCachedSceneCanvas(context);
      context.restore();
    } else {
      this._drawChildren("drawScene", canvas, top, bufferCanvas);
    }
    return this;
  }
  drawHit(can, top) {
    if (!this.shouldDrawHit(top)) {
      return this;
    }
    const layer = this.getLayer(), canvas = can || layer && layer.hitCanvas, context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
    if (cachedHitCanvas) {
      context.save();
      const m2 = this.getAbsoluteTransform(top).getMatrix();
      context.transform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
      this._drawCachedHitCanvas(context);
      context.restore();
    } else {
      this._drawChildren("drawHit", canvas, top);
    }
    return this;
  }
  _drawChildren(drawMethod, canvas, top, bufferCanvas) {
    var _a;
    const context = canvas && canvas.getContext(), clipWidth = this.clipWidth(), clipHeight = this.clipHeight(), clipFunc = this.clipFunc(), hasClip = typeof clipWidth === "number" && typeof clipHeight === "number" || clipFunc;
    const selfCache = top === this;
    if (hasClip) {
      context.save();
      const transform = this.getAbsoluteTransform(top);
      let m2 = transform.getMatrix();
      context.transform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
      context.beginPath();
      let clipArgs;
      if (clipFunc) {
        clipArgs = clipFunc.call(this, context, this);
      } else {
        const clipX = this.clipX();
        const clipY = this.clipY();
        context.rect(clipX || 0, clipY || 0, clipWidth, clipHeight);
      }
      context.clip.apply(context, clipArgs);
      m2 = transform.copy().invert().getMatrix();
      context.transform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
    }
    const hasComposition = !selfCache && this.globalCompositeOperation() !== "source-over" && drawMethod === "drawScene";
    if (hasComposition) {
      context.save();
      context._applyGlobalCompositeOperation(this);
    }
    (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function(child) {
      child[drawMethod](canvas, top, bufferCanvas);
    });
    if (hasComposition) {
      context.restore();
    }
    if (hasClip) {
      context.restore();
    }
  }
  getClientRect(config = {}) {
    var _a;
    const skipTransform = config.skipTransform;
    const relativeTo = config.relativeTo;
    let minX, minY, maxX, maxY;
    let selfRect = {
      x: Infinity,
      y: Infinity,
      width: 0,
      height: 0
    };
    const that = this;
    (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function(child) {
      if (!child.visible()) {
        return;
      }
      const rect = child.getClientRect({
        relativeTo: that,
        skipShadow: config.skipShadow,
        skipStroke: config.skipStroke
      });
      if (rect.width === 0 && rect.height === 0) {
        return;
      }
      if (minX === void 0) {
        minX = rect.x;
        minY = rect.y;
        maxX = rect.x + rect.width;
        maxY = rect.y + rect.height;
      } else {
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
      }
    });
    const shapes2 = this.find("Shape");
    let hasVisible = false;
    for (let i = 0; i < shapes2.length; i++) {
      const shape = shapes2[i];
      if (shape._isVisible(this)) {
        hasVisible = true;
        break;
      }
    }
    if (hasVisible && minX !== void 0) {
      selfRect = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    } else {
      selfRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }
    if (!skipTransform) {
      return this._transformedRect(selfRect, relativeTo);
    }
    return selfRect;
  }
}
Factory.addComponentsGetterSetter(Container, "clip", [
  "x",
  "y",
  "width",
  "height"
]);
Factory.addGetterSetter(Container, "clipX", void 0, getNumberValidator());
Factory.addGetterSetter(Container, "clipY", void 0, getNumberValidator());
Factory.addGetterSetter(Container, "clipWidth", void 0, getNumberValidator());
Factory.addGetterSetter(Container, "clipHeight", void 0, getNumberValidator());
Factory.addGetterSetter(Container, "clipFunc");
const Captures = /* @__PURE__ */ new Map();
const SUPPORT_POINTER_EVENTS = Konva$1._global["PointerEvent"] !== void 0;
function getCapturedShape(pointerId) {
  return Captures.get(pointerId);
}
function createEvent(evt) {
  return {
    evt,
    pointerId: evt.pointerId
  };
}
function hasPointerCapture(pointerId, shape) {
  return Captures.get(pointerId) === shape;
}
function setPointerCapture(pointerId, shape) {
  releaseCapture(pointerId);
  const stage = shape.getStage();
  if (!stage)
    return;
  Captures.set(pointerId, shape);
  if (SUPPORT_POINTER_EVENTS) {
    shape._fire("gotpointercapture", createEvent(new PointerEvent("gotpointercapture")));
  }
}
function releaseCapture(pointerId, target) {
  const shape = Captures.get(pointerId);
  if (!shape)
    return;
  const stage = shape.getStage();
  if (stage && stage.content) ;
  Captures.delete(pointerId);
  if (SUPPORT_POINTER_EVENTS) {
    shape._fire("lostpointercapture", createEvent(new PointerEvent("lostpointercapture")));
  }
}
const STAGE = "Stage", STRING = "string", PX = "px", MOUSEOUT = "mouseout", MOUSELEAVE = "mouseleave", MOUSEOVER = "mouseover", MOUSEENTER = "mouseenter", MOUSEMOVE = "mousemove", MOUSEDOWN = "mousedown", MOUSEUP = "mouseup", POINTERMOVE = "pointermove", POINTERDOWN = "pointerdown", POINTERUP = "pointerup", POINTERCANCEL = "pointercancel", LOSTPOINTERCAPTURE = "lostpointercapture", POINTEROUT = "pointerout", POINTERLEAVE = "pointerleave", POINTEROVER = "pointerover", POINTERENTER = "pointerenter", CONTEXTMENU = "contextmenu", TOUCHSTART = "touchstart", TOUCHEND = "touchend", TOUCHMOVE = "touchmove", TOUCHCANCEL = "touchcancel", WHEEL = "wheel", MAX_LAYERS_NUMBER = 5, EVENTS = [
  [MOUSEENTER, "_pointerenter"],
  [MOUSEDOWN, "_pointerdown"],
  [MOUSEMOVE, "_pointermove"],
  [MOUSEUP, "_pointerup"],
  [MOUSELEAVE, "_pointerleave"],
  [TOUCHSTART, "_pointerdown"],
  [TOUCHMOVE, "_pointermove"],
  [TOUCHEND, "_pointerup"],
  [TOUCHCANCEL, "_pointercancel"],
  [MOUSEOVER, "_pointerover"],
  [WHEEL, "_wheel"],
  [CONTEXTMENU, "_contextmenu"],
  [POINTERDOWN, "_pointerdown"],
  [POINTERMOVE, "_pointermove"],
  [POINTERUP, "_pointerup"],
  [POINTERCANCEL, "_pointercancel"],
  [POINTERLEAVE, "_pointerleave"],
  [LOSTPOINTERCAPTURE, "_lostpointercapture"]
];
const EVENTS_MAP = {
  mouse: {
    [POINTEROUT]: MOUSEOUT,
    [POINTERLEAVE]: MOUSELEAVE,
    [POINTEROVER]: MOUSEOVER,
    [POINTERENTER]: MOUSEENTER,
    [POINTERMOVE]: MOUSEMOVE,
    [POINTERDOWN]: MOUSEDOWN,
    [POINTERUP]: MOUSEUP,
    [POINTERCANCEL]: "mousecancel",
    pointerclick: "click",
    pointerdblclick: "dblclick"
  },
  touch: {
    [POINTEROUT]: "touchout",
    [POINTERLEAVE]: "touchleave",
    [POINTEROVER]: "touchover",
    [POINTERENTER]: "touchenter",
    [POINTERMOVE]: TOUCHMOVE,
    [POINTERDOWN]: TOUCHSTART,
    [POINTERUP]: TOUCHEND,
    [POINTERCANCEL]: TOUCHCANCEL,
    pointerclick: "tap",
    pointerdblclick: "dbltap"
  },
  pointer: {
    [POINTEROUT]: POINTEROUT,
    [POINTERLEAVE]: POINTERLEAVE,
    [POINTEROVER]: POINTEROVER,
    [POINTERENTER]: POINTERENTER,
    [POINTERMOVE]: POINTERMOVE,
    [POINTERDOWN]: POINTERDOWN,
    [POINTERUP]: POINTERUP,
    [POINTERCANCEL]: POINTERCANCEL,
    pointerclick: "pointerclick",
    pointerdblclick: "pointerdblclick"
  }
};
const getEventType = (type) => {
  if (type.indexOf("pointer") >= 0) {
    return "pointer";
  }
  if (type.indexOf("touch") >= 0) {
    return "touch";
  }
  return "mouse";
};
const getEventsMap = (eventType) => {
  const type = getEventType(eventType);
  if (type === "pointer") {
    return Konva$1.pointerEventsEnabled && EVENTS_MAP.pointer;
  }
  if (type === "touch") {
    return EVENTS_MAP.touch;
  }
  if (type === "mouse") {
    return EVENTS_MAP.mouse;
  }
};
function checkNoClip(attrs = {}) {
  if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
    Util.warn("Stage does not support clipping. Please use clip for Layers or Groups.");
  }
  return attrs;
}
const NO_POINTERS_MESSAGE = `Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);`;
const stages = [];
let Stage$1 = class Stage extends Container {
  constructor(config) {
    super(checkNoClip(config));
    this._pointerPositions = [];
    this._changedPointerPositions = [];
    this._buildDOM();
    this._bindContentEvents();
    stages.push(this);
    this.on("widthChange.konva heightChange.konva", this._resizeDOM);
    this.on("visibleChange.konva", this._checkVisibility);
    this.on("clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva", () => {
      checkNoClip(this.attrs);
    });
    this._checkVisibility();
  }
  _validateAdd(child) {
    const isLayer = child.getType() === "Layer";
    const isFastLayer = child.getType() === "FastLayer";
    const valid = isLayer || isFastLayer;
    if (!valid) {
      Util.throw("You may only add layers to the stage.");
    }
  }
  _checkVisibility() {
    if (!this.content) {
      return;
    }
    const style = this.visible() ? "" : "none";
    this.content.style.display = style;
  }
  setContainer(container) {
    if (typeof container === STRING) {
      let id;
      if (container.charAt(0) === ".") {
        const className = container.slice(1);
        container = document.getElementsByClassName(className)[0];
      } else {
        if (container.charAt(0) !== "#") {
          id = container;
        } else {
          id = container.slice(1);
        }
        container = document.getElementById(id);
      }
      if (!container) {
        throw "Can not find container in document with id " + id;
      }
    }
    this._setAttr("container", container);
    if (this.content) {
      if (this.content.parentElement) {
        this.content.parentElement.removeChild(this.content);
      }
      container.appendChild(this.content);
    }
    return this;
  }
  shouldDrawHit() {
    return true;
  }
  clear() {
    const layers = this.children, len = layers.length;
    for (let n = 0; n < len; n++) {
      layers[n].clear();
    }
    return this;
  }
  clone(obj) {
    if (!obj) {
      obj = {};
    }
    obj.container = typeof document !== "undefined" && document.createElement("div");
    return Container.prototype.clone.call(this, obj);
  }
  destroy() {
    super.destroy();
    const content = this.content;
    if (content && Util._isInDocument(content)) {
      this.container().removeChild(content);
    }
    const index = stages.indexOf(this);
    if (index > -1) {
      stages.splice(index, 1);
    }
    Util.releaseCanvas(this.bufferCanvas._canvas, this.bufferHitCanvas._canvas);
    return this;
  }
  getPointerPosition() {
    const pos = this._pointerPositions[0] || this._changedPointerPositions[0];
    if (!pos) {
      Util.warn(NO_POINTERS_MESSAGE);
      return null;
    }
    return {
      x: pos.x,
      y: pos.y
    };
  }
  _getPointerById(id) {
    return this._pointerPositions.find((p) => p.id === id);
  }
  getPointersPositions() {
    return this._pointerPositions;
  }
  getStage() {
    return this;
  }
  getContent() {
    return this.content;
  }
  _toKonvaCanvas(config) {
    config = { ...config };
    config.x = config.x || 0;
    config.y = config.y || 0;
    config.width = config.width || this.width();
    config.height = config.height || this.height();
    const canvas = new SceneCanvas({
      width: config.width,
      height: config.height,
      pixelRatio: config.pixelRatio || 1
    });
    const _context = canvas.getContext()._context;
    const layers = this.children;
    if (config.x || config.y) {
      _context.translate(-1 * config.x, -1 * config.y);
    }
    layers.forEach(function(layer) {
      if (!layer.isVisible()) {
        return;
      }
      const layerCanvas = layer._toKonvaCanvas(config);
      _context.drawImage(layerCanvas._canvas, config.x, config.y, layerCanvas.getWidth() / layerCanvas.getPixelRatio(), layerCanvas.getHeight() / layerCanvas.getPixelRatio());
    });
    return canvas;
  }
  getIntersection(pos) {
    if (!pos) {
      return null;
    }
    const layers = this.children, len = layers.length, end = len - 1;
    for (let n = end; n >= 0; n--) {
      const shape = layers[n].getIntersection(pos);
      if (shape) {
        return shape;
      }
    }
    return null;
  }
  _resizeDOM() {
    const width = this.width();
    const height = this.height();
    if (this.content) {
      this.content.style.width = width + PX;
      this.content.style.height = height + PX;
    }
    this.bufferCanvas.setSize(width, height);
    this.bufferHitCanvas.setSize(width, height);
    this.children.forEach((layer) => {
      layer.setSize({ width, height });
      layer.draw();
    });
  }
  add(layer, ...rest) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
      }
      return this;
    }
    super.add(layer);
    const length = this.children.length;
    if (length > MAX_LAYERS_NUMBER) {
      Util.warn("The stage has " + length + " layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group.");
    }
    layer.setSize({ width: this.width(), height: this.height() });
    layer.draw();
    if (Konva$1.isBrowser) {
      this.content.appendChild(layer.canvas._canvas);
    }
    return this;
  }
  getParent() {
    return null;
  }
  getLayer() {
    return null;
  }
  hasPointerCapture(pointerId) {
    return hasPointerCapture(pointerId, this);
  }
  setPointerCapture(pointerId) {
    setPointerCapture(pointerId, this);
  }
  releaseCapture(pointerId) {
    releaseCapture(pointerId);
  }
  getLayers() {
    return this.children;
  }
  _bindContentEvents() {
    if (!Konva$1.isBrowser) {
      return;
    }
    EVENTS.forEach(([event, methodName]) => {
      this.content.addEventListener(event, (evt) => {
        this[methodName](evt);
      }, { passive: false });
    });
  }
  _pointerenter(evt) {
    this.setPointersPositions(evt);
    const events = getEventsMap(evt.type);
    if (events) {
      this._fire(events.pointerenter, {
        evt,
        target: this,
        currentTarget: this
      });
    }
  }
  _pointerover(evt) {
    this.setPointersPositions(evt);
    const events = getEventsMap(evt.type);
    if (events) {
      this._fire(events.pointerover, {
        evt,
        target: this,
        currentTarget: this
      });
    }
  }
  _getTargetShape(evenType) {
    let shape = this[evenType + "targetShape"];
    if (shape && !shape.getStage()) {
      shape = null;
    }
    return shape;
  }
  _pointerleave(evt) {
    const events = getEventsMap(evt.type);
    const eventType = getEventType(evt.type);
    if (!events) {
      return;
    }
    this.setPointersPositions(evt);
    const targetShape = this._getTargetShape(eventType);
    const eventsEnabled = !(Konva$1.isDragging() || Konva$1.isTransforming()) || Konva$1.hitOnDragEnabled;
    if (targetShape && eventsEnabled) {
      targetShape._fireAndBubble(events.pointerout, { evt });
      targetShape._fireAndBubble(events.pointerleave, { evt });
      this._fire(events.pointerleave, {
        evt,
        target: this,
        currentTarget: this
      });
      this[eventType + "targetShape"] = null;
    } else if (eventsEnabled) {
      this._fire(events.pointerleave, {
        evt,
        target: this,
        currentTarget: this
      });
      this._fire(events.pointerout, {
        evt,
        target: this,
        currentTarget: this
      });
    }
    this.pointerPos = null;
    this._pointerPositions = [];
  }
  _pointerdown(evt) {
    const events = getEventsMap(evt.type);
    const eventType = getEventType(evt.type);
    if (!events) {
      return;
    }
    this.setPointersPositions(evt);
    let triggeredOnShape = false;
    this._changedPointerPositions.forEach((pos) => {
      const shape = this.getIntersection(pos);
      DD.justDragged = false;
      Konva$1["_" + eventType + "ListenClick"] = true;
      if (!shape || !shape.isListening()) {
        this[eventType + "ClickStartShape"] = void 0;
        return;
      }
      if (Konva$1.capturePointerEventsEnabled) {
        shape.setPointerCapture(pos.id);
      }
      this[eventType + "ClickStartShape"] = shape;
      shape._fireAndBubble(events.pointerdown, {
        evt,
        pointerId: pos.id
      });
      triggeredOnShape = true;
      const isTouch = evt.type.indexOf("touch") >= 0;
      if (shape.preventDefault() && evt.cancelable && isTouch) {
        evt.preventDefault();
      }
    });
    if (!triggeredOnShape) {
      this._fire(events.pointerdown, {
        evt,
        target: this,
        currentTarget: this,
        pointerId: this._pointerPositions[0].id
      });
    }
  }
  _pointermove(evt) {
    const events = getEventsMap(evt.type);
    const eventType = getEventType(evt.type);
    if (!events) {
      return;
    }
    const isTouchPointer = evt.type.indexOf("touch") >= 0 || evt.pointerType === "touch";
    if (Konva$1.isDragging() && DD.node.preventDefault() && evt.cancelable && isTouchPointer) {
      evt.preventDefault();
    }
    this.setPointersPositions(evt);
    const eventsEnabled = !(Konva$1.isDragging() || Konva$1.isTransforming()) || Konva$1.hitOnDragEnabled;
    if (!eventsEnabled) {
      return;
    }
    const processedShapesIds = {};
    let triggeredOnShape = false;
    const targetShape = this._getTargetShape(eventType);
    this._changedPointerPositions.forEach((pos) => {
      const shape = getCapturedShape(pos.id) || this.getIntersection(pos);
      const pointerId = pos.id;
      const event = { evt, pointerId };
      const differentTarget = targetShape !== shape;
      if (differentTarget && targetShape) {
        targetShape._fireAndBubble(events.pointerout, { ...event }, shape);
        targetShape._fireAndBubble(events.pointerleave, { ...event }, shape);
      }
      if (shape) {
        if (processedShapesIds[shape._id]) {
          return;
        }
        processedShapesIds[shape._id] = true;
      }
      if (shape && shape.isListening()) {
        triggeredOnShape = true;
        if (differentTarget) {
          shape._fireAndBubble(events.pointerover, { ...event }, targetShape);
          shape._fireAndBubble(events.pointerenter, { ...event }, targetShape);
          this[eventType + "targetShape"] = shape;
        }
        shape._fireAndBubble(events.pointermove, { ...event });
      } else {
        if (targetShape) {
          this._fire(events.pointerover, {
            evt,
            target: this,
            currentTarget: this,
            pointerId
          });
          this[eventType + "targetShape"] = null;
        }
      }
    });
    if (!triggeredOnShape) {
      this._fire(events.pointermove, {
        evt,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      });
    }
  }
  _pointerup(evt) {
    const events = getEventsMap(evt.type);
    const eventType = getEventType(evt.type);
    if (!events) {
      return;
    }
    this.setPointersPositions(evt);
    const clickStartShape = this[eventType + "ClickStartShape"];
    const clickEndShape = this[eventType + "ClickEndShape"];
    const processedShapesIds = {};
    let skipPointerUpTrigger = false;
    this._changedPointerPositions.forEach((pos) => {
      const shape = getCapturedShape(pos.id) || this.getIntersection(pos);
      if (shape) {
        shape.releaseCapture(pos.id);
        if (processedShapesIds[shape._id]) {
          return;
        }
        processedShapesIds[shape._id] = true;
      }
      const pointerId = pos.id;
      const event = { evt, pointerId };
      let fireDblClick = false;
      if (Konva$1["_" + eventType + "InDblClickWindow"]) {
        fireDblClick = true;
        clearTimeout(this[eventType + "DblTimeout"]);
      } else if (!DD.justDragged) {
        Konva$1["_" + eventType + "InDblClickWindow"] = true;
        clearTimeout(this[eventType + "DblTimeout"]);
      }
      this[eventType + "DblTimeout"] = setTimeout(function() {
        Konva$1["_" + eventType + "InDblClickWindow"] = false;
      }, Konva$1.dblClickWindow);
      if (shape && shape.isListening()) {
        skipPointerUpTrigger = true;
        this[eventType + "ClickEndShape"] = shape;
        shape._fireAndBubble(events.pointerup, { ...event });
        if (Konva$1["_" + eventType + "ListenClick"] && clickStartShape && clickStartShape === shape) {
          shape._fireAndBubble(events.pointerclick, { ...event });
          if (fireDblClick && clickEndShape && clickEndShape === shape) {
            shape._fireAndBubble(events.pointerdblclick, { ...event });
          }
        }
      } else {
        this[eventType + "ClickEndShape"] = null;
        if (!skipPointerUpTrigger) {
          this._fire(events.pointerup, {
            evt,
            target: this,
            currentTarget: this,
            pointerId: this._changedPointerPositions[0].id
          });
          skipPointerUpTrigger = true;
        }
        if (Konva$1["_" + eventType + "ListenClick"]) {
          this._fire(events.pointerclick, {
            evt,
            target: this,
            currentTarget: this,
            pointerId
          });
        }
        if (fireDblClick) {
          this._fire(events.pointerdblclick, {
            evt,
            target: this,
            currentTarget: this,
            pointerId
          });
        }
      }
    });
    if (!skipPointerUpTrigger) {
      this._fire(events.pointerup, {
        evt,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id
      });
    }
    Konva$1["_" + eventType + "ListenClick"] = false;
    if (evt.cancelable && eventType !== "touch" && eventType !== "pointer") {
      evt.preventDefault();
    }
  }
  _contextmenu(evt) {
    this.setPointersPositions(evt);
    const shape = this.getIntersection(this.getPointerPosition());
    if (shape && shape.isListening()) {
      shape._fireAndBubble(CONTEXTMENU, { evt });
    } else {
      this._fire(CONTEXTMENU, {
        evt,
        target: this,
        currentTarget: this
      });
    }
  }
  _wheel(evt) {
    this.setPointersPositions(evt);
    const shape = this.getIntersection(this.getPointerPosition());
    if (shape && shape.isListening()) {
      shape._fireAndBubble(WHEEL, { evt });
    } else {
      this._fire(WHEEL, {
        evt,
        target: this,
        currentTarget: this
      });
    }
  }
  _pointercancel(evt) {
    this.setPointersPositions(evt);
    const shape = getCapturedShape(evt.pointerId) || this.getIntersection(this.getPointerPosition());
    if (shape) {
      shape._fireAndBubble(POINTERUP, createEvent(evt));
    }
    releaseCapture(evt.pointerId);
  }
  _lostpointercapture(evt) {
    releaseCapture(evt.pointerId);
  }
  setPointersPositions(evt) {
    const contentPosition = this._getContentPosition();
    let x2 = null, y = null;
    evt = evt ? evt : window.event;
    if (evt.touches !== void 0) {
      this._pointerPositions = [];
      this._changedPointerPositions = [];
      Array.prototype.forEach.call(evt.touches, (touch) => {
        this._pointerPositions.push({
          id: touch.identifier,
          x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
          y: (touch.clientY - contentPosition.top) / contentPosition.scaleY
        });
      });
      Array.prototype.forEach.call(evt.changedTouches || evt.touches, (touch) => {
        this._changedPointerPositions.push({
          id: touch.identifier,
          x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
          y: (touch.clientY - contentPosition.top) / contentPosition.scaleY
        });
      });
    } else {
      x2 = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
      y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
      this.pointerPos = {
        x: x2,
        y
      };
      this._pointerPositions = [{ x: x2, y, id: Util._getFirstPointerId(evt) }];
      this._changedPointerPositions = [
        { x: x2, y, id: Util._getFirstPointerId(evt) }
      ];
    }
  }
  _setPointerPosition(evt) {
    Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.');
    this.setPointersPositions(evt);
  }
  _getContentPosition() {
    if (!this.content || !this.content.getBoundingClientRect) {
      return {
        top: 0,
        left: 0,
        scaleX: 1,
        scaleY: 1
      };
    }
    const rect = this.content.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      scaleX: rect.width / this.content.clientWidth || 1,
      scaleY: rect.height / this.content.clientHeight || 1
    };
  }
  _buildDOM() {
    this.bufferCanvas = new SceneCanvas({
      width: this.width(),
      height: this.height()
    });
    this.bufferHitCanvas = new HitCanvas({
      pixelRatio: 1,
      width: this.width(),
      height: this.height()
    });
    if (!Konva$1.isBrowser) {
      return;
    }
    const container = this.container();
    if (!container) {
      throw "Stage has no container. A container is required.";
    }
    container.innerHTML = "";
    this.content = document.createElement("div");
    this.content.style.position = "relative";
    this.content.style.userSelect = "none";
    this.content.className = "konvajs-content";
    this.content.setAttribute("role", "presentation");
    container.appendChild(this.content);
    this._resizeDOM();
  }
  cache() {
    Util.warn("Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.");
    return this;
  }
  clearCache() {
    return this;
  }
  batchDraw() {
    this.getChildren().forEach(function(layer) {
      layer.batchDraw();
    });
    return this;
  }
};
Stage$1.prototype.nodeType = STAGE;
_registerNode(Stage$1);
Factory.addGetterSetter(Stage$1, "container");
if (Konva$1.isBrowser) {
  document.addEventListener("visibilitychange", () => {
    stages.forEach((stage) => {
      stage.batchDraw();
    });
  });
}
const HAS_SHADOW = "hasShadow";
const SHADOW_RGBA = "shadowRGBA";
const patternImage = "patternImage";
const linearGradient = "linearGradient";
const radialGradient = "radialGradient";
let dummyContext$1;
function getDummyContext$1() {
  if (dummyContext$1) {
    return dummyContext$1;
  }
  dummyContext$1 = Util.createCanvasElement().getContext("2d");
  return dummyContext$1;
}
const shapes = {};
function _fillFunc$2(context) {
  const fillRule = this.attrs.fillRule;
  if (fillRule) {
    context.fill(fillRule);
  } else {
    context.fill();
  }
}
function _strokeFunc$2(context) {
  context.stroke();
}
function _fillFuncHit(context) {
  const fillRule = this.attrs.fillRule;
  if (fillRule) {
    context.fill(fillRule);
  } else {
    context.fill();
  }
}
function _strokeFuncHit(context) {
  context.stroke();
}
function _clearHasShadowCache() {
  this._clearCache(HAS_SHADOW);
}
function _clearGetShadowRGBACache() {
  this._clearCache(SHADOW_RGBA);
}
function _clearFillPatternCache() {
  this._clearCache(patternImage);
}
function _clearLinearGradientCache() {
  this._clearCache(linearGradient);
}
function _clearRadialGradientCache() {
  this._clearCache(radialGradient);
}
class Shape extends Node {
  constructor(config) {
    super(config);
    let key;
    let attempts = 0;
    while (true) {
      key = Util.getHitColor();
      if (key && !(key in shapes)) {
        break;
      }
      attempts++;
      if (attempts >= 1e4) {
        Util.warn("Failed to find a unique color key for a shape. Konva may work incorrectly. Most likely your browser is using canvas farbling. Consider disabling it.");
        key = Util.getRandomColor();
        break;
      }
    }
    this.colorKey = key;
    shapes[key] = this;
  }
  getContext() {
    Util.warn("shape.getContext() method is deprecated. Please do not use it.");
    return this.getLayer().getContext();
  }
  getCanvas() {
    Util.warn("shape.getCanvas() method is deprecated. Please do not use it.");
    return this.getLayer().getCanvas();
  }
  getSceneFunc() {
    return this.attrs.sceneFunc || this["_sceneFunc"];
  }
  getHitFunc() {
    return this.attrs.hitFunc || this["_hitFunc"];
  }
  hasShadow() {
    return this._getCache(HAS_SHADOW, this._hasShadow);
  }
  _hasShadow() {
    return this.shadowEnabled() && this.shadowOpacity() !== 0 && !!(this.shadowColor() || this.shadowBlur() || this.shadowOffsetX() || this.shadowOffsetY());
  }
  _getFillPattern() {
    return this._getCache(patternImage, this.__getFillPattern);
  }
  __getFillPattern() {
    if (this.fillPatternImage()) {
      const ctx = getDummyContext$1();
      const pattern = ctx.createPattern(this.fillPatternImage(), this.fillPatternRepeat() || "repeat");
      if (pattern && pattern.setTransform) {
        const tr = new Transform();
        tr.translate(this.fillPatternX(), this.fillPatternY());
        tr.rotate(Konva$1.getAngle(this.fillPatternRotation()));
        tr.scale(this.fillPatternScaleX(), this.fillPatternScaleY());
        tr.translate(-1 * this.fillPatternOffsetX(), -1 * this.fillPatternOffsetY());
        const m2 = tr.getMatrix();
        const matrix = typeof DOMMatrix === "undefined" ? {
          a: m2[0],
          b: m2[1],
          c: m2[2],
          d: m2[3],
          e: m2[4],
          f: m2[5]
        } : new DOMMatrix(m2);
        pattern.setTransform(matrix);
      }
      return pattern;
    }
  }
  _getLinearGradient() {
    return this._getCache(linearGradient, this.__getLinearGradient);
  }
  __getLinearGradient() {
    const colorStops = this.fillLinearGradientColorStops();
    if (colorStops) {
      const ctx = getDummyContext$1();
      const start = this.fillLinearGradientStartPoint();
      const end = this.fillLinearGradientEndPoint();
      const grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      for (let n = 0; n < colorStops.length; n += 2) {
        grd.addColorStop(colorStops[n], colorStops[n + 1]);
      }
      return grd;
    }
  }
  _getRadialGradient() {
    return this._getCache(radialGradient, this.__getRadialGradient);
  }
  __getRadialGradient() {
    const colorStops = this.fillRadialGradientColorStops();
    if (colorStops) {
      const ctx = getDummyContext$1();
      const start = this.fillRadialGradientStartPoint();
      const end = this.fillRadialGradientEndPoint();
      const grd = ctx.createRadialGradient(start.x, start.y, this.fillRadialGradientStartRadius(), end.x, end.y, this.fillRadialGradientEndRadius());
      for (let n = 0; n < colorStops.length; n += 2) {
        grd.addColorStop(colorStops[n], colorStops[n + 1]);
      }
      return grd;
    }
  }
  getShadowRGBA() {
    return this._getCache(SHADOW_RGBA, this._getShadowRGBA);
  }
  _getShadowRGBA() {
    if (!this.hasShadow()) {
      return;
    }
    const rgba = Util.colorToRGBA(this.shadowColor());
    if (rgba) {
      return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a * (this.shadowOpacity() || 1) + ")";
    }
  }
  hasFill() {
    return this._calculate("hasFill", [
      "fillEnabled",
      "fill",
      "fillPatternImage",
      "fillLinearGradientColorStops",
      "fillRadialGradientColorStops"
    ], () => {
      return this.fillEnabled() && !!(this.fill() || this.fillPatternImage() || this.fillLinearGradientColorStops() || this.fillRadialGradientColorStops());
    });
  }
  hasStroke() {
    return this._calculate("hasStroke", [
      "strokeEnabled",
      "strokeWidth",
      "stroke",
      "strokeLinearGradientColorStops"
    ], () => {
      return this.strokeEnabled() && this.strokeWidth() && !!(this.stroke() || this.strokeLinearGradientColorStops());
    });
  }
  hasHitStroke() {
    const width = this.hitStrokeWidth();
    if (width === "auto") {
      return this.hasStroke();
    }
    return this.strokeEnabled() && !!width;
  }
  intersects(point) {
    const stage = this.getStage();
    if (!stage) {
      return false;
    }
    const bufferHitCanvas = stage.bufferHitCanvas;
    bufferHitCanvas.getContext().clear();
    this.drawHit(bufferHitCanvas, void 0, true);
    const p = bufferHitCanvas.context.getImageData(Math.round(point.x), Math.round(point.y), 1, 1).data;
    return p[3] > 0;
  }
  destroy() {
    Node.prototype.destroy.call(this);
    delete shapes[this.colorKey];
    delete this.colorKey;
    return this;
  }
  _useBufferCanvas(forceFill) {
    var _a;
    const perfectDrawEnabled = (_a = this.attrs.perfectDrawEnabled) !== null && _a !== void 0 ? _a : true;
    if (!perfectDrawEnabled) {
      return false;
    }
    const hasFill = forceFill || this.hasFill();
    const hasStroke = this.hasStroke();
    const isTransparent = this.getAbsoluteOpacity() !== 1;
    if (hasFill && hasStroke && isTransparent) {
      return true;
    }
    const hasShadow = this.hasShadow();
    const strokeForShadow = this.shadowForStrokeEnabled();
    if (hasFill && hasStroke && hasShadow && strokeForShadow) {
      return true;
    }
    return false;
  }
  setStrokeHitEnabled(val) {
    Util.warn("strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead.");
    if (val) {
      this.hitStrokeWidth("auto");
    } else {
      this.hitStrokeWidth(0);
    }
  }
  getStrokeHitEnabled() {
    if (this.hitStrokeWidth() === 0) {
      return false;
    } else {
      return true;
    }
  }
  getSelfRect() {
    const size = this.size();
    return {
      x: this._centroid ? -size.width / 2 : 0,
      y: this._centroid ? -size.height / 2 : 0,
      width: size.width,
      height: size.height
    };
  }
  getClientRect(config = {}) {
    let hasCachedParent = false;
    let parent = this.getParent();
    while (parent) {
      if (parent.isCached()) {
        hasCachedParent = true;
        break;
      }
      parent = parent.getParent();
    }
    const skipTransform = config.skipTransform;
    const relativeTo = config.relativeTo || hasCachedParent && this.getStage() || void 0;
    const fillRect = this.getSelfRect();
    const applyStroke = !config.skipStroke && this.hasStroke();
    const strokeWidth = applyStroke && this.strokeWidth() || 0;
    const fillAndStrokeWidth = fillRect.width + strokeWidth;
    const fillAndStrokeHeight = fillRect.height + strokeWidth;
    const applyShadow = !config.skipShadow && this.hasShadow();
    const shadowOffsetX = applyShadow ? this.shadowOffsetX() : 0;
    const shadowOffsetY = applyShadow ? this.shadowOffsetY() : 0;
    const preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
    const preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);
    const blurRadius = applyShadow && this.shadowBlur() || 0;
    const width = preWidth + blurRadius * 2;
    const height = preHeight + blurRadius * 2;
    const rect = {
      width,
      height,
      x: -(strokeWidth / 2 + blurRadius) + Math.min(shadowOffsetX, 0) + fillRect.x,
      y: -(strokeWidth / 2 + blurRadius) + Math.min(shadowOffsetY, 0) + fillRect.y
    };
    if (!skipTransform) {
      return this._transformedRect(rect, relativeTo);
    }
    return rect;
  }
  drawScene(can, top, bufferCanvas) {
    const layer = this.getLayer();
    const canvas = can || layer.getCanvas(), context = canvas.getContext(), cachedCanvas = this._getCanvasCache(), drawFunc = this.getSceneFunc(), hasShadow = this.hasShadow();
    let stage;
    const cachingSelf = top === this;
    if (!this.isVisible() && !cachingSelf) {
      return this;
    }
    if (cachedCanvas) {
      context.save();
      const m2 = this.getAbsoluteTransform(top).getMatrix();
      context.transform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
      this._drawCachedSceneCanvas(context);
      context.restore();
      return this;
    }
    if (!drawFunc) {
      return this;
    }
    context.save();
    if (this._useBufferCanvas() && true) {
      stage = this.getStage();
      const bc = bufferCanvas || stage.bufferCanvas;
      const bufferContext = bc.getContext();
      if (bufferCanvas) {
        bufferContext.save();
        bufferContext.setTransform(1, 0, 0, 1, 0, 0);
        bufferContext.clearRect(0, 0, bc.width, bc.height);
        bufferContext.restore();
      } else {
        bufferContext.clear();
      }
      bufferContext.save();
      bufferContext._applyLineJoin(this);
      bufferContext._applyMiterLimit(this);
      const o = this.getAbsoluteTransform(top).getMatrix();
      bufferContext.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
      drawFunc.call(this, bufferContext, this);
      bufferContext.restore();
      const ratio = bc.pixelRatio;
      if (hasShadow) {
        context._applyShadow(this);
      }
      if (!cachingSelf) {
        context._applyOpacity(this);
        context._applyGlobalCompositeOperation(this);
      }
      context.drawImage(bc._canvas, bc.x || 0, bc.y || 0, bc.width / ratio, bc.height / ratio);
    } else {
      context._applyLineJoin(this);
      context._applyMiterLimit(this);
      if (!cachingSelf) {
        const o = this.getAbsoluteTransform(top).getMatrix();
        context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
        context._applyOpacity(this);
        context._applyGlobalCompositeOperation(this);
      }
      if (hasShadow) {
        context._applyShadow(this);
      }
      drawFunc.call(this, context, this);
    }
    context.restore();
    return this;
  }
  drawHit(can, top, skipDragCheck = false) {
    if (!this.shouldDrawHit(top, skipDragCheck)) {
      return this;
    }
    const layer = this.getLayer(), canvas = can || layer.hitCanvas, context = canvas && canvas.getContext(), drawFunc = this.hitFunc() || this.sceneFunc(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
    if (!this.colorKey) {
      Util.warn("Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. If you want to reuse shape you should call remove() instead of destroy()");
    }
    if (cachedHitCanvas) {
      context.save();
      const m2 = this.getAbsoluteTransform(top).getMatrix();
      context.transform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
      this._drawCachedHitCanvas(context);
      context.restore();
      return this;
    }
    if (!drawFunc) {
      return this;
    }
    context.save();
    context._applyLineJoin(this);
    context._applyMiterLimit(this);
    const selfCache = this === top;
    if (!selfCache) {
      const o = this.getAbsoluteTransform(top).getMatrix();
      context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
    }
    drawFunc.call(this, context, this);
    context.restore();
    return this;
  }
  drawHitFromCache(alphaThreshold = 0) {
    const cachedCanvas = this._getCanvasCache(), sceneCanvas = this._getCachedSceneCanvas(), hitCanvas = cachedCanvas.hit, hitContext = hitCanvas.getContext(), hitWidth = hitCanvas.getWidth(), hitHeight = hitCanvas.getHeight();
    hitContext.clear();
    hitContext.drawImage(sceneCanvas._canvas, 0, 0, hitWidth, hitHeight);
    try {
      const hitImageData = hitContext.getImageData(0, 0, hitWidth, hitHeight);
      const hitData = hitImageData.data;
      const len = hitData.length;
      const rgbColorKey = Util._hexToRgb(this.colorKey);
      for (let i = 0; i < len; i += 4) {
        const alpha = hitData[i + 3];
        if (alpha > alphaThreshold) {
          hitData[i] = rgbColorKey.r;
          hitData[i + 1] = rgbColorKey.g;
          hitData[i + 2] = rgbColorKey.b;
          hitData[i + 3] = 255;
        } else {
          hitData[i + 3] = 0;
        }
      }
      hitContext.putImageData(hitImageData, 0, 0);
    } catch (e) {
      Util.error("Unable to draw hit graph from cached scene canvas. " + e.message);
    }
    return this;
  }
  hasPointerCapture(pointerId) {
    return hasPointerCapture(pointerId, this);
  }
  setPointerCapture(pointerId) {
    setPointerCapture(pointerId, this);
  }
  releaseCapture(pointerId) {
    releaseCapture(pointerId);
  }
}
Shape.prototype._fillFunc = _fillFunc$2;
Shape.prototype._strokeFunc = _strokeFunc$2;
Shape.prototype._fillFuncHit = _fillFuncHit;
Shape.prototype._strokeFuncHit = _strokeFuncHit;
Shape.prototype._centroid = false;
Shape.prototype.nodeType = "Shape";
_registerNode(Shape);
Shape.prototype.eventListeners = {};
Shape.prototype.on("shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", _clearHasShadowCache);
Shape.prototype.on("shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", _clearGetShadowRGBACache);
Shape.prototype.on("fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva fillPatternOffsetXChange.konva fillPatternOffsetYChange.konva fillPatternXChange.konva fillPatternYChange.konva fillPatternRotationChange.konva", _clearFillPatternCache);
Shape.prototype.on("fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva", _clearLinearGradientCache);
Shape.prototype.on("fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva", _clearRadialGradientCache);
Factory.addGetterSetter(Shape, "stroke", void 0, getStringOrGradientValidator());
Factory.addGetterSetter(Shape, "strokeWidth", 2, getNumberValidator());
Factory.addGetterSetter(Shape, "fillAfterStrokeEnabled", false);
Factory.addGetterSetter(Shape, "hitStrokeWidth", "auto", getNumberOrAutoValidator());
Factory.addGetterSetter(Shape, "strokeHitEnabled", true, getBooleanValidator());
Factory.addGetterSetter(Shape, "perfectDrawEnabled", true, getBooleanValidator());
Factory.addGetterSetter(Shape, "shadowForStrokeEnabled", true, getBooleanValidator());
Factory.addGetterSetter(Shape, "lineJoin");
Factory.addGetterSetter(Shape, "lineCap");
Factory.addGetterSetter(Shape, "miterLimit");
Factory.addGetterSetter(Shape, "sceneFunc");
Factory.addGetterSetter(Shape, "hitFunc");
Factory.addGetterSetter(Shape, "dash");
Factory.addGetterSetter(Shape, "dashOffset", 0, getNumberValidator());
Factory.addGetterSetter(Shape, "shadowColor", void 0, getStringValidator());
Factory.addGetterSetter(Shape, "shadowBlur", 0, getNumberValidator());
Factory.addGetterSetter(Shape, "shadowOpacity", 1, getNumberValidator());
Factory.addComponentsGetterSetter(Shape, "shadowOffset", ["x", "y"]);
Factory.addGetterSetter(Shape, "shadowOffsetX", 0, getNumberValidator());
Factory.addGetterSetter(Shape, "shadowOffsetY", 0, getNumberValidator());
Factory.addGetterSetter(Shape, "fillPatternImage");
Factory.addGetterSetter(Shape, "fill", void 0, getStringOrGradientValidator());
Factory.addGetterSetter(Shape, "fillPatternX", 0, getNumberValidator());
Factory.addGetterSetter(Shape, "fillPatternY", 0, getNumberValidator());
Factory.addGetterSetter(Shape, "fillLinearGradientColorStops");
Factory.addGetterSetter(Shape, "strokeLinearGradientColorStops");
Factory.addGetterSetter(Shape, "fillRadialGradientStartRadius", 0);
Factory.addGetterSetter(Shape, "fillRadialGradientEndRadius", 0);
Factory.addGetterSetter(Shape, "fillRadialGradientColorStops");
Factory.addGetterSetter(Shape, "fillPatternRepeat", "repeat");
Factory.addGetterSetter(Shape, "fillEnabled", true);
Factory.addGetterSetter(Shape, "strokeEnabled", true);
Factory.addGetterSetter(Shape, "shadowEnabled", true);
Factory.addGetterSetter(Shape, "dashEnabled", true);
Factory.addGetterSetter(Shape, "strokeScaleEnabled", true);
Factory.addGetterSetter(Shape, "fillPriority", "color");
Factory.addComponentsGetterSetter(Shape, "fillPatternOffset", ["x", "y"]);
Factory.addGetterSetter(Shape, "fillPatternOffsetX", 0, getNumberValidator());
Factory.addGetterSetter(Shape, "fillPatternOffsetY", 0, getNumberValidator());
Factory.addComponentsGetterSetter(Shape, "fillPatternScale", ["x", "y"]);
Factory.addGetterSetter(Shape, "fillPatternScaleX", 1, getNumberValidator());
Factory.addGetterSetter(Shape, "fillPatternScaleY", 1, getNumberValidator());
Factory.addComponentsGetterSetter(Shape, "fillLinearGradientStartPoint", [
  "x",
  "y"
]);
Factory.addComponentsGetterSetter(Shape, "strokeLinearGradientStartPoint", [
  "x",
  "y"
]);
Factory.addGetterSetter(Shape, "fillLinearGradientStartPointX", 0);
Factory.addGetterSetter(Shape, "strokeLinearGradientStartPointX", 0);
Factory.addGetterSetter(Shape, "fillLinearGradientStartPointY", 0);
Factory.addGetterSetter(Shape, "strokeLinearGradientStartPointY", 0);
Factory.addComponentsGetterSetter(Shape, "fillLinearGradientEndPoint", [
  "x",
  "y"
]);
Factory.addComponentsGetterSetter(Shape, "strokeLinearGradientEndPoint", [
  "x",
  "y"
]);
Factory.addGetterSetter(Shape, "fillLinearGradientEndPointX", 0);
Factory.addGetterSetter(Shape, "strokeLinearGradientEndPointX", 0);
Factory.addGetterSetter(Shape, "fillLinearGradientEndPointY", 0);
Factory.addGetterSetter(Shape, "strokeLinearGradientEndPointY", 0);
Factory.addComponentsGetterSetter(Shape, "fillRadialGradientStartPoint", [
  "x",
  "y"
]);
Factory.addGetterSetter(Shape, "fillRadialGradientStartPointX", 0);
Factory.addGetterSetter(Shape, "fillRadialGradientStartPointY", 0);
Factory.addComponentsGetterSetter(Shape, "fillRadialGradientEndPoint", [
  "x",
  "y"
]);
Factory.addGetterSetter(Shape, "fillRadialGradientEndPointX", 0);
Factory.addGetterSetter(Shape, "fillRadialGradientEndPointY", 0);
Factory.addGetterSetter(Shape, "fillPatternRotation", 0);
Factory.addGetterSetter(Shape, "fillRule", void 0, getStringValidator());
Factory.backCompat(Shape, {
  dashArray: "dash",
  getDashArray: "getDash",
  setDashArray: "getDash",
  drawFunc: "sceneFunc",
  getDrawFunc: "getSceneFunc",
  setDrawFunc: "setSceneFunc",
  drawHitFunc: "hitFunc",
  getDrawHitFunc: "getHitFunc",
  setDrawHitFunc: "setHitFunc"
});
const BEFORE_DRAW = "beforeDraw", DRAW = "draw", INTERSECTION_OFFSETS = [
  { x: 0, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 }
], INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;
let Layer$1 = class Layer extends Container {
  constructor(config) {
    super(config);
    this.canvas = new SceneCanvas();
    this.hitCanvas = new HitCanvas({
      pixelRatio: 1
    });
    this._waitingForDraw = false;
    this.on("visibleChange.konva", this._checkVisibility);
    this._checkVisibility();
    this.on("imageSmoothingEnabledChange.konva", this._setSmoothEnabled);
    this._setSmoothEnabled();
  }
  createPNGStream() {
    const c = this.canvas._canvas;
    return c.createPNGStream();
  }
  getCanvas() {
    return this.canvas;
  }
  getNativeCanvasElement() {
    return this.canvas._canvas;
  }
  getHitCanvas() {
    return this.hitCanvas;
  }
  getContext() {
    return this.getCanvas().getContext();
  }
  clear(bounds) {
    this.getContext().clear(bounds);
    this.getHitCanvas().getContext().clear(bounds);
    return this;
  }
  setZIndex(index) {
    super.setZIndex(index);
    const stage = this.getStage();
    if (stage && stage.content) {
      stage.content.removeChild(this.getNativeCanvasElement());
      if (index < stage.children.length - 1) {
        stage.content.insertBefore(this.getNativeCanvasElement(), stage.children[index + 1].getCanvas()._canvas);
      } else {
        stage.content.appendChild(this.getNativeCanvasElement());
      }
    }
    return this;
  }
  moveToTop() {
    Node.prototype.moveToTop.call(this);
    const stage = this.getStage();
    if (stage && stage.content) {
      stage.content.removeChild(this.getNativeCanvasElement());
      stage.content.appendChild(this.getNativeCanvasElement());
    }
    return true;
  }
  moveUp() {
    const moved = Node.prototype.moveUp.call(this);
    if (!moved) {
      return false;
    }
    const stage = this.getStage();
    if (!stage || !stage.content) {
      return false;
    }
    stage.content.removeChild(this.getNativeCanvasElement());
    if (this.index < stage.children.length - 1) {
      stage.content.insertBefore(this.getNativeCanvasElement(), stage.children[this.index + 1].getCanvas()._canvas);
    } else {
      stage.content.appendChild(this.getNativeCanvasElement());
    }
    return true;
  }
  moveDown() {
    if (Node.prototype.moveDown.call(this)) {
      const stage = this.getStage();
      if (stage) {
        const children = stage.children;
        if (stage.content) {
          stage.content.removeChild(this.getNativeCanvasElement());
          stage.content.insertBefore(this.getNativeCanvasElement(), children[this.index + 1].getCanvas()._canvas);
        }
      }
      return true;
    }
    return false;
  }
  moveToBottom() {
    if (Node.prototype.moveToBottom.call(this)) {
      const stage = this.getStage();
      if (stage) {
        const children = stage.children;
        if (stage.content) {
          stage.content.removeChild(this.getNativeCanvasElement());
          stage.content.insertBefore(this.getNativeCanvasElement(), children[1].getCanvas()._canvas);
        }
      }
      return true;
    }
    return false;
  }
  getLayer() {
    return this;
  }
  remove() {
    const _canvas = this.getNativeCanvasElement();
    Node.prototype.remove.call(this);
    if (_canvas && _canvas.parentNode && Util._isInDocument(_canvas)) {
      _canvas.parentNode.removeChild(_canvas);
    }
    return this;
  }
  getStage() {
    return this.parent;
  }
  setSize({ width, height }) {
    this.canvas.setSize(width, height);
    this.hitCanvas.setSize(width, height);
    this._setSmoothEnabled();
    return this;
  }
  _validateAdd(child) {
    const type = child.getType();
    if (type !== "Group" && type !== "Shape") {
      Util.throw("You may only add groups and shapes to a layer.");
    }
  }
  _toKonvaCanvas(config) {
    config = { ...config };
    config.width = config.width || this.getWidth();
    config.height = config.height || this.getHeight();
    config.x = config.x !== void 0 ? config.x : this.x();
    config.y = config.y !== void 0 ? config.y : this.y();
    return Node.prototype._toKonvaCanvas.call(this, config);
  }
  _checkVisibility() {
    const visible = this.visible();
    if (visible) {
      this.canvas._canvas.style.display = "block";
    } else {
      this.canvas._canvas.style.display = "none";
    }
  }
  _setSmoothEnabled() {
    this.getContext()._context.imageSmoothingEnabled = this.imageSmoothingEnabled();
  }
  getWidth() {
    if (this.parent) {
      return this.parent.width();
    }
  }
  setWidth() {
    Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
  }
  getHeight() {
    if (this.parent) {
      return this.parent.height();
    }
  }
  setHeight() {
    Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
  }
  batchDraw() {
    if (!this._waitingForDraw) {
      this._waitingForDraw = true;
      Util.requestAnimFrame(() => {
        this.draw();
        this._waitingForDraw = false;
      });
    }
    return this;
  }
  getIntersection(pos) {
    if (!this.isListening() || !this.isVisible()) {
      return null;
    }
    let spiralSearchDistance = 1;
    let continueSearch = false;
    while (true) {
      for (let i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
        const intersectionOffset = INTERSECTION_OFFSETS[i];
        const obj = this._getIntersection({
          x: pos.x + intersectionOffset.x * spiralSearchDistance,
          y: pos.y + intersectionOffset.y * spiralSearchDistance
        });
        const shape = obj.shape;
        if (shape) {
          return shape;
        }
        continueSearch = !!obj.antialiased;
        if (!obj.antialiased) {
          break;
        }
      }
      if (continueSearch) {
        spiralSearchDistance += 1;
      } else {
        return null;
      }
    }
  }
  _getIntersection(pos) {
    const ratio = this.hitCanvas.pixelRatio;
    const p = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio), Math.round(pos.y * ratio), 1, 1).data;
    const p3 = p[3];
    if (p3 === 255) {
      const colorKey = Util.getHitColorKey(p[0], p[1], p[2]);
      const shape = shapes[colorKey];
      if (shape) {
        return {
          shape
        };
      }
      return {
        antialiased: true
      };
    } else if (p3 > 0) {
      return {
        antialiased: true
      };
    }
    return {};
  }
  drawScene(can, top, bufferCanvas) {
    const layer = this.getLayer(), canvas = can || layer && layer.getCanvas();
    this._fire(BEFORE_DRAW, {
      node: this
    });
    if (this.clearBeforeDraw()) {
      canvas.getContext().clear();
    }
    Container.prototype.drawScene.call(this, canvas, top, bufferCanvas);
    this._fire(DRAW, {
      node: this
    });
    return this;
  }
  drawHit(can, top) {
    const layer = this.getLayer(), canvas = can || layer && layer.hitCanvas;
    if (layer && layer.clearBeforeDraw()) {
      layer.getHitCanvas().getContext().clear();
    }
    Container.prototype.drawHit.call(this, canvas, top);
    return this;
  }
  enableHitGraph() {
    this.hitGraphEnabled(true);
    return this;
  }
  disableHitGraph() {
    this.hitGraphEnabled(false);
    return this;
  }
  setHitGraphEnabled(val) {
    Util.warn("hitGraphEnabled method is deprecated. Please use layer.listening() instead.");
    this.listening(val);
  }
  getHitGraphEnabled(val) {
    Util.warn("hitGraphEnabled method is deprecated. Please use layer.listening() instead.");
    return this.listening();
  }
  toggleHitCanvas() {
    if (!this.parent || !this.parent["content"]) {
      return;
    }
    const parent = this.parent;
    const added = !!this.hitCanvas._canvas.parentNode;
    if (added) {
      parent.content.removeChild(this.hitCanvas._canvas);
    } else {
      parent.content.appendChild(this.hitCanvas._canvas);
    }
  }
  destroy() {
    Util.releaseCanvas(this.getNativeCanvasElement(), this.getHitCanvas()._canvas);
    return super.destroy();
  }
};
Layer$1.prototype.nodeType = "Layer";
_registerNode(Layer$1);
Factory.addGetterSetter(Layer$1, "imageSmoothingEnabled", true);
Factory.addGetterSetter(Layer$1, "clearBeforeDraw", true);
Factory.addGetterSetter(Layer$1, "hitGraphEnabled", true, getBooleanValidator());
class FastLayer extends Layer$1 {
  constructor(attrs) {
    super(attrs);
    this.listening(false);
    Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
  }
}
FastLayer.prototype.nodeType = "FastLayer";
_registerNode(FastLayer);
let Group$1 = class Group extends Container {
  _validateAdd(child) {
    const type = child.getType();
    if (type !== "Group" && type !== "Shape") {
      Util.throw("You may only add groups and shapes to groups.");
    }
  }
};
Group$1.prototype.nodeType = "Group";
_registerNode(Group$1);
const now = (function() {
  if (glob.performance && glob.performance.now) {
    return function() {
      return glob.performance.now();
    };
  }
  return function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };
})();
class Animation {
  constructor(func, layers) {
    this.id = Animation.animIdCounter++;
    this.frame = {
      time: 0,
      timeDiff: 0,
      lastTime: now(),
      frameRate: 0
    };
    this.func = func;
    this.setLayers(layers);
  }
  setLayers(layers) {
    let lays = [];
    if (layers) {
      lays = Array.isArray(layers) ? layers : [layers];
    }
    this.layers = lays;
    return this;
  }
  getLayers() {
    return this.layers;
  }
  addLayer(layer) {
    const layers = this.layers;
    const len = layers.length;
    for (let n = 0; n < len; n++) {
      if (layers[n]._id === layer._id) {
        return false;
      }
    }
    this.layers.push(layer);
    return true;
  }
  isRunning() {
    const a = Animation;
    const animations = a.animations;
    const len = animations.length;
    for (let n = 0; n < len; n++) {
      if (animations[n].id === this.id) {
        return true;
      }
    }
    return false;
  }
  start() {
    this.stop();
    this.frame.timeDiff = 0;
    this.frame.lastTime = now();
    Animation._addAnimation(this);
    return this;
  }
  stop() {
    Animation._removeAnimation(this);
    return this;
  }
  _updateFrameObject(time) {
    this.frame.timeDiff = time - this.frame.lastTime;
    this.frame.lastTime = time;
    this.frame.time += this.frame.timeDiff;
    this.frame.frameRate = 1e3 / this.frame.timeDiff;
  }
  static _addAnimation(anim) {
    this.animations.push(anim);
    this._handleAnimation();
  }
  static _removeAnimation(anim) {
    const id = anim.id;
    const animations = this.animations;
    const len = animations.length;
    for (let n = 0; n < len; n++) {
      if (animations[n].id === id) {
        this.animations.splice(n, 1);
        break;
      }
    }
  }
  static _runFrames() {
    const layerHash = {};
    const animations = this.animations;
    for (let n = 0; n < animations.length; n++) {
      const anim = animations[n];
      const layers = anim.layers;
      const func = anim.func;
      anim._updateFrameObject(now());
      const layersLen = layers.length;
      let needRedraw;
      if (func) {
        needRedraw = func.call(anim, anim.frame) !== false;
      } else {
        needRedraw = true;
      }
      if (!needRedraw) {
        continue;
      }
      for (let i = 0; i < layersLen; i++) {
        const layer = layers[i];
        if (layer._id !== void 0) {
          layerHash[layer._id] = layer;
        }
      }
    }
    for (const key in layerHash) {
      if (!layerHash.hasOwnProperty(key)) {
        continue;
      }
      layerHash[key].batchDraw();
    }
  }
  static _animationLoop() {
    const Anim = Animation;
    if (Anim.animations.length) {
      Anim._runFrames();
      Util.requestAnimFrame(Anim._animationLoop);
    } else {
      Anim.animRunning = false;
    }
  }
  static _handleAnimation() {
    if (!this.animRunning) {
      this.animRunning = true;
      Util.requestAnimFrame(this._animationLoop);
    }
  }
}
Animation.animations = [];
Animation.animIdCounter = 0;
Animation.animRunning = false;
const blacklist = {
  node: 1,
  duration: 1,
  easing: 1,
  onFinish: 1,
  yoyo: 1
}, PAUSED = 1, PLAYING = 2, REVERSING = 3, colorAttrs = ["fill", "stroke", "shadowColor"];
let idCounter = 0;
class TweenEngine {
  constructor(prop, propFunc, func, begin, finish, duration, yoyo) {
    this.prop = prop;
    this.propFunc = propFunc;
    this.begin = begin;
    this._pos = begin;
    this.duration = duration;
    this._change = 0;
    this.prevPos = 0;
    this.yoyo = yoyo;
    this._time = 0;
    this._position = 0;
    this._startTime = 0;
    this._finish = 0;
    this.func = func;
    this._change = finish - this.begin;
    this.pause();
  }
  fire(str) {
    const handler = this[str];
    if (handler) {
      handler();
    }
  }
  setTime(t) {
    if (t > this.duration) {
      if (this.yoyo) {
        this._time = this.duration;
        this.reverse();
      } else {
        this.finish();
      }
    } else if (t < 0) {
      if (this.yoyo) {
        this._time = 0;
        this.play();
      } else {
        this.reset();
      }
    } else {
      this._time = t;
      this.update();
    }
  }
  getTime() {
    return this._time;
  }
  setPosition(p) {
    this.prevPos = this._pos;
    this.propFunc(p);
    this._pos = p;
  }
  getPosition(t) {
    if (t === void 0) {
      t = this._time;
    }
    return this.func(t, this.begin, this._change, this.duration);
  }
  play() {
    this.state = PLAYING;
    this._startTime = this.getTimer() - this._time;
    this.onEnterFrame();
    this.fire("onPlay");
  }
  reverse() {
    this.state = REVERSING;
    this._time = this.duration - this._time;
    this._startTime = this.getTimer() - this._time;
    this.onEnterFrame();
    this.fire("onReverse");
  }
  seek(t) {
    this.pause();
    this._time = t;
    this.update();
    this.fire("onSeek");
  }
  reset() {
    this.pause();
    this._time = 0;
    this.update();
    this.fire("onReset");
  }
  finish() {
    this.pause();
    this._time = this.duration;
    this.update();
    this.fire("onFinish");
  }
  update() {
    this.setPosition(this.getPosition(this._time));
    this.fire("onUpdate");
  }
  onEnterFrame() {
    const t = this.getTimer() - this._startTime;
    if (this.state === PLAYING) {
      this.setTime(t);
    } else if (this.state === REVERSING) {
      this.setTime(this.duration - t);
    }
  }
  pause() {
    this.state = PAUSED;
    this.fire("onPause");
  }
  getTimer() {
    return (/* @__PURE__ */ new Date()).getTime();
  }
}
class Tween {
  constructor(config) {
    const that = this, node = config.node, nodeId = node._id, easing = config.easing || Easings.Linear, yoyo = !!config.yoyo;
    let duration, key;
    if (typeof config.duration === "undefined") {
      duration = 0.3;
    } else if (config.duration === 0) {
      duration = 1e-3;
    } else {
      duration = config.duration;
    }
    this.node = node;
    this._id = idCounter++;
    const layers = node.getLayer() || (node instanceof Konva$1["Stage"] ? node.getLayers() : null);
    if (!layers) {
      Util.error("Tween constructor have `node` that is not in a layer. Please add node into layer first.");
    }
    this.anim = new Animation(function() {
      that.tween.onEnterFrame();
    }, layers);
    this.tween = new TweenEngine(key, function(i) {
      that._tweenFunc(i);
    }, easing, 0, 1, duration * 1e3, yoyo);
    this._addListeners();
    if (!Tween.attrs[nodeId]) {
      Tween.attrs[nodeId] = {};
    }
    if (!Tween.attrs[nodeId][this._id]) {
      Tween.attrs[nodeId][this._id] = {};
    }
    if (!Tween.tweens[nodeId]) {
      Tween.tweens[nodeId] = {};
    }
    for (key in config) {
      if (blacklist[key] === void 0) {
        this._addAttr(key, config[key]);
      }
    }
    this.reset();
    this.onFinish = config.onFinish;
    this.onReset = config.onReset;
    this.onUpdate = config.onUpdate;
  }
  _addAttr(key, end) {
    const node = this.node, nodeId = node._id;
    let diff, len, trueEnd, trueStart, endRGBA;
    const tweenId = Tween.tweens[nodeId][key];
    if (tweenId) {
      delete Tween.attrs[nodeId][tweenId][key];
    }
    let start = node.getAttr(key);
    if (Util._isArray(end)) {
      diff = [];
      len = Math.max(end.length, start.length);
      if (key === "points" && end.length !== start.length) {
        if (end.length > start.length) {
          trueStart = start;
          start = Util._prepareArrayForTween(start, end, node.closed());
        } else {
          trueEnd = end;
          end = Util._prepareArrayForTween(end, start, node.closed());
        }
      }
      if (key.indexOf("fill") === 0) {
        for (let n = 0; n < len; n++) {
          if (n % 2 === 0) {
            diff.push(end[n] - start[n]);
          } else {
            const startRGBA = Util.colorToRGBA(start[n]);
            endRGBA = Util.colorToRGBA(end[n]);
            start[n] = startRGBA;
            diff.push({
              r: endRGBA.r - startRGBA.r,
              g: endRGBA.g - startRGBA.g,
              b: endRGBA.b - startRGBA.b,
              a: endRGBA.a - startRGBA.a
            });
          }
        }
      } else {
        for (let n = 0; n < len; n++) {
          diff.push(end[n] - start[n]);
        }
      }
    } else if (colorAttrs.indexOf(key) !== -1) {
      start = Util.colorToRGBA(start);
      endRGBA = Util.colorToRGBA(end);
      diff = {
        r: endRGBA.r - start.r,
        g: endRGBA.g - start.g,
        b: endRGBA.b - start.b,
        a: endRGBA.a - start.a
      };
    } else {
      diff = end - start;
    }
    Tween.attrs[nodeId][this._id][key] = {
      start,
      diff,
      end,
      trueEnd,
      trueStart
    };
    Tween.tweens[nodeId][key] = this._id;
  }
  _tweenFunc(i) {
    const node = this.node, attrs = Tween.attrs[node._id][this._id];
    let key, attr, start, diff, newVal, n, len, end;
    for (key in attrs) {
      attr = attrs[key];
      start = attr.start;
      diff = attr.diff;
      end = attr.end;
      if (Util._isArray(start)) {
        newVal = [];
        len = Math.max(start.length, end.length);
        if (key.indexOf("fill") === 0) {
          for (n = 0; n < len; n++) {
            if (n % 2 === 0) {
              newVal.push((start[n] || 0) + diff[n] * i);
            } else {
              newVal.push("rgba(" + Math.round(start[n].r + diff[n].r * i) + "," + Math.round(start[n].g + diff[n].g * i) + "," + Math.round(start[n].b + diff[n].b * i) + "," + (start[n].a + diff[n].a * i) + ")");
            }
          }
        } else {
          for (n = 0; n < len; n++) {
            newVal.push((start[n] || 0) + diff[n] * i);
          }
        }
      } else if (colorAttrs.indexOf(key) !== -1) {
        newVal = "rgba(" + Math.round(start.r + diff.r * i) + "," + Math.round(start.g + diff.g * i) + "," + Math.round(start.b + diff.b * i) + "," + (start.a + diff.a * i) + ")";
      } else {
        newVal = start + diff * i;
      }
      node.setAttr(key, newVal);
    }
  }
  _addListeners() {
    this.tween.onPlay = () => {
      this.anim.start();
    };
    this.tween.onReverse = () => {
      this.anim.start();
    };
    this.tween.onPause = () => {
      this.anim.stop();
    };
    this.tween.onFinish = () => {
      const node = this.node;
      const attrs = Tween.attrs[node._id][this._id];
      if (attrs.points && attrs.points.trueEnd) {
        node.setAttr("points", attrs.points.trueEnd);
      }
      if (this.onFinish) {
        this.onFinish.call(this);
      }
    };
    this.tween.onReset = () => {
      const node = this.node;
      const attrs = Tween.attrs[node._id][this._id];
      if (attrs.points && attrs.points.trueStart) {
        node.points(attrs.points.trueStart);
      }
      if (this.onReset) {
        this.onReset();
      }
    };
    this.tween.onUpdate = () => {
      if (this.onUpdate) {
        this.onUpdate.call(this);
      }
    };
  }
  play() {
    this.tween.play();
    return this;
  }
  reverse() {
    this.tween.reverse();
    return this;
  }
  reset() {
    this.tween.reset();
    return this;
  }
  seek(t) {
    this.tween.seek(t * 1e3);
    return this;
  }
  pause() {
    this.tween.pause();
    return this;
  }
  finish() {
    this.tween.finish();
    return this;
  }
  destroy() {
    const nodeId = this.node._id, thisId = this._id, attrs = Tween.tweens[nodeId];
    this.pause();
    if (this.anim) {
      this.anim.stop();
    }
    for (const key in attrs) {
      delete Tween.tweens[nodeId][key];
    }
    delete Tween.attrs[nodeId][thisId];
    if (Tween.tweens[nodeId]) {
      if (Object.keys(Tween.tweens[nodeId]).length === 0) {
        delete Tween.tweens[nodeId];
      }
      if (Object.keys(Tween.attrs[nodeId]).length === 0) {
        delete Tween.attrs[nodeId];
      }
    }
  }
}
Tween.attrs = {};
Tween.tweens = {};
Node.prototype.to = function(params) {
  const onFinish = params.onFinish;
  params.node = this;
  params.onFinish = function() {
    this.destroy();
    if (onFinish) {
      onFinish();
    }
  };
  const tween = new Tween(params);
  tween.play();
};
const Easings = {
  BackEaseIn(t, b, c, d) {
    const s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  BackEaseOut(t, b, c, d) {
    const s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  BackEaseInOut(t, b, c, d) {
    let s = 1.70158;
    if ((t /= d / 2) < 1) {
      return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
    }
    return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  },
  ElasticEaseIn(t, b, c, d, a, p) {
    let s = 0;
    if (t === 0) {
      return b;
    }
    if ((t /= d) === 1) {
      return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  ElasticEaseOut(t, b, c, d, a, p) {
    let s = 0;
    if (t === 0) {
      return b;
    }
    if ((t /= d) === 1) {
      return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  },
  ElasticEaseInOut(t, b, c, d, a, p) {
    let s = 0;
    if (t === 0) {
      return b;
    }
    if ((t /= d / 2) === 2) {
      return b + c;
    }
    if (!p) {
      p = d * (0.3 * 1.5);
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    if (t < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
  },
  BounceEaseOut(t, b, c, d) {
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b;
    } else if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    } else if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    }
  },
  BounceEaseIn(t, b, c, d) {
    return c - Easings.BounceEaseOut(d - t, 0, c, d) + b;
  },
  BounceEaseInOut(t, b, c, d) {
    if (t < d / 2) {
      return Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
    } else {
      return Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
  },
  EaseIn(t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  EaseOut(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  EaseInOut(t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    }
    return -c / 2 * (--t * (t - 2) - 1) + b;
  },
  StrongEaseIn(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  StrongEaseOut(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  StrongEaseInOut(t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  Linear(t, b, c, d) {
    return c * t / d + b;
  }
};
const Konva = Util._assign(Konva$1, {
  Util,
  Transform,
  Node,
  Container,
  Stage: Stage$1,
  stages,
  Layer: Layer$1,
  FastLayer,
  Group: Group$1,
  DD,
  Shape,
  shapes,
  Animation,
  Tween,
  Easings,
  Context,
  Canvas: Canvas$1
});
class Arc extends Shape {
  _sceneFunc(context) {
    const angle = Konva$1.getAngle(this.angle()), clockwise = this.clockwise();
    context.beginPath();
    context.arc(0, 0, this.outerRadius(), 0, angle, clockwise);
    context.arc(0, 0, this.innerRadius(), angle, 0, !clockwise);
    context.closePath();
    context.fillStrokeShape(this);
  }
  getWidth() {
    return this.outerRadius() * 2;
  }
  getHeight() {
    return this.outerRadius() * 2;
  }
  setWidth(width) {
    this.outerRadius(width / 2);
  }
  setHeight(height) {
    this.outerRadius(height / 2);
  }
  getSelfRect() {
    const innerRadius = this.innerRadius();
    const outerRadius = this.outerRadius();
    const clockwise = this.clockwise();
    const angle = Konva$1.getAngle(clockwise ? 360 - this.angle() : this.angle());
    const boundLeftRatio = Math.cos(Math.min(angle, Math.PI));
    const boundRightRatio = 1;
    const boundTopRatio = Math.sin(Math.min(Math.max(Math.PI, angle), 3 * Math.PI / 2));
    const boundBottomRatio = Math.sin(Math.min(angle, Math.PI / 2));
    const boundLeft = boundLeftRatio * (boundLeftRatio > 0 ? innerRadius : outerRadius);
    const boundRight = boundRightRatio * outerRadius;
    const boundTop = boundTopRatio * (boundTopRatio > 0 ? innerRadius : outerRadius);
    const boundBottom = boundBottomRatio * (boundBottomRatio > 0 ? outerRadius : innerRadius);
    return {
      x: boundLeft,
      y: clockwise ? -1 * boundBottom : boundTop,
      width: boundRight - boundLeft,
      height: boundBottom - boundTop
    };
  }
}
Arc.prototype._centroid = true;
Arc.prototype.className = "Arc";
Arc.prototype._attrsAffectingSize = [
  "innerRadius",
  "outerRadius",
  "angle",
  "clockwise"
];
_registerNode(Arc);
Factory.addGetterSetter(Arc, "innerRadius", 0, getNumberValidator());
Factory.addGetterSetter(Arc, "outerRadius", 0, getNumberValidator());
Factory.addGetterSetter(Arc, "angle", 0, getNumberValidator());
Factory.addGetterSetter(Arc, "clockwise", false, getBooleanValidator());
function getControlPoints(x0, y0, x1, y1, x2, y2, t) {
  const d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)), d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), fa = t * d01 / (d01 + d12), fb = t * d12 / (d01 + d12), p1x = x1 - fa * (x2 - x0), p1y = y1 - fa * (y2 - y0), p2x = x1 + fb * (x2 - x0), p2y = y1 + fb * (y2 - y0);
  return [p1x, p1y, p2x, p2y];
}
function expandPoints(p, tension) {
  const len = p.length, allPoints = [];
  for (let n = 2; n < len - 2; n += 2) {
    const cp = getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
    if (isNaN(cp[0])) {
      continue;
    }
    allPoints.push(cp[0]);
    allPoints.push(cp[1]);
    allPoints.push(p[n]);
    allPoints.push(p[n + 1]);
    allPoints.push(cp[2]);
    allPoints.push(cp[3]);
  }
  return allPoints;
}
function getBezierExtremaPoints(points) {
  const axisPoints = [
    [points[0], points[2], points[4], points[6]],
    [points[1], points[3], points[5], points[7]]
  ];
  const extremaTs = [];
  for (const axis of axisPoints) {
    const a = -3 * axis[0] + 9 * axis[1] - 9 * axis[2] + 3 * axis[3];
    if (a !== 0) {
      const b = 6 * axis[0] - 12 * axis[1] + 6 * axis[2];
      const c = -3 * axis[0] + 3 * axis[1];
      const discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) {
        const d = Math.sqrt(discriminant);
        extremaTs.push((-b + d) / (2 * a));
        extremaTs.push((-b - d) / (2 * a));
      }
    }
  }
  return extremaTs.filter((t) => t > 0 && t < 1).flatMap((t) => axisPoints.map((axis) => {
    const mt = 1 - t;
    return mt * mt * mt * axis[0] + 3 * mt * mt * t * axis[1] + 3 * mt * t * t * axis[2] + t * t * t * axis[3];
  }));
}
let Line$1 = class Line extends Shape {
  constructor(config) {
    super(config);
    this.on("pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva", function() {
      this._clearCache("tensionPoints");
    });
  }
  _sceneFunc(context) {
    const points = this.points(), length = points.length, tension = this.tension(), closed = this.closed(), bezier = this.bezier();
    if (!length) {
      return;
    }
    let n = 0;
    context.beginPath();
    context.moveTo(points[0], points[1]);
    if (tension !== 0 && length > 4) {
      const tp = this.getTensionPoints();
      const len = tp.length;
      n = closed ? 0 : 4;
      if (!closed) {
        context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
      }
      while (n < len - 2) {
        context.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
      }
      if (!closed) {
        context.quadraticCurveTo(tp[len - 2], tp[len - 1], points[length - 2], points[length - 1]);
      }
    } else if (bezier) {
      n = 2;
      while (n < length) {
        context.bezierCurveTo(points[n++], points[n++], points[n++], points[n++], points[n++], points[n++]);
      }
    } else {
      for (n = 2; n < length; n += 2) {
        context.lineTo(points[n], points[n + 1]);
      }
    }
    if (closed) {
      context.closePath();
      context.fillStrokeShape(this);
    } else {
      context.strokeShape(this);
    }
  }
  getTensionPoints() {
    return this._getCache("tensionPoints", this._getTensionPoints);
  }
  _getTensionPoints() {
    if (this.closed()) {
      return this._getTensionPointsClosed();
    } else {
      return expandPoints(this.points(), this.tension());
    }
  }
  _getTensionPointsClosed() {
    const p = this.points(), len = p.length, tension = this.tension(), firstControlPoints = getControlPoints(p[len - 2], p[len - 1], p[0], p[1], p[2], p[3], tension), lastControlPoints = getControlPoints(p[len - 4], p[len - 3], p[len - 2], p[len - 1], p[0], p[1], tension), middle = expandPoints(p, tension), tp = [firstControlPoints[2], firstControlPoints[3]].concat(middle).concat([
      lastControlPoints[0],
      lastControlPoints[1],
      p[len - 2],
      p[len - 1],
      lastControlPoints[2],
      lastControlPoints[3],
      firstControlPoints[0],
      firstControlPoints[1],
      p[0],
      p[1]
    ]);
    return tp;
  }
  getWidth() {
    return this.getSelfRect().width;
  }
  getHeight() {
    return this.getSelfRect().height;
  }
  getSelfRect() {
    let points = this.points();
    if (points.length < 4) {
      return {
        x: points[0] || 0,
        y: points[1] || 0,
        width: 0,
        height: 0
      };
    }
    if (this.tension() !== 0) {
      points = [
        points[0],
        points[1],
        ...this._getTensionPoints(),
        points[points.length - 2],
        points[points.length - 1]
      ];
    } else if (this.bezier()) {
      points = [
        points[0],
        points[1],
        ...getBezierExtremaPoints(this.points()),
        points[points.length - 2],
        points[points.length - 1]
      ];
    } else {
      points = this.points();
    }
    let minX = points[0];
    let maxX = points[0];
    let minY = points[1];
    let maxY = points[1];
    let x2, y;
    for (let i = 0; i < points.length / 2; i++) {
      x2 = points[i * 2];
      y = points[i * 2 + 1];
      minX = Math.min(minX, x2);
      maxX = Math.max(maxX, x2);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
};
Line$1.prototype.className = "Line";
Line$1.prototype._attrsAffectingSize = ["points", "bezier", "tension"];
_registerNode(Line$1);
Factory.addGetterSetter(Line$1, "closed", false);
Factory.addGetterSetter(Line$1, "bezier", false);
Factory.addGetterSetter(Line$1, "tension", 0, getNumberValidator());
Factory.addGetterSetter(Line$1, "points", [], getNumberArrayValidator());
const tValues = [
  [],
  [],
  [
    -0.5773502691896257,
    0.5773502691896257
  ],
  [
    0,
    -0.7745966692414834,
    0.7745966692414834
  ],
  [
    -0.33998104358485626,
    0.33998104358485626,
    -0.8611363115940526,
    0.8611363115940526
  ],
  [
    0,
    -0.5384693101056831,
    0.5384693101056831,
    -0.906179845938664,
    0.906179845938664
  ],
  [
    0.6612093864662645,
    -0.6612093864662645,
    -0.2386191860831969,
    0.2386191860831969,
    -0.932469514203152,
    0.932469514203152
  ],
  [
    0,
    0.4058451513773972,
    -0.4058451513773972,
    -0.7415311855993945,
    0.7415311855993945,
    -0.9491079123427585,
    0.9491079123427585
  ],
  [
    -0.1834346424956498,
    0.1834346424956498,
    -0.525532409916329,
    0.525532409916329,
    -0.7966664774136267,
    0.7966664774136267,
    -0.9602898564975363,
    0.9602898564975363
  ],
  [
    0,
    -0.8360311073266358,
    0.8360311073266358,
    -0.9681602395076261,
    0.9681602395076261,
    -0.3242534234038089,
    0.3242534234038089,
    -0.6133714327005904,
    0.6133714327005904
  ],
  [
    -0.14887433898163122,
    0.14887433898163122,
    -0.4333953941292472,
    0.4333953941292472,
    -0.6794095682990244,
    0.6794095682990244,
    -0.8650633666889845,
    0.8650633666889845,
    -0.9739065285171717,
    0.9739065285171717
  ],
  [
    0,
    -0.26954315595234496,
    0.26954315595234496,
    -0.5190961292068118,
    0.5190961292068118,
    -0.7301520055740494,
    0.7301520055740494,
    -0.8870625997680953,
    0.8870625997680953,
    -0.978228658146057,
    0.978228658146057
  ],
  [
    -0.1252334085114689,
    0.1252334085114689,
    -0.3678314989981802,
    0.3678314989981802,
    -0.5873179542866175,
    0.5873179542866175,
    -0.7699026741943047,
    0.7699026741943047,
    -0.9041172563704749,
    0.9041172563704749,
    -0.9815606342467192,
    0.9815606342467192
  ],
  [
    0,
    -0.2304583159551348,
    0.2304583159551348,
    -0.44849275103644687,
    0.44849275103644687,
    -0.6423493394403402,
    0.6423493394403402,
    -0.8015780907333099,
    0.8015780907333099,
    -0.9175983992229779,
    0.9175983992229779,
    -0.9841830547185881,
    0.9841830547185881
  ],
  [
    -0.10805494870734367,
    0.10805494870734367,
    -0.31911236892788974,
    0.31911236892788974,
    -0.5152486363581541,
    0.5152486363581541,
    -0.6872929048116855,
    0.6872929048116855,
    -0.827201315069765,
    0.827201315069765,
    -0.9284348836635735,
    0.9284348836635735,
    -0.9862838086968123,
    0.9862838086968123
  ],
  [
    0,
    -0.20119409399743451,
    0.20119409399743451,
    -0.3941513470775634,
    0.3941513470775634,
    -0.5709721726085388,
    0.5709721726085388,
    -0.7244177313601701,
    0.7244177313601701,
    -0.8482065834104272,
    0.8482065834104272,
    -0.937273392400706,
    0.937273392400706,
    -0.9879925180204854,
    0.9879925180204854
  ],
  [
    -0.09501250983763744,
    0.09501250983763744,
    -0.2816035507792589,
    0.2816035507792589,
    -0.45801677765722737,
    0.45801677765722737,
    -0.6178762444026438,
    0.6178762444026438,
    -0.755404408355003,
    0.755404408355003,
    -0.8656312023878318,
    0.8656312023878318,
    -0.9445750230732326,
    0.9445750230732326,
    -0.9894009349916499,
    0.9894009349916499
  ],
  [
    0,
    -0.17848418149584785,
    0.17848418149584785,
    -0.3512317634538763,
    0.3512317634538763,
    -0.5126905370864769,
    0.5126905370864769,
    -0.6576711592166907,
    0.6576711592166907,
    -0.7815140038968014,
    0.7815140038968014,
    -0.8802391537269859,
    0.8802391537269859,
    -0.9506755217687678,
    0.9506755217687678,
    -0.9905754753144174,
    0.9905754753144174
  ],
  [
    -0.0847750130417353,
    0.0847750130417353,
    -0.2518862256915055,
    0.2518862256915055,
    -0.41175116146284263,
    0.41175116146284263,
    -0.5597708310739475,
    0.5597708310739475,
    -0.6916870430603532,
    0.6916870430603532,
    -0.8037049589725231,
    0.8037049589725231,
    -0.8926024664975557,
    0.8926024664975557,
    -0.9558239495713977,
    0.9558239495713977,
    -0.9915651684209309,
    0.9915651684209309
  ],
  [
    0,
    -0.16035864564022537,
    0.16035864564022537,
    -0.31656409996362983,
    0.31656409996362983,
    -0.46457074137596094,
    0.46457074137596094,
    -0.600545304661681,
    0.600545304661681,
    -0.7209661773352294,
    0.7209661773352294,
    -0.8227146565371428,
    0.8227146565371428,
    -0.9031559036148179,
    0.9031559036148179,
    -0.96020815213483,
    0.96020815213483,
    -0.9924068438435844,
    0.9924068438435844
  ],
  [
    -0.07652652113349734,
    0.07652652113349734,
    -0.22778585114164507,
    0.22778585114164507,
    -0.37370608871541955,
    0.37370608871541955,
    -0.5108670019508271,
    0.5108670019508271,
    -0.636053680726515,
    0.636053680726515,
    -0.7463319064601508,
    0.7463319064601508,
    -0.8391169718222188,
    0.8391169718222188,
    -0.912234428251326,
    0.912234428251326,
    -0.9639719272779138,
    0.9639719272779138,
    -0.9931285991850949,
    0.9931285991850949
  ],
  [
    0,
    -0.1455618541608951,
    0.1455618541608951,
    -0.2880213168024011,
    0.2880213168024011,
    -0.4243421202074388,
    0.4243421202074388,
    -0.5516188358872198,
    0.5516188358872198,
    -0.6671388041974123,
    0.6671388041974123,
    -0.7684399634756779,
    0.7684399634756779,
    -0.8533633645833173,
    0.8533633645833173,
    -0.9200993341504008,
    0.9200993341504008,
    -0.9672268385663063,
    0.9672268385663063,
    -0.9937521706203895,
    0.9937521706203895
  ],
  [
    -0.06973927331972223,
    0.06973927331972223,
    -0.20786042668822127,
    0.20786042668822127,
    -0.34193582089208424,
    0.34193582089208424,
    -0.469355837986757,
    0.469355837986757,
    -0.5876404035069116,
    0.5876404035069116,
    -0.6944872631866827,
    0.6944872631866827,
    -0.7878168059792081,
    0.7878168059792081,
    -0.8658125777203002,
    0.8658125777203002,
    -0.926956772187174,
    0.926956772187174,
    -0.9700604978354287,
    0.9700604978354287,
    -0.9942945854823992,
    0.9942945854823992
  ],
  [
    0,
    -0.1332568242984661,
    0.1332568242984661,
    -0.26413568097034495,
    0.26413568097034495,
    -0.3903010380302908,
    0.3903010380302908,
    -0.5095014778460075,
    0.5095014778460075,
    -0.6196098757636461,
    0.6196098757636461,
    -0.7186613631319502,
    0.7186613631319502,
    -0.8048884016188399,
    0.8048884016188399,
    -0.8767523582704416,
    0.8767523582704416,
    -0.9329710868260161,
    0.9329710868260161,
    -0.9725424712181152,
    0.9725424712181152,
    -0.9947693349975522,
    0.9947693349975522
  ],
  [
    -0.06405689286260563,
    0.06405689286260563,
    -0.1911188674736163,
    0.1911188674736163,
    -0.3150426796961634,
    0.3150426796961634,
    -0.4337935076260451,
    0.4337935076260451,
    -0.5454214713888396,
    0.5454214713888396,
    -0.6480936519369755,
    0.6480936519369755,
    -0.7401241915785544,
    0.7401241915785544,
    -0.820001985973903,
    0.820001985973903,
    -0.8864155270044011,
    0.8864155270044011,
    -0.9382745520027328,
    0.9382745520027328,
    -0.9747285559713095,
    0.9747285559713095,
    -0.9951872199970213,
    0.9951872199970213
  ]
];
const cValues = [
  [],
  [],
  [1, 1],
  [
    0.8888888888888888,
    0.5555555555555556,
    0.5555555555555556
  ],
  [
    0.6521451548625461,
    0.6521451548625461,
    0.34785484513745385,
    0.34785484513745385
  ],
  [
    0.5688888888888889,
    0.47862867049936647,
    0.47862867049936647,
    0.23692688505618908,
    0.23692688505618908
  ],
  [
    0.3607615730481386,
    0.3607615730481386,
    0.46791393457269104,
    0.46791393457269104,
    0.17132449237917036,
    0.17132449237917036
  ],
  [
    0.4179591836734694,
    0.3818300505051189,
    0.3818300505051189,
    0.27970539148927664,
    0.27970539148927664,
    0.1294849661688697,
    0.1294849661688697
  ],
  [
    0.362683783378362,
    0.362683783378362,
    0.31370664587788727,
    0.31370664587788727,
    0.22238103445337448,
    0.22238103445337448,
    0.10122853629037626,
    0.10122853629037626
  ],
  [
    0.3302393550012598,
    0.1806481606948574,
    0.1806481606948574,
    0.08127438836157441,
    0.08127438836157441,
    0.31234707704000286,
    0.31234707704000286,
    0.26061069640293544,
    0.26061069640293544
  ],
  [
    0.29552422471475287,
    0.29552422471475287,
    0.26926671930999635,
    0.26926671930999635,
    0.21908636251598204,
    0.21908636251598204,
    0.1494513491505806,
    0.1494513491505806,
    0.06667134430868814,
    0.06667134430868814
  ],
  [
    0.2729250867779006,
    0.26280454451024665,
    0.26280454451024665,
    0.23319376459199048,
    0.23319376459199048,
    0.18629021092773426,
    0.18629021092773426,
    0.1255803694649046,
    0.1255803694649046,
    0.05566856711617366,
    0.05566856711617366
  ],
  [
    0.24914704581340277,
    0.24914704581340277,
    0.2334925365383548,
    0.2334925365383548,
    0.20316742672306592,
    0.20316742672306592,
    0.16007832854334622,
    0.16007832854334622,
    0.10693932599531843,
    0.10693932599531843,
    0.04717533638651183,
    0.04717533638651183
  ],
  [
    0.2325515532308739,
    0.22628318026289723,
    0.22628318026289723,
    0.2078160475368885,
    0.2078160475368885,
    0.17814598076194574,
    0.17814598076194574,
    0.13887351021978725,
    0.13887351021978725,
    0.09212149983772845,
    0.09212149983772845,
    0.04048400476531588,
    0.04048400476531588
  ],
  [
    0.2152638534631578,
    0.2152638534631578,
    0.2051984637212956,
    0.2051984637212956,
    0.18553839747793782,
    0.18553839747793782,
    0.15720316715819355,
    0.15720316715819355,
    0.12151857068790319,
    0.12151857068790319,
    0.08015808715976021,
    0.08015808715976021,
    0.03511946033175186,
    0.03511946033175186
  ],
  [
    0.2025782419255613,
    0.19843148532711158,
    0.19843148532711158,
    0.1861610000155622,
    0.1861610000155622,
    0.16626920581699392,
    0.16626920581699392,
    0.13957067792615432,
    0.13957067792615432,
    0.10715922046717194,
    0.10715922046717194,
    0.07036604748810812,
    0.07036604748810812,
    0.03075324199611727,
    0.03075324199611727
  ],
  [
    0.1894506104550685,
    0.1894506104550685,
    0.18260341504492358,
    0.18260341504492358,
    0.16915651939500254,
    0.16915651939500254,
    0.14959598881657674,
    0.14959598881657674,
    0.12462897125553388,
    0.12462897125553388,
    0.09515851168249279,
    0.09515851168249279,
    0.062253523938647894,
    0.062253523938647894,
    0.027152459411754096,
    0.027152459411754096
  ],
  [
    0.17944647035620653,
    0.17656270536699264,
    0.17656270536699264,
    0.16800410215645004,
    0.16800410215645004,
    0.15404576107681028,
    0.15404576107681028,
    0.13513636846852548,
    0.13513636846852548,
    0.11188384719340397,
    0.11188384719340397,
    0.08503614831717918,
    0.08503614831717918,
    0.0554595293739872,
    0.0554595293739872,
    0.02414830286854793,
    0.02414830286854793
  ],
  [
    0.1691423829631436,
    0.1691423829631436,
    0.16427648374583273,
    0.16427648374583273,
    0.15468467512626524,
    0.15468467512626524,
    0.14064291467065065,
    0.14064291467065065,
    0.12255520671147846,
    0.12255520671147846,
    0.10094204410628717,
    0.10094204410628717,
    0.07642573025488905,
    0.07642573025488905,
    0.0497145488949698,
    0.0497145488949698,
    0.02161601352648331,
    0.02161601352648331
  ],
  [
    0.1610544498487837,
    0.15896884339395434,
    0.15896884339395434,
    0.15276604206585967,
    0.15276604206585967,
    0.1426067021736066,
    0.1426067021736066,
    0.12875396253933621,
    0.12875396253933621,
    0.11156664554733399,
    0.11156664554733399,
    0.09149002162245,
    0.09149002162245,
    0.06904454273764123,
    0.06904454273764123,
    0.0448142267656996,
    0.0448142267656996,
    0.019461788229726478,
    0.019461788229726478
  ],
  [
    0.15275338713072584,
    0.15275338713072584,
    0.14917298647260374,
    0.14917298647260374,
    0.14209610931838204,
    0.14209610931838204,
    0.13168863844917664,
    0.13168863844917664,
    0.11819453196151841,
    0.11819453196151841,
    0.10193011981724044,
    0.10193011981724044,
    0.08327674157670475,
    0.08327674157670475,
    0.06267204833410907,
    0.06267204833410907,
    0.04060142980038694,
    0.04060142980038694,
    0.017614007139152118,
    0.017614007139152118
  ],
  [
    0.14608113364969041,
    0.14452440398997005,
    0.14452440398997005,
    0.13988739479107315,
    0.13988739479107315,
    0.13226893863333747,
    0.13226893863333747,
    0.12183141605372853,
    0.12183141605372853,
    0.10879729916714838,
    0.10879729916714838,
    0.09344442345603386,
    0.09344442345603386,
    0.0761001136283793,
    0.0761001136283793,
    0.057134425426857205,
    0.057134425426857205,
    0.036953789770852494,
    0.036953789770852494,
    0.016017228257774335,
    0.016017228257774335
  ],
  [
    0.13925187285563198,
    0.13925187285563198,
    0.13654149834601517,
    0.13654149834601517,
    0.13117350478706238,
    0.13117350478706238,
    0.12325237681051242,
    0.12325237681051242,
    0.11293229608053922,
    0.11293229608053922,
    0.10041414444288096,
    0.10041414444288096,
    0.08594160621706773,
    0.08594160621706773,
    0.06979646842452049,
    0.06979646842452049,
    0.052293335152683286,
    0.052293335152683286,
    0.03377490158481415,
    0.03377490158481415,
    0.0146279952982722,
    0.0146279952982722
  ],
  [
    0.13365457218610619,
    0.1324620394046966,
    0.1324620394046966,
    0.12890572218808216,
    0.12890572218808216,
    0.12304908430672953,
    0.12304908430672953,
    0.11499664022241136,
    0.11499664022241136,
    0.10489209146454141,
    0.10489209146454141,
    0.09291576606003515,
    0.09291576606003515,
    0.07928141177671895,
    0.07928141177671895,
    0.06423242140852585,
    0.06423242140852585,
    0.04803767173108467,
    0.04803767173108467,
    0.030988005856979445,
    0.030988005856979445,
    0.013411859487141771,
    0.013411859487141771
  ],
  [
    0.12793819534675216,
    0.12793819534675216,
    0.1258374563468283,
    0.1258374563468283,
    0.12167047292780339,
    0.12167047292780339,
    0.1155056680537256,
    0.1155056680537256,
    0.10744427011596563,
    0.10744427011596563,
    0.09761865210411388,
    0.09761865210411388,
    0.08619016153195327,
    0.08619016153195327,
    0.0733464814110803,
    0.0733464814110803,
    0.05929858491543678,
    0.05929858491543678,
    0.04427743881741981,
    0.04427743881741981,
    0.028531388628933663,
    0.028531388628933663,
    0.0123412297999872,
    0.0123412297999872
  ]
];
const binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
const getCubicArcLength = (xs, ys, t) => {
  let sum;
  let correctedT;
  const n = 20;
  const z = t / 2;
  sum = 0;
  for (let i = 0; i < n; i++) {
    correctedT = z * tValues[n][i] + z;
    sum += cValues[n][i] * BFunc(xs, ys, correctedT);
  }
  return z * sum;
};
const getQuadraticArcLength = (xs, ys, t) => {
  if (t === void 0) {
    t = 1;
  }
  const ax = xs[0] - 2 * xs[1] + xs[2];
  const ay = ys[0] - 2 * ys[1] + ys[2];
  const bx = 2 * xs[1] - 2 * xs[0];
  const by = 2 * ys[1] - 2 * ys[0];
  const A = 4 * (ax * ax + ay * ay);
  const B = 4 * (ax * bx + ay * by);
  const C = bx * bx + by * by;
  if (A === 0) {
    return t * Math.sqrt(Math.pow(xs[2] - xs[0], 2) + Math.pow(ys[2] - ys[0], 2));
  }
  const b = B / (2 * A);
  const c = C / A;
  const u = t + b;
  const k = c - b * b;
  const uuk = u * u + k > 0 ? Math.sqrt(u * u + k) : 0;
  const bbk = b * b + k > 0 ? Math.sqrt(b * b + k) : 0;
  const term = b + Math.sqrt(b * b + k) !== 0 ? k * Math.log(Math.abs((u + uuk) / (b + bbk))) : 0;
  return Math.sqrt(A) / 2 * (u * uuk - b * bbk + term);
};
function BFunc(xs, ys, t) {
  const xbase = getDerivative(1, t, xs);
  const ybase = getDerivative(1, t, ys);
  const combined = xbase * xbase + ybase * ybase;
  return Math.sqrt(combined);
}
const getDerivative = (derivative, t, vs) => {
  const n = vs.length - 1;
  let _vs;
  let value;
  if (n === 0) {
    return 0;
  }
  if (derivative === 0) {
    value = 0;
    for (let k = 0; k <= n; k++) {
      value += binomialCoefficients[n][k] * Math.pow(1 - t, n - k) * Math.pow(t, k) * vs[k];
    }
    return value;
  } else {
    _vs = new Array(n);
    for (let k = 0; k < n; k++) {
      _vs[k] = n * (vs[k + 1] - vs[k]);
    }
    return getDerivative(derivative - 1, t, _vs);
  }
};
const t2length = (length, totalLength, func) => {
  let error = 1;
  let t = length / totalLength;
  let step = (length - func(t)) / totalLength;
  let numIterations = 0;
  while (error > 1e-3) {
    const increasedTLength = func(t + step);
    const increasedTError = Math.abs(length - increasedTLength) / totalLength;
    if (increasedTError < error) {
      error = increasedTError;
      t += step;
    } else {
      const decreasedTLength = func(t - step);
      const decreasedTError = Math.abs(length - decreasedTLength) / totalLength;
      if (decreasedTError < error) {
        error = decreasedTError;
        t -= step;
      } else {
        step /= 2;
      }
    }
    numIterations++;
    if (numIterations > 500) {
      break;
    }
  }
  return t;
};
class Path extends Shape {
  constructor(config) {
    super(config);
    this.dataArray = [];
    this.pathLength = 0;
    this._readDataAttribute();
    this.on("dataChange.konva", function() {
      this._readDataAttribute();
    });
  }
  _readDataAttribute() {
    this.dataArray = Path.parsePathData(this.data());
    this.pathLength = Path.getPathLength(this.dataArray);
  }
  _sceneFunc(context) {
    const ca = this.dataArray;
    context.beginPath();
    let isClosed = false;
    for (let n = 0; n < ca.length; n++) {
      const c = ca[n].command;
      const p = ca[n].points;
      switch (c) {
        case "L":
          context.lineTo(p[0], p[1]);
          break;
        case "M":
          context.moveTo(p[0], p[1]);
          break;
        case "C":
          context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
          break;
        case "Q":
          context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
          break;
        case "A":
          const cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];
          const r = rx > ry ? rx : ry;
          const scaleX = rx > ry ? 1 : rx / ry;
          const scaleY = rx > ry ? ry / rx : 1;
          context.translate(cx, cy);
          context.rotate(psi);
          context.scale(scaleX, scaleY);
          context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
          context.scale(1 / scaleX, 1 / scaleY);
          context.rotate(-psi);
          context.translate(-cx, -cy);
          break;
        case "z":
          isClosed = true;
          context.closePath();
          break;
      }
    }
    if (!isClosed && !this.hasFill()) {
      context.strokeShape(this);
    } else {
      context.fillStrokeShape(this);
    }
  }
  getSelfRect() {
    let points = [];
    this.dataArray.forEach(function(data) {
      if (data.command === "A") {
        const start = data.points[4];
        const dTheta = data.points[5];
        const end = data.points[4] + dTheta;
        let inc = Math.PI / 180;
        if (Math.abs(start - end) < inc) {
          inc = Math.abs(start - end);
        }
        if (dTheta < 0) {
          for (let t = start - inc; t > end; t -= inc) {
            const point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
            points.push(point.x, point.y);
          }
        } else {
          for (let t = start + inc; t < end; t += inc) {
            const point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
            points.push(point.x, point.y);
          }
        }
      } else if (data.command === "C") {
        for (let t = 0; t <= 1; t += 0.01) {
          const point = Path.getPointOnCubicBezier(t, data.start.x, data.start.y, data.points[0], data.points[1], data.points[2], data.points[3], data.points[4], data.points[5]);
          points.push(point.x, point.y);
        }
      } else {
        points = points.concat(data.points);
      }
    });
    let minX = points[0];
    let maxX = points[0];
    let minY = points[1];
    let maxY = points[1];
    let x2, y;
    for (let i = 0; i < points.length / 2; i++) {
      x2 = points[i * 2];
      y = points[i * 2 + 1];
      if (!isNaN(x2)) {
        minX = Math.min(minX, x2);
        maxX = Math.max(maxX, x2);
      }
      if (!isNaN(y)) {
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  getLength() {
    return this.pathLength;
  }
  getPointAtLength(length) {
    return Path.getPointAtLengthOfDataArray(length, this.dataArray);
  }
  static getLineLength(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
  static getPathLength(dataArray) {
    let pathLength = 0;
    for (let i = 0; i < dataArray.length; ++i) {
      pathLength += dataArray[i].pathLength;
    }
    return pathLength;
  }
  static getPointAtLengthOfDataArray(length, dataArray) {
    let points, i = 0, ii = dataArray.length;
    if (!ii) {
      return null;
    }
    while (i < ii && length > dataArray[i].pathLength) {
      length -= dataArray[i].pathLength;
      ++i;
    }
    if (i === ii) {
      points = dataArray[i - 1].points.slice(-2);
      return {
        x: points[0],
        y: points[1]
      };
    }
    if (length < 0.01) {
      const cmd = dataArray[i].command;
      if (cmd === "M") {
        points = dataArray[i].points.slice(0, 2);
        return {
          x: points[0],
          y: points[1]
        };
      } else {
        return {
          x: dataArray[i].start.x,
          y: dataArray[i].start.y
        };
      }
    }
    const cp = dataArray[i];
    const p = cp.points;
    switch (cp.command) {
      case "L":
        return Path.getPointOnLine(length, cp.start.x, cp.start.y, p[0], p[1]);
      case "C":
        return Path.getPointOnCubicBezier(t2length(length, Path.getPathLength(dataArray), (i2) => {
          return getCubicArcLength([cp.start.x, p[0], p[2], p[4]], [cp.start.y, p[1], p[3], p[5]], i2);
        }), cp.start.x, cp.start.y, p[0], p[1], p[2], p[3], p[4], p[5]);
      case "Q":
        return Path.getPointOnQuadraticBezier(t2length(length, Path.getPathLength(dataArray), (i2) => {
          return getQuadraticArcLength([cp.start.x, p[0], p[2]], [cp.start.y, p[1], p[3]], i2);
        }), cp.start.x, cp.start.y, p[0], p[1], p[2], p[3]);
      case "A":
        const cx = p[0], cy = p[1], rx = p[2], ry = p[3], dTheta = p[5], psi = p[6];
        let theta = p[4];
        theta += dTheta * length / cp.pathLength;
        return Path.getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi);
    }
    return null;
  }
  static getPointOnLine(dist, P1x, P1y, P2x, P2y, fromX, fromY) {
    fromX = fromX !== null && fromX !== void 0 ? fromX : P1x;
    fromY = fromY !== null && fromY !== void 0 ? fromY : P1y;
    const len = this.getLineLength(P1x, P1y, P2x, P2y);
    if (len < 1e-10) {
      return { x: P1x, y: P1y };
    }
    if (P2x === P1x) {
      return { x: fromX, y: fromY + (P2y > P1y ? dist : -dist) };
    }
    const m2 = (P2y - P1y) / (P2x - P1x);
    const run = Math.sqrt(dist * dist / (1 + m2 * m2)) * (P2x < P1x ? -1 : 1);
    const rise = m2 * run;
    if (Math.abs(fromY - P1y - m2 * (fromX - P1x)) < 1e-10) {
      return { x: fromX + run, y: fromY + rise };
    }
    const u = ((fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y)) / (len * len);
    const ix = P1x + u * (P2x - P1x);
    const iy = P1y + u * (P2y - P1y);
    const pRise = this.getLineLength(fromX, fromY, ix, iy);
    const pRun = Math.sqrt(dist * dist - pRise * pRise);
    const adjustedRun = Math.sqrt(pRun * pRun / (1 + m2 * m2)) * (P2x < P1x ? -1 : 1);
    const adjustedRise = m2 * adjustedRun;
    return { x: ix + adjustedRun, y: iy + adjustedRise };
  }
  static getPointOnCubicBezier(pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
    function CB1(t) {
      return t * t * t;
    }
    function CB2(t) {
      return 3 * t * t * (1 - t);
    }
    function CB3(t) {
      return 3 * t * (1 - t) * (1 - t);
    }
    function CB4(t) {
      return (1 - t) * (1 - t) * (1 - t);
    }
    const x2 = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
    const y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);
    return { x: x2, y };
  }
  static getPointOnQuadraticBezier(pct, P1x, P1y, P2x, P2y, P3x, P3y) {
    function QB1(t) {
      return t * t;
    }
    function QB2(t) {
      return 2 * t * (1 - t);
    }
    function QB3(t) {
      return (1 - t) * (1 - t);
    }
    const x2 = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
    const y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);
    return { x: x2, y };
  }
  static getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi) {
    const cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
    const pt = {
      x: rx * Math.cos(theta),
      y: ry * Math.sin(theta)
    };
    return {
      x: cx + (pt.x * cosPsi - pt.y * sinPsi),
      y: cy + (pt.x * sinPsi + pt.y * cosPsi)
    };
  }
  static parsePathData(data) {
    if (!data) {
      return [];
    }
    let cs = data;
    const cc = [
      "m",
      "M",
      "l",
      "L",
      "v",
      "V",
      "h",
      "H",
      "z",
      "Z",
      "c",
      "C",
      "q",
      "Q",
      "t",
      "T",
      "s",
      "S",
      "a",
      "A"
    ];
    cs = cs.replace(new RegExp(" ", "g"), ",");
    for (let n = 0; n < cc.length; n++) {
      cs = cs.replace(new RegExp(cc[n], "g"), "|" + cc[n]);
    }
    const arr = cs.split("|");
    const ca = [];
    const coords = [];
    let cpx = 0;
    let cpy = 0;
    const re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
    let match;
    for (let n = 1; n < arr.length; n++) {
      let str = arr[n];
      let c = str.charAt(0);
      str = str.slice(1);
      coords.length = 0;
      while (match = re.exec(str)) {
        coords.push(match[0]);
      }
      let p = [];
      let arcParamIndex = c === "A" || c === "a" ? 0 : -1;
      for (let j = 0, jlen = coords.length; j < jlen; j++) {
        const token = coords[j];
        if (token === "00") {
          p.push(0, 0);
          if (arcParamIndex >= 0) {
            arcParamIndex += 2;
            if (arcParamIndex >= 7)
              arcParamIndex -= 7;
          }
          continue;
        }
        if (arcParamIndex >= 0) {
          if (arcParamIndex === 3) {
            if (/^[01]{2}\d+(?:\.\d+)?$/.test(token)) {
              p.push(parseInt(token[0], 10));
              p.push(parseInt(token[1], 10));
              p.push(parseFloat(token.slice(2)));
              arcParamIndex += 3;
              if (arcParamIndex >= 7)
                arcParamIndex -= 7;
              continue;
            }
            if (token === "11" || token === "10" || token === "01") {
              p.push(parseInt(token[0], 10));
              p.push(parseInt(token[1], 10));
              arcParamIndex += 2;
              if (arcParamIndex >= 7)
                arcParamIndex -= 7;
              continue;
            }
            if (token === "0" || token === "1") {
              p.push(parseInt(token, 10));
              arcParamIndex += 1;
              if (arcParamIndex >= 7)
                arcParamIndex -= 7;
              continue;
            }
          } else if (arcParamIndex === 4) {
            if (/^[01]\d+(?:\.\d+)?$/.test(token)) {
              p.push(parseInt(token[0], 10));
              p.push(parseFloat(token.slice(1)));
              arcParamIndex += 2;
              if (arcParamIndex >= 7)
                arcParamIndex -= 7;
              continue;
            }
            if (token === "0" || token === "1") {
              p.push(parseInt(token, 10));
              arcParamIndex += 1;
              if (arcParamIndex >= 7)
                arcParamIndex -= 7;
              continue;
            }
          }
          const parsedArc = parseFloat(token);
          if (!isNaN(parsedArc)) {
            p.push(parsedArc);
          } else {
            p.push(0);
          }
          arcParamIndex += 1;
          if (arcParamIndex >= 7)
            arcParamIndex -= 7;
        } else {
          const parsed = parseFloat(token);
          if (!isNaN(parsed)) {
            p.push(parsed);
          } else {
            p.push(0);
          }
        }
      }
      while (p.length > 0) {
        if (isNaN(p[0])) {
          break;
        }
        let cmd = "";
        let points = [];
        const startX = cpx, startY = cpy;
        let prevCmd, ctlPtx, ctlPty;
        let rx, ry, psi, fa, fs, x1, y1;
        switch (c) {
          case "l":
            cpx += p.shift();
            cpy += p.shift();
            cmd = "L";
            points.push(cpx, cpy);
            break;
          case "L":
            cpx = p.shift();
            cpy = p.shift();
            points.push(cpx, cpy);
            break;
          case "m":
            const dx = p.shift();
            const dy = p.shift();
            cpx += dx;
            cpy += dy;
            cmd = "M";
            if (ca.length > 2 && ca[ca.length - 1].command === "z") {
              for (let idx = ca.length - 2; idx >= 0; idx--) {
                if (ca[idx].command === "M") {
                  cpx = ca[idx].points[0] + dx;
                  cpy = ca[idx].points[1] + dy;
                  break;
                }
              }
            }
            points.push(cpx, cpy);
            c = "l";
            break;
          case "M":
            cpx = p.shift();
            cpy = p.shift();
            cmd = "M";
            points.push(cpx, cpy);
            c = "L";
            break;
          case "h":
            cpx += p.shift();
            cmd = "L";
            points.push(cpx, cpy);
            break;
          case "H":
            cpx = p.shift();
            cmd = "L";
            points.push(cpx, cpy);
            break;
          case "v":
            cpy += p.shift();
            cmd = "L";
            points.push(cpx, cpy);
            break;
          case "V":
            cpy = p.shift();
            cmd = "L";
            points.push(cpx, cpy);
            break;
          case "C":
            points.push(p.shift(), p.shift(), p.shift(), p.shift());
            cpx = p.shift();
            cpy = p.shift();
            points.push(cpx, cpy);
            break;
          case "c":
            points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
            cpx += p.shift();
            cpy += p.shift();
            cmd = "C";
            points.push(cpx, cpy);
            break;
          case "S":
            ctlPtx = cpx;
            ctlPty = cpy;
            prevCmd = ca[ca.length - 1];
            if (prevCmd.command === "C") {
              ctlPtx = cpx + (cpx - prevCmd.points[2]);
              ctlPty = cpy + (cpy - prevCmd.points[3]);
            }
            points.push(ctlPtx, ctlPty, p.shift(), p.shift());
            cpx = p.shift();
            cpy = p.shift();
            cmd = "C";
            points.push(cpx, cpy);
            break;
          case "s":
            ctlPtx = cpx;
            ctlPty = cpy;
            prevCmd = ca[ca.length - 1];
            if (prevCmd.command === "C") {
              ctlPtx = cpx + (cpx - prevCmd.points[2]);
              ctlPty = cpy + (cpy - prevCmd.points[3]);
            }
            points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
            cpx += p.shift();
            cpy += p.shift();
            cmd = "C";
            points.push(cpx, cpy);
            break;
          case "Q":
            points.push(p.shift(), p.shift());
            cpx = p.shift();
            cpy = p.shift();
            points.push(cpx, cpy);
            break;
          case "q":
            points.push(cpx + p.shift(), cpy + p.shift());
            cpx += p.shift();
            cpy += p.shift();
            cmd = "Q";
            points.push(cpx, cpy);
            break;
          case "T":
            ctlPtx = cpx;
            ctlPty = cpy;
            prevCmd = ca[ca.length - 1];
            if (prevCmd.command === "Q") {
              ctlPtx = cpx + (cpx - prevCmd.points[0]);
              ctlPty = cpy + (cpy - prevCmd.points[1]);
            }
            cpx = p.shift();
            cpy = p.shift();
            cmd = "Q";
            points.push(ctlPtx, ctlPty, cpx, cpy);
            break;
          case "t":
            ctlPtx = cpx;
            ctlPty = cpy;
            prevCmd = ca[ca.length - 1];
            if (prevCmd.command === "Q") {
              ctlPtx = cpx + (cpx - prevCmd.points[0]);
              ctlPty = cpy + (cpy - prevCmd.points[1]);
            }
            cpx += p.shift();
            cpy += p.shift();
            cmd = "Q";
            points.push(ctlPtx, ctlPty, cpx, cpy);
            break;
          case "A":
            rx = p.shift();
            ry = p.shift();
            psi = p.shift();
            fa = p.shift();
            fs = p.shift();
            x1 = cpx;
            y1 = cpy;
            cpx = p.shift();
            cpy = p.shift();
            cmd = "A";
            points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
            break;
          case "a":
            rx = p.shift();
            ry = p.shift();
            psi = p.shift();
            fa = p.shift();
            fs = p.shift();
            x1 = cpx;
            y1 = cpy;
            cpx += p.shift();
            cpy += p.shift();
            cmd = "A";
            points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
            break;
        }
        ca.push({
          command: cmd || c,
          points,
          start: {
            x: startX,
            y: startY
          },
          pathLength: this.calcLength(startX, startY, cmd || c, points)
        });
      }
      if (c === "z" || c === "Z") {
        ca.push({
          command: "z",
          points: [],
          start: void 0,
          pathLength: 0
        });
      }
    }
    return ca;
  }
  static calcLength(x2, y, cmd, points) {
    let len, p1, p2, t;
    const path = Path;
    switch (cmd) {
      case "L":
        return path.getLineLength(x2, y, points[0], points[1]);
      case "C":
        return getCubicArcLength([x2, points[0], points[2], points[4]], [y, points[1], points[3], points[5]], 1);
      case "Q":
        return getQuadraticArcLength([x2, points[0], points[2]], [y, points[1], points[3]], 1);
      case "A":
        len = 0;
        const start = points[4];
        const dTheta = points[5];
        const end = points[4] + dTheta;
        let inc = Math.PI / 180;
        if (Math.abs(start - end) < inc) {
          inc = Math.abs(start - end);
        }
        p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
        if (dTheta < 0) {
          for (t = start - inc; t > end; t -= inc) {
            p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
            len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }
        } else {
          for (t = start + inc; t < end; t += inc) {
            p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
            len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }
        }
        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
        return len;
    }
    return 0;
  }
  static convertEndpointToCenterParameterization(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
    const psi = psiDeg * (Math.PI / 180);
    const xp = Math.cos(psi) * (x1 - x2) / 2 + Math.sin(psi) * (y1 - y2) / 2;
    const yp = -1 * Math.sin(psi) * (x1 - x2) / 2 + Math.cos(psi) * (y1 - y2) / 2;
    const lambda = xp * xp / (rx * rx) + yp * yp / (ry * ry);
    if (lambda > 1) {
      rx *= Math.sqrt(lambda);
      ry *= Math.sqrt(lambda);
    }
    let f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) / (rx * rx * (yp * yp) + ry * ry * (xp * xp)));
    if (fa === fs) {
      f *= -1;
    }
    if (isNaN(f)) {
      f = 0;
    }
    const cxp = f * rx * yp / ry;
    const cyp = f * -ry * xp / rx;
    const cx = (x1 + x2) / 2 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
    const cy = (y1 + y2) / 2 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
    const vMag = function(v2) {
      return Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
    };
    const vRatio = function(u2, v2) {
      return (u2[0] * v2[0] + u2[1] * v2[1]) / (vMag(u2) * vMag(v2));
    };
    const vAngle = function(u2, v2) {
      return (u2[0] * v2[1] < u2[1] * v2[0] ? -1 : 1) * Math.acos(vRatio(u2, v2));
    };
    const theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
    const u = [(xp - cxp) / rx, (yp - cyp) / ry];
    const v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
    let dTheta = vAngle(u, v);
    if (vRatio(u, v) <= -1) {
      dTheta = Math.PI;
    }
    if (vRatio(u, v) >= 1) {
      dTheta = 0;
    }
    if (fs === 0 && dTheta > 0) {
      dTheta = dTheta - 2 * Math.PI;
    }
    if (fs === 1 && dTheta < 0) {
      dTheta = dTheta + 2 * Math.PI;
    }
    return [cx, cy, rx, ry, theta, dTheta, psi, fs];
  }
}
Path.prototype.className = "Path";
Path.prototype._attrsAffectingSize = ["data"];
_registerNode(Path);
Factory.addGetterSetter(Path, "data");
class Arrow extends Line$1 {
  _sceneFunc(ctx) {
    super._sceneFunc(ctx);
    const PI2 = Math.PI * 2;
    const points = this.points();
    let tp = points;
    const fromTension = this.tension() !== 0 && points.length > 4;
    if (fromTension) {
      tp = this.getTensionPoints();
    }
    const length = this.pointerLength();
    const n = points.length;
    let dx, dy;
    if (fromTension) {
      const lp = [
        tp[tp.length - 4],
        tp[tp.length - 3],
        tp[tp.length - 2],
        tp[tp.length - 1],
        points[n - 2],
        points[n - 1]
      ];
      const lastLength = Path.calcLength(tp[tp.length - 4], tp[tp.length - 3], "C", lp);
      const previous = Path.getPointOnQuadraticBezier(Math.min(1, 1 - length / lastLength), lp[0], lp[1], lp[2], lp[3], lp[4], lp[5]);
      dx = points[n - 2] - previous.x;
      dy = points[n - 1] - previous.y;
    } else {
      dx = points[n - 2] - points[n - 4];
      dy = points[n - 1] - points[n - 3];
    }
    const radians = (Math.atan2(dy, dx) + PI2) % PI2;
    const width = this.pointerWidth();
    if (this.pointerAtEnding()) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(points[n - 2], points[n - 1]);
      ctx.rotate(radians);
      ctx.moveTo(0, 0);
      ctx.lineTo(-length, width / 2);
      ctx.lineTo(-length, -width / 2);
      ctx.closePath();
      ctx.restore();
      this.__fillStroke(ctx);
    }
    if (this.pointerAtBeginning()) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(points[0], points[1]);
      if (fromTension) {
        dx = (tp[0] + tp[2]) / 2 - points[0];
        dy = (tp[1] + tp[3]) / 2 - points[1];
      } else {
        dx = points[2] - points[0];
        dy = points[3] - points[1];
      }
      ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
      ctx.moveTo(0, 0);
      ctx.lineTo(-length, width / 2);
      ctx.lineTo(-length, -width / 2);
      ctx.closePath();
      ctx.restore();
      this.__fillStroke(ctx);
    }
  }
  __fillStroke(ctx) {
    const isDashEnabled = this.dashEnabled();
    if (isDashEnabled) {
      this.attrs.dashEnabled = false;
      ctx.setLineDash([]);
    }
    ctx.fillStrokeShape(this);
    if (isDashEnabled) {
      this.attrs.dashEnabled = true;
    }
  }
  getSelfRect() {
    const lineRect = super.getSelfRect();
    const offset = this.pointerWidth() / 2;
    return {
      x: lineRect.x,
      y: lineRect.y - offset,
      width: lineRect.width,
      height: lineRect.height + offset * 2
    };
  }
}
Arrow.prototype.className = "Arrow";
_registerNode(Arrow);
Factory.addGetterSetter(Arrow, "pointerLength", 10, getNumberValidator());
Factory.addGetterSetter(Arrow, "pointerWidth", 10, getNumberValidator());
Factory.addGetterSetter(Arrow, "pointerAtBeginning", false);
Factory.addGetterSetter(Arrow, "pointerAtEnding", true);
let Circle$1 = class Circle extends Shape {
  _sceneFunc(context) {
    context.beginPath();
    context.arc(0, 0, this.attrs.radius || 0, 0, Math.PI * 2, false);
    context.closePath();
    context.fillStrokeShape(this);
  }
  getWidth() {
    return this.radius() * 2;
  }
  getHeight() {
    return this.radius() * 2;
  }
  setWidth(width) {
    if (this.radius() !== width / 2) {
      this.radius(width / 2);
    }
  }
  setHeight(height) {
    if (this.radius() !== height / 2) {
      this.radius(height / 2);
    }
  }
};
Circle$1.prototype._centroid = true;
Circle$1.prototype.className = "Circle";
Circle$1.prototype._attrsAffectingSize = ["radius"];
_registerNode(Circle$1);
Factory.addGetterSetter(Circle$1, "radius", 0, getNumberValidator());
let Ellipse$1 = class Ellipse extends Shape {
  _sceneFunc(context) {
    const rx = this.radiusX(), ry = this.radiusY();
    context.beginPath();
    context.save();
    if (rx !== ry) {
      context.scale(1, ry / rx);
    }
    context.arc(0, 0, rx, 0, Math.PI * 2, false);
    context.restore();
    context.closePath();
    context.fillStrokeShape(this);
  }
  getWidth() {
    return this.radiusX() * 2;
  }
  getHeight() {
    return this.radiusY() * 2;
  }
  setWidth(width) {
    this.radiusX(width / 2);
  }
  setHeight(height) {
    this.radiusY(height / 2);
  }
};
Ellipse$1.prototype.className = "Ellipse";
Ellipse$1.prototype._centroid = true;
Ellipse$1.prototype._attrsAffectingSize = ["radiusX", "radiusY"];
_registerNode(Ellipse$1);
Factory.addComponentsGetterSetter(Ellipse$1, "radius", ["x", "y"]);
Factory.addGetterSetter(Ellipse$1, "radiusX", 0, getNumberValidator());
Factory.addGetterSetter(Ellipse$1, "radiusY", 0, getNumberValidator());
class Image extends Shape {
  constructor(attrs) {
    super(attrs);
    this._loadListener = () => {
      this._requestDraw();
    };
    this.on("imageChange.konva", (props) => {
      this._removeImageLoad(props.oldVal);
      this._setImageLoad();
    });
    this._setImageLoad();
  }
  _setImageLoad() {
    const image = this.image();
    if (image && image.complete) {
      return;
    }
    if (image && image.readyState === 4) {
      return;
    }
    if (image && image["addEventListener"]) {
      image["addEventListener"]("load", this._loadListener);
    }
  }
  _removeImageLoad(image) {
    if (image && image["removeEventListener"]) {
      image["removeEventListener"]("load", this._loadListener);
    }
  }
  destroy() {
    this._removeImageLoad(this.image());
    super.destroy();
    return this;
  }
  _useBufferCanvas() {
    const hasCornerRadius = !!this.cornerRadius();
    const hasShadow = this.hasShadow();
    if (hasCornerRadius && hasShadow) {
      return true;
    }
    return super._useBufferCanvas(true);
  }
  _sceneFunc(context) {
    const width = this.getWidth();
    const height = this.getHeight();
    const cornerRadius = this.cornerRadius();
    const image = this.attrs.image;
    let params;
    if (image) {
      const cropWidth = this.attrs.cropWidth;
      const cropHeight = this.attrs.cropHeight;
      if (cropWidth && cropHeight) {
        params = [
          image,
          this.cropX(),
          this.cropY(),
          cropWidth,
          cropHeight,
          0,
          0,
          width,
          height
        ];
      } else {
        params = [image, 0, 0, width, height];
      }
    }
    if (this.hasFill() || this.hasStroke() || cornerRadius) {
      context.beginPath();
      cornerRadius ? Util.drawRoundedRectPath(context, width, height, cornerRadius) : context.rect(0, 0, width, height);
      context.closePath();
      context.fillStrokeShape(this);
    }
    if (image) {
      if (cornerRadius) {
        context.clip();
      }
      context.drawImage.apply(context, params);
    }
  }
  _hitFunc(context) {
    const width = this.width(), height = this.height(), cornerRadius = this.cornerRadius();
    context.beginPath();
    if (!cornerRadius) {
      context.rect(0, 0, width, height);
    } else {
      Util.drawRoundedRectPath(context, width, height, cornerRadius);
    }
    context.closePath();
    context.fillStrokeShape(this);
  }
  getWidth() {
    var _a, _b, _c;
    return (_c = (_a = this.attrs.width) !== null && _a !== void 0 ? _a : (_b = this.image()) === null || _b === void 0 ? void 0 : _b.width) !== null && _c !== void 0 ? _c : 0;
  }
  getHeight() {
    var _a, _b, _c;
    return (_c = (_a = this.attrs.height) !== null && _a !== void 0 ? _a : (_b = this.image()) === null || _b === void 0 ? void 0 : _b.height) !== null && _c !== void 0 ? _c : 0;
  }
  static fromURL(url, callback, onError = null) {
    const img = Util.createImageElement();
    img.onload = function() {
      const image = new Image({
        image: img
      });
      callback(image);
    };
    img.onerror = onError;
    img.crossOrigin = "Anonymous";
    img.src = url;
  }
}
Image.prototype.className = "Image";
Image.prototype._attrsAffectingSize = ["image"];
_registerNode(Image);
Factory.addGetterSetter(Image, "cornerRadius", 0, getNumberOrArrayOfNumbersValidator(4));
Factory.addGetterSetter(Image, "image");
Factory.addComponentsGetterSetter(Image, "crop", ["x", "y", "width", "height"]);
Factory.addGetterSetter(Image, "cropX", 0, getNumberValidator());
Factory.addGetterSetter(Image, "cropY", 0, getNumberValidator());
Factory.addGetterSetter(Image, "cropWidth", 0, getNumberValidator());
Factory.addGetterSetter(Image, "cropHeight", 0, getNumberValidator());
const ATTR_CHANGE_LIST$2 = [
  "fontFamily",
  "fontSize",
  "fontStyle",
  "padding",
  "lineHeight",
  "text",
  "width",
  "height",
  "pointerDirection",
  "pointerWidth",
  "pointerHeight"
], CHANGE_KONVA$1 = "Change.konva", NONE$1 = "none", UP = "up", RIGHT$1 = "right", DOWN = "down", LEFT$1 = "left", attrChangeListLen$1 = ATTR_CHANGE_LIST$2.length;
class Label extends Group$1 {
  constructor(config) {
    super(config);
    this.on("add.konva", function(evt) {
      this._addListeners(evt.child);
      this._sync();
    });
  }
  getText() {
    return this.find("Text")[0];
  }
  getTag() {
    return this.find("Tag")[0];
  }
  _addListeners(text) {
    let that = this, n;
    const func = function() {
      that._sync();
    };
    for (n = 0; n < attrChangeListLen$1; n++) {
      text.on(ATTR_CHANGE_LIST$2[n] + CHANGE_KONVA$1, func);
    }
  }
  getWidth() {
    return this.getText().width();
  }
  getHeight() {
    return this.getText().height();
  }
  _sync() {
    let text = this.getText(), tag = this.getTag(), width, height, pointerDirection, pointerWidth, x2, y, pointerHeight;
    if (text && tag) {
      width = text.width();
      height = text.height();
      pointerDirection = tag.pointerDirection();
      pointerWidth = tag.pointerWidth();
      pointerHeight = tag.pointerHeight();
      x2 = 0;
      y = 0;
      switch (pointerDirection) {
        case UP:
          x2 = width / 2;
          y = -1 * pointerHeight;
          break;
        case RIGHT$1:
          x2 = width + pointerWidth;
          y = height / 2;
          break;
        case DOWN:
          x2 = width / 2;
          y = height + pointerHeight;
          break;
        case LEFT$1:
          x2 = -1 * pointerWidth;
          y = height / 2;
          break;
      }
      tag.setAttrs({
        x: -1 * x2,
        y: -1 * y,
        width,
        height
      });
      text.setAttrs({
        x: -1 * x2,
        y: -1 * y
      });
    }
  }
}
Label.prototype.className = "Label";
_registerNode(Label);
class Tag extends Shape {
  _sceneFunc(context) {
    const width = this.width(), height = this.height(), pointerDirection = this.pointerDirection(), pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), cornerRadius = this.cornerRadius();
    let topLeft = 0;
    let topRight = 0;
    let bottomLeft = 0;
    let bottomRight = 0;
    if (typeof cornerRadius === "number") {
      topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
    } else {
      topLeft = Math.min(cornerRadius[0] || 0, width / 2, height / 2);
      topRight = Math.min(cornerRadius[1] || 0, width / 2, height / 2);
      bottomRight = Math.min(cornerRadius[2] || 0, width / 2, height / 2);
      bottomLeft = Math.min(cornerRadius[3] || 0, width / 2, height / 2);
    }
    context.beginPath();
    context.moveTo(topLeft, 0);
    if (pointerDirection === UP) {
      context.lineTo((width - pointerWidth) / 2, 0);
      context.lineTo(width / 2, -1 * pointerHeight);
      context.lineTo((width + pointerWidth) / 2, 0);
    }
    context.lineTo(width - topRight, 0);
    context.arc(width - topRight, topRight, topRight, Math.PI * 3 / 2, 0, false);
    if (pointerDirection === RIGHT$1) {
      context.lineTo(width, (height - pointerHeight) / 2);
      context.lineTo(width + pointerWidth, height / 2);
      context.lineTo(width, (height + pointerHeight) / 2);
    }
    context.lineTo(width, height - bottomRight);
    context.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2, false);
    if (pointerDirection === DOWN) {
      context.lineTo((width + pointerWidth) / 2, height);
      context.lineTo(width / 2, height + pointerHeight);
      context.lineTo((width - pointerWidth) / 2, height);
    }
    context.lineTo(bottomLeft, height);
    context.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
    if (pointerDirection === LEFT$1) {
      context.lineTo(0, (height + pointerHeight) / 2);
      context.lineTo(-1 * pointerWidth, height / 2);
      context.lineTo(0, (height - pointerHeight) / 2);
    }
    context.lineTo(0, topLeft);
    context.arc(topLeft, topLeft, topLeft, Math.PI, Math.PI * 3 / 2, false);
    context.closePath();
    context.fillStrokeShape(this);
  }
  getSelfRect() {
    let x2 = 0, y = 0, pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), direction = this.pointerDirection(), width = this.width(), height = this.height();
    if (direction === UP) {
      y -= pointerHeight;
      height += pointerHeight;
    } else if (direction === DOWN) {
      height += pointerHeight;
    } else if (direction === LEFT$1) {
      x2 -= pointerWidth * 1.5;
      width += pointerWidth;
    } else if (direction === RIGHT$1) {
      width += pointerWidth * 1.5;
    }
    return {
      x: x2,
      y,
      width,
      height
    };
  }
}
Tag.prototype.className = "Tag";
_registerNode(Tag);
Factory.addGetterSetter(Tag, "pointerDirection", NONE$1);
Factory.addGetterSetter(Tag, "pointerWidth", 0, getNumberValidator());
Factory.addGetterSetter(Tag, "pointerHeight", 0, getNumberValidator());
Factory.addGetterSetter(Tag, "cornerRadius", 0, getNumberOrArrayOfNumbersValidator(4));
let Rect$1 = class Rect extends Shape {
  _sceneFunc(context) {
    const cornerRadius = this.cornerRadius(), width = this.width(), height = this.height();
    context.beginPath();
    if (!cornerRadius) {
      context.rect(0, 0, width, height);
    } else {
      Util.drawRoundedRectPath(context, width, height, cornerRadius);
    }
    context.closePath();
    context.fillStrokeShape(this);
  }
};
Rect$1.prototype.className = "Rect";
_registerNode(Rect$1);
Factory.addGetterSetter(Rect$1, "cornerRadius", 0, getNumberOrArrayOfNumbersValidator(4));
class RegularPolygon extends Shape {
  _sceneFunc(context) {
    const points = this._getPoints(), radius = this.radius(), sides = this.sides(), cornerRadius = this.cornerRadius();
    context.beginPath();
    if (!cornerRadius) {
      context.moveTo(points[0].x, points[0].y);
      for (let n = 1; n < points.length; n++) {
        context.lineTo(points[n].x, points[n].y);
      }
    } else {
      Util.drawRoundedPolygonPath(context, points, sides, radius, cornerRadius);
    }
    context.closePath();
    context.fillStrokeShape(this);
  }
  _getPoints() {
    const sides = this.attrs.sides;
    const radius = this.attrs.radius || 0;
    const points = [];
    for (let n = 0; n < sides; n++) {
      points.push({
        x: radius * Math.sin(n * 2 * Math.PI / sides),
        y: -1 * radius * Math.cos(n * 2 * Math.PI / sides)
      });
    }
    return points;
  }
  getSelfRect() {
    const points = this._getPoints();
    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;
    points.forEach((point) => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  getWidth() {
    return this.radius() * 2;
  }
  getHeight() {
    return this.radius() * 2;
  }
  setWidth(width) {
    this.radius(width / 2);
  }
  setHeight(height) {
    this.radius(height / 2);
  }
}
RegularPolygon.prototype.className = "RegularPolygon";
RegularPolygon.prototype._centroid = true;
RegularPolygon.prototype._attrsAffectingSize = ["radius"];
_registerNode(RegularPolygon);
Factory.addGetterSetter(RegularPolygon, "radius", 0, getNumberValidator());
Factory.addGetterSetter(RegularPolygon, "sides", 0, getNumberValidator());
Factory.addGetterSetter(RegularPolygon, "cornerRadius", 0, getNumberOrArrayOfNumbersValidator(4));
const PIx2 = Math.PI * 2;
class Ring extends Shape {
  _sceneFunc(context) {
    context.beginPath();
    context.arc(0, 0, this.innerRadius(), 0, PIx2, false);
    context.moveTo(this.outerRadius(), 0);
    context.arc(0, 0, this.outerRadius(), PIx2, 0, true);
    context.closePath();
    context.fillStrokeShape(this);
  }
  getWidth() {
    return this.outerRadius() * 2;
  }
  getHeight() {
    return this.outerRadius() * 2;
  }
  setWidth(width) {
    this.outerRadius(width / 2);
  }
  setHeight(height) {
    this.outerRadius(height / 2);
  }
}
Ring.prototype.className = "Ring";
Ring.prototype._centroid = true;
Ring.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
_registerNode(Ring);
Factory.addGetterSetter(Ring, "innerRadius", 0, getNumberValidator());
Factory.addGetterSetter(Ring, "outerRadius", 0, getNumberValidator());
class Sprite extends Shape {
  constructor(config) {
    super(config);
    this._updated = true;
    this.anim = new Animation(() => {
      const updated = this._updated;
      this._updated = false;
      return updated;
    });
    this.on("animationChange.konva", function() {
      this.frameIndex(0);
    });
    this.on("frameIndexChange.konva", function() {
      this._updated = true;
    });
    this.on("frameRateChange.konva", function() {
      if (!this.anim.isRunning()) {
        return;
      }
      clearInterval(this.interval);
      this._setInterval();
    });
  }
  _sceneFunc(context) {
    const anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), x2 = set[ix4 + 0], y = set[ix4 + 1], width = set[ix4 + 2], height = set[ix4 + 3], image = this.image();
    if (this.hasFill() || this.hasStroke()) {
      context.beginPath();
      context.rect(0, 0, width, height);
      context.closePath();
      context.fillStrokeShape(this);
    }
    if (image) {
      if (offsets) {
        const offset = offsets[anim], ix2 = index * 2;
        context.drawImage(image, x2, y, width, height, offset[ix2 + 0], offset[ix2 + 1], width, height);
      } else {
        context.drawImage(image, x2, y, width, height, 0, 0, width, height);
      }
    }
  }
  _hitFunc(context) {
    const anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), width = set[ix4 + 2], height = set[ix4 + 3];
    context.beginPath();
    if (offsets) {
      const offset = offsets[anim];
      const ix2 = index * 2;
      context.rect(offset[ix2 + 0], offset[ix2 + 1], width, height);
    } else {
      context.rect(0, 0, width, height);
    }
    context.closePath();
    context.fillShape(this);
  }
  _useBufferCanvas() {
    return super._useBufferCanvas(true);
  }
  _setInterval() {
    const that = this;
    this.interval = setInterval(function() {
      that._updateIndex();
    }, 1e3 / this.frameRate());
  }
  start() {
    if (this.isRunning()) {
      return;
    }
    const layer = this.getLayer();
    this.anim.setLayers(layer);
    this._setInterval();
    this.anim.start();
  }
  stop() {
    this.anim.stop();
    clearInterval(this.interval);
  }
  isRunning() {
    return this.anim.isRunning();
  }
  _updateIndex() {
    const index = this.frameIndex(), animation = this.animation(), animations = this.animations(), anim = animations[animation], len = anim.length / 4;
    if (index < len - 1) {
      this.frameIndex(index + 1);
    } else {
      this.frameIndex(0);
    }
  }
}
Sprite.prototype.className = "Sprite";
_registerNode(Sprite);
Factory.addGetterSetter(Sprite, "animation");
Factory.addGetterSetter(Sprite, "animations");
Factory.addGetterSetter(Sprite, "frameOffsets");
Factory.addGetterSetter(Sprite, "image");
Factory.addGetterSetter(Sprite, "frameIndex", 0, getNumberValidator());
Factory.addGetterSetter(Sprite, "frameRate", 17, getNumberValidator());
Factory.backCompat(Sprite, {
  index: "frameIndex",
  getIndex: "getFrameIndex",
  setIndex: "setFrameIndex"
});
class Star extends Shape {
  _sceneFunc(context) {
    const innerRadius = this.innerRadius(), outerRadius = this.outerRadius(), numPoints = this.numPoints();
    context.beginPath();
    context.moveTo(0, 0 - outerRadius);
    for (let n = 1; n < numPoints * 2; n++) {
      const radius = n % 2 === 0 ? outerRadius : innerRadius;
      const x2 = radius * Math.sin(n * Math.PI / numPoints);
      const y = -1 * radius * Math.cos(n * Math.PI / numPoints);
      context.lineTo(x2, y);
    }
    context.closePath();
    context.fillStrokeShape(this);
  }
  getWidth() {
    return this.outerRadius() * 2;
  }
  getHeight() {
    return this.outerRadius() * 2;
  }
  setWidth(width) {
    this.outerRadius(width / 2);
  }
  setHeight(height) {
    this.outerRadius(height / 2);
  }
}
Star.prototype.className = "Star";
Star.prototype._centroid = true;
Star.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"];
_registerNode(Star);
Factory.addGetterSetter(Star, "numPoints", 5, getNumberValidator());
Factory.addGetterSetter(Star, "innerRadius", 0, getNumberValidator());
Factory.addGetterSetter(Star, "outerRadius", 0, getNumberValidator());
function stringToArray(string) {
  return [...string].reduce((acc, char, index, array) => {
    if (new RegExp("\\p{Emoji}", "u").test(char)) {
      const nextChar = array[index + 1];
      if (nextChar && new RegExp("\\p{Emoji_Modifier}|\\u200D", "u").test(nextChar)) {
        acc.push(char + nextChar);
        array[index + 1] = "";
      } else {
        acc.push(char);
      }
    } else if (new RegExp("\\p{Regional_Indicator}{2}", "u").test(char + (array[index + 1] || ""))) {
      acc.push(char + array[index + 1]);
    } else if (index > 0 && new RegExp("\\p{Mn}|\\p{Me}|\\p{Mc}", "u").test(char)) {
      acc[acc.length - 1] += char;
    } else if (char) {
      acc.push(char);
    }
    return acc;
  }, []);
}
const AUTO = "auto", CENTER = "center", INHERIT = "inherit", JUSTIFY = "justify", CHANGE_KONVA = "Change.konva", CONTEXT_2D = "2d", DASH = "-", LEFT = "left", TEXT = "text", TEXT_UPPER = "Text", TOP = "top", BOTTOM = "bottom", MIDDLE = "middle", NORMAL$1 = "normal", PX_SPACE = "px ", SPACE = " ", RIGHT = "right", RTL = "rtl", WORD = "word", CHAR = "char", NONE = "none", ELLIPSIS = "…", ATTR_CHANGE_LIST$1 = [
  "direction",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "padding",
  "align",
  "verticalAlign",
  "lineHeight",
  "text",
  "width",
  "height",
  "wrap",
  "ellipsis",
  "letterSpacing"
], attrChangeListLen = ATTR_CHANGE_LIST$1.length;
function normalizeFontFamily(fontFamily) {
  return fontFamily.split(",").map((family) => {
    family = family.trim();
    const hasSpace = family.indexOf(" ") >= 0;
    const hasQuotes = family.indexOf('"') >= 0 || family.indexOf("'") >= 0;
    if (hasSpace && !hasQuotes) {
      family = `"${family}"`;
    }
    return family;
  }).join(", ");
}
let dummyContext;
function getDummyContext() {
  if (dummyContext) {
    return dummyContext;
  }
  dummyContext = Util.createCanvasElement().getContext(CONTEXT_2D);
  return dummyContext;
}
function _fillFunc$1(context) {
  context.fillText(this._partialText, this._partialTextX, this._partialTextY);
}
function _strokeFunc$1(context) {
  context.setAttr("miterLimit", 2);
  context.strokeText(this._partialText, this._partialTextX, this._partialTextY);
}
function checkDefaultFill(config) {
  config = config || {};
  if (!config.fillLinearGradientColorStops && !config.fillRadialGradientColorStops && !config.fillPatternImage) {
    config.fill = config.fill || "black";
  }
  return config;
}
let Text$1 = class Text extends Shape {
  constructor(config) {
    super(checkDefaultFill(config));
    this._partialTextX = 0;
    this._partialTextY = 0;
    for (let n = 0; n < attrChangeListLen; n++) {
      this.on(ATTR_CHANGE_LIST$1[n] + CHANGE_KONVA, this._setTextData);
    }
    this._setTextData();
  }
  _sceneFunc(context) {
    var _a, _b;
    const textArr = this.textArr, textArrLen = textArr.length;
    if (!this.text()) {
      return;
    }
    let padding = this.padding(), fontSize = this.fontSize(), lineHeightPx = this.lineHeight() * fontSize, verticalAlign = this.verticalAlign(), direction = this.direction(), alignY = 0, align = this.align(), totalWidth = this.getWidth(), letterSpacing = this.letterSpacing(), charRenderFunc = this.charRenderFunc(), fill = this.fill(), textDecoration = this.textDecoration(), underlineOffset = this.underlineOffset(), shouldUnderline = textDecoration.indexOf("underline") !== -1, shouldLineThrough = textDecoration.indexOf("line-through") !== -1, n;
    direction = direction === INHERIT ? context.direction : direction;
    let translateY = lineHeightPx / 2;
    let baseline = MIDDLE;
    if (!Konva$1.legacyTextRendering) {
      const metrics = this.measureSize("M");
      baseline = "alphabetic";
      const ascent = (_a = metrics.fontBoundingBoxAscent) !== null && _a !== void 0 ? _a : metrics.actualBoundingBoxAscent;
      const descent = (_b = metrics.fontBoundingBoxDescent) !== null && _b !== void 0 ? _b : metrics.actualBoundingBoxDescent;
      translateY = (ascent - descent) / 2 + lineHeightPx / 2;
    }
    if (direction === RTL) {
      context.setAttr("direction", direction);
    }
    context.setAttr("font", this._getContextFont());
    context.setAttr("textBaseline", baseline);
    context.setAttr("textAlign", LEFT);
    if (verticalAlign === MIDDLE) {
      alignY = (this.getHeight() - textArrLen * lineHeightPx - padding * 2) / 2;
    } else if (verticalAlign === BOTTOM) {
      alignY = this.getHeight() - textArrLen * lineHeightPx - padding * 2;
    }
    context.translate(padding, alignY + padding);
    for (n = 0; n < textArrLen; n++) {
      let lineTranslateX = 0;
      let lineTranslateY = 0;
      const obj = textArr[n], text = obj.text, width = obj.width, lastLine = obj.lastInParagraph;
      context.save();
      if (align === RIGHT) {
        lineTranslateX += totalWidth - width - padding * 2;
      } else if (align === CENTER) {
        lineTranslateX += (totalWidth - width - padding * 2) / 2;
      }
      if (shouldUnderline) {
        context.save();
        context.beginPath();
        const yOffset = underlineOffset !== null && underlineOffset !== void 0 ? underlineOffset : !Konva$1.legacyTextRendering ? Math.round(fontSize / 4) : Math.round(fontSize / 2);
        const x2 = lineTranslateX;
        const y = translateY + lineTranslateY + yOffset;
        context.moveTo(x2, y);
        const lineWidth = align === JUSTIFY && !lastLine ? totalWidth - padding * 2 : width;
        context.lineTo(x2 + Math.round(lineWidth), y);
        context.lineWidth = fontSize / 15;
        const gradient = this._getLinearGradient();
        context.strokeStyle = gradient || fill;
        context.stroke();
        context.restore();
      }
      const lineThroughStartX = lineTranslateX;
      if (direction !== RTL && (letterSpacing !== 0 || align === JUSTIFY || charRenderFunc)) {
        const spacesNumber = text.split(" ").length - 1;
        const array = stringToArray(text);
        for (let li = 0; li < array.length; li++) {
          const letter = array[li];
          if (letter === " " && !lastLine && align === JUSTIFY) {
            lineTranslateX += (totalWidth - padding * 2 - width) / spacesNumber;
          }
          this._partialTextX = lineTranslateX;
          this._partialTextY = translateY + lineTranslateY;
          this._partialText = letter;
          if (charRenderFunc) {
            context.save();
            const previousLines = textArr.slice(0, n);
            const previousGraphemes = previousLines.reduce((acc, line) => acc + stringToArray(line.text).length, 0);
            const charIndex = li + previousGraphemes;
            charRenderFunc({
              char: letter,
              index: charIndex,
              x: lineTranslateX,
              y: translateY + lineTranslateY,
              lineIndex: n,
              column: li,
              isLastInLine: lastLine,
              width: this.measureSize(letter).width,
              context
            });
          }
          context.fillStrokeShape(this);
          if (charRenderFunc) {
            context.restore();
          }
          lineTranslateX += this.measureSize(letter).width + letterSpacing;
        }
      } else {
        if (letterSpacing !== 0) {
          context.setAttr("letterSpacing", `${letterSpacing}px`);
        }
        this._partialTextX = lineTranslateX;
        this._partialTextY = translateY + lineTranslateY;
        this._partialText = text;
        context.fillStrokeShape(this);
      }
      if (shouldLineThrough) {
        context.save();
        context.beginPath();
        const yOffset = !Konva$1.legacyTextRendering ? -Math.round(fontSize / 4) : 0;
        const x2 = lineThroughStartX;
        context.moveTo(x2, translateY + lineTranslateY + yOffset);
        const lineWidth = align === JUSTIFY && !lastLine ? totalWidth - padding * 2 : width;
        context.lineTo(x2 + Math.round(lineWidth), translateY + lineTranslateY + yOffset);
        context.lineWidth = fontSize / 15;
        const gradient = this._getLinearGradient();
        context.strokeStyle = gradient || fill;
        context.stroke();
        context.restore();
      }
      context.restore();
      if (textArrLen > 1) {
        translateY += lineHeightPx;
      }
    }
  }
  _hitFunc(context) {
    const width = this.getWidth(), height = this.getHeight();
    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
  }
  setText(text) {
    const str = Util._isString(text) ? text : text === null || text === void 0 ? "" : text + "";
    this._setAttr(TEXT, str);
    return this;
  }
  getWidth() {
    const isAuto = this.attrs.width === AUTO || this.attrs.width === void 0;
    return isAuto ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
  }
  getHeight() {
    const isAuto = this.attrs.height === AUTO || this.attrs.height === void 0;
    return isAuto ? this.fontSize() * this.textArr.length * this.lineHeight() + this.padding() * 2 : this.attrs.height;
  }
  getTextWidth() {
    return this.textWidth;
  }
  getTextHeight() {
    Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.");
    return this.textHeight;
  }
  measureSize(text) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    let _context = getDummyContext(), fontSize = this.fontSize(), metrics;
    _context.save();
    _context.font = this._getContextFont();
    metrics = _context.measureText(text);
    _context.restore();
    const scaleFactor = fontSize / 100;
    return {
      actualBoundingBoxAscent: (_a = metrics.actualBoundingBoxAscent) !== null && _a !== void 0 ? _a : 71.58203125 * scaleFactor,
      actualBoundingBoxDescent: (_b = metrics.actualBoundingBoxDescent) !== null && _b !== void 0 ? _b : 0,
      actualBoundingBoxLeft: (_c = metrics.actualBoundingBoxLeft) !== null && _c !== void 0 ? _c : -7.421875 * scaleFactor,
      actualBoundingBoxRight: (_d = metrics.actualBoundingBoxRight) !== null && _d !== void 0 ? _d : 75.732421875 * scaleFactor,
      alphabeticBaseline: (_e = metrics.alphabeticBaseline) !== null && _e !== void 0 ? _e : 0,
      emHeightAscent: (_f = metrics.emHeightAscent) !== null && _f !== void 0 ? _f : 100 * scaleFactor,
      emHeightDescent: (_g = metrics.emHeightDescent) !== null && _g !== void 0 ? _g : -20 * scaleFactor,
      fontBoundingBoxAscent: (_h = metrics.fontBoundingBoxAscent) !== null && _h !== void 0 ? _h : 91 * scaleFactor,
      fontBoundingBoxDescent: (_j = metrics.fontBoundingBoxDescent) !== null && _j !== void 0 ? _j : 21 * scaleFactor,
      hangingBaseline: (_k = metrics.hangingBaseline) !== null && _k !== void 0 ? _k : 72.80000305175781 * scaleFactor,
      ideographicBaseline: (_l = metrics.ideographicBaseline) !== null && _l !== void 0 ? _l : -21 * scaleFactor,
      width: metrics.width,
      height: fontSize
    };
  }
  _getContextFont() {
    return this.fontStyle() + SPACE + this.fontVariant() + SPACE + (this.fontSize() + PX_SPACE) + normalizeFontFamily(this.fontFamily());
  }
  _addTextLine(line) {
    const align = this.align();
    if (align === JUSTIFY) {
      line = line.trim();
    }
    const width = this._getTextWidth(line);
    return this.textArr.push({
      text: line,
      width,
      lastInParagraph: false
    });
  }
  _getTextWidth(text) {
    const letterSpacing = this.letterSpacing();
    const length = text.length;
    return getDummyContext().measureText(text).width + letterSpacing * length;
  }
  _setTextData() {
    let lines = this.text().split("\n"), fontSize = +this.fontSize(), textWidth = 0, lineHeightPx = this.lineHeight() * fontSize, width = this.attrs.width, height = this.attrs.height, fixedWidth = width !== AUTO && width !== void 0, fixedHeight = height !== AUTO && height !== void 0, padding = this.padding(), maxWidth = width - padding * 2, maxHeightPx = height - padding * 2, currentHeightPx = 0, wrap = this.wrap(), shouldWrap = wrap !== NONE, wrapAtWord = wrap !== CHAR && shouldWrap, shouldAddEllipsis = this.ellipsis();
    this.textArr = [];
    getDummyContext().font = this._getContextFont();
    const additionalWidth = shouldAddEllipsis ? this._getTextWidth(ELLIPSIS) : 0;
    for (let i = 0, max = lines.length; i < max; ++i) {
      let line = lines[i];
      let lineWidth = this._getTextWidth(line);
      if (fixedWidth && lineWidth > maxWidth) {
        while (line.length > 0) {
          let low = 0, high = stringToArray(line).length, match = "", matchWidth = 0;
          while (low < high) {
            const mid = low + high >>> 1, lineArray = stringToArray(line), substr = lineArray.slice(0, mid + 1).join(""), substrWidth = this._getTextWidth(substr);
            const shouldConsiderEllipsis = shouldAddEllipsis && fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx;
            const effectiveWidth = shouldConsiderEllipsis ? substrWidth + additionalWidth : substrWidth;
            if (effectiveWidth <= maxWidth) {
              low = mid + 1;
              match = substr;
              matchWidth = substrWidth;
            } else {
              high = mid;
            }
          }
          if (match) {
            if (wrapAtWord) {
              const lineArray2 = stringToArray(line);
              const matchArray = stringToArray(match);
              const nextChar = lineArray2[matchArray.length];
              const nextIsSpaceOrDash = nextChar === SPACE || nextChar === DASH;
              let wrapIndex;
              if (nextIsSpaceOrDash && matchWidth <= maxWidth) {
                wrapIndex = matchArray.length;
              } else {
                const lastSpaceIndex = matchArray.lastIndexOf(SPACE);
                const lastDashIndex = matchArray.lastIndexOf(DASH);
                wrapIndex = Math.max(lastSpaceIndex, lastDashIndex) + 1;
              }
              if (wrapIndex > 0) {
                low = wrapIndex;
                match = lineArray2.slice(0, low).join("");
                matchWidth = this._getTextWidth(match);
              }
            }
            match = match.trimRight();
            this._addTextLine(match);
            textWidth = Math.max(textWidth, matchWidth);
            currentHeightPx += lineHeightPx;
            const shouldHandleEllipsis = this._shouldHandleEllipsis(currentHeightPx);
            if (shouldHandleEllipsis) {
              this._tryToAddEllipsisToLastLine();
              break;
            }
            const lineArray = stringToArray(line);
            line = lineArray.slice(low).join("").trimLeft();
            if (line.length > 0) {
              lineWidth = this._getTextWidth(line);
              if (lineWidth <= maxWidth) {
                this._addTextLine(line);
                currentHeightPx += lineHeightPx;
                textWidth = Math.max(textWidth, lineWidth);
                break;
              }
            }
          } else {
            break;
          }
        }
      } else {
        this._addTextLine(line);
        currentHeightPx += lineHeightPx;
        textWidth = Math.max(textWidth, lineWidth);
        if (this._shouldHandleEllipsis(currentHeightPx) && i < max - 1) {
          this._tryToAddEllipsisToLastLine();
        }
      }
      if (this.textArr[this.textArr.length - 1]) {
        this.textArr[this.textArr.length - 1].lastInParagraph = true;
      }
      if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
        break;
      }
    }
    this.textHeight = fontSize;
    this.textWidth = textWidth;
  }
  _shouldHandleEllipsis(currentHeightPx) {
    const fontSize = +this.fontSize(), lineHeightPx = this.lineHeight() * fontSize, height = this.attrs.height, fixedHeight = height !== AUTO && height !== void 0, padding = this.padding(), maxHeightPx = height - padding * 2, wrap = this.wrap(), shouldWrap = wrap !== NONE;
    return !shouldWrap || fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx;
  }
  _tryToAddEllipsisToLastLine() {
    const width = this.attrs.width, fixedWidth = width !== AUTO && width !== void 0, padding = this.padding(), maxWidth = width - padding * 2, shouldAddEllipsis = this.ellipsis();
    const lastLine = this.textArr[this.textArr.length - 1];
    if (!lastLine || !shouldAddEllipsis) {
      return;
    }
    if (fixedWidth) {
      const haveSpace = this._getTextWidth(lastLine.text + ELLIPSIS) < maxWidth;
      if (!haveSpace) {
        lastLine.text = lastLine.text.slice(0, lastLine.text.length - 3);
      }
    }
    this.textArr.splice(this.textArr.length - 1, 1);
    this._addTextLine(lastLine.text + ELLIPSIS);
  }
  getStrokeScaleEnabled() {
    return true;
  }
  _useBufferCanvas() {
    const hasLine = this.textDecoration().indexOf("underline") !== -1 || this.textDecoration().indexOf("line-through") !== -1;
    const hasShadow = this.hasShadow();
    if (hasLine && hasShadow) {
      return true;
    }
    return super._useBufferCanvas();
  }
};
Text$1.prototype._fillFunc = _fillFunc$1;
Text$1.prototype._strokeFunc = _strokeFunc$1;
Text$1.prototype.className = TEXT_UPPER;
Text$1.prototype._attrsAffectingSize = [
  "text",
  "fontSize",
  "padding",
  "wrap",
  "lineHeight",
  "letterSpacing"
];
_registerNode(Text$1);
Factory.overWriteSetter(Text$1, "width", getNumberOrAutoValidator());
Factory.overWriteSetter(Text$1, "height", getNumberOrAutoValidator());
Factory.addGetterSetter(Text$1, "direction", INHERIT);
Factory.addGetterSetter(Text$1, "fontFamily", "Arial");
Factory.addGetterSetter(Text$1, "fontSize", 12, getNumberValidator());
Factory.addGetterSetter(Text$1, "fontStyle", NORMAL$1);
Factory.addGetterSetter(Text$1, "fontVariant", NORMAL$1);
Factory.addGetterSetter(Text$1, "padding", 0, getNumberValidator());
Factory.addGetterSetter(Text$1, "align", LEFT);
Factory.addGetterSetter(Text$1, "verticalAlign", TOP);
Factory.addGetterSetter(Text$1, "lineHeight", 1, getNumberValidator());
Factory.addGetterSetter(Text$1, "wrap", WORD);
Factory.addGetterSetter(Text$1, "ellipsis", false, getBooleanValidator());
Factory.addGetterSetter(Text$1, "letterSpacing", 0, getNumberValidator());
Factory.addGetterSetter(Text$1, "text", "", getStringValidator());
Factory.addGetterSetter(Text$1, "textDecoration", "");
Factory.addGetterSetter(Text$1, "underlineOffset", void 0, getNumberValidator());
Factory.addGetterSetter(Text$1, "charRenderFunc", void 0);
const EMPTY_STRING = "", NORMAL = "normal";
function _fillFunc(context) {
  context.fillText(this.partialText, 0, 0);
}
function _strokeFunc(context) {
  context.strokeText(this.partialText, 0, 0);
}
class TextPath extends Shape {
  constructor(config) {
    super(config);
    this.dummyCanvas = Util.createCanvasElement();
    this.dataArray = [];
    this._readDataAttribute();
    this.on("dataChange.konva", function() {
      this._readDataAttribute();
      this._setTextData();
    });
    this.on("textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva fontSizeChange.konva fontFamilyChange.konva", this._setTextData);
    this._setTextData();
  }
  _getTextPathLength() {
    return Path.getPathLength(this.dataArray);
  }
  _getPointAtLength(length) {
    if (!this.attrs.data) {
      return null;
    }
    const totalLength = this.pathLength;
    if (length > totalLength) {
      return null;
    }
    return Path.getPointAtLengthOfDataArray(length, this.dataArray);
  }
  _readDataAttribute() {
    this.dataArray = Path.parsePathData(this.attrs.data);
    this.pathLength = this._getTextPathLength();
  }
  _sceneFunc(context) {
    context.setAttr("font", this._getContextFont());
    context.setAttr("textBaseline", this.textBaseline());
    context.setAttr("textAlign", "left");
    context.save();
    const textDecoration = this.textDecoration();
    const fill = this.fill();
    const fontSize = this.fontSize();
    const glyphInfo = this.glyphInfo;
    const hasUnderline = textDecoration.indexOf("underline") !== -1;
    const hasLineThrough = textDecoration.indexOf("line-through") !== -1;
    if (hasUnderline) {
      context.beginPath();
    }
    for (let i = 0; i < glyphInfo.length; i++) {
      context.save();
      const p0 = glyphInfo[i].p0;
      context.translate(p0.x, p0.y);
      context.rotate(glyphInfo[i].rotation);
      this.partialText = glyphInfo[i].text;
      context.fillStrokeShape(this);
      if (hasUnderline) {
        if (i === 0) {
          context.moveTo(0, fontSize / 2 + 1);
        }
        context.lineTo(glyphInfo[i].width, fontSize / 2 + 1);
      }
      context.restore();
    }
    if (hasUnderline) {
      context.strokeStyle = fill;
      context.lineWidth = fontSize / 20;
      context.stroke();
    }
    if (hasLineThrough) {
      context.beginPath();
      for (let i = 0; i < glyphInfo.length; i++) {
        context.save();
        const p0 = glyphInfo[i].p0;
        context.translate(p0.x, p0.y);
        context.rotate(glyphInfo[i].rotation);
        if (i === 0) {
          context.moveTo(0, 0);
        }
        context.lineTo(glyphInfo[i].width, 0);
        context.restore();
      }
      context.strokeStyle = fill;
      context.lineWidth = fontSize / 20;
      context.stroke();
    }
    context.restore();
  }
  _hitFunc(context) {
    context.beginPath();
    const glyphInfo = this.glyphInfo;
    if (glyphInfo.length >= 1) {
      const p0 = glyphInfo[0].p0;
      context.moveTo(p0.x, p0.y);
    }
    for (let i = 0; i < glyphInfo.length; i++) {
      const p1 = glyphInfo[i].p1;
      context.lineTo(p1.x, p1.y);
    }
    context.setAttr("lineWidth", this.fontSize());
    context.setAttr("strokeStyle", this.colorKey);
    context.stroke();
  }
  getTextWidth() {
    return this.textWidth;
  }
  getTextHeight() {
    Util.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.");
    return this.textHeight;
  }
  setText(text) {
    return Text$1.prototype.setText.call(this, text);
  }
  _getContextFont() {
    return Text$1.prototype._getContextFont.call(this);
  }
  _getTextSize(text) {
    const dummyCanvas = this.dummyCanvas;
    const _context = dummyCanvas.getContext("2d");
    _context.save();
    _context.font = this._getContextFont();
    const metrics = _context.measureText(text);
    _context.restore();
    return {
      width: metrics.width,
      height: parseInt(`${this.fontSize()}`, 10)
    };
  }
  _setTextData() {
    const charArr = stringToArray(this.text());
    const chars = [];
    let width = 0;
    for (let i = 0; i < charArr.length; i++) {
      chars.push({
        char: charArr[i],
        width: this._getTextSize(charArr[i]).width
      });
      width += chars[i].width;
    }
    const { width: fullTextWidth, height } = this._getTextSize(this.attrs.text);
    this.textWidth = width;
    this.textHeight = height;
    this.glyphInfo = [];
    if (!this.attrs.data) {
      return null;
    }
    const letterSpacing = this.letterSpacing();
    const align = this.align();
    const kerningFunc = this.kerningFunc();
    const kerningAdjustment = Math.max(0, width - fullTextWidth);
    const textWidth = Math.max(this.textWidth + ((this.attrs.text || "").length - 1) * letterSpacing, 0);
    let offset = 0;
    if (align === "center") {
      offset = Math.max(0, this.pathLength / 2 - textWidth / 2);
    }
    if (align === "right") {
      offset = Math.max(0, this.pathLength - textWidth);
    }
    let offsetToGlyph = offset;
    for (let i = 0; i < chars.length; i++) {
      const charStartPoint = this._getPointAtLength(offsetToGlyph);
      if (!charStartPoint)
        return;
      const char = chars[i].char;
      let glyphWidth = chars[i].width + letterSpacing;
      if (char === " " && align === "justify") {
        const numberOfSpaces = this.text().split(" ").length - 1;
        glyphWidth += (this.pathLength - textWidth) / numberOfSpaces;
      }
      const charEndLength = offsetToGlyph + glyphWidth;
      const charEndPoint = this._getPointAtLength(charEndLength > this.pathLength && charEndLength - this.pathLength <= kerningAdjustment ? this.pathLength : charEndLength);
      if (!charEndPoint) {
        return;
      }
      const width2 = Path.getLineLength(charStartPoint.x, charStartPoint.y, charEndPoint.x, charEndPoint.y);
      let kern = 0;
      if (kerningFunc) {
        try {
          kern = kerningFunc(chars[i - 1].char, char) * this.fontSize();
        } catch (e) {
          kern = 0;
        }
      }
      charStartPoint.x += kern;
      charEndPoint.x += kern;
      this.textWidth += kern;
      const midpoint = Path.getPointOnLine(kern + width2 / 2, charStartPoint.x, charStartPoint.y, charEndPoint.x, charEndPoint.y);
      const rotation = Math.atan2(charEndPoint.y - charStartPoint.y, charEndPoint.x - charStartPoint.x);
      this.glyphInfo.push({
        transposeX: midpoint.x,
        transposeY: midpoint.y,
        text: charArr[i],
        rotation,
        p0: charStartPoint,
        p1: charEndPoint,
        width: width2
      });
      offsetToGlyph += glyphWidth;
    }
  }
  getSelfRect() {
    if (!this.glyphInfo.length) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }
    const points = [];
    this.glyphInfo.forEach(function(info) {
      points.push(info.p0.x);
      points.push(info.p0.y);
      points.push(info.p1.x);
      points.push(info.p1.y);
    });
    let minX = points[0] || 0;
    let maxX = points[0] || 0;
    let minY = points[1] || 0;
    let maxY = points[1] || 0;
    let x2, y;
    for (let i = 0; i < points.length / 2; i++) {
      x2 = points[i * 2];
      y = points[i * 2 + 1];
      minX = Math.min(minX, x2);
      maxX = Math.max(maxX, x2);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    const fontSize = this.fontSize();
    return {
      x: minX - fontSize / 2,
      y: minY - fontSize / 2,
      width: maxX - minX + fontSize,
      height: maxY - minY + fontSize
    };
  }
  destroy() {
    Util.releaseCanvas(this.dummyCanvas);
    return super.destroy();
  }
}
TextPath.prototype._fillFunc = _fillFunc;
TextPath.prototype._strokeFunc = _strokeFunc;
TextPath.prototype._fillFuncHit = _fillFunc;
TextPath.prototype._strokeFuncHit = _strokeFunc;
TextPath.prototype.className = "TextPath";
TextPath.prototype._attrsAffectingSize = ["text", "fontSize", "data"];
_registerNode(TextPath);
Factory.addGetterSetter(TextPath, "data");
Factory.addGetterSetter(TextPath, "fontFamily", "Arial");
Factory.addGetterSetter(TextPath, "fontSize", 12, getNumberValidator());
Factory.addGetterSetter(TextPath, "fontStyle", NORMAL);
Factory.addGetterSetter(TextPath, "align", "left");
Factory.addGetterSetter(TextPath, "letterSpacing", 0, getNumberValidator());
Factory.addGetterSetter(TextPath, "textBaseline", "middle");
Factory.addGetterSetter(TextPath, "fontVariant", NORMAL);
Factory.addGetterSetter(TextPath, "text", EMPTY_STRING);
Factory.addGetterSetter(TextPath, "textDecoration", "");
Factory.addGetterSetter(TextPath, "kerningFunc", void 0);
const EVENTS_NAME = "tr-konva";
const ATTR_CHANGE_LIST = [
  "resizeEnabledChange",
  "rotateAnchorOffsetChange",
  "rotateAnchorAngleChange",
  "rotateEnabledChange",
  "enabledAnchorsChange",
  "anchorSizeChange",
  "borderEnabledChange",
  "borderStrokeChange",
  "borderStrokeWidthChange",
  "borderDashChange",
  "anchorStrokeChange",
  "anchorStrokeWidthChange",
  "anchorFillChange",
  "anchorCornerRadiusChange",
  "ignoreStrokeChange",
  "anchorStyleFuncChange"
].map((e) => e + `.${EVENTS_NAME}`).join(" ");
const NODES_RECT = "nodesRect";
const TRANSFORM_CHANGE_STR = [
  "widthChange",
  "heightChange",
  "scaleXChange",
  "scaleYChange",
  "skewXChange",
  "skewYChange",
  "rotationChange",
  "offsetXChange",
  "offsetYChange",
  "transformsEnabledChange",
  "strokeWidthChange",
  "draggableChange"
];
const ANGLES = {
  "top-left": -45,
  "top-center": 0,
  "top-right": 45,
  "middle-right": -90,
  "middle-left": 90,
  "bottom-left": -135,
  "bottom-center": 180,
  "bottom-right": 135
};
const TOUCH_DEVICE = "ontouchstart" in Konva$1._global;
function getCursor(anchorName, rad, rotateCursor) {
  if (anchorName === "rotater") {
    return rotateCursor;
  }
  rad += Util.degToRad(ANGLES[anchorName] || 0);
  const angle = (Util.radToDeg(rad) % 360 + 360) % 360;
  if (Util._inRange(angle, 315 + 22.5, 360) || Util._inRange(angle, 0, 22.5)) {
    return "ns-resize";
  } else if (Util._inRange(angle, 45 - 22.5, 45 + 22.5)) {
    return "nesw-resize";
  } else if (Util._inRange(angle, 90 - 22.5, 90 + 22.5)) {
    return "ew-resize";
  } else if (Util._inRange(angle, 135 - 22.5, 135 + 22.5)) {
    return "nwse-resize";
  } else if (Util._inRange(angle, 180 - 22.5, 180 + 22.5)) {
    return "ns-resize";
  } else if (Util._inRange(angle, 225 - 22.5, 225 + 22.5)) {
    return "nesw-resize";
  } else if (Util._inRange(angle, 270 - 22.5, 270 + 22.5)) {
    return "ew-resize";
  } else if (Util._inRange(angle, 315 - 22.5, 315 + 22.5)) {
    return "nwse-resize";
  } else {
    Util.error("Transformer has unknown angle for cursor detection: " + angle);
    return "pointer";
  }
}
const ANCHORS_NAMES = [
  "top-left",
  "top-center",
  "top-right",
  "middle-right",
  "middle-left",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];
function getCenter(shape) {
  return {
    x: shape.x + shape.width / 2 * Math.cos(shape.rotation) + shape.height / 2 * Math.sin(-shape.rotation),
    y: shape.y + shape.height / 2 * Math.cos(shape.rotation) + shape.width / 2 * Math.sin(shape.rotation)
  };
}
function rotateAroundPoint(shape, angleRad, point) {
  const x2 = point.x + (shape.x - point.x) * Math.cos(angleRad) - (shape.y - point.y) * Math.sin(angleRad);
  const y = point.y + (shape.x - point.x) * Math.sin(angleRad) + (shape.y - point.y) * Math.cos(angleRad);
  return {
    ...shape,
    rotation: shape.rotation + angleRad,
    x: x2,
    y
  };
}
function rotateAroundCenter(shape, deltaRad) {
  const center = getCenter(shape);
  return rotateAroundPoint(shape, deltaRad, center);
}
function getSnap(snaps, newRotationRad, tol) {
  let snapped = newRotationRad;
  for (let i = 0; i < snaps.length; i++) {
    const angle = Konva$1.getAngle(snaps[i]);
    const absDiff = Math.abs(angle - newRotationRad) % (Math.PI * 2);
    const dif = Math.min(absDiff, Math.PI * 2 - absDiff);
    if (dif < tol) {
      snapped = angle;
    }
  }
  return snapped;
}
let activeTransformersCount = 0;
let Transformer$1 = class Transformer extends Group$1 {
  constructor(config) {
    super(config);
    this._movingAnchorName = null;
    this._transforming = false;
    this._elementsCreated = false;
    this._createElements();
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this.update = this.update.bind(this);
    this.on(ATTR_CHANGE_LIST, this.update);
    if (this.getNode()) {
      this.update();
    }
  }
  attachTo(node) {
    this.setNode(node);
    return this;
  }
  setNode(node) {
    Util.warn("tr.setNode(shape), tr.node(shape) and tr.attachTo(shape) methods are deprecated. Please use tr.nodes(nodesArray) instead.");
    return this.setNodes([node]);
  }
  getNode() {
    return this._nodes && this._nodes[0];
  }
  _getEventNamespace() {
    return EVENTS_NAME + this._id;
  }
  setNodes(nodes = []) {
    if (this._nodes && this._nodes.length) {
      this.detach();
    }
    const filteredNodes = nodes.filter((node) => {
      if (node.isAncestorOf(this)) {
        Util.error("Konva.Transformer cannot be an a child of the node you are trying to attach");
        return false;
      }
      return true;
    });
    this._nodes = nodes = filteredNodes;
    if (nodes.length === 1 && this.useSingleNodeRotation()) {
      this.rotation(nodes[0].getAbsoluteRotation());
    } else {
      this.rotation(0);
    }
    this._nodes.forEach((node) => {
      const onChange = () => {
        if (this.nodes().length === 1 && this.useSingleNodeRotation()) {
          this.rotation(this.nodes()[0].getAbsoluteRotation());
        }
        this._resetTransformCache();
        if (!this._transforming && !this.isDragging()) {
          this.update();
        }
      };
      if (node._attrsAffectingSize.length) {
        const additionalEvents = node._attrsAffectingSize.map((prop) => prop + "Change." + this._getEventNamespace()).join(" ");
        node.on(additionalEvents, onChange);
      }
      node.on(TRANSFORM_CHANGE_STR.map((e) => e + `.${this._getEventNamespace()}`).join(" "), onChange);
      node.on(`absoluteTransformChange.${this._getEventNamespace()}`, onChange);
      this._proxyDrag(node);
    });
    this._resetTransformCache();
    const elementsCreated = !!this.findOne(".top-left");
    if (elementsCreated) {
      this.update();
    }
    return this;
  }
  _proxyDrag(node) {
    let lastPos;
    node.on(`dragstart.${this._getEventNamespace()}`, (e) => {
      lastPos = node.getAbsolutePosition();
      if (!this.isDragging() && node !== this.findOne(".back")) {
        this.startDrag(e, false);
      }
    });
    node.on(`dragmove.${this._getEventNamespace()}`, (e) => {
      if (!lastPos) {
        return;
      }
      const abs = node.getAbsolutePosition();
      const dx = abs.x - lastPos.x;
      const dy = abs.y - lastPos.y;
      this.nodes().forEach((otherNode) => {
        if (otherNode === node) {
          return;
        }
        if (otherNode.isDragging()) {
          return;
        }
        const otherAbs = otherNode.getAbsolutePosition();
        otherNode.setAbsolutePosition({
          x: otherAbs.x + dx,
          y: otherAbs.y + dy
        });
        otherNode.startDrag(e);
      });
      lastPos = null;
    });
  }
  getNodes() {
    return this._nodes || [];
  }
  getActiveAnchor() {
    return this._movingAnchorName;
  }
  detach() {
    if (this._nodes) {
      this._nodes.forEach((node) => {
        node.off("." + this._getEventNamespace());
      });
    }
    this._nodes = [];
    this._resetTransformCache();
  }
  _resetTransformCache() {
    this._clearCache(NODES_RECT);
    this._clearCache("transform");
    this._clearSelfAndDescendantCache("absoluteTransform");
  }
  _getNodeRect() {
    return this._getCache(NODES_RECT, this.__getNodeRect);
  }
  __getNodeShape(node, rot = this.rotation(), relative) {
    const rect = node.getClientRect({
      skipTransform: true,
      skipShadow: true,
      skipStroke: this.ignoreStroke()
    });
    const absScale = node.getAbsoluteScale(relative);
    const absPos = node.getAbsolutePosition(relative);
    const dx = rect.x * absScale.x - node.offsetX() * absScale.x;
    const dy = rect.y * absScale.y - node.offsetY() * absScale.y;
    const rotation = (Konva$1.getAngle(node.getAbsoluteRotation()) + Math.PI * 2) % (Math.PI * 2);
    const box = {
      x: absPos.x + dx * Math.cos(rotation) + dy * Math.sin(-rotation),
      y: absPos.y + dy * Math.cos(rotation) + dx * Math.sin(rotation),
      width: rect.width * absScale.x,
      height: rect.height * absScale.y,
      rotation
    };
    return rotateAroundPoint(box, -Konva$1.getAngle(rot), {
      x: 0,
      y: 0
    });
  }
  __getNodeRect() {
    const node = this.getNode();
    if (!node) {
      return {
        x: -1e8,
        y: -1e8,
        width: 0,
        height: 0,
        rotation: 0
      };
    }
    const totalPoints = [];
    this.nodes().map((node2) => {
      const box = node2.getClientRect({
        skipTransform: true,
        skipShadow: true,
        skipStroke: this.ignoreStroke()
      });
      const points = [
        { x: box.x, y: box.y },
        { x: box.x + box.width, y: box.y },
        { x: box.x + box.width, y: box.y + box.height },
        { x: box.x, y: box.y + box.height }
      ];
      const trans = node2.getAbsoluteTransform();
      points.forEach(function(point) {
        const transformed = trans.point(point);
        totalPoints.push(transformed);
      });
    });
    const tr = new Transform();
    tr.rotate(-Konva$1.getAngle(this.rotation()));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    totalPoints.forEach(function(point) {
      const transformed = tr.point(point);
      if (minX === void 0) {
        minX = maxX = transformed.x;
        minY = maxY = transformed.y;
      }
      minX = Math.min(minX, transformed.x);
      minY = Math.min(minY, transformed.y);
      maxX = Math.max(maxX, transformed.x);
      maxY = Math.max(maxY, transformed.y);
    });
    tr.invert();
    const p = tr.point({ x: minX, y: minY });
    return {
      x: p.x,
      y: p.y,
      width: maxX - minX,
      height: maxY - minY,
      rotation: Konva$1.getAngle(this.rotation())
    };
  }
  getX() {
    return this._getNodeRect().x;
  }
  getY() {
    return this._getNodeRect().y;
  }
  getWidth() {
    return this._getNodeRect().width;
  }
  getHeight() {
    return this._getNodeRect().height;
  }
  _createElements() {
    this._createBack();
    ANCHORS_NAMES.forEach((name) => {
      this._createAnchor(name);
    });
    this._createAnchor("rotater");
    this._elementsCreated = true;
  }
  _createAnchor(name) {
    const anchor = new Rect$1({
      stroke: "rgb(0, 161, 255)",
      fill: "white",
      strokeWidth: 1,
      name: name + " _anchor",
      dragDistance: 0,
      draggable: true,
      hitStrokeWidth: TOUCH_DEVICE ? 10 : "auto"
    });
    const self2 = this;
    anchor.on("mousedown touchstart", function(e) {
      self2._handleMouseDown(e);
    });
    anchor.on("dragstart", (e) => {
      anchor.stopDrag();
      e.cancelBubble = true;
    });
    anchor.on("dragend", (e) => {
      e.cancelBubble = true;
    });
    anchor.on("mouseenter", () => {
      const rad = Konva$1.getAngle(this.rotation());
      const rotateCursor = this.rotateAnchorCursor();
      const cursor = getCursor(name, rad, rotateCursor);
      anchor.getStage().content && (anchor.getStage().content.style.cursor = cursor);
      this._cursorChange = true;
    });
    anchor.on("mouseout", () => {
      anchor.getStage().content && (anchor.getStage().content.style.cursor = "");
      this._cursorChange = false;
    });
    this.add(anchor);
  }
  _createBack() {
    const back = new Shape({
      name: "back",
      width: 0,
      height: 0,
      sceneFunc(ctx, shape) {
        const tr = shape.getParent();
        const padding = tr.padding();
        const width = shape.width();
        const height = shape.height();
        ctx.beginPath();
        ctx.rect(-padding, -padding, width + padding * 2, height + padding * 2);
        if (tr.rotateEnabled() && tr.rotateLineVisible()) {
          const rotateAnchorAngle = tr.rotateAnchorAngle();
          const rotateAnchorOffset = tr.rotateAnchorOffset();
          const rad = Util.degToRad(rotateAnchorAngle);
          const dirX = Math.sin(rad);
          const dirY = -Math.cos(rad);
          const cx = width / 2;
          const cy = height / 2;
          let t = Infinity;
          if (dirY < 0) {
            t = Math.min(t, -cy / dirY);
          } else if (dirY > 0) {
            t = Math.min(t, (height - cy) / dirY);
          }
          if (dirX < 0) {
            t = Math.min(t, -cx / dirX);
          } else if (dirX > 0) {
            t = Math.min(t, (width - cx) / dirX);
          }
          const edgeX = cx + dirX * t;
          const edgeY = cy + dirY * t;
          const sign = Util._sign(height);
          const endX = edgeX + dirX * rotateAnchorOffset * sign;
          const endY = edgeY + dirY * rotateAnchorOffset * sign;
          ctx.moveTo(edgeX, edgeY);
          ctx.lineTo(endX, endY);
        }
        ctx.fillStrokeShape(shape);
      },
      hitFunc: (ctx, shape) => {
        if (!this.shouldOverdrawWholeArea()) {
          return;
        }
        const padding = this.padding();
        ctx.beginPath();
        ctx.rect(-padding, -padding, shape.width() + padding * 2, shape.height() + padding * 2);
        ctx.fillStrokeShape(shape);
      }
    });
    this.add(back);
    this._proxyDrag(back);
    back.on("dragstart", (e) => {
      e.cancelBubble = true;
    });
    back.on("dragmove", (e) => {
      e.cancelBubble = true;
    });
    back.on("dragend", (e) => {
      e.cancelBubble = true;
    });
    this.on("dragmove", (e) => {
      this.update();
    });
  }
  _handleMouseDown(e) {
    if (this._transforming) {
      return;
    }
    this._movingAnchorName = e.target.name().split(" ")[0];
    const attrs = this._getNodeRect();
    const width = attrs.width;
    const height = attrs.height;
    const hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    this.sin = Math.abs(height / hypotenuse);
    this.cos = Math.abs(width / hypotenuse);
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", this._handleMouseMove);
      window.addEventListener("touchmove", this._handleMouseMove);
      window.addEventListener("mouseup", this._handleMouseUp, true);
      window.addEventListener("touchend", this._handleMouseUp, true);
    }
    this._transforming = true;
    const ap = e.target.getAbsolutePosition();
    const pos = e.target.getStage().getPointerPosition();
    this._anchorDragOffset = {
      x: pos.x - ap.x,
      y: pos.y - ap.y
    };
    activeTransformersCount++;
    this._fire("transformstart", { evt: e.evt, target: this.getNode() });
    this._nodes.forEach((target) => {
      target._fire("transformstart", { evt: e.evt, target });
    });
  }
  _handleMouseMove(e) {
    let x2, y, newHypotenuse;
    const anchorNode = this.findOne("." + this._movingAnchorName);
    const stage = anchorNode.getStage();
    stage.setPointersPositions(e);
    const pp = stage.getPointerPosition();
    let newNodePos = {
      x: pp.x - this._anchorDragOffset.x,
      y: pp.y - this._anchorDragOffset.y
    };
    const oldAbs = anchorNode.getAbsolutePosition();
    if (this.anchorDragBoundFunc()) {
      newNodePos = this.anchorDragBoundFunc()(oldAbs, newNodePos, e);
    }
    anchorNode.setAbsolutePosition(newNodePos);
    const newAbs = anchorNode.getAbsolutePosition();
    if (oldAbs.x === newAbs.x && oldAbs.y === newAbs.y) {
      return;
    }
    if (this._movingAnchorName === "rotater") {
      const attrs = this._getNodeRect();
      x2 = anchorNode.x() - attrs.width / 2;
      y = -anchorNode.y() + attrs.height / 2;
      const rotateAnchorAngleRad = Konva$1.getAngle(this.rotateAnchorAngle());
      let delta = Math.atan2(-y, x2) + Math.PI / 2 - rotateAnchorAngleRad;
      if (attrs.height < 0) {
        delta -= Math.PI;
      }
      const oldRotation = Konva$1.getAngle(this.rotation());
      const newRotation = oldRotation + delta;
      const tol = Konva$1.getAngle(this.rotationSnapTolerance());
      const snappedRot = getSnap(this.rotationSnaps(), newRotation, tol);
      const diff = snappedRot - attrs.rotation;
      const shape = rotateAroundCenter(attrs, diff);
      this._fitNodesInto(shape, e);
      return;
    }
    const shiftBehavior = this.shiftBehavior();
    let keepProportion;
    if (shiftBehavior === "inverted") {
      keepProportion = this.keepRatio() && !e.shiftKey;
    } else if (shiftBehavior === "none") {
      keepProportion = this.keepRatio();
    } else {
      keepProportion = this.keepRatio() || e.shiftKey;
    }
    let centeredScaling = this.centeredScaling() || e.altKey;
    if (this._movingAnchorName === "top-left") {
      if (keepProportion) {
        const comparePoint = centeredScaling ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".bottom-right").x(),
          y: this.findOne(".bottom-right").y()
        };
        newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) + Math.pow(comparePoint.y - anchorNode.y(), 2));
        const reverseX = this.findOne(".top-left").x() > comparePoint.x ? -1 : 1;
        const reverseY = this.findOne(".top-left").y() > comparePoint.y ? -1 : 1;
        x2 = newHypotenuse * this.cos * reverseX;
        y = newHypotenuse * this.sin * reverseY;
        this.findOne(".top-left").x(comparePoint.x - x2);
        this.findOne(".top-left").y(comparePoint.y - y);
      }
    } else if (this._movingAnchorName === "top-center") {
      this.findOne(".top-left").y(anchorNode.y());
    } else if (this._movingAnchorName === "top-right") {
      if (keepProportion) {
        const comparePoint = centeredScaling ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".bottom-left").x(),
          y: this.findOne(".bottom-left").y()
        };
        newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) + Math.pow(comparePoint.y - anchorNode.y(), 2));
        const reverseX = this.findOne(".top-right").x() < comparePoint.x ? -1 : 1;
        const reverseY = this.findOne(".top-right").y() > comparePoint.y ? -1 : 1;
        x2 = newHypotenuse * this.cos * reverseX;
        y = newHypotenuse * this.sin * reverseY;
        this.findOne(".top-right").x(comparePoint.x + x2);
        this.findOne(".top-right").y(comparePoint.y - y);
      }
      var pos = anchorNode.position();
      this.findOne(".top-left").y(pos.y);
      this.findOne(".bottom-right").x(pos.x);
    } else if (this._movingAnchorName === "middle-left") {
      this.findOne(".top-left").x(anchorNode.x());
    } else if (this._movingAnchorName === "middle-right") {
      this.findOne(".bottom-right").x(anchorNode.x());
    } else if (this._movingAnchorName === "bottom-left") {
      if (keepProportion) {
        const comparePoint = centeredScaling ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".top-right").x(),
          y: this.findOne(".top-right").y()
        };
        newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) + Math.pow(anchorNode.y() - comparePoint.y, 2));
        const reverseX = comparePoint.x < anchorNode.x() ? -1 : 1;
        const reverseY = anchorNode.y() < comparePoint.y ? -1 : 1;
        x2 = newHypotenuse * this.cos * reverseX;
        y = newHypotenuse * this.sin * reverseY;
        anchorNode.x(comparePoint.x - x2);
        anchorNode.y(comparePoint.y + y);
      }
      pos = anchorNode.position();
      this.findOne(".top-left").x(pos.x);
      this.findOne(".bottom-right").y(pos.y);
    } else if (this._movingAnchorName === "bottom-center") {
      this.findOne(".bottom-right").y(anchorNode.y());
    } else if (this._movingAnchorName === "bottom-right") {
      if (keepProportion) {
        const comparePoint = centeredScaling ? {
          x: this.width() / 2,
          y: this.height() / 2
        } : {
          x: this.findOne(".top-left").x(),
          y: this.findOne(".top-left").y()
        };
        newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) + Math.pow(anchorNode.y() - comparePoint.y, 2));
        const reverseX = this.findOne(".bottom-right").x() < comparePoint.x ? -1 : 1;
        const reverseY = this.findOne(".bottom-right").y() < comparePoint.y ? -1 : 1;
        x2 = newHypotenuse * this.cos * reverseX;
        y = newHypotenuse * this.sin * reverseY;
        this.findOne(".bottom-right").x(comparePoint.x + x2);
        this.findOne(".bottom-right").y(comparePoint.y + y);
      }
    } else {
      console.error(new Error("Wrong position argument of selection resizer: " + this._movingAnchorName));
    }
    centeredScaling = this.centeredScaling() || e.altKey;
    if (centeredScaling) {
      const topLeft = this.findOne(".top-left");
      const bottomRight = this.findOne(".bottom-right");
      const topOffsetX = topLeft.x();
      const topOffsetY = topLeft.y();
      const bottomOffsetX = this.getWidth() - bottomRight.x();
      const bottomOffsetY = this.getHeight() - bottomRight.y();
      bottomRight.move({
        x: -topOffsetX,
        y: -topOffsetY
      });
      topLeft.move({
        x: bottomOffsetX,
        y: bottomOffsetY
      });
    }
    const absPos = this.findOne(".top-left").getAbsolutePosition();
    x2 = absPos.x;
    y = absPos.y;
    const width = this.findOne(".bottom-right").x() - this.findOne(".top-left").x();
    const height = this.findOne(".bottom-right").y() - this.findOne(".top-left").y();
    this._fitNodesInto({
      x: x2,
      y,
      width,
      height,
      rotation: Konva$1.getAngle(this.rotation())
    }, e);
  }
  _handleMouseUp(e) {
    this._removeEvents(e);
  }
  getAbsoluteTransform() {
    return this.getTransform();
  }
  _removeEvents(e) {
    var _a;
    if (this._transforming) {
      this._transforming = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", this._handleMouseMove);
        window.removeEventListener("touchmove", this._handleMouseMove);
        window.removeEventListener("mouseup", this._handleMouseUp, true);
        window.removeEventListener("touchend", this._handleMouseUp, true);
      }
      const node = this.getNode();
      activeTransformersCount--;
      this._fire("transformend", { evt: e, target: node });
      (_a = this.getLayer()) === null || _a === void 0 ? void 0 : _a.batchDraw();
      if (node) {
        this._nodes.forEach((target) => {
          var _a2;
          target._fire("transformend", { evt: e, target });
          (_a2 = target.getLayer()) === null || _a2 === void 0 ? void 0 : _a2.batchDraw();
        });
      }
      this._movingAnchorName = null;
    }
  }
  _fitNodesInto(newAttrs, evt) {
    const oldAttrs = this._getNodeRect();
    const minSize = 1;
    if (Util._inRange(newAttrs.width, -this.padding() * 2 - minSize, minSize)) {
      this.update();
      return;
    }
    if (Util._inRange(newAttrs.height, -this.padding() * 2 - minSize, minSize)) {
      this.update();
      return;
    }
    const t = new Transform();
    t.rotate(Konva$1.getAngle(this.rotation()));
    if (this._movingAnchorName && newAttrs.width < 0 && this._movingAnchorName.indexOf("left") >= 0) {
      const offset = t.point({
        x: -this.padding() * 2,
        y: 0
      });
      newAttrs.x += offset.x;
      newAttrs.y += offset.y;
      newAttrs.width += this.padding() * 2;
      this._movingAnchorName = this._movingAnchorName.replace("left", "right");
      this._anchorDragOffset.x -= offset.x;
      this._anchorDragOffset.y -= offset.y;
    } else if (this._movingAnchorName && newAttrs.width < 0 && this._movingAnchorName.indexOf("right") >= 0) {
      const offset = t.point({
        x: this.padding() * 2,
        y: 0
      });
      this._movingAnchorName = this._movingAnchorName.replace("right", "left");
      this._anchorDragOffset.x -= offset.x;
      this._anchorDragOffset.y -= offset.y;
      newAttrs.width += this.padding() * 2;
    }
    if (this._movingAnchorName && newAttrs.height < 0 && this._movingAnchorName.indexOf("top") >= 0) {
      const offset = t.point({
        x: 0,
        y: -this.padding() * 2
      });
      newAttrs.x += offset.x;
      newAttrs.y += offset.y;
      this._movingAnchorName = this._movingAnchorName.replace("top", "bottom");
      this._anchorDragOffset.x -= offset.x;
      this._anchorDragOffset.y -= offset.y;
      newAttrs.height += this.padding() * 2;
    } else if (this._movingAnchorName && newAttrs.height < 0 && this._movingAnchorName.indexOf("bottom") >= 0) {
      const offset = t.point({
        x: 0,
        y: this.padding() * 2
      });
      this._movingAnchorName = this._movingAnchorName.replace("bottom", "top");
      this._anchorDragOffset.x -= offset.x;
      this._anchorDragOffset.y -= offset.y;
      newAttrs.height += this.padding() * 2;
    }
    if (this.boundBoxFunc()) {
      const bounded = this.boundBoxFunc()(oldAttrs, newAttrs);
      if (bounded) {
        newAttrs = bounded;
      } else {
        Util.warn("boundBoxFunc returned falsy. You should return new bound rect from it!");
      }
    }
    const baseSize = 1e7;
    const oldTr = new Transform();
    oldTr.translate(oldAttrs.x, oldAttrs.y);
    oldTr.rotate(oldAttrs.rotation);
    oldTr.scale(oldAttrs.width / baseSize, oldAttrs.height / baseSize);
    const newTr = new Transform();
    const newScaleX = newAttrs.width / baseSize;
    const newScaleY = newAttrs.height / baseSize;
    if (this.flipEnabled() === false) {
      newTr.translate(newAttrs.x, newAttrs.y);
      newTr.rotate(newAttrs.rotation);
      newTr.translate(newAttrs.width < 0 ? newAttrs.width : 0, newAttrs.height < 0 ? newAttrs.height : 0);
      newTr.scale(Math.abs(newScaleX), Math.abs(newScaleY));
    } else {
      newTr.translate(newAttrs.x, newAttrs.y);
      newTr.rotate(newAttrs.rotation);
      newTr.scale(newScaleX, newScaleY);
    }
    const delta = newTr.multiply(oldTr.invert());
    this._nodes.forEach((node) => {
      var _a;
      if (!node.getStage()) {
        return;
      }
      const parentTransform = node.getParent().getAbsoluteTransform();
      const localTransform = node.getTransform().copy();
      localTransform.translate(node.offsetX(), node.offsetY());
      const newLocalTransform = new Transform();
      newLocalTransform.multiply(parentTransform.copy().invert()).multiply(delta).multiply(parentTransform).multiply(localTransform);
      const attrs = newLocalTransform.decompose();
      node.setAttrs(attrs);
      (_a = node.getLayer()) === null || _a === void 0 ? void 0 : _a.batchDraw();
    });
    this.rotation(Util._getRotation(newAttrs.rotation));
    this._nodes.forEach((node) => {
      this._fire("transform", { evt, target: node });
      node._fire("transform", { evt, target: node });
    });
    this._resetTransformCache();
    this.update();
    this.getLayer().batchDraw();
  }
  forceUpdate() {
    this._resetTransformCache();
    this.update();
  }
  _batchChangeChild(selector, attrs) {
    const anchor = this.findOne(selector);
    anchor.setAttrs(attrs);
  }
  update() {
    var _a;
    const attrs = this._getNodeRect();
    this.rotation(Util._getRotation(attrs.rotation));
    const width = attrs.width;
    const height = attrs.height;
    const enabledAnchors = this.enabledAnchors();
    const resizeEnabled = this.resizeEnabled();
    const padding = this.padding();
    const anchorSize = this.anchorSize();
    const anchors = this.find("._anchor");
    anchors.forEach((node) => {
      node.setAttrs({
        width: anchorSize,
        height: anchorSize,
        offsetX: anchorSize / 2,
        offsetY: anchorSize / 2,
        stroke: this.anchorStroke(),
        strokeWidth: this.anchorStrokeWidth(),
        fill: this.anchorFill(),
        cornerRadius: this.anchorCornerRadius()
      });
    });
    this._batchChangeChild(".top-left", {
      x: 0,
      y: 0,
      offsetX: anchorSize / 2 + padding,
      offsetY: anchorSize / 2 + padding,
      visible: resizeEnabled && enabledAnchors.indexOf("top-left") >= 0
    });
    this._batchChangeChild(".top-center", {
      x: width / 2,
      y: 0,
      offsetY: anchorSize / 2 + padding,
      visible: resizeEnabled && enabledAnchors.indexOf("top-center") >= 0
    });
    this._batchChangeChild(".top-right", {
      x: width,
      y: 0,
      offsetX: anchorSize / 2 - padding,
      offsetY: anchorSize / 2 + padding,
      visible: resizeEnabled && enabledAnchors.indexOf("top-right") >= 0
    });
    this._batchChangeChild(".middle-left", {
      x: 0,
      y: height / 2,
      offsetX: anchorSize / 2 + padding,
      visible: resizeEnabled && enabledAnchors.indexOf("middle-left") >= 0
    });
    this._batchChangeChild(".middle-right", {
      x: width,
      y: height / 2,
      offsetX: anchorSize / 2 - padding,
      visible: resizeEnabled && enabledAnchors.indexOf("middle-right") >= 0
    });
    this._batchChangeChild(".bottom-left", {
      x: 0,
      y: height,
      offsetX: anchorSize / 2 + padding,
      offsetY: anchorSize / 2 - padding,
      visible: resizeEnabled && enabledAnchors.indexOf("bottom-left") >= 0
    });
    this._batchChangeChild(".bottom-center", {
      x: width / 2,
      y: height,
      offsetY: anchorSize / 2 - padding,
      visible: resizeEnabled && enabledAnchors.indexOf("bottom-center") >= 0
    });
    this._batchChangeChild(".bottom-right", {
      x: width,
      y: height,
      offsetX: anchorSize / 2 - padding,
      offsetY: anchorSize / 2 - padding,
      visible: resizeEnabled && enabledAnchors.indexOf("bottom-right") >= 0
    });
    const rotateAnchorAngle = this.rotateAnchorAngle();
    const rotateAnchorOffset = this.rotateAnchorOffset();
    const rad = Util.degToRad(rotateAnchorAngle);
    const dirX = Math.sin(rad);
    const dirY = -Math.cos(rad);
    const cx = width / 2;
    const cy = height / 2;
    let t = Infinity;
    if (dirY < 0) {
      t = Math.min(t, -cy / dirY);
    } else if (dirY > 0) {
      t = Math.min(t, (height - cy) / dirY);
    }
    if (dirX < 0) {
      t = Math.min(t, -cx / dirX);
    } else if (dirX > 0) {
      t = Math.min(t, (width - cx) / dirX);
    }
    const edgeX = cx + dirX * t;
    const edgeY = cy + dirY * t;
    const sign = Util._sign(height);
    this._batchChangeChild(".rotater", {
      x: edgeX + dirX * rotateAnchorOffset * sign,
      y: edgeY + dirY * rotateAnchorOffset * sign - padding * dirY,
      visible: this.rotateEnabled()
    });
    this._batchChangeChild(".back", {
      width,
      height,
      visible: this.borderEnabled(),
      stroke: this.borderStroke(),
      strokeWidth: this.borderStrokeWidth(),
      dash: this.borderDash(),
      draggable: this.nodes().some((node) => node.draggable()),
      x: 0,
      y: 0
    });
    const styleFunc = this.anchorStyleFunc();
    if (styleFunc) {
      anchors.forEach((node) => {
        styleFunc(node);
      });
    }
    (_a = this.getLayer()) === null || _a === void 0 ? void 0 : _a.batchDraw();
  }
  isTransforming() {
    return this._transforming;
  }
  stopTransform() {
    if (this._transforming) {
      this._removeEvents();
      const anchorNode = this.findOne("." + this._movingAnchorName);
      if (anchorNode) {
        anchorNode.stopDrag();
      }
    }
  }
  destroy() {
    if (this.getStage() && this._cursorChange) {
      this.getStage().content && (this.getStage().content.style.cursor = "");
    }
    Group$1.prototype.destroy.call(this);
    this.detach();
    this._removeEvents();
    return this;
  }
  add(...children) {
    if (this._elementsCreated) {
      Util.error("You cannot add external nodes to the Transformer. Use tr.nodes([node]) instead.");
      return this;
    }
    return super.add(...children);
  }
  toObject() {
    return Node.prototype.toObject.call(this);
  }
  clone(obj) {
    const node = Node.prototype.clone.call(this, obj);
    return node;
  }
  getClientRect() {
    if (this.nodes().length > 0) {
      return super.getClientRect();
    } else {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
  }
};
Transformer$1.isTransforming = () => {
  return activeTransformersCount > 0;
};
function validateAnchors(val) {
  if (!(val instanceof Array)) {
    Util.warn("enabledAnchors value should be an array");
  }
  if (val instanceof Array) {
    val.forEach(function(name) {
      if (ANCHORS_NAMES.indexOf(name) === -1) {
        Util.warn("Unknown anchor name: " + name + ". Available names are: " + ANCHORS_NAMES.join(", "));
      }
    });
  }
  return val || [];
}
Transformer$1.prototype.className = "Transformer";
_registerNode(Transformer$1);
Factory.addGetterSetter(Transformer$1, "enabledAnchors", ANCHORS_NAMES, validateAnchors);
Factory.addGetterSetter(Transformer$1, "flipEnabled", true, getBooleanValidator());
Factory.addGetterSetter(Transformer$1, "resizeEnabled", true);
Factory.addGetterSetter(Transformer$1, "anchorSize", 10, getNumberValidator());
Factory.addGetterSetter(Transformer$1, "rotateEnabled", true);
Factory.addGetterSetter(Transformer$1, "rotateLineVisible", true);
Factory.addGetterSetter(Transformer$1, "rotationSnaps", []);
Factory.addGetterSetter(Transformer$1, "rotateAnchorOffset", 50, getNumberValidator());
Factory.addGetterSetter(Transformer$1, "rotateAnchorAngle", 0, getNumberValidator());
Factory.addGetterSetter(Transformer$1, "rotateAnchorCursor", "crosshair");
Factory.addGetterSetter(Transformer$1, "rotationSnapTolerance", 5, getNumberValidator());
Factory.addGetterSetter(Transformer$1, "borderEnabled", true);
Factory.addGetterSetter(Transformer$1, "anchorStroke", "rgb(0, 161, 255)");
Factory.addGetterSetter(Transformer$1, "anchorStrokeWidth", 1, getNumberValidator());
Factory.addGetterSetter(Transformer$1, "anchorFill", "white");
Factory.addGetterSetter(Transformer$1, "anchorCornerRadius", 0, getNumberValidator());
Factory.addGetterSetter(Transformer$1, "borderStroke", "rgb(0, 161, 255)");
Factory.addGetterSetter(Transformer$1, "borderStrokeWidth", 1, getNumberValidator());
Factory.addGetterSetter(Transformer$1, "borderDash");
Factory.addGetterSetter(Transformer$1, "keepRatio", true);
Factory.addGetterSetter(Transformer$1, "shiftBehavior", "default");
Factory.addGetterSetter(Transformer$1, "centeredScaling", false);
Factory.addGetterSetter(Transformer$1, "ignoreStroke", false);
Factory.addGetterSetter(Transformer$1, "padding", 0, getNumberValidator());
Factory.addGetterSetter(Transformer$1, "nodes");
Factory.addGetterSetter(Transformer$1, "node");
Factory.addGetterSetter(Transformer$1, "boundBoxFunc");
Factory.addGetterSetter(Transformer$1, "anchorDragBoundFunc");
Factory.addGetterSetter(Transformer$1, "anchorStyleFunc");
Factory.addGetterSetter(Transformer$1, "shouldOverdrawWholeArea", false);
Factory.addGetterSetter(Transformer$1, "useSingleNodeRotation", true);
Factory.backCompat(Transformer$1, {
  lineEnabled: "borderEnabled",
  rotateHandlerOffset: "rotateAnchorOffset",
  enabledHandlers: "enabledAnchors"
});
class Wedge extends Shape {
  _sceneFunc(context) {
    context.beginPath();
    context.arc(0, 0, this.radius(), 0, Konva$1.getAngle(this.angle()), this.clockwise());
    context.lineTo(0, 0);
    context.closePath();
    context.fillStrokeShape(this);
  }
  getWidth() {
    return this.radius() * 2;
  }
  getHeight() {
    return this.radius() * 2;
  }
  setWidth(width) {
    this.radius(width / 2);
  }
  setHeight(height) {
    this.radius(height / 2);
  }
}
Wedge.prototype.className = "Wedge";
Wedge.prototype._centroid = true;
Wedge.prototype._attrsAffectingSize = ["radius"];
_registerNode(Wedge);
Factory.addGetterSetter(Wedge, "radius", 0, getNumberValidator());
Factory.addGetterSetter(Wedge, "angle", 0, getNumberValidator());
Factory.addGetterSetter(Wedge, "clockwise", false);
Factory.backCompat(Wedge, {
  angleDeg: "angle",
  getAngleDeg: "getAngle",
  setAngleDeg: "setAngle"
});
function BlurStack() {
  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.a = 0;
  this.next = null;
}
const mul_table = [
  512,
  512,
  456,
  512,
  328,
  456,
  335,
  512,
  405,
  328,
  271,
  456,
  388,
  335,
  292,
  512,
  454,
  405,
  364,
  328,
  298,
  271,
  496,
  456,
  420,
  388,
  360,
  335,
  312,
  292,
  273,
  512,
  482,
  454,
  428,
  405,
  383,
  364,
  345,
  328,
  312,
  298,
  284,
  271,
  259,
  496,
  475,
  456,
  437,
  420,
  404,
  388,
  374,
  360,
  347,
  335,
  323,
  312,
  302,
  292,
  282,
  273,
  265,
  512,
  497,
  482,
  468,
  454,
  441,
  428,
  417,
  405,
  394,
  383,
  373,
  364,
  354,
  345,
  337,
  328,
  320,
  312,
  305,
  298,
  291,
  284,
  278,
  271,
  265,
  259,
  507,
  496,
  485,
  475,
  465,
  456,
  446,
  437,
  428,
  420,
  412,
  404,
  396,
  388,
  381,
  374,
  367,
  360,
  354,
  347,
  341,
  335,
  329,
  323,
  318,
  312,
  307,
  302,
  297,
  292,
  287,
  282,
  278,
  273,
  269,
  265,
  261,
  512,
  505,
  497,
  489,
  482,
  475,
  468,
  461,
  454,
  447,
  441,
  435,
  428,
  422,
  417,
  411,
  405,
  399,
  394,
  389,
  383,
  378,
  373,
  368,
  364,
  359,
  354,
  350,
  345,
  341,
  337,
  332,
  328,
  324,
  320,
  316,
  312,
  309,
  305,
  301,
  298,
  294,
  291,
  287,
  284,
  281,
  278,
  274,
  271,
  268,
  265,
  262,
  259,
  257,
  507,
  501,
  496,
  491,
  485,
  480,
  475,
  470,
  465,
  460,
  456,
  451,
  446,
  442,
  437,
  433,
  428,
  424,
  420,
  416,
  412,
  408,
  404,
  400,
  396,
  392,
  388,
  385,
  381,
  377,
  374,
  370,
  367,
  363,
  360,
  357,
  354,
  350,
  347,
  344,
  341,
  338,
  335,
  332,
  329,
  326,
  323,
  320,
  318,
  315,
  312,
  310,
  307,
  304,
  302,
  299,
  297,
  294,
  292,
  289,
  287,
  285,
  282,
  280,
  278,
  275,
  273,
  271,
  269,
  267,
  265,
  263,
  261,
  259
];
const shg_table = [
  9,
  11,
  12,
  13,
  13,
  14,
  14,
  15,
  15,
  15,
  15,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  21,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  22,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  23,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24,
  24
];
function filterGaussBlurRGBA(imageData, radius) {
  const pixels = imageData.data, width = imageData.width, height = imageData.height;
  let p, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
  const div = radius + radius + 1, widthMinus1 = width - 1, heightMinus1 = height - 1, radiusPlus1 = radius + 1, sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2, stackStart = new BlurStack(), mul_sum = mul_table[radius], shg_sum = shg_table[radius];
  let stackEnd = null, stack = stackStart, stackIn = null, stackOut = null;
  for (let i = 1; i < div; i++) {
    stack = stack.next = new BlurStack();
    if (i === radiusPlus1) {
      stackEnd = stack;
    }
  }
  stack.next = stackStart;
  yw = yi = 0;
  for (let y = 0; y < height; y++) {
    r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
    r_out_sum = radiusPlus1 * (pr = pixels[yi]);
    g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
    b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
    a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;
    a_sum += sumFactor * pa;
    stack = stackStart;
    for (let i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }
    for (let i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
      g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
      b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
      a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;
      a_in_sum += pa;
      stack = stack.next;
    }
    stackIn = stackStart;
    stackOut = stackEnd;
    for (let x2 = 0; x2 < width; x2++) {
      pixels[yi + 3] = pa = a_sum * mul_sum >> shg_sum;
      if (pa !== 0) {
        pa = 255 / pa;
        pixels[yi] = (r_sum * mul_sum >> shg_sum) * pa;
        pixels[yi + 1] = (g_sum * mul_sum >> shg_sum) * pa;
        pixels[yi + 2] = (b_sum * mul_sum >> shg_sum) * pa;
      } else {
        pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
      }
      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;
      a_sum -= a_out_sum;
      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;
      a_out_sum -= stackIn.a;
      p = yw + ((p = x2 + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
      r_in_sum += stackIn.r = pixels[p];
      g_in_sum += stackIn.g = pixels[p + 1];
      b_in_sum += stackIn.b = pixels[p + 2];
      a_in_sum += stackIn.a = pixels[p + 3];
      r_sum += r_in_sum;
      g_sum += g_in_sum;
      b_sum += b_in_sum;
      a_sum += a_in_sum;
      stackIn = stackIn.next;
      r_out_sum += pr = stackOut.r;
      g_out_sum += pg = stackOut.g;
      b_out_sum += pb = stackOut.b;
      a_out_sum += pa = stackOut.a;
      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;
      a_in_sum -= pa;
      stackOut = stackOut.next;
      yi += 4;
    }
    yw += width;
  }
  for (let x2 = 0; x2 < width; x2++) {
    g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
    yi = x2 << 2;
    r_out_sum = radiusPlus1 * (pr = pixels[yi]);
    g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
    b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
    a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;
    a_sum += sumFactor * pa;
    stack = stackStart;
    for (let i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }
    let yp = width;
    for (let i = 1; i <= radius; i++) {
      yi = yp + x2 << 2;
      r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
      g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
      b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
      a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;
      a_in_sum += pa;
      stack = stack.next;
      if (i < heightMinus1) {
        yp += width;
      }
    }
    yi = x2;
    stackIn = stackStart;
    stackOut = stackEnd;
    for (let y = 0; y < height; y++) {
      p = yi << 2;
      pixels[p + 3] = pa = a_sum * mul_sum >> shg_sum;
      if (pa > 0) {
        pa = 255 / pa;
        pixels[p] = (r_sum * mul_sum >> shg_sum) * pa;
        pixels[p + 1] = (g_sum * mul_sum >> shg_sum) * pa;
        pixels[p + 2] = (b_sum * mul_sum >> shg_sum) * pa;
      } else {
        pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
      }
      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;
      a_sum -= a_out_sum;
      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;
      a_out_sum -= stackIn.a;
      p = x2 + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
      r_sum += r_in_sum += stackIn.r = pixels[p];
      g_sum += g_in_sum += stackIn.g = pixels[p + 1];
      b_sum += b_in_sum += stackIn.b = pixels[p + 2];
      a_sum += a_in_sum += stackIn.a = pixels[p + 3];
      stackIn = stackIn.next;
      r_out_sum += pr = stackOut.r;
      g_out_sum += pg = stackOut.g;
      b_out_sum += pb = stackOut.b;
      a_out_sum += pa = stackOut.a;
      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;
      a_in_sum -= pa;
      stackOut = stackOut.next;
      yi += width;
    }
  }
}
const Blur = function Blur2(imageData) {
  const radius = Math.round(this.blurRadius());
  if (radius > 0) {
    filterGaussBlurRGBA(imageData, radius);
  }
};
Factory.addGetterSetter(Node, "blurRadius", 0, getNumberValidator(), Factory.afterSetFilter);
const Brighten = function(imageData) {
  const brightness = this.brightness() * 255, data = imageData.data, len = data.length;
  for (let i = 0; i < len; i += 4) {
    data[i] += brightness;
    data[i + 1] += brightness;
    data[i + 2] += brightness;
  }
};
Factory.addGetterSetter(Node, "brightness", 0, getNumberValidator(), Factory.afterSetFilter);
const Brightness = function(imageData) {
  const brightness = this.brightness(), data = imageData.data, len = data.length;
  for (let i = 0; i < len; i += 4) {
    data[i] = Math.min(255, data[i] * brightness);
    data[i + 1] = Math.min(255, data[i + 1] * brightness);
    data[i + 2] = Math.min(255, data[i + 2] * brightness);
  }
};
const Contrast = function(imageData) {
  const adjust = Math.pow((this.contrast() + 100) / 100, 2);
  const data = imageData.data, nPixels = data.length;
  let red = 150, green = 150, blue = 150;
  for (let i = 0; i < nPixels; i += 4) {
    red = data[i];
    green = data[i + 1];
    blue = data[i + 2];
    red /= 255;
    red -= 0.5;
    red *= adjust;
    red += 0.5;
    red *= 255;
    green /= 255;
    green -= 0.5;
    green *= adjust;
    green += 0.5;
    green *= 255;
    blue /= 255;
    blue -= 0.5;
    blue *= adjust;
    blue += 0.5;
    blue *= 255;
    red = red < 0 ? 0 : red > 255 ? 255 : red;
    green = green < 0 ? 0 : green > 255 ? 255 : green;
    blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;
    data[i] = red;
    data[i + 1] = green;
    data[i + 2] = blue;
  }
};
Factory.addGetterSetter(Node, "contrast", 0, getNumberValidator(), Factory.afterSetFilter);
const Emboss = function(imageData) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  const data = imageData.data;
  const w = imageData.width;
  const h = imageData.height;
  const strength01 = Math.min(1, Math.max(0, (_b = (_a = this.embossStrength) === null || _a === void 0 ? void 0 : _a.call(this)) !== null && _b !== void 0 ? _b : 0.5));
  const whiteLevel01 = Math.min(1, Math.max(0, (_d = (_c = this.embossWhiteLevel) === null || _c === void 0 ? void 0 : _c.call(this)) !== null && _d !== void 0 ? _d : 0.5));
  const directionMap = {
    "top-left": 315,
    top: 270,
    "top-right": 225,
    right: 180,
    "bottom-right": 135,
    bottom: 90,
    "bottom-left": 45,
    left: 0
  };
  const directionDeg = (_g = directionMap[(_f = (_e = this.embossDirection) === null || _e === void 0 ? void 0 : _e.call(this)) !== null && _f !== void 0 ? _f : "top-left"]) !== null && _g !== void 0 ? _g : 315;
  const blend = !!((_j = (_h = this.embossBlend) === null || _h === void 0 ? void 0 : _h.call(this)) !== null && _j !== void 0 ? _j : false);
  const strength = strength01 * 10;
  const bias = whiteLevel01 * 255;
  const dirRad = directionDeg * Math.PI / 180;
  const cx = Math.cos(dirRad);
  const cy = Math.sin(dirRad);
  const SCALE = 128 / 1020 * strength;
  const src = new Uint8ClampedArray(data);
  const lum = new Float32Array(w * h);
  for (let p = 0, i = 0; i < data.length; i += 4, p++) {
    lum[p] = 0.2126 * src[i] + 0.7152 * src[i + 1] + 0.0722 * src[i + 2];
  }
  const Gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const Gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  const OFF = [-w - 1, -w, -w + 1, -1, 0, 1, w - 1, w, w + 1];
  const clamp8 = (v) => v < 0 ? 0 : v > 255 ? 255 : v;
  for (let y = 1; y < h - 1; y++) {
    for (let x2 = 1; x2 < w - 1; x2++) {
      const p = y * w + x2;
      let sx = 0, sy = 0;
      sx += lum[p + OFF[0]] * Gx[0];
      sy += lum[p + OFF[0]] * Gy[0];
      sx += lum[p + OFF[1]] * Gx[1];
      sy += lum[p + OFF[1]] * Gy[1];
      sx += lum[p + OFF[2]] * Gx[2];
      sy += lum[p + OFF[2]] * Gy[2];
      sx += lum[p + OFF[3]] * Gx[3];
      sy += lum[p + OFF[3]] * Gy[3];
      sx += lum[p + OFF[5]] * Gx[5];
      sy += lum[p + OFF[5]] * Gy[5];
      sx += lum[p + OFF[6]] * Gx[6];
      sy += lum[p + OFF[6]] * Gy[6];
      sx += lum[p + OFF[7]] * Gx[7];
      sy += lum[p + OFF[7]] * Gy[7];
      sx += lum[p + OFF[8]] * Gx[8];
      sy += lum[p + OFF[8]] * Gy[8];
      const r = cx * sx + cy * sy;
      const outGray = clamp8(bias + r * SCALE);
      const o = p * 4;
      if (blend) {
        const delta = outGray - bias;
        data[o] = clamp8(src[o] + delta);
        data[o + 1] = clamp8(src[o + 1] + delta);
        data[o + 2] = clamp8(src[o + 2] + delta);
        data[o + 3] = src[o + 3];
      } else {
        data[o] = data[o + 1] = data[o + 2] = outGray;
        data[o + 3] = src[o + 3];
      }
    }
  }
  for (let x2 = 0; x2 < w; x2++) {
    let oTop = x2 * 4, oBot = ((h - 1) * w + x2) * 4;
    data[oTop] = src[oTop];
    data[oTop + 1] = src[oTop + 1];
    data[oTop + 2] = src[oTop + 2];
    data[oTop + 3] = src[oTop + 3];
    data[oBot] = src[oBot];
    data[oBot + 1] = src[oBot + 1];
    data[oBot + 2] = src[oBot + 2];
    data[oBot + 3] = src[oBot + 3];
  }
  for (let y = 1; y < h - 1; y++) {
    let oL = y * w * 4, oR = (y * w + (w - 1)) * 4;
    data[oL] = src[oL];
    data[oL + 1] = src[oL + 1];
    data[oL + 2] = src[oL + 2];
    data[oL + 3] = src[oL + 3];
    data[oR] = src[oR];
    data[oR + 1] = src[oR + 1];
    data[oR + 2] = src[oR + 2];
    data[oR + 3] = src[oR + 3];
  }
  return imageData;
};
Factory.addGetterSetter(Node, "embossStrength", 0.5, getNumberValidator(), Factory.afterSetFilter);
Factory.addGetterSetter(Node, "embossWhiteLevel", 0.5, getNumberValidator(), Factory.afterSetFilter);
Factory.addGetterSetter(Node, "embossDirection", "top-left", void 0, Factory.afterSetFilter);
Factory.addGetterSetter(Node, "embossBlend", false, void 0, Factory.afterSetFilter);
function remap(fromValue, fromMin, fromMax, toMin, toMax) {
  const fromRange = fromMax - fromMin, toRange = toMax - toMin;
  if (fromRange === 0) {
    return toMin + toRange / 2;
  }
  if (toRange === 0) {
    return toMin;
  }
  let toValue = (fromValue - fromMin) / fromRange;
  toValue = toRange * toValue + toMin;
  return toValue;
}
const Enhance = function(imageData) {
  const data = imageData.data, nSubPixels = data.length;
  let rMin = data[0], rMax = rMin, r, gMin = data[1], gMax = gMin, g, bMin = data[2], bMax = bMin, b;
  const enhanceAmount = this.enhance();
  if (enhanceAmount === 0) {
    return;
  }
  for (let i = 0; i < nSubPixels; i += 4) {
    r = data[i + 0];
    if (r < rMin) {
      rMin = r;
    } else if (r > rMax) {
      rMax = r;
    }
    g = data[i + 1];
    if (g < gMin) {
      gMin = g;
    } else if (g > gMax) {
      gMax = g;
    }
    b = data[i + 2];
    if (b < bMin) {
      bMin = b;
    } else if (b > bMax) {
      bMax = b;
    }
  }
  if (rMax === rMin) {
    rMax = 255;
    rMin = 0;
  }
  if (gMax === gMin) {
    gMax = 255;
    gMin = 0;
  }
  if (bMax === bMin) {
    bMax = 255;
    bMin = 0;
  }
  let rGoalMax, rGoalMin, gGoalMax, gGoalMin, bGoalMax, bGoalMin;
  if (enhanceAmount > 0) {
    rGoalMax = rMax + enhanceAmount * (255 - rMax);
    rGoalMin = rMin - enhanceAmount * (rMin - 0);
    gGoalMax = gMax + enhanceAmount * (255 - gMax);
    gGoalMin = gMin - enhanceAmount * (gMin - 0);
    bGoalMax = bMax + enhanceAmount * (255 - bMax);
    bGoalMin = bMin - enhanceAmount * (bMin - 0);
  } else {
    const rMid = (rMax + rMin) * 0.5;
    rGoalMax = rMax + enhanceAmount * (rMax - rMid);
    rGoalMin = rMin + enhanceAmount * (rMin - rMid);
    const gMid = (gMax + gMin) * 0.5;
    gGoalMax = gMax + enhanceAmount * (gMax - gMid);
    gGoalMin = gMin + enhanceAmount * (gMin - gMid);
    const bMid = (bMax + bMin) * 0.5;
    bGoalMax = bMax + enhanceAmount * (bMax - bMid);
    bGoalMin = bMin + enhanceAmount * (bMin - bMid);
  }
  for (let i = 0; i < nSubPixels; i += 4) {
    data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
    data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
    data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
  }
};
Factory.addGetterSetter(Node, "enhance", 0, getNumberValidator(), Factory.afterSetFilter);
const Grayscale = function(imageData) {
  const data = imageData.data, len = data.length;
  for (let i = 0; i < len; i += 4) {
    const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    data[i] = brightness;
    data[i + 1] = brightness;
    data[i + 2] = brightness;
  }
};
Factory.addGetterSetter(Node, "hue", 0, getNumberValidator(), Factory.afterSetFilter);
Factory.addGetterSetter(Node, "saturation", 0, getNumberValidator(), Factory.afterSetFilter);
Factory.addGetterSetter(Node, "luminance", 0, getNumberValidator(), Factory.afterSetFilter);
const HSL = function(imageData) {
  const data = imageData.data, nPixels = data.length, v = 1, s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, l = this.luminance() * 127;
  const vsu = v * s * Math.cos(h * Math.PI / 180), vsw = v * s * Math.sin(h * Math.PI / 180);
  const rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
  const gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
  const br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
  let r, g, b, a;
  for (let i = 0; i < nPixels; i += 4) {
    r = data[i + 0];
    g = data[i + 1];
    b = data[i + 2];
    a = data[i + 3];
    data[i + 0] = rr * r + rg * g + rb * b + l;
    data[i + 1] = gr * r + gg * g + gb * b + l;
    data[i + 2] = br * r + bg * g + bb * b + l;
    data[i + 3] = a;
  }
};
const HSV = function(imageData) {
  const data = imageData.data, nPixels = data.length, v = Math.pow(2, this.value()), s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360;
  const vsu = v * s * Math.cos(h * Math.PI / 180), vsw = v * s * Math.sin(h * Math.PI / 180);
  const rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
  const gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
  const br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
  for (let i = 0; i < nPixels; i += 4) {
    const r = data[i + 0];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    data[i + 0] = rr * r + rg * g + rb * b;
    data[i + 1] = gr * r + gg * g + gb * b;
    data[i + 2] = br * r + bg * g + bb * b;
    data[i + 3] = a;
  }
};
Factory.addGetterSetter(Node, "hue", 0, getNumberValidator(), Factory.afterSetFilter);
Factory.addGetterSetter(Node, "saturation", 0, getNumberValidator(), Factory.afterSetFilter);
Factory.addGetterSetter(Node, "value", 0, getNumberValidator(), Factory.afterSetFilter);
const Invert = function(imageData) {
  const data = imageData.data, len = data.length;
  for (let i = 0; i < len; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
};
const ToPolar = function(src, dst, opt) {
  const srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2;
  let rMax = Math.sqrt(xMid * xMid + yMid * yMid);
  let x2 = xSize - xMid;
  let y = ySize - yMid;
  const rad = Math.sqrt(x2 * x2 + y * y);
  rMax = rad > rMax ? rad : rMax;
  const rSize = ySize, tSize = xSize;
  const conversion = 360 / tSize * Math.PI / 180;
  for (let theta = 0; theta < tSize; theta += 1) {
    const sin = Math.sin(theta * conversion);
    const cos = Math.cos(theta * conversion);
    for (let radius = 0; radius < rSize; radius += 1) {
      x2 = Math.floor(xMid + rMax * radius / rSize * cos);
      y = Math.floor(yMid + rMax * radius / rSize * sin);
      let i = (y * xSize + x2) * 4;
      const r = srcPixels[i + 0];
      const g = srcPixels[i + 1];
      const b = srcPixels[i + 2];
      const a = srcPixels[i + 3];
      i = (theta + radius * xSize) * 4;
      dstPixels[i + 0] = r;
      dstPixels[i + 1] = g;
      dstPixels[i + 2] = b;
      dstPixels[i + 3] = a;
    }
  }
};
const FromPolar = function(src, dst, opt) {
  const srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2;
  let rMax = Math.sqrt(xMid * xMid + yMid * yMid);
  let x2 = xSize - xMid;
  let y = ySize - yMid;
  const rad = Math.sqrt(x2 * x2 + y * y);
  rMax = rad > rMax ? rad : rMax;
  const rSize = ySize, tSize = xSize, phaseShift = 0;
  let x1, y1;
  for (x2 = 0; x2 < xSize; x2 += 1) {
    for (y = 0; y < ySize; y += 1) {
      const dx = x2 - xMid;
      const dy = y - yMid;
      const radius = Math.sqrt(dx * dx + dy * dy) * rSize / rMax;
      let theta = (Math.atan2(dy, dx) * 180 / Math.PI + 360 + phaseShift) % 360;
      theta = theta * tSize / 360;
      x1 = Math.floor(theta);
      y1 = Math.floor(radius);
      let i = (y1 * xSize + x1) * 4;
      const r = srcPixels[i + 0];
      const g = srcPixels[i + 1];
      const b = srcPixels[i + 2];
      const a = srcPixels[i + 3];
      i = (y * xSize + x2) * 4;
      dstPixels[i + 0] = r;
      dstPixels[i + 1] = g;
      dstPixels[i + 2] = b;
      dstPixels[i + 3] = a;
    }
  }
};
const Kaleidoscope = function(imageData) {
  const xSize = imageData.width, ySize = imageData.height;
  let x2, y, xoff, i, r, g, b, a, srcPos, dstPos;
  let power = Math.round(this.kaleidoscopePower());
  const angle = Math.round(this.kaleidoscopeAngle());
  const offset = Math.floor(xSize * (angle % 360) / 360);
  if (power < 1) {
    return;
  }
  const tempCanvas = Util.createCanvasElement();
  tempCanvas.width = xSize;
  tempCanvas.height = ySize;
  const scratchData = tempCanvas.getContext("2d").getImageData(0, 0, xSize, ySize);
  Util.releaseCanvas(tempCanvas);
  ToPolar(imageData, scratchData, {
    polarCenterX: xSize / 2,
    polarCenterY: ySize / 2
  });
  let minSectionSize = xSize / Math.pow(2, power);
  while (minSectionSize <= 8) {
    minSectionSize = minSectionSize * 2;
    power -= 1;
  }
  minSectionSize = Math.ceil(minSectionSize);
  let sectionSize = minSectionSize;
  let xStart = 0, xEnd = sectionSize, xDelta = 1;
  if (offset + minSectionSize > xSize) {
    xStart = sectionSize;
    xEnd = 0;
    xDelta = -1;
  }
  for (y = 0; y < ySize; y += 1) {
    for (x2 = xStart; x2 !== xEnd; x2 += xDelta) {
      xoff = Math.round(x2 + offset) % xSize;
      srcPos = (xSize * y + xoff) * 4;
      r = scratchData.data[srcPos + 0];
      g = scratchData.data[srcPos + 1];
      b = scratchData.data[srcPos + 2];
      a = scratchData.data[srcPos + 3];
      dstPos = (xSize * y + x2) * 4;
      scratchData.data[dstPos + 0] = r;
      scratchData.data[dstPos + 1] = g;
      scratchData.data[dstPos + 2] = b;
      scratchData.data[dstPos + 3] = a;
    }
  }
  for (y = 0; y < ySize; y += 1) {
    sectionSize = Math.floor(minSectionSize);
    for (i = 0; i < power; i += 1) {
      for (x2 = 0; x2 < sectionSize + 1; x2 += 1) {
        srcPos = (xSize * y + x2) * 4;
        r = scratchData.data[srcPos + 0];
        g = scratchData.data[srcPos + 1];
        b = scratchData.data[srcPos + 2];
        a = scratchData.data[srcPos + 3];
        dstPos = (xSize * y + sectionSize * 2 - x2 - 1) * 4;
        scratchData.data[dstPos + 0] = r;
        scratchData.data[dstPos + 1] = g;
        scratchData.data[dstPos + 2] = b;
        scratchData.data[dstPos + 3] = a;
      }
      sectionSize *= 2;
    }
  }
  FromPolar(scratchData, imageData, {});
};
Factory.addGetterSetter(Node, "kaleidoscopePower", 2, getNumberValidator(), Factory.afterSetFilter);
Factory.addGetterSetter(Node, "kaleidoscopeAngle", 0, getNumberValidator(), Factory.afterSetFilter);
function pixelAt(idata, x2, y) {
  let idx = (y * idata.width + x2) * 4;
  const d = [];
  d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
  return d;
}
function rgbDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
}
function rgbMean(pTab) {
  const m2 = [0, 0, 0];
  for (let i = 0; i < pTab.length; i++) {
    m2[0] += pTab[i][0];
    m2[1] += pTab[i][1];
    m2[2] += pTab[i][2];
  }
  m2[0] /= pTab.length;
  m2[1] /= pTab.length;
  m2[2] /= pTab.length;
  return m2;
}
function backgroundMask(idata, threshold) {
  const rgbv_no = pixelAt(idata, 0, 0);
  const rgbv_ne = pixelAt(idata, idata.width - 1, 0);
  const rgbv_so = pixelAt(idata, 0, idata.height - 1);
  const rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);
  const thres = threshold || 10;
  if (rgbDistance(rgbv_no, rgbv_ne) < thres && rgbDistance(rgbv_ne, rgbv_se) < thres && rgbDistance(rgbv_se, rgbv_so) < thres && rgbDistance(rgbv_so, rgbv_no) < thres) {
    const mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);
    const mask = [];
    for (let i = 0; i < idata.width * idata.height; i++) {
      const d = rgbDistance(mean, [
        idata.data[i * 4],
        idata.data[i * 4 + 1],
        idata.data[i * 4 + 2]
      ]);
      mask[i] = d < thres ? 0 : 255;
    }
    return mask;
  }
}
function applyMask(idata, mask) {
  for (let i = 0; i < idata.width * idata.height; i++) {
    idata.data[4 * i + 3] = mask[i];
  }
}
function erodeMask(mask, sw, sh) {
  const weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side / 2);
  const maskResult = [];
  for (let y = 0; y < sh; y++) {
    for (let x2 = 0; x2 < sw; x2++) {
      const so = y * sw + x2;
      let a = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x2 + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            const srcOff = scy * sw + scx;
            const wt = weights[cy * side + cx];
            a += mask[srcOff] * wt;
          }
        }
      }
      maskResult[so] = a === 255 * 8 ? 255 : 0;
    }
  }
  return maskResult;
}
function dilateMask(mask, sw, sh) {
  const weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side / 2);
  const maskResult = [];
  for (let y = 0; y < sh; y++) {
    for (let x2 = 0; x2 < sw; x2++) {
      const so = y * sw + x2;
      let a = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x2 + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            const srcOff = scy * sw + scx;
            const wt = weights[cy * side + cx];
            a += mask[srcOff] * wt;
          }
        }
      }
      maskResult[so] = a >= 255 * 4 ? 255 : 0;
    }
  }
  return maskResult;
}
function smoothEdgeMask(mask, sw, sh) {
  const weights = [
    1 / 9,
    1 / 9,
    1 / 9,
    1 / 9,
    1 / 9,
    1 / 9,
    1 / 9,
    1 / 9,
    1 / 9
  ];
  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side / 2);
  const maskResult = [];
  for (let y = 0; y < sh; y++) {
    for (let x2 = 0; x2 < sw; x2++) {
      const so = y * sw + x2;
      let a = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x2 + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            const srcOff = scy * sw + scx;
            const wt = weights[cy * side + cx];
            a += mask[srcOff] * wt;
          }
        }
      }
      maskResult[so] = a;
    }
  }
  return maskResult;
}
const Mask = function(imageData) {
  const threshold = this.threshold();
  let mask = backgroundMask(imageData, threshold);
  if (mask) {
    mask = erodeMask(mask, imageData.width, imageData.height);
    mask = dilateMask(mask, imageData.width, imageData.height);
    mask = smoothEdgeMask(mask, imageData.width, imageData.height);
    applyMask(imageData, mask);
  }
  return imageData;
};
Factory.addGetterSetter(Node, "threshold", 0, getNumberValidator(), Factory.afterSetFilter);
const Noise = function(imageData) {
  const amount = this.noise() * 255, data = imageData.data, nPixels = data.length, half = amount / 2;
  for (let i = 0; i < nPixels; i += 4) {
    data[i + 0] += half - 2 * half * Math.random();
    data[i + 1] += half - 2 * half * Math.random();
    data[i + 2] += half - 2 * half * Math.random();
  }
};
Factory.addGetterSetter(Node, "noise", 0.2, getNumberValidator(), Factory.afterSetFilter);
const Pixelate = function(imageData) {
  let pixelSize = Math.ceil(this.pixelSize()), width = imageData.width, height = imageData.height, nBinsX = Math.ceil(width / pixelSize), nBinsY = Math.ceil(height / pixelSize), data = imageData.data;
  if (pixelSize <= 0) {
    Util.error("pixelSize value can not be <= 0");
    return;
  }
  for (let xBin = 0; xBin < nBinsX; xBin += 1) {
    for (let yBin = 0; yBin < nBinsY; yBin += 1) {
      let red = 0;
      let green = 0;
      let blue = 0;
      let alpha = 0;
      const xBinStart = xBin * pixelSize;
      const xBinEnd = xBinStart + pixelSize;
      const yBinStart = yBin * pixelSize;
      const yBinEnd = yBinStart + pixelSize;
      let pixelsInBin = 0;
      for (let x2 = xBinStart; x2 < xBinEnd; x2 += 1) {
        if (x2 >= width) {
          continue;
        }
        for (let y = yBinStart; y < yBinEnd; y += 1) {
          if (y >= height) {
            continue;
          }
          const i = (width * y + x2) * 4;
          red += data[i + 0];
          green += data[i + 1];
          blue += data[i + 2];
          alpha += data[i + 3];
          pixelsInBin += 1;
        }
      }
      red = red / pixelsInBin;
      green = green / pixelsInBin;
      blue = blue / pixelsInBin;
      alpha = alpha / pixelsInBin;
      for (let x2 = xBinStart; x2 < xBinEnd; x2 += 1) {
        if (x2 >= width) {
          continue;
        }
        for (let y = yBinStart; y < yBinEnd; y += 1) {
          if (y >= height) {
            continue;
          }
          const i = (width * y + x2) * 4;
          data[i + 0] = red;
          data[i + 1] = green;
          data[i + 2] = blue;
          data[i + 3] = alpha;
        }
      }
    }
  }
};
Factory.addGetterSetter(Node, "pixelSize", 8, getNumberValidator(), Factory.afterSetFilter);
const Posterize = function(imageData) {
  const levels = Math.round(this.levels() * 254) + 1, data = imageData.data, len = data.length, scale = 255 / levels;
  for (let i = 0; i < len; i += 1) {
    data[i] = Math.floor(data[i] / scale) * scale;
  }
};
Factory.addGetterSetter(Node, "levels", 0.5, getNumberValidator(), Factory.afterSetFilter);
const RGB = function(imageData) {
  const data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue();
  for (let i = 0; i < nPixels; i += 4) {
    const brightness = (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
    data[i] = brightness * red;
    data[i + 1] = brightness * green;
    data[i + 2] = brightness * blue;
    data[i + 3] = data[i + 3];
  }
};
Factory.addGetterSetter(Node, "red", 0, function(val) {
  this._filterUpToDate = false;
  if (val > 255) {
    return 255;
  } else if (val < 0) {
    return 0;
  } else {
    return Math.round(val);
  }
});
Factory.addGetterSetter(Node, "green", 0, function(val) {
  this._filterUpToDate = false;
  if (val > 255) {
    return 255;
  } else if (val < 0) {
    return 0;
  } else {
    return Math.round(val);
  }
});
Factory.addGetterSetter(Node, "blue", 0, RGBComponent, Factory.afterSetFilter);
const RGBA = function(imageData) {
  const data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), alpha = this.alpha();
  for (let i = 0; i < nPixels; i += 4) {
    const ia = 1 - alpha;
    data[i] = red * alpha + data[i] * ia;
    data[i + 1] = green * alpha + data[i + 1] * ia;
    data[i + 2] = blue * alpha + data[i + 2] * ia;
  }
};
Factory.addGetterSetter(Node, "red", 0, function(val) {
  this._filterUpToDate = false;
  if (val > 255) {
    return 255;
  } else if (val < 0) {
    return 0;
  } else {
    return Math.round(val);
  }
});
Factory.addGetterSetter(Node, "green", 0, function(val) {
  this._filterUpToDate = false;
  if (val > 255) {
    return 255;
  } else if (val < 0) {
    return 0;
  } else {
    return Math.round(val);
  }
});
Factory.addGetterSetter(Node, "blue", 0, RGBComponent, Factory.afterSetFilter);
Factory.addGetterSetter(Node, "alpha", 1, function(val) {
  this._filterUpToDate = false;
  if (val > 1) {
    return 1;
  } else if (val < 0) {
    return 0;
  } else {
    return val;
  }
});
const Sepia = function(imageData) {
  const data = imageData.data, nPixels = data.length;
  for (let i = 0; i < nPixels; i += 4) {
    const r = data[i + 0];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i + 0] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
};
const Solarize = function(imageData) {
  const threshold = 128;
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (L >= threshold) {
      d[i] = 255 - r;
      d[i + 1] = 255 - g;
      d[i + 2] = 255 - b;
    }
  }
  return imageData;
};
const Threshold = function(imageData) {
  const level = this.threshold() * 255, data = imageData.data, len = data.length;
  for (let i = 0; i < len; i += 1) {
    data[i] = data[i] < level ? 0 : 255;
  }
};
Factory.addGetterSetter(Node, "threshold", 0.5, getNumberValidator(), Factory.afterSetFilter);
Konva.Util._assign(Konva, {
  Arc,
  Arrow,
  Circle: Circle$1,
  Ellipse: Ellipse$1,
  Image,
  Label,
  Tag,
  Line: Line$1,
  Path,
  Rect: Rect$1,
  RegularPolygon,
  Ring,
  Sprite,
  Star,
  Text: Text$1,
  TextPath,
  Transformer: Transformer$1,
  Wedge,
  Filters: {
    Blur,
    Brightness,
    Brighten,
    Contrast,
    Emboss,
    Enhance,
    Grayscale,
    HSL,
    HSV,
    Invert,
    Kaleidoscope,
    Mask,
    Noise,
    Pixelate,
    Posterize,
    RGB,
    RGBA,
    Sepia,
    Solarize,
    Threshold
  }
});
const propsToSkip = {
  children: true,
  ref: true,
  key: true,
  style: true,
  forwardedRef: true,
  unstable_applyCache: true,
  unstable_applyDrawHitFromCache: true
};
let zIndexWarningShowed = false;
let dragWarningShowed = false;
const EVENTS_NAMESPACE = ".react-konva-event";
const DRAGGABLE_WARNING = `ReactKonva: You have a Konva node with draggable = true and position defined but no onDragMove or onDragEnd events are handled.
Position of a node will be changed during drag&drop, so you should update state of the react app as well.
Consider to add onDragMove or onDragEnd events.
For more info see: https://github.com/konvajs/react-konva/issues/256
`;
const Z_INDEX_WARNING = `ReactKonva: You are using "zIndex" attribute for a Konva node.
react-konva may get confused with ordering. Just define correct order of elements in your render function of a component.
For more info see: https://github.com/konvajs/react-konva/issues/194
`;
const EMPTY_PROPS = {};
function applyNodeProps(instance, props, oldProps = EMPTY_PROPS) {
  if (!zIndexWarningShowed && "zIndex" in props) {
    console.warn(Z_INDEX_WARNING);
    zIndexWarningShowed = true;
  }
  if (!dragWarningShowed && props.draggable) {
    var hasPosition = props.x !== void 0 || props.y !== void 0;
    var hasEvents = props.onDragEnd || props.onDragMove;
    if (hasPosition && !hasEvents) {
      console.warn(DRAGGABLE_WARNING);
      dragWarningShowed = true;
    }
  }
  for (var key in oldProps) {
    if (propsToSkip[key]) {
      continue;
    }
    var isEvent = key.slice(0, 2) === "on";
    var propChanged = oldProps[key] !== props[key];
    if (isEvent && propChanged) {
      var eventName = key.substr(2).toLowerCase();
      if (eventName.substr(0, 7) === "content") {
        eventName = "content" + eventName.substr(7, 1).toUpperCase() + eventName.substr(8);
      }
      instance.off(eventName, oldProps[key]);
    }
    var toRemove = !props.hasOwnProperty(key);
    if (toRemove) {
      instance.setAttr(key, void 0);
    }
  }
  var strictUpdate = props._useStrictMode;
  var updatedProps = {};
  var hasUpdates = false;
  const newEvents = {};
  for (var key in props) {
    if (propsToSkip[key]) {
      continue;
    }
    var isEvent = key.slice(0, 2) === "on";
    var toAdd = oldProps[key] !== props[key];
    if (isEvent && toAdd) {
      var eventName = key.substr(2).toLowerCase();
      if (eventName.substr(0, 7) === "content") {
        eventName = "content" + eventName.substr(7, 1).toUpperCase() + eventName.substr(8);
      }
      if (props[key]) {
        newEvents[eventName] = props[key];
      }
    }
    if (!isEvent && (props[key] !== oldProps[key] || strictUpdate && props[key] !== instance.getAttr(key))) {
      hasUpdates = true;
      updatedProps[key] = props[key];
    }
  }
  if (hasUpdates) {
    instance.setAttrs(updatedProps);
    updatePicture(instance);
  }
  for (var eventName in newEvents) {
    instance.off(eventName + EVENTS_NAMESPACE);
    instance.on(eventName + EVENTS_NAMESPACE, newEvents[eventName]);
  }
}
function updatePicture(node) {
  if (!Konva$1.autoDrawEnabled) {
    var drawingNode = node.getLayer() || node.getStage();
    drawingNode && drawingNode.batchDraw();
  }
}
const NO_CONTEXT = {};
const UPDATE_SIGNAL = {};
Konva.Node.prototype._applyProps = applyNodeProps;
let currentUpdatePriority = constantsExports.DefaultEventPriority;
function appendInitialChild(parentInstance, child) {
  if (typeof child === "string") {
    console.error(`Do not use plain text as child of Konva.Node. You are using text: ${child}`);
    return;
  }
  parentInstance.add(child);
  updatePicture(parentInstance);
}
function createInstance(type, props, internalInstanceHandle) {
  let NodeClass = Konva[type];
  if (!NodeClass) {
    console.error(`Konva has no node with the type ${type}. Group will be used instead. If you use minimal version of react-konva, just import required nodes into Konva: "import "konva/lib/shapes/${type}"  If you want to render DOM elements as part of canvas tree take a look into this demo: https://konvajs.github.io/docs/react/DOM_Portal.html`);
    NodeClass = Konva.Group;
  }
  const propsWithoutEvents = {};
  const propsWithOnlyEvents = {};
  for (var key in props) {
    if (key === "ref") {
      continue;
    }
    var isEvent = key.slice(0, 2) === "on";
    if (isEvent) {
      propsWithOnlyEvents[key] = props[key];
    } else {
      propsWithoutEvents[key] = props[key];
    }
  }
  const instance = new NodeClass(propsWithoutEvents);
  applyNodeProps(instance, propsWithOnlyEvents);
  return instance;
}
function createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
  console.error(`Text components are not supported for now in ReactKonva. Your text is: "${text}"`);
}
function finalizeInitialChildren(domElement, type, props) {
  return false;
}
function getPublicInstance(instance) {
  return instance;
}
function prepareForCommit() {
  return null;
}
function preparePortalMount() {
  return null;
}
function prepareUpdate(domElement, type, oldProps, newProps) {
  return UPDATE_SIGNAL;
}
function resetAfterCommit() {
}
function resetTextContent(domElement) {
}
function shouldDeprioritizeSubtree(type, props) {
  return false;
}
function getRootHostContext() {
  return NO_CONTEXT;
}
function getChildHostContext() {
  return NO_CONTEXT;
}
const scheduleTimeout = setTimeout;
const cancelTimeout = clearTimeout;
const supportsMicrotasks = true;
const scheduleMicrotask = (fn) => {
  fn();
};
const noTimeout = -1;
function shouldSetTextContent(type, props) {
  return false;
}
const isPrimaryRenderer = false;
const warnsIfNotActing = false;
const supportsMutation = true;
const supportsPersistence = false;
const supportsHydration = false;
function appendChild(parentInstance, child) {
  if (child.parent === parentInstance) {
    child.moveToTop();
  } else {
    parentInstance.add(child);
  }
  updatePicture(parentInstance);
}
function appendChildToContainer(parentInstance, child) {
  if (child.parent === parentInstance) {
    child.moveToTop();
  } else {
    parentInstance.add(child);
  }
  updatePicture(parentInstance);
}
function insertBefore(parentInstance, child, beforeChild) {
  child._remove();
  parentInstance.add(child);
  child.setZIndex(beforeChild.getZIndex());
  updatePicture(parentInstance);
}
function insertInContainerBefore(parentInstance, child, beforeChild) {
  insertBefore(parentInstance, child, beforeChild);
}
function removeChild(parentInstance, child) {
  child.destroy();
  child.off(EVENTS_NAMESPACE);
  updatePicture(parentInstance);
}
function removeChildFromContainer(parentInstance, child) {
  child.destroy();
  child.off(EVENTS_NAMESPACE);
  updatePicture(parentInstance);
}
function commitTextUpdate(textInstance, oldText, newText) {
  console.error(`Text components are not yet supported in ReactKonva. You text is: "${newText}"`);
}
function commitMount(instance, type, newProps) {
}
function commitUpdate(instance, type, oldProps, newProps) {
  applyNodeProps(instance, newProps, oldProps);
}
function hideInstance(instance) {
  instance.hide();
  updatePicture(instance);
}
function hideTextInstance(textInstance) {
}
function unhideInstance(instance, props) {
  if (props.visible == null || props.visible) {
    instance.show();
  }
}
function unhideTextInstance(textInstance, text) {
}
function clearContainer(container) {
}
function detachDeletedInstance() {
}
function getInstanceFromNode() {
  return null;
}
function beforeActiveInstanceBlur() {
}
function afterActiveInstanceBlur() {
}
function getCurrentEventPriority() {
  return constantsExports.DefaultEventPriority;
}
function prepareScopeUpdate() {
}
function getInstanceFromScope() {
  return null;
}
function setCurrentUpdatePriority(newPriority) {
  currentUpdatePriority = newPriority;
}
function getCurrentUpdatePriority() {
  return currentUpdatePriority;
}
function resolveUpdatePriority() {
  return constantsExports.DiscreteEventPriority;
}
function shouldAttemptEagerTransition() {
  return false;
}
function trackSchedulerEvent() {
}
function resolveEventType() {
  return null;
}
function resolveEventTimeStamp() {
  return -1.1;
}
function requestPostPaintCallback() {
}
function maySuspendCommit() {
  return false;
}
function preloadInstance() {
  return true;
}
function startSuspendingCommit() {
}
function suspendInstance() {
}
function waitForCommitToBeReady() {
  return null;
}
const NotPendingTransition = null;
const HostTransitionContext = /* @__PURE__ */ React.createContext(null);
function resetFormInstance() {
}
const HostConfig = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HostTransitionContext,
  NotPendingTransition,
  afterActiveInstanceBlur,
  appendChild,
  appendChildToContainer,
  appendInitialChild,
  beforeActiveInstanceBlur,
  cancelTimeout,
  clearContainer,
  commitMount,
  commitTextUpdate,
  commitUpdate,
  createInstance,
  createTextInstance,
  detachDeletedInstance,
  finalizeInitialChildren,
  getChildHostContext,
  getCurrentEventPriority,
  getCurrentUpdatePriority,
  getInstanceFromNode,
  getInstanceFromScope,
  getPublicInstance,
  getRootHostContext,
  hideInstance,
  hideTextInstance,
  idlePriority: schedulerExports.unstable_IdlePriority,
  insertBefore,
  insertInContainerBefore,
  isPrimaryRenderer,
  maySuspendCommit,
  noTimeout,
  now: schedulerExports.unstable_now,
  preloadInstance,
  prepareForCommit,
  preparePortalMount,
  prepareScopeUpdate,
  prepareUpdate,
  removeChild,
  removeChildFromContainer,
  requestPostPaintCallback,
  resetAfterCommit,
  resetFormInstance,
  resetTextContent,
  resolveEventTimeStamp,
  resolveEventType,
  resolveUpdatePriority,
  run: schedulerExports.unstable_runWithPriority,
  scheduleMicrotask,
  scheduleTimeout,
  setCurrentUpdatePriority,
  shouldAttemptEagerTransition,
  shouldDeprioritizeSubtree,
  shouldSetTextContent,
  startSuspendingCommit,
  supportsHydration,
  supportsMicrotasks,
  supportsMutation,
  supportsPersistence,
  suspendInstance,
  trackSchedulerEvent,
  unhideInstance,
  unhideTextInstance,
  waitForCommitToBeReady,
  warnsIfNotActing
}, Symbol.toStringTag, { value: "Module" }));
if (React.version.indexOf("19") === -1) {
  throw new Error("react-konva version 19 is only compatible with React 19. Make sure to have the last version of react-konva and react or downgrade react-konva to version 18.");
}
function usePrevious(value) {
  const ref = React.useRef({});
  React.useLayoutEffect(() => {
    ref.current = value;
  });
  React.useLayoutEffect(() => {
    return () => {
      ref.current = {};
    };
  }, []);
  return ref.current;
}
const useIsReactStrictMode = () => {
  const memoCount = React.useRef(0);
  React.useMemo(() => {
    memoCount.current++;
  }, []);
  return memoCount.current > 1;
};
const StageWrap = (props) => {
  const container = React.useRef(null);
  const stage = React.useRef(null);
  const fiberRef = React.useRef(null);
  const oldProps = usePrevious(props);
  const Bridge = x();
  const pendingDestroy = React.useRef(null);
  const _setRef = (stage2) => {
    const { forwardedRef } = props;
    if (!forwardedRef) {
      return;
    }
    if (typeof forwardedRef === "function") {
      forwardedRef(stage2);
    } else {
      forwardedRef.current = stage2;
    }
  };
  const isStrictMode = useIsReactStrictMode();
  const destroyStage = () => {
    _setRef(null);
    KonvaRenderer.flushSyncFromReconciler(() => {
      KonvaRenderer.updateContainer(null, fiberRef.current, null);
    });
    stage.current?.destroy();
    stage.current = null;
  };
  React.useLayoutEffect(() => {
    if (pendingDestroy.current) {
      clearTimeout(pendingDestroy.current);
      pendingDestroy.current = null;
    }
    if (stage.current) {
      _setRef(stage.current);
    } else {
      stage.current = new Konva.Stage({
        width: props.width,
        height: props.height,
        container: container.current
      });
      _setRef(stage.current);
      fiberRef.current = KonvaRenderer.createContainer(stage.current, constantsExports.ConcurrentRoot, null, false, null, "", console.error, console.error, console.error, null);
      KonvaRenderer.updateContainer(React.createElement(Bridge, {}, props.children), fiberRef.current, null, () => {
      });
    }
    return () => {
      if (isStrictMode) {
        pendingDestroy.current = setTimeout(destroyStage, 0);
      } else {
        destroyStage();
      }
    };
  }, []);
  React.useLayoutEffect(() => {
    _setRef(stage.current);
    applyNodeProps(stage.current, props, oldProps);
    KonvaRenderer.flushSyncFromReconciler(() => {
      KonvaRenderer.updateContainer(React.createElement(Bridge, {}, props.children), fiberRef.current, null);
    });
  });
  return React.createElement("div", {
    ref: container,
    id: props.id,
    accessKey: props.accessKey,
    className: props.className,
    role: props.role,
    style: props.style,
    tabIndex: props.tabIndex,
    title: props.title
  });
};
const Layer2 = "Layer";
const Group2 = "Group";
const Rect2 = "Rect";
const Circle2 = "Circle";
const Ellipse2 = "Ellipse";
const Line2 = "Line";
const Text2 = "Text";
const Transformer2 = "Transformer";
const KonvaRenderer = ReactFiberReconciler(HostConfig);
const Stage2 = React.forwardRef((props, ref) => {
  return React.createElement(m, {}, React.createElement(StageWrap, { ...props, forwardedRef: ref }));
});
const CATEGORY_PALETTE = {
  Fixtures: { fill: "rgba(245,158,11,0.15)", badge: "#f59e0b", text: "#78350f" },
  Chairs: { fill: "rgba(99,102,241,0.15)", badge: "#6366f1", text: "#312e81" },
  Bar_Chairs: { fill: "rgba(168,85,247,0.15)", badge: "#a855f7", text: "#4c1d95" },
  Tables: { fill: "rgba(6,182,212,0.15)", badge: "#06b6d4", text: "#164e63" },
  Round_Tables: { fill: "rgba(16,185,129,0.15)", badge: "#10b981", text: "#064e3b" },
  Info_Desks: { fill: "rgba(244,63,94,0.15)", badge: "#f43f5e", text: "#881337" },
  Electronics: { fill: "rgba(14,165,233,0.15)", badge: "#0ea5e9", text: "#075985" }
};
const getInitials = (label) => label.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
const LetterMarkAsset = ({ shapeProps, onSelect, onChange }) => {
  const label = shapeProps.assetName?.replace(/_/g, " ") || "Asset";
  const category = shapeProps.src?.split("/")[2] || "Fixtures";
  const palette = CATEGORY_PALETTE[category] || CATEGORY_PALETTE.Fixtures;
  const initials = getInitials(label);
  const w = shapeProps.width;
  const h = shapeProps.height;
  const badgeSize = Math.min(w, h) * 0.45;
  const badgeCX = w / 2;
  const badgeCY = h * 0.38;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Group2,
    {
      name: shapeProps.name,
      x: shapeProps.x,
      y: shapeProps.y,
      width: w,
      height: h,
      rotation: shapeProps.rotation,
      offsetX: w / 2,
      offsetY: h / 2,
      draggable: true,
      onClick: onSelect,
      onTap: onSelect,
      onDragEnd: (e) => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() }),
      onTransformEnd: (e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY)
        });
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Rect2,
          {
            x: 0,
            y: 0,
            width: w,
            height: h,
            fill: palette.fill,
            stroke: palette.badge,
            strokeWidth: 1.5,
            cornerRadius: 6
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Rect2,
          {
            x: badgeCX,
            y: badgeCY,
            width: badgeSize,
            height: badgeSize,
            offsetX: badgeSize / 2,
            offsetY: badgeSize / 2,
            fill: palette.badge,
            cornerRadius: badgeSize * 0.25,
            opacity: 0.9
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Text2,
          {
            x: badgeCX - badgeSize / 2,
            y: badgeCY - badgeSize / 2,
            text: initials,
            fontSize: badgeSize * 0.42,
            fontFamily: "Inter, sans-serif",
            fontStyle: "bold",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
            width: badgeSize,
            height: badgeSize
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Text2,
          {
            x: 0,
            y: h * 0.72,
            text: label,
            fontSize: Math.max(8, Math.min(10, w * 0.15)),
            fontFamily: "Inter, sans-serif",
            fontStyle: "bold",
            fill: palette.text,
            align: "center",
            width: w
          }
        )
      ]
    }
  );
};
const WallShape = ({ shapeProps, onSelect, onChange }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Rect2,
    {
      name: shapeProps.name,
      x: shapeProps.x,
      y: shapeProps.y,
      width: shapeProps.width,
      height: shapeProps.thickness || 10,
      rotation: shapeProps.rotation,
      fill: shapeProps.fill,
      opacity: shapeProps.opacity,
      offsetX: shapeProps.width / 2,
      offsetY: (shapeProps.thickness || 10) / 2,
      draggable: true,
      hitStrokeWidth: 20,
      onClick: onSelect,
      onTap: onSelect,
      onDragEnd: (e) => {
        onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
      },
      onTransform: (e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        node.setAttrs({
          width: Math.max(5, node.width() * scaleX),
          scaleX: 1
        });
      },
      onTransformEnd: (e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        node.scaleX(1);
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(5, node.width() * scaleX)
        });
      }
    }
  );
};
const VolumetricShape = ({ shapeProps, onSelect, onChange }) => {
  const w = shapeProps.width;
  const h = shapeProps.height;
  const color = shapeProps.volumetricColor || "#ec4899";
  const isPill = shapeProps.shape === "pill";
  const isCylinder = shapeProps.shape === "cylinder";
  const isElevated = (shapeProps.yOffset || 0) > 0.1;
  const fillColor = shapeProps.emissive ? color : color + "33";
  const strokeColor = color;
  const cornerRadius = isPill ? Math.min(w, h) / 2 : isCylinder ? Math.min(w, h) / 2 : 8;
  const [logoImg, setLogoImg] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (shapeProps.logoUrl) {
      const img = new window.Image();
      img.src = shapeProps.logoUrl;
      img.onload = () => {
        if (img.width > 0 && img.height > 0) setLogoImg(img);
      };
    } else {
      setLogoImg(null);
    }
  }, [shapeProps.logoUrl]);
  const commonProps = {
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (e) => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() }),
    onTransformEnd: (e) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
      onChange({
        ...shapeProps,
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        width: Math.max(10, node.width() * scaleX),
        height: Math.max(10, node.height() * scaleY)
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Group2,
    {
      name: shapeProps.name,
      x: shapeProps.x,
      y: shapeProps.y,
      width: w,
      height: h,
      rotation: shapeProps.rotation,
      offsetX: w / 2,
      offsetY: h / 2,
      ...commonProps,
      children: [
        isCylinder ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Ellipse2,
          {
            x: w / 2,
            y: h / 2,
            radiusX: w / 2,
            radiusY: h / 2,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: 2,
            dash: isElevated ? [6, 4] : [],
            opacity: shapeProps.emissive ? 0.9 : 0.7
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Rect2,
          {
            x: 0,
            y: 0,
            width: w,
            height: h,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: 2,
            cornerRadius,
            dash: isElevated ? [6, 4] : [],
            opacity: shapeProps.emissive ? 0.9 : 0.7
          }
        ),
        logoImg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Group2,
          {
            x: shapeProps.logoSide === "left" ? 2 : shapeProps.logoSide === "right" ? w - w * 0.2 - 2 : w * 0.1,
            y: shapeProps.logoSide === "back" ? 2 : shapeProps.logoSide === "front" ? h - h * 0.2 - 2 : h * 0.1,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Rect2,
                {
                  width: shapeProps.logoSide === "left" || shapeProps.logoSide === "right" ? w * 0.2 : shapeProps.logoSide === "top" || shapeProps.logoSide === "bottom" ? w * 0.8 : w * 0.8,
                  height: shapeProps.logoSide === "back" || shapeProps.logoSide === "front" ? h * 0.2 : shapeProps.logoSide === "top" || shapeProps.logoSide === "bottom" ? h * 0.8 : h * 0.8,
                  fill: "rgba(255,255,255,0.4)",
                  cornerRadius: 2,
                  stroke: color,
                  strokeWidth: 1
                }
              ),
              logoImg.width > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Rect2,
                {
                  width: shapeProps.logoSide === "left" || shapeProps.logoSide === "right" ? w * 0.2 : shapeProps.logoSide === "top" || shapeProps.logoSide === "bottom" ? w * 0.8 : w * 0.8,
                  height: shapeProps.logoSide === "back" || shapeProps.logoSide === "front" ? h * 0.2 : shapeProps.logoSide === "top" || shapeProps.logoSide === "bottom" ? h * 0.8 : h * 0.8,
                  fillPatternImage: logoImg,
                  fillPatternScaleX: (shapeProps.logoSide === "left" || shapeProps.logoSide === "right" ? w * 0.2 : w * 0.8) / logoImg.width,
                  fillPatternScaleY: (shapeProps.logoSide === "back" || shapeProps.logoSide === "front" ? h * 0.2 : h * 0.8) / logoImg.height,
                  fillPatternRepeat: "no-repeat",
                  opacity: 1,
                  listening: false
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Text2,
          {
            x: 0,
            y: h / 2 - 6,
            text: shapeProps.shape?.toUpperCase() || "VOL",
            fontSize: Math.max(7, Math.min(9, w * 0.1)),
            fontFamily: "Inter, sans-serif",
            fontStyle: "bold",
            fill: color,
            align: "center",
            width: w,
            opacity: 0.7
          }
        )
      ]
    }
  );
};
const Logo3DShape = ({ shapeProps, onSelect, onChange }) => {
  const w = shapeProps.width;
  const h = shapeProps.height;
  const [svgImg, setSvgImg] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (shapeProps.svgData) {
      const img = new window.Image();
      const blob = new Blob([shapeProps.svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      img.src = url;
      img.onload = () => setSvgImg(img);
      return () => URL.revokeObjectURL(url);
    } else {
      setSvgImg(null);
    }
  }, [shapeProps.svgData]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Group2,
    {
      name: shapeProps.name,
      x: shapeProps.x,
      y: shapeProps.y,
      width: w,
      height: h,
      rotation: shapeProps.rotation,
      offsetX: w / 2,
      offsetY: h / 2,
      draggable: true,
      onClick: onSelect,
      onTap: onSelect,
      onDragEnd: (e) => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() }),
      onTransformEnd: (e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY)
        });
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Rect2,
          {
            width: w,
            height: h,
            fill: "rgba(13, 122, 117, 0.08)",
            stroke: "#0d7a75",
            strokeWidth: 1.5,
            cornerRadius: 4
          }
        ),
        svgImg && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Rect2,
          {
            width: w * 0.9,
            height: h * 0.9,
            x: w * 0.05,
            y: h * 0.05,
            fillPatternImage: svgImg,
            fillPatternScaleX: w * 0.9 / svgImg.width,
            fillPatternScaleY: h * 0.9 / svgImg.height,
            fillPatternRepeat: "no-repeat"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Text2,
          {
            y: h + 5,
            text: "3D LOGO",
            fontSize: 10,
            fontFamily: "Inter, sans-serif",
            fontStyle: "bold",
            fill: "#0d7a75",
            align: "center",
            width: w
          }
        )
      ]
    }
  );
};
function Canvas2({ elements, setElements, selectedId, onSelect, boothConfig, gridVisible }) {
  const containerRef = reactExports.useRef(null);
  const transformerRef = reactExports.useRef(null);
  const [dimensions, setDimensions] = reactExports.useState({ width: 0, height: 0 });
  const [stageScale, setStageScale] = reactExports.useState(1);
  const [stagePos, setStagePos] = reactExports.useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = reactExports.useState(false);
  const [hasMounted, setHasMounted] = reactExports.useState(false);
  const PPM2 = 100;
  const gridSnapSize = 50;
  const fineSnapSize = 10;
  reactExports.useEffect(() => {
    setHasMounted(true);
    const handleKeyDown = (e) => {
      if (e.key === " " || e.key === "Control" || e.key === "Meta") setIsSpacePressed(true);
    };
    const handleKeyUp = (e) => {
      if (e.key === " " || e.key === "Control" || e.key === "Meta") setIsSpacePressed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  reactExports.useEffect(() => {
    if (!containerRef.current || !hasMounted) return;
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const h = containerRef.current.offsetHeight;
      setDimensions({ width: w, height: h });
      const boothPixelW = boothConfig.width * PPM2;
      const boothPixelH = boothConfig.depth * PPM2;
      const scaleX = w * 0.8 / boothPixelW;
      const scaleY = h * 0.8 / boothPixelH;
      const idealScale = Math.min(scaleX, scaleY, 1.5);
      setStageScale(idealScale);
      setStagePos({
        x: (w - boothPixelW * idealScale) / 2,
        y: (h - boothPixelH * idealScale) / 2
      });
    };
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(containerRef.current);
    updateDimensions();
    return () => observer.disconnect();
  }, [hasMounted, boothConfig]);
  reactExports.useEffect(() => {
    if (selectedId && transformerRef.current) {
      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne(`.${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
      } else {
        transformerRef.current.nodes([]);
      }
      transformerRef.current.getLayer().batchDraw();
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId, elements]);
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    });
  };
  const handleDragEndAndSnap = (index, newProps) => {
    const snapToGrid = (pos) => {
      if (!gridVisible) return pos;
      return Math.round(pos / fineSnapSize) * fineSnapSize;
    };
    const snappedProps = {
      ...newProps,
      x: snapToGrid(newProps.x),
      y: snapToGrid(newProps.y)
    };
    const newElements = elements.slice();
    newElements[index] = snappedProps;
    setElements(newElements);
  };
  const boothW = boothConfig.width * PPM2;
  const boothD = boothConfig.depth * PPM2;
  const boundaryLines = [
    { dir: "north", points: [0, 0, boothW, 0], isOpen: !boothConfig.walls.north, labelX: boothW / 2, labelY: -20, dim: boothConfig.width },
    { dir: "east", points: [boothW, 0, boothW, boothD], isOpen: !boothConfig.walls.east, labelX: boothW + 20, labelY: boothD / 2, dim: boothConfig.depth, rotate: 90 },
    { dir: "south", points: [boothW, boothD, 0, boothD], isOpen: !boothConfig.walls.south, labelX: boothW / 2, labelY: boothD + 20, dim: boothConfig.width },
    { dir: "west", points: [0, boothD, 0, 0], isOpen: !boothConfig.walls.west, labelX: -20, labelY: boothD / 2, dim: boothConfig.depth, rotate: -90 }
  ];
  const gridLines = [];
  if (gridVisible) {
    const vSize = 4e3;
    const subStep = 20;
    for (let i = -1e3; i <= vSize / subStep; i++) {
      const isMajor = i * subStep % gridSnapSize === 0;
      gridLines.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Line2,
          {
            points: [i * subStep, -1e3 * subStep, i * subStep, vSize],
            stroke: isMajor ? "rgba(23, 58, 64, 0.3)" : "rgba(23, 58, 64, 0.15)",
            strokeWidth: isMajor ? 1.5 : 1
          },
          `v-${i}`
        )
      );
    }
    for (let j = -1e3; j <= vSize / subStep; j++) {
      const isMajor = j * subStep % gridSnapSize === 0;
      gridLines.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Line2,
          {
            points: [-1e3 * subStep, j * subStep, vSize, j * subStep],
            stroke: isMajor ? "rgba(23, 58, 64, 0.3)" : "rgba(23, 58, 64, 0.15)",
            strokeWidth: isMajor ? 1.5 : 1
          },
          `h-${j}`
        )
      );
    }
  }
  const selectedElement = elements.find((el) => el.id === selectedId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "flex-1 bg-[var(--bg-base)] overflow-hidden relative cursor-crosshair", children: [
    hasMounted && dimensions.width > 0 && dimensions.height > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Stage2,
      {
        width: dimensions.width,
        height: dimensions.height,
        scaleX: stageScale,
        scaleY: stageScale,
        x: stagePos.x,
        y: stagePos.y,
        draggable: isSpacePressed,
        onWheel: handleWheel,
        onDragEnd: (e) => {
          if (e.target === e.target.getStage()) {
            setStagePos({ x: e.target.x(), y: e.target.y() });
          }
        },
        onMouseDown: (e) => {
          if (e.target === e.target.getStage() || e.target.name() === "floorBg") {
            onSelect(null);
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layer2, { children: [
          gridLines,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Group2, { name: "boothBoundaries", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Rect2,
              {
                name: "floorBg",
                x: 0,
                y: 0,
                width: boothW,
                height: boothD,
                fill: "rgba(255,255,255,0.3)",
                shadowColor: "rgba(0,0,0,0.1)",
                shadowBlur: 40
              }
            ),
            boundaryLines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
              line.isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Line2,
                {
                  points: line.points,
                  stroke: "rgba(23,58,64,0.3)",
                  strokeWidth: 2,
                  dash: [10, 10]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Text2,
                {
                  x: line.labelX,
                  y: line.labelY,
                  text: `${line.dim}m`,
                  fontSize: 16,
                  fontFamily: "monospace",
                  fill: "var(--sea-ink)",
                  fontStyle: "bold",
                  offset: { x: 20, y: 10 },
                  rotation: line.rotate || 0,
                  opacity: 0.6
                }
              )
            ] }, line.dir))
          ] }),
          elements.map((obj, i) => {
            if (obj.type === "wall") {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                WallShape,
                {
                  shapeProps: { ...obj, name: obj.id },
                  onSelect: () => onSelect(obj.id),
                  onChange: (newProps) => handleDragEndAndSnap(i, newProps)
                },
                obj.id
              );
            }
            if (obj.type === "asset") {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                LetterMarkAsset,
                {
                  shapeProps: { ...obj, name: obj.id },
                  onSelect: () => onSelect(obj.id),
                  onChange: (newProps) => handleDragEndAndSnap(i, newProps)
                },
                obj.id
              );
            }
            if (obj.type === "volumetric") {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                VolumetricShape,
                {
                  shapeProps: { ...obj, name: obj.id },
                  onSelect: () => onSelect(obj.id),
                  onChange: (newProps) => handleDragEndAndSnap(i, newProps)
                },
                obj.id
              );
            }
            if (obj.type === "3d_logo") {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Logo3DShape,
                {
                  shapeProps: { ...obj, name: obj.id },
                  onSelect: () => onSelect(obj.id),
                  onChange: (newProps) => handleDragEndAndSnap(i, newProps)
                },
                obj.id
              );
            }
            return null;
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Transformer2,
            {
              ref: transformerRef,
              boundBoxFunc: (oldBox, newBox) => {
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox;
                return newBox;
              },
              enabledAnchors: selectedElement?.type === "wall" ? ["middle-left", "middle-right"] : ["top-left", "top-right", "bottom-left", "bottom-right", "middle-left", "middle-right", "top-center", "bottom-center"],
              keepRatio: selectedElement?.type === "asset",
              padding: selectedElement?.type === "wall" ? 2 : 6,
              anchorSize: selectedElement?.type === "wall" ? 8 : 12,
              anchorCornerRadius: 3,
              borderStroke: "#0d7a75",
              borderStrokeWidth: 2,
              anchorStroke: "#0d7a75",
              anchorFill: "white",
              anchorStrokeWidth: 2,
              rotateEnabled: true,
              rotateAnchorOffset: 40,
              rotateAnchorCursor: "crosshair"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-4 z-10 flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1.5 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider shadow-sm flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Zoom: ",
        Math.round(stageScale * 100),
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3 bg-[var(--line)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pan: Space+Drag" })
    ] }) })
  ] });
}
const WallElements = React.memo(({ elements, selectedId, onSelect, onDragMove, onDragEnd, onTransform, onTransformEnd }) => {
  const ELEMENT_TYPES = {
    door: { color: "rgba(139,100,60,0.35)", stroke: "#7c5c3a" },
    window: { color: "rgba(100,200,255,0.35)", stroke: "#00BFFF" },
    shelf: { color: "rgba(180,120,60,0.5)", stroke: "#a0522d" },
    banner: { color: "rgba(80,120,255,0.35)", stroke: "#4a6aff" },
    frame: { color: "rgba(255,255,255,0.4)", stroke: "#444444" },
    light: { color: "rgba(255,255,0,0.4)", stroke: "#FFD700", model: "wall_light_1" }
  };
  const [images, setImages] = reactExports.useState({});
  reactExports.useEffect(() => {
    elements.forEach((el) => {
      if ((el.type === "banner" || el.type === "frame") && el.url && !images[el.url]) {
        const img = new window.Image();
        img.src = el.url;
        img.onload = () => {
          if (img.width > 0 && img.height > 0) {
            setImages((prev) => ({ ...prev, [el.url]: img }));
          }
        };
      }
    });
  }, [elements]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: elements.map((el, i) => {
    const cfg = ELEMENT_TYPES[el.type] || ELEMENT_TYPES.window;
    const isSelected = selectedId === el.id;
    const hasImage = (el.type === "banner" || el.type === "frame") && el.url && images[el.url];
    const patternImg = hasImage ? images[el.url] : void 0;
    if (el.type === "frame" && el.shape === "circle") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Circle2,
        {
          id: "el-" + el.id,
          x: el.x + el.width / 2,
          y: el.y + el.height / 2,
          radius: Math.min(el.width, el.height) / 2,
          fill: hasImage ? void 0 : cfg.color,
          fillPatternImage: patternImg,
          fillPatternScaleX: patternImg ? el.width / patternImg.width : void 0,
          fillPatternScaleY: patternImg ? el.height / patternImg.height : void 0,
          fillPatternOffsetX: patternImg ? patternImg.width / 2 : void 0,
          fillPatternOffsetY: patternImg ? patternImg.height / 2 : void 0,
          stroke: isSelected ? "#0d7a75" : cfg.stroke,
          strokeWidth: isSelected ? 2.5 : 1.5,
          draggable: true,
          shadowEnabled: isSelected,
          shadowColor: "#0d7a75",
          shadowBlur: 10,
          shadowOpacity: 0.4,
          onMouseDown: () => onSelect(el.id),
          onClick: () => onSelect(el.id),
          onTap: () => onSelect(el.id),
          onDragMove: (e) => {
            const nx = e.target.x() - el.width / 2;
            const ny = e.target.y() - el.height / 2;
            onDragMove(i, { target: { x: () => nx, y: () => ny } });
          },
          onDragEnd: (e) => {
            const nx = e.target.x() - el.width / 2;
            const ny = e.target.y() - el.height / 2;
            onDragEnd(i, { target: { x: () => nx, y: () => ny } });
          },
          onTransform: (e) => {
            const node = e.target;
            const scale = node.scaleX();
            node.scaleX(1);
            node.scaleY(1);
            const newR = node.radius() * scale;
            node.radius(newR);
            onTransform(i, e);
          },
          onTransformEnd
        },
        el.id
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Rect2,
      {
        id: "el-" + el.id,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        fill: hasImage ? void 0 : cfg.color,
        fillPatternImage: patternImg,
        fillPatternScaleX: patternImg ? el.width / patternImg.width : void 0,
        fillPatternScaleY: patternImg ? el.height / patternImg.height : void 0,
        stroke: isSelected ? "#0d7a75" : cfg.stroke,
        strokeWidth: isSelected ? 2.5 : 1.5,
        draggable: true,
        shadowEnabled: isSelected,
        shadowColor: "#0d7a75",
        shadowBlur: 10,
        shadowOpacity: 0.4,
        onMouseDown: () => onSelect(el.id),
        onClick: () => onSelect(el.id),
        onTap: () => onSelect(el.id),
        onDragMove: (e) => onDragMove(i, e),
        onDragEnd: (e) => onDragEnd(i, e),
        onTransform: (e) => onTransform(i, e),
        onTransformEnd: (e) => onTransformEnd(i, e)
      },
      el.id
    );
  }) });
});
function WallCanvas({ wall, onSave, onClose }) {
  const [elements, setElements] = reactExports.useState(wall.wallElements || []);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [dragLabel, setDragLabel] = reactExports.useState(null);
  const containerRef = reactExports.useRef(null);
  const transformerRef = reactExports.useRef(null);
  const [dimensions, setDimensions] = reactExports.useState({ width: 0, height: 0 });
  const [stageScale, setStageScale] = reactExports.useState(1);
  const [stagePos, setStagePos] = reactExports.useState({ x: 0, y: 0 });
  const PPM2 = 100;
  const SNAP = 10;
  const wallWidth = wall.width;
  const wallHeight = 2.5 * PPM2;
  const ELEMENT_TYPES = {
    door: { label: "Door", emoji: "🚪", defaultW: 0.9, defaultH: 2, defaultY: "floor" },
    window: { label: "Window", emoji: "🪟", defaultW: 1.2, defaultH: 1, defaultY: "mid" },
    shelf: { label: "Shelf", emoji: "📦", defaultW: 1, defaultH: 0.1, defaultY: "mid" },
    banner: { label: "Banner", emoji: "🖼️", defaultW: 1.5, defaultH: 0.8, defaultY: "top" },
    frame: { label: "Frame", emoji: "🖼️", defaultW: 0.6, defaultH: 0.6, defaultY: "mid", shape: "square" },
    light: { label: "Light", emoji: "💡", defaultW: 0.2, defaultH: 0.2, defaultY: "top" }
  };
  reactExports.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const h = containerRef.current.offsetHeight;
      setDimensions({ width: w, height: h });
      const scaleX = w * 0.85 / wallWidth;
      const scaleY = h * 0.85 / wallHeight;
      const idealScale = Math.min(scaleX, scaleY, 2.5);
      setStageScale(idealScale);
      setStagePos({
        x: (w - wallWidth * idealScale) / 2,
        y: (h - wallHeight * idealScale) / 2
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [wallWidth, wallHeight]);
  reactExports.useEffect(() => {
    if (!transformerRef.current) return;
    if (selectedId) {
      const stage = transformerRef.current.getStage();
      const node = stage.findOne("#el-" + selectedId);
      if (node) {
        transformerRef.current.nodes([node]);
      } else {
        transformerRef.current.nodes([]);
      }
    } else {
      transformerRef.current.nodes([]);
    }
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, elements]);
  const snap = (v) => Math.round(v / SNAP) * SNAP;
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const handleAdd = (type) => {
    const cfg = ELEMENT_TYPES[type];
    const w = cfg.defaultW * PPM2;
    const h = cfg.defaultH * PPM2;
    let y = wallHeight / 2 - h / 2;
    if (cfg.defaultY === "floor") y = wallHeight - h;
    if (cfg.defaultY === "top") y = 0.1 * PPM2;
    setElements((prev) => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: snap(wallWidth / 2 - w / 2),
      y: snap(y),
      width: w,
      height: h,
      shape: cfg.shape || "square",
      model: cfg.model || void 0
    }]);
  };
  const handleDragMove = (index, e) => {
    const el = elements[index];
    const nx = clamp(snap(e.target.x()), 0, wallWidth - el.width);
    const ny = clamp(snap(e.target.y()), 0, wallHeight - el.height);
    e.target.x(nx);
    e.target.y(ny);
    setDragLabel({ id: el.id, x: nx, y: ny, width: el.width, height: el.height });
  };
  const handleDragEnd = (index, e) => {
    const el = elements[index];
    const nx = clamp(snap(e.target.x()), 0, wallWidth - el.width);
    const ny = clamp(snap(e.target.y()), 0, wallHeight - el.height);
    const newElements = [...elements];
    newElements[index] = { ...el, x: nx, y: ny };
    setElements(newElements);
    setDragLabel(null);
  };
  const handleTransform = (index, e) => {
    const node = e.target;
    const el = elements[index];
    setDragLabel({
      id: el.id,
      x: node.x(),
      y: node.y(),
      width: node.width() * node.scaleX(),
      height: node.height() * node.scaleY()
    });
  };
  const handleTransformEnd = (index, e) => {
    const node = e.target;
    const el = elements[index];
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    const newW = Math.max(10, snap(node.width() * scaleX));
    const newH = Math.max(10, snap(node.height() * scaleY));
    const nx = clamp(snap(node.x()), 0, wallWidth - newW);
    const ny = clamp(snap(node.y()), 0, wallHeight - newH);
    const newElements = [...elements];
    newElements[index] = { ...el, x: nx, y: ny, width: newW, height: newH };
    setElements(newElements);
    setDragLabel(null);
  };
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId) {
        if (document.activeElement?.tagName === "INPUT") return;
        e.preventDefault();
        e.stopPropagation();
        setElements((prev) => prev.filter((el) => el.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);
  const gridLines = reactExports.useMemo(() => {
    const lines = [];
    const subStep = SNAP;
    for (let i = 0; i <= Math.ceil(wallWidth / subStep); i++) {
      const isMajor = i * subStep % (PPM2 / 2) === 0;
      lines.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Line2,
          {
            points: [i * subStep, 0, i * subStep, wallHeight],
            stroke: isMajor ? "rgba(100,120,140,0.25)" : "rgba(100,120,140,0.1)",
            strokeWidth: isMajor ? 1 : 0.5,
            listening: false
          },
          `v-${i}`
        )
      );
    }
    for (let j = 0; j <= Math.ceil(wallHeight / subStep); j++) {
      const isMajor = j * subStep % (PPM2 / 2) === 0;
      lines.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Line2,
          {
            points: [0, j * subStep, wallWidth, j * subStep],
            stroke: isMajor ? "rgba(100,120,140,0.25)" : "rgba(100,120,140,0.1)",
            strokeWidth: isMajor ? 1 : 0.5,
            listening: false
          },
          `h-${j}`
        )
      );
    }
    return lines;
  }, [wallWidth, wallHeight]);
  const selectedEl = elements.find((el) => el.id === selectedId) || null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-50 bg-[var(--bg-base)] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-14 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center justify-between px-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-[var(--sea-ink)]", children: "Wall Elevation Editor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono bg-[var(--sand)] border border-[var(--line)] px-2 py-1 rounded text-[var(--sea-ink-soft)]", children: [
          (wallWidth / PPM2).toFixed(1),
          "m × 2.5m"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSave(elements), className: "px-4 py-1.5 rounded-lg bg-[var(--lagoon-deep)] text-white text-xs font-bold flex items-center gap-2 hover:bg-[var(--palm)] transition shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
          " Save Wall"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-[var(--sea-ink-soft)] hover:bg-gray-200 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-52 shrink-0 border-r border-[var(--line)] bg-[var(--surface-strong)] flex flex-col p-3 gap-2 overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest mb-1", children: "Add to Wall" }),
        Object.entries(ELEMENT_TYPES).map(([type, cfg]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleAdd(type), className: "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--sand)] border border-[var(--line)] text-left hover:border-[var(--lagoon)] hover:bg-[var(--chip-bg)] transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl leading-none", children: cfg.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[var(--sea-ink)]", children: cfg.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-[var(--sea-ink-soft)]", children: [
              cfg.defaultW,
              "m × ",
              cfg.defaultH,
              "m"
            ] })
          ] })
        ] }, type)),
        selectedEl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-[var(--line)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest mb-2", children: [
            "Selected: ",
            ELEMENT_TYPES[selectedEl.type]?.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            [
              { label: "X pos (m)", key: "x" },
              { label: "Y pos (m)", key: "y" },
              { label: "Width (m)", key: "width" },
              { label: "Height (m)", key: "height" }
            ].map(({ label, key }) => {
              const isDragging = dragLabel?.id === selectedId;
              const val = isDragging ? dragLabel[key] : selectedEl[key] || 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `prop-${key}`, className: "text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-0.5", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: `prop-${key}`,
                    name: key,
                    type: "number",
                    step: "0.05",
                    value: (val / PPM2).toFixed(2),
                    onChange: (e) => {
                      const v = snap(parseFloat(e.target.value) * PPM2 || 0);
                      setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, [key]: v } : el));
                    },
                    className: "w-full bg-[var(--bg-base)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded px-2 py-1 text-xs text-[var(--sea-ink)] outline-none"
                  }
                )
              ] }, key);
            }),
            selectedEl.type === "light" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1.5", children: "Fixture Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: [
                  { val: "wall_light_3", label: "Tube", icon: "▬" },
                  { val: "wall_light_1", label: "Square", icon: "■" },
                  { val: "wall_light_2", label: "Circle", icon: "●" }
                ].map((opt) => {
                  const isActive = (selectedEl.model || "wall_light_1") === opt.val;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, model: opt.val } : el)),
                      className: `flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg border text-[10px] font-bold transition-all ${isActive ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-md scale-105" : "bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)] hover:border-[var(--lagoon)]"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: opt.icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: opt.label })
                      ]
                    },
                    opt.val
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1.5", children: "Light Color" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-1.5", children: [
                  { name: "Warm White", hex: "#fff8e7" },
                  { name: "Gold", hex: "#ffaa00" },
                  { name: "Amber", hex: "#ff6600" },
                  { name: "Cool White", hex: "#e8f4ff" },
                  { name: "Sky Blue", hex: "#00aaff" },
                  { name: "Cyber Blue", hex: "#00eeff" },
                  { name: "Mint", hex: "#00ffcc" },
                  { name: "Lime", hex: "#aaff00" },
                  { name: "Rose", hex: "#ff6699" },
                  { name: "Magenta", hex: "#ff00ff" },
                  { name: "Violet", hex: "#9966ff" },
                  { name: "Red", hex: "#ff2222" }
                ].map((c) => {
                  const isActive = (selectedEl.lightColor || "#fff8e7") === c.hex;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, lightColor: c.hex } : el)),
                      title: c.name,
                      className: `aspect-square rounded-md border-2 transition-all ${isActive ? "border-[var(--brand)] scale-110 shadow-md" : "border-transparent hover:scale-105"}`,
                      style: { backgroundColor: c.hex }
                    },
                    c.hex
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "light-intensity", className: "text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1", children: [
                  "Luminosity ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-normal opacity-60", children: [
                    "(",
                    (selectedEl.intensity || 1.2).toFixed(1),
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "light-intensity",
                    name: "light-intensity",
                    type: "range",
                    min: "0.1",
                    max: "5",
                    step: "0.1",
                    value: selectedEl.intensity || 1.2,
                    onChange: (e) => setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, intensity: parseFloat(e.target.value) } : el)),
                    className: "w-full h-1.5 rounded-full appearance-none cursor-pointer",
                    style: { accentColor: selectedEl.lightColor || "#ffaa00" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[9px] text-[var(--sea-ink-soft)] mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dim" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Bright" })
                ] })
              ] })
            ] }),
            selectedEl.type === "frame" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1", children: "Frame Shape" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, shape: "square" } : el)),
                    className: `flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition ${selectedEl.shape === "square" ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)]"}`,
                    children: "Square"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, shape: "circle" } : el)),
                    className: `flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition ${selectedEl.shape === "circle" ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "bg-[var(--sand)] text-[var(--sea-ink)] border-[var(--line)]"}`,
                    children: "Circle"
                  }
                )
              ] })
            ] }),
            (selectedEl.type === "banner" || selectedEl.type === "frame") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-[var(--sea-ink-soft)] font-bold block mb-1", children: "Upload Graphic" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                selectedEl.url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group rounded-lg overflow-hidden border border-[var(--line)] h-20 bg-black/5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedEl.url, className: "w-full h-full object-contain", alt: "Banner Preview" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, url: null } : el)),
                      className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold",
                      children: "Remove Image"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer w-full py-2 rounded-lg bg-[var(--sand)] border border-[var(--line)] text-[10px] font-bold text-[var(--sea-ink)] text-center hover:bg-[var(--chip-bg)] hover:border-[var(--lagoon)] transition", children: [
                  selectedEl.url ? "Replace Image" : "Upload Image",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "file",
                      accept: "image/*",
                      className: "hidden",
                      onChange: (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setElements((prev) => prev.map((el) => el.id === selectedId ? { ...el, url: re.target?.result } : el));
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setElements((prev) => prev.filter((el) => el.id !== selectedId));
              setSelectedId(null);
            }, className: "w-full mt-1 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 text-xs font-bold hover:bg-red-100 transition", children: "Delete Element" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-3 border-t border-[var(--line)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-[var(--sea-ink-soft)] leading-relaxed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold block mb-0.5", children: "Tips" }),
          "Drag to move · Handles to resize · Snap: 0.1m · Del to remove"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "flex-1 relative bg-[#eceff4] overflow-hidden", children: [
        dimensions.width > 0 && dimensions.height > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Stage2, { width: dimensions.width, height: dimensions.height, scaleX: stageScale, scaleY: stageScale, x: stagePos.x, y: stagePos.y, onMouseDown: (e) => {
          if (e.target === e.target.getStage() || e.target.name() === "wallBg") setSelectedId(null);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layer2, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rect2, { name: "wallBg", x: 0, y: 0, width: wallWidth, height: wallHeight, fill: "#f8f9fb", stroke: "#94a3b8", strokeWidth: 2, shadowColor: "rgba(0,0,0,0.15)", shadowBlur: 24, shadowOffsetY: 6 }),
          gridLines,
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line2, { points: [0, 0, wallWidth, 0], stroke: "#64748b", strokeWidth: 3, listening: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text2, { x: 5, y: 4, text: "▼ CEILING", fill: "#94a3b8", fontSize: 9, fontFamily: "monospace", listening: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line2, { points: [0, wallHeight, wallWidth, wallHeight], stroke: "#64748b", strokeWidth: 3, listening: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text2, { x: 5, y: wallHeight - 14, text: "▲ FLOOR", fill: "#94a3b8", fontSize: 9, fontFamily: "monospace", listening: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            WallElements,
            {
              elements,
              selectedId,
              onSelect: setSelectedId,
              onDragMove: handleDragMove,
              onDragEnd: handleDragEnd,
              onTransform: handleTransform,
              onTransformEnd: handleTransformEnd
            }
          ),
          elements.map((el) => {
            const isSelected = selectedId === el.id;
            const isActive = dragLabel?.id === el.id;
            const displayX = isActive ? dragLabel.x : el.x;
            const displayY = isActive ? dragLabel.y : el.y;
            const displayW = isActive ? dragLabel.width : el.width;
            const displayH = isActive ? dragLabel.height : el.height;
            const cfg = ELEMENT_TYPES[el.type] || {};
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Group2, { listening: false, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text2, { x: displayX + 4, y: displayY + 4, text: `${cfg.emoji || ""} ${cfg.label || ""}`, fontSize: 10, fontFamily: "monospace", fill: isSelected ? "#0d7a75" : "#475569", scaleX: 1 / stageScale, scaleY: 1 / stageScale }),
              (isSelected || isActive) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Group2, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Rect2,
                  {
                    x: displayX + displayW / 2 - 25,
                    y: displayY - 20,
                    width: 50,
                    height: 14,
                    fill: "rgba(255,255,255,0.85)",
                    cornerRadius: 4
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text2, { x: displayX + displayW / 2, y: displayY - 16, text: `${(displayW / PPM2).toFixed(2)}m`, fontSize: 10, fontFamily: "monospace", fontStyle: "bold", fill: "#0d7a75", offsetX: (displayW / PPM2).toFixed(2).length * 3.2 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Rect2,
                  {
                    x: displayX + displayW + 1,
                    y: displayY + displayH / 2 - 25,
                    width: 14,
                    height: 50,
                    fill: "rgba(255,255,255,0.85)",
                    cornerRadius: 4
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text2, { x: displayX + displayW + 5, y: displayY + displayH / 2, text: `${(displayH / PPM2).toFixed(2)}m`, fontSize: 10, fontFamily: "monospace", fontStyle: "bold", fill: "#0d7a75", rotation: 90, offsetY: 4 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text2, { x: displayX, y: displayY + displayH + 5, text: `x:${(displayX / PPM2).toFixed(2)}m  ${((wallHeight - displayY - displayH) / PPM2).toFixed(2)}m from floor`, fontSize: 9, fontFamily: "monospace", fill: "#64748b" })
              ] })
            ] }, "overlay-" + el.id);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Transformer2,
            {
              ref: transformerRef,
              keepRatio: false,
              rotateEnabled: false,
              padding: 4,
              anchorSize: 10,
              anchorCornerRadius: 2,
              borderStroke: "#0d7a75",
              anchorStroke: "#0d7a75",
              anchorFill: "white",
              boundBoxFunc: (oldBox, newBox) => {
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox;
                return newBox;
              }
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-white/80 border border-[var(--line)] text-[10px] text-[var(--sea-ink-soft)] font-mono shadow-sm pointer-events-none select-none", children: [
          "Zoom ",
          Math.round(stageScale * 100),
          "% · Grid 0.1m"
        ] })
      ] })
    ] })
  ] });
}
const FLOOR_MATERIALS = [
  { id: "hardwood", label: "Hardwood", color: "#7a4f2e", desc: "Warm oak planks" },
  { id: "marble", label: "Marble", color: "#d8d0c8", desc: "Polished white veined" },
  { id: "tile", label: "Tile", color: "#b0a898", desc: "Classic square tile" },
  { id: "carpet", label: "Carpet", color: "#2e4050", desc: "Soft dark carpet" },
  { id: "concrete", label: "Concrete", color: "#898989", desc: "Industrial grey" }
];
const WALL_MATERIALS_LIST = [
  { value: "Solid Wall", label: "Solid Wall" },
  { value: "Wood", label: "Wood Panel" },
  { value: "Brick", label: "Brick" },
  { value: "Glass Wall", label: "Glass" }
];
function Properties({
  selectedElement,
  onUpdate,
  onDelete,
  onEditElevation,
  boothConfig,
  onBoothConfigUpdate
}) {
  const handleMaterialChange = (material) => {
    let fill = "#333333", opacity = 1;
    if (material === "Glass Wall") {
      fill = "lightblue";
      opacity = 0.5;
    } else if (material === "Wood") {
      fill = "#8B4513";
    } else if (material === "Brick") {
      fill = "#9a4a30";
    }
    onUpdate(selectedElement.id, { material, fill, opacity });
  };
  const floorType = boothConfig?.floorType || "hardwood";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-80 h-full border-l border-[var(--line)] bg-[var(--surface-strong)] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-[var(--line)] flex justify-between items-center bg-[var(--header-bg)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-[var(--sea-ink)] flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-[var(--lagoon-deep)]" }),
        "Properties"
      ] }),
      selectedElement && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onDelete,
          className: "text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition",
          title: "Delete (Backspace)",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-6 pb-32", children: [
      selectedElement ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1", children: "Type / ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-[var(--sand)] border-transparent border rounded-lg px-3 py-2 text-[10px] font-mono text-[var(--sea-ink)] select-all", children: [
            selectedElement.type.toUpperCase(),
            " / ",
            selectedElement.id.slice(0, 8)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "pos-x", className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1", children: "Pos X (m)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "pos-x",
                name: "pos-x",
                type: "number",
                step: "0.05",
                value: ((selectedElement.x || 0) / 100).toFixed(2),
                onChange: (e) => onUpdate(selectedElement.id, { x: parseFloat(e.target.value) * 100 || 0 }),
                className: "w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "pos-y", className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1", children: "Pos Y (m)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "pos-y",
                name: "pos-y",
                type: "number",
                step: "0.05",
                value: ((selectedElement.y || 0) / 100).toFixed(2),
                onChange: (e) => onUpdate(selectedElement.id, { y: parseFloat(e.target.value) * 100 || 0 }),
                className: "w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1", children: "Dimensions (Meters)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "dim-w", className: "text-[10px] text-[var(--sea-ink-soft)] font-bold", children: "W" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "dim-w",
                    name: "dim-w",
                    type: "number",
                    step: "0.05",
                    value: ((selectedElement.width || 0) / 100).toFixed(2),
                    onChange: (e) => onUpdate(selectedElement.id, { width: parseFloat(e.target.value) * 100 || 0 }),
                    className: "w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-2 py-1.5 text-xs outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "dim-h", className: "text-[10px] text-[var(--sea-ink-soft)] font-bold", children: "H" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "dim-h",
                    name: "dim-h",
                    type: "number",
                    step: "0.05",
                    value: ((selectedElement.height || 0) / 100).toFixed(2),
                    onChange: (e) => onUpdate(selectedElement.id, { height: parseFloat(e.target.value) * 100 || 0 }),
                    className: "w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-2 py-1.5 text-xs outline-none"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "rot", className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1", children: "Rotation (Deg)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "rot",
                name: "rot",
                type: "number",
                value: Math.round(selectedElement.rotation) || 0,
                onChange: (e) => onUpdate(selectedElement.id, { rotation: parseInt(e.target.value) || 0 }),
                className: "w-full bg-[var(--sand)] border border-[var(--line)] focus:border-[var(--lagoon)] rounded-lg px-3 py-2 text-sm outline-none mb-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => onUpdate(selectedElement.id, { rotation: (selectedElement.rotation || 0) - 90 }),
                  className: "flex-1 bg-[var(--surface-strong)] hover:bg-[var(--chip-bg)] border border-[var(--line)] rounded-lg py-1.5 text-xs font-bold text-[var(--sea-ink)] transition",
                  children: "-90° (Left)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => onUpdate(selectedElement.id, { rotation: (selectedElement.rotation || 0) + 90 }),
                  className: "flex-1 bg-[var(--surface-strong)] hover:bg-[var(--chip-bg)] border border-[var(--line)] rounded-lg py-1.5 text-xs font-bold text-[var(--sea-ink)] transition",
                  children: "+90° (Right)"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 border-t border-[var(--line)] pt-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-3", children: "Elevation & Vertical Scale" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "y-offset", className: "text-[10px] text-[var(--sea-ink-soft)] font-bold", children: "HEIGHT FROM FLOOR (m)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-[var(--lagoon-deep)]", children: [
                    (selectedElement.yOffset || 0).toFixed(2),
                    "m"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "y-offset",
                    name: "y-offset",
                    type: "range",
                    min: "0",
                    max: "4",
                    step: "0.05",
                    value: selectedElement.yOffset || 0,
                    onChange: (e) => onUpdate(selectedElement.id, { yOffset: parseFloat(e.target.value) }),
                    className: "w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "v-scale", className: "text-[10px] text-[var(--sea-ink-soft)] font-bold", children: "VERTICAL THICKNESS (Scale)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-[var(--lagoon-deep)]", children: [
                    (selectedElement.verticalScale || 1).toFixed(2),
                    "x"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "v-scale",
                    name: "v-scale",
                    type: "range",
                    min: "0.05",
                    max: "5",
                    step: "0.05",
                    value: selectedElement.verticalScale || 1,
                    onChange: (e) => onUpdate(selectedElement.id, { verticalScale: parseFloat(e.target.value) }),
                    className: "w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)]"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        selectedElement.type === "wall" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onEditElevation,
              className: "w-full bg-[var(--brand)] text-white py-2 rounded-lg font-bold hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2 shadow-sm",
              children: "Edit Wall Elevation"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "wall-thickness", className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1", children: "Wall Thickness (cm)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "wall-thickness",
                  name: "wall-thickness",
                  type: "range",
                  min: "2",
                  max: "50",
                  step: "1",
                  value: selectedElement.thickness || 10,
                  onChange: (e) => onUpdate(selectedElement.id, { thickness: parseInt(e.target.value) }),
                  className: "flex-1 accent-[var(--lagoon-deep)]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold text-[var(--sea-ink)] w-8 text-right", children: selectedElement.thickness || 10 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2", children: "Wall Material" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: WALL_MATERIALS_LIST.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleMaterialChange(m2.value),
                className: `px-3 py-2 rounded-lg text-xs font-bold border transition ${(selectedElement.material || "Solid Wall") === m2.value ? "border-[var(--lagoon)] bg-[var(--lagoon-soft)] text-[var(--lagoon-deep)]" : "border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink)] hover:border-[var(--lagoon)]"}`,
                children: m2.label
              },
              m2.value
            )) })
          ] })
        ] }),
        selectedElement.type === "volumetric" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-4 pt-4 border-t border-[var(--line)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]", children: "Volumetric Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2", children: "Block Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["#ec4899", "#c026d3", "#9333ea", "#7c3aed", "#2563eb", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ffffff", "#111111"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => onUpdate(selectedElement.id, { volumetricColor: c }),
                className: "w-7 h-7 rounded-lg border-2 transition-all hover:scale-110",
                style: {
                  backgroundColor: c,
                  borderColor: selectedElement.volumetricColor === c ? "#0d7a75" : "transparent",
                  outline: selectedElement.volumetricColor === c ? "2px solid #0d7a75" : "none",
                  outlineOffset: "1px"
                }
              },
              c
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--sand)] border border-[var(--line)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[var(--sea-ink)]", children: "Emissive Glow" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-[var(--sea-ink-soft)]", children: "Backlit / light-box effect" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => onUpdate(selectedElement.id, { emissive: !selectedElement.emissive }),
                  className: `w-10 h-6 rounded-full transition-all relative ${selectedElement.emissive ? "bg-[var(--lagoon-deep)]" : "bg-gray-300"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `block w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow ${selectedElement.emissive ? "left-5" : "left-1"}` })
                }
              )
            ] }),
            selectedElement.emissive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "glow-intensity", className: "text-[10px] text-[var(--sea-ink-soft)] font-bold", children: "GLOW INTENSITY" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[var(--lagoon-deep)]", children: (selectedElement.intensity || 1.5).toFixed(1) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "glow-intensity",
                  name: "glow-intensity",
                  type: "range",
                  min: "0.1",
                  max: "5",
                  step: "0.1",
                  value: selectedElement.intensity || 1.5,
                  onChange: (e) => onUpdate(selectedElement.id, { intensity: parseFloat(e.target.value) }),
                  className: "w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)]"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2", children: "Brand Logo / Graphic" }),
            selectedElement.logoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group rounded-lg overflow-hidden border border-[var(--line)] h-20 bg-black/5 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedElement.logoUrl, className: "w-full h-full object-contain p-1", alt: "Logo Preview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => onUpdate(selectedElement.id, { logoUrl: null }),
                  className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold",
                  children: "Remove"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "logo-upload", className: "cursor-pointer w-full py-2 rounded-lg bg-[var(--sand)] border border-[var(--line)] text-[10px] font-bold text-[var(--sea-ink)] text-center hover:bg-[var(--chip-bg)] hover:border-[var(--lagoon)] transition block", children: [
              selectedElement.logoUrl ? "Replace Logo" : "+ Upload Logo",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "logo-upload",
                  name: "logo-upload",
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (re) => {
                        onUpdate(selectedElement.id, { logoUrl: re.target?.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }
              )
            ] })
          ] }),
          selectedElement.logoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2", children: "Logo Display Side" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ["front", "back", "left", "right", "top", "bottom"].map((side) => {
              if (selectedElement.shape === "cylinder" || selectedElement.shape === "pill") {
                if (["left", "right", "back"].includes(side)) return null;
                if (side === "front") side = "side";
              }
              const isActive = selectedElement.logoSide === side || side === "side" && selectedElement.logoSide === "front";
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => onUpdate(selectedElement.id, { logoSide: side }),
                  className: `px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${isActive ? "border-[var(--lagoon)] bg-[var(--lagoon-soft)] text-[var(--lagoon-deep)] shadow-sm" : "border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink)] hover:border-[var(--lagoon)]"}`,
                  children: side.toUpperCase()
                },
                side
              );
            }) })
          ] })
        ] }),
        selectedElement.type === "3d_logo" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-4 pt-4 border-t border-[var(--line)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]", children: "3D Logo Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2", children: "Upload SVG File" }),
            selectedElement.svgData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group rounded-lg overflow-hidden border border-[var(--line)] h-20 bg-black/5 mb-2 flex items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { dangerouslySetInnerHTML: { __html: selectedElement.svgData }, className: "w-full h-full p-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onUpdate(selectedElement.id, { svgData: null }), className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold", children: "Remove" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "svg-upload", className: "cursor-pointer w-full py-2 rounded-lg bg-[var(--sand)] border border-[var(--line)] text-[10px] font-bold text-[var(--sea-ink)] text-center hover:bg-[var(--chip-bg)] hover:border-[var(--lagoon)] transition block", children: [
              selectedElement.svgData ? "Replace SVG" : "+ Upload SVG",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "svg-upload", type: "file", accept: ".svg", className: "hidden", onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (re) => onUpdate(selectedElement.id, { svgData: re.target?.result });
                  reader.readAsText(file);
                }
              } })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-[var(--sea-ink-soft)] font-bold uppercase", children: "Logo Thickness (cm)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-[var(--lagoon-deep)]", children: [
                selectedElement.depth || 5,
                "cm"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "1", max: "30", step: "1", value: selectedElement.depth || 5, onChange: (e) => onUpdate(selectedElement.id, { depth: parseInt(e.target.value) }), className: "w-full accent-[var(--lagoon-deep)] h-1.5 rounded-full appearance-none bg-[var(--sand)]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2", children: "Logo Style & Material" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [{ id: "matte", label: "Matte" }, { id: "chrome", label: "Chrome" }, { id: "glowing", label: "Glowing" }, { id: "glass", label: "Glass" }].map((style) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onUpdate(selectedElement.id, { logoStyle: style.id }), className: `px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${selectedElement.logoStyle === style.id ? "border-[var(--lagoon)] bg-[var(--lagoon-soft)] text-[var(--lagoon-deep)] shadow-sm" : "border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink)] hover:border-[var(--lagoon)]"}`, children: style.label.toUpperCase() }, style.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-2", children: "Base Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["#ffffff", "#000000", "#fbbf24", "#f87171", "#60a5fa", "#4ade80", "#a78bfa"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onUpdate(selectedElement.id, { logoColor: c }), className: "w-7 h-7 rounded-lg border-2 transition-all hover:scale-110", style: { backgroundColor: c, borderColor: selectedElement.logoColor === c ? "#0d7a75" : "transparent", outline: selectedElement.logoColor === c ? "2px solid #0d7a75" : "none", outlineOffset: "1px" } }, c)) })
          ] })
        ] })
      ] }) }) : (
        /* ── Booth Materials Panel (shown when nothing selected) ── */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-[var(--lagoon-deep)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider", children: "Booth Materials" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-3", children: "Floor Surface" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: FLOOR_MATERIALS.map((mat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => onBoothConfigUpdate?.({ floorType: mat.id }),
                className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${floorType === mat.id ? "border-[var(--lagoon)] bg-[var(--lagoon-soft)]" : "border-[var(--line)] bg-[var(--sand)] hover:border-[var(--lagoon)]"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-8 h-8 rounded-lg shrink-0 border border-[rgba(0,0,0,0.1)]",
                      style: { backgroundColor: mat.color }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs font-bold ${floorType === mat.id ? "text-[var(--lagoon-deep)]" : "text-[var(--sea-ink)]"}`, children: mat.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-[var(--sea-ink-soft)]", children: mat.desc })
                  ] }),
                  floorType === mat.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto w-2 h-2 rounded-full bg-[var(--lagoon)]" })
                ]
              },
              mat.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-[10px] text-[var(--sea-ink-soft)] pt-2 border-t border-[var(--line)]", children: "Select an element to edit its properties" })
        ] })
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-[var(--line)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-4 w-4" }),
          "JSON Preview"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-[#1e1e1e] text-[#b8efe5] p-3 rounded-xl text-[10px] overflow-x-auto shadow-inner leading-relaxed max-h-48", children: JSON.stringify(selectedElement || { status: "idle", workspace: "ready" }, null, 2) })
      ] })
    ] })
  ] });
}
const PPM = 100;
function Preview3D({ boothConfig, elements }) {
  const [isSceneReady, setIsSceneReady] = reactExports.useState(false);
  const [cameraMode, setCameraMode] = reactExports.useState("orbit");
  const canvasRef = reactExports.useRef(null);
  const engineRef = reactExports.useRef(null);
  const sceneRef = reactExports.useRef(null);
  const shadowGeneratorRef = reactExports.useRef(null);
  const meshRegistryRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const structureRegistryRef = reactExports.useRef([]);
  const lastBoothDimRef = reactExports.useRef({ w: 0, d: 0 });
  reactExports.useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true
    });
    engineRef.current = engine;
    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new Color4(0.07, 0.07, 0.09, 1);
    const orbitCam = new ArcRotateCamera(
      "orbitCam",
      Tools.ToRadians(-45),
      Tools.ToRadians(55),
      20,
      new Vector3(0, 0.5, 0),
      scene
    );
    orbitCam.lowerRadiusLimit = 0.1;
    orbitCam.upperRadiusLimit = 100;
    orbitCam.wheelPrecision = 100;
    orbitCam.minZ = 0.01;
    orbitCam.panningSensibility = 50;
    const flightCam = new UniversalCamera("flightCam", new Vector3(0, 3, -10), scene);
    flightCam.setTarget(new Vector3(0, 1, 0));
    flightCam.keysUp.push(87);
    flightCam.keysDown.push(83);
    flightCam.keysLeft.push(65);
    flightCam.keysRight.push(68);
    flightCam.keysUpward.push(69);
    flightCam.keysDownward.push(81);
    flightCam.speed = 0.2;
    flightCam.angularSensibility = 2e3;
    flightCam.minZ = 0.05;
    scene.activeCamera = orbitCam;
    orbitCam.attachControl(canvasRef.current, true);
    const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
    hemi.intensity = 0.6;
    hemi.diffuse = new Color3(1, 0.98, 0.95);
    hemi.groundColor = new Color3(0.4, 0.35, 0.28);
    const dirLight = new DirectionalLight("dir", new Vector3(-1, -2, -1), scene);
    dirLight.intensity = 0.8;
    dirLight.diffuse = new Color3(1, 0.95, 0.85);
    const shadowGenerator = new ShadowGenerator(2048, dirLight);
    shadowGeneratorRef.current = shadowGenerator;
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 16;
    const pipeline = new DefaultRenderingPipeline("default", true, scene, [orbitCam, flightCam]);
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.8;
    pipeline.bloomWeight = 0.3;
    pipeline.bloomKernel = 64;
    pipeline.samples = 4;
    pipeline.sharpenEnabled = true;
    pipeline.sharpen.edgeAmount = 0.2;
    const ssao = new SSAO2RenderingPipeline("ssao", scene, { ssaoRatio: 0.5, blurRatio: 1 });
    ssao.radius = 3.5;
    ssao.totalStrength = 1.2;
    ssao.expensiveBlur = true;
    ssao.samples = 16;
    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", orbitCam);
    engine.runRenderLoop(() => {
      scene.render();
    });
    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);
    setIsSceneReady(true);
    return () => {
      setIsSceneReady(false);
      window.removeEventListener("resize", handleResize);
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
  reactExports.useEffect(() => {
    if (!isSceneReady || !boothConfig) return;
    const scene = sceneRef.current;
    const shadowGenerator = shadowGeneratorRef.current;
    if (!scene || !shadowGenerator) return;
    structureRegistryRef.current.forEach((mesh) => mesh.dispose());
    structureRegistryRef.current = [];
    const centerX = boothConfig.width / 2;
    const centerZ = boothConfig.depth / 2;
    if (lastBoothDimRef.current.w !== boothConfig.width || lastBoothDimRef.current.d !== boothConfig.depth) {
      const orbitCam = scene.getCameraByName("orbitCam");
      if (orbitCam) {
        orbitCam.setTarget(new Vector3(centerX, 0.5, centerZ));
        orbitCam.radius = Math.max(boothConfig.width, boothConfig.depth) * 1.5 + 2;
      }
      lastBoothDimRef.current = { w: boothConfig.width, d: boothConfig.depth };
    }
    const floor = MeshBuilder.CreateGround("floor", { width: boothConfig.width, height: boothConfig.depth }, scene);
    floor.position = new Vector3(centerX, 0, centerZ);
    floor.receiveShadows = true;
    const floorMat = new PBRMaterial("floorMat", scene);
    floorMat.maxSimultaneousLights = 16;
    floorMat.roughness = 0.15;
    floorMat.metallic = 0.1;
    const floorType = boothConfig.floorType || "hardwood";
    if (floorType === "carpet") {
      floorMat.albedoColor = new Color3(0.18, 0.25, 0.31);
      floorMat.roughness = 0.9;
    } else {
      const texPath = `/assets/textures/${floorType}.png`;
      const texture = new Texture(texPath, scene);
      texture.uScale = boothConfig.width / 2;
      texture.vScale = boothConfig.depth / 2;
      floorMat.albedoTexture = texture;
      if (floorType === "marble") {
        floorMat.roughness = 0.05;
        floorMat.metallic = 0.2;
      } else if (floorType === "hardwood") {
        floorMat.roughness = 0.25;
      } else if (floorType === "concrete") {
        floorMat.roughness = 0.5;
      }
    }
    floorMat.reflectionColor = new Color3(1, 1, 1);
    floor.material = floorMat;
    structureRegistryRef.current.push(floor);
  }, [boothConfig, isSceneReady]);
  const lastSyncRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (!isSceneReady || !elements || !boothConfig) return;
    const now2 = Date.now();
    if (now2 - lastSyncRef.current < 32) {
      const timeout = setTimeout(() => {
        lastSyncRef.current = 0;
      }, 50);
      return () => clearTimeout(timeout);
    }
    lastSyncRef.current = now2;
    const scene = sceneRef.current;
    const shadowGenerator = shadowGeneratorRef.current;
    if (!scene || !shadowGenerator) return;
    const currentIds = new Set(elements.map((el) => el.id));
    const registry = meshRegistryRef.current;
    registry.forEach((mesh, id) => {
      if (!currentIds.has(id)) {
        mesh.dispose();
        registry.delete(id);
      }
    });
    elements.forEach((el) => {
      const x2 = el.x / PPM;
      const z = boothConfig.depth - el.y / PPM;
      const rotY = Tools.ToRadians(el.rotation || 0);
      const h = 2.5;
      let needsRecreate = false;
      const hasWallElements = el.wallElements && el.wallElements.length > 0;
      const currentWallState = JSON.stringify({
        elements: el.wallElements || [],
        thickness: el.thickness || 10,
        width: hasWallElements ? el.width : void 0,
        material: el.material || "Solid Wall"
      });
      if (registry.has(el.id)) {
        const mesh = registry.get(el.id);
        if (el.type === "wall") {
          if (!mesh.metadata || mesh.metadata.wallState !== currentWallState) {
            needsRecreate = true;
          }
        } else if (el.type === "volumetric") {
          if (!mesh.metadata || mesh.metadata.shape !== el.shape || mesh.metadata.logoSide !== el.logoSide) {
            needsRecreate = true;
          }
        } else if (el.type === "3d_logo") {
          if (!mesh.metadata || mesh.metadata.svgData !== el.svgData || mesh.metadata.depth !== el.depth || mesh.metadata.logoStyle !== el.logoStyle) {
            needsRecreate = true;
          }
        }
      }
      if (registry.has(el.id) && !needsRecreate) {
        const mesh = registry.get(el.id);
        const vScale = el.verticalScale || 1;
        const hActual = el.type === "wall" ? 2.5 : 1;
        mesh.position.x = x2;
        mesh.position.z = z;
        if (el.type === "asset") {
          mesh.position.y = el.yOffset || 0;
        } else {
          mesh.position.y = hActual * vScale / 2 + (el.yOffset || 0);
        }
        if (mesh.rotationQuaternion) mesh.rotationQuaternion = null;
        mesh.rotation.y = rotY;
        mesh.scaling.y = vScale;
        if (el.type === "wall" && !hasWallElements) {
          const wVal = el.width / PPM;
          if (mesh.metadata && mesh.metadata.baseWidth) {
            mesh.scaling.x = wVal / mesh.metadata.baseWidth;
          }
        }
        if (el.type === "asset" && mesh.metadata && mesh.metadata.nativeLength) {
          const targetW = el.width / PPM;
          const s = targetW / mesh.metadata.nativeLength;
          mesh.scaling = new Vector3(s, s * (el.verticalScale || 1), s);
        }
        if (el.type === "volumetric") {
          mesh.scaling.x = el.width / PPM;
          mesh.scaling.z = el.height / PPM;
          const mat = mesh.material;
          if (mat) {
            const color = Color3.FromHexString(el.volumetricColor || "#ec4899");
            mat.albedoColor = el.logoUrl ? Color3.White() : color;
            if (el.emissive) {
              mat.emissiveColor = color;
              mat.emissiveIntensity = el.intensity || 1.5;
            } else {
              mat.emissiveColor = Color3.Black();
            }
            if (el.logoUrl) {
              if (!mat.albedoTexture || mat.albedoTexture.url !== el.logoUrl) {
                const tex = new Texture(el.logoUrl, scene);
                tex.hasAlpha = true;
                tex.wrapU = Texture.CLAMP_ADDRESSMODE;
                tex.wrapV = Texture.CLAMP_ADDRESSMODE;
                mat.albedoTexture = tex;
                if (el.emissive) {
                  mat.emissiveTexture = tex;
                }
              } else if (el.emissive) {
                mat.emissiveTexture = mat.albedoTexture;
              }
            } else {
              mat.albedoTexture = null;
              mat.emissiveTexture = null;
            }
          }
        }
      } else {
        if (needsRecreate) {
          registry.get(el.id)?.dispose();
          registry.delete(el.id);
        }
        if (el.type === "wall") {
          const wVal = el.width / PPM;
          const dVal = (el.thickness || 10) / PPM;
          const vScale = el.verticalScale || 1;
          let mesh = MeshBuilder.CreateBox(el.id, { width: wVal, height: h, depth: dVal }, scene);
          const attachments = [];
          if (el.wallElements && el.wallElements.length > 0) {
            let wallCSG = CSG.FromMesh(mesh);
            const trimColor = new Color3(0.2, 0.2, 0.2);
            const ft = 0.04;
            el.wallElements.forEach((wel, index) => {
              const cutW = wel.width / PPM, cutH = wel.height / PPM, cutD = dVal + 0.5;
              const localX = wel.x / PPM - wVal / 2 + cutW / 2;
              const localY = h / 2 - wel.y / PPM - cutH / 2;
              const isCutout = ["door", "window"].includes(wel.type);
              if (isCutout) {
                const cutBox = MeshBuilder.CreateBox("cut", { width: cutW, height: cutH, depth: cutD }, scene);
                cutBox.position.set(localX, localY, 0);
                wallCSG = wallCSG.subtract(CSG.FromMesh(cutBox));
                cutBox.dispose();
                if (wel.type === "window") {
                  const winGroup = new Mesh("window_" + index, scene);
                  const frameMat = new StandardMaterial("fmat", scene);
                  frameMat.diffuseColor = trimColor;
                  const fTop = MeshBuilder.CreateBox("ft", { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                  fTop.position.y = cutH / 2 - ft / 2;
                  fTop.material = frameMat;
                  fTop.parent = winGroup;
                  const fBot = MeshBuilder.CreateBox("fb", { width: cutW, height: ft, depth: dVal + 0.02 }, scene);
                  fBot.position.y = -cutH / 2 + ft / 2;
                  fBot.material = frameMat;
                  fBot.parent = winGroup;
                  const fLeft = MeshBuilder.CreateBox("fl", { width: ft, height: cutH - ft * 2, depth: dVal + 0.02 }, scene);
                  fLeft.position.x = -cutW / 2 + ft / 2;
                  fLeft.material = frameMat;
                  fLeft.parent = winGroup;
                  const fRight = MeshBuilder.CreateBox("fr", { width: ft, height: cutH - ft * 2, depth: dVal + 0.02 }, scene);
                  fRight.position.x = cutW / 2 - ft / 2;
                  fRight.material = frameMat;
                  fRight.parent = winGroup;
                  const glass = MeshBuilder.CreatePlane("glass", { width: cutW - ft * 2, height: cutH - ft * 2 }, scene);
                  glass.position.z = dVal / 2 + 5e-3;
                  glass.parent = winGroup;
                  const gMat = new StandardMaterial("gmat", scene);
                  gMat.diffuseColor = new Color3(0.6, 0.8, 1);
                  gMat.alpha = 0.3;
                  glass.material = gMat;
                  winGroup.position.set(localX, localY, 0);
                  attachments.push(winGroup);
                } else if (wel.type === "door") {
                  const doorGroup = new Mesh("door_" + index, scene);
                  const doorFrame = MeshBuilder.CreateBox("df", { width: cutW, height: cutH, depth: dVal + 0.02 }, scene);
                  const dfMat = new StandardMaterial("dfm", scene);
                  dfMat.diffuseColor = trimColor;
                  doorFrame.material = dfMat;
                  doorFrame.parent = doorGroup;
                  const leaf = MeshBuilder.CreateBox("dl", { width: cutW - ft * 2, height: cutH - ft, depth: 0.04 }, scene);
                  leaf.position.y = -ft / 2;
                  leaf.material = dfMat;
                  leaf.parent = doorGroup;
                  doorGroup.position.set(localX, localY, 0);
                  attachments.push(doorGroup);
                }
              } else {
                let mount;
                if (wel.type === "shelf") {
                  mount = MeshBuilder.CreateBox("shelf", { width: cutW, height: 0.03, depth: 0.3 }, scene);
                  mount.position.set(localX, localY, dVal / 2 + 0.15);
                } else if (wel.type === "light") {
                  mount = MeshBuilder.CreateBox("light", { width: cutW, height: cutH, depth: 0.05 }, scene);
                  const lMat = new StandardMaterial("lm", scene);
                  lMat.emissiveColor = Color3.White();
                  mount.material = lMat;
                  mount.position.set(localX, localY, dVal / 2 + 0.025);
                } else {
                  mount = MeshBuilder.CreatePlane("banner", { width: cutW, height: cutH }, scene);
                  mount.rotation.y = Math.PI;
                  mount.position.set(localX, localY, dVal / 2 + 0.01);
                  const bMat = new StandardMaterial("bm_" + index, scene);
                  if (wel.url) {
                    const tex = new Texture(wel.url, scene);
                    tex.hasAlpha = true;
                    bMat.diffuseTexture = tex;
                  } else {
                    bMat.diffuseColor = wel.type === "frame" ? new Color3(0.8, 0.8, 0.8) : Color3.Blue();
                  }
                  mount.material = bMat;
                }
                attachments.push(mount);
              }
            });
            const finalMesh = wallCSG.toMesh(el.id, null, scene);
            mesh.dispose();
            mesh = finalMesh;
            attachments.forEach((att) => att.parent = mesh);
          }
          mesh.position.set(x2, h * vScale / 2 + (el.yOffset || 0), z);
          mesh.scaling.y = vScale;
          mesh.rotation.y = rotY;
          shadowGenerator.addShadowCaster(mesh);
          const mat = new StandardMaterial(el.id + "_mat", scene);
          if (el.material === "Glass Wall") {
            mat.diffuseColor = new Color3(0.5, 0.8, 1);
            mat.alpha = 0.4;
          } else if (el.material === "Wood") {
            mat.diffuseTexture = new Texture("/assets/textures/hardwood.png", scene);
          } else {
            mat.diffuseColor = new Color3(0.9, 0.9, 0.9);
          }
          mesh.material = mat;
          mesh.metadata = { wallState: currentWallState, baseWidth: wVal };
          registry.set(el.id, mesh);
        } else if (el.type === "volumetric") {
          let vMesh;
          const logoSide = el.logoSide || "front";
          const faceUV = new Array(6).fill(new Vector4(0, 0, 0, 0));
          if (el.logoUrl) {
            let sideIndex = 0;
            if (logoSide === "back") sideIndex = 1;
            else if (logoSide === "right") sideIndex = 2;
            else if (logoSide === "left") sideIndex = 3;
            else if (logoSide === "top") sideIndex = 4;
            else if (logoSide === "bottom") sideIndex = 5;
            faceUV[sideIndex] = new Vector4(0, 0, 1, 1);
          } else {
            faceUV.fill(new Vector4(0, 0, 1, 1));
          }
          if (el.shape === "cylinder") {
            const cylUV = new Array(3).fill(new Vector4(0, 0, 0, 0));
            if (el.logoUrl) {
              if (logoSide === "top") cylUV[2] = new Vector4(0, 0, 1, 1);
              else if (logoSide === "bottom") cylUV[0] = new Vector4(0, 0, 1, 1);
              else cylUV[1] = new Vector4(0, 0, 1, 1);
            } else {
              cylUV.fill(new Vector4(0, 0, 1, 1));
            }
            vMesh = MeshBuilder.CreateCylinder(el.id, { diameter: 1, height: 1, faceUV: cylUV }, scene);
          } else if (el.shape === "pill") {
            vMesh = MeshBuilder.CreateCapsule(el.id, { height: 1, radius: 0.5 }, scene);
          } else {
            vMesh = MeshBuilder.CreateBox(el.id, { size: 1, faceUV }, scene);
          }
          vMesh.position.set(x2, 1 * (el.verticalScale || 1) / 2 + (el.yOffset || 0), z);
          vMesh.scaling.set(el.width / PPM, el.verticalScale || 1, el.height / PPM);
          vMesh.rotation.y = rotY;
          shadowGenerator.addShadowCaster(vMesh);
          const mat = new PBRMaterial(el.id + "_mat", scene);
          const color = Color3.FromHexString(el.volumetricColor || "#ec4899");
          mat.albedoColor = el.logoUrl ? Color3.White() : color;
          mat.roughness = 0.2;
          if (el.emissive) {
            mat.emissiveColor = color;
            mat.emissiveIntensity = el.intensity || 1.5;
          }
          if (el.logoUrl) {
            const tex = new Texture(el.logoUrl, scene);
            tex.hasAlpha = true;
            tex.wrapU = Texture.CLAMP_ADDRESSMODE;
            tex.wrapV = Texture.CLAMP_ADDRESSMODE;
            mat.albedoTexture = tex;
            if (el.emissive) {
              mat.emissiveTexture = tex;
            }
          }
          vMesh.material = mat;
          vMesh.metadata = { shape: el.shape, logoSide: el.logoSide };
          registry.set(el.id, vMesh);
        } else if (el.type === "3d_logo") {
          const depth = (el.depth || 5) / PPM;
          const w = el.width / PPM;
          const h2 = el.height / PPM;
          const faceUV = new Array(6).fill(new Vector4(0, 0, 0, 0));
          faceUV[0] = new Vector4(0, 0, 1, 1);
          const logoMesh = MeshBuilder.CreateBox(el.id, { width: w, height: h2, depth, faceUV }, scene);
          logoMesh.position.set(x2, h2 / 2 + (el.yOffset || 0), z);
          logoMesh.rotation.y = rotY;
          shadowGenerator.addShadowCaster(logoMesh);
          const mat = new PBRMaterial(el.id + "_mat", scene);
          const baseColor = Color3.FromHexString(el.logoColor || "#ffffff");
          mat.albedoColor = baseColor;
          mat.metallic = 0;
          mat.roughness = 0.5;
          if (el.logoStyle === "chrome") {
            mat.metallic = 1;
            mat.roughness = 0.1;
          } else if (el.logoStyle === "glowing") {
            mat.emissiveColor = baseColor;
            mat.emissiveIntensity = 2;
          } else if (el.logoStyle === "glass") {
            mat.alpha = 0.5;
            mat.metallic = 0;
            mat.roughness = 0.1;
            mat.indexOfRefraction = 1.5;
            mat.transparencyMode = 2;
          }
          logoMesh.subMeshes = [];
          new SubMesh(0, 0, logoMesh.getTotalVertices(), 0, 6, logoMesh);
          new SubMesh(1, 0, logoMesh.getTotalVertices(), 6, 30, logoMesh);
          const multimat = new MultiMaterial(el.id + "_multimat", scene);
          const frontMat = new PBRMaterial(el.id + "_front", scene);
          frontMat.albedoColor = baseColor;
          frontMat.metallic = mat.metallic;
          frontMat.roughness = mat.roughness;
          frontMat.transparencyMode = 2;
          if (el.logoStyle === "glowing") {
            frontMat.emissiveColor = baseColor;
            frontMat.emissiveIntensity = 2;
          }
          if (el.logoStyle === "glass") {
            frontMat.alpha = 0.5;
            frontMat.indexOfRefraction = 1.5;
          }
          if (el.svgData) {
            const blob = new Blob([el.svgData], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const tex = new Texture(url, scene);
            tex.hasAlpha = true;
            tex.vScale = -1;
            tex.vOffset = 1;
            frontMat.albedoTexture = tex;
            frontMat.opacityTexture = tex;
            if (el.logoStyle === "glowing") frontMat.emissiveTexture = tex;
            tex.onLoadObservable.addOnce(() => URL.revokeObjectURL(url));
          }
          const sideMat = new PBRMaterial(el.id + "_side", scene);
          sideMat.albedoColor = baseColor;
          sideMat.metallic = mat.metallic;
          sideMat.roughness = mat.roughness;
          sideMat.transparencyMode = 2;
          if (el.svgData) {
            const blob = new Blob([el.svgData], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const tex = new Texture(url, scene);
            tex.vScale = -1;
            tex.vOffset = 1;
            sideMat.opacityTexture = tex;
            tex.onLoadObservable.addOnce(() => URL.revokeObjectURL(url));
          }
          multimat.subMaterials.push(frontMat);
          multimat.subMaterials.push(sideMat);
          logoMesh.material = multimat;
          logoMesh.metadata = { svgData: el.svgData, depth: el.depth, logoStyle: el.logoStyle };
          registry.set(el.id, logoMesh);
        } else if (el.type === "asset") {
          const modelName = el.assetName?.toLowerCase() || "box";
          const pivot = MeshBuilder.CreateBox("pivot_" + el.id, { size: 0.01 }, scene);
          pivot.isVisible = false;
          pivot.position.set(x2, el.yOffset || 0, z);
          pivot.rotation.y = rotY;
          registry.set(el.id, pivot);
          SceneLoader.ImportMesh("", "/models/", `${modelName}.glb`, scene, (meshes) => {
            if (!registry.has(el.id)) {
              meshes.forEach((m2) => m2.dispose());
              return;
            }
            const root = meshes[0];
            root.parent = pivot;
            root.position = Vector3.Zero();
            setTimeout(() => {
              root.computeWorldMatrix(true);
              const bbox = root.getHierarchyBoundingVectors(true);
              const sz = bbox.max.subtract(bbox.min);
              const longest = Math.max(sz.x, sz.z);
              const rootWorldPos = root.getAbsolutePosition();
              root.position.x -= (bbox.min.x + bbox.max.x) / 2 - rootWorldPos.x;
              root.position.z -= (bbox.min.z + bbox.max.z) / 2 - rootWorldPos.z;
              root.position.y -= bbox.min.y - rootWorldPos.y;
              if (longest > 0) {
                pivot.metadata = { nativeLength: longest };
                const s = el.width / PPM / longest;
                pivot.scaling.set(s, s * (el.verticalScale || 1), s);
              }
            }, 100);
            meshes.forEach((m2) => {
              m2.receiveShadows = true;
              shadowGenerator.addShadowCaster(m2, true);
            });
          }, null, () => {
            const ph = MeshBuilder.CreateBox("ph", { width: el.width / PPM, height: 0.8, depth: el.height / PPM }, scene);
            ph.parent = pivot;
            ph.position.y = 0.4;
          });
        }
      }
    });
  }, [elements, isSceneReady, boothConfig]);
  reactExports.useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas) return;
    const orbitCam = scene.getCameraByName("orbitCam");
    const flightCam = scene.getCameraByName("flightCam");
    if (!orbitCam || !flightCam) return;
    if (cameraMode === "flight") {
      orbitCam.detachControl();
      flightCam.position = orbitCam.position.clone();
      flightCam.setTarget(orbitCam.getTarget());
      scene.activeCamera = flightCam;
      flightCam.attachControl(canvas, true);
    } else {
      flightCam.detachControl();
      orbitCam.setTarget(flightCam.position.clone().add(flightCam.getForwardRay().direction.scale(5)));
      orbitCam.setPosition(flightCam.position.clone());
      scene.activeCamera = orbitCam;
      orbitCam.attachControl(canvas, true);
    }
  }, [cameraMode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full relative", style: { backgroundColor: "#0d0d0f" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "w-full h-full block outline-none touch-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 z-20 flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1.5 rounded-lg bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.1)] text-[10px] font-bold text-white uppercase backdrop-blur-md", children: cameraMode === "orbit" ? "Orbit Mode 🌐" : "Flight Mode 🛸" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCameraMode((prev) => prev === "orbit" ? "flight" : "orbit"), className: "px-4 py-2 bg-[rgba(0,0,0,0.6)] hover:bg-[var(--sea-ink)] border border-[rgba(255,255,255,0.1)] text-xs font-bold text-white uppercase rounded-lg backdrop-blur-md transition-colors", children: cameraMode === "orbit" ? "Switch to Flight Mode" : "Switch to Orbit Mode" }) })
  ] });
}
function EditorPage() {
  const [boothConfig, setBoothConfig] = reactExports.useState(null);
  const [wizardStep, setWizardStep] = reactExports.useState(1);
  const [setupWidth, setSetupWidth] = reactExports.useState(3);
  const [setupDepth, setSetupDepth] = reactExports.useState(3);
  const [setupWallThickness, setSetupWallThickness] = reactExports.useState(0.1);
  const [setupWalls, setSetupWalls] = reactExports.useState({
    north: true,
    south: false,
    east: true,
    west: true
  });
  const [elements, setElements] = reactExports.useState([]);
  const [history, setHistory] = reactExports.useState([]);
  const [historyStep, setHistoryStep] = reactExports.useState(-1);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [gridVisible, setGridVisible] = reactExports.useState(true);
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(true);
  const [previewerOpen, setPreviewerOpen] = reactExports.useState(true);
  const [propertiesOpen, setPropertiesOpen] = reactExports.useState(true);
  const [splitWidth, setSplitWidth] = reactExports.useState(60);
  const [is3DGenerated, setIs3DGenerated] = reactExports.useState(false);
  const [editingWallId, setEditingWallId] = reactExports.useState(null);
  const handleSelect = (id) => {
    setSelectedId(id);
  };
  reactExports.useEffect(() => {
    const savedStall = localStorage.getItem("stall-config");
    const savedElements = localStorage.getItem("stall-elements");
    if (savedStall) {
      const config = JSON.parse(savedStall);
      setBoothConfig(config);
      if (savedElements) {
        let parsed = JSON.parse(savedElements);
        const hasOuterWalls = parsed.some((el) => el.isOuter);
        if (!hasOuterWalls && config.walls) {
          const PPM2 = 100;
          const W = config.width * PPM2;
          const D = config.depth * PPM2;
          const T = (config.wallThickness || 0.1) * 100;
          const migrationWalls = [];
          if (config.walls.north) migrationWalls.push({
            id: "outer-north",
            type: "wall",
            isOuter: true,
            x: W / 2,
            y: 0,
            width: W,
            thickness: T,
            rotation: 0,
            fill: "#333333",
            opacity: 1,
            wallElements: []
          });
          if (config.walls.south) migrationWalls.push({
            id: "outer-south",
            type: "wall",
            isOuter: true,
            x: W / 2,
            y: D,
            width: W,
            thickness: T,
            rotation: 180,
            fill: "#333333",
            opacity: 1,
            wallElements: []
          });
          if (config.walls.west) migrationWalls.push({
            id: "outer-west",
            type: "wall",
            isOuter: true,
            x: 0,
            y: D / 2,
            width: D,
            thickness: T,
            rotation: 90,
            fill: "#333333",
            opacity: 1,
            wallElements: []
          });
          if (config.walls.east) migrationWalls.push({
            id: "outer-east",
            type: "wall",
            isOuter: true,
            x: W,
            y: D / 2,
            width: D,
            thickness: T,
            rotation: -90,
            fill: "#333333",
            opacity: 1,
            wallElements: []
          });
          parsed = [...migrationWalls, ...parsed];
        }
        setElements(parsed);
        setHistory([parsed]);
        setHistoryStep(0);
      }
    }
  }, []);
  reactExports.useEffect(() => {
    if (boothConfig) {
      localStorage.setItem("stall-config", JSON.stringify(boothConfig));
      localStorage.setItem("stall-elements", JSON.stringify(elements));
    }
  }, [boothConfig, elements]);
  const saveToHistory = (newElements) => {
    const nextHistory = history.slice(0, historyStep + 1);
    setHistory([...nextHistory, newElements]);
    setHistoryStep(nextHistory.length);
  };
  const undo = () => {
    if (historyStep > 0) {
      const prev = history[historyStep - 1];
      setElements(prev);
      setHistoryStep(historyStep - 1);
      setSelectedId(null);
    }
  };
  const redo = () => {
    if (historyStep < history.length - 1) {
      const next = history[historyStep + 1];
      setElements(next);
      setHistoryStep(historyStep + 1);
      setSelectedId(null);
    }
  };
  const handleUpdateElement = (id, newProps) => {
    const updated = elements.map((el) => el.id === id ? {
      ...el,
      ...newProps
    } : el);
    setElements(updated);
    saveToHistory(updated);
  };
  const handleDeleteElement = (id) => {
    const filtered = elements.filter((el) => el.id !== id);
    setElements(filtered);
    saveToHistory(filtered);
    if (selectedId === id) setSelectedId(null);
  };
  const addElement = (newEl) => {
    const updated = [...elements, newEl];
    setElements(updated);
    saveToHistory(updated);
  };
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId && !editingWallId) {
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
        handleDeleteElement(selectedId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, historyStep, history, editingWallId]);
  const submitExport = () => {
    const exportedElements = elements.map((el) => ({
      id: el.id,
      type: el.type,
      assetName: el.assetName,
      material: el.material,
      x: el.x,
      y: el.y,
      rotation: el.rotation || 0,
      width: el.width,
      height: el.height
    }));
    const finalExport = {
      booth: {
        width: boothConfig?.width,
        length: boothConfig?.depth,
        wallThickness: boothConfig?.wallThickness,
        size: (boothConfig?.width || 0) * (boothConfig?.depth || 0),
        walls: boothConfig?.walls
      },
      elements: exportedElements
    };
    console.log(JSON.stringify(finalExport, null, 2));
    alert("Export successful! Check console for JSON.");
  };
  const clearAll = () => {
    if (confirm("Clear the workspace?")) {
      setElements([]);
      saveToHistory([]);
      localStorage.removeItem("stall-elements");
    }
  };
  const selectedElement = elements.find((el) => el.id === selectedId);
  const editingWall = editingWallId ? elements.find((el) => el.id === editingWallId) : null;
  if (!boothConfig) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { suppressHydrationWarning: true, className: "flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[var(--bg-base)] p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "island-shell p-8 rounded-2xl w-full max-w-[500px] flex flex-col gap-6 text-center rise-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-[var(--sea-ink)] display-title", children: "Booth Setup Wizard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 flex-1 rounded-full ${wizardStep >= 1 ? "bg-[var(--lagoon)]" : "bg-[var(--line)]"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 flex-1 rounded-full ${wizardStep >= 2 ? "bg-[var(--lagoon)]" : "bg-[var(--line)]"}` })
      ] }),
      wizardStep === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[var(--sea-ink-soft)] font-semibold", children: "Step 1: Determine real-world footprint" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left bg-[var(--sand)] p-4 rounded-xl border border-[var(--line)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-[var(--sea-ink)]", children: "Width (meters)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--lagoon-deep)] font-mono font-bold", children: [
                setupWidth.toFixed(1),
                "m"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "2", max: "20", step: "0.5", value: setupWidth, onChange: (e) => setSetupWidth(parseFloat(e.target.value)), className: "w-full accent-[var(--lagoon-deep)]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left bg-[var(--sand)] p-4 rounded-xl border border-[var(--line)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-[var(--sea-ink)]", children: "Depth (meters)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--lagoon-deep)] font-mono font-bold", children: [
                setupDepth.toFixed(1),
                "m"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "2", max: "20", step: "0.5", value: setupDepth, onChange: (e) => setSetupDepth(parseFloat(e.target.value)), className: "w-full accent-[var(--lagoon-deep)]" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setWizardStep(2), className: "rounded-full bg-[var(--brand)] text-white font-bold py-3 hover:bg-[var(--brand-h)] transition flex items-center justify-center gap-2 mt-2 shadow-lg", children: [
          "Next Step ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5" })
        ] })
      ] }),
      wizardStep === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[var(--sea-ink-soft)] font-semibold", children: "Step 2: Configure structural walls" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 text-left", children: ["north", "south", "east", "west"].map((wallDir) => {
          const isClosed = setupWalls[wallDir];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSetupWalls((prev) => ({
            ...prev,
            [wallDir]: !isClosed
          })), className: `p-4 rounded-xl border-2 transition-all flex flex-col items-start gap-2 ${isClosed ? "bg-[var(--surface-strong)] border-[var(--sea-ink)] shadow-md" : "bg-[var(--sand)] border-transparent text-[var(--sea-ink-soft)]"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs uppercase tracking-wider font-bold capitalize block", children: [
              wallDir,
              " Wall"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-sm font-semibold flex items-center gap-2 ${isClosed ? "text-[var(--sea-ink)]" : "text-gray-400"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-3 h-3 rounded-full ${isClosed ? "bg-red-500" : "bg-transparent border border-gray-400"}` }),
              isClosed ? "Solid / Closed" : "Open / Hidden"
            ] })
          ] }, wallDir);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left bg-[var(--sand)] p-4 rounded-xl border border-[var(--line)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-[var(--sea-ink)]", children: "Wall Thickness (m)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--lagoon-deep)] font-mono font-bold", children: [
              setupWallThickness.toFixed(2),
              "m"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "0.05", max: "0.5", step: "0.01", value: setupWallThickness, onChange: (e) => setSetupWallThickness(parseFloat(e.target.value)), className: "w-full accent-[var(--lagoon-deep)]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setWizardStep(1), className: "rounded-full bg-[var(--sand)] text-[var(--sea-ink)] font-bold py-3 px-6 hover:bg-gray-200 transition", children: "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            const PPM2 = 100;
            const W = setupWidth * PPM2;
            const D = setupDepth * PPM2;
            const T = setupWallThickness * 100;
            const initialElements = [];
            if (setupWalls.north) initialElements.push({
              id: "outer-north",
              type: "wall",
              isOuter: true,
              x: W / 2,
              y: 0,
              width: W,
              thickness: T,
              rotation: 0,
              fill: "#333333",
              opacity: 1,
              wallElements: []
            });
            if (setupWalls.south) initialElements.push({
              id: "outer-south",
              type: "wall",
              isOuter: true,
              x: W / 2,
              y: D,
              width: W,
              thickness: T,
              rotation: 0,
              fill: "#333333",
              opacity: 1,
              wallElements: []
            });
            if (setupWalls.west) initialElements.push({
              id: "outer-west",
              type: "wall",
              isOuter: true,
              x: 0,
              y: D / 2,
              width: D,
              thickness: T,
              rotation: 90,
              fill: "#333333",
              opacity: 1,
              wallElements: []
            });
            if (setupWalls.east) initialElements.push({
              id: "outer-east",
              type: "wall",
              isOuter: true,
              x: W,
              y: D / 2,
              width: D,
              thickness: T,
              rotation: 90,
              fill: "#333333",
              opacity: 1,
              wallElements: []
            });
            setBoothConfig({
              width: setupWidth,
              depth: setupDepth,
              wallThickness: setupWallThickness,
              walls: setupWalls
            });
            setElements(initialElements);
            saveToHistory(initialElements);
          }, className: "rounded-full bg-[var(--lagoon-deep)] flex-1 text-white font-bold py-3 hover:bg-[var(--palm)] transition flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-5 h-5" }),
            " Initialize Booth"
          ] })
        ] })
      ] })
    ] }) }, "setup-screen");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[var(--bg-base)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-14 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center justify-between px-4 z-20 shadow-sm transition-all shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pr-4 border-r border-[var(--border)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-[var(--brand)] flex items-center justify-center text-white font-bold shadow-sm", children: "D" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-[var(--fg)] tracking-tight", children: "Dekode Booth Designer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            if (confirm("Return to Setup Wizard? Current booth dimensions will be reset.")) {
              setBoothConfig(null);
              setWizardStep(1);
            }
          }, className: "px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--sand)] text-[var(--sea-ink)] text-xs font-bold transition hover:bg-[var(--lagoon)] hover:text-white", children: "Edit Booth Setup" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-[var(--line)] mx-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: undo, disabled: historyStep <= 0, className: "p-2 rounded-lg hover:bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] disabled:opacity-30 transition", title: "Undo (Ctrl+Z)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: redo, disabled: historyStep >= history.length - 1, className: "p-2 rounded-lg hover:bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] disabled:opacity-30 transition", title: "Redo (Ctrl+Shift+Z)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-[var(--line)] mx-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearAll, className: "p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors", title: "Clear Workspace", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-[var(--sand)] p-1 rounded-xl border border-[var(--line)] mr-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: `p-1.5 rounded-lg transition ${sidebarOpen ? "bg-[var(--brand)] text-white" : "text-[var(--fg-soft)] hover:bg-[var(--bg-subtle)]"}`, title: "Toggle Sidebar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftClose, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPropertiesOpen(!propertiesOpen), className: `p-1.5 rounded-lg transition ${propertiesOpen ? "bg-[var(--brand)] text-white" : "text-[var(--fg-soft)] hover:bg-[var(--bg-subtle)]"}`, title: "Toggle Properties", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPreviewerOpen(!previewerOpen), className: `p-1.5 rounded-lg transition ${previewerOpen ? "bg-[var(--brand)] text-white" : "text-[var(--fg-soft)] hover:bg-[var(--bg-subtle)]"}`, title: "Toggle 3D Preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PanelRightClose, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: submitExport, className: "px-3 py-2 rounded-lg text-[var(--sea-ink-soft)] text-xs font-bold transition hover:bg-[var(--chip-bg)] flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
          " Save"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIs3DGenerated(true), className: "px-5 py-2 rounded-full bg-[var(--lagoon-deep)] text-white text-sm font-bold flex items-center gap-2 hover:bg-[var(--palm)] transition shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "h-4 w-4" }),
          " ",
          is3DGenerated ? "Live 3D Syncing" : "Generate 3D"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full shrink-0 z-10 shadow-xl border-r border-[var(--line)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { addElement }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex h-full flex-col relative z-0 min-w-0 bg-[var(--bg-base)]", children: editingWallId && editingWall ? /* @__PURE__ */ jsxRuntimeExports.jsx(WallCanvas, { wall: editingWall, onSave: (wallElements) => {
        handleUpdateElement(editingWall.id, {
          wallElements
        });
        setEditingWallId(null);
      }, onClose: () => setEditingWallId(null) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Canvas2, { elements, setElements, selectedId, onSelect: handleSelect, boothConfig, gridVisible }) }),
      propertiesOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 h-full border-l border-[var(--line)] z-20 shadow-[-8px_0_20px_rgba(0,0,0,0.05)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Properties, { selectedElement, onUpdate: handleUpdateElement, onDelete: () => handleDeleteElement(selectedId), onEditElevation: () => setEditingWallId(selectedId), boothConfig, onBoothConfigUpdate: (updates) => setBoothConfig((prev) => ({
        ...prev,
        ...updates
      })) }) }),
      previewerOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 shrink-0 bg-[var(--line)] hover:bg-[var(--lagoon)] cursor-col-resize z-30 transition-colors", onMouseDown: () => {
        const onMove = (e) => {
          if (e.buttons !== 1) return;
          const pct = e.clientX / window.innerWidth * 100;
          if (pct > 20 && pct < 85) setSplitWidth(pct);
        };
        const onUp = () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      } }),
      previewerOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        width: `${100 - splitWidth}%`
      }, className: "shrink-0 min-w-[180px] border-l border-[#1f2326] bg-[#121415] flex flex-col shadow-2xl z-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 border-b border-gray-800 flex items-center px-4 shrink-0 bg-[#0a0b0d]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-widest text-[#a1a1aa] font-bold", children: "3D Previewer" }) }),
        is3DGenerated ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 w-full relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Preview3D, { boothConfig, elements }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-[#121415]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "w-14 h-14 text-gray-800 mb-4 opacity-50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-gray-300 font-bold mb-1 text-sm", children: "3D Engine Offline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-[10px] max-w-[180px]", children: 'Place objects in the 2D layout and click "Generate 3D".' })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-6 border-t border-[var(--line)] bg-[var(--surface-strong)] flex items-center justify-between px-4 text-[10px] uppercase tracking-tighter font-bold text-[var(--sea-ink-soft)] select-none shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setGridVisible(!gridVisible), className: `px-2 py-1 rounded bg-[var(--line)] hover:bg-[var(--sand)] flex items-center gap-1 ${gridVisible ? "text-[var(--sea-ink)]" : "text-gray-400"}`, children: [
          "SNAP GRID (1M) ",
          gridVisible ? "ON" : "OFF"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Objects: ",
          elements.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Workspace: ",
          boothConfig.width,
          "m x ",
          boothConfig.depth,
          "m"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-green-500" }),
        " WebGL Ready"
      ] }) })
    ] })
  ] }, "editor-workspace");
}
export {
  EditorPage as component
};
