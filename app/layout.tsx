import type { Metadata, Viewport } from 'next'
import { Lexend, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/components/providers'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})
const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Eclisor | Your Sound. Your Universe.',
  description: 'Premium music distribution agency. We distribute your music worldwide and connect you with the right opportunities.',
  keywords: ['music distribution', 'artist development', 'sync licensing', 'music promotion'],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16' },
      { url: '/favicon-32x32.png', sizes: '32x32' },
      { url: '/android-chrome-192x192.png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${outfit.variable} ${lexend.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'oklch(0.15 0.02 280 / 0.9)',
                color: 'oklch(0.95 0 0)',
                border: '1px solid oklch(1 0 0 / 0.1)',
                backdropFilter: 'blur(16px)',
              },
            }}
          />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
    </html>
  )
}
