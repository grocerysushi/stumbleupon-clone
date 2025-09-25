require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function testCurrentEnvConnection() {
  console.log('🔄 Testing connection with current .env.local settings...')

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found in .env.local')
    return
  }

  console.log(`🔗 Testing: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`)

  const client = new Client({
    connectionString: databaseUrl
  })

  try {
    console.log('🔄 Attempting connection...')
    await client.connect()
    console.log('✅ Connection successful!')

    const result = await client.query('SELECT NOW() as current_time, version() as pg_version')
    console.log('✅ Query successful!')
    console.log('⏰ Database time:', result.rows[0].current_time)
    console.log('🐘 PostgreSQL version:', result.rows[0].pg_version.split(' ')[0])

    await client.end()
    console.log('🎉 Database connection is working!')

    // Update .env file for Prisma CLI
    const fs = require('fs')
    const envContent = fs.readFileSync('.env.local', 'utf8')
    fs.writeFileSync('.env', envContent)
    console.log('✅ Updated .env file for Prisma CLI')

  } catch (error) {
    console.log('❌ Connection failed:', error.message)

    if (error.message.includes('Tenant or user not found')) {
      console.log('\n💡 This error usually means:')
      console.log('1. Wrong database password')
      console.log('2. Wrong connection format')
      console.log('3. Database is paused/inactive')
      console.log('\nTry updating your connection string to use the format:')
      console.log('postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres')
      console.log('(Notice the dot after "postgres")')
    }

    try {
      await client.end()
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

testCurrentEnvConnection()