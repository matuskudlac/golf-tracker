'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth'
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
import { AddRoundDialog } from '@/components/rounds/AddRoundDialog'



interface DashboardClientProps {
  initialUser: any
  initialRounds: any[]
  initialStats: {
    scoringAverage: number
    trend: number
    handicap: number
    handicapTrend: number
    fairwaysHit: number
    greensInReg: number
    puttsPerRound: number
    scrambling: number
  }
}

export function DashboardClient({ initialUser, initialRounds, initialStats }: DashboardClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [addRoundDialogOpen, setAddRoundDialogOpen] = useState(false)

  // Extract user name from email (before @) or use full email
  const userName = initialUser?.email?.split('@')[0] || 'there'
  
  // Calculate rounds this year
  const currentYear = new Date().getFullYear()
  const roundsThisYear = initialRounds.filter(r => new Date(r.date_played).getFullYear() === currentYear).length
  
  // Prepare Performance Chart Data (reverse to show oldest to newest)
  const performanceData = [...initialRounds].reverse().map(round => {
    // Calculate percentages for chart if opportunities exist, otherwise use null or 0
    // Note: This matches the structure expected by PerformanceChart, but we might need to adjust logic
    // if PerformanceChart expects raw values or percentages. Assuming percentages for consistency.
    
    // For chart, we might want purely score, or we can calculate derived stats
    // The previous placeholder used: { date, score, fairways, gir, putts }
    // Fairways/GIR in placeholder seemed to be percentages (e.g. 64, 56)
    
    const fairwaysPct = round.fairways_opportunities > 0 
      ? Math.round((round.fairways_hit / round.fairways_opportunities) * 100) 
      : 0
      
    const girPct = round.holes_played > 0
      ? Math.round((round.greens_in_regulation / round.holes_played) * 100)
      : 0
      
    return {
      date: new Date(round.date_played).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: round.total_score,
      fairways: fairwaysPct,
      gir: girPct,
      putts: round.total_putts || 0
    }
  })

  // Prepare Recent Rounds List Data
  const recentRoundsList = initialRounds.slice(0, 5).map(round => ({
    id: round.id,
    date: new Date(round.date_played).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    courseName: round.courses?.name || 'Unknown Course',
    score: round.total_score,
    par: round.courses?.par || 72 // Default to 72 if not available
  }))

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
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
          <UserMenu user={initialUser} />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Hero Stats */}
          <div className="lg:col-span-1">
            <HeroStatsCard
              scoringAverage={initialStats.scoringAverage}
              trend={initialStats.trend}
              handicap={initialStats.handicap}
              handicapTrend={initialStats.handicapTrend}
              fairwaysHit={initialStats.fairwaysHit}
              greensInReg={initialStats.greensInReg}
              puttsPerRound={initialStats.puttsPerRound}
              scrambling={initialStats.scrambling}
            />
          </div>

          {/* Right Column - Chart and Rounds */}
          <div className="lg:col-span-2 space-y-4">
            <PerformanceChart 
              data={performanceData}
              userName={userName}
              roundsThisYear={roundsThisYear}
              onLogRound={() => setAddRoundDialogOpen(true)}
            />
            <RecentRoundsList
              rounds={recentRoundsList}
              onLogNewRound={() => console.log('Log new round clicked')}
            />
          </div>
        </div>
      </main>

      {/* Add Round Dialog */}
      <AddRoundDialog 
        open={addRoundDialogOpen}
        onOpenChange={setAddRoundDialogOpen}
        onSuccess={() => {
          setAddRoundDialogOpen(false)
          router.refresh()
        }}
      />
    </div>
  )
}
