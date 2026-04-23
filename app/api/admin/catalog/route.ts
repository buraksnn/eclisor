import { NextResponse } from 'next/server'
import { sql, ArtistCatalog } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const genre = searchParams.get('genre')
  const status = searchParams.get('status')

  let artists: ArtistCatalog[]

  if (search || genre || status) {
    const conditions: string[] = []
    
    if (search) {
      conditions.push(`artist_name ILIKE '%${search}%'`)
    }
    if (genre) {
      conditions.push(`genre = '${genre}'`)
    }
    if (status) {
      conditions.push(`status = '${status}'`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    artists = await sql`SELECT * FROM artist_catalog ${sql.unsafe(whereClause)} ORDER BY created_at DESC` as ArtistCatalog[]
  } else {
    artists = await sql`SELECT * FROM artist_catalog ORDER BY created_at DESC` as ArtistCatalog[]
  }

  return NextResponse.json(artists)
}

export async function POST(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { artist_name, genre, country, bio, spotify_link, instagram_link, image_url, status } = body

  if (!artist_name || !genre || !country) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const result = await sql`
    INSERT INTO artist_catalog (artist_name, genre, country, bio, spotify_link, instagram_link, image_url, status)
    VALUES (${artist_name}, ${genre}, ${country}, ${bio || null}, ${spotify_link || null}, ${instagram_link || null}, ${image_url || null}, ${status || 'ACTIVE'})
    RETURNING *
  `

  return NextResponse.json(result[0])
}
