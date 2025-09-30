/*
  # Add attachment_url to ideas table

  1. Changes
    - Add attachment_url column to ideas table
    - Allow NULL values for optional attachments
*/

ALTER TABLE ideas
ADD COLUMN attachment_url text;