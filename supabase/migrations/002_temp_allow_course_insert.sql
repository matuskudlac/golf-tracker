-- Temporarily allow anyone to insert courses for development
-- This should be restricted in production

DROP POLICY IF EXISTS "Authenticated users can create courses" ON courses;

CREATE POLICY "Anyone can create courses (dev only)"
  ON courses FOR INSERT
  WITH CHECK (true);
