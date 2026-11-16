'use client'

/**
 * Progressive enhancement for documentation pages. Renders nothing —
 * it just wires up two behaviours over the server-rendered markup:
 *
 *   1. Copy-link  — clicking a [data-anchor] button copies the section's
 *                   deep link to the clipboard and shows a "Link copied" hint.
 *   2. Scroll-spy — highlights the active entry in .doc-toc as you scroll
 *                   past each [data-doc-section].
 *
 * Mirrors the project's existing PageAnimations pattern (a client component
 * that attaches behaviour via the DOM and returns null).
 */

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function DocsEnhancer() {
  const pathname = usePathname()

  // ── Copy-link on heading anchors (event delegation) ──
  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-anchor]')
      if (!btn) return
      const id = btn.getAttribute('data-anchor')
      if (!id) return

      const url = `${window.location.origin}${window.location.pathname}#${id}`
      try {
        await navigator.clipboard.writeText(url)
      } catch {
        // Clipboard API unavailable (e.g. non-HTTPS) — still update the hash
      }
      history.replaceState(null, '', `#${id}`)
      btn.classList.add('is-copied')
      window.setTimeout(() => btn.classList.remove('is-copied'), 1500)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // ── Scroll-spy: highlight the active TOC link ──
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-doc-section]'))
    if (!sections.length) return

    const links = new Map<string, HTMLAnchorElement>()
    document.querySelectorAll<HTMLAnchorElement>('.doc-toc a[href^="#"]').forEach((a) => {
      links.set(a.getAttribute('href')!.slice(1), a)
    })

    const setActive = (id: string) => {
      links.forEach((a) => a.classList.remove('is-active'))
      links.get(id)?.classList.add('is-active')
    }

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the topmost section currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive((visible[0].target as HTMLElement).id)
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 }
    )

    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [pathname])

  return null
}
