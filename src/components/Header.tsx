import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { supabase } from '../lib/supabaseClient'
import { AuthModal } from './editor/AuthModal'
import { AnimatedHeaderLogo } from './AnimatedHeaderLogo'

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
          <AnimatedHeaderLogo />

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
              <div className="flex items-center gap-3 pl-2 sm:pl-0">
                <span className="hidden sm:block text-[11px] font-semibold text-[var(--fg-soft)] max-w-[140px] truncate">
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
              <div className="flex items-center pl-2 sm:pl-0">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-xs font-bold text-[var(--fg-soft)] hover:text-[var(--brand)] transition"
                >
                  Sign In
                </button>
              </div>
            )}
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
