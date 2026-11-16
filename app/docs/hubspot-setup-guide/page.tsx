import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageAnimations from '@/components/ui/PageAnimations'
import DocsEnhancer from '../DocsEnhancer'
import Figure from '../Figure'

export const metadata: Metadata = {
  title: 'HubSpot Integration Setup Guide | Clarant',
  description:
    'Learn how to connect HubSpot to Clarant, configure access, and search CRM information with AI-powered answers and source citations.',
  alternates: { canonical: '/docs/hubspot-setup-guide' },
}

// Image path convention — drop the uploaded screenshots here and they appear
// automatically:  public/images/docs/hubspot/<file>
const IMG = '/images/docs/hubspot'

// ── Table of contents (drives both the sidebar and the section anchors) ──
const TOC: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'install', label: 'Install the Integration' },
  { id: 'configure', label: 'Configure the Integration' },
  { id: 'using', label: 'Using Clara' },
  { id: 'citations', label: 'Citations & Sources' },
  { id: 'disconnect', label: 'Disconnecting HubSpot' },
  { id: 'uninstall', label: 'Uninstalling the Integration' },
  { id: 'privacy', label: 'Privacy & Security' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
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

export default function HubSpotSetupGuide() {
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
            <span aria-current="page">HubSpot Setup Guide</span>
          </nav>

          {/* ── Header ── */}
          <header className="doc-header">
            <span className="eyebrow">Connector Guide</span>
            <h1 className="doc-title">Clarant — HubSpot Integration Setup Guide</h1>
         
            <div className="doc-meta">
              <span>Connector setup</span>
              <span className="dot" aria-hidden="true" />
              <span>~10 minute read</span>
              <span className="dot" aria-hidden="true" />
              <span>Requires HubSpot admin access</span>
            </div>
          </header>

          {/* ── Layout: article + sticky TOC ── */}
          <div className="doc-layout">
            <article className="doc-article">

              {/* ===== OVERVIEW ===== */}
              <section id="overview" data-doc-section className="doc-section">
                <SectionHeading id="overview">Overview</SectionHeading>
                <p>
                  Clara is an AI-powered enterprise assistant that connects HubSpot,
                  SharePoint, Gmail, Outlook, Slack, Microsoft Teams, Salesforce, and other
                  business systems into a unified knowledge platform.
                </p>
                <p>With Clara, users can:</p>
                <ul>
                  <li>Search and retrieve information from HubSpot CRM using natural language.</li>
                  <li>Ask questions across documents, emails, chats, meetings, and CRM systems.</li>
                  <li>Receive AI-generated answers with source citations.</li>
                  <li>Organize content into workspaces for teams and departments.</li>
                  <li>Access business knowledge from multiple connected systems in a single interface.</li>
                </ul>
              </section>

              {/* ===== PREREQUISITES ===== */}
              <section id="prerequisites" data-doc-section className="doc-section">
                <SectionHeading id="prerequisites">Prerequisites</SectionHeading>
                <p>Before connecting HubSpot to Clara, ensure that:</p>
                <ul>
                  <li>You have an active Clara account.</li>
                  <li>You have a HubSpot account.</li>
                  <li>You have permission to install applications in HubSpot.</li>
                  <li>You have access to the Clara administration portal.</li>
                </ul>
            
              </section>

              {/* ===== INSTALL ===== */}
              <section id="install" data-doc-section className="doc-section">
                <SectionHeading id="install">Install the Integration</SectionHeading>
                <p>Follow these six steps to authorize Clara to access your HubSpot data.</p>

                <div className="doc-steps">
                  {/* Step 1 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">1</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Sign in to Clara</h3>
                      <p>Open Clara and sign in using your account credentials.</p>
                      <Figure src={`${IMG}/01-login.png`} alt="Clara sign-in page showing the email and password login form" caption="Step 1 — Sign in to your Clara account." />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">2</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Navigate to Connectors</h3>
                      <p>Open the navigation menu and select <strong>Connectors</strong>.</p>
                      <Figure src={`${IMG}/02-connectors.png`} alt="Clara Connectors dashboard listing available integrations" caption="Step 2 — The Connectors dashboard." />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">3</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Select HubSpot</h3>
                      <p>Locate the HubSpot connector and click <strong>Connect</strong>.</p>
                      <Figure src={`${IMG}/03-connector-card.png`} alt="HubSpot connector card with a Connect button in the Clara Connectors dashboard" caption="Step 3 — The HubSpot connector card." />
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">4</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Choose your HubSpot account</h3>
                      <p>
                        After clicking Connect, you will be redirected to HubSpot. Select the
                        HubSpot account you wish to connect, then click <strong>Choose Account</strong>.
                      </p>
                      <Figure src={`${IMG}/04-account-selection.png`} alt="HubSpot account selection screen prompting the user to choose which account to connect" caption="Step 4 — Choose the HubSpot account to connect." />
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">5</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Review permissions</h3>
                      <p>
                        Clara requests access to HubSpot data required to provide AI-powered
                        CRM insights. Requested permissions may include:
                      </p>
                      <ul>
                        <li>Read CRM objects</li>
                        <li>Read contacts</li>
                        <li>Read companies</li>
                        <li>Read deals</li>
                        <li>Read tickets</li>
                        <li>Read engagement data</li>
                      </ul>
                      <p>Review the requested permissions carefully, then click <strong>Connect App</strong>.</p>
                      <Figure src={`${IMG}/05-scope-approval.png`} alt="HubSpot scope approval screen listing the read permissions Clara requests" caption="Step 5 — Review and approve the requested scopes." />
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">6</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Connection complete</h3>
                      <p>After successful authorization:</p>
                      <ul>
                        <li>You will be redirected back to Clara.</li>
                        <li>HubSpot will appear as <strong>Connected</strong> in the Connectors dashboard.</li>
                      </ul>
                      <Figure src={`${IMG}/06-connected.png`} alt="Clara Connectors dashboard showing HubSpot with a Connected status" caption="Step 6 — HubSpot now shows as Connected." />
                    </div>
                  </div>
                </div>

                <div className="callout callout--success">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Connected</span>
                    Once HubSpot shows as Connected, continue to configuration to make its data
                    available inside a workspace.
                  </div>
                </div>
              </section>

              {/* ===== CONFIGURE ===== */}
              <section id="configure" data-doc-section className="doc-section">
                <SectionHeading id="configure">Configure the Integration</SectionHeading>

                <h3 className="doc-h3">Verify the HubSpot connection</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Connectors</strong>.</li>
                  <li>Confirm HubSpot displays a <strong>Connected</strong> status.</li>
                </ol>
                <Figure src={`${IMG}/08-verify-connection.png`} alt="Clara Connectors settings page showing HubSpot, Gmail, Outlook, Slack, Fireflies, and Fathom with a Connected status" caption="Confirm HubSpot displays a Connected status in the Connectors dashboard." />

                <h3 className="doc-h3">Configure workspace access</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Workspaces</strong>.</li>
                  <li>Create a new workspace or open an existing workspace.</li>
                  <li>Assign connected HubSpot data sources to the workspace.</li>
                </ol>
                <Figure src={`${IMG}/07-workspace-management.png`} alt="Clara workspace management page where data sources are assigned to a workspace" caption="Assign HubSpot data sources to a workspace." />

                <h3 className="doc-h3">Configure data sources</h3>
                <p>
                  Within the workspace, toggle which connected systems should be available (see the
                  connector panel above). Examples:
                </p>
                <ul>
                  <li>HubSpot CRM</li>
                  <li>SharePoint</li>
                  <li>Gmail</li>
                  <li>Outlook</li>
                  <li>Slack</li>
                  <li>Salesforce</li>
                </ul>
                <Figure src={`${IMG}/08-data-sources.png`} alt="Workspace connector panel with HubSpot toggled on alongside Gmail, Outlook, Slack, Fireflies, and Fathom, beside the list of included workspace files" caption="Toggle which connected systems are available as data sources for the workspace." />
              </section>

              {/* ===== USING ===== */}
              <section id="using" data-doc-section className="doc-section">
                <SectionHeading id="using">Using Clara</SectionHeading>
                <p>
                  After setup is complete, users can begin asking questions using natural language.
                </p>

                <div className="doc-qcard">
                  <p className="doc-qcard-h">Sales pipeline questions</p>
                  <ul className="doc-qlist">
                    <li>Which deals are closing this month?</li>
                    <li>Show my top open opportunities.</li>
                    <li>Summarize my sales pipeline.</li>
                    <li>Which deals have had no activity for 30 days?</li>
                  </ul>
                </div>

                <div className="doc-qcard">
                  <p className="doc-qcard-h">Contact questions</p>
                  <ul className="doc-qlist">
                    <li>Find contacts associated with Deal X.</li>
                    <li>Show recent activity for Company Y.</li>
                    <li>List recently created contacts.</li>
                  </ul>
                </div>

                <div className="doc-qcard">
                  <p className="doc-qcard-h">Business knowledge questions</p>
                  <ul className="doc-qlist">
                    <li>Search documents related to customer onboarding.</li>
                    <li>Find meeting notes discussing pricing changes.</li>
                    <li>Summarize customer feedback from multiple sources.</li>
                  </ul>
                </div>

                <h3 className="doc-h3">Example AI response</h3>
                <p>
                  Clara retrieves information from connected systems and generates a
                  consolidated answer. The response may include deal information, contact details,
                  pipeline insights, document references, and source citations.
                </p>
                <Figure src={`${IMG}/09-ai-response.png`} alt="Clara answering a HubSpot CRM query with deal details and source citations" caption="Example — a HubSpot query answered with citations." />
              </section>

              {/* ===== CITATIONS ===== */}
              <section id="citations" data-doc-section className="doc-section">
                <SectionHeading id="citations">Citations &amp; Sources</SectionHeading>
                <p>Clara provides citations whenever source information is available. Sources may include:</p>
                <ul>
                  <li>HubSpot CRM</li>
                  <li>SharePoint documents</li>
                  <li>Emails</li>
                  <li>Meeting transcripts</li>
                  <li>Slack conversations</li>
                </ul>
                <Figure src={`${IMG}/10-citations.png`} alt="An Clara answer showing inline citations linking back to their original sources" caption="Every answer links back to its sources." />
              </section>

              {/* ===== DISCONNECT ===== */}
              <section id="disconnect" data-doc-section className="doc-section">
                <SectionHeading id="disconnect">Disconnecting HubSpot</SectionHeading>
                <div className="callout callout--warning">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Important</span>
                    <p>Disconnecting HubSpot prevents Clara from accessing new HubSpot data.</p>
                    <p>Existing indexed information may remain available according to your organization&apos;s data retention settings.</p>
                  </div>
                </div>

                <h3 className="doc-h3">Disconnect steps</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Connectors</strong>.</li>
                  <li>Locate HubSpot.</li>
                  <li>Click <strong>Disconnect</strong>.</li>
                  <li>Confirm the action.</li>
                </ol>
                <Figure src={`${IMG}/11-disconnect.png`} alt="Disconnect HubSpot confirmation screen in the Clara Connectors dashboard" caption="Disconnecting the HubSpot connector." />
              </section>

              {/* ===== UNINSTALL ===== */}
              <section id="uninstall" data-doc-section className="doc-section">
                <SectionHeading id="uninstall">Uninstalling the Integration</SectionHeading>
                <p>To completely remove Clara from HubSpot:</p>
                <ol className="doc-list">
                  <li>Log in to HubSpot.</li>
                  <li>Navigate to <strong>Settings</strong>.</li>
                  <li>Select <strong>Integrations</strong>.</li>
                  <li>Locate <strong>Clara</strong>.</li>
                  <li>Click <strong>Uninstall</strong>.</li>
                </ol>
                <p>
                  You may also follow HubSpot&apos;s official uninstall instructions available in the
                  HubSpot Knowledge Base.
                </p>

                <h3 className="doc-h3">Data impact of uninstalling</h3>
                <p>Before uninstalling, consider the following:</p>
                <ul>
                  <li>HubSpot access permissions will be revoked.</li>
                  <li>Future synchronization will stop.</li>
                  <li>New CRM data will no longer be available in Clara.</li>
                  <li>Existing indexed content may be retained according to organizational retention policies.</li>
                  <li>Previously generated conversations and insights may remain accessible unless deleted by an administrator.</li>
                </ul>
              </section>

              {/* ===== PRIVACY ===== */}
              <section id="privacy" data-doc-section className="doc-section">
                <SectionHeading id="privacy">Privacy &amp; Security</SectionHeading>
                <p>Clara is designed with enterprise security and privacy considerations. For additional information, refer to:</p>
                <ul>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Security Documentation</li>
                  <li>GDPR Compliance Information</li>
                </ul>
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
                        <td>HubSpot does not appear connected</td>
                        <td>
                          Verify that authorization was completed successfully. Confirm the correct
                          HubSpot account was selected. Reconnect the integration if necessary.
                        </td>
                      </tr>
                      <tr>
                        <td>No CRM results returned</td>
                        <td>
                          Verify that HubSpot contains accessible CRM records. Confirm that required
                          permissions were granted. Ensure the workspace includes the HubSpot connector.
                        </td>
                      </tr>
                      <tr>
                        <td>Access issues</td>
                        <td>Contact your Clara administrator if you experience permission-related issues.</td>
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
