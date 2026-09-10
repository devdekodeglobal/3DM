import { createFileRoute } from "@tanstack/react-router";
import { Cookie, Database, Settings2, ShieldCheck } from "lucide-react";
import { openCookieSettings } from "../lib/cookieConsent";

export const Route = createFileRoute("/cookie-policy")({
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <main className="policy-page page-wrap">
      <header className="policy-hero">
        <span className="badge">
          <Cookie size={15} /> Privacy
        </span>
        <h1 className="display">Cookie policy</h1>
        <p className="policy-updated">Last updated: 10 September 2026</p>
        <p>
          This Cookie Policy explains how DEKODE GLOBAL LLP, the operator of krafc, uses cookies and similar technologies when you visit or use <a href="http://www.krafc.com" target="_blank" rel="noreferrer">www.krafc.com</a> and the krafc platform.
        </p>
        <p>
          It explains what these technologies do, why we use them, how long they remain on your device, and how you can control your choices.
        </p>
        <p>
          This Cookie Policy should be read together with our <a href="/privacy">Privacy Policy</a>.
        </p>
      </header>

      <section className="policy-section">
        <div className="policy-section__heading">
          <ShieldCheck size={22} />
          <h2>1. Your privacy, your choice</h2>
        </div>
        <p>
          krafc uses necessary cookies and similar technologies to operate the platform, keep accounts and sessions secure, and remember your privacy preferences.
        </p>
        <p>
          We may also use optional analytics cookies, currently provided through Google Analytics, to understand how visitors use krafc and to improve the platform.
        </p>
        <p>
          Optional analytics are not activated until you give your consent.
        </p>
        <p>
          If you choose "Reject Optional" or "Only necessary cookies", krafc will continue to use only technologies required for the operation, security and basic functionality of the platform.
        </p>
        <p>
          You can change or withdraw your optional cookie consent at any time through Cookie Settings.
        </p>
        <button
          type="button"
          className="btn btn-outline policy-settings-button"
          onClick={openCookieSettings}
        >
          <Settings2 size={17} /> Open cookie settings
        </button>
      </section>

      <section className="policy-section">
        <h2>2. What are cookies and similar technologies?</h2>
        <p>
          Cookies are small text files stored on your browser or device when you visit a website. They allow a website to recognise your browser, maintain a session, remember preferences and, where you have consented, measure how the website is used.
        </p>
        <p>
          krafc also uses technologies such as browser local storage and IndexedDB. These technologies are not technically cookies, but they can perform similar functions and are therefore described in this policy where relevant.
        </p>
      </section>

      <section className="policy-section">
        <div className="policy-section__heading">
          <Database size={22} />
          <h2>3. Cookies used by krafc</h2>
        </div>
        <div className="policy-table-wrap">
          <table className="policy-table">
            <colgroup>
              <col className="policy-table__name" />
              <col className="policy-table__provider" />
              <col className="policy-table__purpose" />
              <col className="policy-table__expiry" />
              <col className="policy-table__sharing" />
            </colgroup>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Provider / Category</th>
                <th>Purpose</th>
                <th>Expiry</th>
                <th>Sharing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>session</code>
                </td>
                <td>
                  krafc<br />
                  <span>Necessary</span>
                </td>
                <td>
                  Contains a randomly generated session identifier used to maintain your signed-in session and authorise access to krafc cloud features. It does not contain your password. The cookie is configured with security attributes including HttpOnly, Secure and SameSite=Lax.
                </td>
                <td>Up to 30 days, or until you sign out</td>
                <td>
                  Processed by krafc and infrastructure providers, including Cloudflare, as necessary to provide and secure the service.
                </td>
              </tr>
              <tr>
                <td>
                  <code>oauth_state</code>
                </td>
                <td>
                  krafc / Cloudflare Workers<br />
                  <span>Necessary</span>
                </td>
                <td>
                  Contains a temporary random value used during Google sign-in to validate the authentication response and help protect against cross-site request forgery. It does not contain your password.
                </td>
                <td>Approximately 5 minutes and cleared after the authentication callback</td>
                <td>
                  Used during the authentication flow and processed by krafc and its infrastructure providers. The corresponding OAuth request may be transmitted to Google as part of the sign-in process.
                </td>
              </tr>
              <tr>
                <td>
                  <code>kk_cookie_consent</code>
                </td>
                <td>
                  krafc<br />
                  <span>Necessary</span>
                </td>
                <td>
                  Records your cookie preference, the applicable policy or consent configuration version, and the date of your choice.
                </td>
                <td>1 year</td>
                <td>
                  Processed by krafc and its infrastructure providers. It is not used for analytics.
                </td>
              </tr>
              <tr>
                <td>
                  <code>_ga</code>
                </td>
                <td>
                  Google Analytics<br />
                  <span>Analytics — optional</span>
                </td>
                <td>
                  Used, after consent, to distinguish browsers and help measure visits, sessions and interactions with krafc.
                </td>
                <td>Up to 2 years, subject to Google's configuration</td>
                <td>
                  Analytics information is processed by Google on behalf of krafc, subject to applicable Google terms, settings and safeguards.
                </td>
              </tr>
              <tr>
                <td>
                  <code>_ga_B55SFQ2GER</code>
                </td>
                <td>
                  Google Analytics<br />
                  <span>Analytics — optional</span>
                </td>
                <td>
                  Used, after consent, to maintain session and measurement information for krafc's Google Analytics property.
                </td>
                <td>Up to 2 years, subject to Google's configuration</td>
                <td>
                  Analytics information is processed by Google on behalf of krafc, subject to applicable Google terms, settings and safeguards.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="policy-note">
          The actual cookies and similar technologies used by krafc may change as the platform and its services evolve. We will update this policy when material changes are made.
        </p>
      </section>

      <section className="policy-section">
        <h2>4. Necessary cookies</h2>
        <p>Necessary cookies and similar technologies are required for krafc to provide core functionality.</p>
        <p>They may be used to:</p>
        <ul>
          <li>maintain your signed-in session;</li>
          <li>authenticate and authorise access to your krafc account and cloud features;</li>
          <li>protect authentication and other requests against security threats;</li>
          <li>remember your cookie and privacy preferences; and</li>
          <li>support the secure delivery and operation of the krafc platform.</li>
        </ul>
        <p>Because these technologies are necessary for the operation and security of krafc, they cannot be disabled through the cookie settings interface.</p>
      </section>

      <section className="policy-section">
        <h2>5. Optional analytics cookies</h2>
        <p>If you select "Accept all cookies" or specifically enable analytics through Cookie Settings, krafc may use Google Analytics to understand how visitors interact with the platform.</p>
        <p>Depending on the configuration of Google Analytics, information may include:</p>
        <ul>
          <li>pages or screens visited;</li>
          <li>page titles and URLs;</li>
          <li>referring websites or sources;</li>
          <li>approximate geographic information;</li>
          <li>browser and device information;</li>
          <li>language and screen characteristics;</li>
          <li>interactions and events on the krafc platform; and</li>
          <li>information about visits and sessions.</li>
        </ul>
        <p>krafc does not intentionally use Google Analytics to collect passwords, payment-card information or other sensitive information. Optional analytics collection is subject to your consent choice.</p>
      </section>

      <section className="policy-section">
        <h2>6. Google sign-in</h2>
        <p>krafc may allow you to sign in using your Google account.</p>
        <p>During authentication, krafc uses temporary security information to validate the sign-in request and protect the authentication process.</p>
        <p>Google may also use cookies or similar technologies on Google-controlled domains during the authentication process. Those technologies are governed by Google's own policies and terms rather than this Cookie Policy.</p>
        <p>For more information about Google's handling of personal information, please see Google's <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.</p>
      </section>

      <section className="policy-section">
        <h2>7. Browser storage and similar technologies</h2>
        <p>krafc uses certain browser storage technologies that are not technically cookies.</p>
        
        <h3>Theme and preview preferences</h3>
        <p>krafc may store preferences such as light/dark theme and high-quality 3D preview settings in your browser's local storage.</p>
        <p>These preferences remain on your device until you change or clear them.</p>

        <h3>Local editor data</h3>
        <p>When you use the krafc editor, certain information may be stored locally on your device so that the editor can restore your current workspace and provide a smoother experience.</p>
        <p>This may include:</p>
        <ul>
          <li>booth or space configuration;</li>
          <li>layout elements;</li>
          <li>project name and identifier;</li>
          <li>cloud auto-save preference;</li>
          <li>workspace markers; and</li>
          <li>custom-asset metadata.</li>
        </ul>
        <p>These items are cleared when you sign out.</p>

        <h3>Uploaded 3D assets</h3>
        <p>3D model files or other custom assets that you import into the krafc editor may be stored in browser IndexedDB or other local browser storage to support the editing experience.</p>
        <p>Storage of an asset in your browser does not, by itself, mean that the asset has been transmitted to krafc.</p>
        <p>If you choose to save a project or asset to the krafc cloud, the relevant information will be transmitted to and processed by krafc in accordance with our <a href="/privacy">Privacy Policy</a>.</p>
      </section>

      <section className="policy-section">
        <h2>8. Service providers</h2>
        <p>krafc uses technology and service providers to operate, secure and provide the platform. These may include:</p>
        
        <h3>Cloudflare</h3>
        <p>krafc uses Cloudflare infrastructure, including services supporting website delivery, application processing, security and cloud functionality. Cloudflare may process technical information and request data as necessary to provide these services.</p>

        <h3>Google</h3>
        <p>krafc may use Google for account authentication and, where you provide analytics consent, Google Analytics for platform measurement. Google states that Google Analytics 4 uses IP addresses at collection to derive location information and discards them before the data is logged. krafc disables Google signals and advertising-personalisation signals in its analytics tag.</p>
        <p>The website also requests font files from Google Fonts, and its standalone model-preview page loads Google’s model-viewer library from Google Hosted Libraries. These resource requests do not enable Google Analytics.</p>

        <h3>Babylon.js CDN</h3>
        <p>The 3D preview may request Draco decoder files from the Babylon.js preview CDN when they are needed.</p>

        <h3>Resend</h3>
        <p>krafc may use Resend to deliver verification and transactional emails. Information necessary to send those emails, such as your email address and relevant email content, may be processed by Resend.</p>
        
        <p>These providers process information as necessary to provide the services for which they are engaged and subject to applicable contractual, security and privacy requirements.</p>
      </section>

      <section className="policy-section">
        <h2>9. International processing</h2>
        <p>krafc is intended for users internationally, and krafc and its service providers may process information using infrastructure located in countries other than the country in which you are located.</p>
        <p>Where personal information is transferred internationally, DEKODE GLOBAL LLP will use appropriate contractual, organisational and technical safeguards as required by applicable law.</p>
      </section>

      <section className="policy-section">
        <h2>10. How long information is retained</h2>
        <p>Cookie retention periods are described in the cookie table above.</p>
        <p>Information collected through Google Analytics is subject to the retention settings configured for krafc's Google Analytics property.</p>
        <p>Information stored locally in your browser, including editor data and preferences, generally remains until it expires, is overwritten, is cleared by krafc, or you delete the relevant browser or site data.</p>
      </section>

      <section className="policy-section">
        <h2>11. Changing or withdrawing your choice</h2>
        <p>You can change your optional cookie preferences at any time by selecting Cookie Settings from the persistent link available on the krafc website.</p>
        <p>If you withdraw your consent to analytics:</p>
        <ul>
          <li>krafc will stop initiating future Google Analytics collection;</li>
          <li>future analytics cookies will not be set while analytics remains disabled; and</li>
          <li>where technically supported, analytics cookies controlled by krafc will be removed.</li>
        </ul>
        <p>Withdrawing consent does not affect processing that took place before your withdrawal.</p>
        <p>You may also delete cookies and other website data through your browser settings. If you clear your krafc consent cookie, krafc may ask you to make your cookie choice again.</p>
      </section>

      <section className="policy-section">
        <h2>12. Your privacy rights</h2>
        <p>Depending on where you are located and the laws applicable to you, you may have rights relating to your personal information, including rights to access, correction, deletion, restriction or objection to certain processing, withdrawal of consent, or other rights provided by applicable law.</p>
        <p>For information about how krafc collects, uses, protects and handles personal information more generally, please see our <a href="/privacy">Privacy Policy</a>.</p>
        <p>You may contact us regarding privacy or cookie-related questions at: <a href="mailto:support@krafc.com">support@krafc.com</a></p>
      </section>

      <section className="policy-section">
        <h2>13. Updates to this Cookie Policy</h2>
        <p>We may update this Cookie Policy when our technology, services, cookies, analytics configuration, service providers or applicable legal requirements change.</p>
        <p>The "Last updated" date at the top of this policy indicates when the policy was most recently revised.</p>
        <p>krafc may request a new consent decision where required by applicable law or where there is a material change to the cookies, technologies, purposes or providers used by krafc.</p>
      </section>

      <section className="policy-section">
        <h2>14. Contact</h2>
        <p>If you have any questions about this Cookie Policy or krafc's use of cookies and similar technologies, please contact:</p>
        <p>
          DEKODE GLOBAL LLP<br />
          Operator of krafc<br />
          Email: <a href="mailto:support@krafc.com">support@krafc.com</a>
        </p>
        <p>This Cookie Policy forms part of krafc's broader privacy framework and should be read together with the <a href="/privacy">krafc Privacy Policy</a>.</p>
      </section>
    </main>
  );
}
