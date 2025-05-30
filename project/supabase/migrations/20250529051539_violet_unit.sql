-- Enable RLS on the drawings table
ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on the drawings table to start fresh
DROP POLICY IF EXISTS "Public Read Access" ON public.drawings;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON public.drawings;

-- Create a policy for public read access to drawings
CREATE POLICY "Public Read Access"
  ON public.drawings
  FOR SELECT
  TO public
  USING (true);

-- Create a policy for authenticated users to upload drawings
CREATE POLICY "Authenticated Upload Access"
  ON public.drawings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);