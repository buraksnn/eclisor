import { NextResponse } from 'next/server'
import { sql, SiteSettings } from '@/lib/db'

export async function GET() {
  try {
    const settings = await sql`SELECT * FROM site_settings LIMIT 1`
    return NextResponse.json(settings[0] as SiteSettings || null)
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return NextResponse.json(null, { status: 500 })
  }
}
