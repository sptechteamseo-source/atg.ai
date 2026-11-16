import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageAnimations from '@/components/ui/PageAnimations'
import DocsEnhancer from '../DocsEnhancer'
import Figure from '../Figure'

export const metadata: Metadata = {
  title: 'Stripe Integration Setup Guide | Clarant',
  description:
    'Connect Stripe to Clarant with this setup guide. Configure API access and search customer, payment, invoice, and subscription information.',
  alternates: { canonical: '/docs/stripe-setup-guide' },
}

// Image path convention — drop the uploaded screenshots here and they appear
// automatically:  public/images/docs/stripe/<file>
const IMG = '/images/docs/stripe'

// ── Table of contents (drives both the sidebar and the section anchors) ──
const TOC: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'setup', label: 'Connect Stripe' },
  { id: 'good-to-know', label: 'Good to Know' },
  { id: 'security', label: 'Security' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'support', label: 'Need Assistance' },
]

const LinkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

// Section heading with built-in copy-link button (enhanced by DocsEnhancer)
function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={`${id}-h`} className="doc-h2">
      {children}
      <button className="doc-anchor" type="button" data-anchor={id} aria-label="Copy link to this section">
        <LinkIcon />
      </button>
    </h2>
  )
}

export default function StripeSetupGuide() {
  return (
    <div className="doc-page">
      <PageAnimations />
      <Nav basePath="/" />

      <main id="main">
        <div className="doc-wrap">
          {/* ── Breadcrumb ── */}
          <nav className="doc-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep" aria-hidden="true">/</span>
            <Link href="/docs">Documentation</Link>
            <span className="sep" aria-hidden="true">/</span>
            <span aria-current="page">Stripe Setup Guide</span>
          </nav>

          {/* ── Header ── */}
          <header className="doc-header">
            <span className="eyebrow">Connector Guide</span>
            <h1 className="doc-title">Clarant — Stripe Integration Setup Guide</h1>

            <div className="doc-meta">
              <span>Connector setup</span>
              <span className="dot" aria-hidden="true" />
              <span>~2 minute setup</span>
              <span className="dot" aria-hidden="true" />
              <span>Requires a Stripe account</span>
            </div>
          </header>

          {/* ── Layout: article + sticky TOC ── */}
          <div className="doc-layout">
            <article className="doc-article">

              {/* ===== OVERVIEW ===== */}
              <section id="overview" data-doc-section className="doc-section">
                <SectionHeading id="overview">Overview</SectionHeading>
                <p>
                  Connect your Stripe account to let Clara securely manage customers,
                  payments, invoices, subscriptions, and other Stripe resources on your behalf.
                  Once connected, Clara can also surface Stripe activity within your
                  timeline (if supported by your plan).
                </p>
                <p>
                  Clara connects to Stripe using a <strong>Restricted API Key</strong>,
                  allowing you to grant only the permissions you choose.
                </p>
                <div className="callout callout--info">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Estimated setup time</span>
                    About 2 minutes.
                  </div>
                </div>
              </section>

              {/* ===== SETUP ===== */}
              <section id="setup" data-doc-section className="doc-section">
                <SectionHeading id="setup">Connect Stripe</SectionHeading>
                <p>Follow these six steps to create a Restricted API Key and connect it to Clara.</p>

                <div className="doc-steps">
                  {/* Step 1 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">1</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Open the Stripe Dashboard</h3>
                      <p>
                        Go to{' '}
                        <a className="doc-inline-link" href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">dashboard.stripe.com</a>{' '}
                        and sign in to your Stripe account. Decide which environment you want Clara to connect to:
                      </p>
                      <ul>
                        <li><strong>Test Mode</strong> — Uses sandbox data for testing.</li>
                        <li><strong>Live Mode</strong> — Uses your real Stripe account and customer data.</li>
                      </ul>
                      <p>
                        Use the <strong>Test Mode</strong> toggle at the top of the Stripe Dashboard
                        to switch between Test and Live mode.
                      </p>
                      <div className="callout callout--info">
                        <span className="callout-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        </span>
                        <div className="callout-body">
                          <span className="callout-title">Note</span>
                          The Restricted API Key you create automatically belongs to whichever mode is
                          currently active.
                        </div>
                      </div>
                      <Figure src={`${IMG}/01-dashboard.png`} alt="Stripe Dashboard home screen showing the Today overview, balances, and API keys panel" caption="Step 1 — Sign in to the Stripe Dashboard and choose Test or Live mode." />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">2</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Create a Restricted API Key</h3>
                      <p>
                        From the left navigation menu, click <strong>Developers → API Keys</strong>.
                        Direct link:{' '}
                        <a className="doc-inline-link" href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">dashboard.stripe.com/apikeys</a>.
                      </p>
                      <Figure src={`${IMG}/02-api-keys-menu.png`} alt="Stripe Developers menu with the API keys option highlighted" caption="Open Developers → API Keys." />

                      <p>Scroll to the <strong>Restricted Keys</strong> section and click <strong>Create Restricted Key</strong>.</p>
                      <Figure src={`${IMG}/03-restricted-keys.png`} alt="Stripe API keys page showing the Restricted keys section with the Create restricted key button highlighted" caption="Click Create Restricted Key in the Restricted Keys section." />

                      <p>
                        Select <strong>Authorizing an AI Agent</strong>, then click <strong>Continue</strong>.
                        Stripe opens the <strong>Create Restricted API Key</strong> page.
                      </p>
                      <Figure src={`${IMG}/04-create-restricted-key.png`} alt="Stripe Create a restricted key panel with the Authorizing an AI agent option selected" caption="Select Authorizing an AI Agent." />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">3</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Enter a Connector Name</h3>
                      <p>Enter a recognizable name for the Restricted API Key.</p>
                      <p>Recommended value: <strong>Clara Connector</strong></p>
                     
                    
                      <Figure src={`${IMG}/08-connect-modal.png`} alt="Clara Connect Stripe dialog with an API Key field for pasting the Restricted API Key" caption="Step 3 — Enter a recognizable connector name such as Clara Connector." />
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">4</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Configure the required permissions</h3>
                      <p>
                        When creating the Restricted API Key, every permission is initially set to
                        <strong> None</strong>. Configure the following permissions.
                      </p>

                      <h4 className="doc-h4">Required permissions</h4>
                      <div className="doc-table-wrap">
                        <table className="doc-table">
                          <thead>
                            <tr>
                              <th scope="col">Permission</th>
                              <th scope="col">Access level</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>Customers</td><td>Write</td></tr>
                            <tr><td>Charges and Refunds</td><td>Write</td></tr>
                            <tr><td>Payment Intents</td><td>Write</td></tr>
                            <tr><td>Invoices</td><td>Write</td></tr>
                            <tr><td>Subscriptions</td><td>Write</td></tr>
                            <tr><td>Events</td><td>Read</td></tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="callout callout--warning">
                        <span className="callout-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        </span>
                        <div className="callout-body">
                          <span className="callout-title">Important</span>
                          The <strong>Events</strong> permission must be set to <strong>Read</strong> so
                          Clara can synchronize Stripe activity with your timeline.
                        </div>
                      </div>

                      <h4 className="doc-h4">Recommended permissions</h4>
                      <p>For the best experience, enable the following additional permissions.</p>
                      <div className="doc-table-wrap">
                        <table className="doc-table">
                          <thead>
                            <tr>
                              <th scope="col">Permission</th>
                              <th scope="col">Access level</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>Products</td><td>Write</td></tr>
                            <tr><td>Prices</td><td>Write</td></tr>
                            <tr><td>Payment Methods</td><td>Write</td></tr>
                            <tr><td>Coupons</td><td>Write</td></tr>
                            <tr><td>Promotion Codes</td><td>Write</td></tr>
                            <tr><td>Tax IDs</td><td>Write</td></tr>
                            <tr><td>Credit Notes</td><td>Write</td></tr>
                            <tr><td>Balance</td><td>Read</td></tr>
                            <tr><td>Payouts</td><td>Read</td></tr>
                            <tr><td>Checkout Sessions</td><td>Write (if using Stripe Checkout)</td></tr>
                            <tr><td>Payment Links</td><td>Write (if creating payment links)</td></tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="callout callout--info">
                        <span className="callout-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        </span>
                        <div className="callout-body">
                          <span className="callout-title">Note</span>
                          Selecting <strong>Write</strong> automatically includes <strong>Read</strong> access.
                          Any permissions left as <strong>None</strong> simply won&apos;t be available to Clara.
                        </div>
                      </div>

                    
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">5</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Create and copy the API Key</h3>
                      <p>
                        Click <strong>Create Key</strong>. Stripe displays the key only once. Click
                        <strong> Reveal</strong>, then copy the complete Restricted API Key.
                      </p>
                      <p>The key will begin with:</p>
                      <ul>
                        <li><code>rk_test_...</code> (Test Mode)</li>
                        <li><code>rk_live_...</code> (Live Mode)</li>
                      </ul>
                      <div className="callout callout--warning">
                        <span className="callout-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        </span>
                        <div className="callout-body">
                          <span className="callout-title">Important</span>
                          Store the key securely. If you lose it, simply create another Restricted API Key.
                        </div>
                      </div>
                      <Figure src={`${IMG}/06-created-key.png`} alt="Stripe API keys page showing the newly created restricted key listed under Restricted keys" caption="Step 5 — Reveal and copy the Restricted API Key." />
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">6</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Connect Stripe in Clara</h3>
                      <p>
                        Open Clara and navigate to <strong>Settings → Connectors</strong>, then
                        select <strong>Stripe</strong>.
                      </p>
                      <Figure src={`${IMG}/07-connectors.png`} alt="Clara Connectors settings page listing available integrations including the Stripe connector" caption="Open Settings → Connectors and select Stripe." />

                      <p>
                        Paste your Restricted API Key into the <strong>Stripe Secret Key</strong> field,
                        then click <strong>Connect</strong>.
                      </p>
                      <Figure src={`${IMG}/stripe_secret_key.png`} alt="Clara Connect Stripe dialog with an API Key field for pasting the Restricted API Key" caption="Step 6 — Paste your Restricted API Key and click Connect." />

                      <p>Clara will:</p>
                      <ul>
                        <li>Validate your API Key.</li>
                        <li>Detect whether it is a Test or Live key.</li>
                        <li>Load the available Stripe tools.</li>
                        <li>Begin syncing recent Stripe activity (if supported by your subscription).</li>
                      </ul>
                    </div>
                  </div>
                </div>

                
              </section>

              {/* ===== GOOD TO KNOW ===== */}
              <section id="good-to-know" data-doc-section className="doc-section">
                <SectionHeading id="good-to-know">Good to Know</SectionHeading>

                <div className="callout callout--info">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Security</span>
                    <p>Clara only receives the permissions granted through your Restricted API Key.</p>
                    <p>
                      You can revoke or rotate the key at any time by navigating to{' '}
                      <strong>Stripe Dashboard → Developers → API Keys</strong>.
                    </p>
                    <p>
                      Revoking the key immediately disconnects Clara without affecting any other
                      Stripe services.
                    </p>
                  </div>
                </div>

                <h3 className="doc-h3">Test Mode vs Live Mode</h3>
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th scope="col">Mode</th>
                        <th scope="col">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Test Mode</td>
                        <td>Uses sandbox data. Safe for testing integrations. No real transactions are processed.</td>
                      </tr>
                      <tr>
                        <td>Live Mode</td>
                        <td>Uses your actual Stripe account with real customer and payment information. Recommended for production use.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="doc-h3">Updating permissions</h3>
                <p>
                  If Clara cannot perform a particular Stripe action, the corresponding
                  permission may still be set to <strong>None</strong>. To update permissions:
                </p>
                <ol className="doc-list">
                  <li>Open the Stripe Dashboard.</li>
                  <li>Navigate to <strong>Developers → API Keys</strong>.</li>
                  <li>Update the Restricted API Key permissions, or create a new Restricted Key.</li>
                  <li>Reconnect the key inside Clara.</li>
                </ol>
              </section>

              {/* ===== SECURITY ===== */}
              

              {/* ===== TROUBLESHOOTING ===== */}
              <section id="troubleshooting" data-doc-section className="doc-section">
                <SectionHeading id="troubleshooting">Troubleshooting</SectionHeading>
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th scope="col">Issue</th>
                        <th scope="col">Possible cause</th>
                        <th scope="col">Resolution</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Invalid API Key</td>
                        <td>The copied key is incorrect or has been revoked.</td>
                        <td>Verify the key starts with <code>rk_test_</code> or <code>rk_live_</code>, then copy it again or create a new Restricted API Key.</td>
                      </tr>
                      <tr>
                        <td>No Stripe data appears</td>
                        <td>You&apos;re using a Test key with no test data, or required permissions are missing.</td>
                        <td>Create test transactions, or enable the required permissions and reconnect.</td>
                      </tr>
                      <tr>
                        <td>Permission error while performing an action</td>
                        <td>The required permission is still set to None.</td>
                        <td>Update the Restricted API Key permissions to Read or Write, then reconnect Clara.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ===== SUPPORT ===== */}
              <section id="support" data-doc-section className="doc-section">
                <SectionHeading id="support">Need Assistance</SectionHeading>
                <p>If you experience any issues while connecting Stripe to Clara, verify that:</p>
                <ul>
                  <li>You created a Restricted API Key.</li>
                  <li>All required permissions have been granted.</li>
                  <li>You copied the complete API Key.</li>
                  <li>The key has not been revoked.</li>
                  <li>You are connecting to the correct environment (Test or Live).</li>
                </ul>
                <p>
                  Once configured correctly, Clara will securely connect to your Stripe account
                  and make the authorized Stripe capabilities available within the platform.
                </p>
                <div className="callout callout--info">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Email support</span>
                    <a className="doc-inline-link" href="mailto:support@clarant.ai">support@clarant.ai</a>
                  </div>
                </div>
              </section>

              {/* ── Prev / Next ── */}
              <nav className="doc-prevnext" aria-label="Documentation navigation">
                <Link href="/docs" className="doc-nav-card is-prev">
                  <span className="doc-nav-dir">← Previous</span>
                  <span className="doc-nav-label">All documentation</span>
                </Link>
                <div className="doc-nav-card is-next is-disabled" aria-disabled="true">
                  <span className="doc-nav-dir">Next →</span>
                  <span className="doc-nav-label">More guides coming soon</span>
                </div>
              </nav>
            </article>

            {/* ── Sticky TOC ── */}
            <aside className="doc-toc" aria-label="On this page">
              <p className="doc-toc-title">On this page</p>
              <ol>
                {TOC.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.label}</a>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <DocsEnhancer />
    </div>
  )
}
