import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMoreSites() {
  console.log('🌐 Adding more interesting sites to your StumbleUpon clone...')

  // Get existing topics
  const topics = await prisma.topic.findMany()
  const topicMap = Object.fromEntries(topics.map(t => [t.slug, t.id]))

  // Get test user
  const testUser = await prisma.user.findFirst({ where: { email: 'test@example.com' } })
  if (!testUser) {
    throw new Error('Test user not found. Run the original seed first.')
  }

  const newSites = [
    // Technology & Programming
    {
      url: 'https://news.ycombinator.com/',
      title: 'Hacker News',
      description: 'Social news website focusing on computer science and entrepreneurship. Submit and vote on stories.',
      domain: 'news.ycombinator.com',
      topics: ['technology', 'programming', 'business']
    },
    {
      url: 'https://stackoverflow.com/',
      title: 'Stack Overflow - Where Developers Learn, Share, & Build Careers',
      description: 'The largest online community for programmers to learn, share knowledge, and build careers.',
      domain: 'stackoverflow.com',
      topics: ['programming', 'technology']
    },
    {
      url: 'https://codepen.io/',
      title: 'CodePen: Online Code Editor and Front End Web Developer Community',
      description: 'An online code editor and learning environment where you can write HTML, CSS and JavaScript and see live results.',
      domain: 'codepen.io',
      topics: ['programming', 'design']
    },
    {
      url: 'https://www.producthunt.com/',
      title: 'Product Hunt – The best new products in tech',
      description: 'Discover the latest mobile apps, websites, and technology products that everyone\'s talking about.',
      domain: 'producthunt.com',
      topics: ['technology', 'business']
    },

    // Science & Education
    {
      url: 'https://www.ted.com/talks',
      title: 'TED Talks | TED',
      description: 'Watch the world\'s best ideas worth spreading - from technology and science to surprising insights about the workings of our world.',
      domain: 'ted.com',
      topics: ['education', 'science']
    },
    {
      url: 'https://www.khanacademy.org/',
      title: 'Khan Academy | Free Online Courses, Lessons & Practice',
      description: 'Learn anything for free: thousands of interactive exercises, videos, and articles at your fingertips.',
      domain: 'khanacademy.org',
      topics: ['education']
    },
    {
      url: 'https://www.nature.com/',
      title: 'Nature | The international weekly journal of science',
      description: 'Nature - the world\'s most cited interdisciplinary science journal.',
      domain: 'nature.com',
      topics: ['science']
    },

    // Design & Art
    {
      url: 'https://www.behance.net/',
      title: 'Behance :: Creative Portfolios',
      description: 'Showcase and discover creative work from the world\'s best designers and artists.',
      domain: 'behance.net',
      topics: ['design', 'art']
    },
    {
      url: 'https://www.figma.com/community',
      title: 'Figma Community',
      description: 'Explore thousands of templates, UI kits, and more from the Figma community.',
      domain: 'figma.com',
      topics: ['design']
    },
    {
      url: 'https://unsplash.com/',
      title: 'Unsplash | The internet\'s source for visuals',
      description: 'Beautiful, free images and photos that you can download and use for any project.',
      domain: 'unsplash.com',
      topics: ['photography', 'art']
    },

    // Gaming & Entertainment
    {
      url: 'https://itch.io/',
      title: 'itch.io - The best place to discover and download indie games',
      description: 'Find games tagged as made with love, tools for creative use, and a community of game developers.',
      domain: 'itch.io',
      topics: ['gaming']
    },
    {
      url: 'https://www.twitch.tv/',
      title: 'Twitch',
      description: 'Twitch is where millions of people come together live every day to chat, interact, and make their own entertainment.',
      domain: 'twitch.tv',
      topics: ['gaming']
    },

    // Music & Audio
    {
      url: 'https://freemusicarchive.org/',
      title: 'Free Music Archive',
      description: 'The Free Music Archive is a library of high-quality, legal audio downloads.',
      domain: 'freemusicarchive.org',
      topics: ['music']
    },
    {
      url: 'https://www.last.fm/',
      title: 'Last.fm | Play music, find songs, and discover artists',
      description: 'Play the music you love without limits for just $3/month. Exclusive music and podcasts, ad-free radio, and much more.',
      domain: 'last.fm',
      topics: ['music']
    },

    // News & Current Events
    {
      url: 'https://www.reuters.com/',
      title: 'Reuters | Breaking International News & Views',
      description: 'Find latest news from every corner of the globe at Reuters.com, your online source for breaking international news coverage.',
      domain: 'reuters.com',
      topics: ['news']
    },
    {
      url: 'https://www.bbc.com/',
      title: 'BBC - Homepage',
      description: 'Breaking news, sport, TV, radio and a whole lot more. The BBC informs, educates and entertains.',
      domain: 'bbc.com',
      topics: ['news']
    },

    // Health & Lifestyle
    {
      url: 'https://www.healthline.com/',
      title: 'Healthline: Medical information and health advice you can trust',
      description: 'Healthline Media is among the fastest-growing health information sites. Our team is made up of doctors and other medical professionals.',
      domain: 'healthline.com',
      topics: ['health']
    },
    {
      url: 'https://www.webmd.com/',
      title: 'WebMD - Better information. Better health.',
      description: 'Find medical information, symptoms, drugs, treatments, and health news and advice from WebMD.',
      domain: 'webmd.com',
      topics: ['health']
    },

    // Food & Cooking
    {
      url: 'https://www.allrecipes.com/',
      title: 'Allrecipes | Food, friends, and recipe inspiration',
      description: 'Find and share everyday cooking inspiration on Allrecipes. Discover recipes, cooks, videos, and how-tos based on the food you love.',
      domain: 'allrecipes.com',
      topics: ['food']
    },
    {
      url: 'https://www.seriouseats.com/',
      title: 'Serious Eats',
      description: 'Serious Eats: Food and cooking. We make cooking easier.',
      domain: 'seriouseats.com',
      topics: ['food']
    },

    // Travel & Places
    {
      url: 'https://www.atlasobscura.com/',
      title: 'Atlas Obscura - Curious and Wondrous Travel Destinations',
      description: 'Definitive guidebook and friendly tour-guide to the world\'s most wondrous places.',
      domain: 'atlasobscura.com',
      topics: ['travel']
    },
    {
      url: 'https://www.lonelyplanet.com/',
      title: 'Lonely Planet | Travel Guides and Travel Information',
      description: 'Love travel? Plan and book your perfect trip with expert advice, travel tips, destination information and inspiration from Lonely Planet.',
      domain: 'lonelyplanet.com',
      topics: ['travel']
    },

    // Sports & Fitness
    {
      url: 'https://www.espn.com/',
      title: 'ESPN: Serving sports fans. Anytime. Anywhere.',
      description: 'ESPN.com provides comprehensive sports coverage. Complete sports information including NFL, MLB, NBA, College Football, College Basketball scores and news.',
      domain: 'espn.com',
      topics: ['sports']
    },

    // Business & Finance
    {
      url: 'https://techcrunch.com/',
      title: 'TechCrunch – Startup and Technology News',
      description: 'TechCrunch reports on the business of tech, startups, venture capital funding, and Silicon Valley.',
      domain: 'techcrunch.com',
      topics: ['technology', 'business']
    },
    {
      url: 'https://www.crunchbase.com/',
      title: 'Crunchbase | Discover innovative companies and the people behind them',
      description: 'Crunchbase is the leading destination for millions of users to discover industry trends, investments, and news about global companies.',
      domain: 'crunchbase.com',
      topics: ['business']
    },

    // Humor & Entertainment
    {
      url: 'https://www.reddit.com/r/funny/',
      title: 'r/funny - Reddit',
      description: 'Welcome to r/Funny: Reddit\'s largest humour depository',
      domain: 'reddit.com',
      topics: ['humor']
    },
    {
      url: 'https://xkcd.com/',
      title: 'xkcd: A Webcomic of Romance, Sarcasm, Math, and Language',
      description: 'A webcomic of romance, sarcasm, math, and language.',
      domain: 'xkcd.com',
      topics: ['humor', 'science']
    }
  ]

  console.log(`📝 Adding ${newSites.length} new sites...`)

  for (const siteData of newSites) {
    try {
      // Check if site already exists
      const existing = await prisma.link.findUnique({
        where: { url: siteData.url }
      })

      if (existing) {
        console.log(`⏭️  Skipping ${siteData.domain} - already exists`)
        continue
      }

      // Create the link
      const link = await prisma.link.create({
        data: {
          url: siteData.url,
          title: siteData.title,
          description: siteData.description,
          domain: siteData.domain,
          status: 'APPROVED',
          submittedBy: testUser.id
        }
      })

      // Add topics
      for (const topicSlug of siteData.topics) {
        const topicId = topicMap[topicSlug]
        if (topicId) {
          await prisma.linkTopic.create({
            data: {
              linkId: link.id,
              topicId: topicId
            }
          })
        }
      }

      console.log(`✅ Added: ${siteData.title}`)
    } catch (error) {
      console.error(`❌ Failed to add ${siteData.domain}:`, error)
    }
  }

  console.log('🎉 Finished adding sites!')

  // Show summary
  const totalLinks = await prisma.link.count()
  const totalTopics = await prisma.topic.count()

  console.log(`📊 Database Summary:`)
  console.log(`   • Total Sites: ${totalLinks}`)
  console.log(`   • Total Topics: ${totalTopics}`)
  console.log(`   • Ready for stumbling! 🚀`)
}

addMoreSites()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })