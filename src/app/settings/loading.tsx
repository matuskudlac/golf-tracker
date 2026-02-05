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

      {/* Main Content */}
      <main className="pt-24 pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar Skeleton */}
          <aside className="w-48 shrink-0">
            <nav className="space-y-1">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))}
            </nav>
          </aside>

          {/* Divider */}
          <div className="w-px bg-slate-200 shrink-0" />

          {/* Content Skeleton */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            
            {/* Settings Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>

            {/* Another Settings Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-5 w-28 mb-1" />
                  <Skeleton className="h-4 w-44" />
                </div>
                <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
