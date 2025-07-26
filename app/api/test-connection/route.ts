import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey, model, endpoint } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    let client: OpenAI
    let testModel = model

    // Configure client based on provider
    switch (provider) {
      case 'together':
        client = new OpenAI({
          baseURL: 'https://api.together.xyz/v1',
          apiKey: apiKey,
        })
        break
      
      case 'groq':
        client = new OpenAI({
          baseURL: 'https://api.groq.com/openai/v1',
          apiKey: apiKey,
        })
        break
      
      case 'openai':
        client = new OpenAI({
          apiKey: apiKey,
        })
        break
      
      case 'custom':
        if (!endpoint) {
          return NextResponse.json(
            { error: 'Custom endpoint is required' },
            { status: 400 }
          )
        }
        client = new OpenAI({
          baseURL: endpoint,
          apiKey: apiKey,
        })
        break
      
      default:
        return NextResponse.json(
          { error: 'Unsupported provider' },
          { status: 400 }
        )
    }

    // Test the connection with a simple request
    try {
      const response = await client.chat.completions.create({
        model: testModel,
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a connection test. Please respond with "Connection successful".'
          }
        ],
        max_tokens: 10,
        temperature: 0,
      })

      if (response.choices && response.choices.length > 0) {
        return NextResponse.json({ 
          success: true, 
          message: 'Connection successful',
          response: response.choices[0].message.content 
        })
      } else {
        return NextResponse.json(
          { error: 'No response from API' },
          { status: 400 }
        )
      }
    } catch (apiError: any) {
      console.error('API Test Error:', apiError)
      return NextResponse.json(
        { error: `API Error: ${apiError.message}` },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Test Connection Error:', error)
    return NextResponse.json(
      { error: 'Failed to test connection' },
      { status: 500 }
    )
  }
}