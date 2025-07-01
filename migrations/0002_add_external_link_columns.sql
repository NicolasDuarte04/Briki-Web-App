-- Add external_link and is_external columns to insurance_plans table
ALTER TABLE "insurance_plans" 
ADD COLUMN "external_link" VARCHAR(500),
ADD COLUMN "is_external" BOOLEAN DEFAULT FALSE; 