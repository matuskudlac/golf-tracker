-- ============================================================================
-- Helper: Assign existing courses to current user
-- ============================================================================
-- Run this AFTER migration 008 to assign your existing courses to your account
-- This will assign all courses with NULL user_id to the currently authenticated user

-- First, check how many courses need assignment:
-- SELECT COUNT(*) FROM courses WHERE user_id IS NULL;

-- Then run this to assign them to your user:
-- UPDATE courses 
-- SET user_id = auth.uid() 
-- WHERE user_id IS NULL;

-- Note: This must be run while authenticated (e.g., from Supabase SQL Editor while logged in)
-- Or you can manually set the user_id if you know it:
-- UPDATE courses SET user_id = 'your-user-id-here' WHERE user_id IS NULL;
