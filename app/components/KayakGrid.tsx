'use client'

import { useState, useEffect } from 'react'
import { KayakReview } from '@/app/types'
import KayakReviewCard from './KayakReviewCard'

// Change the API key constant name
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function KayakGrid() {
  const [reviews, setReviews] = useState<KayakReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{
    message: string;
    details?: string;
    status?: number | string | null;
  } | null>(null)
  const [rawApiResponse, setRawApiResponse] = useState<string>('')
  const [showResults, setShowResults] = useState(true)

  useEffect(() => {
    fetchKayakReviews()
  }, [])

  async function fetchKayakReviews() {
    try {
      setShowResults(true)
      
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
      const requestData = {
        contents: [{
          parts: [{
            text: `Generate a JSON array of 5 popular single-seat kayaks. Format as:
            [
              {
                "id": 1,
                "title": "Kayak Name",
                "specs": {
                  "length": 10,
                  "width": 30,
                  "weight": 50,
                  "capacity": 300,
                  "material": "polyethylene",
                  "type": "sit-in",
                  "price": 499,
                  "accessories": ["paddle", "seat"],
                  "seats": 1
                },
                "summary": "Brief description of the kayak."
              }
            ]
            Keep descriptions under 100 characters. Return ONLY valid JSON. If the results aren't in Json, convert all the result to JSON.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,  // Lower temperature for more consistent output
          maxOutputTokens: 800,
        }
      };

      const url = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if(!url.ok) {
        setShowResults(false);
        const errorData = await url.text();
        console.error('API Error Response:', errorData);
        setRawApiResponse(errorData);
        throw new Error(`Failed to fetch kayak data: ${url.status}\n${errorData}`);
      }

      const data = await url.json();
      console.log('API Response:', data);

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        let content = data.candidates[0].content.parts[0].text;
        content = content.replace(/```json\n?|\n?```/g, '').trim();
        
        try {
          // Clean up units and formatting in the JSON string
          content = content
            // Remove any control characters and extra whitespace
            .replace(/[\n\r\t\s]+/g, ' ')
            // Fix unclosed quotes in strings with commas
            .replace(/",\s+and\s+/g, '. ')
            // Fix unclosed quotes in titles
            .replace(/("title":\s*"[^"]+)(?=,)/g, '$1"')
            // Fix unclosed quotes in summaries
            .replace(/("summary":\s*"[^"]+?)(?=",\s*")/g, '$1"')
            // Fix unclosed type values
            .replace(/"type":\s*"([^"]+)(?=,|\})/g, '"type": "$1"')
            // Fix price format
            .replace(/"price":\s*(\d+),(\d+)"/g, '"price": $1$2')
            // Handle measurements
            .replace(/"(length|width|weight|capacity)":\s*"(\d+(?:\.\d+)?)\s*(?:ft|"|lbs?)?"/g, '"$1": $2')
            // Fix seats format
            .replace(/"seats":\s*"(\d+)"/g, '"seats": $1')
            // Handle any trailing commas in arrays
            .replace(/,(\s*[\]}])/g, '$1')
            // Fix unclosed braces and brackets
            .replace(/}(?!\s*[,\]}])/g, '},')
            .replace(/](?!\s*[,\]}])/g, '],')
            // Remove any extra quotes around the entire JSON
            .replace(/^"/, '').replace(/"$/, '')
            // Ensure the JSON is complete
            .replace(/^(.+),\s*$/, '$1');

          console.log('Cleaned content:', content);
          const kayakData = JSON.parse(content);
          console.log('Parsed Kayak Data:', kayakData);
          
          if (Array.isArray(kayakData)) {
            const validKayaks = kayakData.filter(kayak => 
              kayak && 
              kayak.id && 
              kayak.title && 
              kayak.specs &&
              kayak.summary
            ).map(kayak => ({
              ...kayak,
              specs: {
                ...kayak.specs,
                // Convert all numeric values
                length: Number(kayak.specs.length || 0),
                width: Number(kayak.specs.width || 0),
                weight: Number(kayak.specs.weight || 0),
                capacity: Number(kayak.specs.capacity || 0),
                price: typeof kayak.specs.price === 'string' 
                  ? Number(kayak.specs.price.replace(/[^0-9.-]+/g, ''))
                  : Number(kayak.specs.price || 0),
                accessories: Array.isArray(kayak.specs.accessories) 
                  ? kayak.specs.accessories 
                  : [],
                seats: Number(kayak.specs.seats || 1)
              }
            }));

            if (validKayaks.length > 0) {
              setReviews(validKayaks);
              setRawApiResponse(JSON.stringify(validKayaks, null, 2));
            } else {
              throw new Error('No valid kayak entries found');
            }
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
      const status = null;

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
      {/* Kayak List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((kayak) => (
          <div key={kayak.id}>
            <KayakReviewCard review={kayak} />
          </div>
        ))}
      </div>
    </div>
  )
} 