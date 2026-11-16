'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteButton from '@/components/dashboard/DeleteButton'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string | null
  createdat: Date
  _count: { blogs: number; usecases: number }
}

const ROLE_COLORS: Record<string, string> = {
  admin: '#7c3aed',
  editor: '#2563eb',
  author: '#059669',
}

export default function UserManagement({
  users,
  currentUserId,
}: {
  users: User[]
  currentUserId: string
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // User currently being edited (null = modal closed)
  const [editing, setEditing] = useState<User | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name'),
      email: fd.get('email'),
      password: fd.get('password'),
      role: fd.get('role'),
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok && res.status >= 500) {
        setError('Server error — please try again')
        return
      }

      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Could not create user')
        return
      }

      setShowForm(false)
      router.refresh()
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleEditUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editing) return
    setEditError('')
    setEditLoading(true)

    const fd = new FormData(e.currentTarget)
    // Build payload. Disabled selects (role/status on your own account) submit
    // nothing → skip them; only include a password if a new one was typed.
    const body: Record<string, unknown> = {
      name: fd.get('name'),
      email: fd.get('email'),
    }
    const role = fd.get('role')
    if (role) body.role = role
    const status = fd.get('status')
    if (status) body.status = status
    const newPassword = (fd.get('password') as string | null)?.trim()
    if (newPassword) body.password = newPassword

    try {
      const res = await fetch(`/api/users/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok && res.status >= 500) {
        setEditError('Server error — please try again')
        return
      }

      const data = await res.json()
      if (!data.success) {
        setEditError(data.error || 'Could not update user')
        return
      }

      setEditing(null)
      router.refresh()
    } catch {
      setEditError('Network error — please try again')
    } finally {
      setEditLoading(false)
    }
  }

  function openEdit(user: User) {
    setEditError('')
    setEditing(user)
  }

  const isSelf = (id: string) => id === currentUserId

  return (
    <div className="user-mgmt">
      {/* Toolbar */}
      <div className="list-toolbar">
        <button className="btn btn-accent" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Invite User'}
        </button>
      </div>

      {/* Create user form */}
      {showForm && (
        <div className="invite-form-card">
          <h3 className="form-card-title">Invite New User</h3>
          {error && <div className="cms-error">{error}</div>}
          <form onSubmit={handleCreateUser} className="invite-form">
            <div className="form-row">
              <div className="form-field">
                <label>Name</label>
                <input name="name" type="text" required placeholder="Jane Smith" />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input name="email" type="email" required placeholder="jane@company.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Password</label>
                <input name="password" type="password" required minLength={8} placeholder="Min 8 characters" />
              </div>
              <div className="form-field">
                <label>Role</label>
                <select name="role" defaultValue="author">
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? 'Creating…' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Content</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar" style={{ background: ROLE_COLORS[user.role] + '20', color: ROLE_COLORS[user.role] }}>
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">
                        {user.name}
                        {isSelf(user.id) && <span className="you-badge">You</span>}
                      </div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="role-badge" style={{ background: ROLE_COLORS[user.role] + '18', color: ROLE_COLORS[user.role] }}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${user.status === 'inactive' ? 'archived' : 'published'}`}>
                    {user.status === 'inactive' ? 'Inactive' : 'Active'}
                  </span>
                </td>
                <td>
                  {user._count.blogs} blog{user._count.blogs !== 1 ? 's' : ''},{' '}
                  {user._count.usecases} use case{user._count.usecases !== 1 ? 's' : ''}
                </td>
                <td>{new Date(user.createdat).toLocaleDateString()}</td>
                <td>
                  <div className="row-actions">
                    <button className="action-btn" onClick={() => openEdit(user)}>Edit</button>
                    {!isSelf(user.id) && <DeleteButton id={user.id} apiPath="users" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit user modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => !editLoading && setEditing(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="form-card-title">Edit User</h3>
              <button className="modal-close" aria-label="Close" onClick={() => setEditing(null)} disabled={editLoading}>✕</button>
            </div>
            {editError && <div className="cms-error">{editError}</div>}
            <form onSubmit={handleEditUser} className="invite-form">
              <div className="form-field">
                <label>Name</label>
                <input name="name" type="text" required defaultValue={editing.name} />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input name="email" type="email" required defaultValue={editing.email} />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Role</label>
                  <select name="role" defaultValue={editing.role} disabled={isSelf(editing.id)}>
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {isSelf(editing.id) && <span className="hint">You can&rsquo;t change your own role</span>}
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select name="status" defaultValue={editing.status ?? 'active'} disabled={isSelf(editing.id)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {isSelf(editing.id) && <span className="hint">You can&rsquo;t deactivate yourself</span>}
                </div>
              </div>
              <div className="form-field">
                <label>New password <span className="hint">(leave blank to keep current)</span></label>
                <input name="password" type="password" minLength={8} placeholder="Min 8 characters" />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-accent" disabled={editLoading}>
                  {editLoading ? 'Saving…' : 'Save changes'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)} disabled={editLoading}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .user-mgmt { display: flex; flex-direction: column; gap: 20px; }
        .list-toolbar { display: flex; justify-content: flex-end; }
        .invite-form-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .form-card-title { font-size: 0.85rem; font-weight: 600; color: var(--fg); text-transform: uppercase; letter-spacing: 0.04em; }
        .invite-form { display: flex; flex-direction: column; gap: 12px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input, .form-field select { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; font-family: inherit; outline: none; }
        .form-field input:focus, .form-field select:focus { border-color: var(--accent); }
        .form-field select:disabled { opacity: 0.6; cursor: not-allowed; }
        .hint { font-size: 0.72rem; color: var(--fg-subtle); font-weight: 400; }
        .cms-error { padding: 10px 14px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.875rem; }
        .data-table-wrap { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-elevated); overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; min-width: 560px; }
        .data-table th { background: var(--bg-sunken); padding: 10px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted); border-bottom: 1px solid var(--border); white-space: nowrap; }
        .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--fg); vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: var(--bg-sunken); }
        .user-cell { display: flex; align-items: center; gap: 10px; }
        .user-avatar { width: 32px; height: 32px; border-radius: 50%; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .user-name { font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .user-email { font-size: 0.75rem; color: var(--fg-muted); }
        .you-badge { font-size: 0.65rem; background: var(--accent-soft); color: var(--accent); padding: 1px 6px; border-radius: 999px; font-weight: 600; }
        .role-badge { font-size: 0.72rem; font-weight: 600; padding: 2px 10px; border-radius: 999px; text-transform: capitalize; }
        .status-badge { font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
        .status-published { background: #f0fdf4; color: #16a34a; }
        .status-archived { background: #fef2f2; color: #dc2626; }
        .row-actions { display: flex; gap: 6px; align-items: center; }
        .action-btn { padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; text-decoration: none; background: var(--accent-soft); color: var(--accent); transition: all var(--transition-fast); white-space: nowrap; border: none; cursor: pointer; }
        .action-btn:hover { background: var(--accent); color: white; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 300; padding: 20px; }
        .modal-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 22px; width: 100%; max-width: 460px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 20px 50px -12px rgba(0,0,0,0.3); }
        .modal-head { display: flex; align-items: center; justify-content: space-between; }
        .modal-close { background: transparent; border: none; color: var(--fg-muted); cursor: pointer; font-size: 0.9rem; padding: 4px 8px; border-radius: var(--radius-sm); }
        .modal-close:hover { background: var(--bg-sunken); color: var(--fg); }
        .modal-actions { display: flex; gap: 8px; margin-top: 4px; }
        .modal-actions .btn { flex: 1; text-align: center; }
        .modal-actions .btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
          .dash-content { padding: 16px !important; }
        }
        @media (max-width: 480px) {
          .dash-content { padding: 12px !important; }
        }
      `}</style>
    </div>
  )
}
