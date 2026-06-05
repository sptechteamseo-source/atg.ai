import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// POST /api/upload — upload an image file, returns { success, url }
export async function POST(request: NextRequest) {
  try {
    // Must be logged in (any role can upload — authors need it for their own content)
    const session = await auth()
    if (!session?.user) {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Only allow image files
    if (!file.type.startsWith('image/')) {
      return Response.json({ success: false, error: 'Only image files allowed (jpg, png, webp, gif)' }, { status: 400 })
    }

    // Max size 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ success: false, error: 'Image must be under 5MB' }, { status: 400 })
    }

    const ext      = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // ── Vercel Blob (production + any env with BLOB_READ_WRITE_TOKEN) ──────────
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const blob    = await put(filename, file, {
        access:      'public',
        contentType: file.type,
      })
      return Response.json({ success: true, url: blob.url })
    }

    // ── Local filesystem fallback (dev without Blob token) ────────────────────
    const { writeFile, mkdir } = await import('fs/promises')
    const path                 = await import('path')
    const bytes                = await file.arrayBuffer()
    const uploadsDir           = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    await writeFile(path.join(uploadsDir, filename), Buffer.from(bytes))
    return Response.json({ success: true, url: `/uploads/${filename}` })

  } catch (error: any) {
    console.error('[POST /api/upload]', error)
    return Response.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
