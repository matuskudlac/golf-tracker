import { SiteHeaderNavigation } from "./site-header-navigation";
import { InteractiveAvatar } from "./interactive-avatar";
import { Bell } from "lucide-react";
import { SearchBar } from "./search-bar";
import { InteractiveBellNotifications } from "./interactive-bell-notifications";
import { ThemeToggle } from "./theme-toggle";

export function TopBar() {
  return (
    <div className="min-h-screen p-8 sm:p-5 font-[family-name:var(--font-geist-sans)]">
      <div className="relative flex w-full justify-center">
        <div className="absolute left-2 top-1 sm:left-8 sm:top-2 md:left-16 lg:left-24 xl:left-32 -translate-y-1/2">
          <SiteHeaderNavigation />
        </div>
        <div className="absolute right-52 lg:right-60 xl:right-68 top-1 sm:top-2 -translate-y-1/2 hidden lg:block">
          <SearchBar />
        </div>
        <div className="absolute right-28 sm:right-32 md:right-40 lg:right-48 xl:right-56 top-1 sm:top-2 -translate-y-1/2 hidden sm:block">
          <ThemeToggle />
        </div>
        <div className="absolute right-18 sm:right-22 md:right-30 lg:right-38 xl:right-46 top-2 -translate-y-1/2 hidden sm:block">
          <InteractiveBellNotifications />
        </div>
        <div className="absolute right-2 top-1 sm:right-8 sm:top-2 md:right-16 lg:right-24 xl:right-32 -translate-y-1/2">
          <InteractiveAvatar />
        </div>
      </div>
    </div>
  );
}
