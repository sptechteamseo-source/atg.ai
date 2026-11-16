// Runnable self-check for the pure redirect logic (no DB).
//   npx tsx lib/redirects.test.ts
import assert from 'node:assert'
import { normalizeSource, validateRedirect, createsLoop } from './redirects'

// normalizeSource
assert.equal(normalizeSource('old-page'), '/old-page')
assert.equal(normalizeSource('/old-page/'), '/old-page')
assert.equal(normalizeSource('https://x.com/old?a=1'), '/old?a=1')
assert.equal(normalizeSource('/'), '/')

// validateRedirect
assert.equal(validateRedirect('/a', '/b'), null)
assert.equal(validateRedirect('/a', 'https://x.com/b'), null)
assert.ok(validateRedirect('/a', '/a')) // self-redirect
assert.ok(validateRedirect('', '/b')) // empty source
assert.ok(validateRedirect('/a', 'no-slash')) // bad target

// createsLoop: A->B exists, adding B->A closes the cycle
const existing = new Map([['/a', '/b']])
assert.equal(createsLoop('/b', '/a', existing), true)
assert.equal(createsLoop('/c', '/d', existing), false) // unrelated
assert.equal(createsLoop('/b', '/c', existing), false) // A->B, B->C: a chain, not a loop

console.log('redirects.test.ts: all assertions passed')
