-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('shopdrawing', 'shopdrawing', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Create policies directly on the objects table
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'shopdrawing');

CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'shopdrawing');