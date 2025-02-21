'use client'

import { useState, useEffect } from 'react'
import { KayakReview } from '@/app/types'
import KayakReviewCard from './KayakReviewCard'

export default function KayakGrid() {
  const [reviews, setReviews] = useState<KayakReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{message: string; details?: string} | null>(null)
  const [isUsingCache, setIsUsingCache] = useState(false)

  useEffect(() => {
    fetchKayakReviews()
  }, [])

  async function fetchKayakReviews() {
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/placeskayakviews' : ''
      const response = await fetch(`${basePath}/data/kayaks.json`)
      console.log('Fetching from:', `${basePath}/data/kayaks.json`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`Failed to fetch kayak reviews: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Received data:', data)
      setReviews(data.kayaks)
      setIsUsingCache(response.headers.get('x-using-fallback') === 'true')
    } catch (err) {
      console.error('Fetch error:', err)
      let errorMessage = 'An error occurred'
      let errorDetails = ''
      
      if (err instanceof Error) {
        errorMessage = err.message
        if (err.message.includes('Failed to fetch')) {
          errorDetails = 'API connection failed. Please check your internet connection.'
        } else if (err.message.includes('Invalid response format')) {
          errorDetails = 'The API returned data in an unexpected format.'
        } else if (err.message.includes('Invalid kayak data')) {
          errorDetails = 'The API returned invalid kayak data.'
        }
      }
      
      setError({ message: errorMessage, details: errorDetails })
      setIsUsingCache(true)
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
        {error.details && (
          <div className="text-gray-600 text-sm mb-4">{error.details}</div>
        )}
        <button 
          onClick={fetchKayakReviews} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
        {isUsingCache && reviews.length > 0 && (
          <div className="mt-8">
            <div className="text-gray-500 mb-4">Showing cached data:</div>
            <div className="flex flex-col gap-8">
              {reviews.map((review) => (
                <KayakReviewCard key={review.id} review={review} />
              ))}
              <div className="text-center text-gray-500 text-sm mt-4 pb-4">
                Cached data
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-8">
        {reviews.map((review) => (
          <KayakReviewCard key={review.id} review={review} />
        ))}
        {isUsingCache && (
          <div className="text-center text-gray-500 text-sm mt-4 pb-4">
            Cached data
          </div>
        )}
      </div>
    </div>
  )
} 