import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ScrollReveal } from "../components/ScrollReveal";
import { InteractiveWorkflowShowcase } from "../components/InteractiveWorkflowShowcase";

export const Route = createFileRoute("/")({ component: LandingPage });

/* ── inline SVG: top-down booth floor plan ── */
import { ArchitecturalSymbolSVG } from "../components/editor/ArchitecturalSymbolSVG";

function BoothIllustration() {
  return (
    <svg
      viewBox="0 0 320 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        width: "100%",
        maxWidth: 420,
        display: "block",
        margin: "0 auto",
      }}
      className="text-slate-800 dark:text-slate-200"
    >
      <defs>
        <pattern
          id="grid-p"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="1"
          />
          <path
            d="M 0 20 L 20 20"
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Background with Theme colors */}
      <rect
        width="320"
        height="380"
        className="fill-slate-50 dark:fill-slate-950"
        rx="12"
      />

      {/* Grid */}
      <rect width="320" height="380" fill="url(#grid-p)" rx="12" />

      {/* Blueprint Dimension Lines */}
      {/* Top Outer Dimension */}
      <g className="stroke-sky-500 fill-sky-500 font-sans text-[10px] font-bold">
        <line x1="30" y1="40" x2="290" y2="40" strokeWidth="1.5" />
        <line x1="30" y1="35" x2="30" y2="45" strokeWidth="1.5" />
        <line x1="290" y1="35" x2="290" y2="45" strokeWidth="1.5" />
        <rect
          x="135"
          y="32"
          width="50"
          height="16"
          rx="4"
          className="fill-slate-50 dark:fill-slate-900 stroke-sky-500"
          strokeWidth="1"
        />
        <text x="160" y="44" textAnchor="middle">
          4.10m
        </text>
      </g>

      {/* Left Outer Dimension */}
      <g className="stroke-sky-500 fill-sky-500 font-sans text-[10px] font-bold">
        <line x1="18" y1="60" x2="18" y2="340" strokeWidth="1.5" />
        <line x1="13" y1="60" x2="23" y2="60" strokeWidth="1.5" />
        <line x1="13" y1="340" x2="23" y2="340" strokeWidth="1.5" />
        <rect
          x="10"
          y="175"
          width="16"
          height="50"
          rx="4"
          className="fill-slate-50 dark:fill-slate-900 stroke-sky-500"
          strokeWidth="1"
        />
        <text
          x="17"
          y="200"
          textAnchor="middle"
          transform="rotate(90, 17, 200)"
        >
          5.50m
        </text>
      </g>

      {/* Door Width Dimension (Inner) */}
      <g className="stroke-sky-400/80 fill-sky-500/80 font-sans text-[8px] font-semibold">
        <line
          x1="295"
          y1="170"
          x2="295"
          y2="230"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <line x1="292" y1="170" x2="298" y2="170" strokeWidth="1" />
        <line x1="292" y1="230" x2="298" y2="230" strokeWidth="1" />
        <text
          x="303"
          y="200"
          textAnchor="middle"
          transform="rotate(90, 303, 200)"
        >
          0.90m
        </text>
      </g>

      {/* Window Width Dimension (Inner) */}
      <g className="stroke-sky-400/80 fill-sky-500/80 font-sans text-[8px] font-semibold">
        <line
          x1="22"
          y1="160"
          x2="22"
          y2="220"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <line x1="19" y1="160" x2="25" y2="160" strokeWidth="1" />
        <line x1="19" y1="220" x2="25" y2="220" strokeWidth="1" />
        <text
          x="14"
          y="190"
          textAnchor="middle"
          transform="rotate(-90, 14, 190)"
        >
          1.20m
        </text>
      </g>

      {/* Room Inner Dimension (Horizontal) */}
      <g className="stroke-slate-400/50 fill-slate-500/80 font-sans text-[8px] font-medium">
        <line x1="40" y1="325" x2="280" y2="325" strokeWidth="1" />
        <line x1="40" y1="322" x2="40" y2="328" strokeWidth="1" />
        <line x1="280" y1="322" x2="280" y2="328" strokeWidth="1" />
        <text x="160" y="321" textAnchor="middle">
          3.80m
        </text>
      </g>

      {/* Architectural Walls */}
      <g
        className="stroke-slate-700 dark:stroke-slate-400 fill-slate-100 dark:fill-slate-800"
        strokeWidth="1.5"
      >
        {/* Top Wall */}
        <rect x="30" y="50" width="260" height="10" />

        {/* Left Wall (Split for Window) */}
        <rect x="30" y="60" width="10" height="100" />
        <rect x="30" y="220" width="10" height="120" />

        {/* Right Wall (Split for Door) */}
        <rect x="280" y="60" width="10" height="110" />
        <rect x="280" y="230" width="10" height="110" />
      </g>

      {/* Window */}
      <g className="stroke-sky-400" strokeWidth="2">
        <line x1="32" y1="160" x2="32" y2="220" />
        <line x1="38" y1="160" x2="38" y2="220" />
        <line
          x1="30"
          y1="160"
          x2="40"
          y2="160"
          strokeWidth="1.5"
          className="stroke-slate-700 dark:stroke-slate-400"
        />
        <line
          x1="30"
          y1="220"
          x2="40"
          y2="220"
          strokeWidth="1.5"
          className="stroke-slate-700 dark:stroke-slate-400"
        />
      </g>

      {/* Door Swing */}
      <g className="stroke-sky-600 dark:stroke-sky-400">
        {/* Door Fill */}
        <path
          d="M 280 230 L 220 230 A 60 60 0 0 1 280 170 Z"
          fill="rgba(14,165,233,0.1)"
          stroke="none"
        />
        {/* Door Arc Line */}
        <path
          d="M 220 230 A 60 60 0 0 1 280 170"
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        {/* Door Panel */}
        <line
          x1="220"
          y1="230"
          x2="280"
          y2="230"
          strokeWidth="4"
          className="stroke-amber-700 dark:stroke-amber-600"
          strokeLinecap="round"
        />
        <line
          x1="280"
          y1="170"
          x2="290"
          y2="170"
          strokeWidth="1.5"
          className="stroke-slate-700 dark:stroke-slate-400"
        />
      </g>

      {/* Furniture Symbols using ArchitecturalSymbolSVG via nested SVG */}
      <g
        className="text-[7.5px] font-sans font-semibold fill-slate-700 dark:fill-slate-300"
        textAnchor="middle"
      >
        {/* TV on the left wall */}
        <g transform="translate(30, 90)">
          {/* Mount */}
          <rect x="0" y="15" width="4" height="20" className="fill-slate-400" />
          {/* Screen Profile */}
          <rect
            x="4"
            y="0"
            width="6"
            height="50"
            rx="2"
            className="fill-slate-800 dark:fill-slate-200"
          />
          {/* Screen glow */}
          <rect
            x="10"
            y="5"
            width="2"
            height="40"
            className="fill-sky-400 opacity-80"
          />
        </g>
        <text x="60" y="118">
          85" TV
        </text>

        {/* Conference Table */}
        <g transform="translate(160, 160)">
          <svg x="-60" y="-40" width="120" height="80">
            <ArchitecturalSymbolSVG
              category="table"
              assetName="table"
              className="w-full h-full text-slate-800 dark:text-slate-200"
            />
          </svg>
          <text
            x="0"
            y="2"
            className="fill-slate-500/70 text-[6.5px] font-medium tracking-widest"
          >
            CONF. TABLE
          </text>
        </g>

        {/* Top Chair (tucked in) */}
        <g transform="translate(160, 112) rotate(180)">
          <svg x="-16" y="-16" width="32" height="32">
            <ArchitecturalSymbolSVG
              category="chairs"
              assetName="catifa"
              className="w-full h-full text-slate-800 dark:text-slate-200"
            />
          </svg>
        </g>

        {/* Bottom Chair (tucked in) */}
        <g transform="translate(160, 208) rotate(0)">
          <svg x="-16" y="-16" width="32" height="32">
            <ArchitecturalSymbolSVG
              category="chairs"
              assetName="catifa"
              className="w-full h-full text-slate-800 dark:text-slate-200"
            />
          </svg>
        </g>

        {/* Left Chair (tucked in) */}
        <g transform="translate(100, 160) rotate(90)">
          <svg x="-16" y="-16" width="32" height="32">
            <ArchitecturalSymbolSVG
              category="chairs"
              assetName="catifa"
              className="w-full h-full text-slate-800 dark:text-slate-200"
            />
          </svg>
        </g>

        {/* Right Chair (tucked in) */}
        <g transform="translate(220, 160) rotate(-90)">
          <svg x="-16" y="-16" width="32" height="32">
            <ArchitecturalSymbolSVG
              category="chairs"
              assetName="catifa"
              className="w-full h-full text-slate-800 dark:text-slate-200"
            />
          </svg>
        </g>

        {/* Corner Plant */}
        <g transform="translate(260, 70)">
          <circle
            cx="0"
            cy="0"
            r="14"
            className="fill-emerald-100 dark:fill-emerald-900 stroke-emerald-600 dark:stroke-emerald-400"
            strokeWidth="1.5"
          />
          <path
            d="M-8 -8 Q0 -15 8 -8 Q15 0 8 8 Q0 15 -8 8 Q-15 0 -8 -8"
            className="fill-emerald-200 dark:fill-emerald-800 opacity-70"
          />
          <circle
            cx="0"
            cy="0"
            r="4"
            className="fill-emerald-700 dark:fill-emerald-300"
          />
        </g>
      </g>

      {/* Live badge */}
      <g transform="translate(240, 350)">
        <rect
          x="0"
          y="0"
          width="62"
          height="14"
          rx="7"
          fill="#06b6d4"
          opacity="0.15"
        />
        <circle cx="8" cy="7" r="3" fill="#06b6d4">
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="14"
          y="10"
          fontSize="7"
          fill="#06b6d4"
          fontWeight="700"
          fontFamily="Inter"
        >
          LIVE SYNC
        </text>
      </g>
    </svg>
  );
}

