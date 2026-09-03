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
          This policy explains what KreateKaro stores in your browser, why it is
          used, how long it lasts, and when information is shared with another
          provider.
        </p>
        <p className="policy-updated">Last updated: 3 September 2026</p>
      </header>

      <section className="policy-section">
        <div className="policy-section__heading">
          <ShieldCheck size={22} />
          <h2>Your choice comes first</h2>
        </div>
        <p>
          Necessary cookies support secure sign-in and remember your privacy
          choice. Optional Google Analytics is disabled by default and its
          script is loaded only after you select “Accept analytics” or enable
          analytics in Cookie settings.
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
                  KreateKaro, delivered through Cloudflare Pages and D1
                  <br />
                  <span>Necessary</span>
                </td>
                <td>
                  Contains a random session identifier—not your password—to keep
                  you signed in and authorise cloud features. It is{" "}
                  <code>HttpOnly</code>, <code>Secure</code>, and{" "}
                  <code>SameSite=Lax</code>.
                </td>
                <td>Up to 30 days, or until you sign out</td>
                <td>
                  Cloudflare processes the identifier and related requests as
                  KreateKaro’s hosting, Workers, and database provider.
                </td>
              </tr>
              <tr>
                <td>
                  <code>kk_cookie_consent</code>
                </td>
                <td>
                  KreateKaro
                  <br />
                  <span>Necessary</span>
                </td>
                <td>
                  Stores whether you accepted or rejected analytics, the policy
                  version, and the date of your choice.
                </td>
                <td>1 year</td>
                <td>Not shared with third parties.</td>
              </tr>
              <tr>
                <td>
                  <code>_ga</code>
                </td>
                <td>
                  Google Analytics
                  <br />
                  <span>Analytics</span>
                </td>
                <td>
                  Distinguishes browsers so aggregate visits and usage can be
                  measured.
                </td>
                <td>Up to 2 years</td>
                <td>
                  Usage, device, and request information is shared with Google
                  as our analytics provider and may be processed outside your
                  country under applicable safeguards.
                </td>
              </tr>
              <tr>
                <td>
                  <code>_ga_&lt;container-id&gt;</code>
                </td>
                <td>
                  Google Analytics
                  <br />
                  <span>Analytics</span>
                </td>
                <td>
                  Maintains session state for KreateKaro’s configured analytics
                  property.
                </td>
                <td>Up to 2 years</td>
                <td>
                  Usage, device, and request information is shared with Google
                  as described above.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="policy-note">
          Google Analytics cookies are not created when analytics is rejected or
          no choice has been made. Browser settings or provider changes may
          shorten these maximum lifetimes.
        </p>
      </section>

      <section className="policy-section">
        <h2>Similar browser technologies</h2>
        <p>
          KreateKaro also uses browser storage that is not technically a cookie:
        </p>
        <ul>
          <li>
            <strong>Theme and preview preferences</strong> — light/dark theme
            and high-quality 3D preview choices remain in local storage until
            changed or cleared.
          </li>
          <li>
            <strong>Local editor data</strong> — booth configuration, layout
            elements, and custom-asset metadata may be stored locally so the
            editor can restore your work.
          </li>
          <li>
            <strong>Uploaded 3D assets</strong> — custom model files may be
            stored in IndexedDB on your device. They are not sent to KreateKaro
            merely by being stored locally.
          </li>
          <li>
            <strong>Cloud-saved projects</strong> — if you deliberately save a
            project to the cloud, account and design data is sent to
            KreateKaro’s Cloudflare Workers and D1 database.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>Cloudflare, Google sign-in, and service delivery</h2>
        <p>
          Cloudflare processes technical request data required to deliver and
          secure the website. This necessary infrastructure processing is
          separate from optional analytics. If you choose Google sign-in, Google
          may use its own cookies on Google-controlled domains during
          authentication. Resend processes the address and content required for
          verification and transactional emails. Those providers’ processing is
          governed by their applicable terms and privacy notices.
        </p>
      </section>

      <section className="policy-section">
        <h2>Changing or withdrawing consent</h2>
        <p>
          Use the persistent “Cookie settings” link in the footer at any time.
          Rejecting analytics stops future Google Analytics collection and
          removes analytics cookies accessible to KreateKaro. You can also clear
          cookies and site data in your browser; the consent banner will appear
          again on your next visit.
        </p>
        <p>
          For privacy questions, contact{" "}
          <a href="mailto:support@kreatekaro.co">support@kreatekaro.co</a>. This
          policy should be read together with our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </section>
    </main>
  );
}
