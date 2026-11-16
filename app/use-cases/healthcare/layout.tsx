import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './healthcare.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const title = 'AI for Healthcare Documents and Records | Clarant'
const description =
  'Search medical documents, summarize clinical records, and retrieve healthcare information with source-backed AI answers and privacy controls.'
const url = '/use-cases/healthcare'

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
      <BreadcrumbJsonLd path="/use-cases/healthcare" name="Healthcare AI Assistant" />
      {children}
    </>
  )
}
