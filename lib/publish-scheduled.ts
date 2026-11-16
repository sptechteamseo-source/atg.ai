import { prisma } from './prisma'

// Database name from the active connection string — logged (never the credentials)
// so you can confirm the scheduler and the Next.js app hit the SAME database. The db
// name is the path segment after the host: mongodb+srv://user:pass@host/<dbname>?...
function activeDbName(): string {
  const uri = process.env.MONGODB_URI ?? process.env.DATABASE_URL ?? ''
  const m = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/)
  return m?.[1] ? decodeURIComponent(m[1]) : '(none — empty database name!)'
}

// Core scheduler step, shared by the cron route and the `scheduler:test` script.
// Finds SCHEDULED posts whose time has arrived (UTC) and flips them to PUBLISHED.
//
// Duplicate-safe: the `status: scheduled` filter on updateMany means a row that is
// already PUBLISHED no longer matches, so a second/concurrent run publishes it zero
// more times. updateMany is atomic — nothing is ever half-published.
//
// Returns the published slugs so the HTTP caller can revalidate their cache
// (revalidatePath only works inside the Next runtime, not from a CLI script).
export async function publishScheduled(now = new Date()) {
  console.log('[Blog Scheduler] Started')
  console.log(`[Blog Scheduler] Current UTC time: ${now.toISOString()}`)
  console.log(`[Blog Scheduler] Database: ${activeDbName()}`)

  // "Live" (not trashed). updateMany is NOT wrapped by the soft-delete extension in
  // lib/prisma.ts, and `{ deletedat: null }` misses docs that omit the field on
  // MongoDB — so spell the guard out the same way lib/prisma.ts does.
  const live = { OR: [{ deletedat: null }, { deletedat: { isSet: false } }] }
  const due = {
    AND: [{ status: 'scheduled' as const }, { scheduledat: { lte: now } }, live],
  }

  const rows = await prisma.blog.findMany({ where: due, select: { slug: true, title: true } })
  console.log(`[Blog Scheduler] Scheduled blogs found: ${rows.length}`)

  if (rows.length === 0) {
    console.log('[Blog Scheduler] No blogs ready for publishing')
    console.log('[Blog Scheduler] Finished')
    return { count: 0, slugs: [] as string[], failed: [] as string[] }
  }

  for (const r of rows) console.log(`[Blog Scheduler] Publishing blog: ${r.title}`)

  // Flip status → published, stamp publishedat, and clear scheduledat so a published
  // post no longer carries a schedule time (matches the manual-publish path in
  // app/api/blogs/[id]/route.ts). scheduledat is nullable in the schema.
  const { count } = await prisma.blog.updateMany({
    where: due,
    data: { status: 'published', publishedat: now, scheduledat: null },
  })

  // Verification (item 8) — DO NOT trust the updateMany count alone. Re-read each row
  // by its unique slug (findUnique bypasses the soft-delete filter) and confirm the
  // persisted status. A row still 'scheduled' means the write did not land where we
  // read — most often the scheduler and the app are pointed at different databases.
  const published: string[] = []
  const failed: string[] = []
  for (const r of rows) {
    const row = await prisma.blog.findUnique({
      where: { slug: r.slug },
      select: { slug: true, status: true, scheduledat: true, publishedat: true },
    })
    console.log(
      `[Blog Scheduler] Verification: slug=${row?.slug} status=${row?.status} ` +
      `scheduledat=${row?.scheduledat?.toISOString() ?? 'null'} ` +
      `publishedat=${row?.publishedat?.toISOString() ?? 'null'}`
    )
    if (row?.status === 'published') published.push(r.slug)
    else failed.push(r.slug)
  }

  if (failed.length > 0) {
    console.error(
      `[Blog Scheduler] FAILED — ${failed.length} post(s) still not 'published' after update: ` +
      `${failed.join(', ')}. Check that the scheduler and the app use the SAME database ` +
      `(logged above).`
    )
  }
  console.log(`[Blog Scheduler] Published successfully: ${published.length} (matched ${count})`)
  console.log('[Blog Scheduler] Finished')
  return { count: published.length, slugs: published, failed }
}
