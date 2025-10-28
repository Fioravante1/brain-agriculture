import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    esmExternals: true,
  },
  compiler: {
    reactRemoveProperties: true,
  },
};

export default nextConfig;
