// Read-only: print the real DB state of scheduled/recent blogs. No writes.
// Run: npx tsx scripts/blog-state.ts
import { config } from 'dotenv'
config({ path: '.env.local' })
config()

async function main() {
  const { prisma } = await import('../lib/prisma')
  try {
    const rows = await prisma.blog.findMany({
      where: { OR: [{ status: 'scheduled' }, { status: 'published' }] },
      orderBy: { updatedat: 'desc' },
      take: 10,
      select: { title: true, slug: true, status: true, scheduledat: true, publishedat: true, updatedat: true },
    })
    console.log(`now(UTC) = ${new Date().toISOString()}`)
    for (const r of rows) {
      console.log(
        `- [${r.status}] ${r.slug} | sched=${r.scheduledat?.toISOString() ?? 'null'} ` +
        `| pub=${r.publishedat?.toISOString() ?? 'null'} | upd=${r.updatedat.toISOString()}`
      )
    }
  } catch (e) {
    console.error('DB error:', (e as Error).message)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}
main()
