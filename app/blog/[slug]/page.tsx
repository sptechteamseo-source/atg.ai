// Server Component — no 'use client'.
// Fetches blog data from PostgreSQL, generates SEO metadata, adds JSON-LD schema,
// then hands pre-fetched data to BlogPostClient for interactive rendering.

import { cache }     from 'react'
import { notFound }  from 'next/navigation'
import Script        from 'next/script'
import type { Metadata } from 'next'
import type { Prisma }   from '@prisma/client'
import { prisma }    from '@/lib/prisma'
import BlogPostClient from './BlogPostClient'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { serializeJsonLd } from '@/components/seo/JsonLd'
import { SITE }        from '@/lib/breadcrumbs'
import type { SerializedBlog, RelatedPost, AdjacentPost, FaqItem } from '@/types'

type BlogWithRelations = Prisma.blogGetPayload<{
  include: {
    author: { select: { id: true; name: true; image: true; bio: true; jobtitle: true; twitter: true; linkedin: true } }
    category: { select: { id: true; name: true; slug: true } }
    tags: { include: { tag: { select: { id: true; name: true; slug: true } } } }
  }
}>

// ── Cached DB fetch — runs ONCE even when both generateMetadata and the page call it ──
const getBlog = cache(async (slug: string): Promise<BlogWithRelations | null> => {
  const blog = await prisma.blog.findUnique({
    where: { slug, status: 'published' },
    include: {
      author: {
        select: {
          id: true, name: true, image: true,
          bio: true, jobtitle: true, twitter: true, linkedin: true,
        },
      },
      category: { select: { id: true, name: true, slug: true } },
      tags:     { include: { tag: { select: { id: true, name: true, slug: true } } } },
    },
  })
  // Trashed (soft-deleted) posts must 404. Checked here rather than in the
  // findUnique where, because on MongoDB `deletedat: null` fails to match docs
  // that omit the field entirely (i.e. every post not yet trashed).
  return blog?.deletedat ? null : blog
})

type PageProps = {
  params: Promise<{ slug: string }>
}

// ── SEO metadata ──
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) return { title: 'Post not found' }

  const title       = blog.seotitle       ?? blog.title
  const description = blog.seodescription ?? blog.excerpt ?? ''
  const image       = blog.ogimage        ?? blog.coverimage ?? ''

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type:   'article',
      url:    `/blog/${slug}`,
      images: image ? [{ url: image, width: 1200, height: 630, alt: blog.imagealt ?? blog.title }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      image ? [image] : [],
    },
  }
}

