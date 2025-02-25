'use client'

import { useState, useEffect } from 'react'
import { KayakReview } from '@/app/types'
import KayakReviewCard from './KayakReviewCard'

// Define API key at the top like weather app
const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
console.log('Environment check:', {
  isDev: process.env.NODE_ENV === 'development',
  hasApiKey: !!apiKey,
  keyLength: apiKey?.length,
  keyStart: apiKey?.substring(0, 8)
});

export default function KayakGrid() {
  const [reviews, setReviews] = useState<KayakReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{
    message: string;
    details?: string;
    status?: number | string | null;
  } | null>(null)
  const [rawApiResponse, setRawApiResponse] = useState<string>('')
  const [currentKayak, setCurrentKayak] = useState<KayakReview | null>(null)
  const [showResults, setShowResults] = useState(true)

  useEffect(() => {
    fetchKayakReviews()
  }, [])

  async function fetchKayakReviews() {
    try {
      setShowResults(true)
      
      // Log the API key (first few characters) for debugging
      console.log('API Key starts with:', apiKey?.substring(0, 4));
      
      const url = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',  
        headers: {
          'Authorization': `Bearer ${apiKey}`.trim(),
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://github.com/aitoolset/aihubkayakviews/',
          'X-Title': 'Kayak Reviews App'
        },
        body: JSON.stringify({
          model: 'google/gemini-flash-1.5-8b',
          messages: [{
            role: 'user',
            content: `List the top 5 most popular single-seat kayaks reviewed in the past 6 months. For any kayak with variable specifications, use the average or most common values. Format the response as a JSON array with kayak details including id, title, specs (length, width, weight, capacity, material, type, price, accessories, seats), summary, and reviewDate.`
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if(!url.ok) {
        setShowResults(false);
        const errorData = await url.text();
        console.error('API Error Response:', errorData);
        
        // Store the raw error response
        setRawApiResponse(errorData);
        
        // Try to parse the error response
        try {
          const errorJson = JSON.parse(errorData);
          throw new Error(`API Error (${url.status}): ${errorJson.error || errorJson.message || 'Unknown error'}`);
        } catch {
          throw new Error(`Failed to fetch kayak data: ${url.status}\n${errorData}`);
        }
      }

      const data = await url.json();
      console.log('API Response:', data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        // Clean up the AI response before parsing
        let content = data.choices[0].message.content;
        
        // Remove markdown code blocks if present
        content = content.replace(/```json\n?|\n?```/g, '');
        
        // Trim whitespace
        content = content.trim();
        
        try {
          const kayakData = JSON.parse(content);
          console.log('Parsed Kayak Data:', kayakData);
          
          if (Array.isArray(kayakData)) {
            setReviews(kayakData);
            setCurrentKayak(kayakData[0]);
            setRawApiResponse(JSON.stringify(kayakData, null, 2));
          } else {
            throw new Error('Response is not an array');
          }
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Content being parsed:', content);
          throw new Error('Failed to parse kayak data');
        }
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setShowResults(false);
      
      let errorMessage = 'Failed to fetch kayak data';
      let errorDetails = 'Please check your API key and try again';
      let status = null;

      if (err instanceof Error) {
        errorMessage = err.message;
        if (err.message.includes('401')) {
          errorDetails = 'Invalid or missing API key. Please check your environment variables.';
        }
      }
      
      setError({ 
        message: errorMessage,
        details: errorDetails,
        status: status
      });
    } finally {
      setLoading(false);
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
        
        {/* Error Response Box */}
        <div className="mx-auto max-w-2xl mt-4">
          <div className="bg-gray-800 rounded-lg p-4 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Error Response</span>
              <span className="text-red-500 text-sm">Status: {error.status || 'Unknown'}</span>
            </div>
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm whitespace-pre-wrap text-red-400">
              {rawApiResponse || 'No response data available'}
            </pre>
          </div>
        </div>

        <button 
          onClick={fetchKayakReviews} 
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!showResults) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">No results found</div>
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
              <div className="text-lg font-semibold">{currentKayak.specs.width}&quot;</div>
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