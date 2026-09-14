import { useState, useEffect } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import UserMenuDropdown from './UserMenuDropdown'
import { getCurrentUser, signOut } from '../lib/authClient'
import type { User } from '../lib/authClient'
import { AuthModal } from './editor/AuthModal'
import { AnimatedHeaderLogo } from './AnimatedHeaderLogo'


export default function Header() {
  const [sessionUser, setSessionUser] = useState<User | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouterState()
  const navigate = useNavigate()
  const currentPath = router.location.pathname

  useEffect(() => { setMobileMenuOpen(false) }, [currentPath])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    setSessionUser(user)
  }

  useEffect(() => {
    checkAuth()
    if ((window as any).isAuthRedirect) setTimeout(checkAuth, 1000)
  }, [])

  const loginRedirectTo = currentPath.startsWith('/editor') ? null : '/dashboard'

  return (
    <>
      <header className="site-header">
        <nav className="page-wrap flex items-center gap-8 py-3.5">

          <AnimatedHeaderLogo />

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-7">
            <Link to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }} activeOptions={{ exact: true }}>Home</Link>
            <Link to="/about" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>Overview</Link>
            <Link to="/editor" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>Editor</Link>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            {sessionUser ? (
              <UserMenuDropdown user={sessionUser} onSignedOut={() => setSessionUser(null)} />
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-xs font-bold text-[var(--fg-soft)] hover:text-[var(--brand)] transition whitespace-nowrap cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center ml-2">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[var(--fg)] hover:text-[var(--brand)] transition-colors">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 w-full bg-[var(--color-bg-card)] backdrop-blur-md border-b border-[var(--color-border)] shadow-xl z-50 overflow-hidden">
            <div className="flex flex-col py-4 px-6 space-y-4">
              <Link to="/" className="text-[var(--fg)] font-bold text-lg py-2 border-b border-[var(--color-border)]" activeProps={{ className: 'text-[var(--brand)]' }} activeOptions={{ exact: true }}>Home</Link>
              <Link to="/about" className="text-[var(--fg)] font-bold text-lg py-2 border-b border-[var(--color-border)]" activeProps={{ className: 'text-[var(--brand)]' }}>Overview</Link>
              <Link to="/editor" className="text-[var(--fg)] font-bold text-lg py-2 border-b border-[var(--color-border)]" activeProps={{ className: 'text-[var(--brand)]' }}>Editor</Link>
              {sessionUser && (
                <>
                  <button onClick={async () => { await signOut(); setSessionUser(null); setMobileMenuOpen(false) }} className="text-left font-bold text-lg py-2 text-red-500">Log Out</button>
                </>
              )}
              {!sessionUser && (
                <button onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false) }} className="text-left font-bold text-lg py-2 text-[var(--brand)]">Sign In</button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        redirectTo={loginRedirectTo}
        onSuccess={() => {
          setAuthModalOpen(false)
          checkAuth()
          if (loginRedirectTo) navigate({ to: loginRedirectTo as any })
        }}
      />
    </>
  )
}
