// Server Component — no 'use client'.
// Loads published blogs directly from the database (Prisma) at request/build time,
// so the HTML is fully populated for SEO. The interactive list (filter + search)
// lives in the BlogIndex client component, which receives this data as props.
//
//  • Loading state  → app/blog/loading.tsx  (shown while this fetch resolves)
//  • Error state    → app/blog/error.tsx    (shown if the query below throws)

import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getInitials, formatDateShort } from '@/lib/blog-helpers'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import BlogIndex, { type BlogCardData } from './BlogIndex'

export const metadata: Metadata = {
  title: 'Blog — Field notes on grounded AI · clarant.ai',
  description:
    'Stories, patterns and opinions on building AI that answers from your company’s own work — connectors, retrieval, evals, change management, and what comes next.',
  alternates: { canonical: '/blog' },
}

// Re-generate the static page at most once per minute so newly published
// posts appear without a full redeploy, while keeping SEO-friendly caching.
// (Swap to `export const dynamic = 'force-dynamic'` if you need instant updates.)
export const revalidate = 60

/**
 * Fetch every PUBLISHED blog from MongoDB and map it to the card shape the
 * UI needs. Dates are pre-formatted with the SSR-safe helper so the server
 * and client render identical markup (no hydration mismatch).
 *
 * This intentionally does NOT catch errors — a DB failure propagates and is
 * rendered by app/blog/error.tsx instead of silently showing fake posts.
 */
async function getPublishedBlogs(): Promise<BlogCardData[]> {
  const blogs = await prisma.blog.findMany({
    where: { status: 'published' },
    orderBy: [{ publishedat: 'desc' }, { createdat: 'desc' }],
    // Pull in the structured category relation (assigned in the dashboard) and
    // the author. Without this `include`, b.category is undefined and every post
    // falls back to its free-text `tag` (often null → "General").
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  })

  return blogs.map((b) => {
    const iso = (b.publishedat ?? b.createdat).toISOString()
    // Prefer the dashboard byline (blog.authorname) over the owning user's name,
    // matching the detail page. The relation is the fallback for legacy posts.
    const displayName = b.authorname || b.author?.name || 'Unknown'
    return {
      href: `/blog/${b.slug}`,
      coverImage: b.coverimage ?? '',
      // Prefer the dashboard category relation; fall back to the legacy free-text
      // tag, then a final default. This is what each card displays and what the
      // filter chips are derived from.
      tag: b.category?.name ?? b.tag ?? 'General',
      title: b.title,
      excerpt: b.excerpt ?? '',
      initials: getInitials(displayName),
      author: displayName,
      date: iso,
      dateLabel: formatDateShort(iso),
      readMin: b.readmin,
    }
  })
}

/**
 * Build the category filter list from ALL categories in the database
 * (the `blogcategory` table managed in the dashboard), so the frontend always
 * matches what the dashboard shows — not just the subset currently used by
 * published posts. "All" is always first so it can be the default selection.
 */
async function getCategoryNames(): Promise<string[]> {
  const categories = await prisma.blogcategory.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
  })
  return categories.map((c) => c.name)
}

export default async function BlogPage() {
  const all = await getPublishedBlogs()

  // Filter chips reflect every dashboard/DB category; "All" leads.
  const categories = ['All', ...(await getCategoryNames())]

  // The full published set powers both the featured banner and the searchable
  // grid; categories come from the DB. The first five feed the
  // "Recent articles" sidebar.
  return (
    <>
      <BreadcrumbJsonLd path="/blog" name="Blog" />
      <BlogIndex
        posts={all}
        categories={categories}
        mostRead={all.slice(0, 5)}
        total={all.length}
      />
    </>
  )
}
