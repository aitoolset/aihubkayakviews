const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site-domain.com'

export async function queryOpenRouter(prompt: string) {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': 'Electric Bike Reviews',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5-8b", // Changed to use Gemini model
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Response:', errorData)
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    return response.json()
  } catch (error) {
    console.error('OpenRouter API Error:', {
      error,
      apiKey: OPENROUTER_API_KEY ? 'Present' : 'Missing',
      url: OPENROUTER_API_URL
    })
    throw error
  }
} 