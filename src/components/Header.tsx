import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { supabase } from '../lib/supabaseClient'
import { AuthModal } from './editor/AuthModal'

export default function Header() {
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user || null)
    })
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setSessionUser(session?.user || null)
    })
    return () => authListener.subscription.unsubscribe()
  }, [])

  return (
    <>
      <header className="site-header">
        <nav className="page-wrap flex items-center gap-8 py-3.5">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline" id="logo-link">
            <div style={{
              width: 34, height: 34,
              background: 'var(--brand)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-brand)',
            }}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M12 3L3 8l9 5 9-5-9-5z" fill="white"/>
                <path d="M3 16l9 5 9-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12l9 5 9-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
              </svg>
            </div>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: 'var(--fg)',
              letterSpacing: '-0.02em',
            }}>3DM</span>
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-7">
            <Link to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }} activeOptions={{ exact: true }}>
              Home
            </Link>
            <Link to="/editor" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
              Editor
            </Link>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            
            {/* Auth Controls */}
            {sessionUser ? (
              <div className="hidden sm:flex items-center gap-3 border-r border-[var(--line)] pr-4">
                <span className="text-[11px] font-semibold text-[var(--fg-soft)] max-w-[140px] truncate">
                  {sessionUser.email}
                </span>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut()
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center border-r border-[var(--line)] pr-4">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-xs font-bold text-[var(--fg-soft)] hover:text-[var(--brand)] transition"
                >
                  Sign In
                </button>
              </div>
            )}

            <Link
              to="/editor"
              id="header-open-editor"
              onClick={() => {
                localStorage.removeItem('stall-config')
                localStorage.removeItem('stall-elements')
              }}
              className="btn btn-primary hidden sm:inline-flex"
              style={{ padding: '9px 22px', fontSize: '0.875rem' }}
            >
              <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
                <rect x="1" y="1" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.8"/>
                <rect x="9" y="1" width="6" height="6" rx="1.2" fill="currentColor"/>
                <rect x="1" y="9" width="6" height="6" rx="1.2" fill="currentColor"/>
                <rect x="9" y="9" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.5"/>
              </svg>
              Open Designer
            </Link>
          </div>
        </nav>
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={() => setAuthModalOpen(false)} 
      />
    </>
  )
}
