'use client'

// Error boundary for the /blog route. Next.js renders this automatically if
// the server fetch in page.tsx (the Prisma query) throws. We show a real
// error state with a retry button — never fall back to fake/static posts.

import { useEffect } from 'react'

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the failure for monitoring/logs
    console.error('[/blog] failed to load articles:', error)
  }, [error])

  return (
    <main id="main">
      <section className="blog-section">
        <div className="container">
          <div className="blog-error" role="alert">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h1 className="blog-error-title">We couldn’t load the articles</h1>
            <p className="blog-error-text">
              Something went wrong while fetching posts from the database. This is
              usually temporary — please try again.
            </p>
            <div className="blog-error-actions">
              <button type="button" className="btn btn-accent" onClick={() => reset()}>
                Try again
              </button>
              <a className="btn btn-ghost" href="/">Back to home</a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .blog-error {
          max-width: 460px;
          margin: 80px auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          color: var(--fg-muted, #666);
        }
        .blog-error svg { color: #dc2626; }
        .blog-error-title { font-size: 1.4rem; font-weight: 700; color: var(--fg, #111); margin: 4px 0 0; }
        .blog-error-text { font-size: 0.95rem; line-height: 1.55; margin: 0; }
        .blog-error-actions { display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
      `}</style>
    </main>
  )
}
