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
            Your 3D designs and personal information are securely stored using industry-standard encryption. We use Cloudflare and robust database technologies to ensure your data is highly available and protected against unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--fg)] mb-4">4. Third-Party Services</h2>
          <p>
            We may use third-party services like Google for authentication (OAuth) and Amazon SES / Resend for email delivery. These services have their own privacy policies governing the data they collect and process on our behalf.
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
