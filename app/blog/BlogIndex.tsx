'use client'

import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA from '@/components/sections/CTA'
import PageAnimations from '@/components/ui/PageAnimations'
import { cldOptimize } from '@/lib/blog-helpers'

// ── Shared shape: built on the server (page.tsx) from real DB records ──
export interface BlogCardData {
  href: string
  coverImage: string
  tag: string
  title: string
  excerpt: string
  initials: string
  author: string
  date: string        // ISO string (serialised on the server)
  dateLabel: string   // pre-formatted "May 4" (SSR-safe via lib/blog-helpers)
  readMin: number
}

// Placeholder cover colours, assigned by index at render time
const PH_COLORS = ['ph-a', 'ph-b', 'ph-c', 'ph-d', 'ph-e', 'ph-f'] as const

interface BlogIndexProps {
  posts: BlogCardData[]          // ALL published posts (newest first)
  categories: string[]          // DB-derived: ['All', ...all category names]
  mostRead: BlogCardData[]
  total: number
}

export default function BlogIndex({ posts, categories, mostRead, total }: BlogIndexProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement | null>(null)

  // ⌘K / Ctrl+K focuses the search box
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Category + title search, combined — all against REAL published records.
  // Search is case-insensitive (both sides lower-cased) and matches the title
  // field, per the listing spec.
  const q = query.trim().toLowerCase()
  const isSearching = q !== ''

  // Posts in the selected category context. "All" means every published post;
  // a specific category narrows to that category. This drives BOTH the featured
  // banner and the grid, so the featured post is never filtered out by "All".
  const categoryPosts =
    activeFilter === 'All' ? posts : posts.filter((p) => p.tag === activeFilter)

  // Featured = newest post in the current category (newest overall for "All").
  // Shown for every category, including "All". Suppressed only during a text
  // search (results-only view) or when the category genuinely has no posts —
  // so the heading never renders without content.
  const featured = !isSearching ? (categoryPosts[0] ?? null) : null

  // Grid: while searching, every post in the category whose title matches;
  // otherwise the category's posts minus the featured one shown in its banner.
  const visible = isSearching
    ? categoryPosts.filter((p) => p.title.toLowerCase().includes(q))
    : categoryPosts.slice(featured ? 1 : 0)

  const hasPosts = total > 0

  return (
    <>
      <PageAnimations />
      <a href="#main" className="visually-hidden" style={{ position: 'absolute', left: '-9999px', top: 'auto' }}>Skip to main content</a>
      <Nav basePath="/" />

      <main id="main">

        {/* ── HERO ── */}
        <section className="blog-hero" aria-labelledby="blog-h1">
          <div className="blog-hero-bg" aria-hidden="true">
            <div className="dot-grid" />
            <div className="glow" />
          </div>
          <div className="container blog-hero-inner">
            <span className="eyebrow hero-anim" style={{ animationDelay: '0ms' }}>The Clarant Blog</span>
            <h1 id="blog-h1" className="blog-hero-title hero-anim" style={{ animationDelay: '90ms' }}>
              Field notes on <em>grounded</em> AI for the modern company.
            </h1>
            <p className="blog-hero-lede hero-anim" style={{ animationDelay: '190ms' }}>
              Stories, patterns and unhinged opinions on building AI that answers from your company&apos;s own work — connectors, retrieval, evals, change management, and what comes next.
            </p>
            <div className="blog-hero-meta hero-anim" style={{ animationDelay: '280ms' }}>
              <span><strong style={{ color: 'var(--fg)' }}>{total}</strong> article{total !== 1 ? 's' : ''}</span>
              <span className="dot" />
              <span>Updated weekly</span>
              <span className="dot" />
             
            </div>
          </div>
        </section>

        {/* ── FILTER / SEARCH BAR ── */}
        <div className="blog-tools" role="search">
          <div className="container blog-tools-inner">
            <label className="blog-search" aria-label="Search the blog">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                ref={searchRef}
                type="search"
                placeholder="Search articles by title…"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search articles by title"
              />
              <kbd>⌘ K</kbd>
            </label>
            <nav className="blog-filters" aria-label="Filter by category">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`blog-filter${activeFilter === c ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter(c)}
                  type="button"
                  aria-pressed={activeFilter === c}
                >
                  {c}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ── EMPTY STATE (no published posts in DB) ── */}
        {!hasPosts && (
          <section className="blog-section" aria-labelledby="empty-h">
            <div className="container">
              <div className="blog-empty" role="status">
                <h2 id="empty-h" className="blog-empty-title">No articles published yet</h2>
                <p className="blog-empty-text">
                  Once posts are published in the dashboard, they&apos;ll appear here automatically.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── FEATURED POST (newest article in the current category) ──
             Shows for every category including "All"; only hidden during a text
             search or when the category has no posts (so the heading never
             renders empty). `featured` is null in those cases. */}
        {featured && (
          <section className="blog-section" aria-labelledby="featured-h">
            <div className="container">
              <div className="blog-eyebrow-row">
                <span className="eyebrow" id="featured-h">Featured</span>
              </div>

              <article className="featured" data-reveal="fade-up">
                <a className="featured-media" href={featured.href} aria-label={`Read: ${featured.title}`}>
                  {featured.coverImage ? (
                    <img src={cldOptimize(featured.coverImage, 1200)} alt={featured.title} className="featured-img" fetchPriority="high" />
                  ) : (
                    <>
                      <div className="ph ph-a" role="img" aria-label="Article cover" />
                      <span className="ph-label">cover · {featured.href.split('/').pop()}</span>
                    </>
                  )}
                </a>
                <div className="featured-body">
                  <span className="featured-tag">{featured.tag} · {featured.readMin} min read</span>
                  <h2 className="featured-title">
                    <a href={featured.href}>{featured.title}</a>
                  </h2>
                  <p className="featured-excerpt">{featured.excerpt}</p>
                  <div className="featured-byline">
                    <span className="byline-avatar" aria-hidden="true">{featured.initials}</span>
                    <div>
                      <div>
                        <span className="byline-name">{featured.author}</span>
                      </div>
                      <div className="byline-meta">
                        <time dateTime={featured.date}>{featured.dateLabel}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* ── POSTS + SIDEBAR ── */}
        {hasPosts && (
          <section className="blog-section" style={featured ? { paddingTop: 0 } : undefined} aria-labelledby="latest-h">
            <div className="container">
              <div className="blog-eyebrow-row">
                <span className="eyebrow" id="latest-h">
                  {isSearching ? 'Results' : activeFilter === 'All' ? 'Latest articles' : activeFilter}
                </span>
              </div>

              <div className="blog-layout">
                <div className="posts-grid">
                  {visible.length === 0 ? (
                    isSearching && (
                      <p className="posts-empty" role="status">
                        No blogs found matching your search.
                      </p>
                    )
                  ) : (
                    visible.map((p, i) => (
                      <article key={p.href} className="post-card post-card-stagger" style={{ '--card-delay': `${i * 55}ms` } as React.CSSProperties}>
                        <a href={p.href} className="post-card-media" aria-hidden="true" tabIndex={-1}>
                          {p.coverImage ? (
                            <img src={cldOptimize(p.coverImage, 700)} alt={p.title} className="post-card-img" loading="lazy" />
                          ) : (
                            <>
                              <div className={`ph ${PH_COLORS[i % PH_COLORS.length]}`} />
                              <span className="ph-label">post · {p.href.split('/').pop()}</span>
                            </>
                          )}
                        </a>
                        <div className="post-card-body">
                          <span className="post-card-tag">{p.tag}</span>
                          <h3 className="post-card-title">
                            <a href={p.href} style={{ textDecoration: 'none', color: 'inherit' }}>{p.title}</a>
                          </h3>
                          <p className="post-card-excerpt">{p.excerpt}</p>
                          <div className="post-card-foot">
                            <span className="byline-avatar" aria-hidden="true">{p.initials}</span>
                            <span>{p.author}</span>
                            <span className="byline-sep">·</span>
                            <time dateTime={p.date}>{p.dateLabel}</time>
                            <span className="byline-sep">·</span>
                            <span>{p.readMin} min</span>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                {/* ── SIDEBAR ── */}
                <aside className="blog-sidebar" aria-label="Blog sidebar" data-reveal="fade-left" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
                 
                 {/* <div className="side-newsletter">
                    <h3>The Clarant, weekly.</h3>
                    <p>One article + one customer note + one engineering snippet. No tracking pixels. No &ldquo;limited-time offer&rdquo;.</p>
                    <form action="/blog/subscribe" method="post" aria-label="Subscribe to newsletter">
                      <input type="email" name="email" required placeholder="you@company.com" aria-label="Work email" />
                      <button type="submit" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                        Subscribe
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </button>
                    </form>
                    <p style={{ marginTop: 10, fontSize: '11.5px', color: 'var(--fg-subtle)' }}>
                      12,400 readers · Unsubscribe in one click.
                    </p>
                  </div>
                  */}

                  {/* Recent articles — derived from real DB records (latest first) */}
                  {mostRead.length > 0 && (
                    <div className="side-card">
                      <h3 className="side-h">Recent articles</h3>
                      <ol className="side-list">
                        {mostRead.map((item, i) => (
                          <li key={item.href}>
                            <a href={item.href}>
                              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                              <span>{item.title}</span>
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

{/*
                  <div className="side-card">
                    <h3 className="side-h">Listen instead</h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--fg-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
                      The <em>Grounded</em> podcast — 30-minute interviews with operators shipping AI to real teams.
                    </p>
                    <a className="btn btn-ghost btn-sm" href="/podcast">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m6 4 14 8-14 8z"/></svg>
                      Latest episode
                    </a>
                  </div>
*/}
                </aside>
              </div>
            </div>
          </section>
        )}

        <CTA />
      </main>

      <Footer />
    </>
  )
}
