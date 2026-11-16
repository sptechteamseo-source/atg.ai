import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import {
  getClientInfo,
  isIpRateLimited,
  logAuth,
  lockAfterFailure,
  LockedError,
  RateLimitError,
  TwoFactorRequiredError,
  TwoFactorInvalidError,
} from '@/lib/login-security'
import { verifyTOTP, matchBackupCode } from '@/lib/twofactor'
import { entraSignInGate } from '@/lib/entra'
import { isEmailAllowed } from '@/lib/allowlist'

// Host trust for self-hosting on Azure App Service. Auth.js v5 only auto-trusts
// the host on Vercel (VERCEL) or when AUTH_URL/AUTH_TRUST_HOST is set; on Azure
// (NODE_ENV=production, no VERCEL) trustHost stays false and the OAuth callback
// URL can't be built. Pinning AUTH_URL to the canonical public origin (already
// hardcoded in middleware.ts — not a secret) both enables trustHost AND builds
// the callback from this known host instead of an attacker-supplied
// X-Forwarded-Host header, so we trust only the expected production host. An
// explicitly-set AUTH_URL (local .env.local = http://localhost:3000, or a real
// Azure/Vercel value) always wins.
// ponytail: single known host; if the app ever serves multiple domains, replace
// with a per-request allowlist check.
process.env.AUTH_URL ||= 'https://clarant.ai'

// Fail-fast startup diagnostic for Microsoft Entra. Auth.js reads the client id /
// secret / issuer straight from these env vars; if any is absent on Azure the
// authorize redirect goes out with client_id=undefined and Microsoft returns the
// cryptic "Application with identifier 'undefined' was not found" error. Surface
// the real cause as a named line at boot (visible in Azure Log Stream) instead.
// Presence only — values are never logged. Deliberately does NOT throw: a missing
// SSO var must not take down the public site or email/password login, and a hard
// throw at import would also break the Azure build (app settings aren't present
// at `next build` time).
// ponytail: log-only; wrap in a conditional provider if you want the Microsoft
// button itself to fail cleanly when these are unset.
const missingEntraEnv = [
  'AUTH_MICROSOFT_ENTRA_ID_ID',
  'AUTH_MICROSOFT_ENTRA_ID_SECRET',
  'AUTH_MICROSOFT_ENTRA_ID_ISSUER',
].filter((k) => !process.env[k])
if (missingEntraEnv.length) {
  console.error(
    `[auth] Microsoft Entra sign-in will fail — missing env var(s): ${missingEntraEnv.join(', ')}. ` +
      'Set them in Azure App Service → Environment variables, then restart.',
  )
}

// ponytail: TEMPORARY runtime diagnostic for the "client_id=undefined" (AADSTS700016)
// production issue — delete once the Azure env vars are confirmed. Server-side only
// (this module never reaches the browser). Logs PRESENCE + LENGTH, never any value;
// for the secret only presence is logged. Reveals in Azure Log Stream whether the
// production runtime is actually receiving AUTH_MICROSOFT_ENTRA_ID_ID.
const entraId = process.env.AUTH_MICROSOFT_ENTRA_ID_ID
console.info(
  `[auth][diag] AUTH_MICROSOFT_ENTRA_ID_ID present=${!!entraId} length=${entraId?.length ?? 0} | ` +
    `AUTH_MICROSOFT_ENTRA_ID_SECRET present=${!!process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET} | ` +
    `AUTH_MICROSOFT_ENTRA_ID_ISSUER present=${!!process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER} | ` +
    `MICROSOFT_TENANT_ID present=${!!process.env.MICROSOFT_TENANT_ID}`,
)

