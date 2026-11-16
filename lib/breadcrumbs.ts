// Reusable, route-driven BreadcrumbList JSON-LD builder.
//
// One source of truth for breadcrumb structured data across the whole site.
// Callers pass the page's own path (+ a human leaf name where the slug isn't a
// good label); intermediate segments resolve from PARENT_LABELS. Every URL is
// absolute against the single production origin — never localhost/preview/Azure.

export const SITE = 'https://clarant.ai'

// Human labels for known non-leaf segments, so a slug is never shown as a name
// when a proper label exists. Leaf names are supplied by the caller.
const PARENT_LABELS: Record<string, string> = {
  'use-cases': 'Use Cases',
  blog: 'Blog',
  docs: 'Docs',
}

// Fallback label for an unknown segment: "hr-documents" → "Hr Documents".
// Only hit when neither a leaf name nor a PARENT_LABELS entry is available.
function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: {
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }[]
}

/**
 * Build a BreadcrumbList schema for `path` (e.g. "/use-cases/insurance").
 * The final crumb is the current page; pass `leafName` to use the real page/
 * blog title instead of the slug. Home ("/") is always position 1.
 */
export function breadcrumbSchema(path: string, leafName?: string): BreadcrumbSchema {
  const segments = path.split('/').filter(Boolean)

  const items = [{ '@type': 'ListItem' as const, position: 1, name: 'Home', item: `${SITE}/` }]

  segments.forEach((seg, i) => {
    const isLeaf = i === segments.length - 1
    const name = isLeaf
      ? leafName ?? PARENT_LABELS[seg] ?? titleCase(seg)
      : PARENT_LABELS[seg] ?? titleCase(seg)
    items.push({
      '@type': 'ListItem',
      position: i + 2, // +1 for 0-index, +1 for the Home item
      name,
      item: `${SITE}/${segments.slice(0, i + 1).join('/')}`,
    })
  })

  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items }
}
