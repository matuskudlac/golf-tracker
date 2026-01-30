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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Loader2, ChevronsUpDown, Check, ExternalLink, Edit3, RotateCcw } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DatePickerInput } from '@/components/ui/input-date-picker'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'

type AddMode = 'manual' | 'upload'

interface AddRoundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface Course {
  id: string
  name: string
}

export function AddRoundDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddRoundDialogProps) {
  const router = useRouter()
  const [mode, setMode] = useState<AddMode>('manual')
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
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrCompleted, setOcrCompleted] = useState(false)
  const [showValidationError, setShowValidationError] = useState(false)
  
  // Stats tracking
  const [includeStats, setIncludeStats] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [stats, setStats] = useState({
    gir: '',
    fairways: '',
    upDowns: '',
    putts: ''
  })

  // Fetch course holes when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseHoles(selectedCourse.id)
    }
  }, [selectedCourse])

  // Reset step when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(1)
    }
  }, [open])

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

  // Calculate number of par 3s for fairways calculation
  const getPar3Count = () => {
    if (!courseHoles || courseHoles.length === 0) return 0
    return courseHoles
      .slice(0, totalHoles)
      .filter(hole => hole.par === 3)
      .length
  }

  // Get max values for validation
  const getMaxFairways = () => totalHoles - getPar3Count()
  const getMaxUpDowns = () => {
    const girValue = parseInt(stats.gir) || 0
    return totalHoles - girValue
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

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxSize: 10485760, // 10MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      // Validate required fields before processing
      if (!selectedCourse || !date) {
        setShowValidationError(true)
        return
      }
      setShowValidationError(false)
      handleFileUpload(acceptedFiles)
    }
  })

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return

    const file = files[0]
    setUploadedImage(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Process with AI
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('courseId', selectedCourse?.id || '')
      formData.append('totalHoles', totalHoles.toString())

      const response = await fetch('/api/ocr/round', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        // Auto-fill the scores from OCR result
        if (data.scores && Array.isArray(data.scores)) {
          setHoleScores(data.scores)
          setOcrCompleted(true)
        }
      }
    } catch (error) {
      console.error('OCR failed:', error)
    } finally {
      setIsProcessing(false)
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

      // Prepare stats data (only if includeStats is true)
      const statsData = includeStats ? {
        greens_in_regulation: stats.gir ? parseInt(stats.gir) : null,
        fairways_hit: stats.fairways ? parseInt(stats.fairways) : null,
        fairways_opportunities: getMaxFairways(),
        up_and_downs: stats.upDowns ? parseInt(stats.upDowns) : null,
        up_and_downs_opportunities: getMaxUpDowns(),
        total_putts: stats.putts ? parseInt(stats.putts) : null,
      } : {};

      // Create the round
      const { data: round, error: roundError } = await supabase
        .from('rounds')
        .insert([{
          user_id: user.id,
          course_id: selectedCourse.id,
          date_played: date.toISOString().split('T')[0],
          holes_played: totalHoles,
          total_score,
          weather_conditions: weather || null,
          notes: notes || null,
          ...statsData, // Include stats if provided
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
    setUploadedImage(null);
    setImagePreview(null);
    setOcrCompleted(false);
    setIncludeStats(false);
    setCurrentStep(1);
    setStats({
      gir: '',
      fairways: '',
      upDowns: '',
      putts: ''
    });
  };

  const dialogSize = 'sm:max-w-4xl'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${dialogSize} h-[90vh] flex flex-col p-0 gap-0 overflow-hidden`}>
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>{currentStep === 1 ? 'Add Round' : 'Performance Statistics'}</DialogTitle>
          <DialogDescription>
            {currentStep === 1 ? "Choose how you'd like to add your round" : "Track your performance metrics (optional)"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">

        {/* Mode Selector - Only show on Step 1 */}
        {currentStep === 1 && (
          <ToggleGroup 
            type="single" 
            value={mode} 
            onValueChange={(value) => value && setMode(value as AddMode)}
            className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg max-w-2xl mx-auto"
          >
            <ToggleGroupItem 
              value="manual"
              className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Manual Entry
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="upload"
              className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Scorecard
            </ToggleGroupItem>
          </ToggleGroup>
        )}

        <div className="space-y-6">
          {/* Step 1: Round Entry Form */}
          {currentStep === 1 && (
            <>
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

              {/* Date and Holes/Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <DatePickerInput
                  date={date}
                  onDateChange={setDate}
                  label="Date Played *"
                  placeholder="dd/mm/yyyy"
                  maxDate={new Date()}
                />
                <div className="flex gap-4">
                  {/* Number of Holes */}
                  <div className="space-y-2 flex-1">
                    <Label>Holes *</Label>
                    <ToggleGroup 
                      type="single" 
                      value={totalHoles.toString()}
                      onValueChange={(value) => value && setTotalHoles(parseInt(value) as 9 | 18)}
                      className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg w-full"
                    >
                      <ToggleGroupItem 
                        value="9"
                        className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md w-full"
                      >
                        9
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="18"
                        className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md w-full"
                      >
                        18
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Include Stats */}
                  <div className="space-y-2 flex-1">
                    <Label>Stats</Label>
                    <ToggleGroup 
                      type="single" 
                      value={includeStats ? 'yes' : 'no'}
                      onValueChange={(value) => setIncludeStats(value === 'yes')}
                      className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg w-full"
                    >
                      <ToggleGroupItem 
                        value="no"
                        className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md w-full"
                      >
                        No
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="yes"
                        className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md w-full"
                      >
                        Yes
                      </ToggleGroupItem>
                    </ToggleGroup>
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
                      onReset={() => setHoleScores(Array(18).fill(0))}
                    />
                  ) : null}
                </>
              )}
            </>
          )}

          {/* Upload Mode */}
          {mode === 'upload' && (
            <>
            <div className="space-y-6">
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
                        className={cn(
                          "flex-1 justify-between font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-700 focus-visible:border-brand-700",
                          showValidationError && !selectedCourse && "border-red-500 ring-1 ring-red-500"
                        )}
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
                                  setShowValidationError(false)
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
                {showValidationError && !selectedCourse && (
                  <p className="text-xs text-red-500">Please select a course before uploading</p>
                )}
              </div>

              {/* Date and Holes/Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <DatePickerInput
                    date={date}
                    onDateChange={(newDate) => {
                      setDate(newDate)
                      setShowValidationError(false)
                    }}
                    label="Date Played *"
                    placeholder="dd/mm/yyyy"
                    maxDate={new Date()}
                  />
                  {showValidationError && !date && (
                    <p className="text-xs text-red-500">Please select a date before uploading</p>
                  )}
                </div>

                <div className="flex gap-4">
                  {/* Number of Holes */}
                  <div className="space-y-2 flex-1">
                    <Label>Holes *</Label>
                    <ToggleGroup 
                      type="single" 
                      value={totalHoles.toString()}
                      onValueChange={(value) => value && setTotalHoles(parseInt(value) as 9 | 18)}
                      className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg w-full"
                    >
                      <ToggleGroupItem 
                        value="9"
                        className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md w-full"
                      >
                        9
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="18"
                        className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md w-full"
                      >
                        18
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Include Stats */}
                  <div className="space-y-2 flex-1">
                    <Label>Stats</Label>
                    <ToggleGroup 
                      type="single" 
                      value={includeStats ? 'yes' : 'no'}
                      onValueChange={(value) => setIncludeStats(value === 'yes')}
                      className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg w-full"
                    >
                      <ToggleGroupItem 
                        value="no"
                        className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md w-full"
                      >
                        No
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="yes"
                        className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md w-full"
                      >
                        Yes
                      </ToggleGroupItem>
                    </ToggleGroup>
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

              {/* Scorecard Image Upload */}
              <div className="space-y-2">
                {!ocrCompleted && <Label>Scorecard Image *</Label>}
                {!ocrCompleted ? (
                  !isProcessing ? (
                    <div 
                      {...getRootProps()} 
                      className={cn(
                        "border-2 border-dashed border-brand-700 rounded-lg h-[180px] flex flex-col items-center justify-center transition-colors cursor-pointer",
                        isDragActive ? "bg-brand-100 border-brand-800" : "hover:bg-brand-50"
                      )}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-12 w-12 text-brand-700 mb-3" />
                      <p className="text-sm font-medium text-brand-700">
                        {isDragActive ? "Drop the scorecard here" : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG or JPEG (MAX. 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[180px] border-2 border-brand-700 rounded-lg bg-brand-50">
                      <Loader2 className="h-8 w-8 animate-spin text-brand-700 mb-3" />
                      <span className="text-sm font-medium text-slate-700">
                        Extracting Data from Scorecard...
                      </span>
                    </div>
                  )
                ) : null}
              </div>



              {/* Scorecard Grid - Show after OCR completes */}
              {selectedCourse && ocrCompleted && (
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
                      onReset={() => {
                        setOcrCompleted(false)
                        setUploadedImage(null)
                        setImagePreview(null)
                        setHoleScores(Array(18).fill(0))
                      }}
                    />
                  ) : null}
                </>
                )}
              </div>
            </>
          )}
          </>
        )}

          {/* Step 2: Stats Entry */}
          {currentStep === 2 && (
            <div className="space-y-6 pt-4">
              {/* GIR Input */}

              {/* GIR Input */}
              <div className="space-y-2">
                <Label htmlFor="gir">Greens in Regulation</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="gir"
                    type="number"
                    value={stats.gir}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      if (value <= totalHoles) {
                        setStats({ ...stats, gir: e.target.value })
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent"
                    placeholder="0"
                    min={0}
                    max={totalHoles}
                  />
                  <div className="flex items-center gap-2 min-w-[5rem]">
                    <span className="text-slate-600">/ {totalHoles}</span>
                    <span className="text-sm font-medium text-brand-700">
                      {stats.gir ? Math.round((parseInt(stats.gir) / totalHoles) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Fairways Input */}
              <div className="space-y-2">
                <Label htmlFor="fairways">Fairways Hit</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="fairways"
                    type="number"
                    value={stats.fairways}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      if (value <= getMaxFairways()) {
                        setStats({ ...stats, fairways: e.target.value })
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent"
                    placeholder="0"
                    min={0}
                    max={getMaxFairways()}
                  />
                  <div className="flex items-center gap-2 min-w-[5rem]">
                    <span className="text-slate-600">/ {getMaxFairways()}</span>
                     <span className="text-sm font-medium text-brand-700">
                      {stats.fairways && getMaxFairways() > 0 ? Math.round((parseInt(stats.fairways) / getMaxFairways()) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Excludes par 3s ({getPar3Count()} par 3s on this course)</p>
              </div>

              {/* Up & Downs Input */}
              <div className="space-y-2">
                <Label htmlFor="upDowns">Up & Downs</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="upDowns"
                    type="number"
                    value={stats.upDowns}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      if (value <= getMaxUpDowns()) {
                        setStats({ ...stats, upDowns: e.target.value })
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent"
                    placeholder="0"
                    min={0}
                    max={getMaxUpDowns()}
                  />
                  <div className="flex items-center gap-2 min-w-[5rem]">
                    <span className="text-slate-600">/ {getMaxUpDowns()}</span>
                    <span className="text-sm font-medium text-brand-700">
                      {stats.upDowns && getMaxUpDowns() > 0 ? Math.round((parseInt(stats.upDowns) / getMaxUpDowns()) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Holes where you missed the green but made par or better</p>
              </div>

              {/* Total Putts Input */}
              <div className="space-y-2">
                <Label htmlFor="putts">Total Putts</Label>
                <input
                  id="putts"
                  type="number"
                  value={stats.putts}
                  onChange={(e) => setStats({ ...stats, putts: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent"
                  placeholder="0"
                  min={0}
                />
              </div>

              {/* Pagination Dots */}

            </div>
          )}

          {/* Actions */}



          </div>
        </div>

        {/* Sticky Footer */}
        <div className="px-6 py-4 border-t bg-slate-50/50 flex items-center justify-between shrink-0 relative">
          {/* Left: Back Button */}
          <div className="z-10">
            {currentStep === 2 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
            )}
          </div>

          {/* Center: Pagination Dots */}
          <div className="absolute left-1/2 -translate-x-1/2 flex justify-center gap-2">
            {includeStats && (
              <>
                <div className={cn("w-2 h-2 rounded-full transition-colors", currentStep === 1 ? "bg-brand-700" : "bg-slate-300")}></div>
                <div className={cn("w-2 h-2 rounded-full transition-colors", currentStep === 2 ? "bg-brand-700" : "bg-slate-300")}></div>
              </>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex gap-2 justify-end z-10">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (includeStats && currentStep === 1) {
                  setCurrentStep(2)
                } else {
                  handleSubmit()
                }
              }}
              disabled={loading || !selectedCourse || !date}
              className="bg-brand-700 hover:bg-brand-800 text-white min-w-[100px]"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {includeStats && currentStep === 1 ? "Continue" : "Save Round"}
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
  onReset?: () => void
}

function ScorecardGrid({ courseHoles, holeScores, totalHoles, onUpdateScore, onReset }: ScorecardGridProps) {
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
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-brand-700">{title}</h3>
        {title === 'Front 9' && onReset && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="h-6 px-2 text-slate-500 hover:text-brand-700 hover:bg-brand-50"
          >
            <RotateCcw className="h-3 w-3 mr-1.5" />
            <span className="text-xs">Reset Scorecard</span>
          </Button>
        )}
      </div>
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