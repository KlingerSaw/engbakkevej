/*
  # Upload Verification System

  1. New Tables
    - `upload_verification_codes`
      - `id` (uuid, primary key)
      - `email` (text) - Email address for verification
      - `code` (text) - 6-digit verification code
      - `expires_at` (timestamptz) - Expiration time for code
      - `used` (boolean) - Whether code has been used
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `upload_verification_codes` table
    - No public access - only edge functions can write
    - Codes expire after 15 minutes
*/

CREATE TABLE IF NOT EXISTS upload_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE upload_verification_codes ENABLE ROW LEVEL SECURITY;

-- No one can read verification codes (security)
CREATE POLICY "No public access to verification codes"
  ON upload_verification_codes
  FOR ALL
  TO public
  USING (false);

-- Clean up expired codes function
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM upload_verification_codes
  WHERE expires_at < now() OR (used = true AND created_at < now() - interval '1 hour');
END;
$$;