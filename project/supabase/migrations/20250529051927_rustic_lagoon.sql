-- First, clean up existing policies
DROP POLICY IF EXISTS "Public Access to Shop Drawings" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Upload Shop Drawings" ON storage.objects;
DROP POLICY IF EXISTS "public_sd_access" ON storage.objects;
DROP POLICY IF EXISTS "public_packout_access" ON storage.objects;
DROP POLICY IF EXISTS "public_sheet_access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Upload" ON storage.objects;

-- Create new storage policies with proper access controls
CREATE POLICY "Public Read Access - Shop Drawings"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'shopdrawing'
    AND (storage.foldername(name))[1] = 'sd'
  );

CREATE POLICY "Authenticated Upload Access - Shop Drawings"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'shopdrawing'
    AND (storage.foldername(name))[1] = 'sd'
    AND auth.role() = 'authenticated'
  );

-- Update drawings table policies
DROP POLICY IF EXISTS "Public Read Access" ON public.drawings;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON public.drawings;

CREATE POLICY "Public Read Access"
  ON public.drawings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated Upload Access"
  ON public.drawings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Basic validation
    width > 0 
    AND length > 0 
    AND pitch > 0
    AND product_type IS NOT NULL
    AND screen_type IS NOT NULL
    AND file_path IS NOT NULL
  );

-- Add audit columns
ALTER TABLE public.drawings 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Update trigger for audit trail
CREATE OR REPLACE FUNCTION update_drawings_audit_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.created_by = auth.uid();
    END IF;
    NEW.updated_by = auth.uid();
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS drawings_audit_trigger ON public.drawings;
CREATE TRIGGER drawings_audit_trigger
    BEFORE INSERT OR UPDATE ON public.drawings
    FOR EACH ROW
    EXECUTE FUNCTION update_drawings_audit_fields();