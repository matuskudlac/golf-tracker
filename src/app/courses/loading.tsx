import { Skeleton } from "@/components/ui/skeleton"
import {
  Navbar,
  NavBody,
  NavbarLogo,
  MobileNav,
  MobileNavHeader,
} from '@/components/ui/resizable-navbar'

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar Skeleton */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          {/* Centered Nav Items Skeleton */}
          <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-6 lg:flex">
             {[1, 2, 3, 4].map((i) => (
               <Skeleton key={i} className="h-4 w-20" />
             ))}
          </div>
          {/* Right User Menu Skeleton */}
          <Skeleton className="h-8 w-8 rounded-full" />
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
          </MobileNavHeader>
        </MobileNav>
      </Navbar>

      {/* Main Content Skeleton */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* Title: Courses */}
            <Skeleton className="h-9 w-32 mb-2" />
            {/* Subtitle: Manage your golf courses */}
            <Skeleton className="h-5 w-48" />
          </div>
          {/* Add Course Button */}
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Search Bar (Right Aligned) */}
        <div className="flex justify-end mb-4">
          <Skeleton className="h-10 w-72" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-md border bg-white">
          {/* Table Header */}
          <div className="border-b h-12 px-4 flex items-center">
            {/* Course Name */}
            <div className="w-[250px]"><Skeleton className="h-4 w-24" /></div>
            {/* Location */}
            <div className="w-[180px] flex justify-center"><Skeleton className="h-4 w-16" /></div>
            {/* Tee Color */}
            <div className="w-[100px] flex justify-center"><Skeleton className="h-4 w-16" /></div>
            {/* Last Played */}
            <div className="w-[120px] flex justify-center"><Skeleton className="h-4 w-20" /></div>
            {/* Holes */}
            <div className="w-[80px] flex justify-center"><Skeleton className="h-4 w-12" /></div>
            {/* Actions */}
            <div className="w-[60px]"></div>
          </div>

          {/* Table Body - 5 Fake Rows */}
          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 px-4 flex items-center">
                {/* Course Name */}
                <div className="w-[250px]"><Skeleton className="h-5 w-48" /></div>
                {/* Location */}
                <div className="w-[180px] flex justify-center"><Skeleton className="h-4 w-32" /></div>
                {/* Tee Color */}
                <div className="w-[100px] flex justify-center"><Skeleton className="h-4 w-12" /></div>
                {/* Last Played */}
                <div className="w-[120px] flex justify-center"><Skeleton className="h-4 w-24" /></div>
                {/* Holes */}
                <div className="w-[80px] flex justify-center"><Skeleton className="h-6 w-8" /></div>
                {/* Actions */}
                <div className="w-[60px] flex justify-end"><Skeleton className="h-8 w-8 rounded-full" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center space-x-2 py-4">
            <Skeleton className="h-9 w-24" /> {/* Previous */}
            <Skeleton className="h-9 w-9" />  {/* Page 1 */}
            <Skeleton className="h-9 w-24" /> {/* Next */}
        </div>
      </main>
    </div>
  )
}
