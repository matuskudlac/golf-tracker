"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, TrendingUp, Calendar, Trash2 } from "lucide-react";
import { deletePracticeDrillAction } from "@/app/practice-actions";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { DatabasePracticeDrill } from "@/lib/practice-database";

interface PracticeOverviewClientProps {
  drills: DatabasePracticeDrill[];
}

export function PracticeOverviewClient({
  drills: initialDrills,
}: PracticeOverviewClientProps) {
  const router = useRouter();
  const [drills, setDrills] = useState(initialDrills);

  const handleDeleteDrill = async (id: number) => {
    try {
      const result = await deletePracticeDrillAction(id);
      if (result.success) {
        setDrills(drills.filter((drill) => drill.id !== id));
        toast.success("Practice drill deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete practice drill");
      }
    } catch (error) {
      console.error("Error deleting drill:", error);
      toast.error("Failed to delete practice drill");
    }
  };

  return (
    <div className="pt-3 pb-6 px-6 space-y-3 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Practice Drills</h1>
        <Link href="/practice/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Drill
          </Button>
        </Link>
      </div>

      {drills.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Target className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No Practice Drills Yet</h3>
              <p className="text-muted-foreground">
                Create your first practice drill to start tracking your
                improvement.
              </p>
            </div>
            <Link href="/practice/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Drill
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drills.map((drill) => (
            <Card
              key={drill.id}
              className="hover:shadow-md transition-shadow flex flex-col"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{drill.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {drill.target_shots} shots
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {drill.score_type === "individual"
                          ? "Individual Scores"
                          : "Final Score"}
                      </Badge>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Practice Drill
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{drill.name}"? This
                          will also delete all associated practice sessions.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDrill(drill.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete Drill
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
                  {drill.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Created {new Date(drill.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <Link href={`/practice/${drill.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Progress
                    </Button>
                  </Link>
                  <Link href={`/practice/${drill.id}/session`}>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Practice
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
