import { NextResponse } from 'next/server'
import { queryOpenRouter } from '@/app/utils/openrouter'
import { KayakReview } from '@/app/types'

export async function GET() {
  try {
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

    const response = await queryOpenRouter(prompt)
    console.log('Raw API Response:', JSON.stringify(response, null, 2))

    if (!response.choices?.[0]?.message?.content) {
      console.error('Unexpected API response structure:', response)
      throw new Error('Invalid API response structure')
    }

    let kayakData: KayakReview[]
    try {
      const content = response.choices[0].message.content
      console.log('Content type:', typeof content)
      console.log('Raw content:', content)
      
      // Clean up the content by removing markdown code block markers
      const cleanContent = content
        .replace(/```json\n/, '') // Remove opening ```json
        .replace(/\n```[\s\S]*$/, '') // Remove closing ``` and any text after
        .trim()
      
      console.log('Cleaned content:', cleanContent)
      
      // If content is an array of objects, parse it directly
      if (typeof content === 'object' && Array.isArray(content)) {
        kayakData = content
        console.log('Using content directly:', kayakData)
      } else if (typeof content === 'string') {
        // If content is a string, parse the cleaned JSON
        console.log('Attempting to parse content as JSON:', cleanContent)
        try {
          kayakData = JSON.parse(cleanContent)
          console.log('Successfully parsed JSON:', kayakData)
        } catch (parseError) {
          console.error('JSON parse error:', parseError)
          throw parseError
        }
      } else {
        console.error('Unexpected content type:', typeof content)
        throw new Error(`Unexpected content type: ${typeof content}`)
      }
      
      if (!Array.isArray(kayakData)) {
        console.error('Data is not an array:', kayakData)
        throw new Error('Data is not an array')
      }

      if (!kayakData.every(isValidKayakReview)) {
        console.error('Invalid data structure. Raw data:', JSON.stringify(kayakData, null, 2))
        console.error('Content type:', typeof kayakData)
        throw new Error('Invalid kayak data structure')
      }
    } catch (e) {
      console.error('Error parsing AI response:', e)
      throw new Error('Failed to parse kayak data')
    }
    
    return NextResponse.json(kayakData)
  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    })
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch kayak data' },
      { status: 500 }
    )
  }
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
    .filter(([_, passes]) => !passes)
    .map(([key]) => key)

  if (failedValidations.length > 0) {
    console.error('Validation failed for:', failedValidations)
    console.error('Received data:', JSON.stringify(review, null, 2))
  }

  return Object.values(validations).every(Boolean)
} 