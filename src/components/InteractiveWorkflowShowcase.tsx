/**
 * InteractiveWorkflowShowcase
 *
 * Showcases the 4-step workflow. Preview3D is pre-mounted hidden from step 0
 * so the BabylonJS scene warms up during steps 0→1→2 (12s). By the time the
 * user reaches step 3 "3D View" the scene is fully loaded — no lag.
 * The editor (Preview3D.tsx) is not modified in any way.
 */
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { AfterglowBlueprint } from "./AfterglowBlueprint";
import { TechBlueprint } from "./TechBlueprint";
import { PavilionBlueprint } from "./PavilionBlueprint";
import { Sparkles, Pen, ScanLine, LayoutGrid, Box, ImagePlay } from "lucide-react";
import { SHOWCASE_PROJECTS, type ShowcaseProject } from "./showcaseProjectsData";
import { Link } from "@tanstack/react-router";

// Lazy-load Preview3D so it doesn't block initial page render,
// but once loaded it stays mounted (hidden) until step 3.
const Preview3D = lazy(() => import("./editor/Preview3D"));

const PROJECT_SHORT_NAMES: Record<string, string> = {
  "afterglow-lounge": "Lounge Bar",
  "corner-tech-booth": "Tech Booth",
  "design-1x-pavilion": "Pavilion",
};

const STEPS = [
  { num: "01", label: "Set Space", Icon: ScanLine  },
  { num: "02", label: "Blueprint", Icon: LayoutGrid },
  { num: "03", label: "3D View",   Icon: Box        },
  { num: "04", label: "Render",    Icon: ImagePlay  },
];

// Per-step display durations (ms)
// Steps 0-1 are quick; steps 2-3 give the user time to appreciate the 3D + renders
const STEP_DURATIONS = [2200, 2200, 6500, 6500];

