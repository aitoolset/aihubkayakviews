import { NextResponse } from 'next/server'
import { queryOpenRouter } from '@/app/utils/openrouter'

export async function GET() {
  try {
    const prompt = `Please provide information about the top 3 most popular electric bikes reviewed in the past 3 months. For each bike, include:
    - Title of the review
    - A YouTube video URL for the review
    - Specifications including:
      * Range
      * Top Speed
      * Motor details
      * Battery specifications
      * Weight
      * Price
    Format the response as a JSON array matching the BikeReview interface.`

    const response = await queryOpenRouter(prompt)
    
    // Parse and validate the AI response
    const bikeData = JSON.parse(response.choices[0].message.content)
    
    return NextResponse.json(bikeData)
  } catch (error) {
    console.error('Error fetching bike data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bike data' },
      { status: 500 }
    )
  }
} 