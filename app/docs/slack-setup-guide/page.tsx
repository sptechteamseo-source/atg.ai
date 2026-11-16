import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageAnimations from '@/components/ui/PageAnimations'
import DocsEnhancer from '../DocsEnhancer'
import Figure from '../Figure'

export const metadata: Metadata = {
  title: 'Slack Integration Setup Guide | Clarant',
  description:
    'Learn how to connect Slack to Clarant, authorize your workspace, and search conversations and company knowledge using AI-powered answers.',
  alternates: { canonical: '/docs/slack-setup-guide' },
}

// Image path convention — drop the uploaded screenshots here and they appear
// automatically:  public/images/docs/slack/<file>
const IMG = '/images/docs/slack'

const SITE = 'https://clarant.ai'

// ── Table of contents (drives both the sidebar and the section anchors) ──
const TOC: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'install', label: 'Install the Integration' },
  { id: 'configure', label: 'Configure the Integration' },
  { id: 'using', label: 'Using Clara' },
  { id: 'citations', label: 'Citations & Sources' },
  { id: 'disconnect', label: 'Disconnecting Slack' },
  { id: 'uninstall', label: 'Uninstalling the Integration' },
  { id: 'privacy', label: 'Privacy & Security' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'support', label: 'Support' },
]

// ── FAQ content (rendered as schema; mirrors common setup questions) ──
const FAQ: { q: string; a: string }[] = [
  {
    q: 'What permissions does Clarant request from Slack?',
    a: 'Clarant requests only the permissions required for AI-powered knowledge retrieval and collaboration, such as reading Slack conversations, shared files, canvases, channel information, and user information, searching authorized Slack content, sending AI-generated messages, and reading and managing reactions.',
  },
  {
    q: 'How do I connect Slack to Clarant?',
    a: 'Sign in to Clarant, open Connectors, locate the Slack connector and click Connect, select your Slack workspace, review the requested permissions, and click Allow. Slack then appears as Connected in the Connectors dashboard.',
  },
  {
    q: 'What happens to my data if I disconnect or uninstall Slack?',
    a: 'Disconnecting or uninstalling Slack revokes access and stops future synchronization, so new Slack content is no longer available in Clarant. Previously indexed information and generated insights may remain available according to your organization’s data retention settings unless deleted by an administrator.',
  },
  {
    q: 'Is my Slack data used to train AI models?',
    a: 'No. Customer data is processed only for authorized requests and is not used to train public AI models without explicit permission. OAuth is used to connect securely, and access tokens are encrypted and securely stored.',
  },
]

// ── Structured data: Article, Breadcrumb, and FAQ schema ──
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      '@id': `${SITE}/docs/slack-setup-guide#article`,
      headline: 'Clarant — Slack Integration Setup Guide',
      description:
        'Step-by-step guide to connecting Slack to Clarant: install the integration, authorize your workspace, approve permissions, configure workspaces, query Slack with natural language, and manage or remove the connection.',
      mainEntityOfPage: `${SITE}/docs/slack-setup-guide`,
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
        { '@type': 'ListItem', position: 3, name: 'Slack Setup Guide', item: `${SITE}/docs/slack-setup-guide` },
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

