import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { tagline, contact_email, location, response_time, artist_count, country_count, stream_count } = body

  // Check if settings exist
  const existing = await sql`SELECT id FROM site_settings LIMIT 1`

  if (existing.length > 0) {
    await sql`
      UPDATE site_settings
      SET 
        tagline = ${tagline},
        contact_email = ${contact_email},
        location = ${location},
        response_time = ${response_time},
        artist_count = ${artist_count},
        country_count = ${country_count},
        stream_count = ${stream_count},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${existing[0].id}
    `
  } else {
    await sql`
      INSERT INTO site_settings (tagline, contact_email, location, response_time, artist_count, country_count, stream_count)
      VALUES (${tagline}, ${contact_email}, ${location}, ${response_time}, ${artist_count}, ${country_count}, ${stream_count})
    `
  }

  return NextResponse.json({ success: true })
}
