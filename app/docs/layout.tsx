import type { ReactNode } from 'react'
import './docs.css'

// Mirrors the blog convention: the layout just scopes the
// documentation stylesheet to everything under /docs.
export default function DocsLayout({ children }: { children: ReactNode }) {
  return children
}
