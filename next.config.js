/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['formidable'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'formidable': 'commonjs formidable'
      })
      
      // 忽略formidable的动态导入警告
      config.ignoreWarnings = [
        /Critical dependency: the request of a dependency is an expression/,
        /Module not found: Error: Can't resolve.*formidable/,
      ]
    }
    return config
  },
  images: {
    domains: ['images.unsplash.com','www.jomalone.com.cn','odebusiness.oss-cn-beijing.aliyuncs.com'],
  },
}

module.exports = nextConfig 