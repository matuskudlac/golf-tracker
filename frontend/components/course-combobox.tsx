"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Course } from "@/lib/database"

interface CourseComboboxProps {
  courses: Course[]
  selectedCourse: Course | null
  onCourseSelect: (course: Course | null) => void
}

export function CourseCombobox({ courses, selectedCourse, onCourseSelect }: CourseComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedCourse ? (
            <span className="flex items-center justify-between w-full">
              <span>{selectedCourse.name}</span>
              <span className="text-sm text-muted-foreground">Par {selectedCourse.par}</span>
            </span>
          ) : (
            "Select course..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
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
                    onCourseSelect(course.id === selectedCourse?.id ? null : course)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedCourse?.id === course.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex items-center justify-between w-full">
                    <span>{course.name}</span>
                    <span className="text-sm text-muted-foreground">Par {course.par}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
