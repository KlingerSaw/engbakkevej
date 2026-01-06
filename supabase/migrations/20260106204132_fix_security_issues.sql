/*
  # Fix Security Issues

  1. Drop Unused Indexes
    - Drop idx_news_likes_device_id on news_likes
    - Drop idx_events_year on events
    - Drop idx_news_year on news
    - Drop idx_event_registrations_event_id on event_registrations
    - Drop idx_idea_comments_idea_id on idea_comments
    - Drop idx_ideas_year on ideas

  2. Remove Duplicate RLS Policies
    - Remove old "Enable read access for all users" policies from board_meetings
    - Remove old "Enable read access for all users" policies from general_meetings
    - Keep the newer "Anyone can view" policies

  3. Notes
    - Some "Always True" policies are intentional for public access tables
    - Auth DB connection strategy and leaked password protection must be configured in Supabase Dashboard
    - Postgres version upgrade must be done via Supabase Dashboard
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_news_likes_device_id;
DROP INDEX IF EXISTS idx_events_year;
DROP INDEX IF EXISTS idx_news_year;
DROP INDEX IF EXISTS idx_event_registrations_event_id;
DROP INDEX IF EXISTS idx_idea_comments_idea_id;
DROP INDEX IF EXISTS idx_ideas_year;

-- Remove duplicate policies on board_meetings
DROP POLICY IF EXISTS "Enable read access for all users" ON board_meetings;

-- Remove duplicate policies on general_meetings
DROP POLICY IF EXISTS "Enable read access for all users" ON general_meetings;
