// Server component — a lightweight filtered blog listing used by the
// /blog/tag/[slug] page. Reuses the existing blog.css
// classes (.post-card, .posts-grid, .blog-section, etc.) for visual parity
// with the main blog index, minus the search/filter chrome.

import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA from '@/components/sections/CTA'
import type { BlogCardData } from '../BlogIndex'
import { cldOptimize } from '@/lib/blog-helpers'

const PH_COLORS = ['ph-a', 'ph-b', 'ph-c', 'ph-d', 'ph-e', 'ph-f'] as const

interface PostsListingProps {
  eyebrow: string          // e.g. "Topic" / "Tag"
  title: string            // the category/tag name
  intro?: string
  posts: BlogCardData[]
}

export default function PostsListing({ eyebrow, title, intro, posts }: PostsListingProps) {
  return (
    <>
      <Nav basePath="/" />

      <main id="main">
        <section className="blog-hero" aria-labelledby="listing-h1">
          <div className="blog-hero-bg" aria-hidden="true">
            <div className="dot-grid" />
            <div className="glow" />
          </div>
          <div className="container blog-hero-inner">
            <nav className="post2-crumb" aria-label="Breadcrumb" style={{ marginBottom: 12 }}>
              <Link href="/">Home</Link><span className="sep"> › </span>
              <Link href="/blog">Blog</Link><span className="sep"> › </span>
              <span>{title}</span>
            </nav>
            <span className="eyebrow">{eyebrow}</span>
            <h1 id="listing-h1" className="blog-hero-title">{title}</h1>
            <p className="blog-hero-lede">
              {intro ?? `Articles in ${title}.`}{' '}
              <strong style={{ color: 'var(--fg)' }}>{posts.length}</strong> article{posts.length !== 1 ? 's' : ''}.
            </p>
          </div>
        </section>

        <section className="blog-section" aria-labelledby="listing-results-h">
          <div className="container">
            <div className="blog-eyebrow-row">
              <span className="eyebrow" id="listing-results-h">Articles</span>
              <Link className="view-all" href="/blog">
                All articles
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="blog-empty" role="status">
                <h2 className="blog-empty-title">No articles here yet</h2>
                <p className="blog-empty-text">
                  Nothing has been published under &ldquo;{title}&rdquo; yet. Check back soon, or{' '}
                  <Link href="/blog" style={{ color: 'var(--accent)' }}>browse all articles</Link>.
                </p>
              </div>
            ) : (
              <div className="posts-grid">
                {posts.map((p, i) => (
                  <article key={p.href} className="post-card">
                    <a href={p.href} className="post-card-media" aria-hidden="true" tabIndex={-1}>
                      {p.coverImage ? (
                        <img src={cldOptimize(p.coverImage, 700)} alt={p.title} className="post-card-img" loading="lazy" />
                      ) : (
                        <div className={`ph ${PH_COLORS[i % PH_COLORS.length]}`} />
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
                ))}
              </div>
            )}
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </>
  )
}
