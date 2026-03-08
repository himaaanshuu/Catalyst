-- Migration: Add template_key column to businesses table
-- Run this in Supabase SQL Editor

-- Step 1: Add new template_key column
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS template_key TEXT;

-- Step 2: Backfill existing rows with default template
UPDATE businesses
SET template_key = 'modern-minimalist'
WHERE template_key IS NULL;

-- Step 3: Add default and not-null constraint
ALTER TABLE businesses
ALTER COLUMN template_key SET DEFAULT 'modern-minimalist';

ALTER TABLE businesses
ALTER COLUMN template_key SET NOT NULL;

-- Step 4: Add simple check constraint for allowed values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'businesses_template_key_check'
  ) THEN
    ALTER TABLE businesses
    ADD CONSTRAINT businesses_template_key_check
    CHECK (template_key IN (
      'modern-minimalist',
      'bold-vibrant',
      'professional',
      'elegant-luxury',
      'tech-gadgets',
      'organic-natural'
    ));
  END IF;
END
$$;

-- Verification query (optional)
-- SELECT id, business_name, slug, template_key FROM businesses ORDER BY created_at DESC;
