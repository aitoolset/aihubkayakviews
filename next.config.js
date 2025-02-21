/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/aitoolset/aihubkayakviews' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aitoolset/aihubkayakviews' : '',
}

module.exports = nextConfig 
