# Deployment Guide - StumbleUpon Clone

This guide will help you deploy your StumbleUpon clone to Vercel using Supabase as the database.

## Prerequisites

✅ **Already Configured:**
- Supabase project: `https://afmxxuatqmnlaussywzh.supabase.co`
- Vercel project: `stumbleupon-clone`
- OpenAI API key for enhanced content processing

## Quick Deployment Steps

### 1. Set Supabase Database Password

First, you need to set your Supabase database password:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Select your project: `afmxxuatqmnlaussywzh`
3. Go to Settings → Database
4. Reset/Set your database password
5. Update `.env.local` with the password:

```env
DATABASE_URL="postgresql://postgres.afmxxuatqmnlaussywzh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.afmxxuatqmnlaussywzh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### 2. Initialize Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Seed with sample data
npx prisma db seed
```

### 3. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and click "Stumble!" to test the functionality.

### 4. Deploy to Vercel

#### Option A: Automatic Deployment (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Configure Supabase and Vercel deployment"
git push origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Find your project: `stumbleupon-clone`
4. Set environment variables in **Settings → Environment Variables**:

```
DATABASE_URL=postgresql://postgres.afmxxuatqmnlaussywzh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.afmxxuatqmnlaussywzh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://afmxxuatqmnlaussywzh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbXh4dWF0cW1ubGF1c3N5d3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njg1ODEsImV4cCI6MjA3NDM0NDU4MX0.ucQkD50vuTj_MBvNttd055_qb5ZyuEnzjC_11PDepXg
NEXTAUTH_SECRET=stumbleupon-clone-secret-key-2024
NEXTAUTH_URL=https://your-deployment-url.vercel.app
OPENAI_API_KEY=your_openai_api_key_here
```

5. Trigger a new deployment

#### Option B: Manual Deployment

```bash
npm i -g vercel
vercel --prod
```

### 5. Post-Deployment Setup

After successful deployment:

1. **Update NEXTAUTH_URL**: Replace with your actual Vercel URL
2. **Test the stumble functionality**: Visit your deployed app and click "Stumble!"
3. **Check database**: Use `npx prisma studio` to verify data

## Database Management

### View Data
```bash
npx prisma studio
```

### Reset Database (if needed)
```bash
npx prisma db push --force-reset
npx prisma db seed
```

### Add More Sample Data
Edit `prisma/seed.ts` and run:
```bash
npx prisma db seed
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | ✅ |
| `DIRECT_URL` | Direct database connection (same as DATABASE_URL for Supabase) | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `NEXTAUTH_SECRET` | Secret for NextAuth sessions | ✅ |
| `NEXTAUTH_URL` | Your app's URL | ✅ |
| `OPENAI_API_KEY` | For enhanced content processing | ⚡ Optional |
| `GOOGLE_CLIENT_ID` | For OAuth login | ⚡ Optional |
| `GOOGLE_CLIENT_SECRET` | For OAuth login | ⚡ Optional |

## Troubleshooting

### Common Issues

**1. Database Connection Error**
- Verify Supabase password is correct
- Check DATABASE_URL format
- Ensure Supabase project is active

**2. Prisma Generate Error**
- Run `npm install` first
- Clear node_modules and reinstall if needed

**3. No Links Available**
- Run `npx prisma db seed` to add sample data
- Check database with `npx prisma studio`

**4. Vercel Build Fails**
- Check environment variables are set
- Verify all dependencies in package.json

### Useful Commands

```bash
# Check database connection
npx prisma db pull

# View current schema
npx prisma db pull

# Generate new migration
npx prisma migrate dev

# Deploy schema changes
npx prisma db push
```

## Next Steps

After successful deployment:

1. **Add Authentication**: Implement Google/GitHub OAuth
2. **Content Moderation**: Set up admin approval system
3. **Browser Extension**: Build Chrome/Firefox extension
4. **Analytics**: Add user behavior tracking
5. **Mobile App**: Create React Native companion

## Support

- **Supabase Issues**: [Supabase Support](https://supabase.com/support)
- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **App Issues**: Check GitHub repository issues

Your StumbleUpon clone is ready for production! 🚀