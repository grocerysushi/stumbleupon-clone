import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ topics })
  } catch (error) {
    console.error('Topics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        slug
      }
    })

    return NextResponse.json({ topic })
  } catch (error) {
    console.error('Topic creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}