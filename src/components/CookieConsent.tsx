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

const ANALYTICS_SCRIPT_ID = "kreatekaro-analytics";
const measurementId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID?.trim();

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

  for (const name of analyticsCookieNames) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
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
  window.gtag("config", measurementId, { anonymize_ip: true });

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
            <h2>Your privacy, your choice</h2>
            <p>
              We use necessary cookies to keep accounts secure and remember your
              preferences. With your permission, optional analytics may be used
              to understand how KreateKaro is used. Analytics stays off unless
              you accept.{" "}
              <Link to="/cookie-policy">Read our cookie policy</Link>.
            </p>
          </div>
          <div className="cookie-banner__actions">
            <button
              type="button"
              className="cookie-action cookie-action--secondary"
              onClick={() => chooseAnalytics(false)}
            >
              Only necessary cookies
            </button>
            <button
              type="button"
              className="cookie-action cookie-action--primary"
              onClick={() => chooseAnalytics(true)}
            >
              Accept analytics
            </button>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div
          className="cookie-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target && consent)
              setSettingsOpen(false);
          }}
        >
          <section
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
          >
            <div className="cookie-modal__header">
              <div>
                <span className="cookie-modal__eyebrow">
                  <ShieldCheck size={15} /> Privacy controls
                </span>
                <h2 id="cookie-settings-title">Cookie settings</h2>
              </div>
              <button
                type="button"
                className="cookie-modal__close"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close cookie settings"
              >
                <X size={20} />
              </button>
            </div>

            <p className="cookie-modal__intro">
              Choose whether KreateKaro may use optional analytics. Necessary
              cookies cannot be switched off because they provide secure sign-in
              and remember this choice.
            </p>

            <div className="cookie-preference">
              <div>
                <h3>Necessary cookies</h3>
                <p>
                  Used only when required for secure sign-in and to remember
                  your cookie choice. If you are not signed in, the session
                  cookie is not set.
                </p>
              </div>
              <span className="cookie-always-on">Required when needed</span>
            </div>

            <label className="cookie-preference cookie-preference--clickable">
              <div>
                <h3>Analytics cookies</h3>
                <p>
                  Help us measure visits and improve the experience. Off by
                  default.
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
              <Link to="/cookie-policy" onClick={() => setSettingsOpen(false)}>
                cookie policy
              </Link>
              .
            </p>

            <div className="cookie-modal__actions">
              <button
                type="button"
                className="cookie-action cookie-action--secondary"
                onClick={() => chooseAnalytics(false)}
              >
                Only necessary cookies
              </button>
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
