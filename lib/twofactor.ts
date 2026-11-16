// Google-Authenticator-compatible TOTP 2FA helpers (speakeasy + qrcode) plus
// bcrypt-hashed backup recovery codes. Used by app/api/users/2fa and lib/auth.ts.
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import bcrypt from 'bcryptjs'

const ISSUER = 'Clarant'

// A fresh TOTP secret. `otpauthUrl` is what the QR encodes; `base32` is stored.
export function generateSecret(email: string): { base32: string; otpauthUrl: string } {
  const secret = speakeasy.generateSecret({ name: `${ISSUER} (${email})`, issuer: ISSUER })
  return { base32: secret.base32, otpauthUrl: secret.otpauth_url ?? '' }
}

// Render an otpauth:// URL to a data-URL PNG the browser can show directly.
export function qrDataURL(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl)
}

// Verify a 6-digit code against the secret. window:1 tolerates ±30s clock drift.
export function verifyTOTP(base32Secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret: base32Secret,
    encoding: 'base32',
    token: token.replace(/\s/g, ''),
    window: 1,
  })
}

// One-time recovery codes shown to the user once; only bcrypt hashes are stored.
export function generateBackupCodes(count = 10): string[] {
  // 10 hex chars, grouped as xxxxx-xxxxx for readability.
  return Array.from({ length: count }, () => {
    const raw = Array.from({ length: 10 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    return `${raw.slice(0, 5)}-${raw.slice(5)}`
  })
}

export async function hashBackupCodes(codes: string[]): Promise<string[]> {
  return Promise.all(codes.map((c) => bcrypt.hash(normalizeBackupCode(c), 10)))
}

function normalizeBackupCode(code: string): string {
  return code.replace(/[\s-]/g, '').toLowerCase()
}

// Returns the index of the matching hashed code, or -1. Caller removes that
// index from the stored array so each backup code works exactly once.
export async function matchBackupCode(hashedCodes: string[], code: string): Promise<number> {
  const candidate = normalizeBackupCode(code)
  if (!candidate) return -1
  for (let i = 0; i < hashedCodes.length; i++) {
    if (await bcrypt.compare(candidate, hashedCodes[i])) return i
  }
  return -1
}
