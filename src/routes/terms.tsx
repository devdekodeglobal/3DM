import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsOfService,
})

function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-[var(--fg)]">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-lg text-[var(--fg-soft)] leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using kreatekaro, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">2. Use of Service</h2>
          <p>
            kreatekaro provides an online platform for 3D space design and visualization. You are responsible for any activity that occurs under your account. You agree not to use the service for any illegal or unauthorized purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">3. User Content</h2>
          <p>
            You retain all rights to any 3D designs, assets, or other content you submit, post or display on or through the service. By submitting content, you grant us a license to use, store, and display that content solely for the purpose of providing the service to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">4. Intellectual Property</h2>
          <p>
            The service and its original content (excluding user-provided content), features, and functionality are and will remain the exclusive property of kreatekaro and its licensors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">5. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any material changes before they take effect.
          </p>
        </section>
      </div>
    </div>
  )
}
