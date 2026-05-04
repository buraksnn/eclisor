'use server'

import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { createSession, hashPassword } from '@/lib/auth'

export type RegisterState = {
  error?: string
}

export async function registerUser(_: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')

  if (!name || !email || !password) {
    return { error: 'Please fill in all required fields.' }
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
  if (existing.length > 0) {
    return { error: 'An account with this email already exists.' }
  }

  const hashedPassword = await hashPassword(password)
  const result = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES (${name}, ${email}, ${hashedPassword}, 'user')
    RETURNING id
  `

  await createSession(result[0].id as number)
  redirect('/dashboard/upload')
}
