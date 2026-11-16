import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './small-and-medium-business.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const title = 'AI Document Assistant for Small Businesses | Clarant'
const description =
  "Help your small business find answers in contracts, reports, policies, and company files with Clarant's AI-powered document search."
const url = '/use-cases/small-and-medium-business'

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
      <BreadcrumbJsonLd path="/use-cases/small-and-medium-business" name="AI for Small & Medium Business" />
      {children}
    </>
  )
}
