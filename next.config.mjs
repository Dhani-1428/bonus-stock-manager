/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Improve chunk loading reliability
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize chunk splitting for better loading
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Clerk vendor chunk
            clerk: {
              name: 'clerk',
              test: /[\\/]node_modules[\\/]@clerk[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Other vendor chunks
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
