import { Suspense } from "react";
import { TopBar } from "@/components/top-bar";
import { SideMenu } from "@/components/side-menu";
import { AddPracticeDrillDB } from "@/components/add-practice-drill-db";

function AddDrillLoading() {
  return (
    <div className="pt-3 pb-6 px-6 space-y-6">
      <div className="h-8 bg-gray-200 animate-pulse rounded-md w-48" />
      <div className="max-w-2xl">
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

export default function AddPracticeDrillPage() {
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
          <Suspense fallback={<AddDrillLoading />}>
            <AddPracticeDrillDB />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
