require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()

  try {
    console.log('🔄 Testing database connection...')

    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')

    // Check if tables exist
    const topics = await prisma.topic.findMany()
    console.log(`📊 Found ${topics.length} topics in database`)

    const links = await prisma.link.findMany()
    console.log(`🔗 Found ${links.length} links in database`)

    const users = await prisma.user.findMany()
    console.log(`👥 Found ${users.length} users in database`)

    if (topics.length === 0) {
      console.log('⚠️  Database appears empty. Run: npx prisma db seed')
    } else {
      console.log('🎉 Database is ready for stumbling!')
    }

  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error(error.message)

    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Solution: Set your Supabase database password')
      console.log('1. Go to https://supabase.com/dashboard/projects')
      console.log('2. Select project: afmxxuatqmnlaussywzh')
      console.log('3. Settings → Database → Reset password')
      console.log('4. Update DATABASE_URL in .env.local with the password')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()