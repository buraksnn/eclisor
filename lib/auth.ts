import { cookies } from 'next/headers'
import { sql, User } from './db'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'eclisor_session'

function normalizeRole(role?: string): User['role'] {
  if (!role) {
    return 'user'
  }
  const normalized = role.toLowerCase()
  if (normalized === 'admin' || normalized === 'user') {
    return normalized
  }
  console.warn(`Invalid role value detected: ${role}`)
  return 'user'
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: number): Promise<string> {
  const sessionToken = crypto.randomUUID()
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE_NAME, `${userId}:${sessionToken}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  
  return sessionToken
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)
  
  if (!session?.value) {
    return null
  }
  
  const [userId] = session.value.split(':')
  
  if (!userId) {
    return null
  }
  
  const users = await sql`SELECT * FROM users WHERE id = ${parseInt(userId)}`
  
  if (users.length === 0) {
    return null
  }
  
  const user = users[0] as User
  return { ...user, role: normalizeRole(user.role) }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function login(email: string, password: string): Promise<User | null> {
  const users = await sql`SELECT * FROM users WHERE email = ${email}`
  
  if (users.length === 0) {
    return null
  }
  
  const user = users[0] as User
  const isValid = await verifyPassword(password, user.password)
  
  if (!isValid) {
    return null
  }
  
  await createSession(user.id)
  return { ...user, role: normalizeRole(user.role) }
}

export async function requireAuth(): Promise<User> {
  const user = await getSession()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export function isAdmin(user: User | null): user is User & { role: 'admin' } {
  return !!user && user.role === 'admin'
}

export async function requireAdmin(): Promise<User> {
  const user = await getSession()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!isAdmin(user)) {
    throw new Error('Forbidden')
  }

  return user
}
