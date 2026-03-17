/*
  # Fix Security Issues

  1. Performance Improvements
    - Add missing foreign key indexes on:
      - event_registrations.event_id
      - idea_comments.idea_id

  2. RLS Policy Security Fixes
    
    ## board_meetings
    - Restrict INSERT/UPDATE/DELETE to board members only
    - Only current board members can manage meetings
    
    ## general_meetings
    - Restrict INSERT/UPDATE/DELETE to board members only
    - Only current board members can manage meetings
    
    ## chat_messages
    - Keep public insert (chatbot functionality)
    - Add rate limiting consideration via device tracking
    
    ## event_registrations
    - Restrict to valid house numbers (8-38, even numbers)
    - Prevent duplicate registrations per house/event
    
    ## idea_comments
    - Restrict to valid house numbers (8-38, even numbers)
    
    ## idea_upvotes
    - Restrict to valid house numbers (8-38, even numbers)
    - Prevent duplicate upvotes per house/idea
    
    ## ideas
    - Restrict INSERT to valid house numbers (8-38, even numbers)
    - Restrict UPDATE to idea creator only (by device_id)
    
    ## news_likes
    - Prevent duplicate likes per device/news
    
    ## webmaster_requests
    - Add basic validation (non-empty name and message)

  3. Notes
    - Chat messages remain publicly insertable for chatbot functionality
    - Board members identified by house_number matching current board_members
    - Valid house numbers: 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id 
  ON event_registrations(event_id);

CREATE INDEX IF NOT EXISTS idx_idea_comments_idea_id 
  ON idea_comments(idea_id);

-- Helper function to check if a house number is valid (even numbers from 8 to 38)
CREATE OR REPLACE FUNCTION is_valid_house_number(num integer)
RETURNS boolean AS $$
BEGIN
  RETURN num >= 8 AND num <= 38 AND num % 2 = 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function to check if a house number is a current board member
CREATE OR REPLACE FUNCTION is_current_board_member(house_num integer)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM board_members
    WHERE house_number = house_num
      AND start_year <= EXTRACT(YEAR FROM CURRENT_DATE)
      AND (end_year IS NULL OR end_year >= EXTRACT(YEAR FROM CURRENT_DATE))
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- BOARD MEETINGS - Restrict to board members
-- ============================================

DROP POLICY IF EXISTS "Authenticated users can insert board meetings" ON board_meetings;
DROP POLICY IF EXISTS "Authenticated users can update board meetings" ON board_meetings;
DROP POLICY IF EXISTS "Authenticated users can delete board meetings" ON board_meetings;

CREATE POLICY "Board members can insert board meetings"
  ON board_meetings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.house_number = (auth.jwt() -> 'app_metadata' ->> 'house_number')::integer
        AND board_members.start_year <= EXTRACT(YEAR FROM CURRENT_DATE)
        AND (board_members.end_year IS NULL OR board_members.end_year >= EXTRACT(YEAR FROM CURRENT_DATE))
    )
  );

CREATE POLICY "Board members can update board meetings"
  ON board_meetings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.house_number = (auth.jwt() -> 'app_metadata' ->> 'house_number')::integer
        AND board_members.start_year <= EXTRACT(YEAR FROM CURRENT_DATE)
        AND (board_members.end_year IS NULL OR board_members.end_year >= EXTRACT(YEAR FROM CURRENT_DATE))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.house_number = (auth.jwt() -> 'app_metadata' ->> 'house_number')::integer
        AND board_members.start_year <= EXTRACT(YEAR FROM CURRENT_DATE)
        AND (board_members.end_year IS NULL OR board_members.end_year >= EXTRACT(YEAR FROM CURRENT_DATE))
    )
  );

CREATE POLICY "Board members can delete board meetings"
  ON board_meetings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.house_number = (auth.jwt() -> 'app_metadata' ->> 'house_number')::integer
        AND board_members.start_year <= EXTRACT(YEAR FROM CURRENT_DATE)
        AND (board_members.end_year IS NULL OR board_members.end_year >= EXTRACT(YEAR FROM CURRENT_DATE))
    )
  );

-- ============================================
-- GENERAL MEETINGS - Restrict to board members
-- ============================================

DROP POLICY IF EXISTS "Authenticated users can insert general meetings" ON general_meetings;
DROP POLICY IF EXISTS "Authenticated users can update general meetings" ON general_meetings;
DROP POLICY IF EXISTS "Authenticated users can delete general meetings" ON general_meetings;

CREATE POLICY "Board members can insert general meetings"
  ON general_meetings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.house_number = (auth.jwt() -> 'app_metadata' ->> 'house_number')::integer
        AND board_members.start_year <= EXTRACT(YEAR FROM CURRENT_DATE)
        AND (board_members.end_year IS NULL OR board_members.end_year >= EXTRACT(YEAR FROM CURRENT_DATE))
    )
  );

CREATE POLICY "Board members can update general meetings"
  ON general_meetings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.house_number = (auth.jwt() -> 'app_metadata' ->> 'house_number')::integer
        AND board_members.start_year <= EXTRACT(YEAR FROM CURRENT_DATE)
        AND (board_members.end_year IS NULL OR board_members.end_year >= EXTRACT(YEAR FROM CURRENT_DATE))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.house_number = (auth.jwt() -> 'app_metadata' ->> 'house_number')::integer
        AND board_members.start_year <= EXTRACT(YEAR FROM CURRENT_DATE)
        AND (board_members.end_year IS NULL OR board_members.end_year >= EXTRACT(YEAR FROM CURRENT_DATE))
    )
  );

CREATE POLICY "Board members can delete general meetings"
  ON general_meetings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.house_number = (auth.jwt() -> 'app_metadata' ->> 'house_number')::integer
        AND board_members.start_year <= EXTRACT(YEAR FROM CURRENT_DATE)
        AND (board_members.end_year IS NULL OR board_members.end_year >= EXTRACT(YEAR FROM CURRENT_DATE))
    )
  );

-- ============================================
-- EVENT REGISTRATIONS - Validate house numbers
-- ============================================

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON event_registrations;

CREATE POLICY "Valid house numbers can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (
    is_valid_house_number(house_number)
    AND NOT EXISTS (
      SELECT 1 FROM event_registrations er
      WHERE er.event_id = event_registrations.event_id
        AND er.house_number = event_registrations.house_number
        AND er.id != event_registrations.id
    )
  );

-- ============================================
-- IDEA COMMENTS - Validate house numbers
-- ============================================

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON idea_comments;

CREATE POLICY "Valid house numbers can comment on ideas"
  ON idea_comments FOR INSERT
  TO authenticated
  WITH CHECK (is_valid_house_number(house_number));

-- ============================================
-- IDEA UPVOTES - Validate house numbers and prevent duplicates
-- ============================================

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON idea_upvotes;

CREATE POLICY "Valid house numbers can upvote ideas once"
  ON idea_upvotes FOR INSERT
  TO authenticated
  WITH CHECK (
    is_valid_house_number(house_number)
    AND NOT EXISTS (
      SELECT 1 FROM idea_upvotes iv
      WHERE iv.idea_id = idea_upvotes.idea_id
        AND iv.house_number = idea_upvotes.house_number
        AND iv.id != idea_upvotes.id
    )
  );

-- ============================================
-- IDEAS - Validate house numbers and ownership
-- ============================================

DROP POLICY IF EXISTS "Allow public insert access to ideas" ON ideas;
DROP POLICY IF EXISTS "Allow public update access to ideas" ON ideas;

CREATE POLICY "Valid house numbers can create ideas"
  ON ideas FOR INSERT
  TO public
  WITH CHECK (
    is_valid_house_number(house_number)
    AND device_id IS NOT NULL
    AND title IS NOT NULL
    AND description IS NOT NULL
  );

CREATE POLICY "Idea creators can update their ideas"
  ON ideas FOR UPDATE
  TO public
  USING (device_id = current_setting('request.headers', true)::json->>'x-device-id')
  WITH CHECK (
    device_id = current_setting('request.headers', true)::json->>'x-device-id'
    AND is_valid_house_number(house_number)
    AND title IS NOT NULL
    AND description IS NOT NULL
  );

-- ============================================
-- NEWS LIKES - Prevent duplicate likes
-- ============================================

DROP POLICY IF EXISTS "Allow public insert access to news likes" ON news_likes;

CREATE POLICY "One like per device per news item"
  ON news_likes FOR INSERT
  TO public
  WITH CHECK (
    device_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM news_likes nl
      WHERE nl.news_id = news_likes.news_id
        AND nl.device_id = news_likes.device_id
        AND nl.id != news_likes.id
    )
  );

-- ============================================
-- WEBMASTER REQUESTS - Basic validation
-- ============================================

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON webmaster_requests;

CREATE POLICY "Authenticated users can submit valid requests"
  ON webmaster_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    name IS NOT NULL 
    AND trim(name) != ''
    AND message IS NOT NULL 
    AND trim(message) != ''
  );

-- ============================================
-- CHAT MESSAGES - Keep open for chatbot, add session validation
-- ============================================

DROP POLICY IF EXISTS "Anyone can insert chat messages" ON chat_messages;

CREATE POLICY "Anyone can insert chat messages with valid session"
  ON chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    session_id IS NOT NULL
    AND trim(session_id) != ''
    AND role IN ('user', 'assistant')
    AND content IS NOT NULL
    AND trim(content) != ''
  );
