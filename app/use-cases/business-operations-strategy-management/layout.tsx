import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import './business-operations-strategy-management.css'

// Client Component page — SEO metadata supplied via this co-located server layout.
const title = 'AI for Business Operations & Strategy | Clarant'
const description =
  'Boost efficiency with AI for business operations and strategy management. Clarant helps teams find insights, automate workflows, and make faster decisions.'
const url = '/use-cases/business-operations-strategy-management'

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
      <BreadcrumbJsonLd path="/use-cases/business-operations-strategy-management" name="Business Operations & Strategy" />
      {children}
    </>
  )
}
