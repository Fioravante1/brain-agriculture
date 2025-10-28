import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  compiler: {
    reactRemoveProperties: true,
  },
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;
