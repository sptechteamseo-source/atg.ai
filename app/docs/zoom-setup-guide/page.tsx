import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageAnimations from '@/components/ui/PageAnimations'
import DocsEnhancer from '../DocsEnhancer'
import Figure from '../Figure'

export const metadata: Metadata = {
  title: 'Zoom Integration Setup Guide | Clarant',
  description:
    'Connect Zoom to Clarant and learn how to search meeting recordings and transcripts, configure permissions, and retrieve answers with citations.',
  alternates: { canonical: '/docs/zoom-setup-guide' },
}

// Image path convention — uploaded screenshots live here:
//   public/images/docs/zoom/<file>
const IMG = '/images/docs/zoom'

const SITE = 'https://clarant.ai'

// ── Table of contents (drives both the sidebar and the section anchors) ──
const TOC: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'install', label: 'Install the Integration' },
  { id: 'configure', label: 'Configure the Integration' },
  { id: 'using', label: 'Using Clara' },
  { id: 'citations', label: 'Citations & Sources' },
  { id: 'disconnect', label: 'Disconnecting Zoom' },
  { id: 'uninstall', label: 'Uninstalling the Integration' },
  { id: 'privacy', label: 'Privacy & Security' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'support', label: 'Support' },
]

// ── FAQ content (rendered as schema; mirrors common setup questions) ──
const FAQ: { q: string; a: string }[] = [
  {
    q: 'What permissions does Clarant request from Zoom?',
    a: 'Clarant requests only the permissions required for AI-powered meeting search and knowledge retrieval, such as reading meeting information, meeting recordings, meeting transcripts, and user profile information, and receiving meeting event notifications if enabled.',
  },
  {
    q: 'How do I connect Zoom to Clarant?',
    a: 'Sign in to Clarant, open Connectors, locate the Zoom connector and click Connect, sign in to Zoom and select the account to connect, review the requested permissions, and click Allow. Zoom then appears as Connected in the Connectors dashboard.',
  },
  {
    q: 'What happens to my data if I disconnect or uninstall Zoom?',
    a: 'Disconnecting or uninstalling Zoom revokes access and stops future synchronization, so new Zoom meetings, recordings, and transcripts are no longer available in Clarant. Previously indexed information and generated insights may remain available according to your organization’s data retention settings unless deleted by an administrator.',
  },
  {
    q: 'Is my Zoom data used to train AI models?',
    a: 'No. Customer data is processed only for authorized requests and is not used to train public AI models without explicit permission. OAuth is used to connect securely, and access tokens are encrypted and securely stored.',
  },
]

