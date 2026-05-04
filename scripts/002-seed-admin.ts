import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const sql = neon(process.env.DATABASE_URL!)
const ADMIN_ROLE: 'admin' = 'admin'

async function seed() {
  console.log('Seeding admin user...')

  // Hash password: admin123
  const hashedPassword = await bcrypt.hash('admin123', 10)
  console.log('Password hashed')

  // Delete existing admin if any
  await sql`DELETE FROM users WHERE email = 'admin@eclisor.com'`

  // Insert admin user
  await sql`
    INSERT INTO users (name, email, password, role)
    VALUES ('Admin', 'admin@eclisor.com', ${hashedPassword}, ${ADMIN_ROLE})
  `

  console.log('Admin user created: admin@eclisor.com / admin123')

  // Ensure site settings exist
  const settings = await sql`SELECT * FROM site_settings LIMIT 1`
  if (settings.length === 0) {
    await sql`
      INSERT INTO site_settings (tagline, contact_email, location, response_time, artist_count, country_count, stream_count)
      VALUES ('Your Sound. Your Universe.', 'info@eclisor.com', 'Istanbul, Turkey', '48 hours', 500, 50, '10M+')
    `
    console.log('Site settings created')
  }

  console.log('Seeding complete!')
}

seed().catch(console.error)
