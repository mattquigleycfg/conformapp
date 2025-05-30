-- Create a function to safely create policies
CREATE OR REPLACE FUNCTION create_storage_policy(
    policy_name text,
    bucket_name text,
    folder_name text
) RETURNS void AS $$
BEGIN
    -- Drop existing policy if it exists
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
    
    -- Create new policy
    EXECUTE format('
        CREATE POLICY %I ON storage.objects
        FOR ALL
        TO public
        USING (bucket_id = %L AND split_part(name, ''/'', 1) = %L)
        WITH CHECK (bucket_id = %L AND split_part(name, ''/'', 1) = %L)
    ', policy_name, bucket_name, folder_name, bucket_name, folder_name);
END;
$$ LANGUAGE plpgsql;

-- Create policies for each folder
SELECT create_storage_policy('public_sd_access', 'shopdrawing', 'sd');
SELECT create_storage_policy('public_packout_access', 'shopdrawing', 'packout');
SELECT create_storage_policy('public_sheet_access', 'shopdrawing', 'sheet');

-- Drop the helper function
DROP FUNCTION create_storage_policy;