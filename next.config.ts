import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/engines'],
  },
  compiler: {
    reactRemoveProperties: true,
  },
};

export default nextConfig;
