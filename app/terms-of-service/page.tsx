import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

const title = 'Terms of Service & User Agreement | Clarant AI'
const description =
  'Review the terms and conditions governing the use of Clarant, including user responsibilities, platform usage, and service limitations.'
const url = '/terms-of-service'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
    robots: {
    index: false,
    follow: false,
  },
  openGraph: { title, description, url, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function TermsOfServicePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/terms-of-service" name="Terms of Service" />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Nav basePath="/" />

      <main id="main">
        <div className="container tos-wrap">
          <header className="tos-header">
            <span className="eyebrow">Legal</span>
            <h1 className="tos-title">Terms of Service</h1>
            <p className="tos-updated">Last updated: June 10, 2026</p>
          </header>

          <article className="tos-article">
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Clarant website, applications, APIs, and related services (collectively, the
              &ldquo;Services&rdquo;). These Terms form a legally binding agreement between you
              (&ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and Clarant
              (&ldquo;Clarant,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
            </p>
            <p>
              By accessing or using the Services, you agree to be bound by these Terms. If you do not
              agree, do not use the Services.
            </p>

            <h2 className="tos-h2">1. Eligibility and Authority</h2>
            <ul>
              <li>You must be at least 18 years old to use the Services.</li>
              <li>
                If you are using the Services on behalf of an organization, you represent that you
                have the authority to bind that organization to these Terms.
              </li>
            </ul>

            <h2 className="tos-h2">2. Services Overview</h2>
            <ul>
              <li>
                Clarant provides AI-powered tools that enable users to upload, analyze,
                summarize, and interact with documents and data using artificial intelligence.
              </li>
              <li>We may update, enhance, modify, or discontinue parts of the Services at any time.</li>
            </ul>

            <h2 className="tos-h2">3. Account Registration and Security</h2>
            <ul>
              <li>You must provide accurate and complete account information.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You are responsible for all activities occurring under your account.</li>
              <li>You must notify us immediately of any unauthorized use or security breach.</li>
              <li>We reserve the right to suspend or terminate accounts for violations of these Terms.</li>
            </ul>

            <h2 className="tos-h2">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Services for unlawful, fraudulent, or deceptive purposes</li>
              <li>Upload content that infringes intellectual property or privacy rights</li>
              <li>Upload malicious code, viruses, or harmful data</li>
              <li>Attempt to reverse engineer, scrape, or bypass system safeguards</li>
              <li>Use the Services to generate content that violates applicable laws or regulations</li>
              <li>Interfere with or disrupt system integrity or performance</li>
            </ul>
            <p>We reserve the right to investigate and take action against misuse.</p>

            <h2 className="tos-h2">5. User Content and Data</h2>

            <h3 className="tos-h3">5.1 Ownership</h3>
            <p>
              You retain ownership of all documents, files, and content you upload (&ldquo;User
              Content&rdquo;).
            </p>

            <h3 className="tos-h3">5.2 License to Operate</h3>
            <p>
              You grant Clarant a limited, non-exclusive license to process User Content solely
              to provide and improve the Services.
            </p>

            <h3 className="tos-h3">5.3 AI Processing</h3>
            <ul>
              <li>User Content is processed only to deliver requested outputs.</li>
              <li>User Content is not used to train public AI models.</li>
              <li>Data isolation is maintained between customers.</li>
            </ul>

            <h2 className="tos-h2">6. Intellectual Property</h2>
            <ul>
              <li>
                All rights, title, and interest in the Services&mdash;including software, models,
                interfaces, branding, and documentation&mdash;are owned by Clarant or its
                licensors.
              </li>
              <li>
                Except as expressly permitted, you may not copy, modify, distribute, sell, or create
                derivative works of the Services.
              </li>
            </ul>

            <h2 className="tos-h2">7. Subscriptions, Fees, and Payments</h2>
            <ul>
              <li>Certain features require a paid subscription.</li>
              <li>Fees are billed in advance and are non-refundable unless otherwise stated.</li>
              <li>You authorize us (or our payment processor) to charge applicable fees.</li>
              <li>We may change pricing with prior notice.</li>
              <li>Failure to pay may result in suspension or termination of access.</li>
            </ul>

            <h2 className="tos-h2">8. Free Trials</h2>
            <p>If a free trial is offered:</p>
            <ul>
              <li>Access is limited to the trial period and usage limits.</li>
              <li>We may modify or discontinue free trials at any time.</li>
              <li>Data from free trials may be deleted after the trial ends unless upgraded.</li>
            </ul>

            <h2 className="tos-h2">9. Third-Party Services</h2>
            <ul>
              <li>The Services may integrate with third-party platforms.</li>
              <li>
                Clarant is not responsible for third-party services, content, or availability.
                Your use of third-party services is governed by their terms.
              </li>
            </ul>

            <h2 className="tos-h2">10. Confidentiality</h2>
            <ul>
              <li>
                Each party agrees to protect the other party&rsquo;s confidential information and use
                it only to perform under these Terms.
              </li>
              <li>
                Confidential information excludes data that is publicly available or independently
                developed.
              </li>
            </ul>

            <h2 className="tos-h2">11. Termination</h2>
            <ul>
              <li>You may terminate your account at any time.</li>
            </ul>
            <p>We may suspend or terminate access immediately if:</p>
            <ul>
              <li>You violate these Terms</li>
              <li>Your use poses security, legal, or operational risks</li>
              <li>Required by law</li>
            </ul>
            <p>Upon termination, your right to use the Services ceases.</p>

            <h2 className="tos-h2">12. Disclaimers</h2>
            <p className="tos-legal-caps">THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo;</p>
            <p className="tos-legal-caps">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLARANT DISCLAIMS ALL WARRANTIES,
              INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT.
            </p>
            <p className="tos-legal-caps">
              AI-GENERATED OUTPUTS MAY CONTAIN ERRORS AND SHOULD NOT BE RELIED UPON AS LEGAL,
              FINANCIAL, OR PROFESSIONAL ADVICE.
            </p>

            <h2 className="tos-h2">13. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Clarant from claims arising out of:</p>
            <ul>
              <li>Your use of the Services</li>
              <li>Your User Content</li>
              <li>Violation of these Terms or applicable law</li>
            </ul>

            <h2 className="tos-h2">14. Governing Law and Dispute Resolution</h2>
            <ul>
              <li>
                These Terms are governed by the laws of the State of [Insert State], United States,
                without regard to conflict of law principles.
              </li>
              <li>
                Any disputes shall be resolved exclusively in the courts located in that
                jurisdiction.
              </li>
            </ul>

            <h2 className="tos-h2">15. Changes to These Terms</h2>
            <ul>
              <li>We may update these Terms from time to time.</li>
              <li>
                Material changes will be posted with an updated effective date. Continued use
                constitutes acceptance.
              </li>
            </ul>

            <h2 className="tos-h2">16. Contact Information</h2>
            <div className="tos-contact">
              <p className="tos-contact-name">Clarant</p>
              <p>
                Email:{' '}
                <a className="tos-link" href="mailto:support@clarant.ai">support@clarant.ai</a>
              </p>
              <p>
                Website:{' '}
                <a className="tos-link" href="https://clarant.ai">https://clarant.ai</a>
              </p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  )
}

const CSS = `
  .tos-wrap { padding: clamp(48px,7vw,88px) 0 clamp(56px,8vw,96px); }
  .tos-header { max-width: 760px; margin: 0 auto clamp(28px,4vw,44px); }
  .tos-title {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(34px,5vw,52px); line-height: 1.04;
    letter-spacing: -0.03em; margin: 14px 0 10px;
  }
  .tos-updated { color: var(--fg-subtle); font-size: 13.5px; margin: 0; }

  .tos-article { max-width: 760px; margin: 0 auto; }
  .tos-article p {
    color: var(--fg-muted); font-size: 15.5px; line-height: 1.7;
    margin: 0 0 16px; text-wrap: pretty;
  }
  .tos-article ul {
    margin: 0 0 18px; padding-left: 22px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .tos-article li { color: var(--fg-muted); font-size: 15.5px; line-height: 1.6; }
  .tos-article strong { color: var(--fg); font-weight: 600; }

  .tos-h2 {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(20px,2.4vw,26px); letter-spacing: -0.02em;
    color: var(--fg); margin: 36px 0 12px; scroll-margin-top: 88px;
  }
  .tos-h3 {
    font-family: var(--font-display); font-weight: 600;
    font-size: 16.5px; letter-spacing: -0.01em;
    color: var(--fg); margin: 22px 0 8px;
  }

  .tos-legal-caps {
    font-size: 13.5px; line-height: 1.7; letter-spacing: 0.01em;
    color: var(--fg);
  }

  .tos-link { color: var(--accent); text-decoration: none; }
  .tos-link:hover { text-decoration: underline; opacity: 1; }

  .tos-contact {
    margin-top: 4px; padding: 18px 20px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }
  .tos-contact p { margin: 0 0 6px; }
  .tos-contact p:last-child { margin-bottom: 0; }
  .tos-contact-name { color: var(--fg); font-weight: 600; }
`
