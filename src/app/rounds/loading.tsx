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
            {/* Title: Rounds */}
            <Skeleton className="h-9 w-32 mb-2" />
            {/* Subtitle: Track and manage... */}
            <Skeleton className="h-5 w-56" />
          </div>
          {/* Add Round Button */}
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Filter/Search Bar Skeleton if present, otherwise just spacing */}
        <div className="flex justify-end mb-4">
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-md border bg-white">
          {/* Table Header */}
          <div className="border-b h-12 px-4 flex items-center justify-between">
            <Skeleton className="h-4 w-24" /> {/* Date */}
            <Skeleton className="h-4 w-48" /> {/* Course */}
            <Skeleton className="h-4 w-16" /> {/* Score */}
            <Skeleton className="h-4 w-16" /> {/* Par */}
            <Skeleton className="h-4 w-16" /> {/* Actions */}
          </div>

          {/* Table Body - 5 Fake Rows */}
          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 px-4 flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center space-x-2 py-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-24" />
        </div>
      </main>
    </div>
  )
}