const features = [
  {
    id: "feat-grid",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity="0.4"
        />
      </svg>
    ),
    title: "Precision 2D Grid",
    desc: "Snap-to-grid mechanics with pixel-perfect alignment for flawless spatial layouts.",
    color: "var(--brand)",
    bg: "var(--brand-bg)",
  },
  {
    id: "feat-3d",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path
          d="M12 2L2 7l10 5 10-5-10-5z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M2 17l10 5 10-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M2 12l10 5 10-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    ),
    title: "Live 3D Preview",
    desc: "High-performance real-time renderer that transforms your 2D plan into a 3D walkthrough.",
    color: "var(--accent)",
    bg: "var(--accent-bg)",
  },
  {
    id: "feat-assets",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path
          d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M16 3H8l-2 4h12l-2-4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Asset Library",
    desc: "Drag-and-drop fixtures  counters, chairs, desks, plants, signage - all to scale.",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
  },
  {
    id: "feat-export",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <polyline
          points="7 10 12 15 17 10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="12"
          y1="15"
          x2="12"
          y2="3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Save to Cloud",
    desc: "Save your 2D and 3D layouts securely to the cloud and access them from any device.",
    color: "var(--cta)",
    bg: "rgba(234,88,12,0.08)",
  },
];

const steps = [
  {
    id: "step-1",
    num: "01",
    title: "Set Your Space",
    desc: "Define the dimensions and drop outer walls on the 2D canvas.",
  },
  {
    id: "step-2",
    num: "02",
    title: "Place Fixtures",
    desc: "Drag counters, signage, seating, and décor from the asset library.",
  },
  {
    id: "step-3",
    num: "03",
    title: "Preview in 3D",
    desc: "Switch to Live 3D Preview to walk through your design in real time.",
  },
];

