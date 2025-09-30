/*
  # Set up development and production schemas

  1. Changes
    - Create development and production schemas
    - Move existing tables to production schema
    - Create corresponding tables in development schema
    - Create views in public schema that point to the correct environment
    - Add RLS policies for both environments
*/

-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS production;
CREATE SCHEMA IF NOT EXISTS development;

-- Function to determine current environment
CREATE OR REPLACE FUNCTION get_environment()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    current_setting('app.environment', true),
    CASE 
      WHEN current_setting('request.url.host', true) LIKE '%.supabase.co' THEN 'production'
      ELSE 'development'
    END
  );
$$;

-- Move existing tables to production schema
DO $$
BEGIN
  -- Only move if tables exist in public and not in production
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'events') 
     AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'production' AND tablename = 'events') THEN
    ALTER TABLE public.events SET SCHEMA production;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'board_meetings')
     AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'production' AND tablename = 'board_meetings') THEN
    ALTER TABLE public.board_meetings SET SCHEMA production;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'event_registrations')
     AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'production' AND tablename = 'event_registrations') THEN
    ALTER TABLE public.event_registrations SET SCHEMA production;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ideas')
     AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'production' AND tablename = 'ideas') THEN
    ALTER TABLE public.ideas SET SCHEMA production;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bylaws')
     AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'production' AND tablename = 'bylaws') THEN
    ALTER TABLE public.bylaws SET SCHEMA production;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'webmaster_requests')
     AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'production' AND tablename = 'webmaster_requests') THEN
    ALTER TABLE public.webmaster_requests SET SCHEMA production;
  END IF;
END $$;

-- Create tables in development schema
CREATE TABLE IF NOT EXISTS development.events (LIKE production.events INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.board_meetings (LIKE production.board_meetings INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.event_registrations (LIKE production.event_registrations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.ideas (LIKE production.ideas INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.bylaws (LIKE production.bylaws INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.webmaster_requests (LIKE production.webmaster_requests INCLUDING ALL);

-- Copy production data to development for testing
INSERT INTO development.events SELECT * FROM production.events ON CONFLICT DO NOTHING;
INSERT INTO development.board_meetings SELECT * FROM production.board_meetings ON CONFLICT DO NOTHING;
INSERT INTO development.event_registrations SELECT * FROM production.event_registrations ON CONFLICT DO NOTHING;
INSERT INTO development.ideas SELECT * FROM production.ideas ON CONFLICT DO NOTHING;
INSERT INTO development.bylaws SELECT * FROM production.bylaws ON CONFLICT DO NOTHING;
INSERT INTO development.webmaster_requests SELECT * FROM production.webmaster_requests ON CONFLICT DO NOTHING;

-- Create views in public schema that point to the correct environment
CREATE OR REPLACE VIEW public.events AS
  SELECT * FROM development.events
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.events
  WHERE get_environment() = 'production';

CREATE OR REPLACE VIEW public.board_meetings AS
  SELECT * FROM development.board_meetings
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.board_meetings
  WHERE get_environment() = 'production';

CREATE OR REPLACE VIEW public.event_registrations AS
  SELECT * FROM development.event_registrations
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.event_registrations
  WHERE get_environment() = 'production';

CREATE OR REPLACE VIEW public.ideas AS
  SELECT * FROM development.ideas
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.ideas
  WHERE get_environment() = 'production';

CREATE OR REPLACE VIEW public.bylaws AS
  SELECT * FROM development.bylaws
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.bylaws
  WHERE get_environment() = 'production';

CREATE OR REPLACE VIEW public.webmaster_requests AS
  SELECT * FROM development.webmaster_requests
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.webmaster_requests
  WHERE get_environment() = 'production';

-- Enable RLS on all tables in both schemas
DO $$
DECLARE
  schema text;
BEGIN
  FOR schema IN ('development', 'production') LOOP
    EXECUTE format('ALTER TABLE %I.events ENABLE ROW LEVEL SECURITY', schema);
    EXECUTE format('ALTER TABLE %I.board_meetings ENABLE ROW LEVEL SECURITY', schema);
    EXECUTE format('ALTER TABLE %I.event_registrations ENABLE ROW LEVEL SECURITY', schema);
    EXECUTE format('ALTER TABLE %I.ideas ENABLE ROW LEVEL SECURITY', schema);
    EXECUTE format('ALTER TABLE %I.bylaws ENABLE ROW LEVEL SECURITY', schema);
    EXECUTE format('ALTER TABLE %I.webmaster_requests ENABLE ROW LEVEL SECURITY', schema);
  END LOOP;
END $$;

-- Create RLS policies for both schemas
DO $$
DECLARE
  schema text;
BEGIN
  FOR schema IN ('development', 'production') LOOP
    -- Events policies
    EXECUTE format('
      CREATE POLICY "Allow public read access to events" ON %I.events
      FOR SELECT TO public USING (true)
    ', schema);

    -- Board meetings policies
    EXECUTE format('
      CREATE POLICY "Allow public read access to board_meetings" ON %I.board_meetings
      FOR SELECT TO public USING (true)
    ', schema);

    -- Event registrations policies
    EXECUTE format('
      CREATE POLICY "Allow public read access to event_registrations" ON %I.event_registrations
      FOR SELECT TO public USING (true)
    ', schema);

    EXECUTE format('
      CREATE POLICY "Allow public insert access to event_registrations" ON %I.event_registrations
      FOR INSERT TO public WITH CHECK (true)
    ', schema);

    EXECUTE format('
      CREATE POLICY "Allow public update access to event_registrations" ON %I.event_registrations
      FOR UPDATE TO public
      USING (device_id = current_setting(''app.device_id''::text, true)::text)
      WITH CHECK (device_id = current_setting(''app.device_id''::text, true)::text)
    ', schema);

    EXECUTE format('
      CREATE POLICY "Allow public delete access to event_registrations" ON %I.event_registrations
      FOR DELETE TO public
      USING (device_id = current_setting(''app.device_id''::text, true)::text)
    ', schema);

    -- Ideas policies
    EXECUTE format('
      CREATE POLICY "Allow public read access to ideas" ON %I.ideas
      FOR SELECT TO public USING (true)
    ', schema);

    EXECUTE format('
      CREATE POLICY "Allow public insert access to ideas" ON %I.ideas
      FOR INSERT TO public WITH CHECK (true)
    ', schema);

    EXECUTE format('
      CREATE POLICY "Allow public update access to ideas" ON %I.ideas
      FOR UPDATE TO public USING (true) WITH CHECK (true)
    ', schema);

    -- Bylaws policies
    EXECUTE format('
      CREATE POLICY "Allow public read access to bylaws" ON %I.bylaws
      FOR SELECT TO public USING (true)
    ', schema);

    -- Webmaster requests policies
    EXECUTE format('
      CREATE POLICY "Allow public read access to webmaster_requests" ON %I.webmaster_requests
      FOR SELECT TO public USING (true)
    ', schema);

    EXECUTE format('
      CREATE POLICY "Allow public insert access to webmaster_requests" ON %I.webmaster_requests
      FOR INSERT TO public WITH CHECK (true)
    ', schema);
  END LOOP;
END $$;