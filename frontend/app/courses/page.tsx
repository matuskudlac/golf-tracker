import { Suspense } from "react";
import { TopBar } from "@/components/top-bar";
import { CourseManagement } from "@/components/course-management";
import { SideMenu } from "@/components/side-menu";

// Loading component for Suspense
function CoursesLoading() {
  return (
    <div className="pt-3 pb-6 px-6 pr-2 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-32 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Course Form placeholder */}
        <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg" />

        {/* Course List placeholder */}
        <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

export default function CoursesPage() {
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
          <Suspense fallback={<CoursesLoading />}>
            <CourseManagement />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
