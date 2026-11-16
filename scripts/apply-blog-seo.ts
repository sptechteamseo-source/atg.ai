// One-off: set approved SEO title/description on specific blog posts.
// Blog metadata is DB-driven (blog.seotitle / blog.seodescription, read by
// generateMetadata in app/blog/[slug]/page.tsx and editable from the dashboard),
// so approved values are applied as DATA here rather than hardcoded in code.
// Idempotent — safe to re-run. Reports any slug not found instead of creating it.
//
//   npx tsx scripts/apply-blog-seo.ts
//
// Must run where the DB is reachable (prod/Vercel env or a host with Atlas
// access). Uses the same MONGODB_URI the app uses.
//
// Env MUST load before lib/prisma.ts is evaluated (see scripts/publish-scheduled.ts).
import { config } from 'dotenv'
config({ path: '.env.local' })
config()

// Approved mapping. description omitted → leave the existing description untouched.
const SEO: { slug: string; title: string; description?: string }[] = [
  {
    slug: 'how-to-search-for-information-in-a-pdf-file-fast-with-clarant',
    title: 'How to Search a PDF Quickly with Clarant AI',
    // No description supplied in the approved list.
  },
  {
    slug: 'benefits-of-using-an-ai-research-assistant',
    title: 'Benefits of Using an AI Research Assistant',
    description:
      'Learn how an AI research assistant helps find information, summarize sources, organize findings, and reduce manual research time.',
  },
  {
    slug: 'hipaa-compliant-ai-document-tools',
    title: 'HIPAA-Compliant AI Document Tools for Healthcare',
    description:
      'Learn what to look for in HIPAA-compliant AI document tools, including data protection, access controls, and secure healthcare document search.',
  },
  {
    slug: 'how-ai-reduces-sales-onboarding-time',
    title: 'How AI Reduces Sales Onboarding Time',
    description:
      'Learn how AI helps sales teams find product knowledge, access CRM insights, answer questions, and shorten sales onboarding time.',
  },
  {
    slug: 'ai-tools-for-marketing-agencies',
    title: 'AI Tools for Marketing Agencies: Key Uses and Benefits',
    description:
      'Compare key AI use cases for marketing agencies, from campaign research and content workflows to brand knowledge and client reporting.',
  },
  {
    slug: 'how-ai-helps-sales-reps-find-information-faster',
    title: 'How AI Helps Sales Reps Find Information Faster',
    description:
      'Learn how AI helps sales reps retrieve customer details, product answers, and deal history across CRM systems, emails, and documents.',
  },
  {
    slug: 'ai-document-assistant-vs-traditional-document-management',
    title: 'AI Document Assistant vs. Traditional Document Management',
    description:
      'Compare AI document assistants with traditional document management systems for search, document analysis, information retrieval, and team productivity.',
  },
]

async function main() {
  const { prisma } = await import('../lib/prisma')
  let updated = 0
  const missing: string[] = []
  try {
    for (const { slug, title, description } of SEO) {
      const existing = await prisma.blog.findUnique({ where: { slug }, select: { id: true } })
      if (!existing) {
        missing.push(slug)
        console.warn(`[blog-seo] NOT FOUND — skipped: ${slug}`)
        continue
      }
      await prisma.blog.update({
        where: { slug },
        data: { seotitle: title, ...(description ? { seodescription: description } : {}) },
      })
      updated++
      console.log(`[blog-seo] updated: ${slug}${description ? '' : ' (title only — no description supplied)'}`)
    }
    console.log(`\n[blog-seo] Done — ${updated}/${SEO.length} updated, ${missing.length} missing.`)
    if (missing.length) console.log(`[blog-seo] Missing slugs: ${missing.join(', ')}`)
  } catch (error) {
    console.error('[blog-seo] Database error:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
