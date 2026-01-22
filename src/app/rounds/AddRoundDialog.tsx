'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AnimatedInput } from '@/components/ui/animated-input'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { Loader2, ChevronsUpDown, Check, ExternalLink } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DatePickerInput } from '@/components/ui/input-date-picker'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type AddMode = 'manual' | 'upload'

interface AddRoundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: AddMode
  onSuccess: () => void
}

interface Course {
  id: string
  name: string
}

export function AddRoundDialog({
  open,
  onOpenChange,
  mode,
  onSuccess,
}: AddRoundDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courseOpen, setCourseOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [totalHoles, setTotalHoles] = useState<9 | 18>(18)
  const [weather, setWeather] = useState('')
  const [notes, setNotes] = useState('')
  const [courseHoles, setCourseHoles] = useState<any[]>([])
  const [holeScores, setHoleScores] = useState<number[]>(Array(18).fill(0))
  const [loadingCourseHoles, setLoadingCourseHoles] = useState(false)

  // Fetch course holes when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseHoles(selectedCourse.id)
    }
  }, [selectedCourse])

  const fetchCourseHoles = async (courseId: string) => {
    setLoadingCourseHoles(true)
    try {
      const response = await fetch(`/api/courses/${courseId}/holes`)
      if (response.ok) {
        const data = await response.json()
        setCourseHoles(data)
        // Reset scores when course changes
        setHoleScores(Array(18).fill(0))
      }
    } catch (error) {
      console.error('Failed to fetch course holes:', error)
    } finally {
      setLoadingCourseHoles(false)
    }
  }

  const updateHoleScore = (index: number, score: number) => {
    const newScores = [...holeScores]
    newScores[index] = score
    setHoleScores(newScores)
  }

  const calculateTotal = (scores: number[], start: number, end: number) => {
    return scores.slice(start, end).reduce((sum, score) => sum + (score || 0), 0)
  }

  const calculatePar = (holes: any[], start: number, end: number) => {
    return holes.slice(start, end).reduce((sum, hole) => sum + (hole.par || 0), 0)
  }

  // Fetch courses on mount
  useEffect(() => {
    if (open) {
      fetchCourses()
    }
  }, [open])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const handleAddCourse = () => {
    router.push('/courses')
    onOpenChange(false)
  }

    const handleSubmit = async () => {
    if (!selectedCourse || !date) return;

    setLoading(true);
    try {
      const supabase = createClient();
      
      // Prepare hole data
      const holesData = courseHoles.slice(0, totalHoles).map((hole, index) => ({
        course_hole_id: hole.id,
        score: holeScores[index] || 0,
      }));

      // Check if all scores are entered
      const hasAllScores = holesData.every(hole => hole.score > 0);
      if (!hasAllScores) {
        alert('Please enter scores for all holes');
        setLoading(false);
        return;
      }

      // Get current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        throw new Error('You must be logged in to add a round')
      }
      
      const user = session.user

      // Calculate total score
      const total_score = holesData.reduce((sum, hole) => sum + hole.score, 0);

      // Create the round
      const { data: round, error: roundError } = await supabase
        .from('rounds')
        .insert([{
          user_id: user.id,
          course_id: selectedCourse.id,
          date_played: date.toISOString().split('T')[0],
          total_score,
          weather_conditions: weather || null,
          notes: notes || null,
        }])
        .select()
        .single();

      if (roundError) {
        console.error('Error creating round:', roundError);
        throw new Error(roundError.message);
      }

      // Create hole scores
      const holeScoresData = holesData.map(hole => ({
        round_id: round.id,
        course_hole_id: hole.course_hole_id,
        score: hole.score,
      }));

      const { error: holesError } = await supabase
        .from('round_holes')
        .insert(holeScoresData);

      if (holesError) {
        console.error('Error creating hole scores:', holesError);
        throw new Error(holesError.message);
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save round:', error);
      alert('Failed to save round. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCourse(null);
    setDate(new Date());
    setTotalHoles(18);
    setWeather('');
    setNotes('');
    setCourseHoles([]);
    setHoleScores(Array(18).fill(0));
  };

  const dialogSize = mode === 'manual' ? 'sm:max-w-4xl' : 'sm:max-w-2xl'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${dialogSize} max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'manual' && 'Add Round - Manual Entry'}
            {mode === 'upload' && 'Add Round - Upload Scorecard'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'manual' && 'Enter your round details and hole-by-hole scores'}
            {mode === 'upload' && 'Upload a scorecard to auto-fill your round data'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Manual Entry Form */}
          {mode === 'manual' && (
            <>
              {/* Course Selection */}
              <div className="space-y-2">
                <Label>Course *</Label>
                <div className="flex gap-2">
                  <Popover open={courseOpen} onOpenChange={setCourseOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={courseOpen}
                        className="flex-1 justify-between font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-700 focus-visible:border-brand-700"
                      >
                        {selectedCourse ? selectedCourse.name : "Select course..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search courses..." />
                        <CommandList>
                          <CommandEmpty>No course found.</CommandEmpty>
                          <CommandGroup>
                            {courses.map((course) => (
                              <CommandItem
                                key={course.id}
                                value={course.name}
                                onSelect={() => {
                                  setSelectedCourse(course)
                                  setCourseOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCourse?.id === course.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {course.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    onClick={handleAddCourse}
                    className="shrink-0"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </div>
              </div>

              {/* Date and Holes */}
              <div className="grid grid-cols-2 gap-4">
                <DatePickerInput
                  date={date}
                  onDateChange={setDate}
                  label="Date Played *"
                  placeholder="dd/mm/yyyy"
                />
                <div className="space-y-2">
                  <Label>Number of Holes *</Label>
                  <div className="flex gap-2">
                    <Toggle
                      pressed={totalHoles === 9}
                      onPressedChange={() => setTotalHoles(9)}
                      className="data-[state=on]:bg-brand-700 data-[state=on]:text-white flex-1"
                    >
                      9 Holes
                    </Toggle>
                    <Toggle
                      pressed={totalHoles === 18}
                      onPressedChange={() => setTotalHoles(18)}
                      className="data-[state=on]:bg-brand-700 data-[state=on]:text-white flex-1"
                    >
                      18 Holes
                    </Toggle>
                  </div>
                </div>
              </div>

              {/* Weather (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="weather">Weather</Label>
                <AnimatedInput
                  id="weather"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  placeholder="e.g., Sunny, 75°F"
                />
              </div>

              {/* Notes (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about your round..."
                  rows={3}
                  className="focus-visible:ring-1 focus-visible:ring-brand-700 focus-visible:border-brand-700"
                />
              </div>

            {/* Scorecard Grid */}
              {selectedCourse && (
                <>
                  {loadingCourseHoles ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full border-4 border-brand-100"></div>
                        <div className="absolute top-0 h-12 w-12 rounded-full border-4 border-brand-700 border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-sm text-slate-600">Loading course data...</p>
                    </div>
                  ) : courseHoles.length > 0 ? (
                    <ScorecardGrid
                      courseHoles={courseHoles}
                      holeScores={holeScores}
                      totalHoles={totalHoles}
                      onUpdateScore={updateHoleScore}
                    />
                  ) : null}
                </>
              )}
            </>
          )}

          {/* Upload Mode - Coming Later */}
          {mode === 'upload' && (
            <div className="text-center py-8 text-slate-500">
              Upload scorecard form coming later...
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedCourse || !date}
              className="bg-brand-700 hover:bg-brand-800 text-white"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Round
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Scorecard Grid Component
interface ScorecardGridProps {
  courseHoles: any[]
  holeScores: number[]
  totalHoles: 9 | 18
  onUpdateScore: (index: number, score: number) => void
}

function ScorecardGrid({ courseHoles, holeScores, totalHoles, onUpdateScore }: ScorecardGridProps) {
  const front9Holes = courseHoles.slice(0, 9)
  const back9Holes = courseHoles.slice(9, 18)
  const front9Scores = holeScores.slice(0, 9)
  const back9Scores = holeScores.slice(9, 18)

  const calculateTotal = (scores: number[]) => {
    return scores.reduce((sum, score) => sum + (score || 0), 0)
  }

  const calculatePar = (holes: any[]) => {
    return holes.reduce((sum, hole) => sum + (hole.par || 0), 0)
  }

  const renderNine = (holes: any[], scores: number[], startIndex: number, title: string) => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-brand-700">{title}</h3>
      <div className="border-2 border-brand-700 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-brand-700 text-white">
              <th className="px-2 py-2 text-center border-r border-white/30">Hole</th>
              {holes.map((hole) => (
                <th key={hole.hole_number} className="px-2 py-2 text-center border-r border-white/30">
                  {hole.hole_number}
                </th>
              ))}
              <th className="px-2 py-2 text-center font-bold">
                {title === 'Front 9' ? 'Out' : 'In'}
              </th>
              {title === 'Back 9' && totalHoles === 18 && (
                <th className="px-2 py-2 text-center font-bold">Total</th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Distance Row */}
            <tr className="border-t border-brand-700">
              <td className="px-2 py-2 font-medium text-brand-700 bg-brand-50 border-r border-brand-700">
                Length
              </td>
              {holes.map((hole) => (
                <td key={hole.hole_number} className="px-2 py-2 text-center border-r border-brand-700">
                  {hole.distance || 0}
                </td>
              ))}
              <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50">
                {holes.reduce((sum, hole) => sum + (hole.distance || 0), 0)}
              </td>
              {title === 'Back 9' && totalHoles === 18 && (
                <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50 border-l border-brand-700">
                  {[...front9Holes, ...back9Holes].reduce((sum, hole) => sum + (hole.distance || 0), 0)}
                </td>
              )}
            </tr>
            {/* Par Row */}
            <tr className="border-t border-brand-700">
              <td className="px-2 py-2 font-medium text-brand-700 bg-brand-50 border-r border-brand-700">
                Par
              </td>
              {holes.map((hole) => (
                <td key={hole.hole_number} className="px-2 py-2 text-center border-r border-brand-700">
                  {hole.par}
                </td>
              ))}
              <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50">
                {calculatePar(holes)}
              </td>
              {title === 'Back 9' && totalHoles === 18 && (
                <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50 border-l border-brand-700">
                  {calculatePar([...front9Holes, ...back9Holes])}
                </td>
              )}
            </tr>
            {/* HCP Row */}
            <tr className="border-t border-brand-700">
              <td className="px-2 py-2 font-medium text-brand-700 bg-brand-50 border-r border-brand-700">
                HCP
              </td>
              {holes.map((hole) => (
                <td key={hole.hole_number} className="px-2 py-2 text-center border-r border-brand-700">
                  {hole.handicap}
                </td>
              ))}
              <td className="px-2 py-2 text-center bg-brand-50"></td>
              {title === 'Back 9' && totalHoles === 18 && (
                <td className="px-2 py-2 text-center bg-brand-50 border-l border-brand-700"></td>
              )}
            </tr>
            {/* Score Row */}
            <tr className="border-t border-brand-700">
              <td className="px-2 py-2 font-medium text-brand-700 bg-brand-50 border-r border-brand-700">
                Score
              </td>
              {holes.map((hole, index) => (
                <td key={hole.hole_number} className="p-0 border-r border-brand-700">
                  <input
                    type="number"
                    value={scores[index] || ''}
                    onChange={(e) =>
                      onUpdateScore(startIndex + index, parseInt(e.target.value) || 0)
                    }
                    className="w-full h-full px-2 py-2 text-center border-0 focus:outline-none focus:ring-0 focus:bg-brand-50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                    min={1}
                    max={15}
                  />
                </td>
              ))}
              <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50">
                {calculateTotal(scores)}
              </td>
              {title === 'Back 9' && totalHoles === 18 && (
                <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50 border-l border-brand-700">
                  {calculateTotal([...front9Scores, ...back9Scores])}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {renderNine(front9Holes, front9Scores, 0, 'Front 9')}
      {totalHoles === 18 && renderNine(back9Holes, back9Scores, 9, 'Back 9')}
    </div>
  )
}