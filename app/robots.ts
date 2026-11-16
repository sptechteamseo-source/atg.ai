import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

/**
 * Host-aware robots.txt.
 *
 * This single Next.js codebase is deployed to multiple hosts (production,
 * QA/UAT web apps, Vercel preview URLs, localhost). Only the public production
 * site may be crawled — every other host returns `Disallow: /`, so QA, UAT and
 * any preview deployment can never be indexed by mistake.
 *
 * Reading the request host opts this route into dynamic rendering, which is
 * required: the response must vary per host and cannot be statically cached.
 */

// The only hosts allowed to be crawled.
const PRODUCTION_HOSTS = new Set(['clarant.ai', 'www.clarant.ai'])

const PRODUCTION_URL = 'https://clarant.ai'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerList = await headers()
  const host = (headerList.get('x-forwarded-host') ?? headerList.get('host') ?? '')
    .split(':')[0] // strip any :port
    .toLowerCase()

  // Non-production host (QA / UAT / API / preview / localhost): block everything.
  if (!PRODUCTION_HOSTS.has(host)) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  // Production marketing site: crawlable, with non-public areas disallowed.
  // Paths are written without a trailing slash so each rule matches both the
  // exact route and everything beneath it (the site runs `trailingSlash: false`,
  // so e.g. `/dashboard` — not `/dashboard/` — is the real path).
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/app',
        '/admin',
        '/login',
        '/dashboard',
        '/private',
        '/tmp',
        '/cgi-bin',
        '/privacy-policy',
        '/security',
        '/terms-of-service',
      ],
    },
    sitemap: `${PRODUCTION_URL}/sitemap.xml`,
  }
}
