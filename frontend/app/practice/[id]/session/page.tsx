import { Suspense } from "react";
import { TopBar } from "@/components/top-bar";
import { SideMenu } from "@/components/side-menu";
import { PracticeSessionDB } from "@/components/practice-session-db";

function PracticeSessionLoading() {
  return (
    <div className="pt-3 pb-6 px-6 space-y-6">
      <div className="h-8 bg-gray-200 animate-pulse rounded-md w-64" />
      <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );
}

export default async function PracticeSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drillId = Number.parseInt(id);

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
          <Suspense fallback={<PracticeSessionLoading />}>
            <PracticeSessionDB drillId={drillId} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
