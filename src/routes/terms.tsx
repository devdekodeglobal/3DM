import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/terms')({
  component: TermsOfServicePage,
})

function TermsOfServicePage() {
  return (
    <main className="policy-page page-wrap">
      <header className="policy-hero">
        <span className="badge">
          <ShieldCheck size={15} /> Legal
        </span>
        <h1 className="display">Terms of Service</h1>
        <p>
          By accessing or using KreateKaro, you agree to be bound by these Terms of Service.
        </p>
        <p className="policy-updated">Last updated: 3 September 2026</p>
      </header>

      <section className="policy-section">
        <h2>1. Use of Service</h2>
        <p>
          KreateKaro provides an online platform for 3D space design and visualization. You are responsible for any activity that occurs under your account. You agree not to use the service for any illegal or unauthorized purpose.
        </p>
      </section>

      <section className="policy-section">
        <h2>2. User Content</h2>
        <p>
          You retain all rights to any 3D designs, assets, or other content you submit, post or display on or through the service. By submitting content, you grant us a license to use, store, and display that content solely for the purpose of providing the service to you.
        </p>
      </section>

      <section className="policy-section">
        <h2>3. Intellectual Property</h2>
        <p>
          The service and its original content (excluding user-provided content), features, and functionality are and will remain the exclusive property of KreateKaro and its licensors.
        </p>
      </section>

      <section className="policy-section">
        <h2>4. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
      </section>

      <section className="policy-section">
        <h2>5. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any material changes before they take effect.
        </p>
      </section>
    </main>
  )
}
