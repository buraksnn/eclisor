import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { artistName, realName, email, country, genre, type, musicLink, socialLink, message } = body

    if (!artistName || !realName || !email || !country || !genre || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await sql`
      INSERT INTO application_requests (artist_name, real_name, email, country, genre, type, music_link, social_link, message)
      VALUES (${artistName}, ${realName}, ${email}, ${country}, ${genre}, ${type}, ${musicLink || null}, ${socialLink || null}, ${message || null})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to create application:', error)
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}
