import { redirect } from 'next/navigation'
import { getSession, isAdmin } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  if (!isAdmin(user)) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={user} />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
