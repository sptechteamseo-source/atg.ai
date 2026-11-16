'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Trash row actions: Restore (PATCH) and Permanent Delete (DELETE ?permanent=true).
 * Permanent delete asks for confirmation in a modal — it cannot be undone.
 */
export default function TrashActions({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'restore' | 'delete' | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState('')

  async function restore() {
    setError('')
    setLoading('restore')
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'PATCH' })
      const json = await res.json()
      if (json.success) { router.refresh() }
      else { setError(json.error || 'Restore failed'); setLoading(null) }
    } catch {
      setError('Something went wrong'); setLoading(null)
    }
  }

  async function permanentlyDelete() {
    setError('')
    setLoading('delete')
    try {
      const res = await fetch(`/api/blogs/${id}?permanent=true`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) { router.refresh() }
      else { setError(json.error || 'Delete failed'); setLoading(null); setConfirmOpen(false) }
    } catch {
      setError('Something went wrong'); setLoading(null); setConfirmOpen(false)
    }
  }

  return (
    <div className="table-actions">
      <button className="action-btn" onClick={restore} disabled={loading !== null}>
        {loading === 'restore' ? '…' : 'Restore'}
      </button>
      <button className="action-btn action-btn--danger-ghost" onClick={() => setConfirmOpen(true)} disabled={loading !== null}>
        Delete permanently
      </button>
      {error && <span className="trash-err">{error}</span>}

      {confirmOpen && (
        <div className="trash-modal-overlay" onClick={() => loading === null && setConfirmOpen(false)}>
          <div className="trash-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete permanently?</h3>
            <p>
              &ldquo;{title}&rdquo; will be removed from the database for good.
              This <strong>cannot be undone</strong>.
            </p>
            <div className="trash-modal-actions">
              <button className="action-btn action-btn--ghost" onClick={() => setConfirmOpen(false)} disabled={loading === 'delete'}>
                Cancel
              </button>
              <button className="action-btn action-btn--danger" onClick={permanentlyDelete} disabled={loading === 'delete'}>
                {loading === 'delete' ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .action-btn--danger-ghost { background: transparent; color: #dc2626; border: 1px solid #fecaca; padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; cursor: pointer; }
        .action-btn--danger-ghost:hover:not(:disabled) { background: #fef2f2; }
        .action-btn--danger { background: #dc2626; color: #fff; border: none; padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; cursor: pointer; }
        .action-btn--danger:hover:not(:disabled) { background: #b91c1c; }
        .action-btn--ghost { background: transparent; color: var(--fg-muted); border: 1px solid var(--border); padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; cursor: pointer; }
        .action-btn:disabled, .action-btn--danger:disabled, .action-btn--ghost:disabled, .action-btn--danger-ghost:disabled { opacity: 0.6; cursor: not-allowed; }
        .trash-err { color: #dc2626; font-size: 0.78rem; }
        .trash-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
        .trash-modal { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 22px 24px; max-width: 420px; width: 100%; }
        .trash-modal h3 { font-size: 1.05rem; font-weight: 600; color: var(--fg); margin: 0 0 8px; }
        .trash-modal p { font-size: 0.875rem; color: var(--fg-muted); line-height: 1.6; margin: 0 0 18px; }
        .trash-modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
      `}</style>
    </div>
  )
}
