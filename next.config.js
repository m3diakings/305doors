/** @type {import('next').NextConfig} */
const nextConfig = {
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
