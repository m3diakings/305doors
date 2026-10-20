import { type Metadata } from 'next'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { BlogShell } from '@/components/site/BlogShell'
import { BUSINESS_NAME, SITE_ORIGIN } from '@/lib/site'

const UPDATED = 'October 20, 2026'
const PRIVACY_EMAIL = 'info@305doors.com'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${BUSINESS_NAME} collects, uses, and protects information shared through 305doors.com.`,
  alternates: { canonical: '/privacy/' },
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-medium tracking-tight text-slate-900">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <BlogShell>
      <Container className="py-16 lg:py-24">
        <article className="mx-auto max-w-3xl">
          <p className="font-display text-base font-semibold text-blue-600">
            {BUSINESS_NAME}
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: {UPDATED}</p>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            This policy explains what information {BUSINESS_NAME}{' '}
            (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through{' '}
            {SITE_ORIGIN.replace(/^https?:\/\//, '')} and how we use it.
          </p>

          <Section title="Information we collect">
            <p>
              When you request a quote or contact us, we collect the details you
              provide: your name, phone number or email address, service
              address, and a description of your garage door needs.
            </p>
            <p>
              We also collect standard website usage data, such as pages
              visited, device and browser type, and approximate location,
              through Google Analytics and cookies.
            </p>
          </Section>

          <Section title="How we use it">
            <p>
              We use your contact details to respond to your request, schedule
              service, send estimates, and follow up about your job. Usage data
              helps us understand how the site is used and improve it.
            </p>
            <p>We do not sell your personal information.</p>
          </Section>

          <Section title="Who we share it with">
            <p>
              We share information only with service providers that help us run
              the business, such as our website host, email delivery, customer
              relationship management, and analytics providers. They may use it
              only to provide services to us. We may also disclose information
              when required by law.
            </p>
          </Section>

          <Section title="Social media and Google Business Profile">
            <p>
              We publish posts about our services and articles to our own
              Facebook Page, Instagram account, and Google Business Profile
              using the official tools those platforms provide. These tools act
              only on accounts we manage and do not collect information about
              visitors to this site.
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              You can ask us to access, correct, or delete the personal
              information you have shared with us. You can block or delete
              cookies in your browser settings, and you can opt out of Google
              Analytics at{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                className="font-semibold text-blue-600 hover:underline"
              >
                tools.google.com/dlpage/gaoptout
              </a>
              .
            </p>
          </Section>

          <Section title="Data retention and security">
            <p>
              We keep request and job records for as long as needed to serve you
              and meet our business and legal obligations, and we use reasonable
              safeguards to protect them.
            </p>
          </Section>

          <Section title="Children">
            <p>
              This site is not directed to children under 13, and we do not
              knowingly collect their information.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              For privacy questions or requests, email{' '}
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {PRIVACY_EMAIL}
              </a>{' '}
              or send a message through our{' '}
              <Link
                href="/#contact"
                className="font-semibold text-blue-600 hover:underline"
              >
                contact form
              </Link>
              . We may update this policy from time to time; the date above
              shows the latest version.
            </p>
          </Section>
        </article>
      </Container>
    </BlogShell>
  )
}