export function InteractiveWorkflowShowcase() {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0);
  const [activeRenderIndex, setActiveRenderIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentProject: ShowcaseProject =
    SHOWCASE_PROJECTS[selectedProjectIndex] || SHOWCASE_PROJECTS[0];
  const currentRender =
    currentProject.renders[activeRenderIndex] || currentProject.renders[0];

  // Auto-advance 0→1→2→3→0 using per-step durations
  useEffect(() => {
    if (isPaused) return;
    const duration = STEP_DURATIONS[activeStep] ?? 4000;
    const t = setTimeout(
      () => setActiveStep((p) => ((p + 1) % 4) as 0 | 1 | 2 | 3),
      duration,
    );
    return () => clearTimeout(t);
  }, [isPaused, activeStep]);

  // Auto-cycle render images when on step 3
  useEffect(() => {
    if (activeStep !== 3 || currentProject.renders.length <= 1) return;
    const t = setInterval(
      () => setActiveRenderIndex((p) => (p + 1) % currentProject.renders.length),
      3200,
    );
    return () => clearInterval(t);
  }, [activeStep, currentProject.renders.length]);

  // Reset on project switch, restart auto-play
  useEffect(() => {
    setActiveRenderIndex(0);
    setIsPaused(false);
    setActiveStep(0);
  }, [selectedProjectIndex]);

  const handleStepClick = useCallback((idx: number) => {
    setActiveStep(idx as 0 | 1 | 2 | 3);
    setIsPaused(true);
  }, []);

  const viewportBadge =
    activeStep === 3 ? "RENDER VIEW"
    : activeStep === 2 ? "3D SPATIAL"
    : activeStep === 1 ? "BLUEPRINT"
    : "SET SPACE";

  const footerDesc =
    activeStep === 3 ? currentRender.description
    : activeStep === 2 ? "Live WebGL — custom materials, lighting & elevation view."
    : activeStep === 1 ? "Furniture, counters, and lighting snapped to real scale."
    : `${currentProject.dimensions} perimeter with wall configuration.`;

  return (
    <div className="w-full max-w-5xl mx-auto bg-[var(--bg-card)] border border-[var(--border-brand)] rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--brand)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── 1. Project pills ── */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-none pb-0.5">
        {SHOWCASE_PROJECTS.map((proj, idx) => {
          const isSelected = selectedProjectIndex === idx;
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectIndex(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                isSelected
                  ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-md shadow-[var(--brand)]/20"
                  : "bg-[var(--bg-subtle)] text-[var(--fg-soft)] border-[var(--line)] hover:border-[var(--brand)]/40 hover:text-[var(--fg)]"
              }`}
            >
              {PROJECT_SHORT_NAMES[proj.id] ?? proj.name}
            </button>
          );
        })}
      </div>

      {/* ── 2. Canvas window ── */}
      <div className="bg-[var(--bg-subtle)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-inner">
        {/* Title bar */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-[var(--line)] bg-[var(--bg-card)]/60 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-[11px] font-mono text-[var(--fg-dim)] ml-2 font-semibold">
              {PROJECT_SHORT_NAMES[currentProject.id] ?? currentProject.name}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-all duration-300 ${
              activeStep === 3
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20"
                : activeStep === 2
                ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md"
                : "bg-[var(--brand-bg)] text-[var(--brand)]"
            }`}
          >
            {viewportBadge}
          </span>
        </div>

        {/* All panels live in a fixed-height container */}
        <div className="relative overflow-hidden" style={{ height: "min(58vw, 460px)" }}>

          {/* Step 0 — Set Space */}
          <div className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-700 ease-in-out ${activeStep === 0 ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}`}>
            <div className="w-full h-full rounded-xl overflow-hidden border border-[var(--brand)]/20 bg-[var(--bg-card)]">
              {currentProject.id === "corner-tech-booth" ? <TechBlueprint mode="space" />
                : currentProject.id === "design-1x-pavilion" ? <PavilionBlueprint mode="space" />
                : <AfterglowBlueprint mode="space" />}
            </div>
          </div>

          {/* Step 1 — Blueprint */}
          <div className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-700 ease-in-out ${activeStep === 1 ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}`}>
            <div className="w-full h-full rounded-xl overflow-hidden border border-[var(--brand)]/20 bg-[var(--bg-card)]">
              {currentProject.id === "corner-tech-booth" ? <TechBlueprint mode="assets" />
                : currentProject.id === "design-1x-pavilion" ? <PavilionBlueprint mode="assets" />
                : <AfterglowBlueprint mode="assets" />}
            </div>
          </div>

          {/* Step 2 — 3D Spatial
               Key trick: rendered at ALL times but visually hidden when not active.
               This lets BabylonJS warm up during steps 0 & 1 (8 s total) so by
               the time the user reaches step 2 the scene is already populated. */}
          <div
            className="absolute inset-0 p-2 transition-all duration-700 ease-in-out"
            style={{
              opacity: activeStep === 2 ? 1 : 0,
              transform: activeStep === 2 ? "scale(1)" : "scale(0.95)",
              zIndex: activeStep === 2 ? 10 : 0,
              pointerEvents: activeStep === 2 ? "auto" : "none",
            }}
          >
            <div className="w-full h-full rounded-xl overflow-hidden border border-violet-500/20">
              {/* Always mounted — stays alive so the scene doesn't reload each time */}
              <Suspense fallback={<div className="w-full h-full bg-slate-900 animate-pulse rounded-xl" />}>
                <Preview3D
                  key={currentProject.id}
                  cinematicTour={true}
                  autoRotate={false}
                  hideControls={true}
                  boothConfig={currentProject.boothConfig}
                  elements={currentProject.elements as any}
                  activeView="perspective"
                  backgroundColor="#1e293b"
                  cameraDistanceScale={0.68}
                />
              </Suspense>
            </div>
          </div>

          {/* Step 3 — Photorealistic Render */}
          <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${activeStep === 3 ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}`}>
            <div className="w-full h-full relative group overflow-hidden rounded-sm">
              <img
                src={currentRender.url}
                alt={currentRender.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 pointer-events-none" />

              {/* Render angle dots */}
              {currentProject.renders.length > 1 && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 z-20">
                  {currentProject.renders.map((r, rIdx) => (
                    <button
                      key={r.label}
                      aria-label={r.label}
                      onClick={(e) => { e.stopPropagation(); setActiveRenderIndex(rIdx); }}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${activeRenderIndex === rIdx ? "w-4 h-1.5 bg-amber-400" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"}`}
                    />
                  ))}
                </div>
              )}

              {/* Edit in editor */}
              <div className="absolute bottom-3 right-3 z-10">
                <Link
                  to="/editor"
                  title={`Customise ${currentProject.name}`}
                  onClick={() => {
                    localStorage.setItem("stall-config", JSON.stringify(currentProject.boothConfig));
                    localStorage.setItem("stall-elements", JSON.stringify(currentProject.elements));
                    localStorage.setItem("current-design-name", currentProject.name);
                    localStorage.removeItem("current-design-id");
                    localStorage.removeItem("current-project-id");
                    localStorage.setItem("is-fresh-guest-design", "true");
                  }}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white/90 border border-white/20 hover:border-amber-400/50 transition-all flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <Pen className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3.5 py-2 border-t border-[var(--line)] flex items-center justify-between bg-[var(--bg-card)]/50">
          <span className="text-[10px] text-[var(--fg-soft)] font-semibold truncate max-w-[80%]">
            {footerDesc}
          </span>
          <span className="text-[10px] font-mono text-[var(--fg-dim)] shrink-0 ml-2">
            Step {activeStep + 1} / 4
          </span>
        </div>
      </div>

      {/* ── 3. Step tabs ── */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {STEPS.map(({ num, label, Icon }, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={num}
              onClick={() => handleStepClick(idx)}
              className={`relative flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer overflow-hidden ${
                isActive
                  ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-md shadow-[var(--brand)]/20"
                  : "bg-[var(--bg-subtle)] text-[var(--fg-soft)] border-[var(--line)] hover:border-[var(--brand)]/40 hover:text-[var(--fg)] hover:bg-[var(--surface-strong)]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-[var(--brand)]"}`} />
              <span className="truncate leading-none">{label}</span>
              {idx === 3 && (
                <Sparkles className={`w-2.5 h-2.5 shrink-0 hidden sm:block ${isActive ? "text-white/70" : "text-amber-400"}`} />
              )}

              {/* Auto-advance progress bar — duration matches this step */}
              {isActive && !isPaused && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 overflow-hidden">
                  <div
                    key={`prog-${idx}-${selectedProjectIndex}-${isPaused}`}
                    className="h-full bg-white/70 origin-left"
                    style={{ animation: `kbProgress ${STEP_DURATIONS[idx]}ms linear forwards` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes kbProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
