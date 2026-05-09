import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { sendEmail } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, subject, message } = body

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    await sql`
      INSERT INTO contact_messages (full_name, email, subject, message)
      VALUES (${fullName}, ${email}, ${subject}, ${message})
    `

    await sendEmail({
      to: 'info@eclisor.com',
      subject: `Yeni İletişim: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366F1;">Yeni İletişim Mesajı</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold;">İsim:</td>
              <td style="padding: 8px;">${fullName}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">E-posta:</td>
              <td style="padding: 8px;">
                <a href="mailto:${email}">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Konu:</td>
              <td style="padding: 8px;">${subject}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Mesaj:</td>
              <td style="padding: 8px;">${message}</td>
            </tr>
          </table>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">
            eclisor.com üzerinden gönderildi
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to create message:', error)
    return NextResponse.json({ error: 'Mesaj oluşturulamadı' }, { status: 500 })
  }
}
