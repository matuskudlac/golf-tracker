-- ============================================================================
-- Golf Tracker AI - Initial Database Schema Migration
-- ============================================================================
-- Description: Creates the core database schema for golf round tracking
-- Author: Matus Kudlac
-- Date: 2026-01-03
-- ============================================================================

-- Enable UUID extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: accounts
-- ============================================================================
-- Purpose: User account information (extends Supabase auth.users)
-- ============================================================================

CREATE TABLE accounts (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handicap_index DECIMAL(4,1), -- e.g., 15.4
  avatar_url TEXT,
  home_course_id UUID, -- FK added after courses table is created
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accounts
CREATE POLICY "Users can view own account"
  ON accounts FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own account"
  ON accounts FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own account"
  ON accounts FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TABLE: courses
-- ============================================================================
-- Purpose: Golf course master data
-- ============================================================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state_region TEXT,
  country TEXT,
  total_holes INTEGER DEFAULT 18 NOT NULL CHECK (total_holes > 0),
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read, authenticated users can create)
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX idx_courses_name ON courses(name);
CREATE INDEX idx_courses_city ON courses(city);

-- ============================================================================
-- TABLE: course_holes
-- ============================================================================
-- Purpose: Template/master data for each hole on a course
-- ============================================================================

CREATE TABLE course_holes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  hole_number INTEGER NOT NULL CHECK (hole_number >= 1 AND hole_number <= 18),
  par INTEGER NOT NULL CHECK (par >= 3 AND par <= 5),
  distance INTEGER CHECK (distance > 0), -- yardage
  handicap INTEGER CHECK (handicap >= 1 AND handicap <= 18), -- stroke index
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(course_id, hole_number) -- Each course has exactly one hole #1, #2, etc.
);

-- Enable Row Level Security
ALTER TABLE course_holes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_holes
CREATE POLICY "Anyone can view course holes"
  ON course_holes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create course holes"
  ON course_holes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update course holes"
  ON course_holes FOR UPDATE
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX idx_course_holes_course_id ON course_holes(course_id);
CREATE INDEX idx_course_holes_hole_number ON course_holes(course_id, hole_number);

-- ============================================================================
-- TABLE: rounds
-- ============================================================================
-- Purpose: User's golf round metadata
-- ============================================================================

CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  date_played DATE NOT NULL,
  tee_color TEXT, -- 'white', 'blue', 'black', 'gold', etc.
  course_rating DECIMAL(4,1), -- e.g., 72.3
  slope_rating INTEGER CHECK (slope_rating >= 55 AND slope_rating <= 155), -- Official range
  total_score INTEGER NOT NULL CHECK (total_score > 0),
  scorecard_image_url TEXT,
  weather_conditions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rounds
CREATE POLICY "Users can view own rounds"
  ON rounds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rounds"
  ON rounds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rounds"
  ON rounds FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rounds"
  ON rounds FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_rounds_user_id ON rounds(user_id);
CREATE INDEX idx_rounds_course_id ON rounds(course_id);
CREATE INDEX idx_rounds_date_played ON rounds(date_played DESC);
CREATE INDEX idx_rounds_user_date ON rounds(user_id, date_played DESC);

-- ============================================================================
-- TABLE: round_holes
-- ============================================================================
-- Purpose: User's actual performance on each hole during a round
-- ============================================================================

CREATE TABLE round_holes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  course_hole_id UUID NOT NULL REFERENCES course_holes(id) ON DELETE RESTRICT,
  
  -- User's actual performance (Phase 1 - AI fills these)
  score INTEGER NOT NULL CHECK (score > 0),
  putts INTEGER CHECK (putts >= 0),
  
  -- Optional stats (Phase 2 - User can fill these later)
  fairway_hit BOOLEAN,
  gir BOOLEAN, -- Green in Regulation
  penalties INTEGER DEFAULT 0 CHECK (penalties >= 0),
  sand_saves BOOLEAN,
  up_and_down BOOLEAN,
  club_used TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(round_id, course_hole_id) -- Can't score same hole twice in one round
);

-- Enable Row Level Security
ALTER TABLE round_holes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for round_holes (inherit from rounds)
CREATE POLICY "Users can view own round holes"
  ON round_holes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = round_holes.round_id
      AND rounds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own round holes"
  ON round_holes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = round_holes.round_id
      AND rounds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own round holes"
  ON round_holes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = round_holes.round_id
      AND rounds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own round holes"
  ON round_holes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = round_holes.round_id
      AND rounds.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_round_holes_round_id ON round_holes(round_id);
CREATE INDEX idx_round_holes_course_hole_id ON round_holes(course_hole_id);

-- ============================================================================
-- Add Foreign Key Constraint for home_course_id
-- ============================================================================
-- (Must be added after courses table exists)

ALTER TABLE accounts
  ADD CONSTRAINT fk_accounts_home_course
  FOREIGN KEY (home_course_id)
  REFERENCES courses(id)
  ON DELETE SET NULL;

-- ============================================================================
-- FUNCTIONS: Auto-update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_holes_updated_at
  BEFORE UPDATE ON course_holes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rounds_updated_at
  BEFORE UPDATE ON rounds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_round_holes_updated_at
  BEFORE UPDATE ON round_holes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Auto-create account on user signup
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO accounts (id, created_at, updated_at)
  VALUES (
    NEW.id,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create account when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify tables were created successfully
-- 3. Generate TypeScript types: 
--    npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
-- ============================================================================
