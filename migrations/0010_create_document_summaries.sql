-- Create document_summaries table for storing PDF analysis results
CREATE TABLE IF NOT EXISTS document_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  insurance_type TEXT NOT NULL CHECK (insurance_type IN ('auto', 'health', 'travel', 'pet', 'other')),
  insurer_name TEXT,
  coverage_summary JSONB,
  exclusions JSONB,
  deductibles TEXT,
  validity_period TEXT,
  raw_text TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_document_summaries_user_id ON document_summaries(user_id);
CREATE INDEX idx_document_summaries_insurance_type ON document_summaries(insurance_type);
CREATE INDEX idx_document_summaries_created_at ON document_summaries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE document_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own documents" ON document_summaries
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own documents" ON document_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own documents" ON document_summaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON document_summaries
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_document_summaries_updated_at
  BEFORE UPDATE ON document_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 