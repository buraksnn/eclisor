import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession, isAdmin } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { is_read } = body

  await sql`
    UPDATE contact_messages
    SET is_read = ${is_read}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${parseInt(id)}
  `

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  await sql`DELETE FROM contact_messages WHERE id = ${parseInt(id)}`

  return NextResponse.json({ success: true })
}
