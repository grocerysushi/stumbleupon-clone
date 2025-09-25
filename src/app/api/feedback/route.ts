import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, linkId, action } = body

    if (!userId || !linkId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['LIKE', 'DISLIKE', 'SKIP', 'SAVE', 'SHARE'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Record the event
    await prisma.event.create({
      data: {
        userId,
        linkId,
        action
      }
    })

    // Update link counters
    const updateData: any = {}
    switch (action) {
      case 'LIKE':
        updateData.likeCount = { increment: 1 }
        break
      case 'DISLIKE':
        updateData.dislikeCount = { increment: 1 }
        break
      case 'SKIP':
        updateData.skipCount = { increment: 1 }
        break
      case 'SAVE':
        updateData.saveCount = { increment: 1 }
        break
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.link.update({
        where: { id: linkId },
        data: updateData
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}