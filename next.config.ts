import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: true,
  },
  compiler: {
    reactRemoveProperties: true,
  },
};

export default nextConfig;
