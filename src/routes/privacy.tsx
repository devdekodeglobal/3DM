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
          This policy explains what information we collect, how we use it, and your choices regarding your privacy when using KreateKaro.
        </p>
        <p className="policy-updated">Last updated: 3 September 2026</p>
      </header>

      <section className="policy-section">
        <h2>1. Information we collect</h2>
        <p>
          We collect account information (such as your email address and an optional display name) when you register or sign in using a provider like Google. We also collect the content of your 3D designs and uploaded custom assets, depending on whether you save them locally or to the cloud.
        </p>
        <p>
          We automatically collect technical data needed to operate the service, including your IP address and standard browser request information.
        </p>
      </section>

      <section className="policy-section">
        <h2>2. How we use information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide the KreateKaro editor, account, cloud-save, and project-management features you request.</li>
          <li>Authenticate users, verify email addresses, maintain sessions, and protect the service from misuse.</li>
          <li>Send essential account, verification, security, and support communications.</li>
          <li>Maintain, troubleshoot, and improve the reliability and security of KreateKaro.</li>
          <li>Comply with applicable legal obligations and enforce applicable terms.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>3. Where information is stored</h2>
        <p>
          KreateKaro uses a mix of local browser storage and cloud services. The difference matters: local storage is kept in your browser; cloud-saved data is sent to KreateKaro services so it can be available when you sign in.
        </p>
        <p>
          Your editor drafts, settings, and uploaded custom 3D asset files may be stored in local storage or IndexedDB under the KreateKaro browser database. Cloud-saved design/project data, account records, and session records are stored in our Cloudflare D1 database.
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
      </section>

      <section className="policy-section">
        <h2>5. When we share information</h2>
        <p>
          We do not sell, trade, or rent personal information. We may share information with service providers that help operate KreateKaro, such as Cloudflare (hosting and databases), Google (OAuth sign-in), and Resend (transactional emails). We may also disclose information where required by law or to protect rights and security.
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
          Depending on your location and applicable law, you may have rights to request access to, correction of, deletion of, restriction of, or a copy of your personal information. You can delete individual cloud designs in the KreateKaro editor, sign out to end the current browser session, and clear local drafts through your browser site-data controls.
        </p>
      </section>

      <section className="policy-section">
        <h2>8. Contact</h2>
        <p>
          For privacy questions or requests, contact: <a href="mailto:support@kreatekaro.co">support@kreatekaro.co</a>. You may also contact DEKODE at <a href="mailto:contactus@dekodeglobal.com">contactus@dekodeglobal.com</a>.
        </p>
      </section>
    </main>
  )
}
