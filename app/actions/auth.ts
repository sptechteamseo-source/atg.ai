'use server'

import { signIn, signOut } from '@/lib/auth'
import { messageForCode } from '@/lib/login-security'
import { redirect } from 'next/navigation'

// ─── Login ────────────────────────────────────────────────────────────────────
// Public signup / forgot-password / reset-password were removed — this system is
// invite/admin-managed only. Accounts are created from the dashboard (Users) and
// credentials changed from Settings → Account Security.

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const token = ((formData.get('token') as string) || '').trim()
  const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard'

  // Map an authorize error code to a UI result. `2fa_required` isn't an error —
  // it tells the login page to reveal the 6-digit code field.
  const handle = (code: string | null) =>
    code === '2fa_required' ? { twoFactor: true as const } : { error: messageForCode(code) }

  // redirect:false → signIn returns the destination URL instead of throwing/redirecting.
  // On failure that URL carries ?error=…&code=<code> from authorize (locked, 2fa_*, …).
  const opts: Record<string, any> = { email, password, redirectTo: callbackUrl, redirect: false }
  if (token) opts.token = token // only send when present, else it reads as the string "undefined"

  let dest: string
  try {
    dest = await signIn('credentials', opts)
  } catch (error: any) {
    // Fallback: some next-auth builds throw the CredentialsSignin instead.
    if (error?.type === 'CredentialsSignin') return handle(error.code ?? null)
    throw error
  }

  const params = new URL(dest, 'http://localhost').searchParams
  if (params.get('error')) return handle(params.get('code'))

  // Success — session cookie is already set by signIn.
  redirect(callbackUrl)
}

// ─── Microsoft Entra ID (OAuth) ─────────────────────────────────────────────────
// Kicks off the Microsoft redirect flow. On success NextAuth redirects to
// callbackUrl; on denial (wrong tenant / not invited) it redirects to
// /login?error=AccessDenied (handled by the login page).

export async function loginWithMicrosoft(formData: FormData) {
  const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard'
  await signIn('microsoft-entra-id', { redirectTo: callbackUrl })
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
  await signOut({ redirectTo: '/login' })
}
