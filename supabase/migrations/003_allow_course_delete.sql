-- Allow anyone to delete courses (same as insert policy)
CREATE POLICY "Anyone can delete courses"
  ON courses FOR DELETE
  USING (true);
