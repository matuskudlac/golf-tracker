"use server"

import { revalidatePath } from "next/cache"
import {
  addRound,
  deleteRound,
  addCourse,
  deleteCourse,
  getCourses,
  addScorecard,
  getScorecard,
  updateScorecard,
} from "@/lib/database"

// NOTE: Server action to add a new golf round to database
export async function addGolfRoundToDB(formData: FormData) {
  try {
    console.log("Server action: Starting to add round...")

    const courseId = formData.get("courseId") ? Number(formData.get("courseId")) : null

    const roundData = {
      date: formData.get("date") as string,
      courseId: courseId,
      scoringAverage: Number.parseFloat(formData.get("scoringAverage") as string),
      fairwaysHit: Number.parseFloat(formData.get("fairwaysHit") as string),
      greensInRegulation: Number.parseFloat(formData.get("greensInRegulation") as string),
      upAndDownPercentage: Number.parseFloat(formData.get("upAndDownPercentage") as string),
      puttsPerRound: Number.parseFloat(formData.get("puttsPerRound") as string),
      strokesGained: Number.parseFloat(formData.get("strokesGained") as string),
    }

    console.log("Server action: Round data prepared:", roundData)

    // Validate the data
    if (!roundData.date || isNaN(roundData.scoringAverage) || isNaN(roundData.fairwaysHit)) {
      console.error("Server action: Invalid data provided")
      return { success: false, error: "Invalid data provided" }
    }

    const result = await addRound(roundData)
    console.log("Server action: Round added successfully:", result)

    // NOTE: Revalidate pages to show updated data
    revalidatePath("/")
    revalidatePath("/add-round")

    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error adding round to database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add round",
    }
  }
}

// NOTE: Server action to delete a golf round from database
export async function deleteGolfRoundFromDB(roundId: number) {
  try {
    console.log("Server action: Starting to delete round:", roundId)

    const result = await deleteRound(roundId)
    console.log("Server action: Round deleted successfully:", result)

    // NOTE: Revalidate pages to show updated data
    revalidatePath("/")

    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error deleting round from database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete round",
    }
  }
}

// NEW: Server action to add a new course with rating and slope
export async function addCourseToDB(formData: FormData) {
  try {
    console.log("Server action: Starting to add course...")

    const courseData = {
      name: formData.get("name") as string,
      par: Number.parseInt(formData.get("par") as string),
      course_rating: Number.parseFloat(formData.get("course_rating") as string),
      slope_rating: Number.parseInt(formData.get("slope_rating") as string),
    }

    console.log("Server action: Course data prepared:", courseData)

    // Validate the data
    if (
      !courseData.name ||
      isNaN(courseData.par) ||
      isNaN(courseData.course_rating) ||
      isNaN(courseData.slope_rating)
    ) {
      console.error("Server action: Invalid course data provided")
      return { success: false, error: "Invalid course data provided" }
    }

    const result = await addCourse(courseData)
    console.log("Server action: Course added successfully:", result)

    // NOTE: Revalidate pages to show updated data
    revalidatePath("/courses")

    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error adding course to database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add course",
    }
  }
}

// NEW: Server action to delete a course
export async function deleteCourseFromDB(courseId: number) {
  try {
    console.log("Server action: Starting to delete course:", courseId)

    const result = await deleteCourse(courseId)
    console.log("Server action: Course deleted successfully:", result)

    // NOTE: Revalidate pages to show updated data
    revalidatePath("/courses")

    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error deleting course from database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete course",
    }
  }
}

// NEW: Server action to get all courses
export async function getCoursesAction() {
  try {
    console.log("Server action: Starting to get courses...")

    const result = await getCourses()
    console.log("Server action: Courses fetched successfully:", result.length)

    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error getting courses from database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get courses",
    }
  }
}

// NEW: Server action to get scorecard for a course
export async function getScorecardAction(courseId: number) {
  try {
    console.log("Server action: Starting to get scorecard for course:", courseId)

    const result = await getScorecard(courseId)
    console.log("Server action: Scorecard fetched successfully:", result ? "Found" : "Not found")

    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error getting scorecard from database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get scorecard",
    }
  }
}

// NEW: Server action to add scorecard
export async function addScorecardToDB(formData: FormData) {
  try {
    console.log("Server action: Starting to add scorecard...")

    const courseId = Number.parseInt(formData.get("courseId") as string)
    const holes = []

    // Extract hole data from form
    for (let i = 1; i <= 18; i++) {
      const par = Number.parseInt(formData.get(`hole_${i}_par`) as string)
      const handicap = Number.parseInt(formData.get(`hole_${i}_handicap`) as string)

      if (!isNaN(par) && !isNaN(handicap)) {
        holes.push({
          hole_number: i,
          par: par,
          handicap: handicap,
        })
      }
    }

    if (holes.length !== 18) {
      return { success: false, error: "All 18 holes must be filled out" }
    }

    const scorecardData = {
      course_id: courseId,
      holes: holes,
    }

    console.log("Server action: Scorecard data prepared:", scorecardData)

    const result = await addScorecard(scorecardData)
    console.log("Server action: Scorecard added successfully:", result)

    // NOTE: Revalidate pages to show updated data
    revalidatePath("/courses")

    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error adding scorecard to database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add scorecard",
    }
  }
}

// NEW: Server action to update scorecard
export async function updateScorecardToDB(formData: FormData) {
  try {
    console.log("Server action: Starting to update scorecard...")

    const courseId = Number.parseInt(formData.get("courseId") as string)
    const holes = []

    // Extract hole data from form
    for (let i = 1; i <= 18; i++) {
      const par = Number.parseInt(formData.get(`hole_${i}_par`) as string)
      const handicap = Number.parseInt(formData.get(`hole_${i}_handicap`) as string)

      if (!isNaN(par) && !isNaN(handicap)) {
        holes.push({
          hole_number: i,
          par: par,
          handicap: handicap,
        })
      }
    }

    if (holes.length !== 18) {
      return { success: false, error: "All 18 holes must be filled out" }
    }

    const scorecardData = {
      course_id: courseId,
      holes: holes,
    }

    console.log("Server action: Scorecard data prepared:", scorecardData)

    const result = await updateScorecard(scorecardData)
    console.log("Server action: Scorecard updated successfully:", result)

    // NOTE: Revalidate pages to show updated data
    revalidatePath("/courses")

    return { success: true, data: result }
  } catch (error) {
    console.error("Server action: Error updating scorecard to database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update scorecard",
    }
  }
}
