import {
  getPracticeDrillFromDB,
  getPracticeSessionsFromDB,
} from "@/lib/practice-database";
import { DrillPerformanceClient } from "./drill-performance-client";

interface DrillPerformanceDBProps {
  drillId: number;
}

export async function DrillPerformanceDB({ drillId }: DrillPerformanceDBProps) {
  try {
    console.log("DrillPerformanceDB: Starting to fetch drill data...");
    const [drill, sessions] = await Promise.all([
      getPracticeDrillFromDB(drillId),
      getPracticeSessionsFromDB(drillId),
    ]);

    console.log("DrillPerformanceDB: Data fetched successfully:", {
      drill: drill?.name,
      sessionsCount: sessions.length,
    });

    if (!drill) {
      return (
        <div className="pt-3 pb-6 px-6">
          <div className="p-8 border border-red-300 rounded-lg bg-red-50 text-center">
            <h3 className="text-lg font-semibold text-red-700">
              Drill Not Found
            </h3>
            <p className="text-red-600">
              The requested practice drill could not be found.
            </p>
          </div>
        </div>
      );
    }

    return <DrillPerformanceClient drill={drill} sessions={sessions} />;
  } catch (error) {
    console.error("DrillPerformanceDB: Error fetching drill data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return (
      <div className="pt-3 pb-6 px-6 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Practice Drill</h1>
        <div className="p-8 border border-red-300 rounded-lg bg-red-50">
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Error Loading Drill Data
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
