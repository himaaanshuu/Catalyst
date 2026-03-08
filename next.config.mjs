/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Image optimization for external URLs */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  /* Production optimization */
  reactStrictMode: true,

  /* Route compatibility: allow lowercase catalog links */
  async rewrites() {
    return [
      {
        source: '/catalog/:path*',
        destination: '/Catalog/:path*',
      },
    ];
  },
  
  /* Security headers */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
