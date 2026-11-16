'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Reverts a scheduled blog to Draft (content preserved, never published).
// Uses the existing PUT /api/blogs/:id — the route clears scheduledat when
// status leaves 'scheduled'.
export default function CancelScheduleButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function cancel() {
    setLoading(true)
    try {
      const res  = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'draft' }),
      })
      const json = await res.json()
      if (json.success) router.refresh()
      else alert(json.error || 'Could not cancel schedule')
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={cancel} disabled={loading} className="action-btn action-btn--ghost">
      {loading ? '…' : 'Cancel Schedule'}
    </button>
  )
}
