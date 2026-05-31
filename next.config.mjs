/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/login', destination: '/', permanent: false },
      { source: '/register', destination: '/', permanent: false },
      { source: '/dashboard', destination: '/', permanent: false },
      { source: '/dashboard/:path*', destination: '/', permanent: false },
      { source: '/admin', destination: '/', permanent: false },
      { source: '/admin/:path*', destination: '/', permanent: false },
    ]
  },
}

export default nextConfig
