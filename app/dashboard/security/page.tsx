import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/Header'
import { prisma } from '@/lib/prisma'
import TwoFactorSettings from './TwoFactorSettings'

// Two-factor authentication settings. Admins and editors only — authors have no access.
export default async function SecurityPage() {
  const session = await auth()
  const role = session?.user?.role
  if (role !== 'admin' && role !== 'editor') {
    redirect('/dashboard')
  }

  const user = await prisma.users.findUnique({
    where: { id: session!.user.id },
    select: { twoFactorEnabled: true },
  })

  return (
    <>
      <DashboardHeader title="Security" description="Protect your account with two-factor authentication" />
      <div className="dash-content">
        <TwoFactorSettings initialEnabled={!!user?.twoFactorEnabled} />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
