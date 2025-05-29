import { TopBar } from "@/components/top-bar";
import { SideMenu } from "@/components/side-menu";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-14 border-b-1">
        <TopBar />
      </div>
      <div className="flex-1 flex">
        <div className="pl-2 pt-3 sm:pl-8 md:pl-16 lg:pl-24 xl:pl-32">
          <SideMenu />
        </div>
        <main className="flex-1 overflow-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
