export default function sitemap() {
  const base = 'https://eclisor.com'
  const routes = ['', '/about', '/pricing', '/contact', '/privacy-policy', '/terms-of-service']

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.7,
  }))
}
