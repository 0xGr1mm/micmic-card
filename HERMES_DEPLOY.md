# MicMic Card — Hermes Agent Deploy Instructions

## Prerequisites
- GitHub CLI (`gh`) installed and authenticated as 0xGr1mm
- Vercel CLI (`vercel`) installed and authenticated
- Node.js 20+

## Step 1: Create GitHub Repo

```bash
cd /path/to/micmic-card

# Init git
git init
git add .
git commit -m "feat: initial micmic card — seismic identity generator"

# Create repo on 0xGr1mm GitHub
gh repo create 0xGr1mm/micmic-card --public --description "Seismic MicMic Card Generator — Generate your Magnitude identity card" --push --source=.
```

## Step 2: Set up Supabase
1. Go to https://supabase.com → New Project
2. Project name: `micmic-card`
3. Run contents of `SUPABASE_SETUP.sql` in SQL Editor
4. Go to Settings → API → copy URL, anon key, service_role key

## Step 3: Deploy to Vercel

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Deploy (first time — will ask for project setup)
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy to production
vercel --prod
```

## Step 4: Update .env.local for local dev
Fill in the real values in `.env.local` (already gitignored).

## Vercel Project Settings
- Framework: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

## Expected URL
`https://micmic-card.vercel.app` or custom domain
