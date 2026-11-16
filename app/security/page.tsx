import type { Metadata } from 'next'
import Script from 'next/script'
import Nav from '@/components/layout/Nav'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'AI Data Security and Privacy | Clarant',
  description:
    'Learn how Clarant protects business data with access controls, encryption, audit logging, and regional data residency for secure AI-powered search.',
  alternates: { canonical: '/security' },
  openGraph: {
    title: 'Security at Clarant',
    description:
      'Enterprise-grade data protection, encryption, access control, infrastructure security, and compliance.',
    type: 'website',
    url: '/security',
  },
}

// Each pillar maps to one of the required content areas.
const PILLARS = [
  {
    icon: '🛡',
    title: 'Data Protection',
    body: 'Your content belongs to you. Uploaded documents and data are processed solely to deliver the functionality you request, never used to train public AI models, and kept logically isolated between tenants.',
    points: [
      'Customer data is logically isolated per workspace',
      'Your content is never used to train shared or public models',
      'Configurable data-retention windows with hard-delete on request',
      'Regular encrypted backups with tested restore procedures',
    ],
  },
  {
    icon: '🔒',
    title: 'Privacy & Security Practices',
    body: 'Privacy is designed in, not bolted on. We collect the minimum data needed to run the service, are transparent about how it is used, and never sell personal data.',
    points: [
      'Privacy-by-design and data-minimization principles',
      'Clear data-processing agreements (DPA) available for customers',
      'Vendor risk reviews before any subprocessor is onboarded',
      'Documented incident-response and breach-notification process',
    ],
  },
  {
    icon: '🏗',
    title: 'Infrastructure Security',
    body: 'We run on hardened, reputable cloud infrastructure with defense-in-depth. Networks are segmented, systems are continuously patched, and everything is monitored around the clock.',
    points: [
      'Hosted on SOC 2-aligned cloud providers with regional options (US, EU, APAC)',
      'Network segmentation, firewalls, and private networking',
      'Continuous monitoring, logging, and anomaly alerting',
      'Routine vulnerability scanning and third-party penetration testing',
    ],
  },
  {
    icon: '🔑',
    title: 'Access Control',
    body: 'Access to data is granted on a strict need-to-know basis. Both your team and ours operate under least-privilege, role-based controls with strong authentication.',
    points: [
      'Role-based access control (RBAC) for every account',
      'Single Sign-On (SSO) and SAML support on enterprise plans',
      'Multi-factor authentication (MFA) for privileged access',
      'Audit logs for sensitive actions and administrative changes',
    ],
  },
  {
    icon: '🔐',
    title: 'Encryption Standards',
    body: 'Data is protected with strong, industry-standard cryptography at every stage — moving across the network and sitting at rest in storage.',
    points: [
      'TLS 1.2+ for all data in transit',
      'AES-256 encryption for data at rest',
      'Managed key rotation and secure secrets storage',
      'Encrypted database backups',
    ],
  },
  {
    icon: '✅',
    title: 'Compliance & Best Practices',
    body: 'We align our program with recognized frameworks and continually improve through audits, training, and disciplined engineering practices.',
    points: [
      'SOC 2 Type II program and GDPR-aligned data handling',
      'CCPA support and DPAs for regulated customers',
      'Secure software development lifecycle (SSDLC) with code review',
      'Ongoing security awareness training for all staff',
    ],
  },
]

