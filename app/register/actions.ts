'use server'

import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { createSession, hashPassword } from '@/lib/auth'
import { USER_ROLE } from '@/lib/roles'

export type RegisterState = {
  error?: string
}

export async function registerUser(_: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')

  if (!name || !email || !password) {
    return { error: 'Lütfen tüm zorunlu alanları doldurun.' }
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
  if (existing.length > 0) {
    return { error: 'Bu e-posta ile kayıtlı bir hesap zaten var.' }
  }

  const hashedPassword = await hashPassword(password)
  const result = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES (${name}, ${email}, ${hashedPassword}, ${USER_ROLE})
    RETURNING id
  `

  await createSession(result[0].id as number)
  redirect('/dashboard')
}
