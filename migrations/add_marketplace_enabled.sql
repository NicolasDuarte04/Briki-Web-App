-- Add marketplace_enabled column to company_plans table
ALTER TABLE company_plans
ADD COLUMN IF NOT EXISTS marketplace_enabled BOOLEAN DEFAULT FALSE;