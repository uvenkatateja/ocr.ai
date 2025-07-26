import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    })

    if (!settings) {
      // Return default settings
      return NextResponse.json({
        apiProvider: 'together',
        model: 'meta-llama/Llama-Vision-Free',
        useOwnKeys: false,
        ocrPrompt: 'Extract all readable text from this image and format it as clean, well-structured Markdown. Preserve any formatting, headings, lists, or structure you can identify. If there are tables, format them as Markdown tables. Return only the extracted text in Markdown format.'
      })
    }

    // Don't return the actual API key for security
    return NextResponse.json({
      ...settings,
      apiKey: settings.apiKey ? '••••••••' : ''
    })
  } catch (error) {
    console.error('Settings GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { apiProvider, apiKey, model, customEndpoint, useOwnKeys, ocrPrompt } = data

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        apiProvider,
        apiKey: apiKey === '••••••••' ? undefined : apiKey, // Don't update if masked
        model,
        customEndpoint,
        useOwnKeys,
        ocrPrompt,
      },
      create: {
        userId,
        apiProvider,
        apiKey,
        model,
        customEndpoint,
        useOwnKeys,
        ocrPrompt,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}