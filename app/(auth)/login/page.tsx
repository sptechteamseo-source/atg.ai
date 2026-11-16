'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, loginWithMicrosoft } from '@/app/actions/auth'

// Wrap in Suspense because useSearchParams() causes a CSR bailout at build time
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  // Microsoft sign-in failures come back as /login?error=… (NextAuth error page).
  const authError = searchParams.get('error')
  const msError =
    authError === 'AccessDenied'
      ? "You're not authorised to sign in. Contact your administrator."
      : authError
        ? 'Microsoft sign-in failed. Please try again.'
        : ''

  const [emailOpen, setEmailOpen] = useState(false)

  return (
    <>
      <div className="auth-welcome">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/clarant-mark.png" alt="Clarant" className="auth-mark" width={96} height={96} />
        <h1 className="auth-title">Welcome to Clarant</h1>
        <p className="auth-subtitle">
          Your <span className="auth-accent">AI</span> Intelligence Platform
        </p>

        {msError && <div className="auth-alert auth-alert--error">{msError}</div>}

        {/* Microsoft Entra ID — server-action form, works without JS. Unchanged auth. */}
        <form action={loginWithMicrosoft} className="auth-provider-form">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <button type="submit" className="auth-provider-btn">
            <svg className="auth-provider-icon" width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            <span>Continue with Microsoft</span>
          </button>
        </form>

        <button type="button" className="auth-provider-btn" onClick={() => setEmailOpen(true)}>
          <svg className="auth-provider-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="m3 6 9 7 9-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Continue with Email</span>
        </button>
      </div>

      {emailOpen && (
        <EmailModal callbackUrl={callbackUrl} onClose={() => setEmailOpen(false)} />
      )}

      <AuthStyles />
    </>
  )
}

function EmailModal({ callbackUrl, onClose }: { callbackUrl: string; onClose: () => void }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // Set once the password is accepted but the account has 2FA enabled — reveals
  // the 6-digit code field. Email/password stay in the form and are resubmitted.
  const [twoFactor, setTwoFactor] = useState(false)

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('callbackUrl', callbackUrl)

    const result = await login(formData)
    if (result?.twoFactor) {
      setTwoFactor(true)
      setLoading(false)
    } else if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 id="auth-modal-title" className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your dashboard</p>

        {error && <div className="auth-alert auth-alert--error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                readOnly={twoFactor}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {twoFactor && (
            <div className="auth-field">
              <label htmlFor="token">Authentication code</label>
              <input
                id="token"
                name="token"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code or backup code"
                required
                autoFocus
              />
            </div>
          )}

          <button type="submit" className="btn btn-accent auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : twoFactor ? 'Verify & sign in' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function AuthStyles() {
  return (
    <style>{`
      .auth-welcome {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .auth-mark {
        width: 96px;
        height: 96px;
        object-fit: contain;
        margin-bottom: 20px;
      }
      .auth-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--fg);
        margin-bottom: 6px;
      }
      .auth-subtitle {
        color: var(--fg-muted);
        font-size: 0.95rem;
        margin-bottom: 28px;
      }
      .auth-accent { color: var(--accent); font-weight: 600; }

      .auth-provider-form { width: 100%; }
      .auth-provider-btn {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 13px 16px;
        margin-bottom: 12px;
        background: var(--bg);
        color: var(--fg);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: border-color var(--transition-fast), background var(--transition-fast);
      }
      .auth-provider-btn:hover { border-color: var(--accent); background: var(--bg-elevated); }
      .auth-provider-icon { position: absolute; left: 18px; }

      /* ── Email modal ───────────────────────────────────────────── */
      .auth-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(2px);
      }
      .auth-modal {
        position: relative;
        width: 100%;
        max-width: 400px;
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 32px;
        box-shadow: var(--shadow-md);
        text-align: left;
      }
      .auth-modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: var(--fg-muted);
        font-size: 0.9rem;
        cursor: pointer;
        border-radius: var(--radius-sm);
      }
      .auth-modal-close:hover { background: var(--bg); color: var(--fg); }
      .auth-modal .auth-title { font-size: 1.5rem; }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 20px;
      }
      .auth-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .auth-field label {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--fg);
      }
      .auth-field input {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--bg);
        color: var(--fg);
        font-size: 0.9rem;
        transition: border-color var(--transition-fast);
        outline: none;
      }
      .auth-field input:focus { border-color: var(--accent); }

      .auth-password-wrap { position: relative; display: flex; align-items: center; }
      .auth-password-wrap input { padding-right: 60px; }
      .auth-password-toggle {
        position: absolute;
        right: 10px;
        background: transparent;
        border: none;
        color: var(--accent);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        padding: 4px 6px;
      }

      .auth-submit { width: 100%; margin-top: 8px; padding: 11px; }
      .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

      .auth-alert {
        padding: 10px 14px;
        border-radius: var(--radius-sm);
        font-size: 0.85rem;
        margin-bottom: 16px;
      }
      .auth-alert--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

      @media (max-width: 480px) {
        .auth-modal { padding: 24px; }
        .auth-title { font-size: 1.5rem; }
      }
    `}</style>
  )
}
