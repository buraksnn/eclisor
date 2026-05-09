import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession, hashPassword, isAdmin, verifyPassword } from '@/lib/auth'

export async function PATCH(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Erişim reddedildi' }, { status: 403 })
  }

  const body = await request.json()
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
  }

  // Verify current password
  const isValid = await verifyPassword(currentPassword, user.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Mevcut şifre hatalı' }, { status: 400 })
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword)

  await sql`
    UPDATE users
    SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${user.id}
  `

  return NextResponse.json({ success: true })
}
