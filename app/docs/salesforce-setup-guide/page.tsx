import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import PageAnimations from '@/components/ui/PageAnimations'
import DocsEnhancer from '../DocsEnhancer'
import Figure from '../Figure'

export const metadata: Metadata = {
  title: 'Salesforce Integration Setup Guide | Clarant',
  description:
    'Follow the Salesforce integration guide to connect Salesforce with Clarant, configure authentication, and query CRM data using AI.',
  alternates: { canonical: '/docs/salesforce-setup-guide' },
}

// Image path convention — drop the uploaded screenshots here and they appear
// automatically:  public/images/docs/salesforce/<file>
const IMG = '/images/docs/salesforce'

// ── Table of contents (drives both the sidebar and the section anchors) ──
const TOC: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'setup', label: 'Create the External Client App' },
  { id: 'mcp', label: 'Activate the MCP Server' },
  { id: 'oauth', label: 'Configure OAuth & OpenID Connect' },
  { id: 'connect', label: 'Connect to Clara' },
  { id: 'verify', label: 'Verify the Connection' },
  { id: 'using', label: 'Using Clara' },
  { id: 'citations', label: 'Citations & Sources' },
  { id: 'disconnect', label: 'Disconnecting Salesforce' },
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

export default function SalesforceSetupGuide() {
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
            <span aria-current="page">Salesforce Setup Guide</span>
          </nav>

          {/* ── Header ── */}
          <header className="doc-header">
            <span className="eyebrow">Connector Guide</span>
            <h1 className="doc-title">Clarant — Salesforce Integration Setup Guide</h1>

            <div className="doc-meta">
              <span>Connector setup</span>
              <span className="dot" aria-hidden="true" />
              <span>~15 minute read</span>
              <span className="dot" aria-hidden="true" />
              <span>Requires Salesforce admin access</span>
            </div>
          </header>

          {/* ── Layout: article + sticky TOC ── */}
          <div className="doc-layout">
            <article className="doc-article">

              {/* ===== OVERVIEW ===== */}
              <section id="overview" data-doc-section className="doc-section">
                <SectionHeading id="overview">Overview</SectionHeading>
                <p>
                  Clara is an AI-powered enterprise assistant that connects Salesforce,
                  HubSpot, SharePoint, Gmail, Outlook, Slack, Microsoft Teams, and other
                  business systems into a unified knowledge platform.
                </p>
                <p>
                  This guide explains the steps to connect a hosted <strong>Salesforce MCP Server</strong> with
                  Clara using <strong>PKCE authentication</strong> — no Client Secret required. With
                  Salesforce connected, users can:
                </p>
                <ul>
                  <li>Search and retrieve information from Salesforce using natural language.</li>
                  <li>Ask questions across documents, emails, chats, meetings, and CRM systems.</li>
                  <li>Receive AI-generated answers with source citations.</li>
                  <li>Organize content into workspaces for teams and departments.</li>
                  <li>Access business knowledge from multiple connected systems in a single interface.</li>
                </ul>
              </section>

              {/* ===== PREREQUISITES ===== */}
              <section id="prerequisites" data-doc-section className="doc-section">
                <SectionHeading id="prerequisites">Prerequisites</SectionHeading>
                <p>Before connecting Salesforce to Clara, ensure that:</p>
                <ul>
                  <li>You have an active Clara account.</li>
                  <li>You have a Salesforce account with administrator access.</li>
                  <li>You have permission to create External Client Apps in Salesforce Setup.</li>
                  <li>You know which environment you are connecting — <strong>Sandbox</strong> or <strong>Production</strong>.</li>
                  <li>You have access to the Clara administration portal.</li>
                </ul>

                <div className="callout callout--info">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Login URLs</span>
                    <p>If you are using a <strong>Sandbox</strong> environment, your login URL will be <code>https://test.salesforce.com</code>.</p>
                    <p>For <strong>Production</strong>, use <code>https://login.salesforce.com</code>.</p>
                  </div>
                </div>
              </section>

              {/* ===== SETUP (External Client App) ===== */}
              <section id="setup" data-doc-section className="doc-section">
                <SectionHeading id="setup">Create the External Client App</SectionHeading>
                <p>
                  Follow these steps in Salesforce Setup to create and configure the External Client App
                  that authorizes Clara to access your Salesforce data.
                </p>

                <div className="doc-steps">
                  {/* Step 1 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">1</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Open the Salesforce Setup page</h3>
                      <p>
                        Open your browser and go to your Salesforce login URL. Enter your
                        <strong> Username</strong> and <strong>Password</strong> and click <strong>Log In</strong>.
                        Make sure you are logged into the correct environment — either Sandbox or Production —
                        depending on your project requirements.
                      </p>
                      <p>
                        After successful login, click the gear icon (⚙️) at the top-right corner and select
                        <strong> Setup</strong> to open the Salesforce Setup Home page.
                      </p>
                      <Figure src={`${IMG}/01-salesforce-home.png`} alt="Salesforce Setup Home dashboard shown after logging in and opening Setup" caption="Step 1 — The Salesforce Setup Home dashboard." />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">2</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Navigate to External Client Apps</h3>
                      <p>
                        In the Salesforce Setup page, use the <strong>Quick Find</strong> search box on the left
                        side and type <strong>External</strong>. Under the <strong>Apps</strong> section, click
                        <strong> External Client Apps</strong>, then click <strong>External Client App Manager</strong> from
                        the submenu. You will now see the list of all existing External Client Apps in your org.
                      </p>
                      <Figure src={`${IMG}/02-external-client-apps.png`} alt="Salesforce External Client App Manager listing existing external client apps" caption="Step 2 — The External Client App Manager." />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">3</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Create a new External Client App</h3>
                      <p>
                        Click the <strong>New External Client App</strong> button (top-right corner). A new
                        configuration page will open. Fill in the <strong>Basic Information</strong> section:
                      </p>
                      <ul>
                        <li><strong>External Client App Name</strong> — Enter your application name. Example: <em>Salesforce MCP Server</em>.</li>
                        <li><strong>API Name</strong> — Auto-generated after entering the app name.</li>
                        <li><strong>Contact Email</strong> — Enter your email address.</li>
                        <li><strong>Distribution State</strong> — Keep it as <strong>Local</strong>.</li>
                        <li><strong>Info URL</strong> (optional) — Add your project or company website URL if available.</li>
                        <li><strong>Description</strong> — Write a short description. Example: <em>&ldquo;This application is used to connect Salesforce with the MCP Server and Clara.&rdquo;</em></li>
                      </ul>
                      <p>
                        After filling the Basic Information section, scroll down to open
                        <strong> API (Enable OAuth Settings)</strong>. Here you will configure OAuth, PKCE, the
                        Callback URL, and API permissions in the next step.
                      </p>
                      <Figure src={`${IMG}/03-basic-information.png`} alt="New External Client App configuration page showing the Basic Information section" caption="Step 3 — Fill in the Basic Information section." />
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">4</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Configure API (Enable OAuth Settings)</h3>

                      <h4 className="doc-h4">4.1 — Enable OAuth</h4>
                      <p>Check <strong>Enable OAuth</strong>.</p>

                      <h4 className="doc-h4">4.2 — Set the Callback URL</h4>
                      <p>In the <strong>Callback URL</strong> field, enter the URL based on the application you are connecting with:</p>
                      <div className="doc-table-wrap">
                        <table className="doc-table">
                          <thead>
                            <tr>
                              <th scope="col">Application</th>
                              <th scope="col">Callback URL</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Clara</td>
                              <td><code>https://api.clarant.ai/api/v1/mcp-connectors/salesforce/callback</code></td>
                            </tr>
                          { /*
                            <tr>
                              <td>Local Development</td>
                              <td><code>http://localhost:3000/callback</code></td>
                            </tr>
*/}
                          </tbody>
                        </table>
                      </div>
                      <p>Since we are connecting with Clara, enter this URL:</p>
                      <p><code>https://api.clarant.ai/api/v1/mcp-connectors/salesforce/callback</code></p>

                      <div className="callout callout--warning">
                        <span className="callout-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        </span>
                        <div className="callout-body">
                          <span className="callout-title">Important</span>
                          <p>This URL is fixed and the same for all users connecting Salesforce with Clara.</p>
                          <p>It must be exact — no trailing slash, no extra spaces. Only change this URL if you are connecting to a different application other than Clara.</p>
                        </div>
                      </div>

                      <h4 className="doc-h4">4.3 — Add OAuth Scopes</h4>
                      <p>
                        From the <strong>Available OAuth Scopes</strong> list on the left, select and move scopes
                        to <strong>Selected OAuth Scopes</strong> (right side) by clicking the arrow (→).
                      </p>
                      <p><strong>Mandatory scopes</strong> — always add these for every project:</p>
                      <ul>
                        <li>Manage user data via APIs (<code>api</code>)</li>
                        <li>Perform requests at any time (<code>refresh_token</code>, <code>offline_access</code>)</li>
                        <li>Access unique user identifiers (<code>openid</code>)</li>
                      </ul>
                      <p><strong>Optional scopes</strong> — add based on your project needs:</p>
                      <ul>
                        <li>Access the identity URL service (<code>id, profile, email, address, phone</code>) — add if your app needs to identify the logged-in user.</li>
                        <li>Access Salesforce hosted MCP servers (<code>mcp_api</code>) — add if you are using a Salesforce Hosted MCP Server.</li>
                        <li>Access all Data Cloud API resources (<code>cdp_api</code>) — add only if you are using Salesforce Data Cloud.</li>
                      </ul>
                      <div className="callout callout--warning">
                        <span className="callout-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        </span>
                        <div className="callout-body">
                          <span className="callout-title">Least privilege</span>
                          Only enable scopes your project actually needs. Adding unnecessary scopes increases security risk.
                        </div>
                      </div>

                      <h4 className="doc-h4">4.4 — Leave these unchecked</h4>
                      <ul>
                        <li>Introspect all Tokens</li>
                        <li>Configure ID token</li>
                      </ul>
                      <Figure src={`${IMG}/04-oauth-settings.png`} alt="API (Enable OAuth Settings) section showing Enable OAuth, the Callback URL field, and the OAuth Scopes selector" caption="Step 4 — Configure the Callback URL and OAuth scopes." />
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">5</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Configure Security Settings</h3>
                      <p>
                        Under the <strong>Security</strong> section, choose one of the following approaches based
                        on your project requirement.
                      </p>

                      <h4 className="doc-h4">Option A — PKCE Authentication (recommended, no Client Secret needed)</h4>
                      <div className="doc-table-wrap">
                        <table className="doc-table">
                          <thead>
                            <tr>
                              <th scope="col">Setting</th>
                              <th scope="col">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>Require secret for Web Server Flow</td><td>Leave unchecked</td></tr>
                            <tr><td>Require secret for Refresh Token Flow</td><td>Leave unchecked</td></tr>
                            <tr><td>Require Proof Key for Code Exchange (PKCE) extension</td><td>Check ✅</td></tr>
                            <tr><td>Enable Refresh Token Rotation</td><td>Leave unchecked</td></tr>
                            <tr><td>Issue JSON Web Token (JWT)-based access tokens for named users</td><td>Keep checked ✅</td></tr>
                            <tr><td>Limit Idle Refresh Token Time-to-Live (TTL) to 30 Days</td><td>Leave unchecked</td></tr>
                            <tr><td>Enforce Refresh Token IP Allowlist</td><td>Leave unchecked</td></tr>
                          </tbody>
                        </table>
                      </div>

                      <h4 className="doc-h4">Option B — Client Secret Authentication (traditional approach)</h4>
                      <div className="doc-table-wrap">
                        <table className="doc-table">
                          <thead>
                            <tr>
                              <th scope="col">Setting</th>
                              <th scope="col">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>Require secret for Web Server Flow</td><td>Check ✅</td></tr>
                            <tr><td>Require secret for Refresh Token Flow</td><td>Check ✅</td></tr>
                            <tr><td>Require Proof Key for Code Exchange (PKCE) extension</td><td>Leave unchecked</td></tr>
                            <tr><td>Enable Refresh Token Rotation</td><td>Leave unchecked</td></tr>
                            <tr><td>Issue JSON Web Token (JWT)-based access tokens for named users</td><td>Keep checked ✅</td></tr>
                            <tr><td>Limit Idle Refresh Token Time-to-Live (TTL) to 30 Days</td><td>Leave unchecked</td></tr>
                            <tr><td>Enforce Refresh Token IP Allowlist</td><td>Leave unchecked</td></tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="callout callout--info">
                        <span className="callout-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        </span>
                        <div className="callout-body">
                          <span className="callout-title">This guide uses Option A</span>
                          For this documentation we are following <strong>Option A — PKCE Authentication</strong>. You will <strong>not</strong> need a Client Secret when connecting to Clara.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="doc-step">
                    <span className="doc-step-num" aria-hidden="true">6</span>
                    <div className="doc-step-body">
                      <h3 className="doc-step-title">Save the External Client App</h3>
                      <p>
                        After completing all the settings above, scroll to the bottom of the page and click the
                        <strong> Create</strong> button to save your External Client App. Salesforce will create
                        the app and redirect you to the app detail page.
                      </p>
                      <p>
                        On the detail page, you will find your <strong>Consumer Key (Client ID)</strong> — copy and
                        save this; you will need it when connecting to Clara.
                      </p>
                      <div className="callout callout--info">
                        <span className="callout-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        </span>
                        <div className="callout-body">
                          <span className="callout-title">No Consumer Secret needed</span>
                          Since we are using PKCE, you do <strong>not</strong> need the Consumer Secret (Client Secret).
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="callout callout--success">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">App created</span>
                    With the External Client App created and the Consumer Key saved, continue to activate the
                    Salesforce MCP Server.
                  </div>
                </div>
              </section>

              {/* ===== MCP SERVER ===== */}
              <section id="mcp" data-doc-section className="doc-section">
                <SectionHeading id="mcp">Activate the MCP Server</SectionHeading>

                <h3 className="doc-h3">Find the Salesforce MCP Server</h3>
                <ol className="doc-list">
                  <li>In the Salesforce Setup page, use the <strong>Quick Find</strong> search box and type <strong>MCP</strong>.</li>
                  <li>Click <strong>MCP Servers</strong> from the search results.</li>
                  <li>On the MCP Servers page you will see two tabs — <strong>External Servers</strong> and <strong>Salesforce Servers</strong>. Click the <strong>Salesforce Servers</strong> tab.</li>
                  <li>You will see a list of available MCP servers in your org.</li>
                </ol>
                <Figure src={`${IMG}/07-mcp-servers.png`} alt="Salesforce MCP Servers page with the Salesforce Servers tab selected, listing available servers" caption="The MCP Servers page — Salesforce Servers tab." />

                <h3 className="doc-h3">Identify the correct MCP Server</h3>
                <p>
                  From the list of servers, find the server named <strong>sobject-all</strong>. (For example, we
                  use this MCP server, but users can use any hosted MCP server or create their own custom MCP
                  server.)
                </p>
                <div className="callout callout--info">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">About sobject-all</span>
                    The <strong>sobject-all</strong> server is the standard Salesforce MCP server that provides full
                    access to Salesforce objects (read, write, delete, query). It has <strong>9 tools</strong> available
                    and is recommended for connecting with Clara.
                  </div>
                </div>

                <h3 className="doc-h3">Activate the MCP Server</h3>
                <ol className="doc-list">
                  <li>Check the <strong>Server Status</strong> column — if it shows <strong>Inactive</strong>, you need to activate it.</li>
                  <li>Click the server name <strong>sobject-all</strong> to open its detail page.</li>
                  <li>On the detail page, look for the status toggle or <strong>Activate</strong> button.</li>
                  <li>Click <strong>Activate</strong> to change the status from Inactive to Active.</li>
                  <li>Once activated, the Server Status will show as <strong>Active</strong> (green badge). ✅</li>
                </ol>

                <h3 className="doc-h3">Copy the MCP Server URL</h3>
                <p>
                  After activating, stay on the <strong>sobject-all</strong> server detail page and locate the
                  <strong> Server URL</strong> field. For a Sandbox org, the URL will look like:
                </p>
                <p><code>https://your-org.sandbox.my.salesforce-apis.com/platform/mcp/v1/sandbox/platform/sobject-all</code></p>
                <p>Copy this URL and save it — you will need it when connecting to Clara.</p>
                <div className="callout callout--warning">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Important</span>
                    <p>Make sure you copy the correct URL:</p>
                    <p>For <strong>Sandbox</strong>, the URL will contain <code>sandbox</code> in the address. For <strong>Production</strong>, the URL will <strong>not</strong> contain <code>sandbox</code>.</p>
                  </div>
                </div>
                <Figure src={`${IMG}/08-mcp-server-detail.png`} alt="sobject-all MCP Server detail page showing Active status, 9 tools, and the Server URL" caption="The sobject-all detail page — Active status and Server URL." />

                <h3 className="doc-h3">Verify server details</h3>
                <p>Before moving on, confirm the following on your MCP Server:</p>
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th scope="col">Field</th>
                        <th scope="col">Expected value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Server Name</td><td>sobject-all</td></tr>
                      <tr><td>Type</td><td>Standard</td></tr>
                      <tr><td>Server Status</td><td>Active ✅</td></tr>
                      <tr><td>Tools</td><td>9</td></tr>
                      <tr><td>URL Copied</td><td>✅ Yes</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="doc-h3">Available hosted MCP servers</h3>
                <p>
                  This is the list of hosted MCP servers and their uses, so you can use any server as required.
                </p>
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th scope="col">Server Name</th>
                        <th scope="col">Description / What it does</th>
                        <th scope="col">What is needed to activate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>platform/sobject-all</code></td>
                        <td>Provides full CRUD operations (Create, Read, Update, Delete) and query access for Salesforce objects.</td>
                        <td>Enable MCP Service in Salesforce Setup, configure the OAuth app, and assign proper object permissions.</td>
                      </tr>
                      <tr>
                        <td><code>platform/sobject-reads</code></td>
                        <td>Read-only access to Salesforce data using queries and searches.</td>
                        <td>Enable MCP Service and provide read permissions for required objects.</td>
                      </tr>
                      <tr>
                        <td><code>platform/sobject-mutations</code></td>
                        <td>Allows creating and updating records, but does not allow delete operations.</td>
                        <td>Enable MCP Service and grant create/edit permissions on objects.</td>
                      </tr>
                      <tr>
                        <td><code>platform/sobject-deletes</code></td>
                        <td>Allows deletion of Salesforce records.</td>
                        <td>Enable MCP Service and grant delete permissions carefully.</td>
                      </tr>
                      <tr>
                        <td><code>platform/api-catalog</code></td>
                        <td>Exposes Salesforce REST APIs as MCP tools for external AI or integrations.</td>
                        <td>Enable API access, OAuth configuration, and API permissions.</td>
                      </tr>
                      <tr>
                        <td><code>platform/flows</code></td>
                        <td>Allows Salesforce Flows to be executed through MCP.</td>
                        <td>Active Flow(s), MCP enabled, and Flow access permissions.</td>
                      </tr>
                      <tr>
                        <td><code>platform/invocable-actions</code></td>
                        <td>Exposes Apex Invocable Methods to AI agents and external systems.</td>
                        <td>Deploy Apex classes with <code>@InvocableMethod</code> and assign Apex access.</td>
                      </tr>
                      <tr>
                        <td><code>platform/data-360</code></td>
                        <td>Enables querying unified customer data from Data Cloud / Data 360.</td>
                        <td>Salesforce Data Cloud license and Data 360 setup enabled.</td>
                      </tr>
                      <tr>
                        <td><code>analytics/tableau-next</code></td>
                        <td>Gives access to Tableau dashboards, KPIs, and analytics via MCP.</td>
                        <td>Tableau Next enabled and analytics permissions configured.</td>
                      </tr>
                      <tr>
                        <td><code>custom-mcp-server</code></td>
                        <td>Custom-built MCP server for company-specific business logic or APIs.</td>
                        <td>Custom development, deployment, OAuth setup, and endpoint configuration.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="callout callout--success">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">MCP Server ready</span>
                    Your Salesforce MCP Server is now Active and the URL is ready. Proceed to configure OAuth and
                    OpenID Connect settings.
                  </div>
                </div>
              </section>

              {/* ===== OAUTH & OPENID ===== */}
              <section id="oauth" data-doc-section className="doc-section">
                <SectionHeading id="oauth">Configure OAuth &amp; OpenID Connect</SectionHeading>
                <ol className="doc-list">
                  <li>In the Salesforce Setup page, use the <strong>Quick Find</strong> search box and type <strong>OAuth</strong>.</li>
                  <li>Under the <strong>Identity</strong> section, click <strong>OAuth and OpenID Connect Settings</strong>.</li>
                  <li>You will now see the OAuth and OpenID Connect Flows settings page.</li>
                </ol>
                <p>Enable the following toggles:</p>
                <div className="doc-table-wrap">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th scope="col">Setting</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Allow Authorization Code and Credentials Flows</td><td>✅ On</td></tr>
                      <tr><td>Require Proof Key for Code Exchange (PKCE) Extension for Supported Authorization Flows</td><td>✅ On</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Leave all other settings as they are. Changes are saved automatically — no Save button needed.
                </p>
                <Figure src={`${IMG}/09-oauth-openid-settings.png`} alt="Salesforce OAuth and OpenID Connect Settings page with Authorization Code and PKCE toggles enabled" caption="Enable Authorization Code and Credentials Flows and the PKCE extension." />
                <div className="callout callout--success">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">OAuth configured</span>
                    OAuth settings are now configured. Proceed to connect the Salesforce MCP Server with Clara.
                  </div>
                </div>
              </section>

              {/* ===== CONNECT ===== */}
              <section id="connect" data-doc-section className="doc-section">
                <SectionHeading id="connect">Connect to Clara</SectionHeading>
                <ol className="doc-list">
                  <li>Open Clara and sign in with your account credentials.</li>
                  <li>Click your <strong>Profile Icon</strong> (top-right corner) and go to <strong>Settings</strong>.</li>
                  <li>In Settings, click <strong>Integrations</strong> or <strong>Connectors</strong> from the left menu.</li>
                  <li>Click <strong>Add Integration</strong> or <strong>Connect New MCP Server</strong>.</li>
                  <li>
                    Fill in the connection details:
                    <ul>
                      <li><strong>MCP Server URL</strong> — the hosted MCP Server URL you copied earlier (for example, the <code>sobject-all</code> Server URL), or your custom hosted MCP server URL.</li>
                      <li><strong>Client ID</strong> — paste the <strong>Consumer Key</strong> copied in Step 6.</li>
                      <li><strong>Client Secret</strong> — leave blank (not required as we are using PKCE).</li>
                    </ul>
                  </li>
                  <li>Click <strong>Connect</strong> or <strong>Save</strong>.</li>
                  <li>Clara will redirect you to the Salesforce login page for authorization.</li>
                  <li>Log in with your Salesforce credentials and click <strong>Allow</strong> to grant access.</li>
                  <li>You will be redirected back to Clara — your Salesforce MCP Server is now connected! ✅</li>
                </ol>
                <div className="callout callout--success">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Connected</span>
                    Once Salesforce shows as Connected, continue to verify the connection and configure workspace
                    access.
                  </div>
                </div>
              </section>

              {/* ===== VERIFY ===== */}
              <section id="verify" data-doc-section className="doc-section">
                <SectionHeading id="verify">Verify the Connection</SectionHeading>
                <ol className="doc-list">
                  <li>After connecting, go back to the Clara chat.</li>
                  <li>Type a test message such as: <em>&ldquo;Show my Salesforce org info.&rdquo;</em></li>
                  <li>Clara should respond with your Salesforce user details — this confirms the connection is working correctly. ✅</li>
                </ol>
                <div className="callout callout--success">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Congratulations!</span>
                    You have successfully connected your hosted Salesforce MCP Server with Clara using
                    PKCE authentication — no Client Secret required.
                  </div>
                </div>
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
                    <li>Which opportunities are closing this month?</li>
                    <li>Show my top open opportunities.</li>
                    <li>Summarize my sales pipeline.</li>
                    <li>Which opportunities have had no activity for 30 days?</li>
                  </ul>
                </div>

                <div className="doc-qcard">
                  <p className="doc-qcard-h">Account &amp; contact questions</p>
                  <ul className="doc-qlist">
                    <li>Find contacts associated with Account X.</li>
                    <li>Show recent activity for Account Y.</li>
                    <li>List recently created leads.</li>
                  </ul>
                </div>

                <div className="doc-qcard">
                  <p className="doc-qcard-h">Business knowledge questions</p>
                  <ul className="doc-qlist">
                    <li>Search records related to customer onboarding.</li>
                    <li>Find cases discussing pricing changes.</li>
                    <li>Summarize customer feedback from multiple sources.</li>
                  </ul>
                </div>

                <h3 className="doc-h3">Example AI response</h3>
                <p>
                  Clara retrieves information from connected systems and generates a consolidated
                  answer. The response may include opportunity information, account and contact details,
                  pipeline insights, record references, and source citations.
                </p>
              </section>

              {/* ===== CITATIONS ===== */}
              <section id="citations" data-doc-section className="doc-section">
                <SectionHeading id="citations">Citations &amp; Sources</SectionHeading>
                <p>Clara provides citations whenever source information is available. Sources may include:</p>
                <ul>
                  <li>Salesforce CRM</li>
                  <li>SharePoint documents</li>
                  <li>Emails</li>
                  <li>Meeting transcripts</li>
                  <li>Slack conversations</li>
                </ul>
              </section>

              {/* ===== DISCONNECT ===== */}
              <section id="disconnect" data-doc-section className="doc-section">
                <SectionHeading id="disconnect">Disconnecting Salesforce</SectionHeading>
                <div className="callout callout--warning">
                  <span className="callout-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </span>
                  <div className="callout-body">
                    <span className="callout-title">Important</span>
                    <p>Disconnecting Salesforce prevents Clara from accessing new Salesforce data.</p>
                    <p>Existing indexed information may remain available according to your organization&apos;s data retention settings.</p>
                  </div>
                </div>

                <h3 className="doc-h3">Disconnect from Clara</h3>
                <ol className="doc-list">
                  <li>Navigate to <strong>Connectors</strong>.</li>
                  <li>Locate Salesforce.</li>
                  <li>Click <strong>Disconnect</strong>.</li>
                  <li>Confirm the action.</li>
                </ol>

                <h3 className="doc-h3">Revoke access in Salesforce</h3>
                <p>To completely revoke Clara&apos;s access from the Salesforce side:</p>
                <ol className="doc-list">
                  <li>Log in to Salesforce and open <strong>Setup</strong>.</li>
                  <li>Use <strong>Quick Find</strong> to open <strong>External Client App Manager</strong>.</li>
                  <li>Locate your <strong>Salesforce MCP Server</strong> app.</li>
                  <li>Deactivate or delete the app, or revoke its tokens from <strong>OAuth and OpenID Connect Settings</strong>.</li>
                </ol>
                <p>After revoking access:</p>
                <ul>
                  <li>Salesforce access permissions will be revoked.</li>
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
                        <td>Salesforce does not appear connected</td>
                        <td>
                          Verify that authorization was completed successfully. Confirm the correct Salesforce
                          environment (Sandbox or Production) was selected. Reconnect the integration if necessary.
                        </td>
                      </tr>
                      <tr>
                        <td>Redirect / callback error</td>
                        <td>
                          Confirm the Callback URL in the External Client App exactly matches
                          <code> https://api.clarant.ai/api/v1/mcp-connectors/salesforce/callback</code> — no
                          trailing slash and no extra spaces.
                        </td>
                      </tr>
                      <tr>
                        <td>No CRM results returned</td>
                        <td>
                          Verify that the MCP Server (<code>sobject-all</code>) is <strong>Active</strong>, that the
                          required OAuth scopes were granted, and that the connecting user has object permissions.
                        </td>
                      </tr>
                      <tr>
                        <td>Invalid MCP Server URL</td>
                        <td>
                          Confirm you copied the correct URL — it must contain <code>sandbox</code> for a Sandbox org
                          and must <strong>not</strong> contain <code>sandbox</code> for a Production org.
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
                <Link href="/docs/hubspot-setup-guide" className="doc-nav-card is-prev">
                  <span className="doc-nav-dir">← Previous</span>
                  <span className="doc-nav-label">HubSpot Setup Guide</span>
                </Link>
                <Link href="/docs" className="doc-nav-card is-next">
                  <span className="doc-nav-dir">Next →</span>
                  <span className="doc-nav-label">All documentation</span>
                </Link>
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