export default function SlackSetupGuide() {
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
            <span aria-current="page">Slack Setup Guide</span>
          </nav>

          {/* ── Header ── */}
          <header className="doc-header">
            <span className="eyebrow">Connector Guide</span>
            <h1 className="doc-title">Clarant — Slack Integration Setup Guide</h1>

            <div className="doc-meta">
              <span>Connector setup</span>
              <span className="dot" aria-hidden="true" />
              <span>~10 minute read</span>
              <span className="dot" aria-hidden="true" />
              <span>Requires Slack workspace admin access</span>
            </div>
          </header>

          {/* ── Layout: article + sticky TOC ── */}
          <div className="doc-layout">
            <article className="doc-article">

              {/* ===== OVERVIEW ===== */}
              <section id="overview" data-doc-section className="doc-section">
                <SectionHeading id="overview">Overview</SectionHeading>
                <p>
                  Clara is an AI-powered enterprise assistant that connects Slack,
                  Gmail, Outlook, Salesforce, HubSpot, and other business systems into a
                  unified knowledge platform.
                </p>
                <p>With Clara, users can:</p>
                <ul>
                  <li>Search and retrieve information from Slack using natural language.</li>
                  <li>Ask questions across Slack conversations, documents, emails, meetings, and CRM systems.</li>
                  <li>Receive AI-generated answers with source citations.</li>
                  <li>Organize content into workspaces for teams and departments.</li>
                  <li>Access business knowledge from multiple connected systems in a single interface.</li>
                </ul>
              </section>

              {/* ===== PREREQUISITES ===== */}
              <section id="prerequisites" data-doc-section className="doc-section">
                <SectionHeading id="prerequisites">Prerequisites</SectionHeading>
                <p>Before connecting Slack to Clara, ensure that:</p>
                <ul>
                  <li>You have an active Clara account.</li>
                  <li>You have a Slack workspace.</li>
                  <li>You have permission to install applications in your Slack workspace.</li>
                  <li>You have access to the Clara administration portal.</li>
                </ul>
              </section>

              {/* ===== INSTALL ===== */}
              <section id="install" data-doc-section className="doc-section">
                <SectionHeading id="install">Install the Integration</SectionHeading>
                <p>Follow these six steps to authorize Clara to access your Slack data.</p>

                <div className="doc-steps">
                  {/* Step 1 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">1</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Sign in to Clara</h3>
                      <p>Open Clara and sign in using your account credentials.</p>
                      <Figure src={`${IMG}/01-login.png`} alt="Clara sign-in page with Continue with Google and Continue with Microsoft options" caption="Step 1 — Sign in to your Clara account." />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">2</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Navigate to Connectors</h3>
                      <p>Open the navigation menu and select <strong>Connectors</strong>.</p>
                      <Figure src={`${IMG}/02-connectors.png`} alt="Clara Connectors dashboard listing available integrations including Slack" caption="Step 2 — The Connectors dashboard." />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">3</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Select Slack</h3>
                      <p>Locate the Slack connector and click <strong>Connect</strong>.</p>
                      <Figure src={`${IMG}/03-connector-card.png`} alt="Slack connector dialog in Clara describing access to messages, canvases, threads, and channel history with a Connect button" caption="Step 3 — The Slack connector card." />
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">4</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Choose your Slack workspace</h3>
                      <p>
                        After clicking Connect, you will be redirected to Slack. Select the Slack
                        workspace you want to connect and review the requested permissions.
                      </p>
                      <Figure src={`${IMG}/04-authorize.png`} alt="Slack authorization screen prompting the user to allow the Clara app to access Slack, with a workspace selector" caption="Step 4 — Choose the Slack workspace to connect." />
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">5</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Review permissions</h3>
                      <p>
                        Clara requests only the permissions required to provide AI-powered
                        knowledge retrieval and collaboration. Requested permissions may include:
                      </p>
                      <ul>
                        <li>Read Slack conversations</li>
                        <li>Read shared files</li>
                        <li>Read Slack canvases</li>
                        <li>Read channel information</li>
                        <li>Read user information</li>
                        <li>Search authorized Slack content</li>
                        <li>Send AI-generated messages</li>
                        <li>Read and manage reactions</li>
                      </ul>
                      <p>Review the requested permissions carefully, then click <strong>Allow</strong>.</p>
               
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
                        <li>Slack will appear as <strong>Connected</strong> in the Connectors dashboard.</li>
                      </ul>
                      <Figure src={`${IMG}/06-connected.png`} alt="Clara Connectors dashboard showing Slack with a Connected status" caption="Step 6 — Slack now shows as Connected." />
                    </div>
                  </div>
                </div>

                <div className="callout callout--success">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Connected</span>
                    Once Slack shows as Connected, continue to configuration to make its data
                    available inside a workspace.
                  </div>
                </div>
              </section>

              {/* ===== CONFIGURE ===== */}
              <section id="configure" data-doc-section className="doc-section">
                <SectionHeading id="configure">Configure the Integration</SectionHeading>

                <h3 className="doc-h3">Verify the Slack connection</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Connectors</strong>.</li>
                  <li>Confirm Slack displays a <strong>Connected</strong> status.</li>
                </ol>
                <Figure src={`${IMG}/06-connected.png`} alt="Clara Connectors settings page showing Slack with a Connected status alongside other integrations" caption="Confirm Slack displays a Connected status in the Connectors dashboard." />

                <h3 className="doc-h3">Configure workspace access</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Workspaces</strong>.</li>
                  <li>Create a new workspace or open an existing workspace.</li>
                  <li>Assign the connected Slack data source to the workspace.</li>
                </ol>

                <h3 className="doc-h3">Configure data sources</h3>
                <p>
                  Within the workspace, select which connected systems should be available. Examples:
                </p>
                <ul>
                  <li>Slack</li>
                  <li>Gmail</li>
                  <li>Outlook</li>
                  <li>HubSpot</li>
                  <li>Salesforce</li>
                  <li>Fathom</li>
                  <li>Fireflies</li>
                </ul>
                <Figure src={`${IMG}/07-data-sources.png`} alt="Workspace connector panel with Slack toggled on alongside Hubspot, Fathom, Outlook, Fireflies, and Gmail" caption="Toggle which connected systems are available as data sources for the workspace." />
              </section>

              {/* ===== USING ===== */}
              <section id="using" data-doc-section className="doc-section">
                <SectionHeading id="using">Using Clara</SectionHeading>
                <p>
                  After setup is complete, users can begin asking questions using natural language.
                </p>

                <div className="doc-qcard">
                  <p className="doc-qcard-h">Slack questions</p>
                  <ul className="doc-qlist">
                    <li>Summarize today&apos;s engineering discussion.</li>
                    <li>What decisions were made during yesterday&apos;s product meeting?</li>
                    <li>Find messages related to Project Phoenix.</li>
                    <li>Show files shared in the marketing channel.</li>
                    <li>Which channels discussed the new product launch?</li>
                  </ul>
                </div>

                <div className="doc-qcard">
                  <p className="doc-qcard-h">Cross-platform questions</p>
                  <ul className="doc-qlist">
                    <li>Show the latest HubSpot opportunity discussed in Slack.</li>
                    <li>Summarize customer feedback from Slack and Salesforce.</li>
                    <li>Find meeting notes mentioning Project Alpha.</li>
                    <li>Search documents related to customer onboarding.</li>
                  </ul>
                </div>

                <h3 className="doc-h3">Example AI response</h3>
                <p>
                  Clara retrieves information from connected systems and generates a
                  consolidated answer. The response may include conversation summaries, Slack
                  messages, shared files, canvas information, related business records, and source citations.
                </p>
                <Figure src={`${IMG}/09-ai-response.png`} alt="Clara answering a Slack query about channels with details and a permalink source" caption="Example — a Slack query answered with citations." />
              </section>

              {/* ===== CITATIONS ===== */}
              <section id="citations" data-doc-section className="doc-section">
                <SectionHeading id="citations">Citations &amp; Sources</SectionHeading>
                <p>Clara provides citations whenever source information is available. Sources may include:</p>
                <ul>
                  <li>Slack conversations</li>
                  <li>Slack Canvases</li>
                  <li>Shared Slack files</li>
                  <li>SharePoint documents</li>
                  <li>Emails</li>
                  <li>Meeting transcripts</li>
                  <li>HubSpot CRM</li>
                  <li>Salesforce</li>
                </ul>
                <Figure src={`${IMG}/10-citations.png`} alt="An Clara answer showing the Slack search tool call and the source results it cited" caption="Every answer links back to its sources." />
              </section>

              {/* ===== DISCONNECT ===== */}
              <section id="disconnect" data-doc-section className="doc-section">
                <SectionHeading id="disconnect">Disconnecting Slack</SectionHeading>
                <div className="callout callout--warning">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Important</span>
                    <p>Disconnecting Slack prevents Clara from accessing new Slack data.</p>
                    <p>Existing indexed information may remain available according to your organization&apos;s data retention settings.</p>
                  </div>
                </div>

                <h3 className="doc-h3">Disconnect steps</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Connectors</strong>.</li>
                  <li>Locate Slack.</li>
                  <li>Click <strong>Disconnect</strong>.</li>
                  <li>Confirm the action.</li>
                </ol>
                <Figure src={`${IMG}/11-disconnect.png`} alt="Disconnect Slack confirmation dialog in the Clara Connectors dashboard" caption="Disconnecting the Slack connector." />
              </section>

              {/* ===== UNINSTALL ===== */}
              <section id="uninstall" data-doc-section className="doc-section">
                <SectionHeading id="uninstall">Uninstalling the Integration</SectionHeading>
                <p>To completely remove Clara from Slack:</p>
                <ol className="doc-list">
                  <li>Open your Slack workspace.</li>
                  <li>Navigate to <strong>Apps</strong> or <strong>Manage Apps</strong>.</li>
                  <li>Locate <strong>Clara</strong>.</li>
                  <li>Remove or uninstall the application.</li>
                  <li>Confirm the removal.</li>
                </ol>

                <h3 className="doc-h3">Data impact of uninstalling</h3>
                <p>Before uninstalling, consider the following:</p>
                <ul>
                  <li>Slack access permissions will be revoked.</li>
                  <li>Future synchronization will stop.</li>
                  <li>New Slack content will no longer be available in Clara.</li>
                  <li>Previously generated conversations and AI insights may remain available unless deleted by an administrator.</li>
                </ul>
              </section>

              {/* ===== PRIVACY ===== */}
              <section id="privacy" data-doc-section className="doc-section">
                <SectionHeading id="privacy">Privacy &amp; Security</SectionHeading>
                <p>Clara is designed with enterprise security and privacy in mind.</p>
                <ul>
                  <li>OAuth authentication is used to securely connect your Slack workspace.</li>
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
                        <td>Slack does not appear connected</td>
                        <td>
                          Verify that authorization completed successfully. Confirm the correct
                          Slack workspace was selected. Reconnect the integration if necessary.
                        </td>
                      </tr>
                      <tr>
                        <td>No Slack results returned</td>
                        <td>
                          Confirm that required permissions were granted and that the workspace
                          includes the Slack connector as a data source.
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
