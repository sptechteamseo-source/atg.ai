import type { ReactNode } from 'react'
// Shared Use Cases styles — loaded once for every /use-cases/* route. Page-specific
// deltas are imported by each route's own layout (which loads after this one).
import './use-cases.css'

export default function UseCasesLayout({ children }: { children: ReactNode }) {
  return children
}
