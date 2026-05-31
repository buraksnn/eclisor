import { redirect } from 'next/navigation'
import { getSession, isAdmin } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  if (isAdmin(user)) {
    redirect('/admin/pending-releases')
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={user} />
      <main className="flex-1 lg:ml-64 px-6 pt-20 pb-10 lg:px-12 lg:py-12">
        {children}
      </main>
    </div>
  )
}
