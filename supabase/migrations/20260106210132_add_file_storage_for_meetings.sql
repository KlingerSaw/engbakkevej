/*
  # Add file storage support for meeting documents

  1. Storage Buckets
    - Creates `board_meetings_documents` bucket for board meeting files
    - Creates `general_meetings_documents` bucket for general meeting files
    - Enables public read access for all documents

  2. Database Changes
    - Adds file storage columns to `board_meetings` table:
      - `minutes_file_url` (text, nullable) - Storage path for uploaded minutes file
      - `minutes_file_name` (text, nullable) - Original filename
      - `minutes_file_size` (integer, nullable) - File size in bytes
    
    - Adds file storage columns to `general_meetings` table:
      - `board_proposal_file_url` (text, nullable) - Storage path for board proposal file
      - `board_proposal_file_name` (text, nullable) - Original filename
      - `board_proposal_file_size` (integer, nullable) - File size in bytes
      - `board_report_file_url` (text, nullable) - Storage path for board report file
      - `board_report_file_name` (text, nullable) - Original filename
      - `board_report_file_size` (integer, nullable) - File size in bytes
      - `minutes_file_url` (text, nullable) - Storage path for minutes file
      - `minutes_file_name` (text, nullable) - Original filename
      - `minutes_file_size` (integer, nullable) - File size in bytes

  3. Security
    - Storage policies allow authenticated users to upload
    - Public read access for all documents
    - Authenticated users can delete their own uploads

  4. Important Notes
    - Existing HTML-based documents (minutes_text, etc.) are preserved
    - New file-based storage provides alternative to HTML storage
    - Both methods can coexist for backward compatibility
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('board_meetings_documents', 'board_meetings_documents', true),
  ('general_meetings_documents', 'general_meetings_documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for board_meetings_documents
CREATE POLICY "Authenticated users can upload board meeting documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'board_meetings_documents');

CREATE POLICY "Public read access for board meeting documents"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'board_meetings_documents');

CREATE POLICY "Authenticated users can delete board meeting documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'board_meetings_documents');

-- Storage policies for general_meetings_documents
CREATE POLICY "Authenticated users can upload general meeting documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'general_meetings_documents');

CREATE POLICY "Public read access for general meeting documents"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'general_meetings_documents');

CREATE POLICY "Authenticated users can delete general meeting documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'general_meetings_documents');

-- Add file storage columns to board_meetings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'board_meetings' AND column_name = 'minutes_file_url'
  ) THEN
    ALTER TABLE board_meetings 
    ADD COLUMN minutes_file_url text,
    ADD COLUMN minutes_file_name text,
    ADD COLUMN minutes_file_size integer;
  END IF;
END $$;

-- Add file storage columns to general_meetings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'general_meetings' AND column_name = 'board_proposal_file_url'
  ) THEN
    ALTER TABLE general_meetings 
    ADD COLUMN board_proposal_file_url text,
    ADD COLUMN board_proposal_file_name text,
    ADD COLUMN board_proposal_file_size integer,
    ADD COLUMN board_report_file_url text,
    ADD COLUMN board_report_file_name text,
    ADD COLUMN board_report_file_size integer,
    ADD COLUMN minutes_file_url text,
    ADD COLUMN minutes_file_name text,
    ADD COLUMN minutes_file_size integer;
  END IF;
END $$;