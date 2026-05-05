import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession, isAdmin } from '@/lib/auth'

export async function PATCH(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { ids, is_read } = body

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
  }

  const idList = ids.join(',')
  await sql`
    UPDATE contact_messages
    SET is_read = ${is_read}, updated_at = CURRENT_TIMESTAMP
    WHERE id IN (${sql.unsafe(idList)})
  `

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { ids } = body

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
  }

  const idList = ids.join(',')
  await sql`DELETE FROM contact_messages WHERE id IN (${sql.unsafe(idList)})`

  return NextResponse.json({ success: true })
}
