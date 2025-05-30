-- Enable storage by inserting the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('shopdrawing', 'shopdrawing', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create a single policy that allows public access
CREATE POLICY "Allow public access"
ON storage.objects
AS PERMISSIVE
FOR ALL
TO public
USING (bucket_id = 'shopdrawing')
WITH CHECK (bucket_id = 'shopdrawing');