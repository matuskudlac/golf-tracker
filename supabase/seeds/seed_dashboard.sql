-- ============================================================================
-- SQL SEED SCRIPT: Populate Dashboard with Realistic Test Data (V3)
-- ============================================================================
-- HOW TO USE:
-- 1. Replace 'YOUR_USER_ID_HERE' with your actual Supabase User UUID.
-- 2. Run this script in the Supabase SQL Editor.
-- ============================================================================

DO $$
DECLARE
  v_user_id UUID := '6e1fc5ac-f640-4388-85ed-7289e392b474'; -- <--- REPLACE THIS !!!!
  
  v_pebble_id UUID;
  v_augusta_id UUID;
  v_st_andrews_id UUID;
  
  -- ==========================================
  -- COURSE DATA: Pebble Beach (Blue Tees)
  -- ==========================================
  v_pebble_pars INTEGER[] := ARRAY[4,5,4,4,3,5,3,4,4, 4,4,3,4,5,4,4,3,5];
  v_pebble_yards INTEGER[] := ARRAY[377,511,390,326,192,506,106,427,481, 446,373,201,403,572,396,401,177,543];
  v_pebble_hcps INTEGER[] := ARRAY[8,10,12,16,14,2,18,6,4, 7,5,17,9,1,13,11,15,3]; -- Men's HCP
  
  -- ==========================================
  -- COURSE DATA: Augusta National (Member/Masters Est)
  -- ==========================================
  v_augusta_pars INTEGER[] := ARRAY[4,5,4,3,4,3,4,5,4, 4,4,3,5,4,5,3,4,4];
  v_augusta_yards INTEGER[] := ARRAY[445,575,350,240,495,180,450,570,460, 495,520,155,545,440,550,170,440,465];
  v_augusta_hcps INTEGER[] := ARRAY[9,1,13,15,5,17,11,3,7, 6,8,16,4,12,2,18,14,10]; -- Estimated HCP Rating
  
  -- ==========================================
  -- COURSE DATA: St Andrews Old Course (Yellow Tees)
  -- ==========================================
  v_st_andrews_pars INTEGER[] := ARRAY[4,4,4,4,5,4,4,3,4, 4,3,4,4,5,4,4,4,4];
  v_st_andrews_yards INTEGER[] := ARRAY[355,395,337,411,514,360,349,154,289, 311,164,304,388,523,391,345,436,361];
  v_st_andrews_hcps INTEGER[] := ARRAY[10,6,16,8,2,12,4,14,18, 15,7,3,11,1,9,13,5,17];
  
  v_round_id UUID;
  v_course_hole_ids UUID[];
  v_hole_id UUID;
  v_par INTEGER;
  v_score INTEGER;
  v_putts INTEGER;
  v_gir BOOLEAN;
  v_fairway BOOLEAN;
  
  -- Helper function components
  i INTEGER;
  v_strokes_to_distribute INTEGER;
