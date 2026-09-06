/// <reference types="@cloudflare/workers-types" />
// Shared auth utilities for Cloudflare Pages Functions
// All functions run inside the Cloudflare Worker runtime

// ─── Helpers: byte <-> hex conversion ────────────────────────────────────────
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

function hexToBuffer(hex: string): Uint8Array {
  const length = hex.length / 2
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return new Uint8Array(bytes.buffer)
}

// Constant-time string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

// ─── Password hashing using Web Crypto PBKDF2 (KK 01) ────────────────────────
const PBKDF2_ITERATIONS = 100_000
const SALT_BYTES = 16

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const encoder = new TextEncoder()
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    256 // 32 bytes
  )

  const saltHex = bufferToHex(salt.buffer)
  const hashHex = bufferToHex(derivedBits)
  return `pbkdf2:${PBKDF2_ITERATIONS}:${saltHex}:${hashHex}`
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
  // Check if password matches new PBKDF2 format
  if (storedHash.startsWith('pbkdf2:')) {
    const parts = storedHash.split(':')
    if (parts.length !== 4) return { valid: false, needsRehash: false }
    const iterations = parseInt(parts[1], 10)
    const salt = hexToBuffer(parts[2])
    const expectedHashHex = parts[3]

    const encoder = new TextEncoder()
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    )

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256',
      },
      passwordKey,
      256
    )

    const computedHashHex = bufferToHex(derivedBits)
    const valid = timingSafeEqual(computedHashHex, expectedHashHex)
    return { valid, needsRehash: iterations < PBKDF2_ITERATIONS }
  }

  // Legacy fallback: plain SHA-256 (base64)
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const legacyHash = btoa(String.fromCharCode(...new Uint8Array(hash)))

  if (timingSafeEqual(legacyHash, storedHash)) {
    return { valid: true, needsRehash: true }
  }

  return { valid: false, needsRehash: false }
}

// ─── Session management ───────────────────────────────────────────────────────
export function generateId(): string {
  return crypto.randomUUID().replace(/-/g, '')
}

// Cryptographically secure 6-digit OTP (KK 06)
export function generateOtp(): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const code = (array[0] % 900000) + 100000
  return code.toString()
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
  const match = cookie.match(/(?:^|;\s*)session=([^;]+)/)
  return match ? match[1] : null
}

// ─── Rate limiting using D1 (KK 06) ───────────────────────────────────────────
export async function checkRateLimit(
  db: D1Database,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const now = Math.floor(Date.now() / 1000)
    const resetAt = now + windowSeconds

    // Clean up expired rate limit entries periodically
    await db.prepare('DELETE FROM rate_limits WHERE reset_at < ?').bind(now).run()

    // Query existing record
    const existing = await db.prepare(
      'SELECT count, reset_at FROM rate_limits WHERE key = ?'
    ).bind(key).first<{ count: number; reset_at: number }>()

    if (!existing) {
      await db.prepare(
        'INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)'
      ).bind(key, resetAt).run()
      return { allowed: true, remaining: limit - 1 }
    }

    if (existing.reset_at < now) {
      await db.prepare(
        'UPDATE rate_limits SET count = 1, reset_at = ? WHERE key = ?'
      ).bind(resetAt, key).run()
      return { allowed: true, remaining: limit - 1 }
    }

    if (existing.count >= limit) {
      return { allowed: false, remaining: 0 }
    }

    await db.prepare(
      'UPDATE rate_limits SET count = count + 1 WHERE key = ?'
    ).bind(key).run()

    return { allowed: true, remaining: limit - (existing.count + 1) }
  } catch (err) {
    console.error('Rate limit check error:', err)
    // Fail open if table isn't created yet or transient DB issue
    return { allowed: true, remaining: 1 }
  }
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1'
  )
}

// ─── CORS / JSON helpers with anti-caching defaults (KK 10) ───────────────────
export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...headers,
    },
  })
}

export function jsonError(message: string, status = 400, headers: Record<string, string> = {}) {
  return json({ error: message }, status, headers)
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