// Validate login form inputs. `token` is the optional 2FA code (TOTP or backup).
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  token: z.string().optional(),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token: { label: '2FA code', type: 'text' },
      },

      // This is the single authoritative auth gate — brute-force lockout and
      // per-IP rate limiting live here so they apply no matter how login is
      // reached (server action or a direct POST to the NextAuth endpoint).
      async authorize(credentials, request) {
        // Validate inputs
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const { ip, userAgent } = getClientInfo(request)

        // Per-IP rate limit (before touching the DB user row)
        if (await isIpRateLimited(ip)) {
          await logAuth({ event: 'login', email, ip, userAgent, success: false, reason: 'rate_limited' })
          throw new RateLimitError()
        }

        // Email allowlist — blocks unauthorised addresses even if they have a DB
        // account, before any user lookup. Server-side; applies to every login.
        if (!isEmailAllowed(email)) {
          await logAuth({ event: 'login', email, ip, userAgent, success: false, reason: 'not_allowed' })
          return null
        }

        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) {
          await logAuth({ event: 'login', email, ip, userAgent, success: false, reason: 'no_user' })
          return null
        }

        // Account locked from prior failed attempts
        if (user.lockUntil && user.lockUntil > new Date()) {
          await logAuth({ event: 'login', email, userId: user.id, ip, userAgent, success: false, reason: 'locked' })
          throw new LockedError()
        }

        // Blocked accounts can't sign in
        if (user.status && user.status !== 'active') {
          await logAuth({ event: 'login', email, userId: user.id, ip, userAgent, success: false, reason: 'inactive' })
          return null
        }

        // Entra-only accounts have no password — they can't sign in with credentials.
        if (!user.password) {
          await logAuth({ event: 'login', email, userId: user.id, ip, userAgent, success: false, reason: 'no_password' })
          return null
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          const { failedLoginAttempts, lockUntil } = lockAfterFailure(user.failedLoginAttempts ?? 0)
          await prisma.users.update({
            where: { id: user.id },
            data: { failedLoginAttempts, lastFailedLogin: new Date(), lockUntil },
          })
          await logAuth({
            event: 'login', email, userId: user.id, ip, userAgent,
            success: false, reason: lockUntil ? 'locked' : 'bad_password',
          })
          if (lockUntil) throw new LockedError()
          return null
        }

        // Password is correct. If 2FA is on, require a valid TOTP or backup code
        // before completing the login (does not affect the password lockout counter).
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          const token = (parsed.data.token ?? '').trim()
          if (!token) {
            await logAuth({ event: 'login', email, userId: user.id, ip, userAgent, success: false, reason: '2fa_required' })
            throw new TwoFactorRequiredError()
          }
          let ok = verifyTOTP(user.twoFactorSecret, token)
          if (!ok) {
            // Fall back to a one-time backup code; consume it on match.
            const idx = await matchBackupCode(user.twoFactorBackupCodes ?? [], token)
            if (idx >= 0) {
              ok = true
              const remaining = [...user.twoFactorBackupCodes]
              remaining.splice(idx, 1)
              await prisma.users.update({ where: { id: user.id }, data: { twoFactorBackupCodes: remaining } })
            }
          }
          if (!ok) {
            await logAuth({ event: 'login', email, userId: user.id, ip, userAgent, success: false, reason: '2fa_invalid' })
            throw new TwoFactorInvalidError()
          }
        }

        // Success — clear any failure state
        if (user.failedLoginAttempts || user.lockUntil) {
          await prisma.users.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lastFailedLogin: null, lockUntil: null },
          })
        }
        await logAuth({ event: 'login', email, userId: user.id, ip, userAgent, success: true, reason: 'ok' })

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      },
    }),

    // Microsoft Entra ID (Azure AD) — single-tenant via the tenant-specific
    // issuer. Only authorised employees can sign in; the real access gate is the
    // signIn callback below (tenant check + invite-only link), backed by the
    // Enterprise Application user/group assignment configured in Azure.
    MicrosoftEntraID({
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      // Keep the JWT small and avoid the extra Graph photo fetch: map claims
      // directly instead of pulling the base64-encoded profile photo.
      profile(profile) {
        return {
          id: profile.oid,
          name: profile.name,
          email: profile.email ?? profile.preferred_username,
          image: null,
          // Placeholder only — the real role is resolved from the DB in the jwt
          // callback. Never trust a role from the token.
          role: 'author' as const,
        }
      },
    }),
  ],

  // Use JWT for sessions (no database session table needed)
  session: { strategy: 'jwt' },

  callbacks: {
    // Authorisation gate for OAuth sign-ins (Credentials is fully gated in
    // authorize() above, so it's waved through here). Returning false denies the
    // sign-in and sends the user to /login?error=…
    async signIn({ account, profile }) {
      if (account?.provider !== 'microsoft-entra-id') return true

      const p = profile as any

      // Stateless gate: tenant match (rejects personal / other-org accounts),
      // members-only (rejects guests), stable oid present. See lib/entra.ts.
      if (entraSignInGate(p, process.env.MICROSOFT_TENANT_ID) !== 'ok') return false
      const oid: string = p.oid // guaranteed by the gate above

      // Email allowlist, from the Microsoft-signed token (never browser-supplied).
      // Runs before the linked/invite-only lookups so a previously-linked user on
      // an unauthorised domain is blocked on every sign-in. `xms_edov === false`
      // means Microsoft flagged the email as unverified → reject.
      if (p.xms_edov === false) return false
      const tokenEmail = (p.email ?? p.preferred_username ?? p.upn ?? '').trim().toLowerCase()
      if (!isEmailAllowed(tokenEmail)) return false

      // Invite-only lookups — fail CLOSED on any DB error so a database outage
      // denies login cleanly instead of throwing and 500-ing the OAuth callback.
      try {
        // Already linked to a DB user — allow only if still active.
        const linked = await prisma.users.findUnique({ where: { microsoftId: oid } })
        if (linked) return !linked.status || linked.status === 'active'

        // Invite-only (policy A): no auto-provision. Link to a pre-existing active
        // user matched by email (case-insensitive); otherwise deny.
        const email = (p.email ?? p.preferred_username ?? '').toLowerCase()
        if (!email) return false
        const existing = await prisma.users.findFirst({
          where: { email: { equals: email, mode: 'insensitive' } },
        })
        if (!existing) return false
        if (existing.status && existing.status !== 'active') return false

        // Invited employee: link the stable oid + tenant to the existing user so
        // future sign-ins match on microsoftId, then allow.
        await prisma.users.update({
          where: { id: existing.id },
          data: { microsoftId: oid, tenantId: p.tid },
        })
        return true
      } catch (e) {
        // Never leak the DB error to the user as a 500 — deny instead. No PII.
        console.error('[entra] user lookup failed, denying login:', (e as Error).name)
        return false
      }
    },

    // Put role into the JWT token + self-heal stale tokens
    async jwt({ token, user, account, profile }) {
      // First sign-in: copy user fields onto the token
      if (user) {
        // Entra: the OAuth `user.id` is the Microsoft oid, not our DB id. Resolve
        // our user (guaranteed linked/active by the signIn callback above) and use
        // its cuid so all downstream role/status checks work unchanged.
        if (account?.provider === 'microsoft-entra-id') {
          const oid = (profile as any)?.oid
          const dbUser = oid
            ? await prisma.users.findUnique({
                where: { microsoftId: oid },
                select: { id: true, role: true },
              })
            : null
          if (!dbUser) return {} // safety net — should never happen after signIn
          token.id = dbUser.id
          token.role = String(dbUser.role || '').toLowerCase()
          return token
        }

        token.id = user.id as string
        token.role = String((user as any).role || '').toLowerCase()
        return token
      }

      // Subsequent requests: re-validate the user still exists in DB.
      // Wrapped in try/catch so a DB outage never crashes the session —
      // if the query fails we keep the existing token rather than signing everyone out.
      if (token.id) {
        try {
          const dbUser = await prisma.users.findUnique({
            where: { id: token.id as string },
            select: { id: true, role: true, status: true },
          })

          // User deleted or deactivated — invalidate the JWT.
          if (!dbUser) return {}
          if (dbUser.status && dbUser.status !== 'active') return {}

          // Refresh role from DB and normalise to lowercase.
          token.role = String(dbUser.role || '').toLowerCase()
        } catch {
          // DB unreachable — keep existing token data so the session survives.
        }
      }

      return token
    },

    // Put role into the session so client can read it
    async session({ session, token }) {
      if (token && token.id) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = String(token.role || '').toLowerCase()
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
})
