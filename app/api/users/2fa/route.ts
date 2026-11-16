import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import {
  generateSecret,
  qrDataURL,
  verifyTOTP,
  generateBackupCodes,
  hashBackupCodes,
  matchBackupCode,
} from '@/lib/twofactor'
import { z } from 'zod'

// 2FA is available to privileged roles only.
const ALLOWED_ROLES = ['admin', 'editor']

const bodySchema = z.object({
  action: z.enum(['setup', 'verify', 'disable']),
  token: z.string().optional(),
})

// Consume a submitted code as either a live TOTP or a one-time backup code.
// Returns true on match; removes the backup code from the DB when one is used.
async function checkCode(
  user: { id: string; twoFactorSecret: string | null; twoFactorBackupCodes: string[] },
  token: string,
): Promise<boolean> {
  if (user.twoFactorSecret && verifyTOTP(user.twoFactorSecret, token)) return true
  const idx = await matchBackupCode(user.twoFactorBackupCodes ?? [], token)
  if (idx >= 0) {
    const remaining = [...user.twoFactorBackupCodes]
    remaining.splice(idx, 1)
    await prisma.users.update({ where: { id: user.id }, data: { twoFactorBackupCodes: remaining } })
    return true
  }
  return false
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    if (!ALLOWED_ROLES.includes((session.user as any).role)) {
      return Response.json({ success: false, error: 'Two-factor authentication is available to admins and editors only' }, { status: 403 })
    }

    const parsed = bodySchema.safeParse(await request.json())
    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { action } = parsed.data
    const token = (parsed.data.token ?? '').trim()

    const user = await prisma.users.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // ── Begin setup: create a secret + QR, but don't enable until verified ──
    if (action === 'setup') {
      if (user.twoFactorEnabled) {
        return Response.json({ success: false, error: '2FA is already enabled' }, { status: 400 })
      }
      const { base32, otpauthUrl } = generateSecret(user.email)
      await prisma.users.update({ where: { id: user.id }, data: { twoFactorSecret: base32 } })
      const qr = await qrDataURL(otpauthUrl)
      return Response.json({ success: true, data: { qr, secret: base32 } })
    }

    // ── Verify the first code → enable 2FA and issue backup codes ──
    if (action === 'verify') {
      if (!user.twoFactorSecret) {
        return Response.json({ success: false, error: 'Start 2FA setup first' }, { status: 400 })
      }
      if (!token || !verifyTOTP(user.twoFactorSecret, token)) {
        return Response.json({ success: false, error: 'Invalid authentication code' }, { status: 400 })
      }
      const backupCodes = generateBackupCodes(10)
      await prisma.users.update({
        where: { id: user.id },
        data: { twoFactorEnabled: true, twoFactorBackupCodes: await hashBackupCodes(backupCodes) },
      })
      // Plaintext codes are returned once here and never stored in the clear.
      return Response.json({ success: true, data: { backupCodes } })
    }

    // ── Disable: require a current TOTP or backup code ──
    if (action === 'disable') {
      if (!user.twoFactorEnabled) {
        return Response.json({ success: false, error: '2FA is not enabled' }, { status: 400 })
      }
      if (!token || !(await checkCode(user, token))) {
        return Response.json({ success: false, error: 'Invalid authentication code' }, { status: 400 })
      }
      await prisma.users.update({
        where: { id: user.id },
        data: { twoFactorEnabled: false, twoFactorSecret: null, twoFactorBackupCodes: [] },
      })
      return Response.json({ success: true })
    }

    return Response.json({ success: false, error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('[POST /api/users/2fa]', error)
    return Response.json({ success: false, error: 'Two-factor request failed' }, { status: 500 })
  }
}
