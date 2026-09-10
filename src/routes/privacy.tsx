import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return (
    <main className="policy-page page-wrap">
      <header className="policy-hero">
        <span className="badge">
          <ShieldCheck size={15} /> Legal
        </span>
        <h1 className="display">Privacy Policy</h1>
        <p>
          This policy explains what information we collect, how we use it, and your choices regarding your privacy when using krafc.
        </p>
        <p className="policy-updated">Last updated: 10 September 2026</p>
      </header>

      <section className="policy-section">
        <h2>1. Information we collect</h2>
        <p>
          We collect account information (such as your email address and an optional display name) when you register or sign in using a provider like Google. We collect the content of a 3D design when you choose to save that design to the cloud. Imported custom-asset files are stored in your browser and are not uploaded merely because you import them into the editor.
        </p>
        <p>
          We automatically collect technical data needed to operate the service, including your IP address and standard browser request information.
        </p>
        <p>
          If you accept analytics cookies, Google Analytics also collects usage information such as page location and title, referrer, approximate location, browser and device information, language, screen resolution, and session statistics.
        </p>
      </section>

      <section className="policy-section">
        <h2>2. How we use information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide the krafc editor, account, cloud-save, and project-management features you request.</li>
          <li>Authenticate users, verify email addresses, maintain sessions, and protect the service from misuse.</li>
          <li>Send essential account, verification, security, and support communications.</li>
          <li>Maintain, troubleshoot, and improve the reliability and security of krafc.</li>
          <li>Measure visits and understand how the platform is used when you have consented to Google Analytics.</li>
          <li>Comply with applicable legal obligations and enforce applicable terms.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>3. Where information is stored</h2>
        <p>
          krafc uses a mix of local browser storage and cloud services. The difference matters: local storage is kept in your browser; cloud-saved data is sent to krafc services so it can be available when you sign in.
        </p>
        <p>
          Your editor drafts, settings, and imported custom 3D asset files may be stored in local storage or IndexedDB under the krafc browser database. Cloud-saved design/project data, account records, and session records are stored in Cloudflare D1.
        </p>
      </section>

      <section className="policy-section">
        <h2>4. Cookies and sessions</h2>
        <p>
          We use a first-party session cookie called <code>session</code> to keep you signed in. It contains a random session identifier, not your password. It is marked <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code>, and expires after 30 days or when you sign out.
        </p>
        <p>
          For more details on optional cookies, third-party analytics, and how to manage your preferences, please see our <a href="/cookie-policy">Cookie Policy</a>.
        </p>
        <p>
          Google Analytics is configured for krafc, but its script, cookies, and analytics requests remain blocked until you select Accept All. You can select Reject Optional directly on the consent banner and withdraw consent at any time through the persistent Cookie settings link in the footer.
        </p>
      </section>

      <section className="policy-section">
        <h2>5. When we share information</h2>
        <p>
          We do not sell, trade, or rent personal information. We may share information with service providers that help operate krafc, including Cloudflare (hosting, Workers, and D1), Google (web fonts, a model-preview library, OAuth sign-in and, after consent, Google Analytics), Resend (transactional emails), and the Babylon.js preview CDN (3D decoder files when required). These providers receive the information needed to supply their service, including technical request data when the browser connects to them. We may also disclose information where required by law or to protect rights and security.
        </p>
      </section>

      <section className="policy-section">
        <h2>6. Data retention and Security</h2>
        <p>
          We keep information only for as long as reasonably necessary to provide the service. Cloud designs remain available until you delete them or your account is deleted. We use reasonable technical and organisational measures intended to protect personal information and cloud designs against unauthorised access.
        </p>
      </section>

      <section className="policy-section">
        <h2>7. Your choices and rights</h2>
        <p>
          Depending on your location and applicable law, you may have rights to request access to, correction of, deletion of, restriction of, or a copy of your personal information. You can delete individual cloud designs in the krafc editor, sign out to end the current browser session, and clear local drafts through your browser site-data controls.
        </p>
      </section>

      <section className="policy-section">
        <h2>8. Contact</h2>
        <p>
          For privacy questions or requests, contact: <a href="mailto:support@krafc.com">support@krafc.com</a>. You may also contact DEKODE at <a href="mailto:contactus@dekodeglobal.com">contactus@dekodeglobal.com</a>.
        </p>
      </section>
    </main>
  )
}
