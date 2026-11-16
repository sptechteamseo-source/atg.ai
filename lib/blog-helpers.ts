/**
 * Blog helper utilities shared between server and client.
 */

export interface TocItem {
  id: string
  label: string
}

export interface ProcessedContent {
  html: string
  toc: TocItem[]
}

/** Parse headings from HTML content and auto-add id attributes. */
export function processContent(content: string | null | undefined): ProcessedContent {
  if (!content) return { html: '', toc: [] }

  const toc: TocItem[] = []

  const html = content.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, level: string, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, '').trim()
      const id =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 60) || `section-${toc.length}`
      toc.push({ id, label: text })
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
    }
  )

  return { html, toc }
}

/** Generate 2-letter uppercase initials from a name */
export function getInitials(name: string): string {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** Format date as "May 21, 2026" — locale-independent, safe for SSR hydration */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

/** Format date as "May 21" — locale-independent, safe for SSR hydration */
export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`
}

/**
 * Optimize a Cloudinary delivery URL in place: modern format (f_auto → AVIF/WebP
 * per browser), automatic quality (q_auto), and a width cap so the browser never
 * downloads a multi-megabyte original. c_limit only ever downscales, so aspect
 * ratio is preserved and small images are never upscaled/blurred.
 *
 * Blog images are served via raw <img> (Cloudinary-hosted), so they bypass
 * next/image — this helper is how they get optimized. Non-Cloudinary or already
 * transformed URLs are returned unchanged (idempotent).
 */
export function cldOptimize(url: string | null | undefined, width?: number): string {
  if (!url) return ''
  if (!url.includes('res.cloudinary.com/') || !url.includes('/upload/')) return url
  if (/\/upload\/[^/]*(f_auto|q_auto)/.test(url)) return url // already optimized
  const t = ['f_auto', 'q_auto', ...(width ? [`w_${width}`, 'c_limit'] : [])].join(',')
  return url.replace('/upload/', `/upload/${t}/`)
}
