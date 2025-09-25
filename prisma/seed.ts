import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default topics
  const topics = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Science', slug: 'science' },
    { name: 'Programming', slug: 'programming' },
    { name: 'Design', slug: 'design' },
    { name: 'Art', slug: 'art' },
    { name: 'Photography', slug: 'photography' },
    { name: 'Music', slug: 'music' },
    { name: 'Gaming', slug: 'gaming' },
    { name: 'Humor', slug: 'humor' },
    { name: 'News', slug: 'news' },
    { name: 'Education', slug: 'education' },
    { name: 'Business', slug: 'business' },
    { name: 'Health', slug: 'health' },
    { name: 'Food', slug: 'food' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Sports', slug: 'sports' }
  ]

  console.log('Creating topics...')
  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {},
      create: topic
    })
  }

  // Create a test user
  console.log('Creating test user...')
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User'
    }
  })

  // Get topic IDs for seeding
  const techTopic = await prisma.topic.findUnique({ where: { slug: 'technology' } })
  const programmingTopic = await prisma.topic.findUnique({ where: { slug: 'programming' } })
  const scienceTopic = await prisma.topic.findUnique({ where: { slug: 'science' } })
  const designTopic = await prisma.topic.findUnique({ where: { slug: 'design' } })

  // Create sample links
  const sampleLinks = [
    {
      url: 'https://github.com/microsoft/TypeScript',
      title: 'TypeScript - JavaScript With Syntax For Types',
      description: 'TypeScript extends JavaScript by adding types to the language. TypeScript speeds up your development experience by catching errors and providing fixes before you even run your code.',
      domain: 'github.com',
      image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      topics: [techTopic?.id, programmingTopic?.id].filter(Boolean)
    },
    {
      url: 'https://www.nasa.gov/news/',
      title: 'NASA News and Updates',
      description: 'Latest news, images and videos from America\'s space agency. Get the latest updates on NASA missions, discoveries and more.',
      domain: 'nasa.gov',
      image: 'https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png',
      topics: [scienceTopic?.id].filter(Boolean)
    },
    {
      url: 'https://dribbble.com/',
      title: 'Dribbble - Discover the World\'s Top Designers & Creative Professionals',
      description: 'Find Top Designers & Creative Professionals on Dribbble. We are where designers gain inspiration, feedback, community, and jobs.',
      domain: 'dribbble.com',
      image: 'https://cdn.dribbble.com/assets/dribbble-ball-icon-4e54c54abecf8efe027abe6f8bc7794553b8abef5c15746c6e0d340f7e751296.png',
      topics: [designTopic?.id].filter(Boolean)
    },
    {
      url: 'https://developer.mozilla.org/',
      title: 'MDN Web Docs',
      description: 'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
      domain: 'developer.mozilla.org',
      image: 'https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png',
      topics: [programmingTopic?.id, techTopic?.id].filter(Boolean)
    }
  ]

  console.log('Creating sample links...')
  for (const linkData of sampleLinks) {
    const link = await prisma.link.upsert({
      where: { url: linkData.url },
      update: {},
      create: {
        url: linkData.url,
        title: linkData.title,
        description: linkData.description,
        domain: linkData.domain,
        image: linkData.image,
        status: 'APPROVED',
        submittedBy: testUser.id
      }
    })

    // Add topics
    for (const topicId of linkData.topics) {
      if (topicId) {
        await prisma.linkTopic.upsert({
          where: {
            linkId_topicId: {
              linkId: link.id,
              topicId: topicId
            }
          },
          update: {},
          create: {
            linkId: link.id,
            topicId: topicId
          }
        })
      }
    }
  }

  console.log('Seed data created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })