import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Canonical-host enforcement.
 *
 * Collapses every duplicate origin of the production site onto the single
 * canonical origin `https://clarant.ai`, with a permanent **301** redirect:
 *   • http  → https          (insecure → secure)
 *   • www   → non-www        (www.clarant.ai → clarant.ai)
 *
 * Path and query string are preserved, so tracking params (?utm_*) still reach
 * the page; the page's self-referencing canonical tag then consolidates those
 * parameterised variants. Trailing-slash normalisation is handled separately by
 * Next.js (`trailingSlash: false` in next.config.mjs).
 *
 * Non-production hosts (localhost, *.vercel.app preview, QA/UAT) are not
 * redirected, but every page they serve is marked `noindex, nofollow` via an
 * `X-Robots-Tag` response header. This is the authoritative "only production may
 * be indexed" gate — keyed off the real host rather than a manually-set env var,
 * and a header `noindex` overrides the indexable `robots` meta in app/layout.tsx.
 */

const CANONICAL_HOST = 'clarant.ai'

const GONE_PATH = /^\/(ask-the-clarant|clarant)-vs-(chatgpt|chatdoc|pdf-ai|askyourpdf|chatpdf|humata|notebooklm)\/?$/i

/**
 * Dashboard-managed 301 redirects.
 *
 * Prisma/MongoDB can't run on the Edge, so middleware pulls the enabled-rule
 * map from /api/redirects/map (Node runtime) and caches it in module scope with
 * a short TTL — after the first warm-up, matching is an O(1) object lookup with
 * no per-request DB or network hit. Fails open (empty map) so redirects can
 * never take the site down.
 */
const REDIRECT_TTL_MS = 60_000
let redirectCache: { map: Record<string, string>; at: number } | null = null

async function getRedirectMap(origin: string): Promise<Record<string, string>> {
  const now = Date.now()
  if (redirectCache && now - redirectCache.at < REDIRECT_TTL_MS) {
    return redirectCache.map
  }
  const url = `${origin}/api/redirects/map`
  try {
    const res = await fetch(url, { cache: 'no-store' })
    console.log('[mw:map] fetch %s -> %d ok=%s', url, res.status, res.ok) // TEMP DEBUG
    if (res.ok) {
      const map = (await res.json()) as Record<string, string>
      console.log('[mw:map] loaded rules=%d keys=%j', Object.keys(map).length, Object.keys(map)) // TEMP DEBUG
      redirectCache = { map, at: now }
    }
  } catch (err) {
    // keep the last good map (or empty) on failure
    console.error('[mw:map] fetch FAILED for %s:', url, err) // TEMP DEBUG
  }
  return redirectCache?.map ?? {}
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // TEMP DEBUG — fires on EVERY middleware invocation.
  console.log('[mw] ENTER path=%s host=%s', pathname, req.headers.get('host') ?? '?')

  // Static permanent (301) route rename: /usecases → /use-cases. Kept here (not
  // next.config redirects, which emit 308) so it's a true 301 and preserves the
  // query string. Runs before everything else, on every host.
  if (pathname === '/usecases') {
    const url = req.nextUrl.clone()
    url.pathname = '/use-cases'
    return NextResponse.redirect(url, 301)
  }

  // Permanently removed comparison pages (and their old /ask-the-Clarant-vs-*
  // names, so they don't 301 into a 410): HTTP 410 Gone. Runs before the DB
  // redirect map so no rule can redirect them. Case-insensitive; the query
  // string is irrelevant; `/x/` is normalised to `/x` by Next (trailingSlash).
  if (GONE_PATH.test(pathname)) {
    return new NextResponse('410 Gone', {
      status: 410,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' },
    })
  }

  // Topic archive pages were removed — 301 any /blog/topic/* to the blog index.
  if (pathname === '/blog/topic' || pathname.startsWith('/blog/topic/')) {
    const url = req.nextUrl.clone()
    url.pathname = '/blog'
    url.search = ''
    return NextResponse.redirect(url, 301)
  }

  // Host/proto of the incoming request — used by the canonical-host checks below.
  const proto = (req.headers.get('x-forwarded-proto') ?? req.nextUrl.protocol.replace(':', '') ?? 'https')
    .split(',')[0]
    .trim()
  const host = (req.headers.get('host') ?? req.nextUrl.host).toLowerCase()

  // Load the redirect map over the container-LOCAL loopback, never the public
  // hostname. Inside Azure App Service a request to the app's own public URL
  // hairpins out to Front Door and fails; 127.0.0.1:$PORT stays in-container
  // (plain HTTP, no TLS/WAF/DNS). PORT is set by the platform and `next start
  // -p $PORT` binds to it; it's readable in self-hosted middleware (verified).
  const mapOrigin = process.env.PORT ? `http://127.0.0.1:${process.env.PORT}` : req.nextUrl.origin

  // Never redirect API routes — and skip here to avoid recursing into the
  // map endpoint that this middleware itself fetches.
  if (!pathname.startsWith('/api')) {
    const map = await getRedirectMap(mapOrigin)
    const target = map[pathname]
    console.log('[mw] path=%s host=%s mapOrigin=%s rules=%d matched=%s', pathname, host, mapOrigin, Object.keys(map).length, target ?? 'NONE') // TEMP DEBUG
    if (target) {
      // Absolute target → use as-is; internal path → resolve against this origin.
      const dest = /^https?:\/\//i.test(target)
        ? new URL(target)
        : new URL(target, req.nextUrl.origin)
      // Preserve the incoming query string (utm_*, etc.) if the target has none.
      if (!dest.search && req.nextUrl.search) dest.search = req.nextUrl.search
      console.log('[mw] REDIRECT 301 (db-rule) %s -> %s', pathname, dest.toString()) // TEMP DEBUG
      return NextResponse.redirect(dest, 301)
    }
  }

  // Non-production hosts (localhost, *.vercel.app, QA/UAT): never redirect, but
  // forbid indexing so a stray non-canonical deployment can never be indexed.
  if (host !== CANONICAL_HOST && host !== `www.${CANONICAL_HOST}`) {
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }

  const isInsecure = proto.toLowerCase() !== 'https'
  const isWww = host === `www.${CANONICAL_HOST}`

  if (isInsecure || isWww) {
    const url = req.nextUrl.clone()
    url.protocol = 'https:'
    url.host = CANONICAL_HOST // also drops the www. prefix and any :port
    url.port = ''
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  // Run on page routes only — skip Next internals and static assets (files with
  // an extension, e.g. .css/.js/.png, and /robots.txt, /sitemap.xml).
  matcher: ['/((?!_next/|.*\\.).*)'],
}
