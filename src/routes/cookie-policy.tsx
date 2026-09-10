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
        <p>
          This policy explains what krafc stores in your browser, why it is
          used, how long it lasts, and when information is shared with another
          provider.
        </p>
        <p className="policy-updated">Last updated: 10 September 2026</p>
      </header>

      <section className="policy-section">
        <div className="policy-section__heading">
          <ShieldCheck size={22} />
          <h2>Your choice comes first</h2>
        </div>
        <p>
          Necessary cookies support secure sign-in and remember your privacy
          choice. Google Analytics is configured, but its script loads and
          begins collecting information only after you select “Accept all
          cookies” or enable analytics in Cookie settings.
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
        <div className="policy-section__heading">
          <Database size={22} />
          <h2>Cookies we use</h2>
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
                <th>Name</th>
                <th>Provider & category</th>
                <th>Purpose and data</th>
                <th>Expiry</th>
                <th>Data sharing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>session</code>
                </td>
                <td>
                  krafc, delivered through Cloudflare Pages, Workers, and D1
                  <br />
                  <span>Necessary</span>
                </td>
                <td>
                  Contains a random session identifier, not your password, to
                  keep you signed in and authorise cloud features. It is{" "}
                  <code>HttpOnly</code>, <code>Secure</code>, and{" "}
                  <code>SameSite=Lax</code>.
                </td>
                <td>Up to 30 days, or until you sign out</td>
                <td>
                  Cloudflare processes the identifier and related requests as
                  krafc’s hosting, application, and database provider.
                </td>
              </tr>
              <tr>
                <td>
                  <code>oauth_state</code>
                </td>
                <td>
                  krafc, delivered through Cloudflare Workers
                  <br />
                  <span>Necessary</span>
                </td>
                <td>
                  Stores a temporary random value during Google sign-in to
                  validate the authentication response and protect against
                  cross-site request forgery. It is <code>HttpOnly</code>,{" "}
                  <code>Secure</code>, and <code>SameSite=Lax</code>.
                </td>
                <td>5 minutes, and cleared after the sign-in callback</td>
                <td>
                  Cloudflare processes it while delivering the authentication
                  request. Google receives the corresponding state value during
                  the sign-in flow.
                </td>
              </tr>
              <tr>
                <td>
                  <code>kk_cookie_consent</code>
                </td>
                <td>
                  krafc
                  <br />
                  <span>Necessary</span>
                </td>
                <td>
                  Stores whether you accepted or rejected analytics, the policy
                  version, and the date of your choice.
                </td>
                <td>1 year</td>
                <td>
                  Sent to krafc with normal requests and processed by Cloudflare
                  as our hosting provider. It is not shared with Google.
                </td>
              </tr>
              <tr>
                <td>
                  <code>_ga</code>
                </td>
                <td>
                  Google Analytics (Google)
                  <br />
                  <span>Analytics</span>
                </td>
                <td>
                  After consent, distinguishes browsers so visits, sessions, and
                  usage can be measured. Google Analytics may collect page
                  location and title, referrer, approximate location, browser,
                  device, language, and screen information.
                </td>
                <td>Up to 2 years</td>
                <td>
                  Analytics and device information is shared with Google as our
                  analytics provider and may be processed outside your country
                  under applicable safeguards.
                </td>
              </tr>
              <tr>
                <td>
                  <code>_ga_B55SFQ2GER</code>
                </td>
                <td>
                  Google Analytics (Google)
                  <br />
                  <span>Analytics</span>
                </td>
                <td>
                  After consent, maintains session state for krafc’s Google
                  Analytics property <code>G-B55SFQ2GER</code>.
                </td>
                <td>Up to 2 years</td>
                <td>
                  Analytics and device information is shared with Google as
                  described above.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*  <p className="policy-note">
          Google Analytics cookies and requests remain blocked when only
          necessary cookies are chosen or no choice has been made. The listed
          expiry periods are Google’s default maximums and may be renewed after
          later visits; browser settings or provider changes may shorten them.
        </p> */}
      </section>

      <section className="policy-section">
        <h2>Similar browser technologies</h2>
        <p>krafc also uses browser storage that is not technically a cookie:</p>
        <ul>
          <li>
            <strong>Theme and preview preferences</strong> - light/dark theme
            and high-quality 3D preview choices remain in local storage until
            changed or cleared.
          </li>
          <li>
            <strong>Local editor data</strong> - booth configuration, layout
            elements, project name and identifier, cloud auto-save preference,
            workspace marker, and custom-asset metadata may be stored locally so
            the editor can restore and protect your current workspace. These
            items are cleared when you sign out.
          </li>
          <li>
            <strong>Uploaded 3D assets</strong> - custom model files may be
            stored in IndexedDB on your device. They are not sent to krafc
            merely by being stored locally.
          </li>
          <li>
            <strong>Cloud-saved projects</strong> - if you deliberately save a
            project to the cloud, account and design data is sent to krafc’s
            secure cloud backend.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>Cloudflare, Google sign-in, analytics, and service delivery</h2>
        <p>
          Cloudflare processes technical request data required to deliver and
          secure the website and operate krafc’s cloud features. This necessary
          infrastructure processing is separate from optional analytics. If you
          choose Google sign-in, Google may use its own cookies on
          Google-controlled domains during authentication. After analytics
          consent, Google processes the analytics information described above.
          krafc configures Google Analytics with IP anonymisation enabled, which
          means IP addresses are anonymised before being sent to Google.
          Resend processes the address and content required for verification and
          transactional emails. Google’s processing is described in its{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="policy-section">
        <h2>Changing or withdrawing consent</h2>
        <p>
          Use the persistent “Cookie settings” link in the footer at any time.
          Choosing “Only necessary cookies” stops future Google Analytics
          collection and removes analytics cookies accessible to krafc. You can
          also clear cookies and site data in your browser; the consent banner
          will appear again on your next visit.
        </p>
        <p>
          For privacy questions, contact{" "}
          <a href="mailto:support@krafc.com">support@krafc.com</a>. This policy
          should be read together with our <a href="/privacy">Privacy Policy</a>
          .
        </p>
      </section>
    </main>
  );
}
