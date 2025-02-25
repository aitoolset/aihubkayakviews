'use client'

import { useState, useEffect } from 'react'
import { KayakReview } from '@/app/types'
import KayakReviewCard from './KayakReviewCard'

export default function KayakGrid() {
  const [reviews, setReviews] = useState<KayakReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{message: string; details?: string} | null>(null)
  const [rawApiResponse, setRawApiResponse] = useState<string>('')
  const [currentKayak, setCurrentKayak] = useState<KayakReview | null>(null)

  useEffect(() => {
    fetchKayakReviews()
  }, [])

  async function fetchKayakReviews() {
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/aihubkayakviews' : ''
      const response = await fetch(`${basePath}/api/kayaks`)
      
      if (!response.ok) {
        const errorText = await response.text()
        setRawApiResponse(errorText)
        throw new Error(`Failed to fetch kayak reviews: ${response.status}`)
      }

      const data = await response.json()

      if (Array.isArray(data) && data.length > 0) {
        // Process the kayak data
        const processedReviews = data.map(kayak => ({
          ...kayak,
          specs: {
            ...kayak.specs,
            price: Math.floor(kayak.specs.price)
          }
        }))

        setReviews(processedReviews)
        setCurrentKayak(processedReviews[0]) // Set first kayak as current
        setRawApiResponse(JSON.stringify(data, null, 2))
      } else {
        throw new Error('No kayak data available')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError({ 
        message: err instanceof Error ? err.message : 'Failed to fetch kayak data',
        details: 'Please try again later'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Error: {error.message}</div>
        {error.details && <div className="text-gray-600 text-sm mb-4">{error.details}</div>}
        <button onClick={fetchKayakReviews} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Current Kayak Display - Similar to current weather in the weather app */}
      {currentKayak && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentKayak.title}</h2>
              <p className="text-gray-600 mt-2">{currentKayak.summary}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                ${currentKayak.specs.price}
              </div>
              <div className="text-gray-500 text-sm">
                {currentKayak.specs.type}
              </div>
            </div>
          </div>
          
          {/* Specs Grid - Similar to weather details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-gray-500">Length</div>
              <div className="text-lg font-semibold">{currentKayak.specs.length}ft</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-gray-500">Width</div>
              <div className="text-lg font-semibold">{currentKayak.specs.width}"</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-gray-500">Weight</div>
              <div className="text-lg font-semibold">{currentKayak.specs.weight}lbs</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-gray-500">Capacity</div>
              <div className="text-lg font-semibold">{currentKayak.specs.capacity}lbs</div>
            </div>
          </div>
        </div>
      )}

      {/* Kayak List - Similar to forecast list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((kayak) => (
          <div 
            key={kayak.id}
            onClick={() => setCurrentKayak(kayak)}
            className={`cursor-pointer transition-all ${
              currentKayak?.id === kayak.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <KayakReviewCard review={kayak} />
          </div>
        ))}
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Raw API Response:</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm whitespace-pre-wrap">
          {rawApiResponse}
        </pre>
      </div>
    </div>
  )
} 