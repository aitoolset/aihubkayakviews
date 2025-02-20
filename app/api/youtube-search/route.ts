import { NextResponse } from 'next/server'

// Add these exports to configure static generation
export const dynamic = 'force-static'
export const revalidate = 3600 // revalidate every hour

// Pre-defined search results for static generation
const staticSearchResults = {
  'Perception Pescador Pro 12.0': 'https://www.youtube.com/watch?v=example1',
  'Old Town Vapor 10': 'https://www.youtube.com/watch?v=example2',
  'Wilderness Systems Pungo 120': 'https://www.youtube.com/watch?v=example3',
  // Add fallback for unknown searches
  'default': 'https://www.youtube.com/results?search_query=kayak+reviews'
}

export async function GET() {
  // For static builds, return a mapping of all possible results
  return NextResponse.json({ searchResults: staticSearchResults })
} 