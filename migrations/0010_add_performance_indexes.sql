-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_insurance_plans_category ON insurance_plans(category);
CREATE INDEX IF NOT EXISTS idx_insurance_plans_country ON insurance_plans(country);
CREATE INDEX IF NOT EXISTS idx_insurance_plans_category_country ON insurance_plans(category, country);
CREATE INDEX IF NOT EXISTS idx_insurance_plans_base_price ON insurance_plans(base_price);

-- Add index for conversation logs
CREATE INDEX IF NOT EXISTS idx_conversation_logs_user_id ON conversation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_timestamp ON conversation_logs(timestamp DESC); 