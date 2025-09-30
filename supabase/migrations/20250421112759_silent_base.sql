/*
  # Separate development and production environments

  1. Changes
    - Create development and production schemas
    - Move existing tables to production schema
    - Create views in public schema that point to the correct environment
    - Add RLS policies for both environments
*/

-- Create schemas for different environments
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

-- Function to get current schema
CREATE OR REPLACE FUNCTION get_current_schema()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT CASE get_environment()
    WHEN 'production' THEN 'production'
    ELSE 'development'
  END;
$$;

-- Move existing tables to production schema
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename IN ('events', 'event_registrations', 'ideas', 'webmaster_requests', 'board_meetings', 'bylaws')
  LOOP
    EXECUTE format('ALTER TABLE public.%I SET SCHEMA production', table_name);
    EXECUTE format('ALTER TABLE production.%I ENABLE ROW LEVEL SECURITY', table_name);
  END LOOP;
END
$$;

-- Create tables in development schema
CREATE TABLE IF NOT EXISTS development.events (LIKE production.events INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.event_registrations (LIKE production.event_registrations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.ideas (LIKE production.ideas INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.webmaster_requests (LIKE production.webmaster_requests INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.board_meetings (LIKE production.board_meetings INCLUDING ALL);
CREATE TABLE IF NOT EXISTS development.bylaws (LIKE production.bylaws INCLUDING ALL);

-- Enable RLS on development tables
ALTER TABLE development.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE development.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE development.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE development.webmaster_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE development.board_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE development.bylaws ENABLE ROW LEVEL SECURITY;

-- Create views in public schema that point to the correct environment
CREATE OR REPLACE VIEW public.events AS
  SELECT * FROM development.events
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.events
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

CREATE OR REPLACE VIEW public.webmaster_requests AS
  SELECT * FROM development.webmaster_requests
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.webmaster_requests
  WHERE get_environment() = 'production';

CREATE OR REPLACE VIEW public.board_meetings AS
  SELECT * FROM development.board_meetings
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.board_meetings
  WHERE get_environment() = 'production';

CREATE OR REPLACE VIEW public.bylaws AS
  SELECT * FROM development.bylaws
  WHERE get_environment() = 'development'
  UNION ALL
  SELECT * FROM production.bylaws
  WHERE get_environment() = 'production';

-- Create rules to handle inserts, updates, and deletes on the views
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname IN ('development', 'production')
  LOOP
    -- Insert rule
    EXECUTE format('
      CREATE OR REPLACE RULE %I_insert AS
      ON INSERT TO public.%I
      DO INSTEAD
      INSERT INTO ' || get_current_schema() || '.%I VALUES (NEW.*)',
      table_name, table_name, table_name
    );

    -- Update rule
    EXECUTE format('
      CREATE OR REPLACE RULE %I_update AS
      ON UPDATE TO public.%I
      DO INSTEAD
      UPDATE ' || get_current_schema() || '.%I SET %s',
      table_name, table_name, table_name,
      (
        SELECT string_agg(quote_ident(attname) || ' = NEW.' || quote_ident(attname), ', ')
        FROM pg_attribute
        WHERE attrelid = format('public.%I', table_name)::regclass
        AND attnum > 0
        AND NOT attisdropped
      )
    );

    -- Delete rule
    EXECUTE format('
      CREATE OR REPLACE RULE %I_delete AS
      ON DELETE TO public.%I
      DO INSTEAD
      DELETE FROM ' || get_current_schema() || '.%I WHERE id = OLD.id',
      table_name, table_name, table_name
    );
  END LOOP;
END
$$;

-- Copy production data to development for testing
INSERT INTO development.events SELECT * FROM production.events;
INSERT INTO development.bylaws SELECT * FROM production.bylaws;
INSERT INTO development.board_meetings SELECT * FROM production.board_meetings;