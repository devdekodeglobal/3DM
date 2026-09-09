// Frontend auth client - replaces supabaseClient.ts
// All calls go to our backend API

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  email_verified: number
}

export interface Design {
  id: string
  name: string
  config: string
  elements: string
  created_at: string
  updated_at: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (!res.ok) return null
    const data = (await res.json()) as { user: User | null }
    return data?.user || null
  } catch {
    return null
  }
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, name }),
  })
  const data = (await res.json()) as { message?: string; error?: string }
  if (!res.ok) throw new Error(data.error || 'Registration failed')
  return data
}

export async function signInWithEmail(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  const data = (await res.json()) as { message?: string; error?: string }
  if (!res.ok) throw new Error(data.error || 'Sign in failed')
  return data
}

export async function verifyOtp(email: string, code: string) {
  const res = await fetch(`/api/auth/verify-otp?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`, {
    credentials: 'include',
  })
  const data = (await res.json()) as { message?: string; error?: string }
  if (!res.ok) throw new Error(data.error || 'Verification failed')
  return data
}

export async function requestPasswordReset(email: string) {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  })
  const data = (await res.json()) as { message?: string; error?: string }
  if (!res.ok) throw new Error(data.error || 'Failed to request password reset')
  return data
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, code, newPassword }),
  })
  const data = (await res.json()) as { message?: string; error?: string }
  if (!res.ok) throw new Error(data.error || 'Failed to reset password')
  return data
}

export function signInWithGoogle(returnTo?: string) {
  // Redirect to Google OAuth - the Pages Function handles the flow
  // Pass return_to so the callback knows where to redirect after login
  const rt = returnTo || (typeof window !== 'undefined' ? window.location.pathname : '/dashboard')
  // Only redirect to dashboard if coming from a non-editor page
  const destination = rt.startsWith('/editor') ? rt : '/dashboard'
  window.location.href = `/api/auth/google?return_to=${encodeURIComponent(destination)}`
}

export async function signOut() {
  try {
    await fetch('/api/auth/me', {
      method: 'DELETE',
      credentials: 'include',
    })
  } finally {
    // Shared browser privacy cleanup (KK 08)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('stall-config')
        localStorage.removeItem('stall-elements')
        localStorage.removeItem('user-custom-assets')
      } catch (e) {
        console.warn('Failed to clear local design cache on sign out:', e)
      }

      try {
        const { clearAllAssetBlobs } = await import('./customAssetDB')
        await clearAllAssetBlobs()
      } catch (e) {
        console.warn('Failed to clear IndexedDB assets on sign out:', e)
      }
    }
  }
}

// ─── Designs ──────────────────────────────────────────────────────────────────

export async function listDesigns(): Promise<Design[]> {
  const res = await fetch('/api/designs', { credentials: 'include' })
  if (!res.ok) return []
  const data = (await res.json()) as { designs: Design[] }
  return data.designs || []
}

export async function saveDesign(name: string, config: unknown, elements: unknown): Promise<Design> {
  const res = await fetch('/api/designs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, config, elements }),
  })
  const data = (await res.json()) as { design?: Design; error?: string }
  if (!res.ok) throw new Error(data.error || 'Failed to save design')
  return data.design!
}

export async function updateDesign(id: string, updates: { name?: string; config?: unknown; elements?: unknown }): Promise<Design> {
  const res = await fetch(`/api/designs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  })
  const data = (await res.json()) as { design?: Design; error?: string }
  if (!res.ok) throw new Error(data.error || 'Failed to update design')
  return data.design!
}

export async function deleteDesign(id: string): Promise<void> {
  await fetch(`/api/designs/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
}
