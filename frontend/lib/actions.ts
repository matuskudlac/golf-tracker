"use server"

import { revalidatePath } from "next/cache"
import { golfData } from "./golf-data"

// NOTE: Interface for new round data
interface NewRoundData {
  date: string
  scoringAverage: number
  fairwaysHit: number
  greensInRegulation: number
  upAndDownPercentage: number
  puttsPerRound: number
  strokesGained: number
}

// NOTE: Server action to add a new golf round
export async function addGolfRound(roundData: NewRoundData) {
  try {
    // NOTE: Add the new round to the beginning of the rounds array (most recent first)
    golfData.rounds.unshift(roundData)

    // NOTE: Recalculate current averages based on last 10 rounds
    const recentRounds = golfData.rounds.slice(0, 10)
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

    const newCurrent = {
      scoringAverage: Math.round(avg(recentRounds.map((r) => r.scoringAverage)) * 10) / 10,
      fairwaysHit: Math.round(avg(recentRounds.map((r) => r.fairwaysHit)) * 10) / 10,
      greensInRegulation: Math.round(avg(recentRounds.map((r) => r.greensInRegulation)) * 10) / 10,
      upAndDownPercentage: Math.round(avg(recentRounds.map((r) => r.upAndDownPercentage)) * 10) / 10,
      puttsPerRound: Math.round(avg(recentRounds.map((r) => r.puttsPerRound)) * 10) / 10,
      strokesGained: Math.round(avg(recentRounds.map((r) => r.strokesGained)) * 10) / 10,
    }

    // NOTE: Calculate changes compared to previous 10 rounds (rounds 10-20)
    const previousRounds = golfData.rounds.slice(10, 20)
    if (previousRounds.length > 0) {
      const previousCurrent = {
        scoringAverage: avg(previousRounds.map((r) => r.scoringAverage)),
        fairwaysHit: avg(previousRounds.map((r) => r.fairwaysHit)),
        greensInRegulation: avg(previousRounds.map((r) => r.greensInRegulation)),
        upAndDownPercentage: avg(previousRounds.map((r) => r.upAndDownPercentage)),
        puttsPerRound: avg(previousRounds.map((r) => r.puttsPerRound)),
        strokesGained: avg(previousRounds.map((r) => r.strokesGained)),
      }

      golfData.changes = {
        scoringAverage: Math.round((newCurrent.scoringAverage - previousCurrent.scoringAverage) * 10) / 10,
        fairwaysHit: Math.round((newCurrent.fairwaysHit - previousCurrent.fairwaysHit) * 10) / 10,
        greensInRegulation: Math.round((newCurrent.greensInRegulation - previousCurrent.greensInRegulation) * 10) / 10,
        upAndDownPercentage:
          Math.round((newCurrent.upAndDownPercentage - previousCurrent.upAndDownPercentage) * 10) / 10,
        puttsPerRound: Math.round((newCurrent.puttsPerRound - previousCurrent.puttsPerRound) * 10) / 10,
        strokesGained: Math.round((newCurrent.strokesGained - previousCurrent.strokesGained) * 10) / 10,
      }
    }

    // NOTE: Update current stats
    golfData.current = newCurrent

    // NOTE: Revalidate the dashboard page to show updated data
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error adding golf round:", error)
    throw new Error("Failed to add golf round")
  }
}
