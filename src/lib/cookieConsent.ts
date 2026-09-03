export const COOKIE_CONSENT_NAME = 'kk_cookie_consent'
export const COOKIE_CONSENT_VERSION = 2
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365
export const COOKIE_CONSENT_EVENT = 'kreatekaro:cookie-consent-changed'
export const OPEN_COOKIE_SETTINGS_EVENT = 'kreatekaro:open-cookie-settings'

export type CookieConsent = {
  necessary: true
  analytics: boolean
  version: number
  updatedAt: string
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof document === 'undefined') return null

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${COOKIE_CONSENT_NAME}=`))

  if (!cookie) return null

  try {
    const value = JSON.parse(decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1)))
    if (
      value?.necessary === true &&
      typeof value.analytics === 'boolean' &&
      value.version === COOKIE_CONSENT_VERSION &&
      typeof value.updatedAt === 'string'
    ) {
      return value as CookieConsent
    }
  } catch {
    // Invalid or outdated consent is treated as no consent.
  }

  return null
}

export function saveCookieConsent(analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics,
    version: COOKIE_CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }

  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: consent }))

  return consent
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))
}
