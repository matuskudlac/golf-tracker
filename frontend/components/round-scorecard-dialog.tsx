"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { getScorecardAction } from "@/app/actions"
import { Upload, X } from "lucide-react"
import type { Course } from "@/lib/database"

interface RoundScorecardDialogProps {
  isOpen: boolean
  onClose: () => void
  course: Course
  onComplete: (scorecardData: Record<number, { par: string; score: string }>) => void
  roundData: {
    date: Date
    courseId: string
  }
  existingData?: Record<number, { par: string; score: string }> | null
}

interface HoleData {
  par: string
  score: string
}

export function RoundScorecardDialog({
  isOpen,
  onClose,
  course,
  onComplete,
  roundData,
  existingData,
}: RoundScorecardDialogProps) {
  const [holes, setHoles] = useState<Record<number, HoleData>>(() => {
    const initialHoles: Record<number, HoleData> = {}
    for (let i = 1; i <= 18; i++) {
      initialHoles[i] = { par: "", score: "" }
    }
    return initialHoles
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showing, setShowing] = useState(false)
  const [isLoadingCourseData, setIsLoadingCourseData] = useState(true)

  // Load course scorecard data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setShowing(true)
      loadCourseScorecard()
    } else {
      setShowing(false)
    }
  }, [isOpen])

  const loadCourseScorecard = async () => {
    try {
      setIsLoadingCourseData(true)

      // If we have existing data, use it
      if (existingData) {
        setHoles(existingData)
        setIsLoadingCourseData(false)
        return
      }

      const result = await getScorecardAction(course.id)

      if (result.success && result.data) {
        // Pre-populate par values from course scorecard
        const loadedHoles: Record<number, HoleData> = {}

        // Initialize all holes
        for (let i = 1; i <= 18; i++) {
          loadedHoles[i] = { par: "", score: "" }
        }

        // Load par values from course scorecard
        result.data.holes.forEach((hole) => {
          loadedHoles[hole.hole_number] = {
            par: hole.par.toString(),
            score: "",
          }
        })

        setHoles(loadedHoles)
      } else {
        // No course scorecard found, user needs to enter par values manually
        toast.info("No course scorecard found. Please enter par values manually.")
      }
    } catch (error) {
      console.error("Error loading course scorecard:", error)
      toast.error("Failed to load course information")
    } finally {
      setIsLoadingCourseData(false)
    }
  }

  const handleHoleChange = (holeNumber: number, field: keyof HoleData, value: string) => {
    // Only allow score changes, not par changes (unless it's a new scorecard)
    if (field === "par" && existingData) {
      return // Don't allow par changes when editing
    }

    // Only allow numeric input and reasonable ranges for scores
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = Number.parseInt(value)

      // Validate score range
      if (value !== "" && (numValue < 1 || numValue > 15)) {
        return // Don't update if score is outside 1-15 range
      }

      setHoles((prev) => ({
        ...prev,
        [holeNumber]: {
          ...prev[holeNumber],
          [field]: value,
        },
      }))
    }
  }

  // Function to get background color based on score relative to par
  const getScoreBackgroundColor = (score: string, par: string) => {
    if (!score || !par) return "bg-transparent"

    const scoreNum = Number.parseInt(score)
    const parNum = Number.parseInt(par)
    const diff = scoreNum - parNum

    if (diff <= -2) return "bg-red-100" // Eagle or better
    if (diff === -1) return "bg-red-50" // Birdie
    if (diff === 0) return "bg-transparent" // Par
    if (diff === 1) return "bg-blue-50" // Bogey
    if (diff === 2) return "bg-blue-100" // Double bogey
    if (diff >= 3) return "bg-blue-200" // Triple bogey or worse

    return "bg-transparent"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate all holes are filled
      for (let i = 1; i <= 18; i++) {
        const hole = holes[i]
        if (!hole.par || !hole.score) {
          toast.error(`Please fill out all fields for hole ${i}`)
          setIsSubmitting(false)
          return
        }
      }

      // Pass the scorecard data back to the parent component
      onComplete(holes)
    } catch (error) {
      console.error("Error processing scorecard:", error)
      toast.error("Failed to process scorecard")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIUpload = () => {
    toast.info("AI scorecard analysis coming soon!")
  }

  // Calculate totals for display
  const frontNinePar = Array.from({ length: 9 }, (_, i) => Number.parseInt(holes[i + 1]?.par || "0")).reduce(
    (a, b) => a + b,
    0,
  )
  const frontNineScore = Array.from({ length: 9 }, (_, i) => Number.parseInt(holes[i + 1]?.score || "0")).reduce(
    (a, b) => a + b,
    0,
  )
  const backNinePar = Array.from({ length: 9 }, (_, i) => Number.parseInt(holes[i + 10]?.par || "0")).reduce(
    (a, b) => a + b,
    0,
  )
  const backNineScore = Array.from({ length: 9 }, (_, i) => Number.parseInt(holes[i + 10]?.score || "0")).reduce(
    (a, b) => a + b,
    0,
  )
  const totalPar = frontNinePar + backNinePar
  const totalScore = frontNineScore + backNineScore

  // Accessibility: close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Ref for modal content to stop propagation
  const modalRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className={`relative bg-white rounded-2xl shadow-2xl w-[95vw] md:w-[90vw] lg:w-[85vw] max-w-6xl max-h-[95vh] h-auto flex flex-col transition-all duration-300 ease-out ${showing ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-gray-400 hover:text-black bg-gray-100 rounded-full p-2 shadow-md transition-all"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Modal Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold">{existingData ? "Edit Round Scorecard" : "Enter Round Scorecard"}</h2>
          <p className="text-muted-foreground">
            {existingData ? "Edit your scores" : "Enter your scores"} for your round at {course.name} on{" "}
            {roundData.date.toLocaleDateString()}
          </p>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isLoadingCourseData ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading course information...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              {/* AI Upload Button - only show for new scorecards */}
              {!existingData && (
                <div className="mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAIUpload}
                    className="w-full h-12 border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload & Analyze Scorecard with AI
                  </Button>
                </div>
              )}

              {/* Traditional Scorecard Grid */}
              <div className="mb-6">
                {/* Front Nine */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-700">Front Nine</h3>
                    {frontNinePar > 0 && (
                      <div className="text-sm text-gray-600">
                        Par: {frontNinePar} | Score: {frontNineScore || 0} |{" "}
                        {frontNineScore > 0
                          ? frontNineScore > frontNinePar
                            ? `+${frontNineScore - frontNinePar}`
                            : frontNineScore < frontNinePar
                              ? `${frontNineScore - frontNinePar}`
                              : "E"
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    {/* Grid with 10 columns: 1 for labels + 9 for holes */}
                    <div className="grid grid-cols-10 divide-x divide-gray-300">
                      {/* Header row with hole numbers */}
                      <div className="bg-gray-50 p-3 text-center font-bold text-sm text-gray-600 border-b border-gray-300">
                        HOLE
                      </div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div
                          key={i + 1}
                          className="bg-gray-50 p-3 text-center font-bold text-sm text-gray-700 border-b border-gray-300"
                        >
                          {i + 1}
                        </div>
                      ))}

                      {/* PAR row - READ ONLY when editing */}
                      <div className="bg-blue-50 p-3 text-center font-bold text-sm text-gray-700 border-b border-gray-300">
                        PAR
                      </div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={`par-${i + 1}`} className="border-b border-gray-300 relative bg-gray-50">
                          <div className="w-full h-12 flex items-center justify-center text-sm font-medium text-gray-700">
                            {holes[i + 1]?.par || "-"}
                          </div>
                        </div>
                      ))}

                      {/* SCORE row - EDITABLE with background colors */}
                      <div className="bg-green-50 p-3 text-center font-bold text-sm text-gray-700">SCORE</div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div
                          key={`score-${i + 1}-${holes[i + 1]?.score}`} // Add score to key to force re-render
                          className={`relative ${getScoreBackgroundColor(holes[i + 1]?.score, holes[i + 1]?.par)}`}
                        >
                          <Input
                            value={holes[i + 1]?.score || ""}
                            onChange={(e) => handleHoleChange(i + 1, "score", e.target.value)}
                            className="w-full h-12 text-center text-sm font-medium border-0 shadow-none bg-transparent focus:bg-green-50 focus:outline-none focus:ring-0 rounded-none px-0"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          {!holes[i + 1]?.score && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
                              -
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Back Nine */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-700">Back Nine</h3>
                    {backNinePar > 0 && (
                      <div className="text-sm text-gray-600">
                        Par: {backNinePar} | Score: {backNineScore || 0} |{" "}
                        {backNineScore > 0
                          ? backNineScore > backNinePar
                            ? `+${backNineScore - backNinePar}`
                            : backNineScore < backNinePar
                              ? `${backNineScore - backNinePar}`
                              : "E"
                          : ""}
                      </div>
                    )}
                  </div>
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    {/* Grid with 10 columns: 1 for labels + 9 for holes */}
                    <div className="grid grid-cols-10 divide-x divide-gray-300">
                      {/* Header row with hole numbers */}
                      <div className="bg-gray-50 p-3 text-center font-bold text-sm text-gray-600 border-b border-gray-300">
                        HOLE
                      </div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div
                          key={i + 10}
                          className="bg-gray-50 p-3 text-center font-bold text-sm text-gray-700 border-b border-gray-300"
                        >
                          {i + 10}
                        </div>
                      ))}

                      {/* PAR row - READ ONLY when editing */}
                      <div className="bg-blue-50 p-3 text-center font-bold text-sm text-gray-700 border-b border-gray-300">
                        PAR
                      </div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={`par-${i + 10}`} className="border-b border-gray-300 relative bg-gray-50">
                          <div className="w-full h-12 flex items-center justify-center text-sm font-medium text-gray-700">
                            {holes[i + 10]?.par || "-"}
                          </div>
                        </div>
                      ))}

                      {/* SCORE row - EDITABLE with background colors */}
                      <div className="bg-green-50 p-3 text-center font-bold text-sm text-gray-700">SCORE</div>
                      {Array.from({ length: 9 }, (_, i) => (
                        <div
                          key={`score-${i + 10}-${holes[i + 10]?.score}`} // Add score to key to force re-render
                          className={`relative ${getScoreBackgroundColor(holes[i + 10]?.score, holes[i + 10]?.par)}`}
                        >
                          <Input
                            value={holes[i + 10]?.score || ""}
                            onChange={(e) => handleHoleChange(i + 10, "score", e.target.value)}
                            className="w-full h-12 text-center text-sm font-medium border-0 shadow-none bg-transparent focus:bg-green-50 focus:outline-none focus:ring-0 rounded-none px-0"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          {!holes[i + 10]?.score && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
                              -
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                {totalPar > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <div className="space-x-4">
                        <span>Par: {totalPar}</span>
                        <span>Score: {totalScore || 0}</span>
                        {totalScore > 0 && (
                          <span
                            className={`${totalScore > totalPar ? "text-red-600" : totalScore < totalPar ? "text-green-600" : "text-gray-600"}`}
                          >
                            {totalScore > totalPar
                              ? `+${totalScore - totalPar}`
                              : totalScore < totalPar
                                ? `${totalScore - totalPar}`
                                : "E"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Color Legend */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Score Colors:</h4>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-red-100 border rounded"></div>
                      <span>Eagle or better</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-red-50 border rounded"></div>
                      <span>Birdie</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-white border rounded"></div>
                      <span>Par</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-50 border rounded"></div>
                      <span>Bogey</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-100 border rounded"></div>
                      <span>Double bogey</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-200 border rounded"></div>
                      <span>Triple+ bogey</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : existingData ? "Update Scorecard" : "Save Scorecard"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
