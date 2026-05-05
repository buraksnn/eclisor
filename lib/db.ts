import { neon } from '@neondatabase/serverless'
import type { UserRole } from './roles'

export const sql = neon(process.env.DATABASE_URL!)

export type User = {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  created_at: Date
  updated_at: Date
}

export type ApplicationRequest = {
  id: number
  artist_name: string
  real_name: string
  email: string
  country: string
  genre: string
  type: string
  music_link: string | null
  social_link: string | null
  message: string | null
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED'
  created_at: Date
  updated_at: Date
}

export type ContactMessage = {
  id: number
  full_name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: Date
  updated_at: Date
}

export type ArtistCatalog = {
  id: number
  artist_name: string
  genre: string
  country: string
  bio: string | null
  spotify_link: string | null
  instagram_link: string | null
  image_url: string | null
  status: 'ACTIVE' | 'INACTIVE'
  created_at: Date
  updated_at: Date
}

export type SiteSettings = {
  id: number
  tagline: string
  contact_email: string
  location: string
  response_time: string
  artist_count: number
  country_count: number
  stream_count: string
  updated_at: Date
}

export type Release = {
  id: number
  user_id: number
  title: string
  artist_name: string
  genre: string
  isrc: string
  release_date: string
  audio_url: string
  cover_url: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: Date
  updated_at: Date
}
