import { neon } from "@neondatabase/serverless"

// NOTE: Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL!)

// Export sql for use in actions
export { sql }

export interface DatabaseGolfRound {
  id: number
  user_id: string
  date: string
  course_id: number | null
  scoring_average: number
  adjusted_scoring_average: number | null
  fairways_hit: number
  greens_in_regulation: number
  up_and_down_percentage: number
  putts_per_round: number
  strokes_gained: number
  created_at: string
  updated_at: string
  course_name?: string
  course_par?: number
}

export interface Course {
  id: number
  name: string
  par: number
  course_rating: number
  slope_rating: number
  created_at: string
  updated_at: string
}

export interface Scorecard {
  id: number
  course_id: number
  holes: {
    hole_number: number
    par: number
    handicap: number
  }[]
  created_at: string
  updated_at: string
}

export interface RoundScore {
  id: number
  round_id: number
  holes: {
    hole_number: number
    par: number
    score: number
  }[]
  created_at: string
  updated_at: string
}

// NOTE: Get all rounds for a user (default user for now)
export async function getRounds(userId = "default_user"): Promise<DatabaseGolfRound[]> {
  try {
    console.log("Fetching rounds from database...")
    const rounds = await sql`
      SELECT r.*, c.name as course_name, c.par as course_par
      FROM golf_rounds r
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE r.user_id = ${userId} 
      ORDER BY r.date DESC
    `
    console.log(`Found ${rounds.length} rounds`)
    return rounds as DatabaseGolfRound[]
  } catch (error) {
    console.error("Error fetching rounds:", error)
    throw new Error("Failed to fetch rounds")
  }
}

// NOTE: Add a new round to the database
export async function addRound(
  roundData: {
    date: string
    courseId: number | null
    scoringAverage: number
    fairwaysHit: number
    greensInRegulation: number
    upAndDownPercentage: number
    puttsPerRound: number
    strokesGained: number
  },
  userId = "default_user",
) {
  try {
    console.log("Adding round to database:", roundData)

    // Calculate adjusted scoring average if course is selected
    let adjustedScoringAverage = null

    if (roundData.courseId) {
      // Get course par
      const courseResult = await sql`
        SELECT par FROM courses WHERE id = ${roundData.courseId}
      `

      if (courseResult.length > 0) {
        const coursePar = Number(courseResult[0].par)
        // Calculate strokes over/under par
        const strokesRelativeToPar = roundData.scoringAverage - coursePar
        // Adjust to par 72
        adjustedScoringAverage = 72 + strokesRelativeToPar
      }
    }

    const result = await sql`
      INSERT INTO golf_rounds (
        user_id, date, course_id, scoring_average, adjusted_scoring_average,
        fairways_hit, greens_in_regulation, up_and_down_percentage, 
        putts_per_round, strokes_gained
      ) VALUES (
        ${userId}, ${roundData.date}, ${roundData.courseId}, ${roundData.scoringAverage}, 
        ${adjustedScoringAverage}, ${roundData.fairwaysHit}, ${roundData.greensInRegulation}, 
        ${roundData.upAndDownPercentage}, ${roundData.puttsPerRound}, ${roundData.strokesGained}
      )
      RETURNING *
    `
    console.log("Round added successfully")
    return result[0] as DatabaseGolfRound
  } catch (error) {
    console.error("Error adding round:", error)
    throw new Error("Failed to add round")
  }
}

// NOTE: Delete a round by ID
export async function deleteRound(roundId: number, userId = "default_user") {
  try {
    console.log("Deleting round:", roundId)
    const result = await sql`
      DELETE FROM golf_rounds 
      WHERE id = ${roundId} AND user_id = ${userId}
      RETURNING *
    `
    console.log("Round deleted successfully")
    return result[0] as DatabaseGolfRound
  } catch (error) {
    console.error("Error deleting round:", error)
    throw new Error("Failed to delete round")
  }
}

// NOTE: Calculate current statistics from database
export async function calculateStats(userId = "default_user") {
  try {
    console.log("Calculating stats from database...")

    // Get last 10 rounds for current stats
    const recentRounds = await sql`
      SELECT * FROM golf_rounds 
      WHERE user_id = ${userId} 
      ORDER BY date DESC 
      LIMIT 10
    `

    // Get previous 10 rounds for comparison
    const previousRounds = await sql`
      SELECT * FROM golf_rounds 
      WHERE user_id = ${userId} 
      ORDER BY date DESC 
      LIMIT 10 OFFSET 10
    `

    console.log(`Recent rounds: ${recentRounds.length}, Previous rounds: ${previousRounds.length}`)

    if (recentRounds.length === 0) {
      return {
        current: {
          scoringAverage: 0,
          fairwaysHit: 0,
          greensInRegulation: 0,
          upAndDownPercentage: 0,
          puttsPerRound: 0,
          strokesGained: 0,
        },
        changes: {
          scoringAverage: 0,
          fairwaysHit: 0,
          greensInRegulation: 0,
          upAndDownPercentage: 0,
          puttsPerRound: 0,
          strokesGained: 0,
        },
      }
    }

    // Calculate averages for recent rounds
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

    const current = {
      scoringAverage: Math.round(avg(recentRounds.map((r) => Number(r.scoring_average))) * 10) / 10,
      fairwaysHit: Math.round(avg(recentRounds.map((r) => Number(r.fairways_hit))) * 10) / 10,
      greensInRegulation: Math.round(avg(recentRounds.map((r) => Number(r.greens_in_regulation))) * 10) / 10,
      upAndDownPercentage: Math.round(avg(recentRounds.map((r) => Number(r.up_and_down_percentage))) * 10) / 10,
      puttsPerRound: Math.round(avg(recentRounds.map((r) => Number(r.putts_per_round))) * 10) / 10,
      strokesGained: Math.round(avg(recentRounds.map((r) => Number(r.strokes_gained))) * 10) / 10,
    }

    // Calculate changes if we have previous rounds
    let changes = {
      scoringAverage: 0,
      fairwaysHit: 0,
      greensInRegulation: 0,
      upAndDownPercentage: 0,
      puttsPerRound: 0,
      strokesGained: 0,
    }

    if (previousRounds.length > 0) {
      const previous = {
        scoringAverage: avg(previousRounds.map((r) => Number(r.scoring_average))),
        fairwaysHit: avg(previousRounds.map((r) => Number(r.fairways_hit))),
        greensInRegulation: avg(previousRounds.map((r) => Number(r.greens_in_regulation))),
        upAndDownPercentage: avg(previousRounds.map((r) => Number(r.up_and_down_percentage))),
        puttsPerRound: avg(previousRounds.map((r) => Number(r.putts_per_round))),
        strokesGained: avg(previousRounds.map((r) => Number(r.strokes_gained))),
      }

      changes = {
        scoringAverage: Math.round((current.scoringAverage - previous.scoringAverage) * 10) / 10,
        fairwaysHit: Math.round((current.fairwaysHit - previous.fairwaysHit) * 10) / 10,
        greensInRegulation: Math.round((current.greensInRegulation - previous.greensInRegulation) * 10) / 10,
        upAndDownPercentage: Math.round((current.upAndDownPercentage - previous.upAndDownPercentage) * 10) / 10,
        puttsPerRound: Math.round((current.puttsPerRound - previous.puttsPerRound) * 10) / 10,
        strokesGained: Math.round((current.strokesGained - previous.strokesGained) * 10) / 10,
      }
    }

    console.log("Stats calculated successfully")
    return { current, changes }
  } catch (error) {
    console.error("Error calculating stats:", error)
    throw new Error("Failed to calculate statistics")
  }
}

// NEW: Get all courses
export async function getCourses(): Promise<Course[]> {
  try {
    console.log("Fetching courses from database...")
    const courses = await sql`
      SELECT id, name, par, 
             COALESCE(course_rating, 0) as course_rating, 
             COALESCE(slope_rating, 113) as slope_rating, 
             created_at, updated_at
      FROM courses 
      ORDER BY name ASC
    `
    console.log(`Found ${courses.length} courses`)
    return courses as Course[]
  } catch (error) {
    console.error("Error fetching courses:", error)
    throw new Error("Failed to fetch courses")
  }
}

// NEW: Add a new course with rating and slope
export async function addCourse(courseData: {
  name: string
  par: number
  course_rating: number
  slope_rating: number
}): Promise<Course> {
  try {
    console.log("Adding course to database:", courseData)

    // First, ensure the columns exist
    await sql`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS course_rating DECIMAL(4,1),
      ADD COLUMN IF NOT EXISTS slope_rating INTEGER
    `

    const result = await sql`
      INSERT INTO courses (name, par, course_rating, slope_rating)
      VALUES (${courseData.name}, ${courseData.par}, ${courseData.course_rating}, ${courseData.slope_rating})
      RETURNING id, name, par, course_rating, slope_rating, created_at, updated_at
    `
    console.log("Course added successfully")
    return result[0] as Course
  } catch (error) {
    console.error("Error adding course:", error)
    throw new Error("Failed to add course")
  }
}

