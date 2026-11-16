// Runnable self-check for the pure login-security logic (no DB).
//   npx tsx lib/login-security.test.ts
import assert from 'node:assert'
import { lockAfterFailure, messageForCode, MAX_ATTEMPTS } from './login-security'

// lockAfterFailure: locks exactly on the MAX_ATTEMPTS-th consecutive failure.
assert.equal(lockAfterFailure(0).failedLoginAttempts, 1)
assert.equal(lockAfterFailure(0).lockUntil, null) // 1st failure — not locked
assert.equal(lockAfterFailure(MAX_ATTEMPTS - 2).lockUntil, null) // 2nd — not locked
assert.ok(lockAfterFailure(MAX_ATTEMPTS - 1).lockUntil instanceof Date) // 3rd — locked
assert.ok(lockAfterFailure(MAX_ATTEMPTS - 1).lockUntil!.getTime() > Date.now())

// messageForCode
assert.match(messageForCode('locked'), /24 hours/)
assert.match(messageForCode('rate_limited'), /Too many/)
assert.equal(messageForCode(null), 'Invalid email or password')
assert.equal(messageForCode('anything-else'), 'Invalid email or password')

console.log('login-security.test.ts: all assertions passed')
