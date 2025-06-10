import { TopBar } from "@/components/top-bar";
import { AddRoundForm } from "@/components/add-round-form-db";
import { SideMenu } from "@/components/side-menu";

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
        <main className="flex-1 overflow-auto bg-background">
          <AddRoundForm />
        </main>
      </div>
    </div>
  );
}