// NEW: Delete a course
export async function deleteCourse(courseId: number): Promise<Course> {
  try {
    console.log("Deleting course:", courseId)
    const result = await sql`
      DELETE FROM courses 
      WHERE id = ${courseId}
      RETURNING id, name, par, course_rating, slope_rating, created_at, updated_at
    `
    console.log("Course deleted successfully")
    return result[0] as Course
  } catch (error) {
    console.error("Error deleting course:", error)
    throw new Error("Failed to delete course")
  }
}

// NEW: Add scorecard for a course
export async function addScorecard(scorecardData: {
  course_id: number
  holes: { hole_number: number; par: number; handicap: number }[]
}): Promise<Scorecard> {
  try {
    console.log("Adding scorecard to database:", scorecardData)

    // First, ensure the tables exist
    await sql`
      CREATE TABLE IF NOT EXISTS scorecards (
          id SERIAL PRIMARY KEY,
          course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS scorecard_holes (
          id SERIAL PRIMARY KEY,
          scorecard_id INTEGER NOT NULL REFERENCES scorecards(id) ON DELETE CASCADE,
          hole_number INTEGER NOT NULL CHECK (hole_number >= 1 AND hole_number <= 18),
          par INTEGER NOT NULL CHECK (par >= 3 AND par <= 6),
          handicap INTEGER NOT NULL CHECK (handicap >= 1 AND handicap <= 18),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(scorecard_id, hole_number)
      )
    `

    // Insert the scorecard
    const scorecardResult = await sql`
      INSERT INTO scorecards (course_id)
      VALUES (${scorecardData.course_id})
      RETURNING id, course_id, created_at, updated_at
    `

    const scorecardId = scorecardResult[0].id

    // Insert all holes
    for (const hole of scorecardData.holes) {
      await sql`
        INSERT INTO scorecard_holes (scorecard_id, hole_number, par, handicap)
        VALUES (${scorecardId}, ${hole.hole_number}, ${hole.par}, ${hole.handicap})
      `
    }

    console.log("Scorecard added successfully")
    return {
      id: scorecardId,
      course_id: scorecardData.course_id,
      holes: scorecardData.holes,
      created_at: scorecardResult[0].created_at,
      updated_at: scorecardResult[0].updated_at,
    }
  } catch (error) {
    console.error("Error adding scorecard:", error)
    throw new Error(`Failed to add scorecard: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// NEW: Get scorecard for a course
export async function getScorecard(courseId: number): Promise<Scorecard | null> {
  try {
    console.log("Fetching scorecard for course:", courseId)

    const scorecardResult = await sql`
      SELECT * FROM scorecards WHERE course_id = ${courseId}
    `

    if (scorecardResult.length === 0) {
      return null
    }

    const scorecard = scorecardResult[0]

    const holesResult = await sql`
      SELECT * FROM scorecard_holes 
      WHERE scorecard_id = ${scorecard.id}
      ORDER BY hole_number ASC
    `

    return {
      id: scorecard.id,
      course_id: scorecard.course_id,
      holes: holesResult.map((hole) => ({
        hole_number: hole.hole_number,
        par: hole.par,
        handicap: hole.handicap,
      })),
      created_at: scorecard.created_at,
      updated_at: scorecard.updated_at,
    }
  } catch (error) {
    console.error("Error fetching scorecard:", error)
    throw new Error("Failed to fetch scorecard")
  }
}

// NEW: Update scorecard for a course
export async function updateScorecard(scorecardData: {
  course_id: number
  holes: { hole_number: number; par: number; handicap: number }[]
}): Promise<Scorecard> {
  try {
    console.log("Updating scorecard in database:", scorecardData)

    // Get existing scorecard
    const existingScorecard = await getScorecard(scorecardData.course_id)
    if (!existingScorecard) {
      throw new Error("Scorecard not found")
    }

    // Delete existing holes
    await sql`DELETE FROM scorecard_holes WHERE scorecard_id = ${existingScorecard.id}`

    // Insert new holes
    for (const hole of scorecardData.holes) {
      await sql`
        INSERT INTO scorecard_holes (scorecard_id, hole_number, par, handicap)
        VALUES (${existingScorecard.id}, ${hole.hole_number}, ${hole.par}, ${hole.handicap})
      `
    }

    // Update the scorecard timestamp
    await sql`
      UPDATE scorecards 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${existingScorecard.id}
    `

    console.log("Scorecard updated successfully")
    return {
      id: existingScorecard.id,
      course_id: scorecardData.course_id,
      holes: scorecardData.holes,
      created_at: existingScorecard.created_at,
      updated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error updating scorecard:", error)
    throw new Error(`Failed to update scorecard: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// NEW: Add round scores for a user's round
export async function addRoundScores(roundScoreData: {
  round_id: number
  holes: { hole_number: number; par: number; score: number }[]
}): Promise<RoundScore> {
  try {
    console.log("Adding round scores to database:", roundScoreData)

    // First, ensure the table exists
    await sql`
      CREATE TABLE IF NOT EXISTS round_scores (
          id SERIAL PRIMARY KEY,
          round_id INTEGER NOT NULL REFERENCES golf_rounds(id) ON DELETE CASCADE,
          hole_number INTEGER NOT NULL CHECK (hole_number >= 1 AND hole_number <= 18),
          par INTEGER NOT NULL CHECK (par >= 3 AND par <= 6),
          score INTEGER NOT NULL CHECK (score >= 1 AND score <= 15),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(round_id, hole_number)
      )
    `

    // Insert all hole scores
    for (const hole of roundScoreData.holes) {
      await sql`
        INSERT INTO round_scores (round_id, hole_number, par, score)
        VALUES (${roundScoreData.round_id}, ${hole.hole_number}, ${hole.par}, ${hole.score})
        ON CONFLICT (round_id, hole_number) 
        DO UPDATE SET 
          par = EXCLUDED.par,
          score = EXCLUDED.score,
          updated_at = CURRENT_TIMESTAMP
      `
    }

    console.log("Round scores added successfully")
    return {
      id: 0, // We don't have a single ID for this collection
      round_id: roundScoreData.round_id,
      holes: roundScoreData.holes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error adding round scores:", error)
    throw new Error(`Failed to add round scores: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// NEW: Get round scores for a specific round
export async function getRoundScores(roundId: number): Promise<RoundScore | null> {
  try {
    console.log("Fetching round scores for round:", roundId)

    const scoresResult = await sql`
      SELECT * FROM round_scores 
      WHERE round_id = ${roundId}
      ORDER BY hole_number ASC
    `

    if (scoresResult.length === 0) {
      return null
    }

    return {
      id: 0, // Collection doesn't have single ID
      round_id: roundId,
      holes: scoresResult.map((score) => ({
        hole_number: score.hole_number,
        par: score.par,
        score: score.score,
      })),
      created_at: scoresResult[0].created_at,
      updated_at: scoresResult[0].updated_at,
    }
  } catch (error) {
    console.error("Error fetching round scores:", error)
    throw new Error("Failed to fetch round scores")
  }
}

// NEW: Calculate handicap for a round based on scores
export async function calculateRoundHandicap(roundId: number): Promise<number | null> {
  try {
    console.log("Calculating handicap for round:", roundId)

    // Get round and course information
    const roundResult = await sql`
      SELECT r.*, c.course_rating, c.slope_rating
      FROM golf_rounds r
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE r.id = ${roundId}
    `

    if (roundResult.length === 0) {
      throw new Error("Round not found")
    }

    const round = roundResult[0]

    // Get round scores
    const roundScores = await getRoundScores(roundId)
    if (!roundScores) {
      return null // No scores available
    }

    // Calculate total score
    const totalScore = roundScores.holes.reduce((sum, hole) => sum + hole.score, 0)
    const totalPar = roundScores.holes.reduce((sum, hole) => sum + hole.par, 0)

    // If we have course rating and slope, calculate proper handicap differential
    if (round.course_rating && round.slope_rating) {
      const courseRating = Number(round.course_rating)
      const slopeRating = Number(round.slope_rating)

      // Handicap Differential = (Score - Course Rating) × 113 / Slope Rating
      const handicapDifferential = ((totalScore - courseRating) * 113) / slopeRating
      return Math.round(handicapDifferential * 10) / 10 // Round to 1 decimal place
    } else {
      // Fallback: simple calculation based on par
      const strokesOverPar = totalScore - totalPar
      return strokesOverPar
    }
  } catch (error) {
    console.error("Error calculating round handicap:", error)
    throw new Error("Failed to calculate round handicap")
  }
}