// ── Structured data: Article, Breadcrumb, and FAQ schema ──
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      '@id': `${SITE}/docs/zoom-setup-guide#article`,
      headline: 'Clarant — Zoom Integration Setup Guide',
      description:
        'Step-by-step guide to connecting Zoom to Clarant: authorize your account, approve permissions, configure workspaces, search meeting recordings and transcripts with natural language, and manage or remove the connection.',
      mainEntityOfPage: `${SITE}/docs/zoom-setup-guide`,
      author: { '@type': 'Organization', name: 'Clarant' },
      publisher: {
        '@type': 'Organization',
        name: 'Clarant',
        url: SITE,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Documentation', item: `${SITE}/docs` },
        { '@type': 'ListItem', position: 3, name: 'Zoom Setup Guide', item: `${SITE}/docs/zoom-setup-guide` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

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

export default function ZoomSetupGuide() {
  return (
    <div className="doc-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
            <span aria-current="page">Zoom Setup Guide</span>
          </nav>

          {/* ── Header ── */}
          <header className="doc-header">
            <span className="eyebrow">Connector Guide</span>
            <h1 className="doc-title">Clarant — Zoom Integration Setup Guide</h1>

            <div className="doc-meta">
              <span>Connector setup</span>
              <span className="dot" aria-hidden="true" />
              <span>~10 minute read</span>
              <span className="dot" aria-hidden="true" />
              <span>Requires permission to authorize third-party apps</span>
            </div>
          </header>

          {/* ── Layout: article + sticky TOC ── */}
          <div className="doc-layout">
            <article className="doc-article">

              {/* ===== OVERVIEW ===== */}
              <section id="overview" data-doc-section className="doc-section">
                <SectionHeading id="overview">Overview</SectionHeading>
                <p>
                  Clara is an AI-powered enterprise assistant that connects Zoom, Slack,
                  Gmail, Outlook, Salesforce, HubSpot, Microsoft Teams, and other business systems
                  into a unified knowledge platform.
                </p>
                <p>With Clara, users can:</p>
                <ul>
                  <li>Connect their Zoom account securely.</li>
                  <li>Search Zoom meeting recordings and transcripts using natural language.</li>
                  <li>Ask questions across Zoom meetings, documents, emails, chats, and CRM systems.</li>
                  <li>Receive AI-generated answers with source citations.</li>
                  <li>Organize knowledge into workspaces for teams and departments.</li>
                  <li>Access business knowledge from multiple connected systems in a single interface.</li>
                </ul>
              </section>

              {/* ===== PREREQUISITES ===== */}
              <section id="prerequisites" data-doc-section className="doc-section">
                <SectionHeading id="prerequisites">Prerequisites</SectionHeading>
                <p>Before connecting Zoom to Clara, ensure that:</p>
                <ul>
                  <li>You have an active Clara account.</li>
                  <li>You have a Zoom account.</li>
                  <li>You have permission to authorize third-party applications.</li>
                  <li>Cloud Recording is enabled for your Zoom account (if meeting recordings are required).</li>
                  <li>You have access to the Clara administration portal.</li>
                </ul>
              </section>

              {/* ===== INSTALL ===== */}
              <section id="install" data-doc-section className="doc-section">
                <SectionHeading id="install">Install the Integration</SectionHeading>
                <p>Follow these six steps to authorize Clara to access your Zoom data.</p>

                <div className="doc-steps">
                  {/* Step 1 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">1</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Sign in to Clara</h3>
                      <p>Open Clara and sign in using your account credentials.</p>
                      <Figure src={`${IMG}/login1.png`} alt="Clara sign-in page" caption="Step 1 — Sign in to your Clara account." />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">2</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Navigate to Connectors</h3>
                      <p>Open the navigation menu and select <strong>Connectors</strong>.</p>
                      <Figure src={`${IMG}/Connectors.png`} alt="Clara Connectors dashboard listing available integrations including Zoom" caption="Step 2 — The Connectors dashboard." />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">3</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Select Zoom</h3>
                      <p>Locate the Zoom connector and click <strong>Connect</strong>.</p>
                      <Figure src={`${IMG}/Connect_zoom.png`} alt="Zoom connector card in Clara with a Connect button" caption="Step 3 — The Zoom connector card." />
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">4</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Sign in to Zoom</h3>
                      <p>
                        After clicking Connect, you will be redirected to Zoom. Sign in to your Zoom
                        account and select the account you wish to connect (if applicable).
                      </p>
                      <Figure src={`${IMG}/Zoom_login.png`} alt="Zoom sign-in screen prompting the user to authenticate before authorizing Clara" caption="Step 4 — Sign in to your Zoom account." />
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">5</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Review permissions</h3>
                      <p>
                        Clara requests only the permissions required to provide AI-powered
                        meeting search and knowledge retrieval. Requested permissions may include:
                      </p>
                      <ul>
                        <li>Read meeting information</li>
                        <li>Read meeting recordings</li>
                        <li>Read meeting transcripts</li>
                        <li>Read user profile information</li>
                        <li>Receive meeting event notifications (if enabled)</li>
                      </ul>
                      <p>Review the requested permissions carefully, then click <strong>Allow</strong> to authorize Clara.</p>
                      <Figure src={`${IMG}/permissions.png`} alt="Zoom authorization screen listing the permissions requested by Clara with an Allow button" caption="Step 5 — Review the requested permissions and click Allow." />
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
                        <li>Zoom will appear as <strong>Connected</strong> in the Connectors dashboard.</li>
                      </ul>
                      <Figure src={`${IMG}/connection_complete.png`} alt="Clara Connectors dashboard showing Zoom with a Connected status" caption="Step 6 — Zoom now shows as Connected." />
                    </div>
                  </div>
                </div>

                <div className="callout callout--success">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Connected</span>
                    Once Zoom shows as Connected, continue to configuration to make its data
                    available inside a workspace.
                  </div>
                </div>
              </section>

              {/* ===== CONFIGURE ===== */}
              <section id="configure" data-doc-section className="doc-section">
                <SectionHeading id="configure">Configure the Integration</SectionHeading>

                <h3 className="doc-h3">Verify the Zoom connection</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Connectors</strong>.</li>
                  <li>Confirm Zoom displays a <strong>Connected</strong> status.</li>
                </ol>
                <Figure src={`${IMG}/Connectors.png`} alt="Clara Connectors settings page showing Zoom with a Connected status alongside other integrations" caption="Confirm Zoom displays a Connected status in the Connectors dashboard." />

                <h3 className="doc-h3">Configure workspace access</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Workspaces</strong>.</li>
                  <li>Create a new workspace or open an existing workspace.</li>
                  <li>Assign the connected Zoom data source to the workspace.</li>
                </ol>

                <h3 className="doc-h3">Configure data sources</h3>
                <p>
                  Within the workspace, select which connected systems should be available. Examples:
                </p>
                <ul>
                  <li>Zoom</li>
                  <li>Slack</li>
                  <li>SharePoint</li>
                  <li>Gmail</li>
                  <li>Outlook</li>
                  <li>HubSpot</li>
                  <li>Salesforce</li>
                </ul>
                <Figure src={`${IMG}/workspace_management.png`} alt="Workspace connector panel with Zoom toggled on alongside other connected data sources" caption="Toggle which connected systems are available as data sources for the workspace." />
              </section>

              {/* ===== USING ===== */}
              <section id="using" data-doc-section className="doc-section">
                <SectionHeading id="using">Using Clara</SectionHeading>
                <p>
                  After setup is complete, users can begin asking questions using natural language.
                </p>

                <div className="doc-qcard">
                  <p className="doc-qcard-h">Zoom meeting questions</p>
                  <ul className="doc-qlist">
                    <li>Summarize yesterday&apos;s sales meeting.</li>
                    <li>What action items were discussed during the weekly stand-up?</li>
                    <li>Who attended the customer success meeting?</li>
                    <li>What decisions were made during the executive meeting?</li>
                    <li>Find meetings discussing Project Phoenix.</li>
                  </ul>
                </div>

                <div className="doc-qcard">
                  <p className="doc-qcard-h">Cross-platform questions</p>
                  <ul className="doc-qlist">
                    <li>Show the HubSpot opportunity discussed during yesterday&apos;s Zoom meeting.</li>
                    <li>Find Slack conversations related to the Zoom meeting.</li>
                    <li>Search meeting transcripts mentioning customer onboarding.</li>
                    <li>Summarize all discussions related to Product Launch.</li>
                  </ul>
                </div>

                <h3 className="doc-h3">Example AI response</h3>
                <p>
                  Clara retrieves information from connected systems and generates a
                  consolidated response. The response may include meeting summaries, action items,
                  meeting participants, transcript excerpts, related documents, and source citations.
                </p>
                <Figure src={`${IMG}/query_res.png`} alt="Clara answering a Zoom meeting query with a summary and cited sources" caption="Example — a Zoom meeting query answered with citations." />
              </section>

              {/* ===== CITATIONS ===== */}
              <section id="citations" data-doc-section className="doc-section">
                <SectionHeading id="citations">Citations &amp; Sources</SectionHeading>
                <p>Clara provides citations whenever source information is available. Sources may include:</p>
                <ul>
                  <li>Zoom meeting transcripts</li>
                  <li>Zoom cloud recordings</li>
                  <li>Meeting metadata</li>
                  <li>Slack conversations</li>
                  <li>SharePoint documents</li>
                  <li>Emails</li>
                  <li>CRM records</li>
                </ul>
                <Figure src={`${IMG}/citations.png`} alt="An Clara answer showing the Zoom source results it cited" caption="Every answer links back to its sources." />

                <div className="callout callout--info">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">AI transparency</span>
                    Clara uses generative AI to assist users. AI-generated responses may
                    occasionally be inaccurate or incomplete. Users should verify important
                    information using the provided citations and original source content before
                    making business or operational decisions.
                  </div>
                </div>
              </section>

              {/* ===== DISCONNECT ===== */}
              <section id="disconnect" data-doc-section className="doc-section">
                <SectionHeading id="disconnect">Disconnecting Zoom</SectionHeading>
                <div className="callout callout--warning">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Important</span>
                    <p>Disconnecting Zoom prevents Clara from accessing new Zoom meetings, recordings, and transcripts.</p>
                    <p>Previously indexed information may remain available according to your organization&apos;s data retention settings.</p>
                  </div>
                </div>

                <h3 className="doc-h3">Disconnect steps</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Connectors</strong>.</li>
                  <li>Locate Zoom.</li>
                  <li>Click <strong>Disconnect</strong>.</li>
                  <li>Confirm the action.</li>
                </ol>
                <Figure src={`${IMG}/disconnect.png`} alt="Disconnect Zoom confirmation dialog in the Clara Connectors dashboard" caption="Disconnecting the Zoom connector." />
              </section>

              {/* ===== UNINSTALL ===== */}
              <section id="uninstall" data-doc-section className="doc-section">
                <SectionHeading id="uninstall">Uninstalling the Integration</SectionHeading>
                <p>To completely remove Clara from Zoom:</p>
                <ol className="doc-list">
                  <li>Sign in to the <strong>Zoom App Marketplace</strong>.</li>
                  <li>Navigate to <strong>Manage → Installed Apps</strong>.</li>
                  <li>Locate <strong>Clara</strong>.</li>
                  <li>Click <strong>Uninstall</strong>.</li>
                  <li>Confirm the removal.</li>
                </ol>

                <h3 className="doc-h3">Data impact of uninstalling</h3>
                <p>Before uninstalling, consider the following:</p>
                <ul>
                  <li>Zoom authorization will be revoked.</li>
                  <li>Future synchronization of meetings and recordings will stop.</li>
                  <li>New Zoom transcripts and recordings will no longer be available in Clara.</li>
                  <li>Existing indexed content may be retained according to your organization&apos;s retention policies.</li>
                  <li>Previously generated AI conversations and meeting insights may remain available unless deleted by an administrator.</li>
                </ul>
              </section>

              {/* ===== PRIVACY ===== */}
              <section id="privacy" data-doc-section className="doc-section">
                <SectionHeading id="privacy">Privacy &amp; Security</SectionHeading>
                <p>Clara is designed with enterprise security and privacy in mind.</p>
                <ul>
                  <li>OAuth authentication is used to securely connect your Zoom account.</li>
                  <li>Access tokens are encrypted and securely stored.</li>
                  <li>Customer data is processed only for authorized requests.</li>
                  <li>Customer data is not used to train public AI models without explicit permission.</li>
                </ul>
                <p>For additional information, refer to:</p>
                <ul>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Security Documentation</li>
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
                        <td>Zoom does not appear connected</td>
                        <td>
                          Verify that authorization completed successfully. Confirm the correct
                          Zoom account was selected. Reconnect the integration if necessary.
                        </td>
                      </tr>
                      <tr>
                        <td>No meeting results returned</td>
                        <td>
                          Verify that Cloud Recording is enabled and that meeting transcripts or
                          recordings are available. Ensure the required permissions were granted and
                          that Zoom synchronization has completed.
                        </td>
                      </tr>
                      <tr>
                        <td>Permission issues</td>
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
                    <p>Website: <a className="doc-inline-link" href="https://clarant.ai">https://clarant.ai</a></p>
                  </div>
                </div>

                <div className="callout callout--warning">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">AI disclaimer</span>
                    Clara uses generative AI to provide responses based on connected data
                    sources. AI-generated responses may occasionally be inaccurate or incomplete.
                    Users should verify important information using the provided citations before
                    making business or operational decisions.
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
