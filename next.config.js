/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? 'https://github.com/aitoolset/aihubkayakviews' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/https://github.com/aitoolset/aihubkayakviews' : '',
}

module.exports = nextConfig 
