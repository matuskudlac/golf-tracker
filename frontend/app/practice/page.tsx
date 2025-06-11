import { Suspense } from "react";
import { TopBar } from "@/components/top-bar";
import { SideMenu } from "@/components/side-menu";
import { PracticeOverviewDB } from "@/components/practice-overview-db";

function PracticeLoading() {
  return (
    <div className="pt-3 pb-6 px-6 space-y-4 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-48" />
        <div className="h-10 bg-gray-200 animate-pulse rounded-md w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-14 border-b bg-background">
        <TopBar />
      </div>
      <div className="flex-1 flex bg-background">
        <div className="pl-2 pt-3 sm:pl-8 md:pl-16 lg:pl-24 xl:pl-32">
          <SideMenu />
        </div>
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<PracticeLoading />}>
            <PracticeOverviewDB />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
