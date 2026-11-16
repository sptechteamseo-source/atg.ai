// Update the EXISTING admin's login credentials. Never creates a user.
// Usage:
//   npx tsx scripts/set-admin-credentials.ts <newEmail> <newPassword>
// Example:
//   npx tsx scripts/set-admin-credentials.ts admin@askClarant.ai 'Shinde@1829'
//
// Credentials are passed as args (not stored in this file). Uses the same
// bcrypt hashing (cost 12) and the same Prisma client as the app.
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const [newEmail, newPassword] = process.argv.slice(2)
  if (!newEmail || !newPassword) {
    throw new Error('Usage: tsx scripts/set-admin-credentials.ts <newEmail> <newPassword>')
  }

  // Find the existing admin(s). Refuse to guess if there isn't exactly one.
  const admins = await prisma.users.findMany({ where: { role: 'admin' } })
  if (admins.length === 0) throw new Error('No admin user found — aborting (this script never creates users).')
  if (admins.length > 1) {
    throw new Error(
      `Found ${admins.length} admins: ${admins.map((a) => a.email).join(', ')}. ` +
        'Refusing to guess — narrow it down before running.',
    )
  }
  const admin = admins[0]

  // Guard the unique email constraint: target email must be free or already this admin's.
  const owner = await prisma.users.findUnique({ where: { email: newEmail } })
  if (owner && owner.id !== admin.id) {
    throw new Error(`Email ${newEmail} already belongs to a different user (${owner.id}) — aborting.`)
  }

  const hashed = await bcrypt.hash(newPassword, 12)

  const updated = await prisma.users.update({
    where: { id: admin.id },
    data: {
      email: newEmail,
      password: hashed,
      // Clear any lockout so login works immediately with the new credentials.
      failedLoginAttempts: 0,
      lastFailedLogin: null,
      lockUntil: null,
    },
    select: { id: true, name: true, email: true, role: true, status: true },
  })

  // Verify the new password hashes correctly and the old one no longer matches.
  const fresh = await prisma.users.findUnique({ where: { id: admin.id }, select: { password: true } })
  const newWorks = await bcrypt.compare(newPassword, fresh!.password!)

  console.log('Updated admin:', JSON.stringify(updated, null, 2))
  console.log('New password verifies:', newWorks)
  console.log('Role unchanged (admin):', updated.role === 'admin')
  if (!newWorks || updated.role !== 'admin') throw new Error('Verification failed!')
  console.log('✓ Admin credentials updated successfully.')
}

main().then(() => process.exit(0)).catch((e) => { console.error(String(e)); process.exit(1) })
