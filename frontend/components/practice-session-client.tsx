"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addPracticeSessionAction } from "@/app/practice-actions";
import { Trash2, Plus } from "lucide-react";
import { DatePickerCard } from "@/components/date-picker-card";
import type { DatabasePracticeDrill } from "@/lib/practice-database";

interface PracticeSessionClientProps {
  drill: DatabasePracticeDrill;
}

export function PracticeSessionClient({ drill }: PracticeSessionClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [scores, setScores] = useState<string[]>(
    drill.score_type === "individual"
      ? new Array(drill.target_shots).fill("")
      : []
  );
  const [finalScore, setFinalScore] = useState("");
  const [notes, setNotes] = useState("");

  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  const addScoreInput = () => {
    if (scores.length < 50) {
      setScores([...scores, ""]);
    }
  };

  const removeScoreInput = (index: number) => {
    if (scores.length > 1) {
      const newScores = scores.filter((_, i) => i !== index);
      setScores(newScores);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    // Validation based on drill type
    if (drill.score_type === "individual") {
      const numericScores = scores
        .map((s) => Number.parseFloat(s))
        .filter((s) => !isNaN(s));
      if (numericScores.length === 0) {
        toast.error("Please enter at least one score");
        return;
      }
    } else {
      // Final score validation
      const finalScoreNum = Number.parseFloat(finalScore);
      if (isNaN(finalScoreNum)) {
        toast.error("Please enter a valid final score");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("drillId", drill.id.toString());
      formData.append("date", selectedDate.toISOString().split("T")[0]);
      formData.append("scoreType", drill.score_type);
      formData.append("notes", notes);

      if (drill.score_type === "individual") {
        const numericScores = scores
          .map((s) => Number.parseFloat(s))
          .filter((s) => !isNaN(s));
        formData.append("scores", JSON.stringify(numericScores));
      } else {
        formData.append("finalScore", finalScore);
      }

      console.log("Submitting practice session:", {
        drillId: drill.id,
        date: selectedDate.toISOString().split("T")[0],
        scoreType: drill.score_type,
        finalScore: drill.score_type === "final" ? finalScore : undefined,
        scores: drill.score_type === "individual" ? scores : undefined,
        notes,
      });

      const result = await addPracticeSessionAction(formData);

      if (result.success) {
        toast.success("Practice session recorded successfully!");
        router.push(`/practice/${drill.id}`);
      } else {
        console.error("Server action failed:", result);
        toast.error("Failed to save practice session", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Failed to save practice session");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <Badge variant="secondary">{drill.target_shots} shots</Badge>
                  <Badge variant="outline">
                    {drill.score_type === "individual"
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
                {drill.score_type === "individual" ? (
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
                      placeholder={`e.g., out of ${drill.target_shots}`}
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
