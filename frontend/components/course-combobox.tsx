"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Course } from "@/lib/database";

interface CourseComboboxProps {
  courses: Course[];
  value: string;
  onChange: (value: string) => void;
}

export function CourseCombobox({
  courses,
  value,
  onChange,
}: CourseComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span
            className={cn(value ? "text-foreground" : "text-muted-foreground")}
          >
            {value
              ? courses.find((course) => course.id.toString() === value)?.name
              : "Select course..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search course..." />
          <CommandList>
            <CommandEmpty>No course found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {courses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={course.name}
                  onSelect={(currentValue) => {
                    // Find the course by name and get its ID
                    const selectedCourse = courses.find(
                      (course) =>
                        course.name.toLowerCase() === currentValue.toLowerCase()
                    );
                    const courseId = selectedCourse
                      ? selectedCourse.id.toString()
                      : "";
                    onChange(courseId === value ? "" : courseId);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === course.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span>{course.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    Par {course.par}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
