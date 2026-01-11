'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from '@/components/ui/resizable-navbar'
import { UserMenu } from '@/components/navigation/UserMenu'
import { HeroStatsCard } from '@/components/dashboard/HeroStatsCard'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { RecentRoundsList } from '@/components/dashboard/RecentRoundsList'

// Placeholder data - scoring average spark chart
const sparkChartData = [
  { value: 85, index: 1 },
  { value: 82, index: 2 },
  { value: 88, index: 3 },
  { value: 84, index: 4 },
  { value: 81, index: 5 },
  { value: 79, index: 6 },
  { value: 83, index: 7 },
  { value: 80, index: 8 },
  { value: 78, index: 9 },
  { value: 82, index: 10 },
]

// Placeholder data - performance chart
const performanceData = [
  { date: "Jan 1", score: 85, fairways: 64, gir: 56, putts: 32 },
  { date: "Jan 8", score: 82, fairways: 71, gir: 61, putts: 30 },
  { date: "Jan 15", score: 88, fairways: 57, gir: 50, putts: 34 },
  { date: "Jan 22", score: 84, fairways: 64, gir: 56, putts: 31 },
  { date: "Jan 29", score: 81, fairways: 71, gir: 67, putts: 29 },
  { date: "Feb 5", score: 79, fairways: 79, gir: 72, putts: 28 },
  { date: "Feb 12", score: 83, fairways: 64, gir: 61, putts: 30 },
  { date: "Feb 19", score: 80, fairways: 71, gir: 67, putts: 29 },
  { date: "Feb 26", score: 78, fairways: 79, gir: 72, putts: 27 },
  { date: "Mar 5", score: 82, fairways: 71, gir: 67, putts: 30 },
]

// Placeholder data - recent rounds
const recentRounds = [
  { id: '1', date: 'Mar 5, 2026', courseName: 'Pebble Beach Golf Links', score: 82, par: 72 },
  { id: '2', date: 'Feb 26, 2026', courseName: 'Augusta National', score: 78, par: 72 },
  { id: '3', date: 'Feb 19, 2026', courseName: 'St Andrews Old Course', score: 80, par: 72 },
  { id: '4', date: 'Feb 12, 2026', courseName: 'Pinehurst No. 2', score: 83, par: 72 },
  { id: '5', date: 'Feb 5, 2026', courseName: 'Oakmont Country Club', score: 79, par: 72 },
]

export default function DashboardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-700 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Rounds", link: "/rounds" },
    { name: "Statistics", link: "/statistics" },
    { name: "Courses", link: "/courses" },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar */}
      <Navbar>
        {/* Desktop Navbar */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} currentPath={pathname} />
          <UserMenu user={user} />
        </NavBody>

        {/* Mobile Navbar */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="text-neutral-600 dark:text-neutral-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-slate-300"
            >
              Sign out
            </Button>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Hero Stats */}
          <div className="lg:col-span-1">
            <HeroStatsCard
              scoringAverage={82}
              trend={-3}
              handicap={12.4}
              handicapTrend={-0.8}
              fairwaysHit={71}
              greensInReg={67}
              puttsPerRound={29.5}
              scrambling={65}
            />
          </div>

          {/* Right Column - Chart and Rounds */}
          <div className="lg:col-span-2 space-y-6">
            <PerformanceChart data={performanceData} />
            <RecentRoundsList
              rounds={recentRounds}
              onLogNewRound={() => console.log('Log new round clicked')}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
