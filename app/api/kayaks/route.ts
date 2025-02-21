import { NextResponse } from 'next/server'
import { queryOpenRouter } from '@/app/utils/openrouter'
import { KayakReview } from '@/app/types'

export const dynamic = 'force-static'
export const revalidate = 3600 // revalidate every hour

const prompt = `List the top 5 most popular single-seat kayaks reviewed in the past 6 months. For any kayak with variable specifications, use the average or most common values. Format the response as a JSON array with this structure:
{
  "id": (number),
  "title": (actual kayak name and model),
  "specs": {
    "length": (length in feet, use single number),
    "width": (width in inches, use single number),
    "weight": (weight in lbs, use single number),
    "capacity": (weight capacity in lbs, use single number),
    "material": (hull material),
    "type": (recreational/touring/fishing/etc),
    "price": (actual current price in USD, use single number),
    "accessories": (included accessories as comma-separated list),
    "seats": (number of seats, usually 1 for single-seat kayaks)
  },
  "summary": (3 sentences summarizing key features, performance, and value proposition),
  "reviewDate": (actual review publication date in YYYY-MM-DD format)
}`

function isValidKayakReview(review: unknown): review is KayakReview {
  const r = review as any
  return (
    typeof r === 'object' &&
    r !== null &&
    typeof r.id === 'number' &&
    typeof r.title === 'string' &&
    typeof r.specs === 'object' &&
    r.specs !== null &&
    (typeof r.specs.length === 'number' || typeof r.specs.length === 'string') &&
    (typeof r.specs.width === 'number' || typeof r.specs.width === 'string') &&
    (typeof r.specs.weight === 'number' || typeof r.specs.weight === 'string') &&
    (typeof r.specs.capacity === 'number' || typeof r.specs.capacity === 'string') &&
    typeof r.specs.material === 'string' &&
    typeof r.specs.type === 'string' &&
    (typeof r.specs.price === 'number' || typeof r.specs.price === 'string') &&
    typeof r.specs.accessories === 'string' &&
    (typeof r.specs.seats === 'number' || typeof r.specs.seats === 'string') &&
    typeof r.summary === 'string' &&
    typeof r.reviewDate === 'string'
  )
}

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(JSON.stringify(staticKayakData), {
      headers: { 'x-using-fallback': 'true' }
    })
  }

  try {
    const response = await queryOpenRouter(prompt)
    let kayakData: KayakReview[]

    try {
      // Parse the AI response
      const cleanContent = response.replace(/```json\n?|\n?```/g, '').trim()
      kayakData = JSON.parse(cleanContent)

      if (!Array.isArray(kayakData)) {
        console.error('Response is not an array:', kayakData)
        throw new Error('Invalid response format')
      }

      if (!kayakData.every(isValidKayakReview)) {
        console.error('Invalid kayak data structure:', kayakData)
        throw new Error('Invalid kayak data structure')
      }

      return NextResponse.json(kayakData)
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw response:', response)
      return new NextResponse(JSON.stringify(staticKayakData), {
        headers: { 'x-using-fallback': 'true' }
      })
    }
  } catch (error) {
    console.error('OpenRouter API error:', error)
    return new NextResponse(JSON.stringify(staticKayakData), {
      headers: { 'x-using-fallback': 'true' }
    })
  }
}

// Fallback static data
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