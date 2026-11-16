// Filtered blog listing for a single tag, e.g. /blog/tag/retrieval.
// Tags are managed in the dashboard (blogtag table); an unknown slug 404s.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getInitials, formatDateShort } from '@/lib/blog-helpers'
import PostsListing from '../../_components/PostsListing'
import type { BlogCardData } from '../../BlogIndex'

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

async function getTag(slug: string) {
  return prisma.blogtag.findUnique({ where: { slug } })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTag(slug)
  if (!tag) return { title: 'Tag not found' }
  return {
    title: `#${tag.name} — The Clarant Blog`,
    description: `Articles tagged ${tag.name} from the Clarant blog.`,
    alternates: { canonical: `/blog/tag/${slug}` },
  }
}

export default async function BlogTagPage({ params }: PageProps) {
  const { slug } = await params
  const tag = await getTag(slug)
  if (!tag) notFound()

  const blogs = await prisma.blog.findMany({
    where: {
      status: 'published',
      tags: { some: { tagid: tag.id } },
    },
    orderBy: [{ publishedat: 'desc' }, { createdat: 'desc' }],
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  })

  const posts: BlogCardData[] = blogs.map((b) => {
    const iso = (b.publishedat ?? b.createdat).toISOString()
    return {
      href: `/blog/${b.slug}`,
      coverImage: b.coverimage ?? '',
      tag: b.category?.name ?? b.tag ?? 'General',
      title: b.title,
      excerpt: b.excerpt ?? '',
      initials: getInitials(b.author?.name ?? ''),
      author: b.author?.name ?? 'Unknown',
      date: iso,
      dateLabel: formatDateShort(iso),
      readMin: b.readmin,
    }
  })

  return (
    <PostsListing
      eyebrow="Tag"
      title={tag.name}
      intro={`Articles tagged #${tag.name}.`}
      posts={posts}
    />
  )
}
