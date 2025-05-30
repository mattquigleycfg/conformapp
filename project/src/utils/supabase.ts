import { createClient } from '@supabase/supabase-js';
import { DrawingRecord } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export const uploadPdf = async (file: File, filePath: string) => {
  try {
    const { error: uploadError } = await supabase.storage
      .from('shopdrawing')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    return true;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const uploadDrawing = async (
  file: File,
  metadata: Omit<DrawingRecord, 'id' | 'file_path' | 'created_at' | 'updated_at'>
) => {
  try {
    // Generate file path
    const fileName = `${metadata.product_type}-${metadata.screen_type}-${metadata.width}-${metadata.length}-${metadata.pitch}${metadata.extra_detail || ''}.pdf`;
    const filePath = `sd/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('shopdrawing')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Insert metadata into drawings table
    const { error: insertError } = await supabase
      .from('drawings')
      .insert({
        ...metadata,
        file_path: filePath
      });

    if (insertError) throw insertError;

    return true;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getDrawings = async () => {
  const { data, error } = await supabase
    .from('drawings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getPdfUrl = async (filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('shopdrawing')
      .createSignedUrl(filePath, 3600);

    if (error) throw error;
    return data?.signedUrl;
  } catch (error) {
    console.error('Get PDF URL error:', error);
    throw error;
  }
};