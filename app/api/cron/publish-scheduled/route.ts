import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { publishScheduled } from '@/lib/publish-scheduled'

// Server-side scheduler endpoint. A scheduler (Vercel Cron via vercel.json, or an
// Azure WebJob — see azure-webjob/) must hit this every minute; it does NOT run on
// its own just because the app is deployed. Never runs on the client.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // When CRON_SECRET is set we require `Authorization: Bearer $CRON_SECRET`, so the
  // endpoint can't be triggered by the public. Vercel Cron and the Azure WebJob both
  // send this header.
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { count, slugs } = await publishScheduled()

    // Refresh the public list + each new post so they appear immediately instead of
    // waiting for the ISR window. Only meaningful inside the Next runtime.
    if (count > 0) {
      revalidatePath('/blog')
      for (const slug of slugs) revalidatePath(`/blog/${slug}`)
    }

    return Response.json({ success: true, published: count })
  } catch (error) {
    console.error('[Blog Scheduler] Database error:', error)
    return Response.json({ success: false, error: 'Scheduler run failed' }, { status: 500 })
  }
}
