import type { ReactNode } from 'react'
import type { Metadata } from 'next'

// Auth pages (login, signup, forgot/reset password) must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Render auth pages dynamically instead of statically prerendering them.
// Next 15's RSC bundler has a build bug where a fully-static 'use client' leaf
// page that imports a server action fails export with "Could not find the module
// …#default in the React Client Manifest" (hit by /signup and /forgot-password;
// /login and /reset-password escape only because useSearchParams already forces a
// dynamic bailout). These are interactive, noindexed forms with zero SSG value, so
// opting the whole group out of prerendering is the correct fix, not a workaround.
export const dynamic = 'force-dynamic'

// Shared layout for all auth pages (login, signup, forgot password, reset)
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      {/* Card — branding (logo + heading) lives inside the login page itself. */}
      <div className="auth-card">
        {children}
      </div>

      <style>{`
        .auth-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--bg);
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 40px;
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  )
}
