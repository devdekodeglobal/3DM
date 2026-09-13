import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <main className="policy-page page-wrap">
      <header className="policy-hero">
        <h1 className="display">Privacy Policy</h1>
        <p className="policy-updated">Last updated: 10 September 2026</p>
        <p>
          This Privacy Policy explains how DEKODE GLOBAL LLP, the operator of
          krafc, collects, uses, stores, protects and shares information when
          you visit or use{" "}
          <a href="http://www.krafc.com" target="_blank" rel="noreferrer">
            www.krafc.com
          </a>{" "}
          and the krafc platform.
        </p>
        <p>
          krafc is a 3D design platform for spatial designers that enables users
          to transform 2D designs into 3D spaces, work with assets in a 3D
          environment, and create, save and manage spatial design projects.
        </p>
        <p>
          This Privacy Policy should be read together with our{" "}
          <a href="/cookie-policy">Cookie Policy</a>.
        </p>
      </header>

      <section className="policy-section">
        <h2>1. Information we collect</h2>
        <p>
          Depending on how you use krafc, we may collect the following
          categories of information.
        </p>

        <h3>1.1 Account and authentication information</h3>
        <p>
          When you create an account or sign in to krafc, we may collect
          information such as:
        </p>
        <ul>
          <li>your email address;</li>
          <li>display name, where provided;</li>
          <li>account identifier;</li>
          <li>
            authentication information provided by your chosen sign-in provider;
            and
          </li>
          <li>
            information necessary to maintain your account and secure session.
          </li>
        </ul>
        <p>
          If you choose to sign in using Google, Google may provide krafc with
          information associated with your Google account that is permitted by
          your Google account settings and the authorisation you provide.
        </p>
        <p>krafc does not receive or store your Google account password.</p>

        <h3>1.2 Designs, projects and uploaded assets</h3>
        <p>
          krafc allows you to create, edit and manage 2D and 3D spatial designs.
        </p>
        <p>Depending on how you use the platform, this may include:</p>
        <ul>
          <li>2D designs and layouts;</li>
          <li>3D projects and spatial configurations;</li>
          <li>project names and identifiers;</li>
          <li>booth, room or space configurations;</li>
          <li>layout elements and design information;</li>
          <li>custom 3D models and other uploaded assets;</li>
          <li>asset metadata;</li>
          <li>workspace information; and</li>
          <li>other content that you choose to create or upload to krafc.</li>
        </ul>
        <p>
          Some information may remain only in your browser. If you choose to
          save a project or asset to the krafc cloud, the relevant information
          is transmitted to krafc services so that it can be stored and accessed
          through your account.
        </p>

        <h3>1.3 Technical and operational information</h3>
        <p>
          We automatically collect certain technical information needed to
          operate, secure and troubleshoot krafc.
        </p>
        <p>This may include:</p>
        <ul>
          <li>IP address;</li>
          <li>browser type and version;</li>
          <li>operating system;</li>
          <li>device and screen information;</li>
          <li>request and connection information;</li>
          <li>dates and times of requests;</li>
          <li>referring information; and</li>
          <li>
            technical information relating to the operation, performance and
            security of the platform.
          </li>
        </ul>
        <p>
          We use this information primarily for service delivery, security,
          troubleshooting and reliability.
        </p>

        <h3>1.4 Analytics information</h3>
        <p>
          If you consent to optional analytics, krafc uses Google Analytics to
          understand how the platform is used.
        </p>
        <p>
          Depending on the configuration of Google Analytics, this may include:
        </p>
        <ul>
          <li>pages or screens visited;</li>
          <li>page location and title;</li>
          <li>referring website or source;</li>
          <li>approximate geographic information;</li>
          <li>browser and device information;</li>
          <li>language and screen characteristics;</li>
          <li>interactions and events; and</li>
          <li>visit and session information.</li>
        </ul>
        <p>
          Optional Google Analytics collection is not activated until you
          provide the applicable consent.
        </p>
        <p>
          For more information, including the specific analytics cookies used by
          krafc, please see our <a href="/cookie-policy">Cookie Policy</a>.
        </p>
      </section>

      <section className="policy-section">
        <h2>2. How we use information</h2>
        <p>We use information for the following purposes.</p>

        <h3>Providing the krafc service</h3>
        <p>We use information to:</p>
        <ul>
          <li>create and maintain your account;</li>
          <li>provide the krafc editor;</li>
          <li>provide 2D-to-3D design functionality;</li>
          <li>enable project and workspace management;</li>
          <li>save and retrieve cloud projects;</li>
          <li>manage uploaded assets;</li>
          <li>maintain your preferences and workspace; and</li>
          <li>provide other features and services that you request.</li>
        </ul>

        <h3>Authentication and security</h3>
        <p>We use information to:</p>
        <ul>
          <li>authenticate users;</li>
          <li>maintain secure sessions;</li>
          <li>verify email addresses where required;</li>
          <li>prevent fraud, abuse and unauthorised access;</li>
          <li>detect and investigate security incidents;</li>
          <li>protect krafc and its infrastructure; and</li>
          <li>protect our users and their content.</li>
        </ul>

        <h3>Communications</h3>
        <p>We may use your contact information to send:</p>
        <ul>
          <li>account-related communications;</li>
          <li>verification emails;</li>
          <li>security notifications;</li>
          <li>transactional messages;</li>
          <li>service-related announcements; and</li>
          <li>responses to support or privacy requests.</li>
        </ul>
        <p>
          We do not use your information for marketing communications where
          applicable law requires consent unless you have provided that consent.
        </p>

        <h3>Service operation and improvement</h3>
        <p>
          We use technical and operational information to maintain,
          troubleshoot, monitor and improve the reliability, performance and
          security of krafc.
        </p>
        <p>
          Where Google Analytics is used for measurement and analytics, it is
          activated only after the applicable consent has been provided.
        </p>

        <h3>Legal and compliance purposes</h3>
        <p>We may process information where reasonably necessary to:</p>
        <ul>
          <li>comply with applicable laws or legal obligations;</li>
          <li>respond to lawful requests from authorities;</li>
          <li>establish, exercise or defend legal claims;</li>
          <li>enforce our terms and policies; or</li>
          <li>
            protect the rights, property, safety or security of krafc, our users
            or others.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>3. Legal grounds for processing</h2>
        <p>
          Where required by applicable law, DEKODE GLOBAL LLP relies on one or
          more appropriate legal grounds to process personal information.
        </p>
        <p>Depending on the circumstances, these may include:</p>
        <ul>
          <li>
            <strong>Performance of a contract</strong> - where processing is
            necessary to provide the krafc services you request;
          </li>
          <li>
            <strong>Legitimate interests</strong> - where processing is
            necessary for purposes such as security, fraud prevention, service
            reliability and improvement, provided those interests are not
            overridden by applicable rights;
          </li>
          <li>
            <strong>Consent</strong> - where we rely on your consent, including
            for optional analytics where consent is required;
          </li>
          <li>
            <strong>Legal obligations</strong> - where processing is necessary
            to comply with applicable law; and
          </li>
          <li>Other lawful grounds recognised under applicable local law.</li>
        </ul>
        <p>
          Where processing is based on consent, you may withdraw that consent at
          any time. Withdrawal does not affect processing that took place before
          withdrawal.
        </p>
      </section>

      <section className="policy-section">
        <h2>4. Local browser storage and cloud data</h2>
        <p>krafc uses both browser-based storage and cloud services.</p>

        <h3>Local storage</h3>
        <p>
          Certain editor information, preferences and 3D assets may be stored
          locally in your browser using technologies such as local storage and
          IndexedDB.
        </p>
        <p>
          Information stored only in your browser is not automatically
          transmitted to krafc merely because it exists on your device.
        </p>

        <h3>Cloud storage</h3>
        <p>
          When you choose to save a project or asset to the krafc cloud,
          relevant account, project and design information is transmitted to
          krafc services and stored so that you can access it through your
          account.
        </p>
        <p>
          Cloud-saved projects generally remain available until you delete them,
          your account is deleted, or they are otherwise removed in accordance
          with our policies or applicable law.
        </p>
      </section>

      <section className="policy-section">
        <h2>5. Cookies and similar technologies</h2>
        <p>krafc uses cookies and similar technologies to:</p>
        <ul>
          <li>operate the platform;</li>
          <li>maintain secure sessions;</li>
          <li>remember your privacy preferences;</li>
          <li>support essential functionality; and</li>
          <li>where you consent, understand how krafc is used.</li>
        </ul>
        <p>
          Necessary technologies are used for essential functionality and
          security.
        </p>
        <p>
          Optional analytics technologies are not activated until you provide
          the applicable consent.
        </p>
        <p>
          For details of individual cookies, similar technologies, their
          purposes, providers, retention periods and your choices, please see
          the <a href="/cookie-policy">krafc Cookie Policy</a>.
        </p>
      </section>

      <section className="policy-section">
        <h2>6. When we share information</h2>
        <p>We do not sell, trade or rent personal information.</p>
        <p>
          We may disclose or make information available to service providers
          that process information on our behalf and help us operate krafc.
        </p>
        <p>These providers may include:</p>

        <h3>Cloudflare</h3>
        <p>
          Cloudflare provides infrastructure and services used by krafc for
          website delivery, application processing, security and cloud
          functionality.
        </p>
        <p>
          Cloudflare may process technical information, request information and
          other information necessary to provide these services.
        </p>

        <h3>Google</h3>
        <p>
          Google may process information when you choose Google as your sign-in
          provider.
        </p>
        <p>
          If you consent to Google Analytics, Google also processes analytics
          information on behalf of krafc.
        </p>

        <h3>Resend</h3>
        <p>
          krafc may use Resend to deliver verification and transactional emails.
        </p>
        <p>
          Resend may process information such as your email address and the
          content required to deliver those communications.
        </p>

        <h3>Legal and safety disclosures</h3>
        <p>We may disclose information where reasonably necessary to:</p>
        <ul>
          <li>comply with applicable law, regulation or legal process;</li>
          <li>respond to a valid request from a competent authority;</li>
          <li>
            protect the rights, property or safety of krafc, our users or
            others;
          </li>
          <li>investigate fraud, abuse or security incidents; or</li>
          <li>enforce our agreements and policies.</li>
        </ul>
        <p>
          We may also disclose information in connection with a merger,
          acquisition, financing, restructuring, sale of assets or similar
          corporate transaction, subject to applicable law.
        </p>
      </section>

      <section className="policy-section">
        <h2>7. International processing and transfers</h2>
        <p>
          krafc is intended for users internationally, and we may use service
          providers whose operations or infrastructure are located in countries
          other than the country in which you live.
        </p>
        <p>
          As a result, personal information may be processed internationally.
        </p>
        <p>
          Where applicable law requires safeguards for international transfers
          of personal information, DEKODE GLOBAL LLP will use appropriate
          contractual, organisational and technical safeguards.
        </p>
        <p>
          Depending on your location, these safeguards may include contractual
          protections, recognised transfer mechanisms or other measures
          permitted by applicable law.
        </p>
      </section>

      <section className="policy-section">
        <h2>8. Data retention</h2>
        <p>
          We retain personal information only for as long as reasonably
          necessary for the purposes described in this Privacy Policy, including
          to:
        </p>
        <ul>
          <li>provide and maintain your account and services;</li>
          <li>maintain security and prevent abuse;</li>
          <li>comply with legal obligations;</li>
          <li>resolve disputes; and</li>
          <li>enforce agreements.</li>
        </ul>
        <p>
          Cloud-saved designs and projects generally remain available until you
          delete them or your account is deleted, subject to applicable backup,
          security, legal and operational requirements.
        </p>
        <p>
          Certain information may remain in backups or records for a limited
          period after deletion where reasonably necessary for security, legal
          compliance or disaster recovery.
        </p>
        <p>
          When information is no longer required, we will take reasonable steps
          to delete it or otherwise dispose of it in accordance with applicable
          requirements.
        </p>
      </section>

      <section className="policy-section">
        <h2>9. Security</h2>
        <p>
          DEKODE GLOBAL LLP uses reasonable technical and organisational
          measures designed to protect personal information, accounts, cloud
          projects and uploaded assets against unauthorised access, alteration,
          disclosure, loss or destruction.
        </p>
        <p>
          These measures may include access controls, secure authentication
          mechanisms, encryption in transit and security controls provided by
          our infrastructure providers.
        </p>
        <p>No internet-based service can guarantee absolute security.</p>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and for notifying us if you believe your account
          has been accessed without authorisation.
        </p>
      </section>

      <section className="policy-section">
        <h2>10. Your privacy rights and choices</h2>
        <p>
          Depending on your location and applicable law, you may have rights
          relating to your personal information.
        </p>
        <p>These may include the right to:</p>
        <ul>
          <li>request access to personal information we hold about you;</li>
          <li>request correction of inaccurate information;</li>
          <li>request deletion of personal information;</li>
          <li>request restriction of certain processing;</li>
          <li>request a copy of certain personal information;</li>
          <li>object to certain processing;</li>
          <li>withdraw consent where processing is based on consent; and</li>
          <li>exercise other rights available under applicable law.</li>
        </ul>
        <p>You may also:</p>
        <ul>
          <li>delete individual cloud projects through krafc;</li>
          <li>sign out of your account;</li>
          <li>clear local browser data through your browser settings; and</li>
          <li>
            change your optional analytics preference through krafc Cookie
            Settings.
          </li>
        </ul>
        <p>
          To exercise a privacy right or make a privacy request, contact us at{" "}
          <a href="mailto:contactus@dekodeglobal.com">
            contactus@dekodeglobal.com
          </a>.
        </p>
        <p>
          We may need to verify your request before completing it, where
          permitted or required by applicable law.
        </p>
      </section>

      <section className="policy-section">
        <h2>11. Children's privacy</h2>
        <p>
          krafc is a professional 3D design platform and is not intended to
          knowingly collect personal information from children where such
          collection is prohibited by applicable law.
        </p>
        <p>
          If you believe that a child has provided personal information to krafc
          in circumstances where this was not permitted, please contact us at{" "}
          <a href="mailto:contactus@dekodeglobal.com">
            contactus@dekodeglobal.com
          </a>{" "}
          so that we can review the situation and take appropriate action.
        </p>
      </section>

      <section className="policy-section">
        <h2>12. Third-party services and links</h2>
        <p>
          krafc may use or link to third-party services, including
          authentication, analytics, infrastructure and communication providers.
        </p>
        <p>
          Third-party services may have their own privacy policies and terms.
          krafc is not responsible for the privacy practices of third-party
          websites or services that it does not control.
        </p>
        <p>
          Where relevant, we encourage you to review the privacy policies of
          those providers.
        </p>
      </section>

      <section className="policy-section">
        <h2>13. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in:
        </p>
        <ul>
          <li>krafc's services;</li>
          <li>the information we collect or how we use it;</li>
          <li>our service providers;</li>
          <li>applicable legal requirements; or</li>
          <li>our privacy practices.</li>
        </ul>
        <p>
          The "Last updated" date at the top of this policy indicates when the
          policy was most recently revised.
        </p>
        <p>
          Where required by applicable law, we will provide additional notice or
          obtain consent for material changes.
        </p>
      </section>

      <section className="policy-section">
        <h2>14. Contact us</h2>
        <p>
          If you have questions about this Privacy Policy, our privacy
          practices, or wish to exercise an applicable privacy right, please
          contact:
        </p>
        <p>
          DEKODE GLOBAL LLP
          <br />
          Operator of krafc
          <br />
          Email:{" "}
          <a href="mailto:contactus@dekodeglobal.com">
            contactus@dekodeglobal.com
          </a>
        </p>
      </section>
    </main>
  );
}
