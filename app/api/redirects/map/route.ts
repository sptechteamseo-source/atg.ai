import { prisma } from '@/lib/prisma'

// Public, unauthenticated: middleware.ts fetches this to build its in-memory
// redirect map. Returns only enabled rules as { "/source": "/target" }.
// No secrets here — these redirects are already observable to any visitor.
// Cached at the edge so the DB is hit at most once per revalidation window.
export const dynamic = 'force-dynamic'

export async function GET() {
  // TEMP DEBUG — which connection string is in play (host only, no credentials)
  const rawUri = process.env.MONGODB_URI ?? process.env.DATABASE_URL ?? ''
  const usingVar = process.env.MONGODB_URI ? 'MONGODB_URI' : process.env.DATABASE_URL ? 'DATABASE_URL' : 'NONE'
  let dbHost = 'unset'
  try { dbHost = rawUri ? new URL(rawUri).host : 'unset' } catch { dbHost = 'invalid-uri' }
  const hasDbName = /mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(rawUri) // URI includes a db name?

  try {
    const rows = await prisma.redirect.findMany({
      where: { enabled: true },
      select: { sourceUrl: true, targetUrl: true },
    })
    const map: Record<string, string> = {}
    for (const r of rows) map[r.sourceUrl] = r.targetUrl

    console.log('[redirects/map] DB OK via %s host=%s dbNameInUri=%s enabledRules=%d', usingVar, dbHost, hasDbName, rows.length) // TEMP DEBUG

    return Response.json(map, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    // Fail open with an empty map — never take the site down over redirects.
    // Do NOT cache the failure, or a transient DB blip disables every redirect
    // for the full s-maxage/SWR window even after the DB recovers.
    console.error('[redirects/map] DB QUERY FAILED via %s host=%s dbNameInUri=%s —', usingVar, dbHost, hasDbName, error) // TEMP DEBUG
    return Response.json({}, { status: 200, headers: { 'Cache-Control': 'no-store' } })
  }
}
