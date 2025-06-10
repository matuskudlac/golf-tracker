import { getPracticeDrillsFromDB } from "@/lib/practice-database";
import { PracticeOverviewClient } from "./practice-overview-client";

// This is a SERVER component that fetches data from database
export async function PracticeOverviewDB() {
  try {
    console.log("PracticeOverviewDB: Starting to fetch practice drills...");
    const drills = await getPracticeDrillsFromDB();
    console.log(
      "PracticeOverviewDB: Practice drills fetched successfully:",
      drills.length
    );

    return <PracticeOverviewClient drills={drills} />;
  } catch (error) {
    console.error("PracticeOverviewDB: Error fetching practice drills:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return (
      <div className="pt-3 pb-6 px-6 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Practice Drills</h1>
        <div className="p-8 border border-red-300 rounded-lg bg-red-50">
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Error Loading Practice Drills
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
