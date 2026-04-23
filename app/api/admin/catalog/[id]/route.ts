import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { artist_name, genre, country, bio, spotify_link, instagram_link, image_url, status } = body

  const result = await sql`
    UPDATE artist_catalog
    SET 
      artist_name = ${artist_name},
      genre = ${genre},
      country = ${country},
      bio = ${bio || null},
      spotify_link = ${spotify_link || null},
      instagram_link = ${instagram_link || null},
      image_url = ${image_url || null},
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${parseInt(id)}
    RETURNING *
  `

  return NextResponse.json(result[0])
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  await sql`DELETE FROM artist_catalog WHERE id = ${parseInt(id)}`

  return NextResponse.json({ success: true })
}
