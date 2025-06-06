"use server"

import { revalidatePath } from "next/cache"
import { addRound, deleteRound, addCourse, deleteCourse, getCourses } from "@/lib/database"

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

// NEW: Server action to add a new course
export async function addCourseToDB(formData: FormData) {
  try {
    console.log("Server action: Starting to add course...")

    const courseData = {
      name: formData.get("name") as string,
      par: Number.parseInt(formData.get("par") as string),
    }

    console.log("Server action: Course data prepared:", courseData)

    // Validate the data
    if (!courseData.name || isNaN(courseData.par)) {
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
