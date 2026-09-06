// Frontend auth client — replaces supabaseClient.ts
// All calls go to our Cloudflare Pages Functions API

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
  const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
  if (!res.ok) throw new Error('Unable to check your account. Please try again.')
  const data = (await res.json()) as { user: User | null }
  return data.user
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
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, code }),
  })
  const data = (await res.json()) as { message?: string; error?: string }
  if (!res.ok) throw new Error(data.error || 'Verification failed')
  return data
}

export function signInWithGoogle() {
  // Redirect to Google OAuth — the Pages Function handles the flow
  window.location.href = '/api/auth/google'
}

export async function signOut() {
  const res = await fetch('/api/auth/me', {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Sign out failed. Please try again.')
}

// ─── Designs ──────────────────────────────────────────────────────────────────

export async function listDesigns(): Promise<Design[]> {
  const res = await fetch('/api/designs', { credentials: 'include' })
  if (!res.ok) throw new Error('Unable to load your projects')
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
  const res = await fetch(`/api/designs/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Unable to delete this project')
}

export async function loadDesign(id: string): Promise<Design> {
  const res = await fetch(`/api/designs/${encodeURIComponent(id)}`, { credentials: 'include', cache: 'no-store' })
  if (!res.ok) throw new Error('Unable to load this project')
  return (await res.json() as { design: Design }).design
}
