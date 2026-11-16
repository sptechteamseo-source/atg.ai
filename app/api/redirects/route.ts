import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'
import {
  normalizeSource,
  normalizeTarget,
  validateRedirect,
  createsLoop,
} from '@/lib/redirects'

const schema = z.object({
  sourceUrl: z.string().min(1),
  targetUrl: z.string().min(1),
  enabled: z.boolean().optional(),
})

// GET /api/redirects?q=&page=&pageSize= — list with search + pagination
export async function GET(request: NextRequest) {
  try {
    await requirePermission('manage:redirects')

    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') ?? '').trim()
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || 20))

    // Search matches source OR target (case-insensitive).
    const where = q
      ? {
          OR: [
            { sourceUrl: { contains: q, mode: 'insensitive' as const } },
            { targetUrl: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [total, data] = await Promise.all([
      prisma.redirect.count({ where }),
      prisma.redirect.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return Response.json({ success: true, data, total, page, pageSize })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    if (error.message === 'FORBIDDEN') return Response.json({ success: false, error: 'Access denied' }, { status: 403 })
    console.error('[GET /api/redirects]', error)
    return Response.json({ success: false, error: 'Failed to fetch redirects' }, { status: 500 })
  }
}

// POST /api/redirects — create one redirect
export async function POST(request: NextRequest) {
  try {
    await requirePermission('manage:redirects')

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const sourceUrl = normalizeSource(parsed.data.sourceUrl)
    const targetUrl = normalizeTarget(parsed.data.targetUrl)

    const invalid = validateRedirect(sourceUrl, targetUrl)
    if (invalid) return Response.json({ success: false, error: invalid }, { status: 400 })

    // Duplicate source?
    const existing = await prisma.redirect.findUnique({ where: { sourceUrl } })
    if (existing) {
      return Response.json({ success: false, error: 'A redirect for this From URL already exists' }, { status: 409 })
    }

    // Loop check against all other rules (source->target map).
    const all = await prisma.redirect.findMany({ select: { sourceUrl: true, targetUrl: true } })
    const map = new Map(all.map((r) => [r.sourceUrl, r.targetUrl]))
    if (createsLoop(sourceUrl, targetUrl, map)) {
      return Response.json({ success: false, error: 'This redirect would create a loop' }, { status: 400 })
    }

    const redirect = await prisma.redirect.create({
      data: { sourceUrl, targetUrl, enabled: parsed.data.enabled ?? true },
    })

    return Response.json({ success: true, data: redirect }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    if (error.message === 'FORBIDDEN') return Response.json({ success: false, error: 'Access denied' }, { status: 403 })
    console.error('[POST /api/redirects]', error)
    return Response.json({ success: false, error: 'Failed to create redirect' }, { status: 500 })
  }
}
