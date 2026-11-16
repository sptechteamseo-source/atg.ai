import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageAnimations from '@/components/ui/PageAnimations'
import DocsEnhancer from '../DocsEnhancer'
import Figure from '../Figure'

export const metadata: Metadata = {
  title: 'Box Integration Setup Guide | Clarant',
  description:
    'Connect Box to Clarant and learn how to search files, ask questions across documents, retrieve cited answers, and configure access permissions.',
  alternates: { canonical: '/docs/box-setup-guide' },
}

// Image path convention — the uploaded screenshots live here:
//   public/images/docs/box/<file>
const IMG = '/images/docs/box'

// ── Table of contents (drives both the sidebar and the section anchors) ──
const TOC: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'install', label: 'Install the Integration' },
  { id: 'configure', label: 'Configure the Integration' },
  { id: 'disconnect', label: 'Disconnecting Box' },
  { id: 'uninstall', label: 'Uninstalling the Integration' },
  { id: 'privacy', label: 'Privacy & Security' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
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

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
)
const WarnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
)

export default function BoxSetupGuide() {
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
            <span aria-current="page">Box Setup Guide</span>
          </nav>

          {/* ── Header ── */}
          <header className="doc-header">
            <span className="eyebrow">Connector Guide</span>
            <h1 className="doc-title">Clarant — Box Integration Setup Guide</h1>

            <div className="doc-meta">
              <span>Connector setup</span>
              <span className="dot" aria-hidden="true" />
              <span>~8 minute read</span>
              <span className="dot" aria-hidden="true" />
              <span>Requires a Box account</span>
            </div>
          </header>

          {/* ── Layout: article + sticky TOC ── */}
          <div className="doc-layout">
            <article className="doc-article">

              {/* ===== OVERVIEW ===== */}
              <section id="overview" data-doc-section className="doc-section">
                <SectionHeading id="overview">Overview</SectionHeading>
                <p>
                  Connecting Box lets Clara find, read and reason over the documents in
                  your Box account using plain language — no folder digging, no downloading.
                </p>
                <p>Once connected, Clara can:</p>
                <ul>
                  <li><strong>Find content</strong> — search files and folders by keyword, file type or date, and browse your folder tree</li>
                  <li><strong>Read documents</strong> — contracts, proposals, reports, spreadsheets, presentations and code</li>
                  <li>Answer questions about a single file or across many at once, with citations back to the source</li>
                  <li><strong>Extract structured data</strong> — dates, amounts, parties, or any fields you define, using Box AI</li>
                  <li><strong>Work with metadata</strong> — create metadata templates, apply them to files and folders, and search by them</li>
                  <li><strong>Organise content</strong> — create folders, upload files and new versions, move, copy, rename and comment</li>
                  <li><strong>Use Box Hubs</strong> — browse Hub contents and ask questions across an entire Hub</li>
                  <li><strong>Watch for changes</strong> — Clara follows your Box activity in the background so document updates appear in your timeline alongside email, calendar and CRM</li>
                </ul>
                <p>
                  Clara can only reach content you already have permission to see in Box. All
                  permissions, sharing rules and collaboration settings continue to be enforced
                  by Box.
                </p>
              </section>

              {/* ===== PREREQUISITES ===== */}
              <section id="prerequisites" data-doc-section className="doc-section">
                <SectionHeading id="prerequisites">Prerequisites</SectionHeading>
                <ul>
                  <li>An Clara plan that includes connectors</li>
                  <li>A Box account you can sign in to</li>
                  <li>Box AI enabled on your Box plan — required only for the AI question-and-answer and extraction features. Everything else works without it.</li>
                </ul>
                <p>
                  If your organisation restricts external applications in Box, a Box administrator
                  must enable Clara once, in Admin Console → Integrations → Platform Apps
                  Manager. Most Box accounts do not need this step — you’ll know because the
                  authorisation screen in Step 4 will refuse.
                </p>
              </section>

              {/* ===== INSTALL ===== */}
              <section id="install" data-doc-section className="doc-section">
                <SectionHeading id="install">Install the Integration</SectionHeading>

                <div className="doc-steps">
                  {/* Step 1 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">1</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Open your connector settings</h3>
                      <p>Sign in to Clara and go to Settings → Connectors.</p>
                      <Figure src={`${IMG}/connectorspage.png`} alt="The Clara Connectors page listing available connectors including Box" caption="Step 1 — The Connectors page in Clara" />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">2</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Find Box and click Connect</h3>
                      <p>Locate Box in the connector list and click Connect. Clara will redirect you to Box to sign in.</p>
                      <Figure src={`${IMG}/boxconnect.png`} alt="The Box connector dialog in Clara showing OAuth authentication and a Connect button" />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">3</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Sign in to Box</h3>
                      <p>Sign in with the Box account whose content you want Clara to work with. If you’re already signed in to Box in this browser, Box may skip straight to Step 4.</p>
                      <div className="callout callout--info">
                        <span className="callout-icon" aria-hidden="true"><InfoIcon /></span>
                        <div className="callout-body">
                          <span className="callout-title">Which account?</span>
                          Connect the Box account you use day to day. Clara inherits exactly that account’s access — nothing more, nothing less.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">4</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Review and grant access</h3>
                      <p>Box shows an authorisation screen listing what Clara is requesting:</p>
                      <div className="doc-table-wrap">
                        <table className="doc-table">
                          <thead>
                            <tr>
                              <th scope="col">Box permission</th>
                              <th scope="col">Why Clara needs it</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Read and write all files and folders stored in Box</td>
                              <td>To search, browse and read your content, and to create folders, upload files, move, copy, rename and comment when you ask it to</td>
                            </tr>
                            <tr>
                              <td>Manage AI Requests</td>
                              <td>To use Box AI for answering questions about documents and extracting structured data</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p>Click Grant access to Box.</p>
                      <Figure src={`${IMG}/redirectppage.png`} alt="The Box authorisation screen showing the access Clara is requesting with a Grant Access to Box button" caption="Step 4 — The Box authorisation screen" />
                      <div className="callout callout--info">
                        <span className="callout-icon" aria-hidden="true"><InfoIcon /></span>
                        <div className="callout-body">
                          <span className="callout-title">Important</span>
                          Granting access does not give Clara access to anything you can’t already open in Box. Box evaluates every request against your own permissions.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">5</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">You’re returned to Clara</h3>
                      <p>Box redirects you back to Settings → Connectors. Box should now show a Connected badge.</p>
                      <Figure src={`${IMG}/connected.png`} alt="Clara showing Box with a Connected badge in the connector dialog" caption="Step 5 — Box showing as connected" />
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">6</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Confirm the tools loaded</h3>
                      <p>Click into the Box connector. You should see the full list of Box capabilities Clara can use. If the list is empty, disconnect and reconnect — the capability list is fetched from Box at connection time.</p>
                      <Figure src={`${IMG}/dynamictools.png`} alt="The Box connector in Clara showing the Manage Tools list of Box capabilities with toggles" />
                    </div>
                  </div>
                </div>
              </section>

              {/* ===== CONFIGURE ===== */}
              <section id="configure" data-doc-section className="doc-section">
                <SectionHeading id="configure">Configure the Integration</SectionHeading>

                <h3 className="doc-h3">Verify the connection</h3>
                <p>
                  Settings → Connectors → Box shows the current status. A healthy connection reads
                  Connected. If it reads Reauthorisation required, click Connect again — see
                  Troubleshooting.
                </p>

                <h3 className="doc-h3">AI Response Examples</h3>
                <Figure src={`${IMG}/query.png`} alt="Clara answering the question “What’s in my Box?” with a table of files and folders and links back to the sources" caption="Clara answering a question from Box content, with sources" />
                <p>
                  When Clara answers from Box, it names the documents it used and links straight to
                  them, so you can open the source in Box and check for yourself.
                </p>
              </section>

              {/* ===== DISCONNECT ===== */}
              <section id="disconnect" data-doc-section className="doc-section">
                <SectionHeading id="disconnect">Disconnecting Box</SectionHeading>
                <div className="callout callout--warning">
                  <span className="callout-icon" aria-hidden="true"><WarnIcon /></span>
                  <div className="callout-body">
                    <span className="callout-title">Important</span>
                    Disconnecting removes Clara’s stored access to Box and stops background monitoring. Box activity Clara had collected is purged from your timeline. Nothing in your Box account is changed, moved or deleted — no files, folders, comments or metadata.
                  </div>
                </div>
                <ol className="doc-list">
                  <li>Go to Settings → Connectors</li>
                  <li>Click into Box</li>
                  <li>Click Disconnect and confirm</li>
                </ol>
                <p>You can reconnect at any time by repeating the install steps.</p>
              </section>

              {/* ===== UNINSTALL ===== */}
              <section id="uninstall" data-doc-section className="doc-section">
                <SectionHeading id="uninstall">Uninstalling the Integration</SectionHeading>
                <p>
                  Disconnecting in Clara is enough to cut off access. To also remove the
                  authorisation on the Box side:
                </p>
                <ul>
                  <li><strong>As a user:</strong> sign in to Box, open Account Settings → Security, find Clara in your authorised applications and remove it.</li>
                  <li><strong>As a Box administrator:</strong> open Admin Console → Integrations → Platform Apps Manager, find Clara and disable or remove it. This revokes access for every user in your enterprise.</li>
                </ul>
                <p>
                  Revoking on the Box side invalidates Clara’s access immediately. The connector
                  will show Reauthorisation required until someone reconnects.
                </p>
              </section>

              {/* ===== PRIVACY ===== */}
              <section id="privacy" data-doc-section className="doc-section">
                <SectionHeading id="privacy">Privacy &amp; Security</SectionHeading>
                <ul>
                  <li>Authorisation uses Box OAuth 2.0. Clara never sees or stores your Box password.</li>
                  <li>Access tokens are encrypted at rest and refreshed automatically.</li>
                  <li>Clara operates as you. It cannot see any file, folder or Hub that your own Box account cannot open, and Box enforces every permission, classification and sharing rule on each request.</li>
                  <li>Document content is read to answer your question and is not retained beyond what’s needed to produce and cite the answer.</li>
                  <li>You can revoke access at any time from either side — Clara or Box.</li>
                </ul>
                <p>See our <a href="/privacy" style={{ textDecoration: 'none',color:'#7aa8fb' }}>Privacy Policy</a> and <a href="/security" style={{ textDecoration: 'none',color:'#7aa8fb'  }}>Security </a> overview for full details.</p>
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
                        <td>Box refuses on the authorisation screen</td>
                        <td>Your organisation restricts external applications. Ask a Box administrator to enable Clara in Admin Console → Integrations → Platform Apps Manager.</td>
                      </tr>
                      <tr>
                        <td>Connector shows “Reauthorisation required”</td>
                        <td>Access was revoked in Box, or the connection sat unused past its refresh window. Click Connect to re-authorise.</td>
                      </tr>
                      <tr>
                        <td>AI questions and extraction fail</td>
                        <td>Box AI requires an AI-enabled Box plan. Reading, searching and browsing work regardless — check with your Box administrator whether Box AI is included.</td>
                      </tr>
                      <tr>
                        <td>Document generation requests fail</td>
                        <td>Box Doc Gen requires Box Enterprise Advanced and is not available through this integration.</td>
                      </tr>
                      <tr>
                        <td>Copying a Box Hub fails</td>
                        <td>A known fault on Box’s side, not with the integration. Create a new Hub and add the items to it instead.</td>
                      </tr>
                      <tr>
                        <td>“Item not found”</td>
                        <td>The file or folder may have been renamed, moved or trashed since it was last mentioned. Ask Clara to search for it again by name.</td>
                      </tr>
                      <tr>
                        <td>A file you just uploaded can’t be read</td>
                        <td>Box generates the text version of a file a few moments after upload. Wait around 30 seconds and ask again.</td>
                      </tr>
                      <tr>
                        <td>A folder listing looks incomplete</td>
                        <td>Large folders are shortened to fit the response. Clara will say so — narrow the request by file type, date or subfolder rather than asking for more pages.</td>
                      </tr>
                      <tr>
                        <td>Box changes aren’t appearing in your timeline</td>
                        <td>Check Settings → What Clara monitors and confirm Box is switched on.</td>
                      </tr>
                      <tr>
                        <td>A capability seems missing</td>
                        <td>Open Settings → Connectors → Box and check that capability hasn’t been switched off.</td>
                      </tr>
                    </tbody>
                  </table>
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
