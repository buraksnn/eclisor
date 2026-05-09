import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth'

export async function POST() {
  try {
    await destroySession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Çıkış hatası:', error)
    return NextResponse.json({ error: 'Çıkış yapılamadı' }, { status: 500 })
  }
}
