import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './ai-for-legal-documents.css'

// Client Component page — canonical supplied via this co-located server layout.

const title = 'AI for Legal Documents and Contract Review | Clarant'
const description =
  'Analyze contracts, search legal documents, and retrieve clauses and key terms with Clarant AI. Verify answers against cited source material.'
const url = '/use-cases/ai-for-legal-documents'
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
      <BreadcrumbJsonLd path="/use-cases/ai-for-legal-documents" name="AI for Legal Documents" />
      {children}
    </>
  )
}
