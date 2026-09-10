import { Link } from "@tanstack/react-router";
import { openCookieSettings } from "../lib/cookieConsent";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="page-wrap flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 no-underline"
          id="footer-logo"
        >
          <img
            src="/originals/original.png"
            alt="krafc Logo"
            className="h-8 dark:brightness-0 dark:invert"
          />
        </Link>

        <div className="footer-meta">
          <p>Advanced 3D Spatial Design Platform &nbsp;·&nbsp; © {year}</p>
          <span aria-hidden="true">·</span>
          <Link to="/privacy">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms">Terms</Link>
          <span aria-hidden="true">·</span>
          <Link to="/cookie-policy">Cookie policy</Link>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={openCookieSettings}>
            Cookie settings
          </button>
        </div>
      </div>
    </footer>
  );
}