BEGIN

  -- 1. Create Courses & Course Holes
  -- ==========================================================
  
  -- Pebble Beach
  SELECT id INTO v_pebble_id FROM courses WHERE name = 'Pebble Beach Golf Links';
  IF v_pebble_id IS NULL THEN
    INSERT INTO courses (name, city, state_region, country, total_holes)
    VALUES ('Pebble Beach Golf Links', 'Pebble Beach', 'CA', 'USA', 18)
    RETURNING id INTO v_pebble_id;
  END IF;
  
  FOR i IN 1..18 LOOP
    INSERT INTO course_holes (course_id, hole_number, par, distance, handicap)
    VALUES (v_pebble_id, i, v_pebble_pars[i], v_pebble_yards[i], v_pebble_hcps[i])
    ON CONFLICT (course_id, hole_number) 
    DO UPDATE SET par = EXCLUDED.par, distance = EXCLUDED.distance, handicap = EXCLUDED.handicap;
  END LOOP;

  -- Augusta National
  SELECT id INTO v_augusta_id FROM courses WHERE name = 'Augusta National';
  IF v_augusta_id IS NULL THEN
    INSERT INTO courses (name, city, state_region, country, total_holes)
    VALUES ('Augusta National', 'Augusta', 'GA', 'USA', 18)
    RETURNING id INTO v_augusta_id;
  END IF;

  FOR i IN 1..18 LOOP
    INSERT INTO course_holes (course_id, hole_number, par, distance, handicap)
    VALUES (v_augusta_id, i, v_augusta_pars[i], v_augusta_yards[i], v_augusta_hcps[i])
    ON CONFLICT (course_id, hole_number) 
    DO UPDATE SET par = EXCLUDED.par, distance = EXCLUDED.distance, handicap = EXCLUDED.handicap;
  END LOOP;
  
  -- St Andrews
  SELECT id INTO v_st_andrews_id FROM courses WHERE name = 'Old Course at St Andrews';
  IF v_st_andrews_id IS NULL THEN
    INSERT INTO courses (name, city, state_region, country, total_holes)
    VALUES ('Old Course at St Andrews', 'St Andrews', 'Scotland', 'UK', 18)
    RETURNING id INTO v_st_andrews_id;
  END IF;

  FOR i IN 1..18 LOOP
    INSERT INTO course_holes (course_id, hole_number, par, distance, handicap)
    VALUES (v_st_andrews_id, i, v_st_andrews_pars[i], v_st_andrews_yards[i], v_st_andrews_hcps[i])
    ON CONFLICT (course_id, hole_number) 
    DO UPDATE SET par = EXCLUDED.par, distance = EXCLUDED.distance, handicap = EXCLUDED.handicap;
  END LOOP;


  -- 2. Create Rounds & Round Holes
  -- ==========================================================
  
  -- We'll manually insert a few DISTINCT rounds with logic to distribute scores
  
  -------------------------------------------------------
  -- ROUND 1: Pebble Beach (Last Week, Score 82)
  -------------------------------------------------------
  -- Note: We assume round doesn't exist or we just append. To avoid spam, you might want to truncate rounds first.
  
  INSERT INTO rounds (user_id, course_id, date_played, total_score, holes_played, notes, greens_in_regulation, fairways_hit, fairways_opportunities, total_putts)
  VALUES (v_user_id, v_pebble_id, CURRENT_DATE - 2, 82, 18, 'Great weather', 10, 8, 14, 30)
  RETURNING id INTO v_round_id;
  
  SELECT ARRAY(SELECT id FROM course_holes WHERE course_id = v_pebble_id ORDER BY hole_number) INTO v_course_hole_ids;
  
  -- Score 82 (+10).
  v_strokes_to_distribute := 10;
  
  FOR i IN 1..18 LOOP
    v_par := v_pebble_pars[i];
    v_score := v_par;
    
    -- Add strokes based on difficulty (handicap) roughly? Or random. Let's do random for variety.
    IF v_strokes_to_distribute > 0 AND (random() > 0.3 OR i > 15) THEN 
       v_score := v_score + 1;
       v_strokes_to_distribute := v_strokes_to_distribute - 1;
    END IF;
    
    v_putts := CASE WHEN v_score <= v_par THEN 1 ELSE 2 END;
    v_gir := (v_score - v_putts) <= (v_par - 2); 
    v_fairway := (v_par > 3 AND random() > 0.4);

    INSERT INTO round_holes (round_id, course_hole_id, score, putts, gir, fairway_hit)
    VALUES (v_round_id, v_course_hole_ids[i], v_score, v_putts, v_gir, v_fairway)
    ON CONFLICT DO NOTHING;
  END LOOP;


  -------------------------------------------------------
  -- ROUND 2: Augusta (2 Weeks Ago, Score 88)
  -------------------------------------------------------
  INSERT INTO rounds (user_id, course_id, date_played, total_score, holes_played, notes, greens_in_regulation, fairways_hit, fairways_opportunities, total_putts)
  VALUES (v_user_id, v_augusta_id, CURRENT_DATE - 14, 88, 18, 'Tough greens', 6, 9, 14, 34)
  RETURNING id INTO v_round_id;
  
  SELECT ARRAY(SELECT id FROM course_holes WHERE course_id = v_augusta_id ORDER BY hole_number) INTO v_course_hole_ids;
  
  -- Score 88 (+16).
  FOR i IN 1..18 LOOP
    v_par := v_augusta_pars[i];
    v_score := v_par + 1; -- Base bogey golf
    if (i % 3 = 0) THEN v_score := v_par; END IF; -- Occasional par
    
    INSERT INTO round_holes (round_id, course_hole_id, score, putts, gir, fairway_hit)
    VALUES (v_round_id, v_course_hole_ids[i], v_score, 2, false, (v_par>3 AND random()>0.5))
    ON CONFLICT DO NOTHING;
  END LOOP;


  -------------------------------------------------------
  -- ROUND 3: St Andrews (1 Month Ago, Score 76)
  -------------------------------------------------------
  INSERT INTO rounds (user_id, course_id, date_played, total_score, holes_played, notes, greens_in_regulation, fairways_hit, fairways_opportunities, total_putts)
  VALUES (v_user_id, v_st_andrews_id, CURRENT_DATE - 30, 76, 18, 'PB!', 13, 11, 14, 28)
  RETURNING id INTO v_round_id;
  
  SELECT ARRAY(SELECT id FROM course_holes WHERE course_id = v_st_andrews_id ORDER BY hole_number) INTO v_course_hole_ids;
  
  -- Score 76 (+4).
  v_strokes_to_distribute := 4;
  FOR i IN 1..18 LOOP
    v_par := v_st_andrews_pars[i];
    v_score := v_par;
    
    IF v_strokes_to_distribute > 0 AND random() > 0.6 THEN
       v_score := v_score + 1;
       v_strokes_to_distribute := v_strokes_to_distribute - 1;
    END IF;

    INSERT INTO round_holes (round_id, course_hole_id, score, putts, gir, fairway_hit)
    VALUES (v_round_id, v_course_hole_ids[i], v_score, 2, true, true)
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Add Bulk History
  FOR i IN 1..15 LOOP
    INSERT INTO rounds (user_id, course_id, date_played, total_score, holes_played, greens_in_regulation, fairways_hit, fairways_opportunities, total_putts)
    VALUES (
      v_user_id, 
      CASE WHEN (i % 3 = 0) THEN v_pebble_id WHEN (i % 3 = 1) THEN v_augusta_id ELSE v_st_andrews_id END,
      CURRENT_DATE - (i * 7 + 40), 
      80 + (i % 10),
      18,
      8 + (i % 5),
      7 + (i % 5),
      14,
      30 + (i % 4)
    );
  END LOOP;

END $$;