function LandingPage() {
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("stall-config")) {
      setHasDraft(true);
    }
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{ paddingTop: 72, paddingBottom: 40, overflow: "hidden" }}
      >
        <div
          className="page-wrap"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left copy */}
            <div className="fade-up">
              <div className="badge d-100 fade-up" style={{ marginBottom: 24 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--brand)",
                    display: "inline-block",
                    animation: "pulse-dot 1.6s ease-in-out infinite",
                  }}
                />
                v1.0 • Live 3D Sync
              </div>

              <h1
                className="display fade-up d-100"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 3.6rem)",
                  color: "var(--fg)",
                  margin: "0 0 20px",
                }}
              >
                Design 3D
                <br />
                <span style={{ color: "var(--brand)" }}>Spaces</span> with
                Precision
              </h1>

              <p
                className="fade-up d-200"
                style={{
                  fontSize: "1.05rem",
                  color: "var(--fg-soft)",
                  lineHeight: 1.7,
                  margin: "0 0 36px",
                  maxWidth: 440,
                }}
              >
                Professional 2D floor planning with snap-to-grid mechanics and a
                real-time 3D preview, all in your browser.
              </p>

              <div
                className="fade-up d-300"
                style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
              >
                {hasDraft ? (
                  <>
                    <Link
                      to="/editor"
                      id="hero-resume-design"
                      className="btn btn-primary"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        width="15"
                        height="15"
                      >
                        <path
                          d="M8 1v14M1 8h14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                      </svg>
                      Resume Design
                    </Link>
                    <Link
                      to="/editor"
                      id="hero-start-new"
                      onClick={() => {
                        localStorage.removeItem("stall-config");
                        localStorage.removeItem("stall-elements");
                      }}
                      className="btn btn-outline"
                    >
                      Start New Design
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/editor"
                    id="hero-start-designing"
                    className="btn btn-primary"
                  >
                    <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
                      <path
                        d="M8 1v14M1 8h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.7"
                      />
                    </svg>
                    Start Designing
                  </Link>
                )}
              </div>

              {/* Stats row */}
              <div
                className="fade-up d-400"
                style={{
                  display: "flex",
                  gap: 28,
                  marginTop: 40,
                  paddingTop: 28,
                  borderTop: "1px solid var(--border)",
                }}
              >
                {[
                  { val: "2D + 3D", label: "Dual View" },
                  { val: "50+", label: "Assets" },
                  { val: "Live", label: "Sync" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: 800,
                        fontSize: "1.35rem",
                        color: "var(--brand)",
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--fg-dim)",
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right illustration */}
            <div
              className="float fade-up d-200"
              style={{
                position: "relative",
                padding: 20,
                borderRadius: 20,
                background: "var(--bg-card)",
                border: "1px solid var(--border-brand)",
                boxShadow: "var(--shadow-lg)",
                maxWidth: 500,
                margin: "0 auto",
                width: "100%",
              }}
            >
              {/* Glow orbs */}
              <div
                style={{
                  position: "absolute",
                  width: 180,
                  height: 180,
                  background:
                    "radial-gradient(circle, rgba(79,70,229,0.14), transparent 70%)",
                  borderRadius: "50%",
                  top: -30,
                  right: -30,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 140,
                  height: 140,
                  background:
                    "radial-gradient(circle, rgba(8,145,178,0.10), transparent 70%)",
                  borderRadius: "50%",
                  bottom: -20,
                  left: -20,
                  pointerEvents: "none",
                }}
              />
              {/* Header bar of mock window */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: c,
                    }}
                  />
                ))}
                <div
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.7rem",
                    color: "var(--fg-dim)",
                    fontFamily: "Inter",
                    fontWeight: 500,
                  }}
                >
                  2D Floor Plan • 6×5 m
                </div>
              </div>
              <BoothIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "72px 0" }}>
        <div className="page-wrap">
          <ScrollReveal animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p
                className="label-caps"
                style={{ color: "var(--brand)", marginBottom: 10 }}
              >
                Features
              </p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                  color: "var(--fg)",
                  margin: 0,
                }}
              >
                Everything you need to design a perfect space
              </h2>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {features.map((f, i) => (
              <ScrollReveal key={f.id} animation="fade-up" delay={i * 180}>
                <article
                  id={f.id}
                  className="card"
                  style={{ padding: 28, height: "100%" }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: f.bg,
                      color: f.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                      border: `1px solid ${f.color}22`,
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 700,
                      fontSize: "1.08rem",
                      color: "var(--fg)",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: "var(--fg-soft)",
                      lineHeight: 1.65,
                    }}
                  >
                    {f.desc}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "72px 0", background: "var(--bg-subtle)" }}>
        <div className="page-wrap">
          <ScrollReveal animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <p
                className="label-caps"
                style={{ color: "var(--brand)", marginBottom: 10 }}
              >
                Workflow
              </p>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  color: "var(--fg)",
                  margin: 0,
                }}
              >
                How it works
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="zoom-in" delay={150}>
            <InteractiveWorkflowShowcase />
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "80px 16px" }}>
        <ScrollReveal animation="zoom-in">
          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              textAlign: "center",
              padding: "56px 40px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-brand)",
              borderRadius: 24,
              boxShadow: "var(--shadow-lg)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative gradient blobs */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(ellipse 70% 60% at 0% 0%, rgba(79,70,229,0.08), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(8,145,178,0.07), transparent)",
              }}
            />

            <div
              className="badge"
              style={{ marginBottom: 24, display: "inline-flex" }}
            >
              <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 5v3l2 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Ready in seconds
            </div>

            <h2
              className="display"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                color: "var(--fg)",
                margin: "0 0 16px",
              }}
            >
              Start designing your space today
            </h2>
            <p
              style={{
                color: "var(--fg-soft)",
                fontSize: "1rem",
                lineHeight: 1.7,
                margin: "0 0 36px",
              }}
            >
              No install needed. Open the designer and build your layout in
              minutes - then preview it live in 3D.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {hasDraft ? (
                <Link
                  to="/editor"
                  id="cta-resume-design"
                  className="btn btn-primary"
                >
                  Resume Your Design →
                </Link>
              ) : (
                <Link
                  to="/editor"
                  id="cta-open-designer"
                  className="btn btn-primary"
                >
                  Start Designing Now →
                </Link>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </>
  );
}
