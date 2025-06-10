"use server"

import { revalidatePath } from "next/cache"
import { addPracticeDrillToDB, deletePracticeDrillFromDB, addPracticeSessionToDB } from "@/lib/practice-database"

// Server action to add a new practice drill
export async function addPracticeDrillAction(formData: FormData) {
  try {
    console.log("Server action: Starting to add practice drill...")

    const drillData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      scoreType: formData.get("scoreType") as "individual" | "final",
      targetShots: Number.parseInt(formData.get("targetShots") as string),
    }

    console.log("Server action: Drill data prepared:", drillData)

    // Validate the data
    if (!drillData.name || !drillData.description || isNaN(drillData.targetShots)) {
      console.error("Server action: Invalid drill data provided")
      return { success: false, error: "Invalid drill data provided" }
    }

    const result = await addPracticeDrillToDB(drillData)
    console.log("Server action: Practice drill added successfully:", result)

    revalidatePath("/practice")
    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error adding practice drill:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add practice drill",
    }
  }
}

// Server action to delete a practice drill
export async function deletePracticeDrillAction(drillId: number) {
  try {
    console.log("Server action: Starting to delete practice drill:", drillId)

    const result = await deletePracticeDrillFromDB(drillId)
    console.log("Server action: Practice drill deleted successfully")

    revalidatePath("/practice")
    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error deleting practice drill:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete practice drill",
    }
  }
}

// Server action to add a new practice session
export async function addPracticeSessionAction(formData: FormData) {
  try {
    console.log("Server action: Starting to add practice session...")

    const drillId = Number.parseInt(formData.get("drillId") as string)
    const date = formData.get("date") as string
    const notes = formData.get("notes") as string
    const scoreType = formData.get("scoreType") as string

    const sessionData: any = {
      drillId,
      date,
      notes: notes || undefined,
    }

    if (scoreType === "individual") {
      // Parse individual scores from form data
      const scoresData = formData.get("scores") as string
      if (scoresData) {
        const scores = JSON.parse(scoresData) as number[]
        sessionData.scores = scores
      }
    } else {
      // Parse final score
      const finalScore = Number.parseFloat(formData.get("finalScore") as string)
      if (!isNaN(finalScore)) {
        sessionData.finalScore = finalScore
      }
    }

    console.log("Server action: Session data prepared:", sessionData)

    const result = await addPracticeSessionToDB(sessionData)
    console.log("Server action: Practice session added successfully:", result)

    revalidatePath("/practice")
    revalidatePath(`/practice/${drillId}`)
    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error adding practice session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add practice session",
    }
  }
}
