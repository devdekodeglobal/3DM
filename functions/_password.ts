import { pbkdf2, timingSafeEqual } from 'node:crypto'
import { Buffer } from 'node:buffer'
const ITERATIONS = 600000
const PREFIX = 'pbkdf2-sha256-v1'
export function isLegacyPasswordHash(hash: string) { return /^[A-Za-z0-9+/]{43}=$/.test(hash) }
async function legacyDigest(password: string) {
  return Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))).toString('base64')
}
function derive(digest: string, salt: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => pbkdf2(digest, Buffer.from(salt, 'hex'), ITERATIONS, 32, 'sha256', (err, result) => err ? reject(err) : resolve(result)))
}
// Pre-hashing allows legacy records to be strengthened without knowing passwords.
export async function upgradeLegacyHash(digest: string) {
  if (!isLegacyPasswordHash(digest)) throw new Error('Not a legacy digest')
  const salt = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('hex')
  return `${PREFIX}$${ITERATIONS}$${salt}$${Buffer.from(await derive(digest, salt)).toString('hex')}`
}
export async function hashPassword(password: string) { return upgradeLegacyHash(await legacyDigest(password)) }
export async function verifyPassword(password: string, hash: string) {
  const digest = await legacyDigest(password)
  // Temporary compatibility; a successful login persists the expensive representation.
  if (isLegacyPasswordHash(hash)) return timingSafeEqual(Buffer.from(digest), Buffer.from(hash))
  const parts = hash.split('$')
  if (parts.length !== 4 || parts[0] !== PREFIX || parts[1] !== String(ITERATIONS) || !/^[a-f0-9]{32}$/.test(parts[2]) || !/^[a-f0-9]{64}$/.test(parts[3])) return false
  return timingSafeEqual(await derive(digest, parts[2]), Buffer.from(parts[3], 'hex'))
}
