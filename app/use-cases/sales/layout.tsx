import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './sales.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const title = 'AI for Sales Teams: Find Answers Faster | Clarant'
const description =
  'Help sales teams find customer details, deal history, and product information across CRM records, emails, and documents with Clarant AI.'
const url = '/use-cases/sales'

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
      <BreadcrumbJsonLd path="/use-cases/sales" name="AI for Sales Teams" />
      {children}
    </>
  )
}
