import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { toRenderableHtml } from '@/lib/content-html'
import { z } from 'zod'

const blogSchema = z.object({
  title:          z.string().min(1, 'Title is required'),
  slug:           z.string().min(1, 'Slug is required'),
  excerpt:        z.string().optional(),
  content:        z.string().min(1, 'Content is required'),
  authorname:     z.string().min(1, 'Author name is required'),
  coverimage:     z.string().nullable().optional(),
  ogimage:        z.string().nullable().optional(),
  imagealt:       z.string().min(1, 'Image alt tag is required'),
  seotitle:       z.string().optional(),
  seodescription: z.string().optional(),
  schemamarkup:   z.string().optional(),
  faq:            z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  tag:            z.string().optional(),
  status:         z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  // ISO-8601 UTC instant when a scheduled post should auto-publish.
  scheduledat:    z.string().datetime().nullable().optional(),
  readmin:        z.number().min(1).default(5),
  categoryid:     z.string().optional(),
})

// GET /api/blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status  = searchParams.get('status')
    const tag     = searchParams.get('tag')
    const trashed = searchParams.get('trashed') === 'true'

    const blogs = await prisma.blog.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(tag    ? { tag }                   : {}),
        // Trash view shows only soft-deleted rows; default view excludes them
        // automatically via the Prisma soft-delete extension.
        ...(trashed ? { deletedat: { not: null } } : {}),
      },
      include: {
        author:   { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdat: 'desc' },
    })

    return Response.json({ success: true, data: blogs })
  } catch (error) {
    console.error('[GET /api/blogs]', error)
    return Response.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

// POST /api/blogs — create blog (admin or editor)
export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission('manage:blogs')

    const body   = await request.json()
    const parsed = blogSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const d = parsed.data

    // Scheduling guard — a scheduled post needs a future timestamp.
    if (d.status === 'scheduled') {
      if (!d.scheduledat) {
        return Response.json({ success: false, error: 'A schedule date and time is required.' }, { status: 400 })
      }
      if (new Date(d.scheduledat) <= new Date()) {
        return Response.json({ success: false, error: 'Please select a future date and time.' }, { status: 400 })
      }
    }

    const publishedat = d.status === 'published' ? new Date() : undefined
    const scheduledat = d.status === 'scheduled' ? new Date(d.scheduledat!) : undefined

    const blog = await prisma.blog.create({
      data: {
        // ── Scalar fields ──────────────────────────────────────
        title:          d.title,
        slug:           d.slug,
        excerpt:        d.excerpt        || undefined,
        content:        toRenderableHtml(d.content),
        authorname:     d.authorname,
        coverimage:     d.coverimage     || undefined,
        ogimage:        d.ogimage        || undefined,
        imagealt:       d.imagealt,
        seotitle:       d.seotitle       || undefined,
        seodescription: d.seodescription || undefined,
        schemamarkup:   d.schemamarkup   || undefined,
        tag:            d.tag            || undefined,
        status:         d.status,
        readmin:        d.readmin,
        publishedat,
        scheduledat,

        // ── JSON field — only set when non-empty ───────────────
        ...(d.faq && d.faq.length > 0 ? { faq: d.faq } : {}),

        // ── Relations — use connect syntax (required by Prisma v7 PrismaPg) ──
        author: {
          connect: { id: session.user.id },
        },
        ...(d.categoryid
          ? { category: { connect: { id: d.categoryid } } }
          : {}
        ),
      },
      include: {
        author:   { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })

    return Response.json({ success: true, data: blog }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/blogs]', error)
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    if (error.message === 'FORBIDDEN') {
      return Response.json({ success: false, error: 'Not allowed' }, { status: 403 })
    }
    return Response.json(
      { success: false, error: error?.message || 'Failed to create blog' },
      { status: 500 }
    )
  }
}
