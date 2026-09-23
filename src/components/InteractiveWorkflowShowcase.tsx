import { useState, useEffect } from "react";
import { AfterglowBlueprint } from "./AfterglowBlueprint";
import Preview3D from "./editor/Preview3D";
import { Check, Cloud } from "lucide-react";
import { HERO_AFTERGLOW_BOOTH_CONFIG, HERO_AFTERGLOW_ELEMENTS } from "./heroAfterglowData";

export function InteractiveWorkflowShowcase() {
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance loop every 3.5 seconds if user hasn't manually clicked
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => ((prev + 1) % 4) as any);
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const steps = [
    {
      num: "01",
      title: "1. Set Your Space",
      subtitle: "Define dimensions & outer walls",
      desc: "Set the dimensions and layout of your space.",
    },
    {
      num: "02",
      title: "2. Place Assets",
      subtitle: "Drag & drop scaled 2D symbols",
      desc: "Position symbols with automatic snap alignment.",
    },
    {
      num: "03",
      title: "3. Preview in 3D",
      subtitle: "Instant 3D spatial walkthrough",
      desc: "See your space in 3D.",
    },
    {
      num: "04",
      title: "4. Save to Cloud",
      subtitle: "Instant sync & device access",
      desc: "Access your space anywhere.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-[var(--bg-card)] border border-[var(--border-brand)] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--brand)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid: Left Controls + Right Animated Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Side: Step selector cards */}
        <div className="md:col-span-5 space-y-3">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={s.num}
                onClick={() => {
                  setActiveStep(idx as any);
                  setIsAutoPlaying(false);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                  isActive
                    ? "bg-[var(--surface-strong)] border-[var(--brand)] shadow-lg shadow-[var(--brand)]/10"
                    : "bg-[var(--bg-page)]/60 border-[var(--line)] hover:border-[var(--brand)]/40 hover:bg-[var(--surface-strong)]"
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--brand)] rounded-r" />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 transition-colors ${
                      isActive
                        ? "bg-[var(--brand)] text-white"
                        : "bg-[var(--brand-bg)] text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white"
                    }`}
                  >
                    {s.num}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--fg)]">
                      {s.title}
                    </h4>
                    <p className="text-xs text-[var(--fg-soft)] mt-0.5">
                      {s.subtitle}
                    </p>
                  </div>
                </div>

                {/* Progress bar inside active step */}
                {isActive && isAutoPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--brand)]/10">
                    <div
                      className="h-full bg-[var(--brand)] animate-progress-fill"
                      style={{ animationDuration: "3.5s" }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Animated Mock Canvas Showcase */}
        <div className="md:col-span-7 bg-[var(--bg-subtle)] border border-[var(--line)] rounded-2xl p-4 md:p-6 min-h-[360px] flex flex-col justify-between relative overflow-hidden shadow-inner">
          {/* Header Bar of Mock Canvas */}
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[11px] font-mono text-[var(--fg-dim)] ml-2 font-semibold">
                krafc Workspace
              </span>
            </div>

            {/* Viewport Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all duration-300 ${
                  activeStep === 2
                    ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
                    : "bg-[var(--brand-bg)] text-[var(--brand)]"
                }`}
              >
                {activeStep === 2 ? "3D VIEWPORT" : "2D BLUEPRINT"}
              </span>
            </div>
          </div>

          {/* Canvas Display Content based on Step */}
          <div className="flex-1 flex items-center justify-center relative min-h-[260px] w-full">
            {/* Step 0: Set Your Space Animation */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform ${activeStep === 0 ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}`}
            >
              <div className="w-full max-w-[440px] h-[260px] rounded-xl overflow-hidden border border-[var(--brand)]/30 shadow-2xl bg-[var(--bg-card)] p-3">
                <AfterglowBlueprint mode="space" />
              </div>
            </div>

            {/* Step 1: Place Assets Animation */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform ${activeStep === 1 ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}`}
            >
              <div className="w-full max-w-[440px] h-[260px] rounded-xl overflow-hidden border border-[var(--brand)]/30 shadow-2xl relative bg-[var(--bg-card)] flex items-center justify-center p-4">
                <AfterglowBlueprint mode="assets" />
              </div>
            </div>

            {/* Step 2: 3D Viewport Room Showcase - AFTERGLOW Chill & Social Club */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform ${activeStep === 2 ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}`}
            >
              <div className="w-full max-w-[440px] h-[260px] rounded-xl overflow-hidden border border-indigo-500/30 shadow-2xl relative bg-[var(--bg-card)] pointer-events-none">
                <Preview3D
                  cinematicTour={true}
                  autoRotate={false}
                  hideControls={true}
                  boothConfig={HERO_AFTERGLOW_BOOTH_CONFIG}
                  elements={HERO_AFTERGLOW_ELEMENTS as any}
                  activeView="perspective"
                  backgroundColor="#1e293b"
                  cameraDistanceScale={0.68}
                />
              </div>
            </div>

            {/* Step 3: Save to Cloud Animation */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform ${activeStep === 3 ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}`}
            >
              <div className="w-full max-w-[280px] h-[220px] rounded-xl bg-[var(--bg-card)] border border-[var(--border-brand)] p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-3 relative">
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center border border-[var(--brand)]/20 shadow-inner">
                  <Cloud className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h5 className="font-extrabold text-sm text-[var(--fg)] flex items-center justify-center gap-1">
                    <Check className="w-4 h-4 text-emerald-500" /> Synced
                  </h5>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Auto-Save Active
                </div>
              </div>
            </div>
          </div>

          {/* Footer note inside mock canvas */}
          <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--fg-soft)]">
            <span className="font-semibold">{steps[activeStep].desc}</span>
            <span className="font-mono text-[10px] text-[var(--fg-dim)]">
              Step {activeStep + 1} / 4
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
