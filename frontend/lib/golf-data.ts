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

// NOTE: Default/initial golf data
const defaultGolfData: GolfStats = {
  current: {
    scoringAverage: 77.2,
    fairwaysHit: 9.1,
    greensInRegulation: 11.3,
    upAndDownPercentage: 64.2,
    puttsPerRound: 31.5,
    strokesGained: -1.8,
  },
  changes: {
    scoringAverage: -0.8,
    fairwaysHit: 0.4,
    greensInRegulation: 0.6,
    upAndDownPercentage: 2.1,
    puttsPerRound: -0.3,
    strokesGained: 0.5,
  },
  rounds: [
    {
      date: "2024-12-03",
      scoringAverage: 76,
      fairwaysHit: 10,
      greensInRegulation: 12,
      upAndDownPercentage: 67,
      puttsPerRound: 30,
      strokesGained: -1.2,
    },
    {
      date: "2024-11-30",
      scoringAverage: 79,
      fairwaysHit: 8,
      greensInRegulation: 10,
      upAndDownPercentage: 62,
      puttsPerRound: 33,
      strokesGained: -2.1,
    },
    {
      date: "2024-11-27",
      scoringAverage: 75,
      fairwaysHit: 11,
      greensInRegulation: 13,
      upAndDownPercentage: 70,
      puttsPerRound: 29,
      strokesGained: -0.8,
    },
    {
      date: "2024-11-24",
      scoringAverage: 78,
      fairwaysHit: 9,
      greensInRegulation: 11,
      upAndDownPercentage: 65,
      puttsPerRound: 32,
      strokesGained: -1.5,
    },
    {
      date: "2024-11-21",
      scoringAverage: 77,
      fairwaysHit: 9,
      greensInRegulation: 12,
      upAndDownPercentage: 63,
      puttsPerRound: 31,
      strokesGained: -1.3,
    },
    {
      date: "2024-11-18",
      scoringAverage: 80,
      fairwaysHit: 7,
      greensInRegulation: 9,
      upAndDownPercentage: 58,
      puttsPerRound: 34,
      strokesGained: -2.8,
    },
    {
      date: "2024-11-15",
      scoringAverage: 76,
      fairwaysHit: 10,
      greensInRegulation: 12,
      upAndDownPercentage: 68,
      puttsPerRound: 30,
      strokesGained: -1.1,
    },
    {
      date: "2024-11-12",
      scoringAverage: 78,
      fairwaysHit: 8,
      greensInRegulation: 10,
      upAndDownPercentage: 61,
      puttsPerRound: 32,
      strokesGained: -1.9,
    },
    {
      date: "2024-11-09",
      scoringAverage: 74,
      fairwaysHit: 12,
      greensInRegulation: 14,
      upAndDownPercentage: 72,
      puttsPerRound: 28,
      strokesGained: -0.3,
    },
    {
      date: "2024-11-06",
      scoringAverage: 79,
      fairwaysHit: 8,
      greensInRegulation: 10,
      upAndDownPercentage: 59,
      puttsPerRound: 33,
      strokesGained: -2.2,
    },
    {
      date: "2024-11-03",
      scoringAverage: 77,
      fairwaysHit: 9,
      greensInRegulation: 11,
      upAndDownPercentage: 64,
      puttsPerRound: 31,
      strokesGained: -1.6,
    },
    {
      date: "2024-10-31",
      scoringAverage: 81,
      fairwaysHit: 6,
      greensInRegulation: 8,
      upAndDownPercentage: 55,
      puttsPerRound: 35,
      strokesGained: -3.1,
    },
    {
      date: "2024-10-28",
      scoringAverage: 75,
      fairwaysHit: 11,
      greensInRegulation: 13,
      upAndDownPercentage: 69,
      puttsPerRound: 29,
      strokesGained: -0.7,
    },
    {
      date: "2024-10-25",
      scoringAverage: 78,
      fairwaysHit: 9,
      greensInRegulation: 11,
      upAndDownPercentage: 62,
      puttsPerRound: 32,
      strokesGained: -1.8,
    },
    {
      date: "2024-10-22",
      scoringAverage: 76,
      fairwaysHit: 10,
      greensInRegulation: 12,
      upAndDownPercentage: 66,
      puttsPerRound: 30,
      strokesGained: -1.2,
    },
    {
      date: "2024-10-19",
      scoringAverage: 80,
      fairwaysHit: 7,
      greensInRegulation: 9,
      upAndDownPercentage: 57,
      puttsPerRound: 34,
      strokesGained: -2.5,
    },
    {
      date: "2024-10-16",
      scoringAverage: 77,
      fairwaysHit: 9,
      greensInRegulation: 11,
      upAndDownPercentage: 63,
      puttsPerRound: 31,
      strokesGained: -1.4,
    },
    {
      date: "2024-10-13",
      scoringAverage: 79,
      fairwaysHit: 8,
      greensInRegulation: 10,
      upAndDownPercentage: 60,
      puttsPerRound: 33,
      strokesGained: -2.0,
    },
    {
      date: "2024-10-10",
      scoringAverage: 74,
      fairwaysHit: 12,
      greensInRegulation: 14,
      upAndDownPercentage: 71,
      puttsPerRound: 28,
      strokesGained: -0.4,
    },
    {
      date: "2024-10-07",
      scoringAverage: 78,
      fairwaysHit: 8,
      greensInRegulation: 10,
      upAndDownPercentage: 61,
      puttsPerRound: 32,
      strokesGained: -1.7,
    },
    {
      date: "2024-10-04",
      scoringAverage: 76,
      fairwaysHit: 10,
      greensInRegulation: 12,
      upAndDownPercentage: 65,
      puttsPerRound: 30,
      strokesGained: -1.1,
    },
    {
      date: "2024-10-01",
      scoringAverage: 82,
      fairwaysHit: 6,
      greensInRegulation: 8,
      upAndDownPercentage: 53,
      puttsPerRound: 36,
      strokesGained: -3.4,
    },
    {
      date: "2024-09-28",
      scoringAverage: 77,
      fairwaysHit: 9,
      greensInRegulation: 11,
      upAndDownPercentage: 64,
      puttsPerRound: 31,
      strokesGained: -1.5,
    },
    {
      date: "2024-09-25",
      scoringAverage: 75,
      fairwaysHit: 11,
      greensInRegulation: 13,
      upAndDownPercentage: 68,
      puttsPerRound: 29,
      strokesGained: -0.8,
    },
    {
      date: "2024-09-22",
      scoringAverage: 79,
      fairwaysHit: 8,
      greensInRegulation: 10,
      upAndDownPercentage: 59,
      puttsPerRound: 33,
      strokesGained: -2.1,
    },
    {
      date: "2024-09-19",
      scoringAverage: 78,
      fairwaysHit: 9,
      greensInRegulation: 11,
      upAndDownPercentage: 62,
      puttsPerRound: 32,
      strokesGained: -1.6,
    },
    {
      date: "2024-09-16",
      scoringAverage: 76,
      fairwaysHit: 10,
      greensInRegulation: 12,
      upAndDownPercentage: 66,
      puttsPerRound: 30,
      strokesGained: -1.0,
    },
    {
      date: "2024-09-13",
      scoringAverage: 80,
      fairwaysHit: 7,
      greensInRegulation: 9,
      upAndDownPercentage: 56,
      puttsPerRound: 34,
      strokesGained: -2.6,
    },
    {
      date: "2024-09-10",
      scoringAverage: 77,
      fairwaysHit: 9,
      greensInRegulation: 11,
      upAndDownPercentage: 63,
      puttsPerRound: 31,
      strokesGained: -1.3,
    },
    {
      date: "2024-09-07",
      scoringAverage: 75,
      fairwaysHit: 11,
      greensInRegulation: 13,
      upAndDownPercentage: 69,
      puttsPerRound: 29,
      strokesGained: -0.6,
    },
  ],
}

// NOTE: Function to get golf data from localStorage or use default
export function getGolfData(): GolfStats {
  if (typeof window === "undefined") {
    // Server-side: return default data
    return defaultGolfData
  }

  // Client-side: try to get from localStorage
  try {
    const stored = localStorage.getItem("golfData")
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading golf data from localStorage:", error)
  }

  return defaultGolfData
}

// NOTE: Function to save golf data to localStorage
export function saveGolfData(data: GolfStats): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("golfData", JSON.stringify(data))
    } catch (error) {
      console.error("Error saving golf data to localStorage:", error)
    }
  }
}

// NOTE: Export the current golf data (will be updated by components)
export const golfData = getGolfData()

// Helper function to get data for specific number of rounds
export function getDataForTimeframe(rounds: string, statistic: string) {
  const numRounds = Number.parseInt(rounds)
  const currentData = getGolfData() // NOTE: Always get fresh data

  // Get the specified number of most recent rounds
  const filteredData = currentData.rounds.slice(0, numRounds)

  return filteredData
    .map((round) => ({
      date: new Date(round.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      value: Math.round((round as any)[statistic] * 100) / 100,
    }))
    .reverse() // Reverse to show oldest to newest on the chart
}
