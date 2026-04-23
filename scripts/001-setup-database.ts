import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function setupDatabase() {
  console.log('Setting up database...')

  // Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'ADMIN',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  console.log('Created users table')

  // Create application_requests table
  await sql`
    CREATE TABLE IF NOT EXISTS application_requests (
      id SERIAL PRIMARY KEY,
      artist_name VARCHAR(255) NOT NULL,
      real_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      country VARCHAR(100) NOT NULL,
      genre VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      music_link VARCHAR(500),
      social_link VARCHAR(500),
      message TEXT,
      status VARCHAR(50) DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  console.log('Created application_requests table')

  // Create contact_messages table
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  console.log('Created contact_messages table')

  // Create artist_catalog table
  await sql`
    CREATE TABLE IF NOT EXISTS artist_catalog (
      id SERIAL PRIMARY KEY,
      artist_name VARCHAR(255) NOT NULL,
      genre VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL,
      bio TEXT,
      spotify_link VARCHAR(500),
      instagram_link VARCHAR(500),
      image_url VARCHAR(500),
      status VARCHAR(50) DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  console.log('Created artist_catalog table')

  // Create site_settings table
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      tagline VARCHAR(500) DEFAULT 'Your Sound. Your Universe.',
      contact_email VARCHAR(255) DEFAULT 'info@eclisor.com',
      location VARCHAR(255) DEFAULT 'Istanbul, Turkey',
      response_time VARCHAR(100) DEFAULT '48 hours',
      artist_count INTEGER DEFAULT 500,
      country_count INTEGER DEFAULT 50,
      stream_count VARCHAR(50) DEFAULT '10M+',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  console.log('Created site_settings table')

  console.log('Database setup complete!')
}

setupDatabase().catch(console.error)
