// Brute-force + IP protection for credential login. All authoritative logic
// lives in lib/auth.ts#authorize (runs regardless of entry point); this file
// holds the shared constants, the audit writer, the per-IP rate-limit check,
// and the typed errors whose `code` NextAuth surfaces to the login action.
import { prisma } from '@/lib/prisma'
import { CredentialsSignin } from 'next-auth'

export const MAX_ATTEMPTS = 3 // lock the account on the 3rd consecutive failure
export const LOCK_MS = 24 * 60 * 60 * 1000 // 24 hours
export const IP_WINDOW_MS = 60 * 60 * 1000 // 1 hour
export const IP_MAX = 10 // max login attempts per IP per window

// Thrown from authorize; NextAuth puts `code` on the /login?error=... URL,
// which app/actions/auth.ts maps back to a user-facing message.
export class LockedError extends CredentialsSignin {
  code = 'locked'
}
export class RateLimitError extends CredentialsSignin {
  code = 'rate_limited'
}
// Password was correct but the account has 2FA on and no/invalid code was given.
export class TwoFactorRequiredError extends CredentialsSignin {
  code = '2fa_required'
}
export class TwoFactorInvalidError extends CredentialsSignin {
  code = '2fa_invalid'
}

export function messageForCode(code: string | null | undefined): string {
  switch (code) {
    case 'locked':
      return 'Your account has been temporarily locked due to multiple failed login attempts. Please try again after 24 hours or contact an administrator.'
    case 'rate_limited':
      return 'Too many login attempts from your network. Please try again later.' // 429
    case '2fa_invalid':
      return 'Invalid authentication code. Please try again.'
    case '2fa_required':
      return 'Enter the 6-digit code from your authenticator app.'
    default:
      return 'Invalid email or password'
  }
}

// Pure: given the count of prior consecutive failures, compute the new counter
// and whether the account should now be locked. Extracted so it's unit-testable.
export function lockAfterFailure(priorAttempts: number): {
  failedLoginAttempts: number
  lockUntil: Date | null
} {
  const failedLoginAttempts = priorAttempts + 1
  const lockUntil =
    failedLoginAttempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MS) : null
  return { failedLoginAttempts, lockUntil }
}

export function getClientInfo(request?: Request): {
  ip: string
  userAgent: string
} {
  const h = request?.headers
  const ip =
    h?.get('x-forwarded-for')?.split(',')[0].trim() ||
    h?.get('x-real-ip') ||
    'unknown'
  const userAgent = h?.get('user-agent') || 'unknown'
  return { ip, userAgent }
}

// True when this IP has already hit IP_MAX login attempts in the last window.
// Unknown IPs are never blocked (can't attribute the traffic).
// ponytail: DB count per attempt — fine at login volume; move to a counter/Redis if it isn't.
export async function isIpRateLimited(ip: string): Promise<boolean> {
  if (ip === 'unknown') return false
  const since = new Date(Date.now() - IP_WINDOW_MS)
  const count = await prisma.authlog.count({
    where: { ip, event: 'login', createdat: { gt: since } },
  })
  return count >= IP_MAX
}

// Best-effort audit write — never let a logging failure break auth.
export async function logAuth(entry: {
  event: 'login' | 'password_change' | 'username_change'
  email?: string | null
  userId?: string | null
  success: boolean
  reason?: string
  ip?: string
  userAgent?: string
}): Promise<void> {
  try {
    await prisma.authlog.create({ data: entry })
  } catch (err) {
    console.error('[logAuth]', err)
  }
}
