import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { getClientInfo, logAuth } from '@/lib/login-security'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Admin-only Account Security: change username and/or password. Requires the
// current password for any change. (Settings → Account Security)
const securitySchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newUsername: z.string().min(2, 'Username must be at least 2 characters').optional(),
    newPassword: z.string().min(8, 'New password must be at least 8 characters').optional(),
  })
  .refine((d) => d.newUsername || d.newPassword, {
    message: 'Provide a new username or a new password',
  })

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    // Only admins may use Account Security (see task ROLE ACCESS).
    if ((session.user as any).role !== 'admin') {
      return Response.json({ success: false, error: 'Admins only' }, { status: 403 })
    }

    const parsed = securitySchema.safeParse(await request.json())
    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { currentPassword, newUsername, newPassword } = parsed.data

    const user = await prisma.users.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Entra-only accounts have no password to change here.
    if (!user.password) {
      return Response.json({ success: false, error: 'This account has no password set' }, { status: 400 })
    }

    // Verify current password before any change
    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) {
      return Response.json({ success: false, error: 'Current password is incorrect' }, { status: 400 })
    }

    const data: Record<string, any> = {}
    if (newUsername) data.name = newUsername
    if (newPassword) data.password = await bcrypt.hash(newPassword, 12)

    await prisma.users.update({ where: { id: user.id }, data })

    // Audit log
    const { ip, userAgent } = getClientInfo(request)
    if (newUsername) {
      await logAuth({ event: 'username_change', email: user.email, userId: user.id, success: true, ip, userAgent })
    }
    if (newPassword) {
      await logAuth({ event: 'password_change', email: user.email, userId: user.id, success: true, ip, userAgent })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('[PATCH /api/users/security]', error)
    return Response.json({ success: false, error: 'Failed to update account security' }, { status: 500 })
  }
}
