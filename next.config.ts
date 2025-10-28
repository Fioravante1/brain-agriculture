import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    esmExternals: true,
  },
  compiler: {
    reactRemoveProperties: true,
  },
  // Força o Next.js a usar apenas App Router e ignorar /pages
  // Referência: https://feature-sliced.design/docs/guides/tech/with-nextjs
  // A pasta /pages vazia na raiz existe apenas para evitar que o Next.js
  // use /src/page-compositions como Pages Router
};

export default nextConfig;
