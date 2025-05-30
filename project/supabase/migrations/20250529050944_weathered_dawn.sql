/*
  # Add storage bucket policies

  1. Changes
    - Create storage bucket policies for public access to shopdrawing bucket
    - Add policies for authenticated and public users to access files in the sd folder

  2. Security
    - Enable public read access to files in the sd folder
    - Allow authenticated users to upload files
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('shopdrawing', 'shopdrawing', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy to allow public read access to files in the sd folder
CREATE POLICY "Public Access to Shop Drawings" ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'shopdrawing' 
    AND (storage.foldername(name))[1] = 'sd'
  );

-- Policy to allow authenticated users to upload files to the sd folder
CREATE POLICY "Authenticated Users Can Upload Shop Drawings" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'shopdrawing' 
    AND (storage.foldername(name))[1] = 'sd'
  );