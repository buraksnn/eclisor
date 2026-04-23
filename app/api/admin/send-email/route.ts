import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { sendEmail } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    await requireAuth()
    const { to, subject, message } = await request.json()

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
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
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
