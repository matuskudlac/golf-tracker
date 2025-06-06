import { StatCard } from "./stat-card";
import { InteractiveChartsDB } from "./interactive-charts-db";
import { getGolfDataFromDB } from "@/lib/golf-data-db";

// This is a SERVER component
export async function DashboardDB() {
  try {
    console.log("DashboardDB: Starting to fetch golf data...");
    const golfData = await getGolfDataFromDB();
    console.log("DashboardDB: Golf data fetched successfully:", {
      currentStats: golfData.current,
      roundsCount: golfData.rounds.length,
    });

    return (
      <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Scoring Average"
            value={golfData.current.scoringAverage || 0}
            change={golfData.changes.scoringAverage || 0}
            statType="lower-better"
          />
          <StatCard
            title="Fairways Hit"
            value={golfData.current.fairwaysHit || 0}
            change={golfData.changes.fairwaysHit || 0}
            statType="higher-better"
          />
          <StatCard
            title="Greens in Regulation"
            value={golfData.current.greensInRegulation || 0}
            change={golfData.changes.greensInRegulation || 0}
            statType="higher-better"
          />
          <StatCard
            title="Up & Downs"
            value={`${golfData.current.upAndDownPercentage || 0}%`}
            change={golfData.changes.upAndDownPercentage || 0}
            statType="higher-better"
          />
          <StatCard
            title="Putts per Round"
            value={golfData.current.puttsPerRound || 0}
            change={golfData.changes.puttsPerRound || 0}
            statType="lower-better"
          />
          <StatCard
            title="Strokes Gained"
            value={golfData.current.strokesGained || 0}
            change={golfData.changes.strokesGained || 0}
            changeLabel="strokes gained this month"
            statType="higher-better"
          />
        </div>

        <div className="space-y-8">
          {/* Pass the rounds data directly to the client component */}
          <InteractiveChartsDB rounds={golfData.rounds} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("DashboardDB: Error fetching golf data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return (
      <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="p-8 border border-red-300 rounded-lg bg-red-50">
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-600">{errorMessage}</p>
          <p className="text-sm text-gray-600 mt-2">
            Check the server console for more details.
          </p>
        </div>
      </div>
    );
  }
}
