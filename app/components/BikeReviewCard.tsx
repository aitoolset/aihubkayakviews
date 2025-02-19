import { BikeReview } from '../types'
import { useEffect, useState } from 'react'

interface BikeReviewCardProps {
  review: BikeReview
}

export default function BikeReviewCard({ review }: BikeReviewCardProps) {
  const [videoId, setVideoId] = useState<string | null>(null)

  useEffect(() => {
    // Extract YouTube video ID from URL
    const extractVideoId = (url: string) => {
      const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/)
      return match ? match[1] : null
    }
    
    setVideoId(extractVideoId(review.videoUrl))
  }, [review.videoUrl])

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-lg border border-gray-200 shadow-sm">
      {/* Video Section */}
      <div className="md:w-1/2">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              Video not available
            </div>
          )}
        </div>
      </div>

      {/* Specs Section */}
      <div className="md:w-1/2">
        <h2 className="text-xl font-bold mb-4">{review.title}</h2>
        <div className="space-y-2">
          <SpecRow label="Range" value={review.specs.range} />
          <SpecRow label="Top Speed" value={review.specs.topSpeed} />
          <SpecRow label="Motor" value={review.specs.motor} />
          <SpecRow label="Battery" value={review.specs.battery} />
          <SpecRow label="Weight" value={review.specs.weight} />
          <SpecRow label="Price" value={review.specs.price} />
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Reviewed: {new Date(review.reviewDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  )
} 