/*
  # Add house number to ideas table

  1. Changes
    - Add house_number column to ideas table
    - Add device_id column to ideas table for verification
    - Make both fields required for new ideas
*/

-- Add new columns
ALTER TABLE ideas
ADD COLUMN house_number integer NOT NULL DEFAULT 8,
ADD COLUMN device_id text NOT NULL DEFAULT 'legacy_user';

-- Remove the default values after adding them to existing rows
ALTER TABLE ideas
ALTER COLUMN house_number DROP DEFAULT,
ALTER COLUMN device_id DROP DEFAULT;