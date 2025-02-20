/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Update this to match your GitHub repository name
  basePath: process.env.NODE_ENV === 'production' ? '/aihubkayakviews' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/placeskayakviews/' : '',
}

module.exports = nextConfig 
