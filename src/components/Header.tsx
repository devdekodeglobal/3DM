import { useState, useEffect } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { getCurrentUser, signOut } from '../lib/authClient'
import type { User } from '../lib/authClient'
import { AuthModal } from './editor/AuthModal'
import { AnimatedHeaderLogo } from './AnimatedHeaderLogo'

function getInitials(user: User | null) {
  if (!user) return '?'
  const name = user.name
  if (name) {
    const parts = name.split(' ').filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }
  if (user.email) {
    const parts = user.email.split('@')[0].split(/[._-]/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return user.email.substring(0, 2).toUpperCase()
  }
  return 'U'
}

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
            {sessionUser && (
              <Link to="/dashboard" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>Dashboard</Link>
            )}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            {sessionUser ? (
              <div className="flex items-center gap-3">
                {sessionUser.avatar_url ? (
                  <Link to="/dashboard">
                    <img src={sessionUser.avatar_url} alt="" className="w-7 h-7 rounded-full ring-2 ring-[var(--brand)]/20" style={{ objectFit: 'cover' }} />
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <div className="w-7 h-7 rounded-full bg-[var(--brand)] text-white flex items-center justify-center text-[10px] font-bold shadow-sm ring-2 ring-[var(--brand)]/20" title={sessionUser.email}>
                      {getInitials(sessionUser)}
                    </div>
                  </Link>
                )}
                <button
                  onClick={async () => { await signOut(); setSessionUser(null) }}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition whitespace-nowrap"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-xs font-bold text-[var(--fg-soft)] hover:text-[var(--brand)] transition whitespace-nowrap"
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
                <Link to="/dashboard" className="text-[var(--fg)] font-bold text-lg py-2 border-b border-[var(--color-border)]" activeProps={{ className: 'text-[var(--brand)]' }}>Dashboard</Link>
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
