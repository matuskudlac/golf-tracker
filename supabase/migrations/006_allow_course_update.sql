-- Allow anyone to update courses (matching the open policy for insert/delete)
CREATE POLICY "Anyone can update courses"
ON courses FOR UPDATE
USING (true)
WITH CHECK (true);
