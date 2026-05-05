import { NextResponse } from 'next/server'
import { sql, ApplicationRequest } from '@/lib/db'
import { getSession, isAdmin } from '@/lib/auth'

export async function GET(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status')
  const genre = searchParams.get('genre')
  const type = searchParams.get('type')

  let applications: ApplicationRequest[]

  if (search || status || genre || type) {
    const conditions: string[] = []
    
    if (search) {
      conditions.push(`(artist_name ILIKE '%${search}%' OR email ILIKE '%${search}%' OR real_name ILIKE '%${search}%')`)
    }
    if (status) {
      conditions.push(`status = '${status}'`)
    }
    if (genre) {
      conditions.push(`genre = '${genre}'`)
    }
    if (type) {
      conditions.push(`type = '${type}'`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    applications = await sql`SELECT * FROM application_requests ${sql.unsafe(whereClause)} ORDER BY created_at DESC` as ApplicationRequest[]
  } else {
    applications = await sql`SELECT * FROM application_requests ORDER BY created_at DESC` as ApplicationRequest[]
  }

  return NextResponse.json(applications)
}
