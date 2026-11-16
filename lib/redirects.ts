// Shared redirect validation — used by the API routes AND bulk import so the
// rules live in exactly one place (duplicate/self/loop/format checks).

/**
 * Normalise a source into a comparable path:
 *  - trim, drop the origin if a full URL was pasted
 *  - ensure a single leading slash
 *  - strip a trailing slash (except for root "/")
 * Sources are always internal paths — that's what middleware matches on.
 */
export function normalizeSource(raw: string): string {
  let s = (raw ?? '').trim()
  if (!s) return ''
  // Strip an accidentally-pasted origin: https://site.com/old -> /old
  try {
    if (/^https?:\/\//i.test(s)) s = new URL(s).pathname + new URL(s).search
  } catch {
    /* fall through — treated as invalid below */
  }
  if (!s.startsWith('/')) s = '/' + s
  if (s.length > 1) s = s.replace(/\/+$/, '')
  return s
}

/** Target may be an internal path OR an absolute http(s) URL. Just trim it. */
export function normalizeTarget(raw: string): string {
  return (raw ?? '').trim()
}

function isValidSource(s: string): boolean {
  return s.startsWith('/') && !/\s/.test(s)
}

function isValidTarget(t: string): boolean {
  if (!t) return false
  if (/^https?:\/\//i.test(t)) {
    try { new URL(t); return true } catch { return false }
  }
  return t.startsWith('/') && !/\s/.test(t)
}

/**
 * Validate a single redirect in isolation (format + self-redirect).
 * Returns a user-friendly message, or null when valid.
 */
export function validateRedirect(source: string, target: string): string | null {
  if (!source) return 'From URL is required'
  if (!target) return 'To URL is required'
  if (!isValidSource(source)) return 'From URL must be a path starting with "/" (e.g. /old-page)'
  if (!isValidTarget(target)) return 'To URL must be a path ("/new-page") or full URL ("https://…")'
  if (source === target) return 'From and To URLs cannot be the same (self-redirect)'
  return null
}

/**
 * Detect whether adding source→target creates a redirect loop, given the map
 * of all other enabled internal rules. Follows the chain from the target; if it
 * ever lands back on the source it's a cycle. Depth-capped as a backstop.
 * ponytail: O(chain length) walk, fine for the hundreds-of-rules SEO use case.
 */
export function createsLoop(
  source: string,
  target: string,
  existing: Map<string, string>,
): boolean {
  const map = new Map(existing)
  map.set(source, target)
  let cur: string | undefined = target
  let steps = 0
  while (cur && map.has(cur)) {
    if (cur === source) return true
    cur = map.get(cur)
    if (++steps > 100) return true
  }
  return false
}
