// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_NAME, COOKIE_CONSENT_VERSION, readCookieConsent, saveCookieConsent } from './cookieConsent'

function clearConsentCookie() {
  document.cookie = `${COOKIE_CONSENT_NAME}=; Max-Age=0; Path=/`
}

describe('cookie consent persistence', () => {
  beforeEach(clearConsentCookie)

  it('treats a missing or unreadable cookie as no consent', () => {
    expect(readCookieConsent()).toBeNull()
    document.cookie = `${COOKIE_CONSENT_NAME}=not-json; Path=/`
    expect(readCookieConsent()).toBeNull()
  })

  it('saves and reads an affirmative analytics choice', () => {
    const saved = saveCookieConsent(true)
    expect(saved).toMatchObject({ necessary: true, analytics: true, version: COOKIE_CONSENT_VERSION })
    expect(readCookieConsent()).toEqual(saved)
  })

  it('saves rejection as an explicit analytics choice', () => {
    saveCookieConsent(false)
    expect(readCookieConsent()?.analytics).toBe(false)
  })

  it('ignores consent from an older policy version', () => {
    const outdated = encodeURIComponent(JSON.stringify({ necessary: true, analytics: true, version: COOKIE_CONSENT_VERSION - 1, updatedAt: new Date().toISOString() }))
    document.cookie = `${COOKIE_CONSENT_NAME}=${outdated}; Path=/`
    expect(readCookieConsent()).toBeNull()
  })

  it('notifies the app immediately when a choice changes', () => {
    const listener = vi.fn()
    window.addEventListener(COOKIE_CONSENT_EVENT, listener)
    const saved = saveCookieConsent(false)
    expect(listener).toHaveBeenCalledOnce()
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual(saved)
    window.removeEventListener(COOKIE_CONSENT_EVENT, listener)
  })
})
