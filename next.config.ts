import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The root tsconfig.json only references the app, node and products-api
  // projects, so Next.js type-checks the app project directly.
  typescript: { tsconfigPath: 'tsconfig.app.json' },
  // A package-lock.json in the parent folder must not be taken as the root.
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  // Browsers ask for /favicon.ico when a page has no icon link, for example
  // after an error; serve the RAHA icon instead of a 404.
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/raha.svg' }]
  },
}

export default nextConfig
