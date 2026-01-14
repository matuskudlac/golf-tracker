-- Allow anyone to insert into course_holes (matching the open policy for courses)
DROP POLICY IF EXISTS "Authenticated users can create course holes" ON course_holes;
CREATE POLICY "Anyone can create course holes"
ON course_holes FOR INSERT
WITH CHECK (true);

-- Allow anyone to delete course holes (for cascade deletes or manual cleanups)
CREATE POLICY "Anyone can delete course holes"
ON course_holes FOR DELETE
USING (true);
