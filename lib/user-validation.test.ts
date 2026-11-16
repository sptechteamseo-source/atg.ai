// Runnable self-check for user-update validation (no DB).
//   npx tsx lib/user-validation.test.ts
import assert from 'node:assert'
import { parseUserUpdate } from './user-validation'

// The reported bug: editing your own account submits role/status = null (disabled
// selects) and a blank password. This must validate, and must NOT set a password.
const r1 = parseUserUpdate({ name: 'A', email: 'a@b.com', role: null, status: null, password: '' })
assert.ok('data' in r1, 'null enums + blank password should validate')
assert.equal((r1 as any).data.password, undefined, 'blank password must be dropped')
assert.equal((r1 as any).data.role, undefined, 'null role must be dropped')

// A too-short password → specific message, not the generic "Invalid input".
const r2 = parseUserUpdate({ password: 'short' })
assert.ok('error' in r2)
assert.match((r2 as any).error, /at least 8/)

// A valid new password passes through.
const r3 = parseUserUpdate({ password: 'longenough1' })
assert.equal((r3 as any).data.password, 'longenough1')

// Invalid email → specific message.
const r4 = parseUserUpdate({ email: 'nope' })
assert.match((r4 as any).error, /valid email/i)

// Invalid role value → specific message (not generic).
const r5 = parseUserUpdate({ role: 'superadmin' })
assert.match((r5 as any).error, /role/i)

console.log('user-validation.test.ts: all assertions passed')
