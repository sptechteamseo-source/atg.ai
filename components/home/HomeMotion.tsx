'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { initHomeMotion } from './motion'

/* Wraps the homepage in its scoped root (.clarant-home) and starts the homepage's scripted parts once it is on the page. */
export default function HomeMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    return initHomeMotion(ref.current)
  }, [])

  return (
    <div className="clarant-home" ref={ref}>
      {children}
    </div>
  )
}
