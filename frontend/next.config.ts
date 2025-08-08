import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// This is for local development
// const nextConfig: NextConfig = {
//   output: 'standalone',
//   images: {
//     domains: ['images.pexels.com', 'cdn.pixabay.com'],
//   },
//   async rewrites() {
//     return [
//       {
//         source: '/api/v1/:path*',
//         destination: 'http://localhost:3001/api/v1/:path*',
//       },
//     ];
//   },
// };

// Export the Next.js configuration
// This is for docker on ec2 instance
const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.pexels.com', 'cdn.pixabay.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:3001/api/v1/:path*',
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);