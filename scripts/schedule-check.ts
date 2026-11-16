// Self-check for lib/schedule.ts.  Run: npx tsx scripts/schedule-check.ts
import assert from 'node:assert'
import { zonedToUtc, formatInTz, utcToZonedParts } from '../lib/schedule'

// 10:30 IST on 2026-08-20 == 05:00 UTC (IST = UTC+5:30, no DST).
assert.equal(zonedToUtc('2026-08-20', '10:30', 'Asia/Kolkata').toISOString(), '2026-08-20T05:00:00.000Z')
// UTC input is identity.
assert.equal(zonedToUtc('2026-08-20', '10:30', 'UTC').toISOString(), '2026-08-20T10:30:00.000Z')
// Display round-trips back to the same wall clock in IST.
assert.ok(formatInTz('2026-08-20T05:00:00.000Z', 'Asia/Kolkata').includes('10:30'))
// Form pre-fill round-trips.
const parts = utcToZonedParts('2026-08-20T05:00:00.000Z', 'Asia/Kolkata')
assert.deepEqual(parts, { date: '2026-08-20', time: '10:30' })
// DST zone produces a valid instant.
assert.ok(!isNaN(zonedToUtc('2026-07-01', '09:00', 'America/New_York').getTime()))

console.log('schedule.ts self-check OK')
