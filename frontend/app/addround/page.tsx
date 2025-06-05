import { TopBar } from "@/components/top-bar";
import { AddRoundForm } from "@/components/add-round-form";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* NOTE: TopBar with same styling as main page */}
      <div className="h-14 border-b bg-background">
        <TopBar />
      </div>
      {/* NOTE: Main content area without side menu - just the AddRoundForm */}
      <main className="flex-1 overflow-auto bg-background pl-2 pt-3 sm:pl-16 md:pl-32 lg:pl-48 xl:pl-64">
        <AddRoundForm />
      </main>
    </div>
  );
}
