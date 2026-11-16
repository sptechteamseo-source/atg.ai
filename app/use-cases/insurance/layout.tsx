import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './insurance.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const title = 'AI for Insurance Documents and Claims | Clarant'
const description =
  'Search insurance policies, claims files, and underwriting documents with Clarant AI. Retrieve coverage details and exclusions with source citations.'
const url = '/use-cases/insurance'

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
      <BreadcrumbJsonLd path="/use-cases/insurance" name="AI for Insurance" />
      {children}
    </>
  )
}
