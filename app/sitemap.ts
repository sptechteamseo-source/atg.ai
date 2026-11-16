import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

/**
 * Sitemap for the public production site, referenced from robots.txt.
 *
 * Lists every public, indexable route — static marketing pages plus the
 * dynamic, database-driven blog and customer content. Authenticated areas
 * (`/dashboard`, `/login`, `/signup`) and API routes are intentionally
 * excluded; they are also `noindex` and disallowed in robots.txt.
 *
 * URLs always use the canonical production origin, regardless of which host
 * serves this route, so the sitemap is valid even when fetched from a preview.
 *
 * The dynamic (DB) section is wrapped in try/catch: a database hiccup degrades
 * the sitemap to its static routes rather than failing the whole response.
 */

const BASE_URL = 'https://clarant.ai'

// Re-query the DB at most once per hour so newly published posts/taxonomies
// appear without a redeploy, while keeping the route cheap and cacheable.
export const revalidate = 3600

// Public, statically-known routes.
const STATIC_ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.8 },
  { path: '/security', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/docs', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/docs/hubspot-setup-guide', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/docs/salesforce-setup-guide', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/use-cases', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/use-cases/sales', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/use-cases/marketing', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/use-cases/healthcare', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/use-cases/researcher', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/use-cases/ai-for-legal-documents', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/use-cases/small-and-medium-business', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/use-cases/hr-documents', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/use-cases/real-estate', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/use-cases/insurance', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  // Dynamic, database-driven routes. Only published content is exposed publicly,
  // so the sitemap mirrors exactly that. Taxonomy pages are included only when
  // they have at least one published post (avoids listing thin/empty pages).
  let dynamicEntries: MetadataRoute.Sitemap = []
  try {
    const [posts, tags] = await Promise.all([
      prisma.blog.findMany({
        where: { status: 'published' },
        select: { slug: true, updatedat: true },
      }),
      prisma.blogtag.findMany({
        where: { posts: { some: { blog: { status: 'published' } } } },
        select: { slug: true },
      }),
    ])

    dynamicEntries = [
      ...posts.map((p) => ({
        url: `${BASE_URL}/blog/${p.slug}`,
        lastModified: p.updatedat ?? now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...tags.map((t) => ({
        url: `${BASE_URL}/blog/tag/${t.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.4,
      })),
    ]
  } catch (err) {
    // DB unavailable at build/request time — emit the static sitemap rather than
    // failing. Dynamic entries return on the next successful revalidation.
    console.error('[sitemap] failed to load dynamic routes; serving static only', err)
  }

  return [...staticEntries, ...dynamicEntries]
}
