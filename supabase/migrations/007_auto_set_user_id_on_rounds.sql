-- ============================================================================
-- Simplify RLS: Revert trigger and just allow authenticated inserts
-- ============================================================================

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS set_user_id_on_rounds_insert ON rounds;
DROP FUNCTION IF EXISTS auto_set_user_id_on_rounds();

-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can insert own rounds" ON rounds;

-- Create simple insert policy
-- We will enforce user_id validation, but rely on the client sending it
CREATE POLICY "Users can insert own rounds"
  ON rounds FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
