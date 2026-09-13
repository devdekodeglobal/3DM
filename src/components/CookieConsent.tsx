import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, ShieldCheck, X } from "lucide-react";
import {
  COOKIE_CONSENT_EVENT,
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookieConsent,
  saveCookieConsent,
  type CookieConsent as CookieConsentValue,
} from "../lib/cookieConsent";

const ANALYTICS_SCRIPT_ID = "krafc-analytics";
const measurementId =
  import.meta.env.VITE_GOOGLE_ANALYTICS_ID?.trim() || "G-B55SFQ2GER";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

function removeAnalyticsCookies() {
  const analyticsCookieNames = document.cookie
    .split("; ")
    .map((cookie) => cookie.split("=")[0])
    .filter(
      (name) =>
        name === "_ga" ||
        name === "_gid" ||
        name === "_gat" ||
        name.startsWith("_ga_"),
    );

  const hostname = location.hostname;
  const hostnameParts = hostname.split(".");
  const domainCandidates = new Set<string | null>([null]);

  if (hostname && hostname !== "localhost") {
    domainCandidates.add(hostname);
    if (hostnameParts.length > 2) {
      domainCandidates.add(hostnameParts.slice(-2).join("."));
    }
  }

  const secure = location.protocol === "https:" ? "; Secure" : "";
  for (const name of analyticsCookieNames) {
    for (const domain of domainCandidates) {
      const domainAttribute = domain ? `; Domain=.${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${secure}${domainAttribute}`;
    }
  }
}

function disableAnalytics() {
  if (measurementId) window[`ga-disable-${measurementId}`] = true;
  document.getElementById(ANALYTICS_SCRIPT_ID)?.remove();
  removeAnalyticsCookies();
}

function enableAnalytics() {
  if (!measurementId || document.getElementById(ANALYTICS_SCRIPT_ID)) return;

  window[`ga-disable-${measurementId}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.id = ANALYTICS_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsentValue | null>(null);
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsSelected, setAnalyticsSelected] = useState(false);

  useEffect(() => {
    const stored = readCookieConsent();
    setConsent(stored);
    setAnalyticsSelected(stored?.analytics ?? false);
    setHasCheckedConsent(true);

    const handleConsentChange = (event: Event) => {
      const next = (event as CustomEvent<CookieConsentValue>).detail;
      setConsent(next);
      setAnalyticsSelected(next.analytics);
    };
    const handleOpenSettings = () => {
      const current = readCookieConsent();
      setAnalyticsSelected(current?.analytics ?? false);
      setSettingsOpen(true);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
      window.removeEventListener(
        OPEN_COOKIE_SETTINGS_EVENT,
        handleOpenSettings,
      );
    };
  }, []);

  useEffect(() => {
    if (!hasCheckedConsent) return;
    if (consent?.analytics) enableAnalytics();
    else disableAnalytics();
  }, [consent, hasCheckedConsent]);

  const chooseAnalytics = (analytics: boolean) => {
    const next = saveCookieConsent(analytics);
    setConsent(next);
    setAnalyticsSelected(analytics);
    setSettingsOpen(false);
  };

  const closeSettings = () => {
    // Revert uncommitted toggle selection back to existing consent
    setAnalyticsSelected(consent?.analytics ?? false);
    setSettingsOpen(false);
  };

  useEffect(() => {
    if (!settingsOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSettings();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settingsOpen, consent]);

  if (!hasCheckedConsent) return null;

  return (
    <>
      {!consent && !settingsOpen && (
        <section
          className="cookie-banner"
          aria-label="Cookie consent"
          aria-live="polite"
        >
          <div className="cookie-banner__icon" aria-hidden="true">
            <Cookie size={22} />
          </div>
          <div className="cookie-banner__copy">
            <h2>We use cookies to improve your krafc experience.</h2>
            <p>
              krafc uses necessary cookies to keep the platform secure, remember
              your preferences, and provide a smooth experience. With your
              permission, we also use optional Google Analytics cookies to
              understand how the platform is used and improve krafc. Necessary
              cookies remain enabled because they are required for the platform
              to function properly. To learn more, read our{" "}
              <Link to="/cookie-policy">Cookie Policy</Link>.
            </p>
          </div>
          <div className="cookie-banner__actions">
            <button
              type="button"
              className="cookie-action cookie-action--secondary"
              onClick={() => chooseAnalytics(true)}
            >
              Accept All
            </button>
            <button
              type="button"
              className="cookie-action cookie-action--secondary"
              onClick={() => chooseAnalytics(false)}
            >
              Decline Optional
            </button>
            <button
              type="button"
              className="cookie-manage"
              onClick={() => {
                setAnalyticsSelected(false);
                setSettingsOpen(true);
              }}
            >
              Cookie Settings
            </button>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div
          className="cookie-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              closeSettings();
            }
          }}
        >
          <section
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Cookie settings"
          >
            <div className="cookie-modal__header">
              <div>
                <span className="cookie-modal__eyebrow">
                  <ShieldCheck size={15} /> Cookie settings
                </span>
                {/* <h2 id="cookie-settings-title">Cookie settings</h2> */}
              </div>
              <button
                type="button"
                className="cookie-modal__close"
                onClick={closeSettings}
                aria-label="Close cookie settings"
              >
                <X size={20} />
              </button>
            </div>

            {/*    <p className="cookie-modal__intro">
              Choose whether krafc may use Google Analytics. Necessary cookies
              are always allowed because they support core site functions,
              security, and your saved cookie choice.
            </p> */}

            <div className="cookie-preference">
              <div>
                <h3>Necessary cookies</h3>
                <p>
                  Required for core site functions, security, and remembering
                  your cookie choice. Sign-in/session cookies are used only when
                  needed, such as after you sign in.
                </p>
              </div>
              <span className="cookie-always-on">Always active</span>
            </div>

            <label className="cookie-preference cookie-preference--clickable">
              <div>
                <h3>Analytics cookies</h3>
                <p>
                  Google Analytics helps us measure visits and improve the
                  experience. Off by default until you consent.
                </p>
              </div>
              <span className="cookie-switch">
                <input
                  type="checkbox"
                  checked={analyticsSelected}
                  onChange={(event) =>
                    setAnalyticsSelected(event.target.checked)
                  }
                />
                <span aria-hidden="true" />
              </span>
            </label>

            <p className="cookie-modal__policy">
              See providers, expiry periods, and data sharing in our{" "}
              <Link to="/cookie-policy" onClick={closeSettings}>
                Cookie Policy
              </Link>
              .
            </p>

            <div className="cookie-modal__actions">
              {/*  <button
                type="button"
                className="cookie-action cookie-action--secondary"
                onClick={() => chooseAnalytics(false)}
              >
                Reject cookies
              </button> */}
              <button
                type="button"
                className="cookie-action cookie-action--primary"
                onClick={() => chooseAnalytics(analyticsSelected)}
              >
                Save choices
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
