import type { ReactNode } from 'react'
import type { Metadata } from 'next'

// The login page is a Client Component, so its SEO metadata is supplied here in a
// co-located server layout. `robots: noindex, nofollow` is inherited from the
// parent (auth) layout — auth pages must never be indexed — so no canonical is set.
const title = 'AI Marketing Research Assistant | Clarant'
const description =
  'Log in to Clarant to chat with documents, analyze files, and extract accurate AI-powered answers in seconds.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children
}
