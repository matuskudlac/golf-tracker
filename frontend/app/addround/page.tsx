import { TopBar } from "@/components/top-bar";
import { AddRoundFormDB } from "@/components/add-round-form-db";

export default function AddRound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-14 border-b bg-background">
        <TopBar />
      </div>
      <main className="flex-1 overflow-auto bg-background pl-4 pt-3 sm:pl-16 md:pl-32 lg:pl-48 xl:pl-64">
        <AddRoundFormDB />
      </main>
    </div>
  );
}
