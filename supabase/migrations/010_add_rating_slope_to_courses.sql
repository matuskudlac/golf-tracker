-- ============================================================================
-- MIGRATION: 010_add_rating_slope_to_courses.sql
-- ============================================================================
-- Description: Adds Course Rating (CR) and Slope Rating (SR) to the courses table.
--              This aligns with the existing schema where 'tee_color' is on the 
--              courses table, implying each course row represents a specific tee set.
-- ============================================================================

ALTER TABLE courses
ADD COLUMN course_rating DECIMAL(4,1), -- e.g. 72.1
ADD COLUMN slope_rating INTEGER; -- Standard range

COMMENT ON COLUMN courses.course_rating IS 'Course Rating (CR)';
COMMENT ON COLUMN courses.slope_rating IS 'Slope Rating (SR)';
