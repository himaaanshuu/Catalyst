-- Migration: Add payments table for Razorpay transaction tracking
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  business_id UUID NULL REFERENCES businesses(id) ON DELETE SET NULL,
  business_slug TEXT NULL,
  product_id UUID NULL REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NULL,
  amount NUMERIC(12, 2) NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  customer_name TEXT NULL,
  customer_email TEXT NULL,
  customer_phone TEXT NULL,
  gateway_response JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id_unique
  ON payments(razorpay_payment_id);

CREATE INDEX IF NOT EXISTS idx_payments_business_id
  ON payments(business_id);

CREATE INDEX IF NOT EXISTS idx_payments_created_at
  ON payments(created_at DESC);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view payments of their businesses" ON payments;
CREATE POLICY "Users can view payments of their businesses"
ON payments FOR SELECT
USING (
  business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  )
);
