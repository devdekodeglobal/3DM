import React, { useEffect, useState, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { signOut, getDisplayName } from '../lib/authClient'
import type { User } from '../lib/authClient'
import { LogOut, Settings, Sun, Moon, ChevronDown } from 'lucide-react'

interface UserMenuDropdownProps {
  user: User
  onSignedOut?: () => void
}

function getInitials(user: User): string {
  if (user.name) {
    const parts = user.name.trim().split(' ').filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return user.name.substring(0, 2).toUpperCase()
  }
  if (user.email) {
    const parts = user.email.split('@')[0].split(/[._-]/).filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return user.email.substring(0, 2).toUpperCase()
  }
  return 'U'
}

type ThemeMode = 'light' | 'dark'

function getCurrentTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = mode
}

export default function UserMenuDropdown({ user, onSignedOut }: UserMenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(getCurrentTheme)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleToggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light'

    if (!('startViewTransition' in document)) {
      setCurrentTheme(nextTheme)
      applyThemeMode(nextTheme)
      window.localStorage.setItem('theme', nextTheme)
      return
    }

    const x = e.clientX
    const y = e.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      setCurrentTheme(nextTheme)
      applyThemeMode(nextTheme)
      window.localStorage.setItem('theme', nextTheme)
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 800,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut()
    if (onSignedOut) {
      onSignedOut()
    } else {
      window.location.href = '/'
    }
  }

  const displayName = getDisplayName(user)
  const initials = getInitials(user)

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Clickable name & avatar badge */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(prev => !prev)
        }}
        className="flex items-center gap-2 py-1 px-1.5 rounded-full hover:bg-[var(--sand)] border border-transparent hover:border-[var(--line)] transition cursor-pointer group select-none"
        title="Account & Settings"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--lagoon)] to-[var(--brand)] text-white flex items-center justify-center text-[11px] font-bold shadow-xs shrink-0">
          {initials}
        </div>
        <span className="text-xs font-bold text-[var(--sea-ink)] max-w-[120px] truncate group-hover:text-[var(--brand)] transition-colors">
          {displayName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--sea-ink-soft)] group-hover:text-[var(--brand)] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--bg-card,#ffffff)] dark:bg-[#181a1d] border border-[var(--line)] shadow-2xl py-2 z-[9999] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* User Info Header */}
          <div className="px-4 py-2.5 border-b border-[var(--line)]">
            <p className="text-xs font-bold text-[var(--sea-ink)] truncate">{displayName}</p>
            <p className="text-[10px] text-[var(--sea-ink-soft)] truncate mt-0.5">{user.email}</p>
          </div>

          {/* Actions */}
          <div className="py-1">
            <Link
              to="/dashboard"
              search={{ tab: 'settings' } as any}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[var(--sea-ink)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[var(--sea-ink-soft)]" />
              <span>Account Settings</span>
            </Link>

            {/* Theme Toggle within dropdown */}
            <button
              onClick={handleToggleTheme}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-[var(--sea-ink)] hover:bg-[var(--sand)] hover:text-[var(--brand)] transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {currentTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-[var(--brand)]" />
                )}
                <span>Theme</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--sea-ink-soft)] font-mono bg-[var(--sand)] px-1.5 py-0.5 rounded border border-[var(--line)]">
                {currentTheme}
              </span>
            </button>
          </div>

          {/* Sign Out Divider */}
          <div className="pt-1 border-t border-[var(--line)]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
