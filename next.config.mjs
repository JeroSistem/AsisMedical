/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Indicador "N" de desarrollo: esquina opuesta (inferior derecha)
  devIndicators: {
    position: 'bottom-right',
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-collapsible',
    ],
  },
  env: {
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'es',
    NEXT_PUBLIC_AVAILABLE_LOCALES: process.env.NEXT_PUBLIC_AVAILABLE_LOCALES || 'es',
    NEXT_PUBLIC_FORCE_SPANISH: process.env.NEXT_PUBLIC_FORCE_SPANISH || 'true',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@opentelemetry/api': false,
        '@prisma/client': false,
        '@prisma/adapter-pg': false,
        pg: false,
        bcryptjs: false,
      };
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          '@opentelemetry/api': 'commonjs @opentelemetry/api',
          '@prisma/client': 'commonjs @prisma/client',
          '@prisma/adapter-pg': 'commonjs @prisma/adapter-pg',
          pg: 'commonjs pg',
        });
      }
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/prisma': false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
