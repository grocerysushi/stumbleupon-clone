import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addSingleSite() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log('Usage: npx ts-node scripts/add-single-site.ts <URL> <topic1,topic2,...>')
    console.log('Example: npx ts-node scripts/add-single-site.ts "https://example.com" "technology,programming"')
    process.exit(1)
  }

  const [url, topicsArg] = args
  const topicSlugs = topicsArg.split(',').map(t => t.trim())

  // Get test user
  const testUser = await prisma.user.findFirst({ where: { email: 'test@example.com' } })
  if (!testUser) {
    throw new Error('Test user not found')
  }

  // Get topics
  const topics = await prisma.topic.findMany({
    where: { slug: { in: topicSlugs } }
  })

  console.log(`🔗 Adding site: ${url}`)
  console.log(`📂 Topics: ${topicSlugs.join(', ')}`)

  try {
    // Fetch metadata from the URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()

    // Extract basic metadata
    const titleMatch = html.match(/<meta property="og:title" content="([^"]*)"/i) ||
                      html.match(/<title>([^<]*)<\/title>/i)
    const descMatch = html.match(/<meta property="og:description" content="([^"]*)"/i) ||
                     html.match(/<meta name="description" content="([^"]*)"/i)

    const title = titleMatch ? titleMatch[1] : 'Untitled'
    const description = descMatch ? descMatch[1] : null
    const domain = new URL(url).hostname

    // Create the link
    const link = await prisma.link.create({
      data: {
        url,
        title,
        description,
        domain,
        status: 'APPROVED',
        submittedBy: testUser.id
      }
    })

    // Add topics
    for (const topic of topics) {
      await prisma.linkTopic.create({
        data: {
          linkId: link.id,
          topicId: topic.id
        }
      })
    }

    console.log(`✅ Added: ${title}`)
    console.log(`   Domain: ${domain}`)
    console.log(`   Topics: ${topics.map(t => t.name).join(', ')}`)

  } catch (error) {
    console.error(`❌ Failed to add site:`, error.message)
  }
}

addSingleSite()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })