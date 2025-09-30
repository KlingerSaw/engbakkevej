/*
  # Add February 2025 board meeting

  1. Changes
    - Insert new board meeting record for February 27, 2025
    - Add meeting minutes content
*/

INSERT INTO board_meetings (date, location, minutes_url)
VALUES (
  '2025-02-27 19:00:00+01',
  'Lars',
  'https://pttjtcejudcytuzoevab.supabase.co/storage/v1/object/public/meeting-minutes/2025-02-27-minutes.pdf'
);