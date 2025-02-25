/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: 'AIzaSyAF1Sk8VNQvQ5oYV7z09C2kXYPWyCOHoLw',
  },
  basePath: process.env.NODE_ENV === 'production' ? '/aihubkayakviews' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aihubkayakviews' : '',
}

// Add debug logging
console.log('Next.js config env check:', {
  hasApiKey: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  keyValue: process.env.NEXT_PUBLIC_GEMINI_API_KEY
});

module.exports = nextConfig 
