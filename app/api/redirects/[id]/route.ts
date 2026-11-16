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

// All fields optional — the same endpoint handles a full edit and the
// enable/disable toggle (which sends only { enabled }).
const updateSchema = z.object({
  sourceUrl: z.string().min(1).optional(),
  targetUrl: z.string().min(1).optional(),
  enabled: z.boolean().optional(),
})

// PUT /api/redirects/:id — edit or toggle
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('manage:redirects')
    const { id } = await params

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const current = await prisma.redirect.findUnique({ where: { id } })
    if (!current) return Response.json({ success: false, error: 'Redirect not found' }, { status: 404 })

    const data: { sourceUrl?: string; targetUrl?: string; enabled?: boolean } = {}
    if (parsed.data.enabled !== undefined) data.enabled = parsed.data.enabled

    // Only re-validate URLs when they actually change (toggle skips this).
    if (parsed.data.sourceUrl !== undefined || parsed.data.targetUrl !== undefined) {
      const sourceUrl = normalizeSource(parsed.data.sourceUrl ?? current.sourceUrl)
      const targetUrl = normalizeTarget(parsed.data.targetUrl ?? current.targetUrl)

      const invalid = validateRedirect(sourceUrl, targetUrl)
      if (invalid) return Response.json({ success: false, error: invalid }, { status: 400 })

      if (sourceUrl !== current.sourceUrl) {
        const dupe = await prisma.redirect.findUnique({ where: { sourceUrl } })
        if (dupe) return Response.json({ success: false, error: 'A redirect for this From URL already exists' }, { status: 409 })
      }

      const others = await prisma.redirect.findMany({
        where: { id: { not: id } },
        select: { sourceUrl: true, targetUrl: true },
      })
      const map = new Map(others.map((r) => [r.sourceUrl, r.targetUrl]))
      if (createsLoop(sourceUrl, targetUrl, map)) {
        return Response.json({ success: false, error: 'This redirect would create a loop' }, { status: 400 })
      }

      data.sourceUrl = sourceUrl
      data.targetUrl = targetUrl
    }

    const redirect = await prisma.redirect.update({ where: { id }, data })
    return Response.json({ success: true, data: redirect })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    if (error.message === 'FORBIDDEN') return Response.json({ success: false, error: 'Access denied' }, { status: 403 })
    console.error('[PUT /api/redirects/:id]', error)
    return Response.json({ success: false, error: 'Failed to update redirect' }, { status: 500 })
  }
}

// DELETE /api/redirects/:id
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('manage:redirects')
    const { id } = await params
    await prisma.redirect.delete({ where: { id } })
    return Response.json({ success: true, data: { deleted: true } })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    if (error.message === 'FORBIDDEN') return Response.json({ success: false, error: 'Access denied' }, { status: 403 })
    console.error('[DELETE /api/redirects/:id]', error)
    return Response.json({ success: false, error: 'Failed to delete redirect' }, { status: 500 })
  }
}
