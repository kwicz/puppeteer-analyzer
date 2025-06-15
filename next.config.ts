import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
    // Ignore specific directories
    dirs: ['pages', 'utils', 'components', 'lib', 'app'],
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Optimize build performance
  experimental: {
    optimizePackageImports: ['@prisma/client'],
  },
  // Reduce build output
  output: 'standalone',
};

export default nextConfig;
