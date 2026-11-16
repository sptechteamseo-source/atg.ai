import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/Header'
import TrashActions from './TrashActions'
import Link from 'next/link'

export default async function BlogTrashPage() {
  const session = await auth()

  // Trash is destructive — admins only. Others go back to the blog list.
  if (session?.user?.role !== 'admin') redirect('/dashboard/blogs')

  // Explicit deletedat filter → returns only trashed rows (bypasses the
  // soft-delete extension, which would otherwise hide them).
  const blogs = await prisma.blog.findMany({
    where: { deletedat: { not: null } },
    include: { author: { select: { name: true } } },
    orderBy: { deletedat: 'desc' },
  })

  return (
    <>
      <DashboardHeader
        title="Trash"
        description={`${blogs.length} trashed post${blogs.length !== 1 ? 's' : ''}`}
      />

      <div className="dash-content">
        <div className="list-toolbar">
          <Link href="/dashboard/blogs" className="btn btn-ghost">← Back to Blogs</Link>
        </div>

        {blogs.length === 0 ? (
          <div className="empty-box">
            <p>Trash is empty.</p>
            <Link href="/dashboard/blogs" className="btn btn-accent" style={{ marginTop: 12 }}>
              Back to Blogs
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="data-table-wrap table-desktop">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Deleted</th>
                    <th>Original Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <div className="table-title">{blog.title}</div>
                        <div className="table-slug">/{blog.slug}</div>
                      </td>
                      <td>{blog.author?.name ?? blog.authorname ?? '—'}</td>
                      <td className="col-date">{blog.deletedat ? new Date(blog.deletedat).toLocaleString() : '—'}</td>
                      <td>
                        <span className={`status-badge status-${blog.status.toLowerCase()}`}>{blog.status}</span>
                      </td>
                      <td><TrashActions id={blog.id} title={blog.title} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="card-list table-mobile">
              {blogs.map((blog) => (
                <div key={blog.id} className="blog-card">
                  <div className="blog-card-top">
                    <div className="blog-card-info">
                      <div className="table-title">{blog.title}</div>
                      <div className="table-slug">/{blog.slug}</div>
                    </div>
                    <span className={`status-badge status-${blog.status.toLowerCase()}`}>{blog.status}</span>
                  </div>
                  <div className="blog-card-meta">
                    <span>{blog.author?.name ?? blog.authorname ?? '—'}</span>
                    {blog.deletedat && <span> · deleted {new Date(blog.deletedat).toLocaleDateString()}</span>}
                  </div>
                  <TrashActions id={blog.id} title={blog.title} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <TrashStyles />
    </>
  )
}

function TrashStyles() {
  return (
    <style>{`
      .dash-content { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
      .list-toolbar { display: flex; justify-content: flex-start; gap: 8px; }
      .empty-box { text-align: center; padding: 60px 20px; border: 1px dashed var(--border); border-radius: var(--radius-md); color: var(--fg-muted); display: flex; flex-direction: column; align-items: center; }

      .table-mobile { display: none; }
      .data-table-wrap { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-elevated); overflow-x: auto; }
      .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; min-width: 640px; }
      .data-table th { background: var(--bg-sunken); padding: 10px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted); border-bottom: 1px solid var(--border); white-space: nowrap; }
      .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--fg); vertical-align: middle; }
      .data-table tr:last-child td { border-bottom: none; }
      .data-table tr:hover td { background: var(--bg-sunken); }
      .table-title { font-weight: 500; }
      .table-slug { font-size: 0.75rem; color: var(--fg-muted); margin-top: 2px; }
      .col-date { white-space: nowrap; }

      .table-actions { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
      .action-btn { padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; text-decoration: none; background: var(--accent-soft); color: var(--accent); transition: all var(--transition-fast); white-space: nowrap; border: none; cursor: pointer; display: inline-flex; align-items: center; }
      .action-btn:hover:not(:disabled) { background: var(--accent); color: white; }

      .status-badge { font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
      .status-published { background: #f0fdf4; color: #16a34a; }
      .status-draft { background: var(--bg-sunken); color: var(--fg-muted); border: 1px solid var(--border); }
      .status-archived { background: #fef2f2; color: #dc2626; }

      .card-list { display: flex; flex-direction: column; gap: 12px; }
      .blog-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
      .blog-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
      .blog-card-info { min-width: 0; flex: 1; }
      .blog-card-meta { font-size: 0.78rem; color: var(--fg-muted); }

      @media (max-width: 768px) {
        .dash-content { padding: 16px; }
        .table-desktop { display: none; }
        .table-mobile { display: flex; }
      }
      @media (max-width: 480px) { .dash-content { padding: 12px; } }
    `}</style>
  )
}
