import { useState, useEffect } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { supabase } from '../lib/supabaseClient'
import { AuthModal } from './editor/AuthModal'
import { AnimatedHeaderLogo } from './AnimatedHeaderLogo'

export default function Header() {
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouterState()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [router.location.pathname])

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
          <AnimatedHeaderLogo />

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-7">
            <Link to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }} activeOptions={{ exact: true }}>
              Home
            </Link>
            <Link to="/about" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
              Overview
            </Link>
            <Link to="/editor" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
              Editor
            </Link>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            {/* Auth Controls */}
            {sessionUser ? (
              <div className="flex items-center gap-3 pl-2 sm:pl-0">
                <span className="hidden sm:block text-[11px] font-semibold text-[var(--fg-soft)] max-w-[140px] truncate">
                  {sessionUser.email}
                </span>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut()
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition whitespace-nowrap"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center pl-2 sm:pl-0">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-xs font-bold text-[var(--fg-soft)] hover:text-[var(--brand)] transition whitespace-nowrap"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center ml-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--fg)] hover:text-[var(--brand)] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 w-full bg-[var(--color-bg-card)] backdrop-blur-md border-b border-[var(--color-border)] shadow-xl z-50 overflow-hidden">
            <div className="flex flex-col py-4 px-6 space-y-4">
              <Link to="/" className="text-[var(--fg)] font-bold text-lg py-2 border-b border-[var(--color-border)]" activeProps={{ className: 'text-[var(--brand)]' }} activeOptions={{ exact: true }}>
                Home
              </Link>
              <Link to="/about" className="text-[var(--fg)] font-bold text-lg py-2 border-b border-[var(--color-border)]" activeProps={{ className: 'text-[var(--brand)]' }}>
                Overview
              </Link>
              <Link to="/editor" className="text-[var(--fg)] font-bold text-lg py-2 border-b border-[var(--color-border)]" activeProps={{ className: 'text-[var(--brand)]' }}>
                Editor
              </Link>
              
              {!sessionUser && (
                <button
                  onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
                  className="text-left font-bold text-lg py-2 text-[var(--brand)]"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  )
}
