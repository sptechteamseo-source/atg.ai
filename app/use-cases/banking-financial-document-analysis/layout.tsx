import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './banking-financial-document-analysis.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const title = 'AI for Banking & Financial Document Analysis | Clarant'
const description =
  'Analyze banking and financial documents faster with AI-powered search, summaries, and insights. Clarant helps teams save time and improve accuracy.'
const url = '/use-cases/banking-financial-document-analysis'

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
      <BreadcrumbJsonLd path="/use-cases/banking-financial-document-analysis" name="Banking & Financial Document Analysis" />
      {children}
    </>
  )
}
