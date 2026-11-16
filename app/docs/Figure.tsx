'use client'

/**
 * Screenshot/figure with graceful fallback.
 *
 *  • Lazy-loaded + async-decoded + responsive (width:100%, height:auto) for
 *    lightweight delivery.
 *  • If the image file is missing (404), it shows a labelled "screenshot
 *    pending" placeholder with the exact expected path, instead of a broken
 *    image icon — so the page looks intentional until the asset is added.
 */

import { useState } from 'react'

interface FigureProps {
  src: string
  alt: string
  caption?: string
}

export default function Figure({ src, alt, caption }: FigureProps) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className="doc-figure">
      {failed ? (
        <div className="doc-figure-pending" role="img" aria-label={alt}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="doc-figure-pending-title">Screenshot pending</span>
          <code className="doc-figure-pending-path">{src}</code>
        </div>
      ) : (
        <img
          className="doc-figure-img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {caption && <figcaption className="doc-figure-cap">{caption}</figcaption>}
    </figure>
  )
}
