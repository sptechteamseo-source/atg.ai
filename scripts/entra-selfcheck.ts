// Self-check for the stateless Entra sign-in gate. Run: npx tsx scripts/entra-selfcheck.ts
import assert from 'node:assert'
import { entraSignInGate } from '../lib/entra'

const TENANT = 'f7670246-4aa1-44b8-8bdd-eece28916ffe'
const OTHER = '00000000-0000-0000-0000-000000000000'

// Authorised employee: right tenant, member, has oid.
assert.equal(entraSignInGate({ tid: TENANT, oid: 'abc', acct: 0 }, TENANT), 'ok')

// Another organisation's account.
assert.equal(entraSignInGate({ tid: OTHER, oid: 'abc', acct: 0 }, TENANT), 'wrong_tenant')

// Personal Microsoft account (consumer tenant GUID).
assert.equal(
  entraSignInGate({ tid: '9188040d-6c67-4c5b-b112-36a304b66dad', oid: 'abc', acct: 0 }, TENANT),
  'wrong_tenant',
)

// Guest invited into our tenant — tid matches but acct === 1.
assert.equal(entraSignInGate({ tid: TENANT, oid: 'abc', acct: 1 }, TENANT), 'guest')

// Missing stable identity key.
assert.equal(entraSignInGate({ tid: TENANT, acct: 0 }, TENANT), 'no_oid')

// Misconfiguration: no expected tenant set → never allow.
assert.equal(entraSignInGate({ tid: TENANT, oid: 'abc', acct: 0 }, undefined), 'wrong_tenant')

console.log('✓ entra gate self-check passed')
