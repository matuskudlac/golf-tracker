"use client";

import { useEffect, useState } from "react";
import { StatCard } from "./stat-card";
import { InteractiveCharts } from "./interactive-charts";
import { getGolfData, type GolfStats } from "@/lib/golf-data";

export function Dashboard() {
  // NOTE: Use state to store golf data and update when localStorage changes
  const [golfData, setGolfData] = useState<GolfStats | null>(null);

  // NOTE: Load data on component mount and set up storage listener
  useEffect(() => {
    const loadData = () => {
      setGolfData(getGolfData());
    };

    loadData();

    // NOTE: Listen for storage changes to update data when new rounds are added
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);

    // NOTE: Also listen for custom events when data is updated in the same tab
    window.addEventListener("golfDataUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("golfDataUpdated", handleStorageChange);
    };
  }, []);

  // NOTE: Show loading state while data is being loaded
  if (!golfData) {
    return (
      <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }
  return (
    <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Scoring Average"
          value={golfData.current.scoringAverage}
          change={golfData.changes.scoringAverage}
        />
        <StatCard
          title="Fairways Hit"
          value={golfData.current.fairwaysHit}
          change={golfData.changes.fairwaysHit}
        />
        <StatCard
          title="Greens in Reg."
          value={golfData.current.greensInRegulation}
          change={golfData.changes.greensInRegulation}
        />
        <StatCard
          title="Up & Downs"
          value={`${golfData.current.upAndDownPercentage}%`}
          change={golfData.changes.upAndDownPercentage}
        />
        <StatCard
          title="Putts per Round"
          value={golfData.current.puttsPerRound}
          change={golfData.changes.puttsPerRound}
        />
        <StatCard
          title="Strokes Gained"
          value={golfData.current.strokesGained}
          change={golfData.changes.strokesGained}
          changeLabel="strokes gained this month"
        />
      </div>

      <InteractiveCharts />
    </div>
  );
}
