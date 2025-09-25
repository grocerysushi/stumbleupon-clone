import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { URL } from 'url'

// Helper function to extract domain from URL
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return 'unknown'
  }
}

// Helper function to fetch Open Graph data
async function fetchOGData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      throw new Error('Failed to fetch')
    }

    const html = await response.text()

    // Simple regex-based OG tag extraction (in production, use a proper parser)
    const titleMatch = html.match(/<meta property="og:title" content="([^"]*)"/) ||
                      html.match(/<title>([^<]*)</title>/)
    const descMatch = html.match(/<meta property="og:description" content="([^"]*)"/) ||
                     html.match(/<meta name="description" content="([^"]*)"/)
    const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"/)

    return {
      title: titleMatch ? titleMatch[1] : 'Untitled',
      description: descMatch ? descMatch[1] : null,
      image: imageMatch ? imageMatch[1] : null
    }
  } catch (error) {
    console.error('Failed to fetch OG data:', error)
    return {
      title: 'Untitled',
      description: null,
      image: null
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, userId, topics = [] } = body

    if (!url || !userId) {
      return NextResponse.json({ error: 'URL and userId are required' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Check if link already exists
    const existingLink = await prisma.link.findUnique({
      where: { url }
    })

    if (existingLink) {
      return NextResponse.json({ error: 'Link already exists' }, { status: 409 })
    }

    // Fetch metadata
    const ogData = await fetchOGData(url)
    const domain = extractDomain(url)

    // Create the link
    const link = await prisma.link.create({
      data: {
        url,
        title: ogData.title,
        description: ogData.description,
        domain,
        image: ogData.image,
        submittedBy: userId,
        status: 'PENDING' // Will need admin approval
      }
    })

    // Add topics if provided
    if (topics.length > 0) {
      for (const topicSlug of topics) {
        const topic = await prisma.topic.findUnique({
          where: { slug: topicSlug }
        })

        if (topic) {
          await prisma.linkTopic.create({
            data: {
              linkId: link.id,
              topicId: topic.id
            }
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      linkId: link.id,
      status: 'pending_approval'
    })
  } catch (error) {
    console.error('Link submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') || 'APPROVED'

    let whereClause: any = { status }
    if (userId) {
      whereClause.submittedBy = userId
    }

    const links = await prisma.link.findMany({
      where: whereClause,
      include: {
        linkTopics: {
          include: {
            topic: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json({ links })
  } catch (error) {
    console.error('Links API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}