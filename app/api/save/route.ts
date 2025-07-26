import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { imageUrl, markdown } = await request.json()

    if (!imageUrl || !markdown) {
      return NextResponse.json(
        { error: 'Image URL and markdown are required' },
        { status: 400 }
      )
    }

    const ocrText = await prisma.oCRText.create({
      data: {
        userId,
        imageUrl,
        markdown,
      },
    })

    return NextResponse.json({ id: ocrText.id })
  } catch (error) {
    console.error('Save API Error:', error)
    return NextResponse.json(
      { error: 'Failed to save OCR result' },
      { status: 500 }
    )
  }
}