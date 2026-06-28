-- Run this in your Supabase SQL Editor

-- 1. Create micmic_cards table
CREATE TABLE IF NOT EXISTS micmic_cards (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  magnitude INTEGER NOT NULL CHECK (magnitude >= 1 AND magnitude <= 7),
  pfp_url TEXT NOT NULL,
  card_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE micmic_cards ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy
CREATE POLICY "Cards are publicly readable"
  ON micmic_cards FOR SELECT
  USING (true);

-- 4. Insert policy (via service role only)
CREATE POLICY "Service role can insert"
  ON micmic_cards FOR INSERT
  WITH CHECK (true);

-- 5. Update policy (view count)
CREATE POLICY "Service role can update"
  ON micmic_cards FOR UPDATE
  USING (true);

-- 6. Create storage bucket for PFPs
INSERT INTO storage.buckets (id, name, public)
VALUES ('pfps', 'pfps', true)
ON CONFLICT DO NOTHING;

-- 7. Storage public read policy
CREATE POLICY "PFPs are public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pfps');

-- 8. Storage insert policy
CREATE POLICY "Anyone can upload PFPs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pfps');
