/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Match legacy WordPress URLs (trailing slash) from page-sitemap.xml */
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon-192.png',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
