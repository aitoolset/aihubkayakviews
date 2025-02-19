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
        console.error('Invalid data structure:', JSON.stringify(kayakData, null, 2))
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

// Type guard to validate kayak review data
function isValidKayakReview(review: any): review is KayakReview {
  return (
    typeof review === 'object' &&
    review !== null &&
    typeof review.id === 'number' &&
    typeof review.title === 'string' &&
    typeof review.specs === 'object' &&
    (typeof review.specs.length === 'string' || typeof review.specs.length === 'number') &&
    (typeof review.specs.width === 'string' || typeof review.specs.width === 'number') &&
    (typeof review.specs.weight === 'string' || typeof review.specs.weight === 'number') &&
    (typeof review.specs.capacity === 'string' || typeof review.specs.capacity === 'number') &&
    typeof review.specs.material === 'string' &&
    typeof review.specs.type === 'string' &&
    (typeof review.specs.price === 'string' || typeof review.specs.price === 'number') &&
    typeof review.specs.accessories === 'string' &&
    (typeof review.specs.seats === 'string' || typeof review.specs.seats === 'number') &&
    typeof review.summary === 'string' &&
    typeof review.reviewDate === 'string'
  )
} 