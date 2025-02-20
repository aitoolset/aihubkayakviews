import { NextResponse } from 'next/server'
import { KayakReview } from '@/app/types'

// Add static configuration
export const dynamic = 'force-static'
export const revalidate = 3600 // revalidate every hour

// Pre-generated kayak data
const staticKayakData: KayakReview[] = [
  {
    id: 1,
    title: "Perception Pescador Pro 12.0",
    specs: {
      length: 12,
      width: 32.5,
      weight: 64,
      capacity: 375,
      material: "High-Density Polyethylene",
      type: "Fishing/Recreational",
      price: 939,
      accessories: "Adjustable seat, rod holders, tackle storage",
      seats: 1
    },
    summary: "The Pescador Pro 12.0 offers excellent stability and features for fishing enthusiasts. Its removable stadium-style seat provides all-day comfort. The kayak tracks well and offers ample storage options.",
    reviewDate: "2024-02-15"
  },
  {
    id: 2,
    title: "Old Town Vapor 10",
    specs: {
      length: 10,
      width: 28.5,
      weight: 47,
      capacity: 325,
      material: "Single Layer Polyethylene",
      type: "Recreational",
      price: 699,
      accessories: "Comfort Flex seat, paddle keeper, cup holder",
      seats: 1
    },
    summary: "The Old Town Vapor 10 is perfect for beginners and casual paddlers. It provides excellent stability and maneuverability in calm waters. The comfortable seat and easy-to-reach storage make it ideal for day trips.",
    reviewDate: "2024-01-20"
  },
  {
    id: 3,
    title: "Wilderness Systems Pungo 120",
    specs: {
      length: 12.2,
      width: 29,
      weight: 49,
      capacity: 325,
      material: "High-Grade Polyethylene",
      type: "Recreational/Touring",
      price: 1099,
      accessories: "Phase 3 AirPro seat, dashboard console, dry storage",
      seats: 1
    },
    summary: "The Pungo 120 combines speed with stability in a versatile package. Its award-winning design includes a spacious cockpit and premium features. The kayak excels in both lakes and coastal waters.",
    reviewDate: "2024-03-01"
  }
]

export async function GET() {
  return NextResponse.json(staticKayakData)
}

// First, let's create an interface for the unknown review object
interface UnknownReview {
  id: unknown
  title: unknown
  specs: {
    length: unknown
    width: unknown
    weight: unknown
    capacity: unknown
    material: unknown
    type: unknown
    price: unknown
    accessories: unknown
    seats: unknown
  }
  summary: unknown
  reviewDate: unknown
}

// Update the type guard function with detailed logging
function isValidKayakReview(review: unknown): review is KayakReview {
  const r = review as UnknownReview
  
  const validations = {
    isObject: typeof review === 'object' && review !== null,
    hasId: typeof r.id === 'number',
    hasTitle: typeof r.title === 'string',
    hasSpecs: typeof r.specs === 'object' && r.specs !== null,
    hasValidLength: typeof r.specs?.length === 'string' || typeof r.specs?.length === 'number',
    hasValidWidth: typeof r.specs?.width === 'string' || typeof r.specs?.width === 'number',
    hasValidWeight: typeof r.specs?.weight === 'string' || typeof r.specs?.weight === 'number',
    hasValidCapacity: typeof r.specs?.capacity === 'string' || typeof r.specs?.capacity === 'number',
    hasValidMaterial: typeof r.specs?.material === 'string',
    hasValidType: typeof r.specs?.type === 'string',
    hasValidPrice: typeof r.specs?.price === 'string' || typeof r.specs?.price === 'number',
    hasValidAccessories: typeof r.specs?.accessories === 'string',
    hasValidSeats: typeof r.specs?.seats === 'string' || typeof r.specs?.seats === 'number',
    hasValidSummary: typeof r.summary === 'string',
    hasValidReviewDate: typeof r.reviewDate === 'string'
  }

  // Log which validations failed
  const failedValidations = Object.entries(validations)
    .filter(([, passes]) => !passes)
    .map(([key]) => key)

  if (failedValidations.length > 0) {
    console.error('Validation failed for:', failedValidations)
    console.error('Received data:', JSON.stringify(review, null, 2))
  }

  return Object.values(validations).every(Boolean)
} 