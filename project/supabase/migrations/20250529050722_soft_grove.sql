-- Create drawings table
CREATE TABLE public.drawings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_type VARCHAR(10) NOT NULL,
  screen_type VARCHAR(50) NOT NULL,
  width INTEGER NOT NULL,
  length INTEGER NOT NULL,
  pitch DECIMAL(4,1) NOT NULL,
  extra_detail VARCHAR(10),
  comments TEXT,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public Read Access" ON public.drawings
  FOR SELECT TO public USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated Users Can Insert" ON public.drawings
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create index for common search fields
CREATE INDEX idx_drawings_search ON public.drawings (product_type, screen_type, width, length, pitch);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_drawings_updated_at
    BEFORE UPDATE ON public.drawings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();