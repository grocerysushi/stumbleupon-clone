# Supabase Database Setup Guide

Your Supabase connection is failing. Here's how to fix it:

## 🔧 Step 1: Get Correct Database Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/projects
2. **Select your project**: `afmxxuatqmnlaussywzh`
3. **Go to Settings** → **Database**
4. **Reset your database password** (if you haven't already)
5. **Copy the connection string** from the "Connection pooling" section

## 🔗 Step 2: Update Connection String

Your connection string should look like this:

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

Where:
- `[PROJECT_REF]` = `afmxxuatqmnlaussywzh`
- `[PASSWORD]` = Your database password

## 📝 Step 3: Update .env.local

Replace the DATABASE_URL in your `.env.local` file:

```env
# Use the pooling connection for DATABASE_URL
DATABASE_URL="postgresql://postgres.afmxxuatqmnlaussywzh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Use the direct connection for DIRECT_URL
DIRECT_URL="postgresql://postgres.afmxxuatqmnlaussywzh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

## 🧪 Step 4: Test Connection

```bash
node scripts/simple-db-test.js
```

## ⚠️ Common Issues & Solutions

### Issue: "Tenant or user not found"
**Solution**:
- Database password is wrong
- Project reference is incorrect
- Database is paused (check Supabase dashboard)

### Issue: "Connection timeout"
**Solution**:
- Project might be paused due to inactivity
- Check Supabase project status in dashboard

### Issue: "Authentication failed"
**Solution**:
- Reset database password in Supabase dashboard
- Make sure to use the password immediately (it expires quickly)

## 🔄 Alternative: Use Supabase CLI

If you have issues, you can also use Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref afmxxuatqmnlaussywzh
npx supabase db pull
```

## 📞 Next Steps

Once you get a successful connection:

1. Run `npm run setup` again
2. The database schema will be pushed
3. Sample data will be seeded
4. You can start the app with `npm run dev`

## 🎯 Quick Fix

Try these exact connection strings (replace YOUR_PASSWORD):

**Option 1 (Pooling - Recommended for production):**
```
DATABASE_URL="postgresql://postgres.afmxxuatqmnlaussywzh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

**Option 2 (Direct connection):**
```
DATABASE_URL="postgresql://postgres.afmxxuatqmnlaussywzh:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

The key is getting your actual database password from the Supabase dashboard!