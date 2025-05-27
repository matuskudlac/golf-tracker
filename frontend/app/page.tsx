import { SiteHeaderNavigation } from "@/components/site-header-navigation";
import { InteractiveAvatar } from "@/components/interactive-avatar";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-5 font-[family-name:var(--font-geist-sans)]">
      <div className="relative flex w-full justify-center">
        <SiteHeaderNavigation />

        <div className="absolute right-32 top-1/2 -translate-y-1/2">
          <InteractiveAvatar />
        </div>
      </div>
    </div>
  );
}
