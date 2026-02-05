-- ============================================================================
-- MIGRATION: 011_add_user_preferences.sql
-- ============================================================================
-- Description: Adds user preference columns for settings page
-- ============================================================================

ALTER TABLE accounts
ADD COLUMN preferred_units TEXT DEFAULT 'meters' CHECK (preferred_units IN ('meters', 'yards')),
ADD COLUMN preferred_theme TEXT DEFAULT 'system' CHECK (preferred_theme IN ('light', 'dark', 'system')),
ADD COLUMN default_tee_color TEXT DEFAULT 'Yellow';

COMMENT ON COLUMN accounts.preferred_units IS 'Distance unit preference: meters or yards';
COMMENT ON COLUMN accounts.preferred_theme IS 'App theme preference: light, dark, or system';
COMMENT ON COLUMN accounts.default_tee_color IS 'Default tee color for new rounds/courses';
