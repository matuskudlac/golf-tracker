-- ============================================================================
-- Make courses user-owned: Add user_id and fix RLS policies
-- ============================================================================

-- Add user_id column to courses table
ALTER TABLE courses 
ADD COLUMN user_id UUID REFERENCES accounts(id) ON DELETE CASCADE;

-- Make user_id required for new courses (existing courses will need migration)
-- For now, we'll allow NULL for existing data, but new inserts must have user_id

-- Drop all existing permissive policies
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;
DROP POLICY IF EXISTS "Anyone can create courses (dev only)" ON courses;
DROP POLICY IF EXISTS "Anyone can delete courses" ON courses;
DROP POLICY IF EXISTS "Anyone can update courses" ON courses;
DROP POLICY IF EXISTS "Authenticated users can create courses" ON courses;
DROP POLICY IF EXISTS "Authenticated users can update courses" ON courses;

-- Create user-owned RLS policies
CREATE POLICY "Users can view own courses"
  ON courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger to auto-set user_id on courses insert (same pattern as rounds)
CREATE OR REPLACE FUNCTION auto_set_user_id_on_courses()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-set user_id from auth.uid() if not provided
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  
  -- Ensure user_id matches authenticated user
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'user_id must match authenticated user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_user_id_on_courses_insert
  BEFORE INSERT ON courses
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_user_id_on_courses();
