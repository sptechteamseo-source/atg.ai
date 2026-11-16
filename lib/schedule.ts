// Scheduler timezone helpers. Scheduled times are entered as wall-clock
// (date + time + IANA timezone) and stored in the DB as UTC. Display converts
// back with the native Intl API — no date library.

// Timezones offered in the scheduler. Kolkata first = default (India-first product).
export const TIMEZONES = [
  { value: 'Asia/Kolkata',       label: 'Asia/Kolkata (IST)' },
  { value: 'UTC',                label: 'UTC' },
  { value: 'America/New_York',   label: 'America/New_York (ET)' },
  { value: 'America/Los_Angeles',label: 'America/Los_Angeles (PT)' },
  { value: 'Europe/London',      label: 'Europe/London (GMT/BST)' },
  { value: 'Asia/Dubai',         label: 'Asia/Dubai (GST)' },
  { value: 'Asia/Singapore',     label: 'Asia/Singapore (SGT)' },
] as const

export const DEFAULT_TZ = 'Asia/Kolkata'

// How far `tz`'s wall clock is ahead of real UTC at instant `date`, in ms.
function tzOffsetMs(date: Date, tz: string): number {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date).reduce<Record<string, number>>((a, x) => {
    if (x.type !== 'literal') a[x.type] = Number(x.value)
    return a
  }, {})
  // 24:00 is emitted by some engines for midnight — normalise to 0.
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second)
  return asUtc - date.getTime()
}

// Convert a wall-clock time in `tz` to the matching UTC Date.
// Two-pass corrects DST boundaries; exact for fixed-offset zones like IST.
// dateStr = "YYYY-MM-DD", timeStr = "HH:MM".
export function zonedToUtc(dateStr: string, timeStr: string, tz: string): Date {
  const [y, mo, d] = dateStr.split('-').map(Number)
  const [h, mi] = timeStr.split(':').map(Number)
  let ts = Date.UTC(y, mo - 1, d, h, mi)
  ts -= tzOffsetMs(new Date(ts), tz)
  const off2 = tzOffsetMs(new Date(ts), tz)
  const target = Date.UTC(y, mo - 1, d, h, mi)
  if (ts + off2 !== target) ts = target - off2
  return new Date(ts)
}

// Split a stored UTC instant into the {date,time} the <input>s need, in `tz`.
// date = "YYYY-MM-DD", time = "HH:MM" — used to pre-fill the reschedule form.
export function utcToZonedParts(utc: Date | string, tz: string = DEFAULT_TZ): { date: string; time: string } {
  const d = typeof utc === 'string' ? new Date(utc) : utc
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).formatToParts(d).reduce<Record<string, string>>((a, x) => {
    if (x.type !== 'literal') a[x.type] = x.value
    return a
  }, {})
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour === '24' ? '00' : p.hour}:${p.minute}` }
}

// Human label for a stored UTC instant, shown in `tz`. e.g. "20 Aug 2026, 10:30 AM IST"
export function formatInTz(utc: Date | string, tz: string = DEFAULT_TZ): string {
  const d = typeof utc === 'string' ? new Date(utc) : utc
  const s = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(d)
  const abbr = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
    .formatToParts(d).find(p => p.type === 'timeZoneName')?.value ?? tz
  return `${s.replace(',', '')} ${abbr}`.replace(/\s+/g, ' ').trim()
}
// Self-check lives in scripts/schedule-check.ts (keeps this file client-safe —
// no `require`, so it bundles cleanly into the BlogForm client component).
