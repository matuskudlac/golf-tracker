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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Hero Stats Skeleton */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border bg-white p-6 h-[400px]">
                <div className="flex justify-between items-start mb-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-16 w-32 mb-4" />
                <Skeleton className="h-8 w-full mb-8" />
                <div className="grid grid-cols-2 gap-4">
                     <Skeleton className="h-20 w-full" />
                     <Skeleton className="h-20 w-full" />
                     <Skeleton className="h-20 w-full" />
                     <Skeleton className="h-20 w-full" />
                </div>
            </div>
          </div>

          {/* Right Column - Chart and Rounds Skeleton */}
          <div className="lg:col-span-2 space-y-6">
             {/* Chart Skeleton with Welcome Header */}
            <div className="rounded-xl border bg-white p-6">
                {/* Welcome Header Skeleton */}
                <div className="flex justify-between items-center pb-6 mb-6 border-b border-border">
                    <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                
                {/* Chart Controls Skeleton */}
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>
                
                {/* Chart Bars Skeleton */}
                <div className="flex items-end justify-between h-[320px] gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <Skeleton key={i} className={`w-full h-[${Math.floor(Math.random() * 80 + 20)}%]`} />
                    ))}
                </div>
            </div>

            {/* Recent Rounds Skeleton */}
            <div className="rounded-xl border bg-white p-6">
                 <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-9 w-32" />
                 </div>
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                             <div className="flex gap-4 items-center">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div>
                                    <Skeleton className="h-4 w-32 mb-1" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                             </div>
                             <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                 </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
