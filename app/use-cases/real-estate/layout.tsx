import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './real-estate.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const title = 'AI for Real Estate Documents and Contracts | Clarant'
const description =
  'Search property records, lease agreements, contracts, and real estate documents with Clarant AI to find important details faster.'
const url = '/use-cases/real-estate'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd path="/use-cases/real-estate" name="AI for Real Estate" />
      {children}
    </>
  )
}
