"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { addScorecardToDB, updateScorecardToDB } from "@/app/actions"
import { Upload, X } from "lucide-react"

interface ScorecardDialogProps {
  isOpen: boolean
  onClose: () => void
  courseId: number
  courseName: string
  existingScorecard?: {
    id: number
    course_id: number
    holes: {
      hole_number: number
      par: number
      handicap: number
    }[]
    created_at: string
    updated_at: string
  } | null
  isEditing?: boolean
}

interface HoleData {
  par: string
  handicap: string
}

export function ScorecardDialog({
  isOpen,
  onClose,
  courseId,
  courseName,
  existingScorecard = null,
  isEditing = false,
}: ScorecardDialogProps) {
  const [holes, setHoles] = useState<Record<number, HoleData>>(() => {
    const initialHoles: Record<number, HoleData> = {}
    for (let i = 1; i <= 18; i++) {
      initialHoles[i] = { par: "", handicap: "" }
    }
    return initialHoles
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showing, setShowing] = useState(false)

  // Load existing scorecard data when dialog opens in edit mode
  useEffect(() => {
    if (isOpen && existingScorecard && isEditing) {
      const loadedHoles: Record<number, HoleData> = {}

      // Initialize all holes first
      for (let i = 1; i <= 18; i++) {
        loadedHoles[i] = { par: "", handicap: "" }
      }

      // Load existing data
      existingScorecard.holes.forEach((hole) => {
        loadedHoles[hole.hole_number] = {
          par: hole.par.toString(),
          handicap: hole.handicap.toString(),
        }
      })

      setHoles(loadedHoles)
    } else if (isOpen && !isEditing) {
      // Reset for new scorecard
      const resetHoles: Record<number, HoleData> = {}
      for (let i = 1; i <= 18; i++) {
        resetHoles[i] = { par: "", handicap: "" }
      }
      setHoles(resetHoles)
    }
  }, [isOpen, existingScorecard, isEditing])

  useEffect(() => {
    if (isOpen) {
      setShowing(true)
    } else {
      setShowing(false)
    }
  }, [isOpen])

  const handleHoleChange = (holeNumber: number, field: keyof HoleData, value: string) => {
    // Only allow numeric input and reasonable ranges
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = Number.parseInt(value)

      // Validate ranges
      if (field === "par" && value !== "" && (numValue < 3 || numValue > 6)) {
        return // Don't update if par is outside 3-6 range
      }
      if (field === "handicap" && value !== "" && (numValue < 1 || numValue > 18)) {
        return // Don't update if handicap is outside 1-18 range
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("courseId", courseId.toString())

      // Add all hole data to form
      for (let i = 1; i <= 18; i++) {
        const hole = holes[i]
        if (!hole.par || !hole.handicap) {
          toast.error(`Please fill out all fields for hole ${i}`)
          setIsSubmitting(false)
          return
        }
        formData.append(`hole_${i}_par`, hole.par)
        formData.append(`hole_${i}_handicap`, hole.handicap)
      }

      // Use appropriate action based on whether we're editing or adding
      const result = isEditing ? await updateScorecardToDB(formData) : await addScorecardToDB(formData)

      if (result.success) {
        toast.success(isEditing ? "Scorecard updated successfully!" : "Scorecard added successfully!")
        onClose()
        // Reset form
        const resetHoles: Record<number, HoleData> = {}
        for (let i = 1; i <= 18; i++) {
          resetHoles[i] = { par: "", handicap: "" }
        }
        setHoles(resetHoles)
      } else {
        toast.error(result.error || `Failed to ${isEditing ? "update" : "add"} scorecard`)
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "adding"} scorecard:`, error)
      toast.error(`Failed to ${isEditing ? "update" : "add"} scorecard`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIUpload = () => {
    toast.info("AI scorecard analysis coming soon!")
  }

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
        className={`relative bg-white rounded-2xl shadow-2xl w-[95vw] md:w-[90vw] lg:w-[85vw] max-w-6xl h-auto flex flex-col transition-all duration-300 ease-out ${showing ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
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
          <h2 className="text-2xl font-bold">{isEditing ? "Edit Scorecard" : "Add Scorecard"}</h2>
          <p className="text-muted-foreground">
            {isEditing ? "Update scorecard details" : "Enter details"} for your round at {courseName}
          </p>
        </div>

        {/* Modal Content */}
        <div className="flex- p-6 overflow-hidden">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            {/* AI Upload Button - always visible */}
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

            {/* Traditional Scorecard Grid */}
            <div className="flex-1 mb-6">
              {/* Front Nine */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Front Nine</h3>
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

                    {/* PAR row */}
                    <div className="bg-blue-50 p-3 text-center font-bold text-sm text-gray-700 border-b border-gray-300">
                      PAR
                    </div>
                    {Array.from({ length: 9 }, (_, i) => (
                      <div key={`par-${i + 1}`} className="border-b border-gray-300 relative">
                        <Input
                          value={holes[i + 1]?.par || ""}
                          onChange={(e) => handleHoleChange(i + 1, "par", e.target.value)}
                          className="w-full h-12 text-center text-sm font-medium border-0 shadow-none bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-0 rounded-none px-0"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                        {!holes[i + 1]?.par && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
                            -
                          </div>
                        )}
                      </div>
                    ))}

                    {/* HCP row */}
                    <div className="bg-green-50 p-3 text-center font-bold text-sm text-gray-700">HCP</div>
                    {Array.from({ length: 9 }, (_, i) => (
                      <div key={`hcp-${i + 1}`} className="relative">
                        <Input
                          value={holes[i + 1]?.handicap || ""}
                          onChange={(e) => handleHoleChange(i + 1, "handicap", e.target.value)}
                          className="w-full h-12 text-center text-sm font-medium border-0 shadow-none bg-transparent focus:bg-green-50 focus:outline-none focus:ring-0 rounded-none px-0"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                        {!holes[i + 1]?.handicap && (
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
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Back Nine</h3>
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

                    {/* PAR row */}
                    <div className="bg-blue-50 p-3 text-center font-bold text-sm text-gray-700 border-b border-gray-300">
                      PAR
                    </div>
                    {Array.from({ length: 9 }, (_, i) => (
                      <div key={`par-${i + 10}`} className="border-b border-gray-300 relative">
                        <Input
                          value={holes[i + 10]?.par || ""}
                          onChange={(e) => handleHoleChange(i + 10, "par", e.target.value)}
                          className="w-full h-12 text-center text-sm font-medium border-0 shadow-none bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-0 rounded-none px-0"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                        {!holes[i + 10]?.par && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
                            -
                          </div>
                        )}
                      </div>
                    ))}

                    {/* HCP row */}
                    <div className="bg-green-50 p-3 text-center font-bold text-sm text-gray-700">HCP</div>
                    {Array.from({ length: 9 }, (_, i) => (
                      <div key={`hcp-${i + 10}`} className="relative">
                        <Input
                          value={holes[i + 10]?.handicap || ""}
                          onChange={(e) => handleHoleChange(i + 10, "handicap", e.target.value)}
                          className="w-full h-12 text-center text-sm font-medium border-0 shadow-none bg-transparent focus:bg-green-50 focus:outline-none focus:ring-0 rounded-none px-0"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                        {!holes[i + 10]?.handicap && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
                            -
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 mt-auto">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-black hover:bg-gray-800 text-white">
                {isSubmitting
                  ? isEditing
                    ? "Updating Scorecard..."
                    : "Saving Scorecard..."
                  : isEditing
                    ? "Update Scorecard"
                    : "Save Scorecard"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
