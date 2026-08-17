/** @type {import('next').NextConfig} */
const nextConfig = {
  // Imagen Docker / Render: servidor autónomo (build en GitHub Actions)
  output: 'standalone',
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // Menos memoria en build (Render free ~512MB)
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,
  // Indicador "N" de desarrollo
  devIndicators: {
    position: 'bottom-right',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    'rate-limiter-flexible',
    '@prisma/client',
    '.prisma/client',
    '@prisma/adapter-mariadb',
    'mariadb',
    'mysql2',
    'bcryptjs',
    'pino',
    'pino-pretty',
  ],
  experimental: {
    // cpus:1 y webpackMemoryOptimizations solo en build (Render).
    // En Windows/dev dejan Next colgado en "Starting...".
    ...(process.env.NODE_ENV === 'production'
      ? { cpus: 1, webpackMemoryOptimizations: true }
      : {}),
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
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
  webpack: (config, { isServer, dev }) => {
    // Menos paralelismo = menos RAM en build
    if (!dev) {
      config.parallelism = 1;
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        minimize: true,
      };
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@opentelemetry/api': false,
        '@prisma/client': false,
        '@prisma/adapter-mariadb': false,
        mariadb: false,
        mysql2: false,
        bcryptjs: false,
        'rate-limiter-flexible': false,
        fs: false,
        net: false,
        tls: false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/prisma': false,
        '@/lib/ratelimit': false,
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
