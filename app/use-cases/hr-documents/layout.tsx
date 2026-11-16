import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './hr-documents.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const title = 'AI for HR Documents and Policies | Clarant'
const description =
  'Search HR policies, employee handbooks, onboarding documents, and internal guidelines with Clarant AI and source-backed answers.'
const url = '/use-cases/hr-documents'

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
      <BreadcrumbJsonLd path="/use-cases/hr-documents" name="AI for HR Documents" />
      {children}
    </>
  )
}
