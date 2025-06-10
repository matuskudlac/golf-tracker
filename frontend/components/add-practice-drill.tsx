"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addPracticeDrill } from "@/lib/practice-data";

export function AddPracticeDrill() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scoreType: "individual" as "individual" | "final",
    targetShots: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a drill name");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a drill description");
      return;
    }

    const targetShots = Number.parseInt(formData.targetShots);
    if (isNaN(targetShots) || targetShots < 1 || targetShots > 100) {
      toast.error("Please enter a valid number of shots (1-100)");
      return;
    }

    setIsSubmitting(true);

    try {
      await addPracticeDrill({
        name: formData.name.trim(),
        description: formData.description.trim(),
        scoreType: formData.scoreType,
        targetShots: targetShots,
      });

      toast.success("Practice drill created successfully!");
      router.push("/practice");
    } catch (error) {
      console.error("Error creating drill:", error);
      toast.error("Failed to create practice drill");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-3 pb-6 px-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Add Practice Drill</h1>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Practice Drill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Drill Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., 50-Yard Wedge Accuracy"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the drill, how to perform it, and how scoring works..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetShots">Number of Shots</Label>
                <Input
                  id="targetShots"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.targetShots}
                  onChange={(e) =>
                    handleInputChange("targetShots", e.target.value)
                  }
                  placeholder="e.g., 10"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Scoring Method</Label>
                <RadioGroup
                  value={formData.scoreType}
                  onValueChange={(value) =>
                    handleInputChange("scoreType", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="font-normal">
                      Individual Shot Scores
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Track the score for each individual shot (e.g., distance
                    from target, accuracy rating)
                  </p>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="final" id="final" />
                    <Label htmlFor="final" className="font-normal">
                      Final Score Only
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Track only the final result (e.g., number of successful
                    shots, total points)
                  </p>
                </RadioGroup>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/practice")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Creating..." : "Create Drill"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
