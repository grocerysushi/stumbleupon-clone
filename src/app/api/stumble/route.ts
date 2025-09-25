import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { StumbleResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') // Optional for personalization
    const topics = searchParams.get('topics')?.split(',') // Optional topic filtering

    // Build the query
    let whereClause: any = {
      status: 'APPROVED'
    }

    // Filter by topics if provided
    if (topics && topics.length > 0) {
      whereClause.linkTopics = {
        some: {
          topic: {
            slug: {
              in: topics
            }
          }
        }
      }
    }

    // Get user's viewed links to exclude them
    let excludeIds: string[] = []
    if (userId) {
      const viewedEvents = await prisma.event.findMany({
        where: {
          userId,
          action: 'VIEW'
        },
        select: {
          linkId: true
        }
      })
      excludeIds = viewedEvents.map(event => event.linkId)
    }

    if (excludeIds.length > 0) {
      whereClause.id = {
        notIn: excludeIds
      }
    }

    // Get candidate links with scoring
    const links = await prisma.link.findMany({
      where: whereClause,
      include: {
        linkTopics: {
          include: {
            topic: true
          }
        }
      },
      take: 50 // Get more candidates for better selection
    })

    if (links.length === 0) {
      return NextResponse.json({ error: 'No links available' }, { status: 404 })
    }

    // Simple scoring algorithm
    const scoredLinks = links.map(link => {
      const globalCtr = link.viewCount > 0 ? link.likeCount / link.viewCount : 0
      const recencyScore = Math.max(0, 1 - (Date.now() - link.createdAt.getTime()) / (7 * 24 * 60 * 60 * 1000)) // 7-day decay
      const diversityBonus = 0.1 // Small bonus for domain diversity (could be improved)

      const score = globalCtr * 0.4 + recencyScore * 0.3 + diversityBonus * 0.3

      return { ...link, score }
    })

    // Sort by score and apply epsilon-greedy selection
    scoredLinks.sort((a, b) => b.score - a.score)

    let selectedLink
    const epsilon = 0.15 // 15% exploration
    if (Math.random() < epsilon) {
      // Explore: pick random from top 20
      const topLinks = scoredLinks.slice(0, Math.min(20, scoredLinks.length))
      selectedLink = topLinks[Math.floor(Math.random() * topLinks.length)]
    } else {
      // Exploit: pick the best
      selectedLink = scoredLinks[0]
    }

    // Record view event if user is provided
    if (userId) {
      await prisma.event.create({
        data: {
          userId,
          linkId: selectedLink.id,
          action: 'VIEW'
        }
      })

      // Update view count
      await prisma.link.update({
        where: { id: selectedLink.id },
        data: {
          viewCount: {
            increment: 1
          }
        }
      })
    }

    // Format response
    const response: StumbleResponse = {
      link: {
        id: selectedLink.id,
        url: selectedLink.url,
        title: selectedLink.title,
        description: selectedLink.description ?? undefined,
        domain: selectedLink.domain,
        image: selectedLink.image ?? undefined,
        status: selectedLink.status as any,
        submittedBy: selectedLink.submittedBy,
        createdAt: selectedLink.createdAt,
        updatedAt: selectedLink.updatedAt,
        viewCount: selectedLink.viewCount,
        likeCount: selectedLink.likeCount,
        dislikeCount: selectedLink.dislikeCount,
        skipCount: selectedLink.skipCount,
        saveCount: selectedLink.saveCount,
        topics: selectedLink.linkTopics.map(lt => lt.topic)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Stumble API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}