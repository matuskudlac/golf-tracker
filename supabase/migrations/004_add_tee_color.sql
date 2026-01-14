-- Add tee_color to courses table to label which tees the yardage data belongs to
ALTER TABLE courses ADD COLUMN tee_color TEXT DEFAULT 'Yellow';
