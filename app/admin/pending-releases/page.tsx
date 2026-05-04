import Image from 'next/image'
import { revalidatePath } from 'next/cache'
import { sql, type Release } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { Button } from '@/components/ui/button'

async function getPendingReleases() {
  const releases = await sql`
    SELECT releases.*, users.name as user_name, users.email as user_email
    FROM releases
    JOIN users ON releases.user_id = users.id
    WHERE releases.status = 'pending'
    ORDER BY releases.created_at DESC
  `
  return releases as Array<Release & { user_name: string; user_email: string }>
}

async function approveRelease(formData: FormData) {
  'use server'
  await requireAdmin()
  const id = Number(formData.get('id'))
  if (!Number.isFinite(id)) {
    throw new Error('Invalid release id')
  }
  await sql`
    UPDATE releases
    SET status = 'approved', updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `
  revalidatePath('/admin/pending-releases')
}

async function rejectRelease(formData: FormData) {
  'use server'
  await requireAdmin()
  const id = Number(formData.get('id'))
  if (!Number.isFinite(id)) {
    throw new Error('Invalid release id')
  }
  await sql`
    UPDATE releases
    SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `
  revalidatePath('/admin/pending-releases')
}

export default async function PendingReleasesPage() {
  await requireAdmin()
  const releases = await getPendingReleases()

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin Queue</p>
        <h1 className="mt-4 text-3xl md:text-5xl font-semibold">Pending releases</h1>
        <p className="mt-2 text-muted-foreground">Review submissions and approve or reject them.</p>
      </div>

      {releases.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center border border-border/80">
          <p className="text-muted-foreground">No pending releases right now.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {releases.map((release) => (
            <div key={release.id} className="glass-card rounded-2xl p-6 border border-border/80">
              <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto]">
                <Image
                  src={release.cover_url}
                  alt={`${release.title} cover`}
                  width={128}
                  height={128}
                  className="h-32 w-32 object-cover border border-border/80"
                />
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Release</p>
                    <h3 className="text-2xl font-semibold">{release.title}</h3>
                    <p className="text-sm text-muted-foreground">{release.artist_name}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>Genre: <span className="text-foreground">{release.genre}</span></p>
                    <p>ISRC: <span className="text-foreground">{release.isrc}</span></p>
                    <p>Release Date: <span className="text-foreground">{release.release_date}</span></p>
                    <p>
                      Submitted by: <span className="text-foreground">{release.user_name}</span>
                    </p>
                    <p>
                      Contact: <span className="text-foreground">{release.user_email}</span>
                    </p>
                  </div>
                  <audio
                    controls
                    className="w-full"
                    aria-label={`Audio preview for ${release.title} by ${release.artist_name}`}
                  >
                    <source src={release.audio_url} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="flex flex-col gap-3">
                  <form action={approveRelease}>
                    <input type="hidden" name="id" value={release.id} />
                    <Button type="submit" size="lg" className="w-full">
                      Approve
                    </Button>
                  </form>
                  <form action={rejectRelease}>
                    <input type="hidden" name="id" value={release.id} />
                    <Button type="submit" size="lg" variant="outline" className="w-full">
                      Reject
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
