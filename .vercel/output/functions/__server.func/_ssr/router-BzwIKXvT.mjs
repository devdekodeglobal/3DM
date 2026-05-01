import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function Footer() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "site-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-wrap flex flex-col sm:flex-row items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 no-underline", id: "footer-logo", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: 26,
        height: 26,
        background: "var(--brand)",
        borderRadius: 7,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", width: "14", height: "14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 3L3 8l9 5 9-5-9-5z", fill: "white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 16l9 5 9-5", stroke: "white", strokeWidth: "1.8", strokeLinecap: "round" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 12l9 5 9-5", stroke: "white", strokeWidth: "1.8", strokeLinecap: "round", opacity: "0.6" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "Outfit, sans-serif", fontWeight: 700, color: "var(--fg)", fontSize: "0.95rem" }, children: "3DM" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: 0, color: "var(--fg-dim)", fontSize: "0.82rem" }, children: [
      "Advanced 3D Booth Designer  ·  © ",
      year
    ] })
  ] }) });
}
function getInitialMode() {
  if (typeof window === "undefined") {
    return "auto";
  }
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored;
  }
  return "auto";
}
function applyThemeMode(mode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "auto" ? prefersDark ? "dark" : "light" : mode;
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
  if (mode === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", mode);
  }
  document.documentElement.style.colorScheme = resolved;
}
function ThemeToggle() {
  const [mode, setMode] = reactExports.useState("auto");
  reactExports.useEffect(() => {
    const initialMode = getInitialMode();
    setMode(initialMode);
    applyThemeMode(initialMode);
  }, []);
  reactExports.useEffect(() => {
    if (mode !== "auto") {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeMode("auto");
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [mode]);
  function toggleMode() {
    const nextMode = mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
    setMode(nextMode);
    applyThemeMode(nextMode);
    window.localStorage.setItem("theme", nextMode);
  }
  const label = mode === "auto" ? "Theme mode: auto (system). Click to switch to light mode." : `Theme mode: ${mode}. Click to switch mode.`;
  const icon = mode === "dark" ? (
    /* moon */
    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", width: "15", height: "15", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" }) })
  ) : mode === "light" ? (
    /* sun */
    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", width: "15", height: "15", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z", clipRule: "evenodd" }) })
  ) : (
    /* auto */
    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", width: "15", height: "15", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2v12A6 6 0 0110 4z" }) })
  );
  const text = mode === "auto" ? "Auto" : mode === "dark" ? "Dark" : "Light";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      id: "theme-toggle",
      type: "button",
      onClick: toggleMode,
      "aria-label": label,
      title: label,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 50,
        border: "1px solid var(--border-brand)",
        background: "var(--brand-bg)",
        color: "var(--brand)",
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 180ms ease",
        fontFamily: "Inter, sans-serif"
      },
      children: [
        icon,
        text
      ]
    }
  );
}
function Header() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "site-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "page-wrap flex items-center gap-8 py-3.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5 flex-shrink-0 no-underline", id: "logo-link", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: 34,
        height: 34,
        background: "var(--brand)",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--shadow-brand)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", fill: "none", width: "18", height: "18", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 3L3 8l9 5 9-5-9-5z", fill: "white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 16l9 5 9-5", stroke: "white", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 12l9 5 9-5", stroke: "white", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", opacity: "0.65" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        fontFamily: "Outfit, sans-serif",
        fontWeight: 800,
        fontSize: "1.15rem",
        color: "var(--fg)",
        letterSpacing: "-0.02em"
      }, children: "3DM" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "nav-link", activeProps: { className: "nav-link is-active" }, children: "Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/editor", className: "nav-link", activeProps: { className: "nav-link is-active" }, children: "Editor" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/editor",
          id: "header-open-editor",
          onClick: () => {
            localStorage.removeItem("stall-config");
            localStorage.removeItem("stall-elements");
          },
          className: "btn btn-primary hidden sm:inline-flex",
          style: { padding: "9px 22px", fontSize: "0.875rem" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 16 16", fill: "none", width: "15", height: "15", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "1", y: "1", width: "6", height: "6", rx: "1.2", fill: "currentColor", opacity: "0.8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "1", width: "6", height: "6", rx: "1.2", fill: "currentColor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "1", y: "9", width: "6", height: "6", rx: "1.2", fill: "currentColor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "9", width: "6", height: "6", rx: "1.2", fill: "currentColor", opacity: "0.5" })
            ] }),
            "Open Designer"
          ]
        }
      )
    ] })
  ] }) });
}
const appCss = "/assets/styles-H__wmsNr.css";
const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;
const Route$3 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "3DM — Advanced 3D Booth Designer" },
      { name: "description", content: "Design exhibition booths with precision. 2D floor planning + real-time 3D visualization." }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("script", { dangerouslySetInnerHTML: { __html: THEME_INIT_SCRIPT } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { suppressHydrationWarning: true, className: "antialiased", style: { overflowWrap: "anywhere" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children }, "page-content"),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$2 = () => import("./editor-D08b22P0.mjs");
const Route$2 = createFileRoute("/editor")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-CXr0J6fq.mjs");
const Route$1 = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-BorsSNu4.mjs");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const EditorRoute = Route$2.update({
  id: "/editor",
  path: "/editor",
  getParentRoute: () => Route$3
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$3
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  EditorRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
  });
  return router;
}
export {
  getRouter
};
