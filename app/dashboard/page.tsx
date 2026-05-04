import Link from 'next/link'
import { sql, ApplicationRequest, ContactMessage } from '@/lib/db'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Button } from '@/components/ui/button'
import { FileText, Clock, CheckCircle, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

async function getStats() {
  const [totalApps, pendingApps, acceptedApps, unreadMsgs] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM application_requests`,
    sql`SELECT COUNT(*) as count FROM application_requests WHERE status = 'PENDING'`,
    sql`SELECT COUNT(*) as count FROM application_requests WHERE status = 'ACCEPTED'`,
    sql`SELECT COUNT(*) as count FROM contact_messages WHERE is_read = false`,
  ])

  return {
    totalApplications: Number(totalApps[0]?.count || 0),
    pendingApplications: Number(pendingApps[0]?.count || 0),
    acceptedArtists: Number(acceptedApps[0]?.count || 0),
    unreadMessages: Number(unreadMsgs[0]?.count || 0),
  }
}

async function getRecentData() {
  const [recentApps, recentMsgs] = await Promise.all([
    sql`SELECT * FROM application_requests ORDER BY created_at DESC LIMIT 5`,
    sql`SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5`,
  ])

  return {
    recentApplications: recentApps as ApplicationRequest[],
    recentMessages: recentMsgs as ContactMessage[],
  }
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  REVIEWED: 'bg-blue-500/20 text-blue-400',
  ACCEPTED: 'bg-green-500/20 text-green-400',
  REJECTED: 'bg-red-500/20 text-red-400',
}

export default async function DashboardOverview() {
  const stats = await getStats()
  const { recentApplications, recentMessages } = await getRecentData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-muted-foreground font-medium mt-1">Welcome to your dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={FileText}
        />
        <StatsCard
          title="Pending Applications"
          value={stats.pendingApplications}
          icon={Clock}
        />
        <StatsCard
          title="Accepted Artists"
          value={stats.acceptedArtists}
          icon={CheckCircle}
        />
        <StatsCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={Mail}
        />
      </div>

      {/* Recent Data */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Applications */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light">Recent Applications</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/applications">View All</Link>
            </Button>
          </div>

          {recentApplications.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No applications yet</p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="font-light">{app.artist_name}</p>
                    <p className="text-xs text-muted-foreground">{app.email}</p>
                  </div>
                  <Badge className={statusColors[app.status]}>
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light">Recent Messages</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/messages">View All</Link>
            </Button>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="font-light">{msg.full_name}</p>
                    <p className="text-xs text-muted-foreground">{msg.subject}</p>
                  </div>
                  <Badge className={msg.is_read ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'}>
                    {msg.is_read ? 'Read' : 'Unread'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
