'use client'

import { useState, useEffect } from 'react'
import { BikeReview } from '../types'
import BikeReviewCard from './BikeReviewCard'

export default function ElectricBikeGrid() {
  const [reviews, setReviews] = useState<BikeReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBikeReviews()
  }, [])

  async function fetchBikeReviews() {
    try {
      const response = await fetch('/api/bikes')
      if (!response.ok) {
        throw new Error('Failed to fetch bike reviews')
      }
      const data = await response.json()
      setReviews(data)
    } catch (err) {
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
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
      {reviews.map((review) => (
        <BikeReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
} 