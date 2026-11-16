import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './researcher.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const title = 'AI Research Assistant for Faster Research | Clarant'
const description =
  'Find relevant information across research papers, reports, and documents. Use Clarant AI to summarize findings and verify answers with citations.'
const url = '/use-cases/researcher'

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
      <BreadcrumbJsonLd path="/use-cases/researcher" name="AI Research Assistant" />
      {children}
    </>
  )
}
