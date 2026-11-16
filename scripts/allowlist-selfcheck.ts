// Self-check for the email allowlist. Run: npx tsx scripts/allowlist-selfcheck.ts
import assert from 'node:assert'
import { isEmailAllowed } from '../lib/allowlist'

const allowed = [
  'suraj@clarant.ai',
  'employee@sptechteam.com',
  'employee@sptechusa.com',
  'Employee@SPTechTeam.com',   // case-insensitive
  '  employee@sptechusa.com  ', // trimmed
]
const blocked = [
  'suraj@gmail.com',
  'employee@yahoo.com',
  'fake@sptechteam.com.attacker.com', // lookalike suffix
  'employee@fake-sptechusa.com',      // lookalike prefix
  'other@clarant.ai',                 // clarant.ai is NOT a domain allow — only suraj@
  'x@sub.sptechteam.com',             // subdomain is not the exact domain
  'a@b@sptechteam.com',               // multiple @
  'sptechteam.com',                   // no @
  '@sptechteam.com',                  // leading @
  '',
  null,
  undefined,
]

for (const e of allowed) assert.equal(isEmailAllowed(e), true, `should ALLOW: ${JSON.stringify(e)}`)
for (const e of blocked) assert.equal(isEmailAllowed(e as any), false, `should BLOCK: ${JSON.stringify(e)}`)

console.log(`✓ allowlist self-check passed (${allowed.length} allowed, ${blocked.length} blocked)`)
