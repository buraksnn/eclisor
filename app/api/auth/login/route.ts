import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Eksik giriş bilgisi' }, { status: 400 })
    }

    const user = await login(email, password)

    if (!user) {
      return NextResponse.json({ error: 'Giriş bilgileri hatalı' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Giriş hatası:', error)
    return NextResponse.json({ error: 'Kimlik doğrulama başarısız' }, { status: 500 })
  }
}
