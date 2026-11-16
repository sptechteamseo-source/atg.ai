'use client'

import { useState } from 'react'

// Self-contained 2FA (Google Authenticator) card for Settings → Security.
// Reuses the .settings-card / .form-field / .alert / .btn styles already on the
// settings page, so it doesn't introduce any new design.
export default function TwoFactorSettings({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showDisable, setShowDisable] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function call(action: string, token?: string) {
    setError('')
    setLoading(true)
    const res = await fetch('/api/users/2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, token }),
    })
    const data = await res.json()
    setLoading(false)
    if (!data.success) {
      setError(data.error || 'Something went wrong')
      return null
    }
    return data.data ?? {}
  }

  async function startSetup() {
    const d = await call('setup')
    if (d) { setQr(d.qr); setSecret(d.secret) }
  }

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const token = (new FormData(e.currentTarget).get('token') as string)?.trim()
    const d = await call('verify', token)
    if (d) {
      setBackupCodes(d.backupCodes || [])
      setEnabled(true)
      setQr(''); setSecret('')
    }
  }

  async function disable(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const token = (new FormData(e.currentTarget).get('token') as string)?.trim()
    const d = await call('disable', token)
    if (d) {
      setEnabled(false)
      setShowDisable(false)
      setBackupCodes([])
    }
  }

  return (
    <div className="settings-card">
      <h2 className="settings-section-title">Security · Two-Factor Authentication</h2>
      <p className="settings-section-desc">
        Add a second step at login using Google Authenticator (or any TOTP app).
      </p>

      {error && <div className="alert alert--error">{error}</div>}

      {/* Freshly generated backup codes — shown once. */}
      {backupCodes.length > 0 && (
        <div className="alert alert--success" style={{ display: 'block' }}>
          <strong>2FA enabled.</strong> Save these backup codes somewhere safe — each works once if you
          lose your device:
          <div className="backup-codes">
            {backupCodes.map((c) => <code key={c}>{c}</code>)}
          </div>
        </div>
      )}

      {/* ── Enabled: offer disable ── */}
      {enabled ? (
        <>
          <p className="tf-status tf-on">● Two-factor authentication is ON</p>
          {!showDisable ? (
            <button className="btn btn-ghost settings-submit" onClick={() => setShowDisable(true)}>
              Disable 2FA
            </button>
          ) : (
            <form onSubmit={disable} className="settings-form">
              <div className="form-field">
                <label htmlFor="tf-disable">Enter a current code to disable</label>
                <input id="tf-disable" name="token" type="text" inputMode="numeric" placeholder="6-digit or backup code" required />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-accent settings-submit" disabled={loading}>
                  {loading ? 'Disabling…' : 'Confirm disable'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowDisable(false)}>Cancel</button>
              </div>
            </form>
          )}
        </>
      ) : qr ? (
        /* ── Setup in progress: scan QR + verify ── */
        <form onSubmit={verify} className="settings-form">
          <p className="tf-status">1. Scan this QR code in your authenticator app:</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="2FA QR code" width={168} height={168} className="tf-qr" />
          <p className="tf-secret">Or enter this key manually: <code>{secret}</code></p>
          <div className="form-field">
            <label htmlFor="tf-verify">2. Enter the 6-digit code to confirm</label>
            <input id="tf-verify" name="token" type="text" inputMode="numeric" placeholder="123456" required autoFocus />
          </div>
          <button type="submit" className="btn btn-accent settings-submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify & enable'}
          </button>
        </form>
      ) : (
        /* ── Idle ── */
        <button className="btn btn-accent settings-submit" onClick={startSetup} disabled={loading}>
          {loading ? 'Starting…' : 'Enable 2FA'}
        </button>
      )}

      <style>{`
        /* Self-contained card/form/alert styles (this page has no SettingsForm). */
        .settings-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 24px; display: flex; flex-direction: column; gap: 16px; max-width: 800px; }
        .settings-section-title { font-size: 1rem; font-weight: 600; color: var(--fg); }
        .settings-section-desc { font-size: 0.875rem; color: var(--fg-muted); margin-top: -8px; }
        .settings-form { display: flex; flex-direction: column; gap: 16px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; outline: none; transition: border-color var(--transition-fast); }
        .form-field input:focus { border-color: var(--accent); }
        .settings-submit { width: fit-content; }
        .settings-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .alert { padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.875rem; }
        .alert--success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .alert--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .tf-status { font-size: 0.875rem; color: var(--fg-muted); }
        .tf-on { color: #16a34a; font-weight: 600; }
        .tf-qr { border: 1px solid var(--border); border-radius: var(--radius-sm); background: #fff; padding: 8px; }
        .tf-secret { font-size: 0.8rem; color: var(--fg-muted); }
        .tf-secret code, .backup-codes code { font-family: var(--font-mono, monospace); }
        .backup-codes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top: 10px; }
        .backup-codes code { background: var(--bg-sunken); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 0.85rem; }
      `}</style>
    </div>
  )
}
