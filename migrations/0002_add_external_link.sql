-- Add external_link column to insurance_plans table
ALTER TABLE insurance_plans 
ADD COLUMN IF NOT EXISTS external_link VARCHAR(500),
ADD COLUMN IF NOT EXISTS is_external BOOLEAN DEFAULT false; 