export default function SecurityPage() {
  // JSON-LD so search/answer engines can read the page structure.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Security at Clarant',
    description:
      'How Clarant protects customer data through encryption, access control, infrastructure security, and compliance.',
    url: 'https://clarant.ai/security',
    publisher: {
      '@type': 'Organization',
      name: 'Clarant',
      url: 'https://clarant.ai',
    },
  }

  return (
    <>
      <BreadcrumbJsonLd path="/security" name="Security" />
      <Script
        id="security-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Nav basePath="/" />

      <main id="main">
        <div className="container sec-wrap">
          <header className="sec-header">
            <span className="eyebrow">Trust &amp; Security</span>
            <h1 className="sec-title">Security you can verify, not just trust.</h1>
            <p className="sec-lede">
              Clarant is built for revenue, support, and operations leaders who can&rsquo;t
              afford a wrong answer — or a data incident. Here&rsquo;s how we protect your data at
              every layer, from encryption and access control to infrastructure and compliance.
            </p>
          </header>

          <section className="sec-grid" aria-label="Security practices">
            {PILLARS.map((p) => (
              <article key={p.title} className="sec-card">
                <span className="sec-card-ic" aria-hidden="true">{p.icon}</span>
                <h2 className="sec-card-title">{p.title}</h2>
                <p className="sec-card-body">{p.body}</p>
                <ul className="sec-card-list">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section className="sec-contact" aria-labelledby="sec-contact-h">
            <h2 id="sec-contact-h" className="sec-contact-h">Report a vulnerability</h2>
            <p>
              We welcome responsible disclosure. If you believe you&rsquo;ve found a security issue,
              please email{' '}
              <a className="sec-link" href="mailto:security@clarant.ai">security@clarant.ai</a>{' '}
              and we&rsquo;ll respond promptly. For data-processing agreements or a copy of our
              compliance reports, contact{' '}
              <a className="sec-link" href="mailto:support@clarant.ai">support@clarant.ai</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

const CSS = `
  .sec-wrap { padding: clamp(48px,7vw,88px) 0 clamp(40px,6vw,72px); }
  .sec-header { max-width: 780px; margin: 0 auto clamp(36px,5vw,56px); text-align: center; }
  .sec-title {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(34px,5vw,54px); line-height: 1.04;
    letter-spacing: -0.03em; margin: 14px 0 16px;
  }
  .sec-lede { color: var(--fg-muted); font-size: clamp(15.5px,1.6vw,18px); line-height: 1.6; margin: 0; text-wrap: pretty; }

  .sec-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
    max-width: 1100px; margin: 0 auto;
  }
  @media (max-width: 980px) { .sec-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 640px) { .sec-grid { grid-template-columns: 1fr; } }

  .sec-card {
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 24px 22px;
    display: flex; flex-direction: column; gap: 10px;
    transition: border-color var(--dur) var(--ease), transform var(--dur) var(--ease);
  }
  .sec-card:hover { border-color: color-mix(in oklab, var(--accent) 40%, var(--border)); transform: translateY(-2px); }
  .sec-card-ic {
    width: 44px; height: 44px; border-radius: 12px;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--accent-soft); border: 1px solid color-mix(in oklab, var(--accent) 28%, transparent);
    font-size: 20px; margin-bottom: 4px;
  }
  .sec-card-title {
    font-family: var(--font-display); font-weight: 600;
    font-size: 18px; letter-spacing: -0.02em; color: var(--fg); margin: 0;
  }
  .sec-card-body { color: var(--fg-muted); font-size: 14px; line-height: 1.6; margin: 0; }
  .sec-card-list { margin: 6px 0 0; padding-left: 18px; display: flex; flex-direction: column; gap: 7px; }
  .sec-card-list li { color: var(--fg-muted); font-size: 13.5px; line-height: 1.5; }

  .sec-contact {
    max-width: 780px; margin: clamp(40px,6vw,64px) auto 0;
    padding: 24px 24px; text-align: center;
    background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-lg);
  }
  .sec-contact-h {
    font-family: var(--font-display); font-weight: 600;
    font-size: 20px; letter-spacing: -0.02em; color: var(--fg); margin: 0 0 10px;
  }
  .sec-contact p { color: var(--fg-muted); font-size: 15px; line-height: 1.7; margin: 0; }
  .sec-link { color: var(--accent); text-decoration: none; }
  .sec-link:hover { text-decoration: underline; opacity: 1; }
`
