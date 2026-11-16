import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageAnimations from '@/components/ui/PageAnimations'
import DocsEnhancer from '../DocsEnhancer'
import Figure from '../Figure'

export const metadata: Metadata = {
  title: 'Jira Cloud Connector Setup Guide | Clarant',
  description:
    'Learn how to connect Jira Cloud to Clarant, complete Atlassian administrator authorization, configure domains, and start using Jira data inside Clarant.',
  alternates: { canonical: '/docs/jira-setup-guide' },
}

// Image path convention — drop the uploaded screenshots here and they appear
// automatically:  public/images/docs/jira/<file>
const IMG = '/images/docs/jira'

// ── Table of contents (drives both the sidebar and the section anchors) ──
const TOC: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'connect', label: 'Connect Jira from Clara' },
  { id: 'admin-auth', label: 'Administrator Authorization' },
  { id: 'admin-setup', label: 'Administrator Setup' },
  { id: 'complete', label: 'Complete the Connection' },
  { id: 'verify', label: 'Verify Connection' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'permissions', label: 'Permissions Requested' },
  { id: 'support', label: 'Support' },
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

export default function JiraSetupGuide() {
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
            <span aria-current="page">Jira Setup Guide</span>
          </nav>

          {/* ── Header ── */}
          <header className="doc-header">
            <span className="eyebrow">Connector Guide</span>
            <h1 className="doc-title">Clarant — Jira Cloud Integration Setup Guide</h1>

            <div className="doc-meta">
              <span>Connector setup</span>
              <span className="dot" aria-hidden="true" />
              <span>~2 minute read</span>
              <span className="dot" aria-hidden="true" />
              <span>Requires Atlassian admin access</span>
            </div>
          </header>

          {/* ── Layout: article + sticky TOC ── */}
          <div className="doc-layout">
            <article className="doc-article">

              {/* ===== OVERVIEW ===== */}
              <section id="overview" data-doc-section className="doc-section">
                <SectionHeading id="overview">Overview</SectionHeading>
                <p>
                  This guide explains how to connect Jira Cloud with Clara, complete the
                  one-time Atlassian administrator authorization, and finish the user login flow.
                </p>
                <p>Once connected, users can:</p>
                <ul>
                  <li>Search and retrieve Jira work items using natural language.</li>
                  <li>Ask questions across Jira alongside your other connected business systems.</li>
                  <li>Receive AI-generated answers with source citations.</li>
                  <li>Access Jira data from a single unified interface.</li>
                </ul>
              </section>

              {/* ===== PREREQUISITES ===== */}
              <section id="prerequisites" data-doc-section className="doc-section">
                <SectionHeading id="prerequisites">Prerequisites</SectionHeading>
                <p>Before connecting Jira Cloud to Clara, ensure the following are in place:</p>
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th scope="col">Requirement</th>
                        <th scope="col">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Clara</td>
                        <td>Active account</td>
                      </tr>
                      <tr>
                        <td>Jira Cloud</td>
                        <td>Active Jira Cloud site</td>
                      </tr>
                      <tr>
                        <td>Administrator</td>
                        <td>Atlassian Organization Admin</td>
                      </tr>
                      <tr>
                        <td>Time</td>
                        <td>~2 minutes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ===== CONNECT ===== */}
              <section id="connect" data-doc-section className="doc-section">
                <SectionHeading id="connect">Connect Jira from Clara</SectionHeading>
                <p>Follow these steps to start the Jira Cloud connection.</p>

                <div className="doc-steps">
                  {/* Step 1 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">1</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Open the Clara Dashboard</h3>
                      <p>Sign in to Clara and open your dashboard.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">2</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Navigate to Settings → Connectors</h3>
                      <p>Open <strong>Settings</strong> and select <strong>Connectors</strong>.</p>
                      <Figure src={`${IMG}/connectorsdash.png`} alt="Clara Connectors dashboard listing available integrations including Jira" caption="Step 2 — The Connectors dashboard." />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">3</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Locate the Jira connector and click Connect</h3>
                      <p>Find the Jira connector in the list and click <strong>Connect</strong>.</p>
                      <Figure src={`${IMG}/Jiraconnect.png`} alt="Jira connector card with a Connect button in the Clara Connectors dashboard" caption="Step 3 — The Jira connector card." />
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">4</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Redirect to Atlassian login</h3>
                      <p>You will be redirected to Atlassian to sign in and authorize access.</p>
                      <Figure src={`${IMG}/Atlasauth.png`} alt="Atlassian login screen prompting the user to sign in to authorize Clara" caption="Step 4 — Sign in at the Atlassian login screen." />
                    </div>
                  </div>
                </div>
              </section>

              {/* ===== ADMINISTRATOR AUTHORIZATION ===== */}
              <section id="admin-auth" data-doc-section className="doc-section">
                <SectionHeading id="admin-auth">Administrator Authorization</SectionHeading>
                <p>
                  If your organization has not yet authorized Clara, Atlassian displays an
                  authorization message. An Atlassian organization administrator must complete the
                  one-time setup in the next section before the connection can proceed.
                </p>
                <Figure src={`${IMG}/Atlasauth2.png`} alt="Atlassian authorization message indicating administrator approval is required for Clara" caption="Atlassian shows an authorization message when admin approval is required." />
              </section>

              {/* ===== ADMINISTRATOR SETUP ===== */}
              <section id="admin-setup" data-doc-section className="doc-section">
                <SectionHeading id="admin-setup">Administrator Setup</SectionHeading>
                <p>An Atlassian organization administrator completes the following one-time steps.</p>

                <div className="doc-steps">
                  {/* Step 1 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">1</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Sign in to the Atlassian admin console</h3>
                      <p>Log in to <a className="doc-inline-link" href="https://admin.atlassian.com" target="_blank" rel="noopener noreferrer">admin.atlassian.com</a>.</p>
                      <Figure src={`${IMG}/admin.png`} alt="The Atlassian administration console at admin.atlassian.com" caption="Step 1 — Sign in to the Atlassian admin console." />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">2</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Open Rovo → Rovo MCP Server → Domains</h3>
                      <p>Navigate to <strong>Rovo → Rovo MCP Server → Domains</strong>.</p>
                      <Figure src={`${IMG}/Rovomcpserver.png`} alt="The Rovo MCP Server Domains settings page in the Atlassian admin console" caption="Step 2 — Open the Rovo MCP Server Domains settings." />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">3</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Click Add Domain</h3>
                      <p>Click <strong>Add Domain</strong> to register a new allowed domain.</p>
                      <Figure src={`${IMG}/adddomain.png`} alt="The Add Domain button on the Rovo MCP Server Domains page" caption="Step 3 — Click Add Domain." />
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">4</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Enter the Clara domain</h3>
                      <p>Enter the following domain pattern:</p>
                      <div className="doc-table-wrap">
                        <table className="doc-table">
                          <tbody>
                            <tr>
                              <td><code>https://*.clarant.ai/**</code></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <Figure src={`${IMG}/enterdomain.png`} alt="Entering the https://*.clarant.ai/** domain pattern in the Add Domain dialog" caption="Step 4 — Enter the Clara domain pattern." />
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">5</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Verify the domain is added</h3>
                      <p>Confirm the domain appears in the list and was added successfully.</p>
                      <Figure src={`${IMG}/verifydomain.png`} alt="The Rovo MCP Server Domains list confirming the Clara domain was added successfully" caption="Step 5 — Verify the domain was added successfully." />
                    </div>
                  </div>
                </div>
              </section>

              {/* ===== COMPLETE THE CONNECTION ===== */}
              <section id="complete" data-doc-section className="doc-section">
                <SectionHeading id="complete">Complete the Connection</SectionHeading>
                <ol className="doc-list">
                  <li>Return to Clara and click <strong>Connect Jira</strong> again.</li>
                  <li>Review the requested permissions and click <strong>Accept</strong>.</li>
                </ol>
                <Figure src={`${IMG}/authwithouterror.png`} alt="Atlassian permissions consent screen for Clara with an Accept button" caption="Review the requested permissions and click Accept." />
              </section>

              {/* ===== VERIFY CONNECTION ===== */}
              <section id="verify" data-doc-section className="doc-section">
                <SectionHeading id="verify">Verify Connection</SectionHeading>
                <p>
                  The Jira connector should display <strong>Connected</strong>, and users can begin
                  using Jira features from Clara.
                </p>
                <Figure src={`${IMG}/Jiraconnected.png`} alt="Clara Connectors dashboard showing Jira with a Connected status" caption="Jira now shows as Connected." />

                <div className="callout callout--success">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Connected</span>
                    Once Jira shows as Connected, users can start asking questions about their Jira
                    work items inside Clara.
                  </div>
                </div>
              </section>

              {/* ===== TROUBLESHOOTING ===== */}
              <section id="troubleshooting" data-doc-section className="doc-section">
                <SectionHeading id="troubleshooting">Troubleshooting</SectionHeading>
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th scope="col">Issue</th>
                        <th scope="col">What to check</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Administrator authorization required</td>
                        <td>
                          Verify the callback URL includes <code>https://*.clarant.ai/**</code>,
                          then retry using a new browser session.
                        </td>
                      </tr>
                      <tr>
                        <td>Access denied</td>
                        <td>Grant the user a Jira license and access to the Jira site.</td>
                      </tr>
                      <tr>
                        <td>IP allowlisting</td>
                        <td>Ensure requests originate from approved IP addresses.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ===== PERMISSIONS REQUESTED ===== */}
              <section id="permissions" data-doc-section className="doc-section">
                <SectionHeading id="permissions">Permissions Requested</SectionHeading>
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th scope="col">Permission</th>
                        <th scope="col">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Jira Read</td>
                        <td>View work items</td>
                      </tr>
                      <tr>
                        <td>Jira Write</td>
                        <td>Update work items</td>
                      </tr>
                      <tr>
                        <td>User Identity</td>
                        <td>Authenticate the user</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ===== SUPPORT ===== */}
              <section id="support" data-doc-section className="doc-section">
                <SectionHeading id="support">Support</SectionHeading>
                <p>For assistance with installation, configuration, or troubleshooting:</p>
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
