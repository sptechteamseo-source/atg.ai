import { PrismaClient } from '@prisma/client'

/**
 * MongoDB connection URL resolution order:
 *
 * 1. MONGODB_URI  — the standard env var name used by Vercel's MongoDB
 *                   integration and Atlas add-ons.  Always prefer this in
 *                   production / Vercel deployments.
 * 2. DATABASE_URL — Prisma's conventional env var; used by the Prisma CLI
 *                   (prisma generate, db push, studio) and as a local-dev
 *                   fallback when MONGODB_URI is not set.
 *
 * The datasources override below means the value of process.env.MONGODB_URI
 * (or DATABASE_URL) is evaluated at *runtime*, so the Vercel environment
 * variable automatically takes effect without any code changes.
 *
 * Do NOT hardcode credentials here — always set them in your .env.local
 * (local dev) or Vercel environment variables (production).
 */
// Soft-delete filter: every blog *listing/count* read excludes trashed rows
// unless the caller explicitly asks about deletedat — so the Trash page can pass
// `deletedat: { not: null }` to see only trashed rows. Reads by unique id
// (findUnique/update/delete) are intentionally NOT filtered, so restore &
// permanent-delete can still find a trashed blog.
//
// "Live" = deletedat is null OR the field is missing. On MongoDB existing and
// newly-created docs simply omit the field, and `{ deletedat: null }` does NOT
// match a missing field (verified) — filtering on null alone would hide every
// pre-existing blog. `isSet: false` catches missing; `null` catches restored
// rows (restore writes deletedat: null). So no data backfill is ever needed.
// Wrapped in AND so a caller's own where (including any OR) is never clobbered.
const LIVE = { OR: [{ deletedat: null }, { deletedat: { isSet: false } }] }

function excludeTrashed({ args, query }: { args: any; query: (a: any) => any }) {
  const where = args.where ?? {}
  if (where.deletedat === undefined) {
    args.where = { AND: [where, LIVE] }
  }
  return query(args)
}

function createPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.MONGODB_URI ?? process.env.DATABASE_URL,
      },
    },
    log: ['error'],
  }).$extends({
    query: {
      blog: {
        findMany:  excludeTrashed,
        findFirst: excludeTrashed,
        count:     excludeTrashed,
        aggregate: excludeTrashed,
      },
    },
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient>
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
