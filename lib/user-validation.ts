import { z } from 'zod'

// Shared schema for PUT /api/users/[id]. Every field is optional (partial update);
// each carries a real, user-facing message so validation failures are specific.
export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(['admin', 'editor', 'author'], { message: 'Invalid role' }).optional(),
  status: z.enum(['active', 'inactive'], { message: 'Invalid status' }).optional(),
  image: z.string().optional(),
})

// Drop null / undefined / empty-string fields before validating. Disabled form
// selects (e.g. role/status when editing your own account) submit nothing, which
// arrives as `null` and would fail `.optional()`; a blank "New Password" arrives
// as "" and must mean "keep existing", not "set an empty password".
export function cleanUserInput(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object') return {}
  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).filter(
      ([, v]) => v !== null && v !== undefined && v !== '',
    ),
  )
}

// Validate a cleaned payload. Returns { data } on success or { error } with a
// specific message (never the generic "Invalid input").
export function parseUserUpdate(
  raw: unknown,
): { data: z.infer<typeof userUpdateSchema> } | { error: string } {
  const parsed = userUpdateSchema.safeParse(cleanUserInput(raw))
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    const field = first.path.join('.')
    return { error: field ? `${field}: ${first.message}` : first.message || 'Validation failed' }
  }
  return { data: parsed.data }
}
