"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Plus, TrendingUp, TrendingDown, Calendar, Target } from "lucide-react";
import {
  getPracticeDrill,
  getDrillSessions,
  type PracticeDrill,
  type DrillSession,
} from "@/lib/practice-data";
import Link from "next/link";
import { toast } from "sonner";

interface DrillPerformanceProps {
  drillId: number;
}

export function DrillPerformance({ drillId }: DrillPerformanceProps) {
  const [drill, setDrill] = useState<PracticeDrill | null>(null);
  const [sessions, setSessions] = useState<DrillSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [drillData, sessionsData] = await Promise.all([
          getPracticeDrill(drillId),
          getDrillSessions(drillId),
        ]);

        setDrill(drillData);
        setSessions(sessionsData);
      } catch (error) {
        console.error("Error loading drill data:", error);
        toast.error("Failed to load drill data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [drillId]);

  if (loading) {
    return (
      <div className="pt-3 pb-6 px-6 space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
        </div>
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
          <Link href="/practice">
            <Button className="mt-4">Back to Practice</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Calculate performance data for charts
  const chartData = sessions
    .map((session, index) => {
      let score: number;
      if (drill.scoreType === "individual") {
        // Calculate average score for individual shots
        score = session.scores
          ? session.scores.reduce((a, b) => a + b, 0) / session.scores.length
          : 0;
      } else {
        // Use final score
        score = session.finalScore || 0;
      }

      return {
        session: index + 1,
        date: new Date(session.date).toLocaleDateString(),
        score: Math.round(score * 100) / 100,
        fullDate: session.date,
      };
    })
    .sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
    );

  // Calculate trend
  const trend =
    chartData.length >= 2
      ? chartData[chartData.length - 1].score - chartData[0].score
      : 0;

  const chartConfig = {
    score: {
      label: drill.scoreType === "individual" ? "Average Score" : "Final Score",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="pt-3 pb-6 px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{drill.name}</h1>
          <p className="text-muted-foreground">{drill.description}</p>
        </div>
        <Link href={`/practice/${drill.id}/session`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No practice sessions yet</p>
                  <p className="text-sm">
                    Complete your first session to see performance data
                  </p>
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(label) => `Date: ${label}`}
                          formatter={(value) => [
                            `${value}`,
                            drill.scoreType === "individual"
                              ? "Avg Score"
                              : "Final Score",
                          ]}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-score)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-score)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Stats and Recent Sessions */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Sessions
                </span>
                <span className="font-semibold">{sessions.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Shots per Session
                </span>
                <Badge variant="secondary">{drill.targetShots}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Score Type
                </span>
                <Badge variant="outline">
                  {drill.scoreType === "individual" ? "Individual" : "Final"}
                </Badge>
              </div>

              {chartData.length >= 2 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trend</span>
                  <div className="flex items-center gap-1">
                    {trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : trend < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        trend > 0
                          ? "text-green-500"
                          : trend < 0
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {trend > 0 ? "+" : ""}
                      {trend.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sessions yet
                </p>
              ) : (
                <div className="space-y-3">
                  {sessions
                    .slice(-5)
                    .reverse()
                    .map((session) => {
                      let displayScore: string;
                      if (drill.scoreType === "individual") {
                        const avg = session.scores
                          ? session.scores.reduce((a, b) => a + b, 0) /
                            session.scores.length
                          : 0;
                        displayScore = `${avg.toFixed(1)} avg`;
                      } else {
                        displayScore = `${session.finalScore || 0}/${
                          drill.targetShots
                        }`;
                      }

                      return (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(session.date).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {displayScore}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
