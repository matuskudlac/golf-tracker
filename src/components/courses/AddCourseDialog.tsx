'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AnimatedInput } from '@/components/ui/animated-input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, Check, ChevronsUpDown, Zap, Edit3 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { useDropzone } from 'react-dropzone'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type AddMode = 'quick' | 'upload' | 'manual'

interface AddCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editMode?: boolean
  courseData?: any
}

interface HoleData {
  hole_number: number
  par: number
  distance: number
  handicap: number
}

export function AddCourseDialog({
  open,
  onOpenChange,
  onSuccess,
  editMode = false,
  courseData,
}: AddCourseDialogProps) {
  const [mode, setMode] = useState<AddMode>('quick')
  const [courseName, setCourseName] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [totalHoles, setTotalHoles] = useState<9 | 18>(18)
  const [teeColor, setTeeColor] = useState('Yellow')
  const [teeColorOpen, setTeeColorOpen] = useState(false)
  
  // New State for Ratings
  const [courseRating, setCourseRating] = useState('')
  const [slopeRating, setSlopeRating] = useState('')

  const [loading, setLoading] = useState(false)
  const [processingOCR, setProcessingOCR] = useState(false)
  const [ocrCompleted, setOcrCompleted] = useState(false)
  const [holeData, setHoleData] = useState<HoleData[]>(
    Array.from({ length: 18 }, (_, i) => ({
      hole_number: i + 1,
      par: 4,
      distance: 0,
      handicap: i + 1,
    }))
  )

  const commonTeeColors = ['Black', 'White', 'Yellow', 'Blue', 'Red']

  // Pre-populate form when in edit mode
  useEffect(() => {
    if (editMode && courseData) {
      setCourseName(courseData.name || '')
      setCity(courseData.city || '')
      setCountry(courseData.country || '')
      setTotalHoles(courseData.total_holes || 18)
      setTeeColor(courseData.tee_color || 'Yellow')
      setCourseRating(courseData.course_rating ? courseData.course_rating.toString() : '')
      setSlopeRating(courseData.slope_rating ? courseData.slope_rating.toString() : '')
      
      // Fetch existing hole data
      const fetchHoles = async () => {
        try {
          const response = await fetch(`/api/courses/${courseData.id}/holes`)
          if (response.ok) {
            const holes = await response.json()
            if (holes && holes.length > 0) {
              setHoleData(holes)
            }
          }
        } catch (error) {
          console.error('Failed to fetch hole data:', error)
        }
      }
      
      fetchHoles()
    }
  }, [editMode, courseData])

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxSize: 10485760, // 10MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      handleFileUpload(acceptedFiles)
    }
  })


  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return

    setProcessingOCR(true)
    try {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('teeColor', teeColor)

      const response = await fetch('/api/ocr/course', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setHoleData(data.holes)
        setOcrCompleted(true)
      }
    } catch (error) {
      console.error('OCR failed:', error)
    } finally {
      setProcessingOCR(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        name: courseName,
        city: city || null,
        country: country || null,
        total_holes: totalHoles,
        // Only save tee color and ratings if not in Quick Add mode
        tee_color: mode !== 'quick' ? (teeColor || null) : null,
        course_rating: (mode !== 'quick' && courseRating) ? parseFloat(courseRating) : null,
        slope_rating: (mode !== 'quick' && slopeRating) ? parseInt(slopeRating) : null,
      }

      if (editMode && courseData) {
        // Update existing course
        const courseResponse = await fetch(`/api/courses/${courseData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!courseResponse.ok) throw new Error('Failed to update course')

        // Update hole data
        const holesToUpdate = holeData.slice(0, totalHoles)
        
        await fetch(`/api/courses/${courseData.id}/holes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ holes: holesToUpdate }),
        })
      } else {
        // Create new course
        const courseResponse = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!courseResponse.ok) throw new Error('Failed to create course')

        const course = await courseResponse.json()

        // If mode is not quick, create hole data
        if (mode !== 'quick') {
          const holesToCreate = holeData.slice(0, totalHoles)
          
          await fetch('/api/courses/' + course.id + '/holes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ holes: holesToCreate }),
          })
        }
      }

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error('Failed to save course:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCourseName('')
    setCity('')
    setCountry('')
    setCourseRating('')
    setSlopeRating('')
    setTotalHoles(18)
    setOcrCompleted(false)
    setHoleData(
      Array.from({ length: 18 }, (_, i) => ({
        hole_number: i + 1,
        par: 4,
        distance: 0,
        handicap: i + 1,
      }))
    )
  }

  const updateHoleData = (index: number, field: keyof HoleData, value: number) => {
    const newHoleData = [...holeData]
    newHoleData[index] = { ...newHoleData[index], [field]: value }
    setHoleData(newHoleData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>
            {editMode ? 'Edit Course' : 'Add Course'}
          </DialogTitle>
          <DialogDescription>
            {editMode ? 'Update course and hole information' : 'Choose how you\'d like to add your course'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Mode Selector */}
          <ToggleGroup 
            type="single" 
            value={mode} 
            onValueChange={(value) => value && setMode(value as AddMode)}
            className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg max-w-2xl mx-auto mb-6"
          >
            <ToggleGroupItem 
              value="quick" 
              className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md"
            >
              <Zap className="h-4 w-4 mr-2" />
              Quick Add
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="upload"
              className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Scorecard
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="manual"
              className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Manual Entry
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="space-y-6">
            {/* Basic Course Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name *</Label>
                <AnimatedInput
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g., Pebble Beach Golf Links"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <AnimatedInput
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Pebble Beach"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <AnimatedInput
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., USA"
                  />
                </div>
              </div>

              {mode !== 'quick' && (
                <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cr">Course Rating (CR)</Label>
                    <AnimatedInput
                      id="cr"
                      type="number"
                      value={courseRating}
                      onChange={(e) => setCourseRating(e.target.value)}
                      placeholder="e.g., 72.1"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slope">Slope Rating (SR)</Label>
                    <AnimatedInput
                      id="slope"
                      type="number"
                      value={slopeRating}
                      onChange={(e) => setSlopeRating(e.target.value)}
                      placeholder="e.g., 130"
                      min={55}
                      max={155}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tee Color</Label>
                    <Popover open={teeColorOpen} onOpenChange={setTeeColorOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={teeColorOpen}
                          className="w-full justify-between font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-700 focus-visible:border-brand-700"
                        >
                          {teeColor || "Select tee color..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command shouldFilter={false} className="[&_[cmdk-input-wrapper]]:border-0 [&_[cmdk-input-wrapper]]:focus-within:ring-0 [&_[cmdk-input]]:focus:ring-0 [&_[cmdk-input]]:focus-visible:ring-0">
                          <CommandInput 
                            placeholder="Type or select..." 
                            className="focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none !ring-0 !outline-none [&>input]:focus:ring-0 [&>input]:focus-visible:ring-0"
                            value={teeColor}
                            onValueChange={setTeeColor}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                setTeeColorOpen(false)
                              }
                            }}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <div className="py-2 text-center text-sm">
                                Type custom color and press Enter
                              </div>
                            </CommandEmpty>
                            <CommandGroup heading="Common Tee Colors">
                              {commonTeeColors.map((color) => (
                                <CommandItem
                                  key={color}
                                  value={color}
                                  onSelect={(currentValue) => {
                                    setTeeColor(currentValue)
                                    setTeeColorOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      teeColor === color ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {color}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Holes</Label>
                    <ToggleGroup 
                      type="single" 
                      value={totalHoles.toString()} 
                      onValueChange={(value) => value && setTotalHoles(parseInt(value) as 9 | 18)}
                      className="!w-full gap-2 p-1 bg-slate-100 rounded-lg"
                    >
                      <ToggleGroupItem 
                        value="9"
                        className="flex-1 data-[state=on]:bg-brand-700 data-[state=on]:text-white data-[state=on]:shadow-sm transition-all !rounded-md"
                      >
                        9 Holes
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="18"
                        className="flex-1 data-[state=on]:bg-brand-700 data-[state=on]:text-white data-[state=on]:shadow-sm transition-all !rounded-md"
                      >
                        18 Holes
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
                </>
              )}
            </div>

            {/* Upload Scorecard */}
            {mode === 'upload' && (
              <div className="space-y-4">

                {!ocrCompleted && <Label>Upload Scorecard</Label>}
                {!ocrCompleted ? (
                  !processingOCR ? (
                    <div 
                      {...getRootProps()} 
                      className={cn(
                        "border-2 border-dashed border-brand-700 rounded-lg p-8 text-center transition-colors cursor-pointer",
                        isDragActive ? "bg-brand-100 border-brand-800" : "hover:bg-brand-50"
                      )}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-12 w-12 mx-auto text-brand-700 mb-3" />
                      <p className="text-sm font-medium text-brand-700">
                        {isDragActive ? "Drop the scorecard here" : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG or JPEG (MAX. 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8 border-2 border-brand-700 rounded-lg bg-brand-50">
                      <Loader2 className="h-6 w-6 animate-spin text-brand-700" />
                      <span className="ml-2 text-sm text-slate-600">
                        Processing scorecard...
                      </span>
                    </div>
                  )
                ) : null}
              </div>
            )}

            {/* Scorecard Grid */}
            {mode !== 'quick' && !processingOCR && (mode === 'manual' || ocrCompleted) && (
              <ScorecardGrid
                holeData={holeData}
                totalHoles={totalHoles}
                onUpdate={updateHoleData}
              />
            )}
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="px-6 py-4 border-t bg-slate-50/50 flex items-center justify-end gap-2 shrink-0 relative">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!courseName || loading}
            className="bg-brand-700 hover:bg-brand-800 text-white"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {editMode ? 'Save Changes' : 'Add Course'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Scorecard Grid Component
interface ScorecardGridProps {
  holeData: HoleData[]
  totalHoles: 9 | 18
  onUpdate: (index: number, field: keyof HoleData, value: number) => void
}

function ScorecardGrid({ holeData, totalHoles, onUpdate }: ScorecardGridProps) {
  const front9 = holeData.slice(0, 9)
  const back9 = holeData.slice(9, 18)

  const calculateTotal = (holes: HoleData[], field: 'par' | 'distance') => {
    return holes.reduce((sum, hole) => sum + (hole[field] || 0), 0)
  }

  const renderNine = (holes: HoleData[], startIndex: number, title: string, showTotal: boolean) => (
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
              {title === 'Front 9' && (
                <th className="px-2 py-2 text-center font-bold">Out</th>
              )}
              {title === 'Back 9' && (
                <>
                  <th className="px-2 py-2 text-center font-bold border-r border-white/30">In</th>
                  {totalHoles === 18 && (
                    <th className="px-2 py-2 text-center font-bold">Total</th>
                  )}
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Length Row */}
            <tr className="border-t border-brand-700">
              <td className="px-2 py-2 font-medium text-brand-700 bg-brand-50 border-r border-brand-700">
                Length
              </td>
              {holes.map((hole, index) => (
                <td key={hole.hole_number} className="p-0 border-r border-brand-700">
                  <input
                    type="number"
                    value={hole.distance || ''}
                    onChange={(e) =>
                      onUpdate(startIndex + index, 'distance', parseInt(e.target.value) || 0)
                    }
                    className="w-full h-full px-2 py-2 text-center border-0 focus:outline-none focus:ring-0 focus:bg-brand-50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </td>
              ))}
              {showTotal && (
                <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50">
                  {calculateTotal(holes, 'distance')}
                </td>
              )}
              {title === 'Back 9' && totalHoles === 18 && (
                <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50 border-l border-brand-700">
                  {calculateTotal([...front9, ...back9], 'distance')}
                </td>
              )}
            </tr>
            {/* Par Row */}
            <tr className="border-t border-brand-700">
              <td className="px-2 py-2 font-medium text-brand-700 bg-brand-50 border-r border-brand-700">
                Par
              </td>
              {holes.map((hole, index) => (
                <td key={hole.hole_number} className="p-0 border-r border-brand-700">
                  <input
                    type="number"
                    value={hole.par}
                    onChange={(e) =>
                      onUpdate(startIndex + index, 'par', parseInt(e.target.value) || 4)
                    }
                    className="w-full h-full px-2 py-2 text-center border-0 focus:outline-none focus:ring-0 focus:bg-brand-50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min={3}
                    max={5}
                  />
                </td>
              ))}
              {showTotal && (
                <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50">
                  {calculateTotal(holes, 'par')}
                </td>
              )}
              {title === 'Back 9' && totalHoles === 18 && (
                <td className="px-2 py-2 text-center font-semibold text-brand-700 bg-brand-50 border-l border-brand-700">
                  {calculateTotal([...front9, ...back9], 'par')}
                </td>
              )}
            </tr>
            {/* HCP Row */}
            <tr className="border-t border-brand-700">
              <td className="px-2 py-2 font-medium text-brand-700 bg-brand-50 border-r border-brand-700">
                HCP
              </td>
              {holes.map((hole, index) => (
                <td key={hole.hole_number} className="p-0 border-r border-brand-700">
                  <input
                    type="number"
                    value={hole.handicap}
                    onChange={(e) =>
                      onUpdate(startIndex + index, 'handicap', parseInt(e.target.value) || 1)
                    }
                    className="w-full h-full px-2 py-2 text-center border-0 focus:outline-none focus:ring-0 focus:bg-brand-50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min={1}
                    max={18}
                  />
                </td>
              ))}
              {showTotal && (
                <td className="px-2 py-2 text-center bg-brand-50"></td>
              )}
              {title === 'Back 9' && totalHoles === 18 && (
                <td className="px-2 py-2 text-center bg-brand-50 border-l border-brand-700"></td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {renderNine(front9, 0, 'Front 9', true)}
      {totalHoles === 18 && renderNine(back9, 9, 'Back 9', true)}
    </div>
  )
}
