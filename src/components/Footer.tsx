import { Link } from '@tanstack/react-router'

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
            3DM
          </span>
        </Link>

        <p style={{ margin: 0, color: 'var(--fg-dim)', fontSize: '0.82rem' }}>
          Advanced 3D Booth Designer &nbsp;·&nbsp; © {year}
        </p>
      </div>
    </footer>
  )
}
