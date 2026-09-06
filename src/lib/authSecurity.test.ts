import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword, generateOtp } from '../../functions/_auth-utils'

describe('Auth Security Utils', () => {
  it('hashes passwords using PBKDF2 with salt', async () => {
    const password = 'mySecurePassword123!'
    const hash = await hashPassword(password)

    expect(hash).toMatch(/^pbkdf2:100000:[a-f0-9]{32}:[a-f0-9]{64}$/)
    
    // Check verification passes
    const result = await verifyPassword(password, hash)
    expect(result.valid).toBe(true)
    expect(result.needsRehash).toBe(false)

    // Check wrong password fails
    const invalidResult = await verifyPassword('wrongPass', hash)
    expect(invalidResult.valid).toBe(false)
  })

  it('verifies legacy SHA-256 password and flags for rehash', async () => {
    const password = 'legacyPassword!'
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const rawHash = await crypto.subtle.digest('SHA-256', data)
    const legacyHash = btoa(String.fromCharCode(...new Uint8Array(rawHash)))

    const result = await verifyPassword(password, legacyHash)
    expect(result.valid).toBe(true)
    expect(result.needsRehash).toBe(true)
  })

  it('generates 6-digit cryptographically random OTPs', () => {
    for (let i = 0; i < 50; i++) {
      const otp = generateOtp()
      expect(otp).toMatch(/^\d{6}$/)
      const num = parseInt(otp, 10)
      expect(num).toBeGreaterThanOrEqual(100000)
      expect(num).toBeLessThanOrEqual(999999)
    }
  })
})
