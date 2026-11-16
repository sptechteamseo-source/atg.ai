import type { ReactNode } from 'react'
import type { Metadata } from 'next'
// Page CSS lives in a co-located stylesheet (emitted as a cached <link> rather
// than inline markup) so the HTML-to-text ratio stays high. See marketing.css.
import './marketing.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const SITE = 'https://clarant.ai'
const title = 'AI for Marketing Teams and Agencies | Clarant'
const description =
  'Use Clarant AI to find campaign insights, brand guidelines, customer research, and marketing information across documents and connected apps.'
const url = '/use-cases/marketing'
const pageUrl = `${SITE}${url}`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

// Server-rendered structured data (invisible; adds no visible content and no
// styling). WebSite + WebPage + Breadcrumb + Organization in one graph.
// Note: no SoftwareApplication node here. Google/SEMrush require `offers` and
// `aggregateRating`/`review` on SoftwareApplication for it to qualify; we have
// no real pricing or rating data, so an incomplete node only draws warnings.
// Re-add it (with a real Offer + aggregateRating) once that data exists.
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'Clarant',
      url: SITE,
      logo: `${SITE}/logo.png`,
    },
    {
      // WebSite is the valid isPartOf target for WebPage (a CreativeWork).
      // An Organization is not — that was the reported validation error.
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'Clarant',
      publisher: { '@id': `${SITE}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      isPartOf: { '@id': `${SITE}/#website` },
      inLanguage: 'en-US',
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Use Cases', item: `${SITE}/use-cases` },
        { '@type': 'ListItem', position: 3, name: 'AI for Marketing Teams', item: pageUrl },
      ],
    },
  ],
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
