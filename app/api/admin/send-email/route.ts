import { NextResponse } from 'next/server'
import { getSession, isAdmin } from '@/lib/auth'
import { sendEmail } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }
    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Erişim reddedildi' }, { status: 403 })
    }
    const { to, subject, message } = await request.json()

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Eksik alanlar' }, { status: 400 })
    }

    await sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${message}</p>
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #888; font-size: 12px;">
            Eclisor — info@eclisor.com
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'E-posta gönderilemedi' }, { status: 500 })
  }
}
