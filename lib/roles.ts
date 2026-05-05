export type UserRole = 'user' | 'admin'

export const ADMIN_ROLE: UserRole = 'admin'
export const USER_ROLE: UserRole = 'user'

export function isAdminRole(role?: string | null): role is 'admin' {
  return role === 'admin'
}
