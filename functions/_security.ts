import { HttpError } from '../shared/validation'

export { HttpError } from '../shared/validation'

export const API_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  'Strict-Transport-Security': 'max-age=31536000',
}

export function secure<Env>(handler: PagesFunction<Env>): PagesFunction<Env> {
  return async (context) => {
    try {
      const { request } = context
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
        // Browser unsafe requests must prove same-origin, including same-site subdomains.
        if (request.headers.get('Origin') !== new URL(request.url).origin) throw new HttpError('Request origin is not allowed', 403)
        if (request.headers.get('Sec-Fetch-Site') === 'cross-site') throw new HttpError('Cross-site request rejected', 403)
      }
      const response = await handler(context)
      const headers = new Headers(response.headers)
      for (const [key, value] of Object.entries(API_HEADERS)) if (key !== 'Content-Type') headers.set(key, value)
      headers.delete('Access-Control-Allow-Origin')
      headers.delete('Access-Control-Allow-Credentials')
      return new Response(response.body, { status: response.status, headers })
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500
      // Do not log request bodies, OTPs, identity-provider tokens or DB bindings.
      if (status === 500) console.error('API operation failed')
      const headers: Record<string, string> = { ...API_HEADERS }
      if (status === 429) headers['Retry-After'] = String((error as HttpError).retryAfter || 60)
      return new Response(JSON.stringify({ error: error instanceof HttpError ? error.message : 'Request could not be completed' }), { status, headers })
    }
  }
}

export async function readJson(request: Request, maxBytes = 8192): Promise<Record<string, unknown>> {
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new HttpError('Use application/json', 415)
  const length = request.headers.get('Content-Length')
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new HttpError('Request is too large', 413)
  if (!request.body) throw new HttpError('JSON body is required')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) { await reader.cancel(); throw new HttpError('Request is too large', 413) }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
  let parsed: unknown
  try { parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(bytes)) } catch { throw new HttpError('Invalid JSON') }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new HttpError('JSON object is required')
  return parsed as Record<string, unknown>
}

export function clientIp(request: Request): string {
  // Cloudflare supplies/overwrites this header; never trust X-Forwarded-For.
  return request.headers.get('CF-Connecting-IP') || 'unknown'
}

export async function rateLimit(db: D1Database, scope: string, key: string, limit: number, seconds: number) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${scope}:${key}`))
  const id = Array.from(new Uint8Array(digest), x => x.toString(16).padStart(2, '0')).join('')
  const now = Math.floor(Date.now() / 1000)
  const row = await db.prepare(`INSERT INTO security_limits (id, hits, reset_at) VALUES (?, 1, ?)
    ON CONFLICT(id) DO UPDATE SET
      hits = CASE WHEN security_limits.reset_at <= ? THEN 1 ELSE MIN(security_limits.hits + 1, 1000000) END,
      reset_at = CASE WHEN security_limits.reset_at <= ? THEN excluded.reset_at ELSE security_limits.reset_at END
    RETURNING hits, reset_at`).bind(id, now + seconds, now, now).first<{ hits: number; reset_at: number }>()
  if (!row) throw new Error('Rate limit storage unavailable')
  if (row.hits > limit) throw new HttpError('Too many attempts. Please try again later.', 429, Math.max(1, row.reset_at - now))
  // Indexed bounded cleanup; no unbounded delete or per-isolate security counters.
  await db.prepare('DELETE FROM security_limits WHERE id IN (SELECT id FROM security_limits WHERE reset_at < ? LIMIT 20)').bind(now - 86400).run()
}

export async function authLimits(db: D1Database, request: Request, email: string, action: string, accountLimit: number, ipLimit: number, seconds: number) {
  await rateLimit(db, `${action}:ip`, clientIp(request), ipLimit, seconds)
  await rateLimit(db, `${action}:email`, email, accountLimit, seconds)
}
