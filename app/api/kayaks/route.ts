import { NextResponse } from 'next/server'
import { queryOpenRouter } from '@/app/utils/openrouter'
import { KayakReview } from '@/app/types'

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

// Create a type for the validation check
type UnknownObject = {
  [key: string]: unknown
}

function isValidKayakReview(review: unknown): review is KayakReview {
  if (!review || typeof review !== 'object') return false
  const r = review as UnknownObject

  // Helper function to check number or string type
  const isNumberOrString = (value: unknown): value is number | string => 
    typeof value === 'number' || typeof value === 'string'

  // Check specs object structure
  const specs = r.specs as UnknownObject | undefined
  if (!specs || typeof specs !== 'object') return false

  return (
    typeof r.id === 'number' &&
    typeof r.title === 'string' &&
    typeof specs === 'object' &&
    specs !== null &&
    isNumberOrString(specs.length) &&
    isNumberOrString(specs.width) &&
    isNumberOrString(specs.weight) &&
    isNumberOrString(specs.capacity) &&
    typeof specs.material === 'string' &&
    typeof specs.type === 'string' &&
    isNumberOrString(specs.price) &&
    typeof specs.accessories === 'string' &&
    isNumberOrString(specs.seats) &&
    typeof r.summary === 'string' &&
    typeof r.reviewDate === 'string'
  )
}

// For static export, we'll generate a static JSON file
export async function generateStaticParams() {
  return [{
    error: 'API endpoint not available in static export',
    details: 'This endpoint requires a server environment'
  }]
}

// Middleware to handle static export
async function handleStaticExport(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(JSON.stringify({
      error: 'API endpoint not available in static export',
      details: 'This endpoint requires a server environment'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  return null
}

export async function GET(req: Request) {
  // Check for static export first
  const staticResponse = await handleStaticExport(req)
  if (staticResponse) return staticResponse

  try {
    if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
      return new NextResponse(JSON.stringify({ 
        error: 'OpenRouter API key is not configured',
        details: 'Please check your environment variables'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = await queryOpenRouter(prompt)
    let kayakData: KayakReview[]

    try {
      // First try parsing the whole response
      let cleanContent = response.replace(/```json\n?|\n?```/g, '').trim()
      
      // Add closing bracket if missing
      if (cleanContent.endsWith('{')) {
        cleanContent += '}'
      }
      if (!cleanContent.endsWith(']')) {
        cleanContent += ']'
      }
      
      try {
        kayakData = JSON.parse(cleanContent)
      } catch {
        // If parsing fails, try to extract complete entries
        const entries = cleanContent.match(/\{[^{]*"id":[^}]*"reviewDate":[^}]*\}/g) || []
        
        if (entries.length > 0) {
          // Take only up to 4 entries
          const validEntries = entries.slice(0, 4).filter((entry: string) => {
            try {
              JSON.parse(entry)
              return true
            } catch {
              return false
            }
          })

          if (validEntries.length === 0) {
            return new NextResponse(JSON.stringify({ 
              error: 'No valid entries found',
              details: 'Could not parse any complete kayak entries'
            }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            })
          }

          // Reconstruct the array
          cleanContent = `[${validEntries.join(',')}]`
          kayakData = JSON.parse(cleanContent)
          console.log('Recovered partial data:', kayakData)
        } else {
          return new NextResponse(JSON.stringify({ 
            error: 'No valid kayak entries found',
            details: 'Response did not contain any valid kayak data'
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      }

      if (!Array.isArray(kayakData)) {
        console.error('Response is not an array:', kayakData)
        return new NextResponse(JSON.stringify({ 
          error: 'Invalid response format',
          details: 'API response was not an array'
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Always limit to 4 entries
      const validKayaks = kayakData
        .filter(isValidKayakReview)
        .slice(0, 4)

      if (validKayaks.length === 0) {
        return new NextResponse(JSON.stringify({ 
          error: 'No valid kayak entries found',
          details: 'API response contained no valid kayak data'
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      console.log(`Found ${validKayaks.length} valid kayak entries`)
      return NextResponse.json(validKayaks)
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      console.error('Error parsing AI response:', parseError)
      console.error('Raw response:', response)
      return new NextResponse(JSON.stringify({ 
        error: 'Failed to parse API response',
        details: errorMessage
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown API error'
    console.error('OpenRouter API error:', error)
    return new NextResponse(JSON.stringify({ 
      error: 'OpenRouter API error',
      details: errorMessage
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 