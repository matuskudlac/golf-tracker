"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { setDate } from "date-fns"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  // Format as dd/mm/yyyy (European format)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

interface DatePickerInputProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  id?: string
}

export function DatePickerInput({
  date,
  onDateChange,
  label = "Date",
  placeholder = "Select date",
  id = "date-picker"
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  // Update value when date prop changes
  React.useEffect(() => {
    setValue(formatDate(date))
    setMonth(date)
  }, [date])

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="focus-within:ring-1 focus-within:ring-brand-700 focus-within:border-brand-700">
        <InputGroupInput
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const inputValue = e.target.value
            
            // Only allow numbers and slashes
            const sanitized = inputValue.replace(/[^0-9/]/g, '')
            setValue(sanitized)
            
            // Try to parse the date
            const parsedDate = new Date(sanitized)
            if (isValidDate(parsedDate)) {
              onDateChange(parsedDate)
              setMonth(parsedDate)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
          className="focus:outline-none focus:ring-0 focus-visible:ring-0 border-0"
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
                className="hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-0 focus-visible:ring-0"
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(selectedDate) => {
                  onDateChange(selectedDate)
                  setValue(formatDate(selectedDate))
                  setOpen(false)
                }}
                className="[&_.rdp-day_selected]:bg-brand-700 [&_.rdp-day_selected]:text-white [&_.rdp-day_selected:hover]:bg-brand-800"
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
