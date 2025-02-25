const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
console.log('OpenRouter API Key check:', {
  hasKey: !!OPENROUTER_API_KEY,
  keyStart: OPENROUTER_API_KEY?.substring(0, 8)
});

if (!OPENROUTER_API_KEY) {
  console.error('OpenRouter API key is not configured')
}

export async function queryOpenRouter(prompt: string) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured. Please check your environment variables.')
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://github.com/aitoolset/aihubkayakviews/',
      'X-Title': 'Kayak Reviews App',
    },
    body: JSON.stringify({
      model: 'google/gemini-flash-1.5-8b"',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('OpenRouter API Response:', errorData)
    throw new Error(`OpenRouter API error (${response.status}): ${errorData}`)
  }

  const data = await response.json()
  
  if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('Unexpected API response structure:', data)
    throw new Error('Invalid API response structure')
  }

  return data.choices[0].message.content
} 