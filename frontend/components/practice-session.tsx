"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getPracticeDrill,
  addDrillSession,
  type PracticeDrill,
} from "@/lib/practice-data";
import { Trash2, Plus } from "lucide-react";
// Import the new DatePickerCard component
import { DatePickerCard } from "@/components/date-picker-card";

interface PracticeSessionProps {
  drillId: number;
}

export function PracticeSession({ drillId }: PracticeSessionProps) {
  const router = useRouter();
  const [drill, setDrill] = useState<PracticeDrill | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [scores, setScores] = useState<string[]>([]);
  const [finalScore, setFinalScore] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadDrill() {
      try {
        const drillData = await getPracticeDrill(drillId);
        setDrill(drillData);

        if (drillData?.scoreType === "individual") {
          // Initialize individual score inputs
          setScores(new Array(drillData.targetShots).fill(""));
        }
      } catch (error) {
        console.error("Error loading drill:", error);
        toast.error("Failed to load drill data");
      } finally {
        setLoading(false);
      }
    }

    loadDrill();
  }, [drillId]);

  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  const addScoreInput = () => {
    if (scores.length < 50) {
      // Reasonable limit
      setScores([...scores, ""]);
    }
  };

  const removeScoreInput = (index: number) => {
    if (scores.length > 1) {
      const newScores = scores.filter((_, i) => i !== index);
      setScores(newScores);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (!drill) {
      toast.error("Drill data not loaded");
      return;
    }

    const sessionData: any = {
      drillId: drill.id,
      date: selectedDate.toISOString().split("T")[0],
      notes: notes.trim() || undefined,
    };

    if (drill.scoreType === "individual") {
      // Validate individual scores
      const numericScores = scores
        .map((s) => Number.parseFloat(s))
        .filter((s) => !isNaN(s));
      if (numericScores.length === 0) {
        toast.error("Please enter at least one score");
        return;
      }
      sessionData.scores = numericScores;
    } else {
      // Validate final score
      const finalScoreNum = Number.parseFloat(finalScore);
      if (isNaN(finalScoreNum)) {
        toast.error("Please enter a valid final score");
        return;
      }
      sessionData.finalScore = finalScoreNum;
    }

    setIsSubmitting(true);

    try {
      await addDrillSession(sessionData);
      toast.success("Practice session recorded successfully!");
      router.push(`/practice/${drill.id}`);
    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Failed to save practice session");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-3 pb-6 px-6 space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-64" />
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!drill) {
    return (
      <div className="pt-3 pb-6 px-6">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold">Drill Not Found</h3>
          <p className="text-muted-foreground">
            The requested practice drill could not be found.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-3 pb-6 px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Practice Session</h1>
        <p className="text-muted-foreground">{drill.name}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Date Selection */}
        <div className="flex-shrink-0">
          <DatePickerCard
            title="Session Date"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date > new Date()}
          />
        </div>

        {/* Score Entry */}
        <div className="flex-1 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Record Scores</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{drill.targetShots} shots</Badge>
                  <Badge variant="outline">
                    {drill.scoreType === "individual"
                      ? "Individual Scores"
                      : "Final Score"}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {drill.description}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {drill.scoreType === "individual" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Individual Shot Scores</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addScoreInput}
                        disabled={scores.length >= 50}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Shot
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {scores.map((score, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1">
                            <Label
                              htmlFor={`score-${index}`}
                              className="text-xs"
                            >
                              Shot {index + 1}
                            </Label>
                            <Input
                              id={`score-${index}`}
                              type="number"
                              step="0.1"
                              value={score}
                              onChange={(e) =>
                                handleScoreChange(index, e.target.value)
                              }
                              placeholder="0"
                              className="text-center"
                            />
                          </div>
                          {scores.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeScoreInput(index)}
                              className="text-red-500 hover:text-red-700 mt-5"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="finalScore">Final Score</Label>
                    <Input
                      id="finalScore"
                      type="number"
                      step="0.1"
                      value={finalScore}
                      onChange={(e) => setFinalScore(e.target.value)}
                      placeholder={`e.g., out of ${drill.targetShots}`}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any observations, conditions, or thoughts about this session..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/practice/${drill.id}`)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Saving..." : "Save Session"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
