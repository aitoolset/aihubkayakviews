import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`)
    const html = await response.text()

    // Extract first video ID from the response
    const videoIdMatch = html.match(/watch\?v=([^"&]+)/)
    if (!videoIdMatch) {
      throw new Error('No video found')
    }

    const videoId = videoIdMatch[1]
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

    return NextResponse.json({ videoUrl })
  } catch (error) {
    console.error('YouTube search error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch YouTube results' },
      { status: 500 }
    )
  }
} 