import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { sql, type Release } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const statusStyles: Record<Release['status'], string> = {
  pending: 'bg-amber-100 text-amber-900',
  approved: 'bg-emerald-100 text-emerald-900',
  rejected: 'bg-rose-100 text-rose-900',
}

const statusLabels: Record<Release['status'], string> = {
  pending: 'Beklemede',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
}

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  const releases = await sql`
    SELECT *
    FROM releases
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `

  const items = releases as Release[]

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Sanatçı Paneli</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold">Yayınlarım</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Tüm yayın başvurularını buradan takip edebilir, yeni bir çalışma gönderebilirsiniz.
          </p>
        </div>
        <Button asChild size="lg" className="px-6">
          <Link href="/dashboard/upload">Yeni Şarkı Yükle</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="border-border/80">
          <CardContent className="py-12 text-center space-y-3">
            <p className="text-lg font-semibold">Henüz yükleme yapılmadı</p>
            <p className="text-muted-foreground">
              İlk yayınını oluşturmak için “Yeni Şarkı Yükle” adımına geçebilirsin.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/dashboard/upload">Yeni Şarkı Yükle</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {items.map((release) => (
            <Card key={release.id} className="overflow-hidden border-border/80">
              <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                <div className="relative h-44 w-full md:h-full md:min-h-[180px]">
                  <Image
                    src={release.cover_url}
                    alt={`${release.title} cover`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="py-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">{release.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{release.artist_name}</p>
                    </div>
                    <Badge className={statusStyles[release.status]}>
                      {statusLabels[release.status]}
                    </Badge>
                  </div>
                  <div className="mt-6 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <p>
                      Tür: <span className="text-foreground font-semibold">{release.genre}</span>
                    </p>
                    <p>
                      ISRC: <span className="text-foreground font-semibold">{release.isrc}</span>
                    </p>
                    <p>
                      Yayın Tarihi:{' '}
                      <span className="text-foreground font-semibold">{release.release_date}</span>
                    </p>
                  </div>
                  <div className="mt-6">
                    <audio controls className="w-full">
                      <source src={release.audio_url} />
                      Tarayıcınız bu ses dosyasını desteklemiyor.
                    </audio>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
