"use client"

import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { addGolfRoundToDB, getCoursesAction, addRoundScoresToDB } from "@/app/actions"
import { CourseCombobox } from "./course-combobox"
import { RoundScorecardDialog } from "./round-scorecard-dialog"
import type { Course } from "@/lib/database"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerCard } from "@/components/date-picker-card"
import { Edit3 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AddRoundFormProps {
  onRoundAdded?: () => void
}

export function AddRoundFormDB({ onRoundAdded }: AddRoundFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [includeScorecard, setIncludeScorecard] = useState(false)
  const [showScorecardDialog, setShowScorecardDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  // New state for the improved UX flow
  const [scorecardData, setScorecardData] = useState<Record<number, { par: string; score: string }> | null>(null)
  const [scorecardSaved, setScorecardSaved] = useState(false)

  // Basic round statistics
  const [scoringAverage, setScoringAverage] = useState("")
  const [fairwaysHit, setFairwaysHit] = useState("")
  const [greensInRegulation, setGreensInRegulation] = useState("")
  const [upAndDownPercentage, setUpAndDownPercentage] = useState("")
  const [puttsPerRound, setPuttsPerRound] = useState("")
  const [strokesGained, setStrokesGained] = useState("")

  // Load courses on component mount
  useEffect(() => {
    loadCourses()
  }, [])

  // Auto-populate total score when scorecard is saved
  useEffect(() => {
    if (scorecardData && scorecardSaved) {
      const totalScore = Object.values(scorecardData)
        .map((hole) => Number.parseInt(hole.score))
        .reduce((sum, score) => sum + score, 0)

      if (totalScore > 0) {
        setScoringAverage(totalScore.toString())
      }
    }
  }, [scorecardData, scorecardSaved])

  const loadCourses = async () => {
    try {
      setIsLoadingCourses(true)
      const result = await getCoursesAction()
      if (result.success) {
        setCourses(result.data || [])
      } else {
        toast.error("Failed to load courses")
      }
    } catch (error) {
      console.error("Error loading courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setIsLoadingCourses(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCourse) {
      toast.error("Please select a golf course")
      return
    }

    // If scorecard is included but not saved yet, open the scorecard dialog
    if (includeScorecard && !scorecardSaved) {
      setShowScorecardDialog(true)
      return
    }

    // Validate basic statistics
    if (
      !scoringAverage ||
      !fairwaysHit ||
      !greensInRegulation ||
      !upAndDownPercentage ||
      !puttsPerRound ||
      !strokesGained
    ) {
      toast.error("Please fill in all round statistics")
      return
    }

    // Submit the complete round (with or without scorecard)
    await submitCompleteRound()
  }

  const submitCompleteRound = async () => {
    if (!selectedCourse || !date) return

    setIsSubmitting(true)

    try {
      // First, create the basic round
      const formData = new FormData()
      formData.append("date", date.toISOString().split("T")[0])
      formData.append("courseId", selectedCourse.id.toString())
      formData.append("scoringAverage", scoringAverage)
      formData.append("fairwaysHit", fairwaysHit)
      formData.append("greensInRegulation", greensInRegulation)
      formData.append("upAndDownPercentage", upAndDownPercentage)
      formData.append("puttsPerRound", puttsPerRound)
      formData.append("strokesGained", strokesGained)

      const roundResult = await addGolfRoundToDB(formData)

      if (roundResult.success) {
        // If we have scorecard data, save it too
        if (scorecardData && scorecardSaved) {
          const scorecardFormData = new FormData()
          scorecardFormData.append("roundId", roundResult.data?.id.toString() || "")

          // Add all hole data
          for (let i = 1; i <= 18; i++) {
            const hole = scorecardData[i]
            scorecardFormData.append(`hole_${i}_par`, hole.par)
            scorecardFormData.append(`hole_${i}_score`, hole.score)
          }

          const scorecardResult = await addRoundScoresToDB(scorecardFormData)

          if (scorecardResult.success) {
            toast.success("Round and scorecard submitted successfully!", {
              description:
                scorecardResult.handicap !== null
                  ? `Your handicap for this round: ${scorecardResult.handicap}`
                  : "Round saved successfully",
            })
          } else {
            toast.error(scorecardResult.error || "Failed to save scorecard")
            return
          }
        } else {
          toast.success("Round submitted successfully!")
        }

        resetForm()
        onRoundAdded?.()
      } else {
        toast.error(roundResult.error || "Failed to add round")
      }
    } catch (error) {
      console.error("Error adding round:", error)
      toast.error("Failed to add round")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScorecardComplete = async (newScorecardData: Record<number, { par: string; score: string }>) => {
    // Save the scorecard data to state
    setScorecardData(newScorecardData)
    setScorecardSaved(true)
    setShowScorecardDialog(false)

    // Show success message
    toast.success("Scorecard saved successfully!", {
      description: "Review your stats and submit your round.",
      duration: 4000,
    })
  }

  const handleEditScorecard = () => {
    setShowScorecardDialog(true)
  }

  const resetForm = () => {
    setDate(new Date())
    setSelectedCourse(null)
    setIncludeScorecard(false)
    setScorecardData(null)
    setScorecardSaved(false)
    setScoringAverage("")
    setFairwaysHit("")
    setGreensInRegulation("")
    setUpAndDownPercentage("")
    setPuttsPerRound("")
    setStrokesGained("")
  }

  // Calculate button text and state
  const getSubmitButtonText = () => {
    if (isSubmitting) return "Submitting..."
    if (includeScorecard && !scorecardSaved) return "Continue to Scorecard"
    return "Submit Round"
  }

  const isSubmitDisabled = isSubmitting || !selectedCourse

  return (
    <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-4">
      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight">Add Round</h1>

      <div className="flex gap-8">
        {/* Left side - Date picker */}
        <div className="flex-shrink-0">
          <DatePickerCard
            title="Select Date"
            selected={date}
            onSelect={setDate}
            disabled={(date) => date > new Date()}
          />
        </div>

        {/* Right side - Form */}
        <div className="flex-1 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Round Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Selection */}
                <div className="space-y-2">
                  <Label htmlFor="course">Golf Course *</Label>
                  {isLoadingCourses ? (
                    <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
                  ) : (
                    <CourseCombobox
                      courses={courses}
                      selectedCourse={selectedCourse}
                      onCourseSelect={setSelectedCourse}
                    />
                  )}
                </div>

                {/* Scorecard Option */}
                {selectedCourse && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Checkbox
                        id="include-scorecard"
                        checked={includeScorecard}
                        onCheckedChange={(checked) => {
                          setIncludeScorecard(checked as boolean)
                          if (!checked) {
                            setScorecardData(null)
                            setScorecardSaved(false)
                          }
                        }}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="include-scorecard" className="text-sm font-medium text-blue-900">
                          Include detailed scorecard (hole-by-hole scores)
                        </Label>
                        <p className="text-sm text-blue-700">
                          Check this box to enter your exact score for each hole and get an accurate handicap
                          calculation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success message if scorecard saved */}
                {scorecardSaved && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      ✅ Scorecard saved successfully! Review your stats below and submit your round.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Basic Statistics - Always visible */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scoring-average">
                      Total Score *
                      {scorecardSaved && (
                        <span className="text-xs text-green-600 ml-1">(Auto-filled from scorecard)</span>
                      )}
                    </Label>
                    <Input
                      id="scoring-average"
                      type="number"
                      value={scoringAverage}
                      onChange={(e) => setScoringAverage(e.target.value)}
                      placeholder="e.g., 85"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fairways-hit">Fairways Hit *</Label>
                    <Input
                      id="fairways-hit"
                      type="number"
                      value={fairwaysHit}
                      onChange={(e) => setFairwaysHit(e.target.value)}
                      placeholder="e.g., 8"
                      min="0"
                      max="14"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="greens-in-regulation">Greens in Regulation *</Label>
                    <Input
                      id="greens-in-regulation"
                      type="number"
                      value={greensInRegulation}
                      onChange={(e) => setGreensInRegulation(e.target.value)}
                      placeholder="e.g., 12"
                      min="0"
                      max="18"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="up-and-down">Up & Down % *</Label>
                    <Input
                      id="up-and-down"
                      type="number"
                      value={upAndDownPercentage}
                      onChange={(e) => setUpAndDownPercentage(e.target.value)}
                      placeholder="e.g., 60"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="putts-per-round">Putts per Round *</Label>
                    <Input
                      id="putts-per-round"
                      type="number"
                      value={puttsPerRound}
                      onChange={(e) => setPuttsPerRound(e.target.value)}
                      placeholder="e.g., 32"
                      min="18"
                      max="60"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="strokes-gained">Strokes Gained *</Label>
                    <Input
                      id="strokes-gained"
                      type="number"
                      step="0.1"
                      value={strokesGained}
                      onChange={(e) => setStrokesGained(e.target.value)}
                      placeholder="e.g., -2.5"
                      required
                    />
                  </div>
                </div>

                {/* Edit Scorecard Button - Only show if scorecard is saved */}
                {scorecardSaved && (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleEditScorecard}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Scorecard
                    </Button>
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
                  {getSubmitButtonText()}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Round Scorecard Dialog */}
      {showScorecardDialog && selectedCourse && (
        <RoundScorecardDialog
          isOpen={showScorecardDialog}
          onClose={() => setShowScorecardDialog(false)}
          course={selectedCourse}
          onComplete={handleScorecardComplete}
          roundData={{
            date: date || new Date(),
            courseId: selectedCourse.id.toString(),
          }}
          existingData={scorecardData} // Pass existing data for editing
        />
      )}
    </div>
  )
}
