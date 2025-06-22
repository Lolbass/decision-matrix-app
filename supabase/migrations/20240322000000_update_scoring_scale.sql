-- Update scoring scale from 0-5 to 0-10
-- This migration updates the score constraint in the option_criteria table

-- Drop the existing constraint
ALTER TABLE option_criteria DROP CONSTRAINT IF EXISTS option_criteria_score_check;

-- Add the new constraint with 0-10 range
ALTER TABLE option_criteria ADD CONSTRAINT option_criteria_score_check CHECK (score >= 0 AND score <= 10);

-- Update any existing data to stay within the new range (optional, for safety)
-- Since we're expanding the range, existing data should remain valid
UPDATE option_criteria SET score = LEAST(score, 10) WHERE score > 10; 