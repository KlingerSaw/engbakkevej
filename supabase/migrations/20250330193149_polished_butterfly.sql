/*
  # Update February board meeting minutes

  1. Changes
    - Update the minutes URL for the February board meeting with the complete minutes content
*/

UPDATE board_meetings 
SET minutes_url = 'https://pttjtcejudcytuzoevab.supabase.co/storage/v1/object/public/minutes/2025-02-27-minutes.pdf'
WHERE date = '2025-02-27 19:00:00+01';