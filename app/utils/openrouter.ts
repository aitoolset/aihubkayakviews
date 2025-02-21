const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY

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
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://github.com/yourusername/placeskayakviews',
      'X-Title': 'Kayak Reviews App',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-sonnet',
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
  return data.choices[0].message.content
} 