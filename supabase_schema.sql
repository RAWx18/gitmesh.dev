-- Run this in Supabase SQL Editor

-- 1. Create the content table
CREATE TABLE IF NOT EXISTS public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('blog', 'announcement', 'welfare')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  newsletter BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_slug ON public.content(slug);
CREATE INDEX IF NOT EXISTS idx_content_type ON public.content(type);

-- 3. Enable Row Level Security
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Permissive Fix)
-- This version explicitly targets all standard Supabase roles to ensure NO blockage.

-- Clean up any and all possible policy names we've used or might exist
DROP POLICY IF EXISTS "Allow public read access" ON public.content;
DROP POLICY IF EXISTS "Allow admin crud access" ON public.content;
DROP POLICY IF EXISTS "Allow full access for API" ON public.content;
DROP POLICY IF EXISTS "Allow all actions" ON public.content;
DROP POLICY IF EXISTS "Allow all for anon" ON public.content;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.content;

-- Create individual policies for each role just to be safe
CREATE POLICY "anon_all" ON public.content FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "service_all" ON public.content FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Ensure RLS is active but has the above holes
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- 5. Add a trigger to update 'updated_at' on changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_updated_at
BEFORE UPDATE ON public.content
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
