import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { ocrTextFromImage, ocrWithCustomSettings } from '@/lib/together'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const { userId } = auth()
    let markdown: string

    // Check if user has custom settings
    if (userId) {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId },
      })

      if (userSettings && userSettings.useOwnKeys && userSettings.apiKey) {
        // Use user's custom API settings
        markdown = await ocrWithCustomSettings(imageUrl, {
          provider: userSettings.apiProvider,
          apiKey: userSettings.apiKey,
          model: userSettings.model,
          customEndpoint: userSettings.customEndpoint,
          prompt: userSettings.ocrPrompt,
        })
      } else {
        // Use default settings
        markdown = await ocrTextFromImage(imageUrl)
      }
    } else {
      // Anonymous user - use default settings
      markdown = await ocrTextFromImage(imageUrl)
    }

    return NextResponse.json({ markdown })
  } catch (error) {
    console.error('OCR API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}