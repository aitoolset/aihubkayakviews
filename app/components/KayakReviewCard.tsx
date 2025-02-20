'use client'
import { KayakReview } from '@/app/types'
import { useState, useEffect } from 'react'

interface Props {
  review: KayakReview
}

export default function KayakReviewCard({ review }: Props) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(review.title + ' kayak review')}`

  useEffect(() => {
    // Move the YouTube search to client-side
    const searchYouTube = async () => {
      try {
        const response = await fetch(searchUrl)
        const html = await response.text()
        const videoIdMatch = html.match(/watch\?v=([^"&]+)/)
        if (videoIdMatch) {
          setVideoUrl(`https://www.youtube.com/watch?v=${videoIdMatch[1]}`)
        }
      } catch (error) {
        console.error('Failed to fetch video:', error)
      }
    }

    searchYouTube()
  }, [review.title, searchUrl])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Video Search Link Section */}
      <div className="p-6 bg-gray-50">
        <a 
          href={videoUrl || searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {videoUrl ? `Watch ${review.title} Review` : `Search for ${review.title} Reviews`}
        </a>
      </div>

      {/* Specs Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{review.title}</h2>
        <div className="grid grid-cols-2 gap-4">
          <SpecRow label="Length" value={`${review.specs.length} ft`} />
          <SpecRow label="Width" value={`${review.specs.width} in`} />
          <SpecRow label="Weight" value={`${review.specs.weight} lbs`} />
          <SpecRow label="Capacity" value={`${review.specs.capacity} lbs`} />
          <SpecRow label="Material" value={review.specs.material} />
          <SpecRow label="Type" value={review.specs.type} />
          <SpecRow label="Price" value={`$${review.specs.price}`} />
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Summary</h3>
          <p className="text-gray-600 leading-relaxed">
            {review.summary}
          </p>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Reviewed: {new Date(review.reviewDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
} 