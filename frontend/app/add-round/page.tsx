import { Suspense } from "react";
import { TopBar } from "@/components/top-bar";
import { AddRoundForm } from "@/components/add-round-form-db";
import { SideMenu } from "@/components/side-menu";

// Loading component for Suspense
function AddRoundLoading() {
  return (
    <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Add Round</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar placeholder */}
        <div className="flex-shrink-0">
          <div className="w-[300px] h-[350px] bg-gray-200 animate-pulse rounded-lg" />
        </div>

        {/* Form placeholder */}
        <div className="flex-1 max-w-md">
          <div className="h-[500px] bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function AddRound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-14 border-b bg-background">
        <TopBar />
      </div>
      <div className="flex-1 flex bg-background">
        <div className="pl-2 pt-3 sm:pl-8 md:pl-16 lg:pl-24 xl:pl-32">
          <SideMenu />
        </div>
        <main className="flex-1 overflow-auto pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32">
          <Suspense fallback={<AddRoundLoading />}>
            <AddRoundForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
