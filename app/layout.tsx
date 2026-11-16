import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import MetaPixel from '@/components/analytics/MetaPixel'
import JsonLd from '@/components/seo/JsonLd'
import CalendlyPopup from '@/components/integrations/CalendlyPopup'
import { inter, spaceGrotesk } from './fonts'

// Site-wide Organization entity. Lives in the root layout so it appears exactly
// once on every page — do not duplicate it in page components.
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://clarant.ai/#organization',
  name: 'Clarant',
  url: 'https://clarant.ai/',
  description:
    'AI-powered document intelligence platform that enables users to upload documents, ask questions, and receive instant answers with citations.',
  foundingLocation: { '@type': 'Country', name: 'United States' },
  areaServed: { '@type': 'Country', name: 'United States' },
  knowsAbout: [
    'Artificial Intelligence',
    'Document Intelligence',
    'Knowledge Management',
    'Document Search',
    'Document Analysis',
    'Enterprise AI',
    'AI Assistant',
  ],
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    availableLanguage: ['English'],
  },
}

// Public pages are indexable by default. "Only production may be indexed" is
// enforced by HOST, not by this static tag: middleware.ts adds an
// `X-Robots-Tag: noindex, nofollow` response header on every non-production host
// (QA / UAT / *.vercel.app preview / localhost), and a header `noindex` overrides
// this meta `index`. Crawling is likewise gated per-host in app/robots.ts.
// Private areas (dashboard, auth) keep their own `noindex` via their layouts.
export const metadata: Metadata = {
  title: 'AI Document Intelligence Platform | Clarant',
  description:
    'Upload documents, ask questions, and get instant AI answers with citations. Clarant helps teams analyze files, extract insights, and collaborate faster using AI.',
  // Resolves every page's relative `alternates.canonical` to an absolute
  // https://clarant.ai/… URL — the single canonical host for the whole site.
  metadataBase: new URL('https://clarant.ai'),
  verification: { google: 'oACpw2Kkg8of0dTXi6cgGUBk3LpEyzSCc7RM4hSbNxo' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/genie_light.svg', type: 'image/svg+xml' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Clarant',
    description: 'The AI workspace your team can verify.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          {/* <RobotCursor /> */}
          {children}
        </Providers>
        <GoogleAnalytics />
        <MetaPixel />
        <JsonLd data={organizationSchema} />
        <CalendlyPopup />
      </body>
    </html>
  )
}
