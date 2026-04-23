import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, subject, message } = body

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await sql`
      INSERT INTO contact_messages (full_name, email, subject, message)
      VALUES (${fullName}, ${email}, ${subject}, ${message})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to create message:', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}
