import { Link } from '@tanstack/react-router'
import { openCookieSettings } from '../lib/cookieConsent'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="page-wrap flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 no-underline" id="footer-logo">
          <div style={{
            width: 26, height: 26,
            background: 'var(--brand)',
            borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <path d="M12 3L3 8l9 5 9-5-9-5z" fill="white"/>
              <path d="M3 16l9 5 9-5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M3 12l9 5 9-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--fg)', fontSize: '0.95rem' }}>
            kreatekaro
          </span>
        </Link>

        <div className="footer-meta">
          <p>Advanced 3D Spatial Design Software &nbsp;·&nbsp; © {year}</p>
          <span aria-hidden="true">·</span>
          <Link to="/privacy">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms">Terms</Link>
          <span aria-hidden="true">·</span>
          <Link to="/cookie-policy">Cookie policy</Link>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={openCookieSettings}>Cookie settings</button>
        </div>
      </div>
    </footer>
  )
}
