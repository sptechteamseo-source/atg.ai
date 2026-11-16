'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface Redirect {
  id: string
  sourceUrl: string
  targetUrl: string
  enabled: boolean
  createdAt: string
}

interface ImportSummary {
  imported: number
  skipped: number
  failed: number
  errors: string[]
}

const PAGE_SIZE = 20

export default function RedirectsClient() {
  const [rows, setRows] = useState<Redirect[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Add/Edit modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Redirect | null>(null)
  const [fSource, setFSource] = useState('')
  const [fTarget, setFTarget] = useState('')
  const [fEnabled, setFEnabled] = useState(true)
  const [fError, setFError] = useState('')
  const [saving, setSaving] = useState(false)

  // Import
  const fileRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [summary, setSummary] = useState<ImportSummary | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const load = useCallback(async (p: number, query: string) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: String(p), pageSize: String(PAGE_SIZE) })
      if (query) params.set('q', query)
      const res = await fetch(`/api/redirects?${params}`)
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Failed to load'); return }
      setRows(data.data)
      setTotal(data.total)
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search — reset to page 1 whenever the query changes.
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, q) }, 300)
    return () => clearTimeout(t)
  }, [q, load])

  // Page changes (not driven by the search effect above)
  useEffect(() => { load(page, q) }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  function openAdd() {
    setEditing(null)
    setFSource(''); setFTarget(''); setFEnabled(true); setFError('')
    setModalOpen(true)
  }

  function openEdit(r: Redirect) {
    setEditing(r)
    setFSource(r.sourceUrl); setFTarget(r.targetUrl); setFEnabled(r.enabled); setFError('')
    setModalOpen(true)
  }

  async function saveForm(e: React.FormEvent) {
    e.preventDefault()
    setFError('')
    setSaving(true)
    try {
      const url = editing ? `/api/redirects/${editing.id}` : '/api/redirects'
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceUrl: fSource, targetUrl: fTarget, enabled: fEnabled }),
      })
      const data = await res.json()
      if (!data.success) { setFError(data.error || 'Save failed'); return }
      setModalOpen(false)
      load(page, q)
    } catch {
      setFError('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  async function toggle(r: Redirect) {
    try {
      const res = await fetch(`/api/redirects/${r.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !r.enabled }),
      })
      const data = await res.json()
      if (!data.success) { alert(data.error || 'Update failed'); return }
      setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, enabled: !r.enabled } : x)))
    } catch {
      alert('Network error')
    }
  }

  async function remove(r: Redirect) {
    if (!confirm(`Delete redirect ${r.sourceUrl} → ${r.targetUrl}?`)) return
    try {
      const res = await fetch(`/api/redirects/${r.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.success) { alert(data.error || 'Delete failed'); return }
      load(page, q)
    } catch {
      alert('Network error')
    }
  }

  async function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setSummary(null)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/redirects/import', { method: 'POST', body: fd })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Import failed'); return }
      setSummary({ imported: data.imported, skipped: data.skipped, failed: data.failed, errors: data.errors ?? [] })
      setPage(1); load(1, q)
    } catch {
      setError('Network error during import')
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="dash-content">
      {/* Toolbar */}
      <div className="rd-toolbar">
        <input
          type="search"
          className="rd-search"
          placeholder="Search From or To URL…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="rd-toolbar-actions">
          <button className="btn btn-accent" onClick={openAdd}>Add Redirect</button>
          <button className="action-btn action-btn--ghost" disabled={importing} onClick={() => fileRef.current?.click()}>
            {importing ? 'Importing…' : 'Import Redirects'}
          </button>
          <a className="action-btn action-btn--ghost" href="/api/redirects/export?format=xlsx">Export Excel</a>
          <a className="action-btn action-btn--ghost" href="/api/redirects/export?format=csv">Export CSV</a>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={onImportFile}
          />
        </div>
      </div>

      {error && <div className="cms-error">{error}</div>}

      {/* Import summary */}
      {summary && (
        <div className="rd-summary">
          <div className="rd-summary-head">
            <strong>Import complete</strong>
            <button className="rd-summary-close" onClick={() => setSummary(null)} aria-label="Dismiss">×</button>
          </div>
          <div className="rd-summary-counts">
            <span className="rd-badge rd-badge--ok">Imported: {summary.imported}</span>
            <span className="rd-badge rd-badge--warn">Skipped: {summary.skipped}</span>
            <span className="rd-badge rd-badge--err">Failed: {summary.failed}</span>
          </div>
          {summary.errors.length > 0 && (
            <ul className="rd-summary-errors">
              {summary.errors.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Table */}
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>From URL</th>
              <th>To URL</th>
              <th>Status</th>
              <th>Created</th>
              <th style={{ width: 1 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="rd-empty">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="rd-empty">{q ? 'No redirects match your search' : 'No redirects yet'}</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{r.sourceUrl}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--fg-muted)' }}>{r.targetUrl}</td>
                  <td>
                    <span className={`rd-status ${r.enabled ? 'rd-status--on' : 'rd-status--off'}`}>
                      {r.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="action-btn" onClick={() => openEdit(r)}>Edit</button>
                      <button className="action-btn action-btn--ghost" onClick={() => toggle(r)}>
                        {r.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button className="action-btn action-btn--danger-ghost" onClick={() => remove(r)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="rd-pager">
          <button className="action-btn action-btn--ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span className="rd-pager-info">Page {page} of {totalPages} · {total} total</span>
          <button className="action-btn action-btn--ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {/* Add/Edit modal */}
      {modalOpen && (
        <div className="rd-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="rd-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="form-card-title">{editing ? 'Edit Redirect' : 'Add Redirect'}</h3>
            {fError && <div className="cms-error">{fError}</div>}
            <form onSubmit={saveForm} className="rd-form">
              <div className="form-field">
                <label>From URL</label>
                <input type="text" value={fSource} onChange={(e) => setFSource(e.target.value)} placeholder="/old-page" required />
              </div>
              <div className="form-field">
                <label>To URL</label>
                <input type="text" value={fTarget} onChange={(e) => setFTarget(e.target.value)} placeholder="/new-page" required />
              </div>
              <label className="rd-checkbox">
                <input type="checkbox" checked={fEnabled} onChange={(e) => setFEnabled(e.target.checked)} />
                <span>Enabled</span>
              </label>
              <div className="rd-modal-actions">
                <button type="button" className="action-btn action-btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Redirect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dash-content { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
        .form-card-title { font-size: 0.85rem; font-weight: 600; color: var(--fg); text-transform: uppercase; letter-spacing: 0.04em; }
        .cms-error { padding: 10px 14px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.875rem; }

        .rd-toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: space-between; }
        .rd-search { flex: 1; min-width: 200px; max-width: 340px; padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; outline: none; }
        .rd-search:focus { border-color: var(--accent); }
        .rd-toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

        .btn { padding: 9px 16px; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-accent { background: var(--accent); color: #fff; }
        .btn-accent:hover:not(:disabled) { opacity: 0.92; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .data-table-wrap { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-elevated); overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; min-width: 640px; }
        .data-table th { background: var(--bg-sunken); padding: 10px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted); border-bottom: 1px solid var(--border); white-space: nowrap; }
        .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--fg); vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .rd-empty { padding: 20px; text-align: center; color: var(--fg-muted); }

        .row-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .action-btn { padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; cursor: pointer; border: none; background: var(--accent-soft); color: var(--accent); transition: all var(--transition-fast); white-space: nowrap; text-decoration: none; display: inline-flex; align-items: center; }
        .action-btn:hover:not(:disabled) { background: var(--accent); color: #fff; }
        .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .action-btn--ghost { background: transparent; color: var(--fg-muted); border: 1px solid var(--border); }
        .action-btn--ghost:hover:not(:disabled) { background: var(--bg-sunken); color: var(--fg); }
        .action-btn--danger-ghost { background: transparent; color: #dc2626; border: 1px solid #fecaca; }
        .action-btn--danger-ghost:hover:not(:disabled) { background: #fef2f2; }

        .rd-status { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .rd-status--on { background: #dcfce7; color: #16a34a; }
        .rd-status--off { background: var(--bg-sunken); color: var(--fg-muted); }

        .rd-pager { display: flex; align-items: center; justify-content: center; gap: 14px; }
        .rd-pager-info { font-size: 0.825rem; color: var(--fg-muted); }

        .rd-summary { border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg-elevated); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .rd-summary-head { display: flex; justify-content: space-between; align-items: center; }
        .rd-summary-close { border: none; background: transparent; font-size: 1.2rem; line-height: 1; cursor: pointer; color: var(--fg-muted); }
        .rd-summary-counts { display: flex; gap: 8px; flex-wrap: wrap; }
        .rd-badge { padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .rd-badge--ok { background: #dcfce7; color: #16a34a; }
        .rd-badge--warn { background: #fef9c3; color: #ca8a04; }
        .rd-badge--err { background: #fef2f2; color: #dc2626; }
        .rd-summary-errors { margin: 0; padding-left: 18px; font-size: 0.8rem; color: var(--fg-muted); max-height: 160px; overflow-y: auto; }

        .rd-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .rd-modal { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 24px; width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.25); }
        .rd-form { display: flex; flex-direction: column; gap: 14px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input[type="text"] { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; outline: none; }
        .form-field input:focus { border-color: var(--accent); }
        .rd-checkbox { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--fg); cursor: pointer; }
        .rd-modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

        @media (max-width: 768px) { .dash-content { padding: 16px; } }
        @media (max-width: 480px) { .dash-content { padding: 12px; } }
      `}</style>
    </div>
  )
}
