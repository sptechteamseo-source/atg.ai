// Skeleton shown automatically by Next.js while app/blog/page.tsx is fetching
// from the database (initial streaming + client-side navigation to /blog).
// No 'use client' needed — it's static markup.

export default function BlogLoading() {
  return (
    <main id="main" className="blog-skeleton" aria-busy="true" aria-label="Loading articles">
      <section className="blog-section">
        <div className="container">
          {/* Hero placeholder */}
          <div className="sk sk-eyebrow" />
          <div className="sk sk-title" />
          <div className="sk sk-lede" />

          {/* Featured placeholder */}
          <div className="sk sk-featured" />

          {/* Grid placeholder */}
          <div className="sk-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sk-card">
                <div className="sk sk-card-media" />
                <div className="sk sk-card-line" />
                <div className="sk sk-card-line short" />
                <div className="sk sk-card-foot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .blog-skeleton { padding-top: 40px; }
        .sk {
          background: var(--bg-sunken, #f1f1f3);
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }
        /* Shimmer sweep */
        .sk::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--fg, #000) 6%, transparent),
            transparent
          );
          animation: sk-shimmer 1.4s infinite;
        }
        @keyframes sk-shimmer { 100% { transform: translateX(100%); } }

        .sk-eyebrow { width: 160px; height: 14px; margin-bottom: 18px; }
        .sk-title   { width: min(620px, 90%); height: 40px; margin-bottom: 14px; }
        .sk-lede    { width: min(520px, 80%); height: 18px; margin-bottom: 40px; }
        .sk-featured { width: 100%; height: 280px; margin-bottom: 40px; }

        .sk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .sk-card {
          border: 1px solid var(--border, #e5e5e5);
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sk-card-media { width: 100%; height: 150px; }
        .sk-card-line  { width: 100%; height: 16px; }
        .sk-card-line.short { width: 60%; }
        .sk-card-foot  { width: 70%; height: 12px; margin-top: 6px; }

        @media (prefers-reduced-motion: reduce) {
          .sk::after { animation: none; }
        }
      `}</style>
    </main>
  )
}
