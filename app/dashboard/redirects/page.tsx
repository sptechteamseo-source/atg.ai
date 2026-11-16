import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PageHeader from '@/components/dashboard/PageHeader'
import RedirectsClient from './RedirectsClient'
import type { UserRole } from '@/types'

// Server-side role guard — only admin/editor manage redirects (authors: no access)
export default async function RedirectsPage() {
  const session = await auth()
  const role = session?.user?.role as UserRole | undefined

  if (role !== 'admin' && role !== 'editor') {
    redirect('/dashboard')
  }

  return (
    <>
      <PageHeader title="Redirect Manager" description="Manage 301 redirects applied site-wide" />
      <RedirectsClient />
    </>
  )
}
