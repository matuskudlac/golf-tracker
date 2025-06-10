import { neon } from "@neondatabase/serverless"

// NOTE: Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL!)

export interface DatabasePracticeDrill {
  id: number
  user_id: string
  name: string
  description: string
  score_type: "individual" | "final"
  target_shots: number
  created_at: string
  updated_at: string
}

export interface DatabasePracticeSession {
  id: number
  drill_id: number
  user_id: string
  session_date: string
  scores: number[] | null
  final_score: number | null
  notes: string | null
  created_at: string
}

// Get all practice drills for a user
export async function getPracticeDrillsFromDB(userId = "default_user"): Promise<DatabasePracticeDrill[]> {
  try {
    console.log("Fetching practice drills from database...")
    const drills = await sql`
      SELECT * FROM practice_drills 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `
    console.log(`Found ${drills.length} practice drills`)
    return drills as DatabasePracticeDrill[]
  } catch (error) {
    console.error("Error fetching practice drills:", error)
    throw new Error("Failed to fetch practice drills")
  }
}

// Get a single practice drill by ID
export async function getPracticeDrillFromDB(
  drillId: number,
  userId = "default_user",
): Promise<DatabasePracticeDrill | null> {
  try {
    console.log("Fetching practice drill:", drillId)
    const result = await sql`
      SELECT * FROM practice_drills 
      WHERE id = ${drillId} AND user_id = ${userId}
    `
    return result.length > 0 ? (result[0] as DatabasePracticeDrill) : null
  } catch (error) {
    console.error("Error fetching practice drill:", error)
    throw new Error("Failed to fetch practice drill")
  }
}

// Add a new practice drill
export async function addPracticeDrillToDB(
  drillData: {
    name: string
    description: string
    scoreType: "individual" | "final"
    targetShots: number
  },
  userId = "default_user",
): Promise<DatabasePracticeDrill> {
  try {
    console.log("Adding practice drill to database:", drillData)
    const result = await sql`
      INSERT INTO practice_drills (user_id, name, description, score_type, target_shots)
      VALUES (${userId}, ${drillData.name}, ${drillData.description}, ${drillData.scoreType}, ${drillData.targetShots})
      RETURNING *
    `
    console.log("Practice drill added successfully")
    return result[0] as DatabasePracticeDrill
  } catch (error) {
    console.error("Error adding practice drill:", error)
    throw new Error("Failed to add practice drill")
  }
}

// Delete a practice drill (and all associated sessions)
export async function deletePracticeDrillFromDB(drillId: number, userId = "default_user"): Promise<boolean> {
  try {
    console.log("Deleting practice drill:", drillId)
    const result = await sql`
      DELETE FROM practice_drills 
      WHERE id = ${drillId} AND user_id = ${userId}
      RETURNING *
    `
    console.log("Practice drill deleted successfully")
    return result.length > 0
  } catch (error) {
    console.error("Error deleting practice drill:", error)
    throw new Error("Failed to delete practice drill")
  }
}

// Get practice sessions for a drill
export async function getPracticeSessionsFromDB(
  drillId: number,
  userId = "default_user",
): Promise<DatabasePracticeSession[]> {
  try {
    console.log("Fetching practice sessions for drill:", drillId)
    const sessions = await sql`
      SELECT * FROM practice_sessions 
      WHERE drill_id = ${drillId} AND user_id = ${userId}
      ORDER BY session_date DESC
    `
    console.log(`Found ${sessions.length} practice sessions`)
    return sessions as DatabasePracticeSession[]
  } catch (error) {
    console.error("Error fetching practice sessions:", error)
    throw new Error("Failed to fetch practice sessions")
  }
}

// Add a new practice session
export async function addPracticeSessionToDB(
  sessionData: {
    drillId: number
    date: string
    scores?: number[]
    finalScore?: number
    notes?: string
  },
  userId = "default_user",
): Promise<DatabasePracticeSession> {
  try {
    console.log("Adding practice session to database:", sessionData)

    // Debug the input data
    console.log("Session data details:", {
      drillId: sessionData.drillId,
      date: sessionData.date,
      scores: sessionData.scores,
      finalScore: sessionData.finalScore,
      notes: sessionData.notes,
    })

    // Validate the drill exists
    const drillCheck = await sql`
      SELECT id, score_type FROM practice_drills 
      WHERE id = ${sessionData.drillId} AND user_id = ${userId}
    `

    if (drillCheck.length === 0) {
      throw new Error(`Drill with ID ${sessionData.drillId} not found`)
    }

    const drill = drillCheck[0]
    console.log("Found drill:", drill)

    // Ensure we have the right type of score data
    if (drill.score_type === "individual" && (!sessionData.scores || !Array.isArray(sessionData.scores))) {
      throw new Error("Individual scores are required for this drill type")
    }

    if (drill.score_type === "final" && sessionData.finalScore === undefined) {
      throw new Error("Final score is required for this drill type")
    }

    // Insert the session with the appropriate score data
    let result
    if (drill.score_type === "individual") {
      result = await sql`
        INSERT INTO practice_sessions (
          drill_id, user_id, session_date, scores, final_score, notes
        ) VALUES (
          ${sessionData.drillId}, 
          ${userId}, 
          ${sessionData.date}, 
          ${sessionData.scores || null}::decimal[], 
          null, 
          ${sessionData.notes || null}
        )
        RETURNING *
      `
    } else {
      result = await sql`
        INSERT INTO practice_sessions (
          drill_id, user_id, session_date, scores, final_score, notes
        ) VALUES (
          ${sessionData.drillId}, 
          ${userId}, 
          ${sessionData.date}, 
          null, 
          ${sessionData.finalScore || null}, 
          ${sessionData.notes || null}
        )
        RETURNING *
      `
    }

    console.log("Practice session added successfully:", result[0])
    return result[0] as DatabasePracticeSession
  } catch (error) {
    console.error("Error adding practice session:", error)
    throw new Error(`Failed to add practice session: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Delete a practice session
export async function deletePracticeSessionFromDB(sessionId: number, userId = "default_user"): Promise<boolean> {
  try {
    console.log("Deleting practice session:", sessionId)
    const result = await sql`
      DELETE FROM practice_sessions 
      WHERE id = ${sessionId} AND user_id = ${userId}
      RETURNING *
    `
    console.log("Practice session deleted successfully")
    return result.length > 0
  } catch (error) {
    console.error("Error deleting practice session:", error)
    throw new Error("Failed to delete practice session")
  }
}