// ── Page component ──
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) notFound()

  // ── Related posts — same category first, fill from any published blogs ──
  const related: RelatedPost[] = await (async () => {
    // Include the category relation so each related card shows its real,
    // dashboard-assigned category (resolved into `tag` below) rather than the
    // null free-text tag.
    const relatedSelect = {
      id: true, title: true, slug: true, excerpt: true,
      tag: true, coverimage: true, readmin: true,
      author:   { select: { name: true } },
      category: { select: { name: true } },
    } satisfies Prisma.blogSelect

    const toRelated = (r: Prisma.blogGetPayload<{ select: typeof relatedSelect }>): RelatedPost => ({
      id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt,
      tag: r.category?.name ?? r.tag ?? null,
      coverimage: r.coverimage, readmin: r.readmin, author: r.author,
    })

    const sameCategory = await prisma.blog.findMany({
      where: {
        status:     'published',
        id:         { not: blog.id },
        categoryid: blog.categoryid ?? undefined,
      },
      take: 3,
      orderBy: { publishedat: 'desc' },
      select: relatedSelect,
    })

    if (sameCategory.length >= 3) return sameCategory.map(toRelated)

    const extra = await prisma.blog.findMany({
      where: {
        status: 'published',
        id:     { notIn: [blog.id, ...sameCategory.map((r) => r.id)] },
      },
      take:    3 - sameCategory.length,
      orderBy: { publishedat: 'desc' },
      select: relatedSelect,
    })

    return [...sameCategory, ...extra].map(toRelated)
  })()

  // ── Previous / Next navigation — chronological by publish date ──
  // "Previous" = the post published just before this one (older);
  // "Next" = the post published just after (newer). Purely data-driven, so it
  // updates automatically as posts are added. id tiebreak keeps it deterministic
  // when two posts share a publish timestamp.
  const adjacentSelect = { title: true, slug: true, coverimage: true, publishedat: true } satisfies Prisma.blogSelect
  const publishedAt = blog.publishedat ?? blog.createdat

  const [prevRow, nextRow] = await Promise.all([
    prisma.blog.findFirst({
      where: { status: 'published', id: { not: blog.id }, publishedat: { lt: publishedAt } },
      orderBy: [{ publishedat: 'desc' }, { id: 'desc' }],
      select: adjacentSelect,
    }),
    prisma.blog.findFirst({
      where: { status: 'published', id: { not: blog.id }, publishedat: { gt: publishedAt } },
      orderBy: [{ publishedat: 'asc' }, { id: 'asc' }],
      select: adjacentSelect,
    }),
  ])

  const toAdjacent = (r: typeof prevRow): AdjacentPost | null =>
    r ? { title: r.title, slug: r.slug, coverimage: r.coverimage, publishedat: r.publishedat?.toISOString() ?? null } : null

  const prev = toAdjacent(prevRow)
  const next = toAdjacent(nextRow)

  // ── JSON-LD structured data ──
  // Individual blog pages carry three independent schemas: Article (this page
  // only), BreadcrumbList (via <BreadcrumbJsonLd>), and FAQPage when the post
  // actually has FAQ content. Each is a separate, valid JSON-LD block.
  const faqItems: FaqItem[] = Array.isArray(blog.faq) ? (blog.faq as unknown as FaqItem[]) : []

  // Featured image must be an absolute URL. Cloudinary/OG URLs are already
  // absolute; a relative /path is resolved against the production origin.
  const rawImage = blog.ogimage || blog.coverimage || ''
  const image = rawImage && !/^https?:\/\//i.test(rawImage)
    ? `${SITE}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
    : rawImage

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${slug}` },
    headline: blog.title,
    description: blog.seodescription ?? blog.excerpt ?? '',
    ...(image ? { image } : {}),
    author: { '@type': 'Person', name: blog.authorname ?? blog.author.name },
    publisher: { '@type': 'Organization', name: 'Clarant', url: `${SITE}/` },
    datePublished: (blog.publishedat ?? blog.createdat).toISOString(),
  }

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  } : null

  // ── Serialize — Date objects → ISO strings for client component ──
  const serializedBlog: SerializedBlog = {
    id:             blog.id,
    title:          blog.title,
    slug:           blog.slug,
    excerpt:        blog.excerpt,
    content:        blog.content,
    authorname:     blog.authorname,
    coverimage:     blog.coverimage,
    ogimage:        blog.ogimage,
    imagealt:       blog.imagealt,
    seotitle:       blog.seotitle,
    seodescription: blog.seodescription,
    schemamarkup:   blog.schemamarkup,
    faq:            faqItems,
    tag:            blog.tag,
    status:         blog.status,
    readmin:        blog.readmin,
    publishedat:    blog.publishedat?.toISOString() ?? null,
    updatedat:      blog.updatedat.toISOString(),
    createdat:      blog.createdat.toISOString(),
    author: {
      id:       blog.author.id,
      name:     blog.author.name,
      image:    blog.author.image,
      bio:      blog.author.bio,
      jobtitle: blog.author.jobtitle,
      twitter:  blog.author.twitter,
      linkedin: blog.author.linkedin,
    },
    category: blog.category
      ? { id: blog.category.id, name: blog.category.name, slug: blog.category.slug }
      : null,
    tags: blog.tags.map((t) => ({
      blogid: t.blogid,
      tagid:  t.tagid,
      tag:    { id: t.tag.id, name: t.tag.name, slug: t.tag.slug },
    })),
  }

  // ── Custom JSON-LD entered in the dashboard ──
  // Only inject when it parses as valid JSON, so a malformed value can never
  // break the page or emit invalid structured data.
  let customSchema: string | null = null
  if (blog.schemamarkup && blog.schemamarkup.trim()) {
    try {
      customSchema = JSON.stringify(JSON.parse(blog.schemamarkup))
    } catch {
      console.warn(`[blog/${slug}] Ignoring invalid schemamarkup JSON`)
    }
  }

  return (
    <>
      {/* BreadcrumbList — Home > Blog > <post title> (title from data, not slug) */}
      <BreadcrumbJsonLd path={`/blog/${slug}`} name={blog.title} />

      {/* Article — individual blog pages only */}
      <Script
        id="blog-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }}
      />

      {/* FAQPage — only when the post has visible FAQ content */}
      {faqSchema && (
        <Script
          id="blog-faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
        />
      )}

      {customSchema && (
        <Script
          id="blog-schema-custom"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: customSchema }}
        />
      )}

      <BlogPostClient blog={serializedBlog} related={related} prev={prev} next={next} />
    </>
  )
}
