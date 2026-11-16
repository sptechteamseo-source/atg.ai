import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

const title = 'Privacy Policy & Data Security | Clarant AI'
const description =
  "Read Clarant's privacy policy explaining how we collect, use, store, and protect your data across our AI document platform."
const url = '/privacy-policy'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/privacy-policy" name="Privacy Policy" />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Nav basePath="/" />

      <main id="main">
        <div className="container pp-wrap">
          <header className="pp-header">
            <span className="eyebrow">Legal</span>
            <h1 className="pp-title">Privacy Policy</h1>
            <p className="pp-updated">Last updated: June 10, 2026</p>
          </header>

          <article className="pp-article">
            <p>
              Clarant (&ldquo;Clarant,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
              &ldquo;us&rdquo;) respects your privacy and is committed to protecting it through this
              Privacy Policy. This policy explains how we collect, use, disclose, and safeguard your
              information when you access or use our website, applications, and services
              (collectively, the &ldquo;Services&rdquo;).
            </p>
            <p>
              By using Clarant, you agree to the collection and use of information in
              accordance with this Privacy Policy.
            </p>

            <h2 className="pp-h2">1. Information We Collect</h2>

            <h3 className="pp-h3">1.1 Information You Provide Directly</h3>
            <p>We may collect information that you voluntarily provide, including:</p>
            <ul>
              <li>Name, email address, company name, job title</li>
              <li>Account credentials</li>
              <li>Billing and payment information (processed via third-party payment processors Stripe)</li>
              <li>Uploaded documents, files, and content</li>
              <li>Communications with us (support requests, feedback, inquiries)</li>
            </ul>

            <h3 className="pp-h3">1.2 Information Collected Automatically</h3>
            <p>When you access our Services, we may automatically collect:</p>
            <ul>
              <li>IP address, browser type, operating system</li>
              <li>Device identifiers</li>
              <li>Usage data (pages viewed, features used, time spent)</li>
              <li>Log files and diagnostic data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="pp-h3">1.3 Information from Third Parties</h3>
            <p>We may receive information from:</p>
            <ul>
              <li>Authentication providers (e.g., Google, Microsoft)</li>
              <li>Payment processors</li>
              <li>Analytics and monitoring tools</li>
              <li>Enterprise integrations enabled by you (e.g., CRM, document systems)</li>
            </ul>

            <h2 className="pp-h2">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide, operate, and maintain our Services</li>
              <li>Process transactions and manage subscriptions</li>
              <li>Improve product functionality and user experience</li>
              <li>Enable AI-driven responses based on user-provided content</li>
              <li>Communicate service updates, security alerts, and support messages</li>
              <li>Detect, prevent, and address fraud, abuse, or security incidents</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>
            <p><strong>We do not sell your personal data.</strong></p>

            <h2 className="pp-h2">3. Use of AI and Uploaded Content</h2>
            <ul>
              <li>Uploaded documents and data are processed solely to provide requested functionality.</li>
              <li>Your content is not used to train public AI models.</li>
              <li>Data isolation is maintained between users.</li>
              <li>You retain ownership of your uploaded content.</li>
            </ul>

            <h2 className="pp-h2">4. Data Sharing and Disclosure</h2>
            <p>We may share information only in the following circumstances:</p>
            <ul>
              <li>With trusted service providers acting on our behalf (hosting, analytics, payments)</li>
              <li>To comply with legal obligations, court orders, or lawful requests</li>
              <li>To protect the rights, property, or safety of Clarant or users</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p>All vendors are contractually obligated to protect your data.</p>

            <h2 className="pp-h2">5. Data Retention</h2>
            <p>We retain personal data only for as long as necessary to:</p>
            <ul>
              <li>Fulfill the purposes outlined in this policy</li>
              <li>Comply with legal, accounting, or regulatory requirements</li>
            </ul>
            <p>
              Upon account termination, data is deleted or anonymized according to our retention
              policies, unless otherwise required by law.
            </p>

            <h2 className="pp-h2">6. Security Measures</h2>
            <p>We implement industry-standard security measures, including:</p>
            <ul>
              <li>Encryption in transit and at rest</li>
              <li>Access controls and authentication</li>
              <li>Regular monitoring and vulnerability assessments</li>
            </ul>
            <p>However, no method of transmission over the internet is 100% secure.</p>

            <h2 className="pp-h2">7. Your Privacy Rights</h2>
            <p>Depending on your jurisdiction, you may have rights to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
            </ul>
            <p>
              Requests can be submitted to:{' '}
              <a className="pp-link" href="mailto:privacy@clarant.ai">privacy@clarant.ai</a>
            </p>

            <h2 className="pp-h2">8. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Authenticate users</li>
              <li>Improve performance and analytics</li>
              <li>Remember preferences</li>
            </ul>
            <p>You can control cookies through your browser settings.</p>

            <h2 className="pp-h2">9. International Data Transfers</h2>
            <p>
              Your information may be processed and stored in countries other than your own. We
              ensure appropriate safeguards are in place for international data transfers.
            </p>

            <h2 className="pp-h2">10. Children&rsquo;s Privacy</h2>
            <p>
              Clarant is not intended for individuals under the age of 13. We do not knowingly
              collect personal data from children.
            </p>

            <h2 className="pp-h2">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page
              with a revised effective date.
            </p>

            <h2 className="pp-h2">12. Google User Data</h2>
            <p>
              This section explains how Clarant accesses, uses, stores and shares data from Google
              Workspace when you connect a Google account. It applies in addition to the rest of
              this Privacy Policy.
            </p>

            <h3 className="pp-h3">Data we access</h3>
            <p>
              Clarant accesses Google user data only after you connect a Google product on the
              Connectors page and approve Google&rsquo;s consent screen. Each product is connected
              separately, and Clarant accesses only the data for the products you connect:
            </p>
            <ul>
              <li>
                <strong>Gmail:</strong> the content and metadata (sender, recipients, subject, date
                and snippet) of your emails, to answer your questions in chat and to flag emails
                awaiting your reply in your daily brief; and creating email drafts when you ask.
              </li>
              <li>
                <strong>Google Drive, Docs, Sheets and Slides:</strong> the content of files you ask
                about, to answer your questions; editing your files and creating new files when you
                ask; and metadata of recently modified files (name, type, modified time, link, owner
                and last editor) for your daily brief.
              </li>
              <li>
                <strong>Google Calendar:</strong> your calendar list, events and availability, to
                answer questions about your schedule; creating, updating and cancelling events when
                you ask; and upcoming events for your daily brief.
              </li>
              <li>
                <strong>Google Meet:</strong> creating meeting links when you ask; your past
                meetings, attendees and, where available, transcripts and recording links, to answer
                your questions; and past meeting times for your daily brief.
              </li>
            </ul>

            <h3 className="pp-h3">How we use it</h3>
            <p>
              We use Google user data only to provide and improve the user-facing features described
              above for you, the user who connected the account. Clarant changes your Google data
              (for example, editing a document or creating a calendar event) only when you explicitly
              ask it to in chat.
            </p>
            <p>We do not use Google user data for advertising, and we do not sell it.</p>

            <h3 className="pp-h3">AI models</h3>
            <p>
              Google user data is not used to develop, improve or train generalized artificial
              intelligence or machine learning models, whether ours or a third party&rsquo;s. When
              Clarant uses an AI model to answer your request, your data is processed only to produce
              that answer, under contracts that prohibit the AI provider from using it for training.
            </p>

            <h3 className="pp-h3">Sharing</h3>
            <p>We share Google user data only:</p>
            <ul>
              <li>
                with service providers that process it on our behalf to operate Clarant, such as
                cloud hosting and AI model providers, under contracts that require them to protect it
                and use it only for that purpose;
              </li>
              <li>
                when you direct us to (for example, sending an email you asked Clarant to send);
              </li>
              <li>when required by law, or to protect the security of Clarant and its users.</li>
            </ul>
            <p>
              No person at Clarant reads your Google user data unless you give us permission (for
              example, for a support request), it is necessary for security purposes, or it is
              required by law.
            </p>

            <h3 className="pp-h3">Storage and security</h3>
            <p>
              Google user data is transmitted over encrypted connections and stored encrypted at
              rest. Your Google access tokens are stored securely and used only to provide the
              features above. Metadata synced for your daily brief is kept while the connector stays
              connected.
            </p>

            <h3 className="pp-h3">Retention, revocation and deletion</h3>
            <p>
              You can disconnect any Google product at any time on the Connectors page. When you
              disconnect, Clarant stops accessing that product and deletes the related synced Google
              data within{/* ponytail: [X] days unverified — flagged placeholder, needs real retention window before publish */}{' '}
              [X] days. You can also revoke Clarant&rsquo;s access at any time at{' '}
              <a
                className="pp-link"
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://myaccount.google.com/permissions
              </a>
              . To request deletion of your data, contact{' '}
              <a className="pp-link" href="mailto:support@clarant.ai">support@clarant.ai</a>.
            </p>

            <h3 className="pp-h3">Limited Use disclosure</h3>
            <p>
              Clarant&rsquo;s use and transfer to any other app of information received from Google
              APIs will adhere to the{' '}
              <a
                className="pp-link"
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>

            <h2 className="pp-h2">13. Contact Us</h2>
            <p>For questions or concerns regarding this Privacy Policy, contact us at:</p>
            <div className="pp-contact">
              <p className="pp-contact-name">Clarant</p>
              <p>
                Email:{' '}
                <a className="pp-link" href="mailto:support@clarant.ai">support@clarant.ai</a>
              </p>
              <p>
                Website:{' '}
                <a className="pp-link" href="https://clarant.ai">https://clarant.ai</a>
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
  .pp-wrap { padding: clamp(48px,7vw,88px) 0 clamp(56px,8vw,96px); }
  .pp-header { max-width: 760px; margin: 0 auto clamp(28px,4vw,44px); }
  .pp-title {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(34px,5vw,52px); line-height: 1.04;
    letter-spacing: -0.03em; margin: 14px 0 10px;
  }
  .pp-updated { color: var(--fg-subtle); font-size: 13.5px; margin: 0; }

  .pp-article { max-width: 760px; margin: 0 auto; }
  .pp-article p {
    color: var(--fg-muted); font-size: 15.5px; line-height: 1.7;
    margin: 0 0 16px; text-wrap: pretty;
  }
  .pp-article ul {
    margin: 0 0 18px; padding-left: 22px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .pp-article li { color: var(--fg-muted); font-size: 15.5px; line-height: 1.6; }
  .pp-article strong { color: var(--fg); font-weight: 600; }

  .pp-h2 {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(20px,2.4vw,26px); letter-spacing: -0.02em;
    color: var(--fg); margin: 36px 0 12px; scroll-margin-top: 88px;
  }
  .pp-h3 {
    font-family: var(--font-display); font-weight: 600;
    font-size: 16.5px; letter-spacing: -0.01em;
    color: var(--fg); margin: 22px 0 8px;
  }

  .pp-link { color: var(--accent); text-decoration: none; }
  .pp-link:hover { text-decoration: underline; opacity: 1; }

  .pp-contact {
    margin-top: 4px; padding: 18px 20px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }
  .pp-contact p { margin: 0 0 6px; }
  .pp-contact p:last-child { margin-bottom: 0; }
  .pp-contact-name { color: var(--fg); font-weight: 600; }
`
