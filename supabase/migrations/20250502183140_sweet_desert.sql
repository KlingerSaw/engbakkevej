/*
  # Create storage bucket and policies for idea attachments

  1. Changes
    - Create idea-attachments bucket if it doesn't exist
    - Add policies for public access if they don't exist
    - Allow file operations (upload, update, delete)
*/

-- First, ensure the bucket exists
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('idea-attachments', 'idea-attachments', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Add policies only if they don't exist
DO $$
BEGIN
    -- Public read access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access"
        ON storage.objects FOR SELECT
        TO public
        USING ( bucket_id = 'idea-attachments' );
    END IF;

    -- Public upload access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Anyone can upload files'
    ) THEN
        CREATE POLICY "Anyone can upload files"
        ON storage.objects FOR INSERT
        TO public
        WITH CHECK ( bucket_id = 'idea-attachments' );
    END IF;

    -- Public update access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Anyone can update files'
    ) THEN
        CREATE POLICY "Anyone can update files"
        ON storage.objects FOR UPDATE
        TO public
        USING ( bucket_id = 'idea-attachments' )
        WITH CHECK ( bucket_id = 'idea-attachments' );
    END IF;

    -- Public delete access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Anyone can delete files'
    ) THEN
        CREATE POLICY "Anyone can delete files"
        ON storage.objects FOR DELETE
        TO public
        USING ( bucket_id = 'idea-attachments' );
    END IF;
END $$;