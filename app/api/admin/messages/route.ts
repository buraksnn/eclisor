import { NextResponse } from 'next/server'
import { sql, ContactMessage } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const subject = searchParams.get('subject')
  const read = searchParams.get('read')

  let messages: ContactMessage[]

  if (search || subject || read !== null) {
    const conditions: string[] = []
    
    if (search) {
      conditions.push(`(full_name ILIKE '%${search}%' OR email ILIKE '%${search}%' OR subject ILIKE '%${search}%')`)
    }
    if (subject) {
      conditions.push(`subject = '${subject}'`)
    }
    if (read === 'true') {
      conditions.push(`is_read = true`)
    } else if (read === 'false') {
      conditions.push(`is_read = false`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    messages = await sql`SELECT * FROM contact_messages ${sql.unsafe(whereClause)} ORDER BY created_at DESC` as ContactMessage[]
  } else {
    messages = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC` as ContactMessage[]
  }

  return NextResponse.json(messages)
}
