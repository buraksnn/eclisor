import { notFound, redirect } from 'next/navigation'
import { getSession, isAdmin } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  if (!isAdmin(user)) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar user={user} />
      <main className="flex-1 lg:ml-72 px-6 pt-20 pb-10 lg:px-12 lg:py-12">
        {children}
      </main>
    </div>
  )
}
