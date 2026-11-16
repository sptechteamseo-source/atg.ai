/** @type {import('next').NextConfig} */
const nextConfig = {
  // One canonical URL shape: no trailing slash. Next.js permanently redirects
  // `/path/` → `/path`, eliminating trailing-slash duplicate URLs.
  trailingSlash: false,
  // NOTE: the /usecases → /use-cases rename is a true 301 in middleware.ts
  // (Next's redirects() would emit a 308). See the static rename block there.

  // Enforce HTTPS at the browser level. Once a browser sees this header it will
  // refuse to issue plain-HTTP requests to the domain for `max-age` seconds.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },

  images: {
    // Runtime optimizer is on (deployment runs `next start` + sharp is installed),
    // so every next/image serves resized, lazy-loaded AVIF/WebP variants per viewport.
    // AVIF first (smallest), WebP fallback; browsers without either get the original.
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400, // 31 days — optimized variants change rarely
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },

  // Prevent Next.js from bundling Node.js-only packages into the server bundle.
  // cloudinary uses Node.js built-ins (crypto, https, stream) that cannot run
  // in the Edge runtime or be webpack-bundled — they must stay as externals.
  serverExternalPackages: ['cloudinary'],
};

export default nextConfig;
