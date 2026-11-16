// Pure (stateless) half of the Microsoft Entra ID sign-in gate. The DB lookup /
// invite-only linking lives in lib/auth.ts#signIn; this covers the checks that
// don't need the database so they can be unit-tested in isolation.
//
// Security gate — do not loosen without updating scripts/entra-selfcheck.ts.

export type EntraGate = 'ok' | 'wrong_tenant' | 'guest' | 'no_oid'

// Shape we care about from the raw Entra ID (OIDC) profile claims.
export interface EntraClaims {
  tid?: string
  oid?: string
  acct?: 0 | 1 // 0 = tenant member, 1 = guest
}

/**
 * Decide whether a Microsoft profile may proceed to the DB/invite check.
 * - Rejects other tenants and personal Microsoft accounts (tid mismatch).
 * - Rejects guest accounts (acct === 1).
 * - Requires the stable `oid` identity key.
 */
export function entraSignInGate(profile: EntraClaims, expectedTenant: string | undefined): EntraGate {
  if (!expectedTenant || !profile.tid || profile.tid !== expectedTenant) return 'wrong_tenant'
  if (profile.acct === 1) return 'guest'
  if (!profile.oid) return 'no_oid'
  return 'ok'
}
