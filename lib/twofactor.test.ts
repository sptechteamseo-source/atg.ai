// Runnable self-check for TOTP + backup-code logic (no DB).
//   npx tsx lib/twofactor.test.ts
import assert from 'node:assert'
import speakeasy from 'speakeasy'
import {
  generateSecret,
  verifyTOTP,
  generateBackupCodes,
  hashBackupCodes,
  matchBackupCode,
} from './twofactor'

// A freshly generated secret verifies the current authenticator code, and rejects a wrong one.
const { base32, otpauthUrl } = generateSecret('admin@askClarant.ai')
assert.ok(base32.length > 0)
assert.match(otpauthUrl, /^otpauth:\/\/totp\//)
const goodToken = speakeasy.totp({ secret: base32, encoding: 'base32' })
assert.equal(verifyTOTP(base32, goodToken), true, 'current TOTP must verify')
assert.equal(verifyTOTP(base32, '000000'), false, 'wrong TOTP must fail')

// Backup codes: hashed store, single-use match (case/format-insensitive), no false match.
async function backupCodes() {
  const codes = generateBackupCodes(10)
  assert.equal(codes.length, 10)
  assert.match(codes[0], /^[0-9a-f]{5}-[0-9a-f]{5}$/)
  const hashed = await hashBackupCodes(codes)

  // Matches regardless of spacing/hyphen/case.
  const idx = await matchBackupCode(hashed, codes[3].toUpperCase().replace('-', ' '))
  assert.equal(idx, 3, 'backup code should match its hash')

  // A non-issued code does not match.
  assert.equal(await matchBackupCode(hashed, 'ffff-fffff'), -1)

  console.log('twofactor.test.ts: all assertions passed')
}
backupCodes().catch((e) => { console.error(e); process.exit(1) })
