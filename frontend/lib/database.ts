import { neon } from "@neondatabase/serverless"

// NOTE: Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL!)

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
}

export interface Course {
  id: number
  name: string
  par: number
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
      SELECT * FROM courses 
      ORDER BY name ASC
    `
    console.log(`Found ${courses.length} courses`)
    return courses as Course[]
  } catch (error) {
    console.error("Error fetching courses:", error)
    throw new Error("Failed to fetch courses")
  }
}

// NEW: Add a new course
export async function addCourse(courseData: { name: string; par: number }): Promise<Course> {
  try {
    console.log("Adding course to database:", courseData)
    const result = await sql`
      INSERT INTO courses (name, par)
      VALUES (${courseData.name}, ${courseData.par})
      RETURNING *
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
      RETURNING *
    `
    console.log("Course deleted successfully")
    return result[0] as Course
  } catch (error) {
    console.error("Error deleting course:", error)
    throw new Error("Failed to delete course")
  }
}
