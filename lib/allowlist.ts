// Strict email allowlist — the single source of truth for which identities may
// authenticate, enforced server-side for BOTH Credentials and Microsoft Entra
// login (see lib/auth.ts). This is an ADDITIONAL gate on top of the invite-only
// policy, not a replacement: an allowed email must still be a registered/active
// (and, for Entra, tenant-member) user.
//
// Security notes:
// - Exact domain equality, never endsWith/suffix, so lookalikes like
//   `x@sptechteam.com.attacker.com` or `x@fake-sptechusa.com` are rejected.
// - Normalises (trim + lowercase) and requires exactly one `@`.
// Changing this list changes who can log in — keep scripts/allowlist-selfcheck.ts in sync.

const ALLOWED_EMAILS = new Set<string>(['suraj@clarant.ai'])
const ALLOWED_DOMAINS = ['sptechteam.com', 'sptechusa.com']

export function isEmailAllowed(raw?: string | null): boolean {
  if (!raw) return false
  const email = raw.trim().toLowerCase()
  const at = email.indexOf('@')
  // Require exactly one `@`, not leading. Rejects '', 'foo', '@x', 'a@b@c'.
  if (at <= 0 || at !== email.lastIndexOf('@')) return false
  const domain = email.slice(at + 1)
  if (!domain) return false
  if (ALLOWED_EMAILS.has(email)) return true
  return ALLOWED_DOMAINS.includes(domain) // exact match — no suffix trickery
}
