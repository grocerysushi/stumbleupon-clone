require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function testPostgresConnection() {
  console.log('🔄 Testing PostgreSQL connection...')

  const connectionStrings = [
    // Direct connection
    `postgresql://postgres:SgH1ngsDBSYv5tqqqHd@db.afmxxuatqmnlaussywzh.supabase.co:5432/postgres`,
    // Pooler connection
    `postgresql://postgres:SgH1ngsDBSYv5tqqqHd@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
    // Pooler with different port
    `postgresql://postgres:SgH1ngsDBSYv5tqqqHd@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  ]

  for (let i = 0; i < connectionStrings.length; i++) {
    const connectionString = connectionStrings[i]
    console.log(`\n🔗 Testing connection ${i + 1}/${connectionStrings.length}`)
    console.log(`URL: ${connectionString.replace(/:[^:@]+@/, ':****@')}`)

    const client = new Client({
      connectionString
    })

    try {
      await client.connect()
      console.log('✅ Connection successful!')

      // Try a simple query
      const result = await client.query('SELECT NOW() as current_time')
      console.log('✅ Query successful:', result.rows[0].current_time)

      await client.end()

      console.log('🎉 This connection string works! Update your .env files with:')
      console.log(`DATABASE_URL="${connectionString}"`)
      return

    } catch (error) {
      console.log(`❌ Connection failed:`, error.message)
      try {
        await client.end()
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }

  console.log('\n❌ All connection attempts failed.')
  console.log('\n💡 Troubleshooting steps:')
  console.log('1. Check your Supabase project is active')
  console.log('2. Verify database password in Supabase dashboard')
  console.log('3. Check if database pausing is enabled')
}

testPostgresConnection()