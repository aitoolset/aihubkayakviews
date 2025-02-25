'use client'
import { KayakReview } from '@/app/types'

interface Props {
  review: KayakReview
}

export default function KayakReviewCard({ review }: Props) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(review.title + ' kayak review after:2023-01-01 before:2024-01-01' )}`

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{review.title}</h2>
          <p className="text-gray-600 mt-2 text-sm">{review.summary}</p>
          <a 
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block hover:underline"
          >
            View vids of kayak reviews
          </a>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            ${review.specs.price}
          </div>
          <div className="text-gray-500 text-sm">
            {review.specs.type}
          </div>
        </div>
      </div>
      
      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-500 text-sm">Length</div>
          <div className="text-base font-semibold">{review.specs.length}ft</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-500 text-sm">Width</div>
          <div className="text-base font-semibold">{review.specs.width}&quot;</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-500 text-sm">Weight</div>
          <div className="text-base font-semibold">{review.specs.weight}lbs</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-500 text-sm">Capacity</div>
          <div className="text-base font-semibold">{review.specs.capacity}lbs</div>
        </div>
      </div>

      {/* Accessories */}
      <div className="mt-4">
        <div className="text-gray-500 text-sm mb-2">Accessories:</div>
        <div className="flex flex-wrap gap-2">
          {review.specs.accessories.map((accessory, index) => (
            <span 
              key={index} 
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {accessory}
            </span>
          ))}
        </div>
      </div>

      {/* Review Date */}
      <div className="mt-4 text-right text-sm text-gray-500">
        Reviewed: {review.reviewDate}
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