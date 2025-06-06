"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addGolfRoundToDB, getCoursesAction } from "@/app/actions";
import { CourseCombobox } from "./course-combobox";

interface Course {
  id: number;
  name: string;
  par: number;
  created_at: string;
  updated_at: string;
}

export function AddRoundFormDB() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);

  // Load courses on component mount using server action
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const result = await getCoursesAction();
        if (result.success && result.data) {
          setCourses(result.data);
        } else {
          console.error("Failed to load courses:", result.error);
          toast.error("Failed to load courses");
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  // Handle form submission with database persistence
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error("Please select a date for the round");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("date", selectedDate.toISOString().split("T")[0]);

      // Add course ID if selected
      if (selectedCourse) {
        formData.append("courseId", selectedCourse);
      }

      console.log("Submitting form data:", {
        date: selectedDate.toISOString().split("T")[0],
        courseId: selectedCourse || "none",
        scoringAverage: formData.get("scoringAverage"),
        fairwaysHit: formData.get("fairwaysHit"),
        greensInRegulation: formData.get("greensInRegulation"),
        upAndDownPercentage: formData.get("upAndDownPercentage"),
        puttsPerRound: formData.get("puttsPerRound"),
        strokesGained: formData.get("strokesGained"),
      });

      const result = await addGolfRoundToDB(formData);
      console.log("Server action result:", result);

      if (result && result.success) {
        // Show success message
        toast.success("Round added successfully!", {
          description: `Your round from ${selectedDate.toLocaleDateString()} has been saved.`,
          duration: 3000,
        });

        // Reset form using ref to avoid null reference
        if (formRef.current) {
          formRef.current.reset();
        }
        setSelectedDate(new Date());
        setSelectedCourse("");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        console.error("Server action failed:", result);
        toast.error("Error adding round", {
          description:
            result?.error || "Please try again or check your input values.",
        });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Error adding round", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Add Round</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <Card className="w-fit">
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date > new Date()}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Round Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                {/* Course Selection */}
                <div className="space-y-2">
                  <Label htmlFor="courseId">Course</Label>
                  {loading ? (
                    <div className="h-10 bg-muted animate-pulse rounded-md"></div>
                  ) : (
                    <CourseCombobox
                      courses={courses}
                      value={selectedCourse}
                      onChange={setSelectedCourse}
                    />
                  )}
                  <div className="text-xs text-muted-foreground text-right">
                    <a
                      href="/courses"
                      className=" hover:underline text-muted-foreground"
                    >
                      Manage courses
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scoringAverage">Scoring Average</Label>
                  <Input
                    id="scoringAverage"
                    name="scoringAverage"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 72"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fairwaysHit">Fairways Hit</Label>
                  <Input
                    id="fairwaysHit"
                    name="fairwaysHit"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greensInRegulation">
                    Greens in Regulation
                  </Label>
                  <Input
                    id="greensInRegulation"
                    name="greensInRegulation"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 14"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upAndDownPercentage">
                    Up & Down Percentage
                  </Label>
                  <Input
                    id="upAndDownPercentage"
                    name="upAndDownPercentage"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 75"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="puttsPerRound">Putts per Round</Label>
                  <Input
                    id="puttsPerRound"
                    name="puttsPerRound"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 32"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strokesGained">Strokes Gained vs Pro</Label>
                  <Input
                    id="strokesGained"
                    name="strokesGained"
                    type="number"
                    step="0.1"
                    placeholder="e.g., -1.8"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Round..." : "Add Round"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
