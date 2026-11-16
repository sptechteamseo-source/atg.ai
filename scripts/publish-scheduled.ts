// Runs the blog scheduler ONCE, then exits. For local/manual verification:
//   npm run scheduler:test
// Publishes any SCHEDULED post whose scheduledat <= now (UTC). Duplicate-safe.
// Note: does not revalidate the public cache (that only works inside Next) — the
// status flip is what this verifies; on the live site the cron route revalidates.
//
// Env MUST load before lib/prisma.ts is evaluated: ES imports are hoisted, so
// lib/prisma reads process.env at import time. We load .env.local (then .env as a
// fallback — dotenv does not override already-set vars, so .env.local wins) and
// only THEN dynamically import the app modules. Same var the app uses: MONGODB_URI.
import { config } from 'dotenv'
config({ path: '.env.local' })
config()

async function main() {
  const { publishScheduled } = await import('../lib/publish-scheduled')
  const { prisma } = await import('../lib/prisma')
  try {
    const { count } = await publishScheduled()
    console.log(`[Blog Scheduler] Done — published ${count} post(s)`)
  } catch (error) {
    console.error('[Blog Scheduler] Database error:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
