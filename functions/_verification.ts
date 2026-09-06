import { HttpError } from './_security'
export async function codeDigest(secret: string, email: string, code: string) {
  if (typeof secret !== 'string' || secret.length < 32) throw new HttpError('Email verification is temporarily unavailable', 503)
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`verify-email:${email}:${code}`))
  return Array.from(new Uint8Array(signature), x => x.toString(16).padStart(2, '0')).join('')
}
