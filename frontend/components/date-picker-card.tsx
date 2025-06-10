"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DatePickerCardProps {
  title: string;
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function DatePickerCard({
  title,
  selected,
  onSelect,
  disabled,
  className = "w-fit",
}: DatePickerCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          className="rounded-md border shadow-sm"
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
}
