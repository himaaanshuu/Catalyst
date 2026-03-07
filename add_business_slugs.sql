-- Migration: Add slug column to businesses table
-- This migration adds URL-friendly slugs to existing businesses
-- Run this in Supabase SQL Editor

-- Step 1: Add slug column (nullable initially)
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Step 2: Generate slugs for existing businesses
UPDATE businesses
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(business_name, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
)
WHERE slug IS NULL;

-- Step 3: Handle duplicate slugs by appending numbers
WITH duplicates AS (
  SELECT slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
  FROM businesses
  WHERE slug IS NOT NULL
)
UPDATE businesses b
SET slug = b.slug || '-' || (d.rn - 1)
FROM duplicates d
WHERE b.slug = d.slug AND d.rn > 1;

-- Step 4: Make slug column required and unique
ALTER TABLE businesses 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE businesses 
ADD CONSTRAINT businesses_slug_unique UNIQUE (slug);

-- Step 5: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);

-- Verification query (optional - run separately to check results)
-- SELECT id, business_name, slug FROM businesses ORDER BY created_at;
