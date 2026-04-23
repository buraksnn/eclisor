import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { ids, status } = body

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
  }

  const idList = ids.join(',')
  await sql`
    UPDATE application_requests
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id IN (${sql.unsafe(idList)})
  `

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { ids } = body

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
  }

  const idList = ids.join(',')
  await sql`DELETE FROM application_requests WHERE id IN (${sql.unsafe(idList)})`

  return NextResponse.json({ success: true })
}
