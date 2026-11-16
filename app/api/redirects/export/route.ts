import { NextRequest } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'

// GET /api/redirects/export?format=xlsx|csv — download all redirects
export async function GET(request: NextRequest) {
  try {
    await requirePermission('manage:redirects')

    const format = new URL(request.url).searchParams.get('format') === 'csv' ? 'csv' : 'xlsx'

    const rows = await prisma.redirect.findMany({ orderBy: { createdAt: 'desc' } })
    const aoa = rows.map((r) => ({
      'From URL': r.sourceUrl,
      'To URL': r.targetUrl,
      Status: r.enabled ? 'Active' : 'Inactive',
      'Created Date': r.createdAt.toISOString(),
    }))

    const ws = XLSX.utils.json_to_sheet(aoa, {
      header: ['From URL', 'To URL', 'Status', 'Created Date'],
    })

    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(ws)
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="redirects.csv"',
        },
      })
    }

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Redirects')
    const out: Buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    return new Response(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="redirects.xlsx"',
      },
    })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    if (error.message === 'FORBIDDEN') return Response.json({ success: false, error: 'Access denied' }, { status: 403 })
    console.error('[GET /api/redirects/export]', error)
    return Response.json({ success: false, error: 'Export failed' }, { status: 500 })
  }
}
