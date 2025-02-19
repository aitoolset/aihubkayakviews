const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function queryOpenRouter(prompt: string) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://yourdomain.com', // Replace with your actual domain
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-opus-20240229',
      messages: [{
        role: 'user',
        content: prompt
      }],
    })
  })

  if (!response.ok) {
    throw new Error('Failed to fetch from OpenRouter API')
  }

  return response.json()
} 