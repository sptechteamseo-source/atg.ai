import { NextRequest } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import {
  normalizeSource,
  normalizeTarget,
  validateRedirect,
  createsLoop,
} from '@/lib/redirects'

// Pull "From URL"/"To URL" from a row regardless of header casing/aliases.
function pick(row: Record<string, any>, keys: string[]): string {
  for (const k of Object.keys(row)) {
    if (keys.includes(k.trim().toLowerCase())) return String(row[k] ?? '')
  }
  return ''
}

const FROM_KEYS = ['from url', 'from', 'source', 'source url', 'sourceurl']
const TO_KEYS = ['to url', 'to', 'target', 'target url', 'targeturl', 'destination']

// POST /api/redirects/import — multipart file (.xlsx/.xls/.csv)
export async function POST(request: NextRequest) {
  try {
    await requirePermission('manage:redirects')

    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return Response.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    const buf = Buffer.from(await file.arrayBuffer())
    let rows: Record<string, any>[]
    try {
      const wb = XLSX.read(buf, { type: 'buffer' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' })
    } catch {
      return Response.json({ success: false, error: 'Could not parse file — expected .xlsx, .xls or .csv' }, { status: 400 })
    }

    // Loop/dupe checks run against existing rules + everything accepted so far.
    const existing = await prisma.redirect.findMany({ select: { sourceUrl: true, targetUrl: true } })
    const map = new Map(existing.map((r) => [r.sourceUrl, r.targetUrl]))
    const seenSources = new Set(map.keys())

    const toCreate: { sourceUrl: string; targetUrl: string; enabled: boolean }[] = []
    const errors: string[] = []
    let skipped = 0
    let failed = 0

    rows.forEach((row, i) => {
      const lineNo = i + 2 // +1 header, +1 for 1-based
      const source = normalizeSource(pick(row, FROM_KEYS))
      const target = normalizeTarget(pick(row, TO_KEYS))

      if (!source && !target) return // blank line — ignore silently

      const invalid = validateRedirect(source, target)
      if (invalid) { failed++; errors.push(`Row ${lineNo}: ${invalid}`); return }

      if (seenSources.has(source)) { skipped++; return } // duplicate source

      if (createsLoop(source, target, map)) { skipped++; errors.push(`Row ${lineNo}: skipped — would create a loop`); return }

      toCreate.push({ sourceUrl: source, targetUrl: target, enabled: true })
      seenSources.add(source)
      map.set(source, target)
    })

    if (toCreate.length) {
      await prisma.redirect.createMany({ data: toCreate })
    }

    return Response.json({
      success: true,
      imported: toCreate.length,
      skipped,
      failed,
      errors: errors.slice(0, 50), // cap the payload; summary counts are exact
    })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    if (error.message === 'FORBIDDEN') return Response.json({ success: false, error: 'Access denied' }, { status: 403 })
    console.error('[POST /api/redirects/import]', error)
    return Response.json({ success: false, error: 'Import failed' }, { status: 500 })
  }
}
