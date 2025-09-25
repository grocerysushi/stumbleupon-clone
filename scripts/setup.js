require('dotenv').config({ path: '.env.local' })
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function runCommand(command, description) {
  console.log(`🔄 ${description}...`)
  try {
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} completed\n`)
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message)
    process.exit(1)
  }
}

async function setup() {
  console.log('🚀 Setting up StumbleUpon Clone...\n')

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env.local not found!')
    console.log('Please copy .env.example to .env.local and configure your credentials\n')
    process.exit(1)
  }

  // Install dependencies
  runCommand('npm install', 'Installing dependencies')

  // Generate Prisma client
  runCommand('npx prisma generate', 'Generating Prisma client')

  // Test database connection
  runCommand('npm run db:test', 'Testing database connection')

  // Push schema to database
  console.log('🔄 Pushing database schema...')
  try {
    execSync('npx prisma db push', { stdio: 'inherit' })
    console.log('✅ Database schema pushed\n')
  } catch (error) {
    console.log('⚠️  Schema push failed. This might be normal if schema already exists.\n')
  }

  // Seed database
  try {
    runCommand('npx prisma db seed', 'Seeding database with sample data')
  } catch (error) {
    console.log('⚠️  Seeding failed. Database might already be seeded.\n')
  }

  console.log('🎉 Setup complete!')
  console.log('\nNext steps:')
  console.log('1. Run: npm run dev')
  console.log('2. Visit: http://localhost:3000')
  console.log('3. Click "Stumble!" to test functionality')
  console.log('\nFor deployment to Vercel, see DEPLOYMENT.md')
}

setup().catch(console.error)