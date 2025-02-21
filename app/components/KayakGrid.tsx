'use client'

import { useState, useEffect } from 'react'
import { KayakReview } from '@/app/types'
import KayakReviewCard from './KayakReviewCard'

export default function KayakGrid() {
  const [reviews, setReviews] = useState<KayakReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchKayakReviews()
  }, [])

  async function fetchKayakReviews() {
    try {
      // Simplified path for static deployment
      const response = await fetch('./data/kayaks.json')
      console.log('Fetching from:', './data/kayaks.json')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`Failed to fetch kayak reviews: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Received data:', data)
      
      if (!data.kayaks || !Array.isArray(data.kayaks)) {
        throw new Error('Invalid data format')
      }
      
      setReviews(data.kayaks)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
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
      <div className="text-center text-red-500 py-8">
        Error: {error}
        <br />
        <button 
          onClick={fetchKayakReviews} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-8">
        {reviews.map((review) => (
          <KayakReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
} 