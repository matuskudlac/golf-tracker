import { Suspense } from "react";
import { TopBar } from "@/components/top-bar";
import { SideMenu } from "@/components/side-menu";
import { DashboardDB } from "@/components/dashboard-db";

// Loading component for Suspense
function DashboardLoading() {
  return (
    <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );
}

export default function Home() {
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
          <Suspense fallback={<DashboardLoading />}>
            <DashboardDB />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
