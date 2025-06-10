"use client";

import type React from "react";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGolfData, saveGolfData } from "@/lib/golf-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AddRoundFormb() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NOTE: State for all golf statistics we track
  const [formData, setFormData] = useState({
    scoringAverage: "",
    fairwaysHit: "",
    greensInRegulation: "",
    upAndDownPercentage: "",
    puttsPerRound: "",
    strokesGained: "",
  });

  // NOTE: Handle input changes for all form fields
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // NOTE: Handle form submission with localStorage persistence
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error("Please select a date for the round");
      return;
    }

    // NOTE: Validate that all fields are filled
    const requiredFields = Object.entries(formData);
    const emptyFields = requiredFields.filter(([_, value]) => value === "");

    if (emptyFields.length > 0) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // NOTE: Get current data from localStorage
      const currentData = getGolfData();

      // NOTE: Create round data object with proper types
      const roundData = {
        date: selectedDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        scoringAverage: Number.parseFloat(formData.scoringAverage),
        fairwaysHit: Number.parseFloat(formData.fairwaysHit),
        greensInRegulation: Number.parseFloat(formData.greensInRegulation),
        upAndDownPercentage: Number.parseFloat(formData.upAndDownPercentage),
        puttsPerRound: Number.parseFloat(formData.puttsPerRound),
        strokesGained: Number.parseFloat(formData.strokesGained),
      };

      // NOTE: Add the new round to the beginning of the rounds array
      currentData.rounds.unshift(roundData);

      // NOTE: Recalculate current averages based on last 10 rounds
      const recentRounds = currentData.rounds.slice(0, 10);
      const avg = (arr: number[]) =>
        arr.reduce((a, b) => a + b, 0) / arr.length;

      const newCurrent = {
        scoringAverage:
          Math.round(avg(recentRounds.map((r) => r.scoringAverage)) * 10) / 10,
        fairwaysHit:
          Math.round(avg(recentRounds.map((r) => r.fairwaysHit)) * 10) / 10,
        greensInRegulation:
          Math.round(avg(recentRounds.map((r) => r.greensInRegulation)) * 10) /
          10,
        upAndDownPercentage:
          Math.round(avg(recentRounds.map((r) => r.upAndDownPercentage)) * 10) /
          10,
        puttsPerRound:
          Math.round(avg(recentRounds.map((r) => r.puttsPerRound)) * 10) / 10,
        strokesGained:
          Math.round(avg(recentRounds.map((r) => r.strokesGained)) * 10) / 10,
      };

      // NOTE: Calculate changes compared to previous 10 rounds
      const previousRounds = currentData.rounds.slice(10, 20);
      if (previousRounds.length > 0) {
        const previousCurrent = {
          scoringAverage: avg(previousRounds.map((r) => r.scoringAverage)),
          fairwaysHit: avg(previousRounds.map((r) => r.fairwaysHit)),
          greensInRegulation: avg(
            previousRounds.map((r) => r.greensInRegulation)
          ),
          upAndDownPercentage: avg(
            previousRounds.map((r) => r.upAndDownPercentage)
          ),
          puttsPerRound: avg(previousRounds.map((r) => r.puttsPerRound)),
          strokesGained: avg(previousRounds.map((r) => r.strokesGained)),
        };

        currentData.changes = {
          scoringAverage:
            Math.round(
              (newCurrent.scoringAverage - previousCurrent.scoringAverage) * 10
            ) / 10,
          fairwaysHit:
            Math.round(
              (newCurrent.fairwaysHit - previousCurrent.fairwaysHit) * 10
            ) / 10,
          greensInRegulation:
            Math.round(
              (newCurrent.greensInRegulation -
                previousCurrent.greensInRegulation) *
                10
            ) / 10,
          upAndDownPercentage:
            Math.round(
              (newCurrent.upAndDownPercentage -
                previousCurrent.upAndDownPercentage) *
                10
            ) / 10,
          puttsPerRound:
            Math.round(
              (newCurrent.puttsPerRound - previousCurrent.puttsPerRound) * 10
            ) / 10,
          strokesGained:
            Math.round(
              (newCurrent.strokesGained - previousCurrent.strokesGained) * 10
            ) / 10,
        };
      }

      // NOTE: Update current stats
      currentData.current = newCurrent;

      // NOTE: Save updated data to localStorage
      saveGolfData(currentData);

      // NOTE: Reset form
      setFormData({
        scoringAverage: "",
        fairwaysHit: "",
        greensInRegulation: "",
        upAndDownPercentage: "",
        puttsPerRound: "",
        strokesGained: "",
      });
      setSelectedDate(new Date());

      // NOTE: Show success toast instead of alert
      toast.success("Round added successfully!", {
        description: `Your round from ${selectedDate.toLocaleDateString()} has been saved.`,
        duration: 3000,
      });

      // NOTE: Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Error adding round:", error);
      // NOTE: Show error toast instead of alert
      toast.error("Error adding round", {
        description: "Please try again or check your input values.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-6">
      {/* NOTE: Title with same styling as Dashboard but positioned to the left */}
      <h1 className="text-2xl font-bold tracking-tight">Add Round</h1>

      <div className="flex gap-8">
        {/* NOTE: Left side - Calendar component under the title */}
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
                disabled={(date) => date > new Date()} // NOTE: Disable future dates
              />
            </CardContent>
          </Card>
        </div>

        {/* NOTE: Right side - Input fields for all statistics */}
        <div className="flex-1 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Round Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* NOTE: Scoring Average input */}
                <div className="space-y-2">
                  <Label htmlFor="scoringAverage">Scoring Average</Label>
                  <Input
                    id="scoringAverage"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 72"
                    value={formData.scoringAverage}
                    onChange={(e) =>
                      handleInputChange("scoringAverage", e.target.value)
                    }
                    required
                  />
                </div>

                {/* NOTE: Fairways Hit input */}
                <div className="space-y-2">
                  <Label htmlFor="fairwaysHit">Fairways Hit</Label>
                  <Input
                    id="fairwaysHit"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 12"
                    value={formData.fairwaysHit}
                    onChange={(e) =>
                      handleInputChange("fairwaysHit", e.target.value)
                    }
                    required
                  />
                </div>

                {/* NOTE: Greens in Regulation input */}
                <div className="space-y-2">
                  <Label htmlFor="greensInRegulation">
                    Greens in Regulation
                  </Label>
                  <Input
                    id="greensInRegulation"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 14"
                    value={formData.greensInRegulation}
                    onChange={(e) =>
                      handleInputChange("greensInRegulation", e.target.value)
                    }
                    required
                  />
                </div>

                {/* NOTE: Up and Down Percentage input */}
                <div className="space-y-2">
                  <Label htmlFor="upAndDownPercentage">
                    Up & Down Percentage
                  </Label>
                  <Input
                    id="upAndDownPercentage"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 75"
                    value={formData.upAndDownPercentage}
                    onChange={(e) =>
                      handleInputChange("upAndDownPercentage", e.target.value)
                    }
                    required
                  />
                </div>

                {/* NOTE: Putts per Round input */}
                <div className="space-y-2">
                  <Label htmlFor="puttsPerRound">Putts per Round</Label>
                  <Input
                    id="puttsPerRound"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 32"
                    value={formData.puttsPerRound}
                    onChange={(e) =>
                      handleInputChange("puttsPerRound", e.target.value)
                    }
                    required
                  />
                </div>

                {/* NOTE: Strokes Gained input */}
                <div className="space-y-2">
                  <Label htmlFor="strokesGained">Strokes Gained vs Pro</Label>
                  <Input
                    id="strokesGained"
                    type="number"
                    step="0.1"
                    placeholder="e.g., -1.8"
                    value={formData.strokesGained}
                    onChange={(e) =>
                      handleInputChange("strokesGained", e.target.value)
                    }
                    required
                  />
                </div>

                {/* NOTE: Submit button */}
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
