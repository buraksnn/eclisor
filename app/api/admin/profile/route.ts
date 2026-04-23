import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, email } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await sql`
    UPDATE users
    SET name = ${name}, email = ${email}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${user.id}
  `

  return NextResponse.json({ success: true })
}
