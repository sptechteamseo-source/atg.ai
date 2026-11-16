import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Clarant AI Documentation and Setup Guides',
  description: 'Follow Clarant setup guides to connect business apps, configure integrations, search company knowledge, and get cited AI answers.',
  alternates: { canonical: '/docs' },
}

const GUIDES = [
  {
    href: '/docs/hubspot-setup-guide',
    eyebrow: 'Connector',
    logo: '/images/docs/logos/hubspot.png',
    title: 'HubSpot Integration Setup Guide',
    desc: 'Connect HubSpot CRM to Clarant — install, configure workspaces, query with natural language, and manage the connection.',
  },
  {
    href: '/docs/jira-setup-guide',
    eyebrow: 'Connector',
    logo: '/images/docs/logos/jira.png',
    title: 'Jira Cloud Connector Setup Guide',
    desc: 'Connect Jira Cloud to Clarant — complete Atlassian administrator authorization, configure domains, and start using Jira data inside Clarant.',
  },
  {
    href: '/docs/salesforce-setup-guide',
    eyebrow: 'Connector',
    logo: '/images/docs/logos/salesforce.webp',
    title: 'Salesforce Integration Setup Guide',
    desc: 'Connect a hosted Salesforce MCP Server to Clarant — create an External Client App, configure OAuth and PKCE, activate the MCP server, and verify the connection.',
  },
  {
    href: '/docs/stripe-setup-guide',
    eyebrow: 'Connector',
    logo: '/images/docs/logos/stripe.png',
    title: 'Stripe Integration Setup Guide',
    desc: 'Connect Stripe to Clarant — create a Restricted API Key, grant the permissions you choose, and manage customers, payments, invoices, and subscriptions.',
  },
  {
    href: '/docs/slack-setup-guide',
    eyebrow: 'Connector',
    logo: '/images/docs/logos/slack.png',
    title: 'Slack Integration Setup Guide',
    desc: 'Connect Slack to Clarant — install the integration, authorize your workspace, configure workspaces, query Slack with natural language, and manage the connection.',
  },
  {
    href: '/docs/zoom-setup-guide',
    eyebrow: 'Connector',
    logo: '/images/docs/logos/zoom.webp',
    title: 'Zoom Integration Setup Guide',
    desc: 'Connect Zoom to Clarant — authorize your account, approve permissions, configure workspaces, search meeting recordings and transcripts with natural language, and manage the connection.',
  },
  {
    href: '/docs/box-setup-guide',
    eyebrow: 'Connector',
    logo: '/images/docs/logos/box.webp',
    title: 'Box Integration Setup Guide',
    desc: 'Connect Box to Clarant — install the integration, grant access, confirm the tools loaded, ask questions over your Box files and folders with citations, and manage or remove the connection.',
  },
]

export default function DocsIndexPage() {
  return (
    <div className="doc-page">
      <BreadcrumbJsonLd path="/docs" name="Docs" />
      <Nav basePath="/" />
      <main id="main">
        <div className="doc-wrap">
          <nav className="doc-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep" aria-hidden="true">/</span>
            <span aria-current="page">Documentation</span>
          </nav>

          <header className="doc-header">
            <span className="eyebrow">Docs</span>
            <h1 className="doc-title">Documentation</h1>
            <p className="doc-lede">
              Guides for connecting your business systems to Clarant and getting the most out of grounded, cited AI answers.
            </p>
          </header>

          <div className="doc-index-grid">
            {GUIDES.map((g) => (
              <Link key={g.href} href={g.href} className="doc-index-card">
                <div className="doc-card-head">
                  <span className="doc-card-logo" aria-hidden="true">
                    {g.logo ? (
                      <img src={g.logo} alt="" loading="lazy" />
                    ) : (
                      <span className="doc-card-logo-mono">{g.title.charAt(0)}</span>
                    )}
                  </span>
                  <div className="doc-card-headtext">
                    <span className="doc-card-badge">{g.eyebrow}</span>
                    <h3>{g.title}</h3>
                  </div>
                </div>
                <p>{g.desc}</p>
                <span className="doc-card-cta">View guide <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
