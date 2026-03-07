-- Row-Level Security (RLS) Policies for Catalyst
-- Run this in Supabase SQL Editor after creating tables
-- These policies ensure users can only access their own data

-- ============================================
-- BUSINESSES TABLE POLICIES
-- ============================================

-- Enable RLS on businesses table
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for re-running this script)
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can create their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can delete their own businesses" ON businesses;
DROP POLICY IF EXISTS "Public can view businesses by slug" ON businesses;

-- Policy 1: Users can view their own businesses
CREATE POLICY "Users can view their own businesses"
ON businesses FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Public can view businesses by slug (for catalog pages)
CREATE POLICY "Public can view businesses by slug"
ON businesses FOR SELECT
USING (slug IS NOT NULL);

-- Policy 3: Users can create businesses
CREATE POLICY "Users can create their own businesses"
ON businesses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can update their own businesses
CREATE POLICY "Users can update their own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 5: Users can delete their own businesses
CREATE POLICY "Users can delete their own businesses"
ON businesses FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- PRODUCTS TABLE POLICIES
-- ============================================

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view products of their businesses" ON products;
DROP POLICY IF EXISTS "Users can create products for their businesses" ON products;
DROP POLICY IF EXISTS "Users can update products of their businesses" ON products;
DROP POLICY IF EXISTS "Users can delete products of their businesses" ON products;
DROP POLICY IF EXISTS "Public can view all products" ON products;

-- Policy 1: Users can view products from their own businesses
CREATE POLICY "Users can view products of their businesses"
ON products FOR SELECT
USING (
  business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  )
);

-- Policy 2: Public can view all products (for catalog pages)
CREATE POLICY "Public can view all products"
ON products FOR SELECT
USING (true);

-- Policy 3: Users can create products for their businesses
CREATE POLICY "Users can create products for their businesses"
ON products FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  )
);

-- Policy 4: Users can update products from their businesses
CREATE POLICY "Users can update products of their businesses"
ON products FOR UPDATE
USING (
  business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  )
);

-- Policy 5: Users can delete products from their businesses
CREATE POLICY "Users can delete products of their businesses"
ON products FOR DELETE
USING (
  business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  )
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these separately to verify policies are set up correctly:

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- List all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies WHERE schemaname = 'public';

-- Test as authenticated user (replace 'YOUR_USER_ID' with actual UUID):
-- SET request.jwt.claim.sub = 'YOUR_USER_ID';
-- SELECT * FROM businesses;
-- SELECT * FROM products;
