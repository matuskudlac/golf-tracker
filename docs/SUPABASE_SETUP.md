# Supabase Setup Guide

This guide will help you set up Supabase for the Golf Tracker AI project.

---

## 📋 Prerequisites

- A Supabase account (free tier is sufficient)
- Your database schema finalized

---

## 🚀 Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `golf-tracker-ai` (or your preference)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine for development

4. Wait 2-3 minutes for project creation

---

## 🔑 Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to:
   - **Settings** → **API**

2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

---

## ⚙️ Step 3: Configure Environment Variables

1. **Create `.env.local` file** in the project root:
   ```bash
   # Copy the example file
   cp env.example .env.local
   ```

2. **Edit `.env.local`** and replace the placeholders:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Restart your dev server** if it's running:
   ```bash
   npm run dev
   ```

---

## 🗄️ Step 4: Create Database Schema (When Ready)

Once you've finalized your database schema, you'll create the tables:

### Option A: Using Supabase Dashboard (Easiest)

1. Go to **Table Editor** in Supabase dashboard
2. Click **"New Table"**
3. Create tables manually with the UI

### Option B: Using SQL Editor (Recommended)

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New Query"**
3. Paste your SQL migration file
4. Click **"Run"**

### Option C: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Create migration file
supabase migration new initial_schema

# Edit the migration file in supabase/migrations/
# Then apply it
supabase db push
```

---

## 🔐 Step 5: Set Up Row Level Security (RLS)

After creating tables, enable RLS to protect user data:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE holes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can only see their own rounds
CREATE POLICY "Users can view own rounds"
  ON rounds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rounds"
  ON rounds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rounds"
  ON rounds FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rounds"
  ON rounds FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can only see holes from their rounds
CREATE POLICY "Users can view own holes"
  ON holes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = holes.round_id
      AND rounds.user_id = auth.uid()
    )
  );

-- Similar policies for INSERT, UPDATE, DELETE on holes
CREATE POLICY "Users can insert own holes"
  ON holes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = holes.round_id
      AND rounds.user_id = auth.uid()
    )
  );
```

---

## 🧪 Step 6: Test the Connection

Create a test page to verify Supabase is working:

```typescript
// src/app/test-supabase/page.tsx
import { supabase } from '@/lib/supabase'

export default async function TestSupabase() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
      {error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <p className="text-green-500">✅ Connected successfully!</p>
      )}
    </div>
  )
}
```

Visit `http://localhost:3000/test-supabase` to verify.

---

## 📊 Step 7: Generate TypeScript Types (Optional but Recommended)

After your schema is created, generate type-safe database types:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Generate types
npx supabase gen types typescript --project-id your-project-id > src/lib/database.types.ts
```

Then update `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

---

## 🔄 Step 8: Enable Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Optional: Enable OAuth providers (Google, GitHub, etc.)

---

## 📁 Step 9: Set Up Storage (For Scorecard Images)

1. Go to **Storage** in Supabase dashboard
2. Click **"New Bucket"**
3. Create bucket:
   - **Name**: `scorecards`
   - **Public**: No (keep private)
4. Set up storage policies:

```sql
-- Allow users to upload their own scorecards
CREATE POLICY "Users can upload own scorecards"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'scorecards' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view their own scorecards
CREATE POLICY "Users can view own scorecards"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'scorecards' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] API credentials copied
- [ ] `.env.local` file configured
- [ ] Database schema created (when finalized)
- [ ] Row Level Security policies applied
- [ ] Authentication enabled
- [ ] Storage bucket created
- [ ] TypeScript types generated (optional)
- [ ] Connection tested

---

## 🆘 Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure you copied the **anon/public** key, not the service role key
- Restart your dev server after changing `.env.local`

### "relation does not exist" error
- Your tables haven't been created yet
- Run your SQL migration in Supabase SQL Editor

### RLS blocking queries
- Make sure you're authenticated when testing
- Check your RLS policies match your auth setup
- Temporarily disable RLS for testing (re-enable after!)

---

## 📚 Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Supabase Docs**: https://supabase.com/docs
- **Supabase Auth Guide**: https://supabase.com/docs/guides/auth
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Storage Guide**: https://supabase.com/docs/guides/storage

---

*Last Updated: 2026-01-03*
