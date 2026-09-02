// Shared auth utilities for Cloudflare Pages Functions
// All functions run inside the Cloudflare Worker runtime

// ─── Password hashing using Web Crypto (built into CF Workers) ───────────────
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password)
  return computed === hash
}

// ─── Session management ───────────────────────────────────────────────────────
export function generateId(): string {
  return crypto.randomUUID().replace(/-/g, '')
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createSession(db: D1Database, userId: string): Promise<string> {
  const sessionId = generateId()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  await db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, userId, expiresAt).run()
  return sessionId
}

export async function getSessionUser(db: D1Database, sessionId: string) {
  if (!sessionId) return null
  const result = await db.prepare(`
    SELECT u.id, u.email, u.name, u.avatar_url, u.email_verified
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `).bind(sessionId).first()
  return result || null
}

export async function deleteSession(db: D1Database, sessionId: string) {
  await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run()
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────
export function setSessionCookie(sessionId: string): string {
  return `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
}

export function clearSessionCookie(): string {
  return `session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}

export function getSessionId(request: Request): string | null {
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(/session=([^;]+)/)
  return match ? match[1] : null
}

// ─── CORS / JSON helpers ──────────────────────────────────────────────────────
export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      ...headers,
    },
  })
}

export function jsonError(message: string, status = 400) {
  return json({ error: message }, status)
}

// ─── Send OTP email via Resend ────────────────────────────────────────────────
export async function sendOtpEmail(
  resendApiKey: string,
  to: string,
  otp: string,
  type: 'verify_email' | 'reset_password'
) {
  const subject = type === 'verify_email'
    ? 'Verify your kreatekaro account'
    : 'Reset your kreatekaro password'

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f0f0f;color:#f5f5f5;border-radius:12px">
      <h1 style="font-size:24px;margin:0 0 8px;color:#7c6ff7">kreatekaro</h1>
      <p style="color:#999;margin:0 0 32px;font-size:14px">3D Space Designer</p>
      <h2 style="font-size:18px;margin:0 0 16px">${type === 'verify_email' ? 'Verify your email' : 'Reset your password'}</h2>
      <p style="color:#ccc;margin:0 0 24px">Your one-time code is:</p>
      <div style="background:#1a1a2e;border:1px solid #7c6ff7;border-radius:8px;padding:24px;text-align:center;font-size:36px;font-weight:700;letter-spacing:8px;color:#7c6ff7">${otp}</div>
      <p style="color:#666;margin:24px 0 0;font-size:12px">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: 'kreatekaro <onboarding@resend.dev>', to, subject, html }),
  })

  return res.ok
}
