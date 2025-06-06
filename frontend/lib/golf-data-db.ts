import { getRounds, calculateStats, type DatabaseGolfRound } from "./database"

export interface GolfRound {
  date: string
  scoringAverage: number
  fairwaysHit: number
  greensInRegulation: number
  upAndDownPercentage: number
  puttsPerRound: number
  strokesGained: number
}

export interface GolfStats {
  current: {
    scoringAverage: number
    fairwaysHit: number
    greensInRegulation: number
    upAndDownPercentage: number
    puttsPerRound: number
    strokesGained: number
  }
  changes: {
    scoringAverage: number
    fairwaysHit: number
    greensInRegulation: number
    upAndDownPercentage: number
    puttsPerRound: number
    strokesGained: number
  }
  rounds: GolfRound[]
}

// NOTE: Convert database round to app round format
function convertDatabaseRound(dbRound: DatabaseGolfRound): GolfRound {
  return {
    date: dbRound.date,
    scoringAverage: Number(dbRound.scoring_average),
    fairwaysHit: Number(dbRound.fairways_hit),
    greensInRegulation: Number(dbRound.greens_in_regulation),
    upAndDownPercentage: Number(dbRound.up_and_down_percentage),
    puttsPerRound: Number(dbRound.putts_per_round),
    strokesGained: Number(dbRound.strokes_gained),
  }
}

// NOTE: Get golf data from database
export async function getGolfDataFromDB(): Promise<GolfStats> {
  try {
    console.log("Getting golf data from database...")
    const [dbRounds, stats] = await Promise.all([getRounds(), calculateStats()])

    const rounds = dbRounds.map(convertDatabaseRound)
    console.log(`Converted ${rounds.length} rounds`)

    return {
      current: stats.current,
      changes: stats.changes,
      rounds: rounds,
    }
  } catch (error) {
    console.error("Error fetching golf data from database:", error)
    // Return empty data structure if database fails
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
      rounds: [],
    }
  }
}

// NOTE: Helper function to get data for specific number of rounds
export function getDataForTimeframeFromRounds(rounds: GolfRound[], numRounds: string, statistic: string) {
  const num = Number.parseInt(numRounds)
  const filteredData = rounds.slice(0, num)

  return filteredData
    .map((round) => ({
      date: new Date(round.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      value: Math.round((round as any)[statistic] * 100) / 100,
    }))
    .reverse()
}
