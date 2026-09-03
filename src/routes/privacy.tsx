import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPolicy,
})

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-[var(--fg)]">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-lg text-[var(--fg-soft)] leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">1. Information We Collect</h2>
          <p>
            When you use kreatekaro, we collect information you provide directly to us, such as when you create or modify your account, use our 3D design tools, or communicate with us. This may include your name, email address, and any designs or assets you upload.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">2. How We Use Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, including the 3D rendering engine and cloud storage features. We may also use the information to send you technical notices, security alerts, and support messages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">3. Data Storage and Security</h2>
          <p>
            Cloud-saved account and design information is processed through Cloudflare Pages Functions and stored in Cloudflare D1. Local editor drafts and uploaded custom assets remain in your browser unless you deliberately use a cloud-save feature.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">4. Third-Party Services</h2>
          <p>
            We use Cloudflare for hosting, Workers, and D1 database services; Google for optional OAuth sign-in and consent-based analytics; and Resend for transactional email delivery. Optional analytics is disabled until you consent and can be changed through Cookie settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@kreatekaro.co.
          </p>
        </section>
      </div>
    </div>
  )
}
