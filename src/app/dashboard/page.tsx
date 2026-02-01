import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Get User
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // 2. Fetch User's Rounds
  console.log('Fetching rounds for user:', user.id)
  const { data: rounds, error } = await supabase
    .from('rounds')
    .select(`
      id,
      date_played,
      total_score,
      holes_played,
      greens_in_regulation,
      fairways_hit,
      fairways_opportunities,
      up_and_downs,
      up_and_downs_opportunities,
      total_putts,
      courses (name)
    `)
    .eq('user_id', user.id)
    .order('date_played', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching dashboard rounds:', error)
  }
  console.log('Fetched rounds:', rounds?.length, rounds)

  // 3. Calculate Stats
  const stats = {
    scoringAverage: 0,
    trend: 0, // Placeholder
    handicap: 0, // Placeholder
    handicapTrend: 0, // Placeholder
    fairwaysHit: 0,
    greensInReg: 0,
    puttsPerRound: 0,
    scrambling: 0
  }

  if (rounds && rounds.length > 0) {
    // Scoring Average (only consider complete rounds or normalize, for now just average total_score)
    const totalScore = rounds.reduce((sum, r) => sum + r.total_score, 0)
    stats.scoringAverage = Math.round((totalScore / rounds.length) * 10) / 10

    // Fairways Hit %
    const fairwaysHit = rounds.reduce((sum, r) => sum + (r.fairways_hit || 0), 0)
    const fairwaysOpp = rounds.reduce((sum, r) => sum + (r.fairways_opportunities || 0), 0)
    stats.fairwaysHit = fairwaysOpp > 0 ? Math.round((fairwaysHit / fairwaysOpp) * 100) : 0

    // GIR %
    const gir = rounds.reduce((sum, r) => sum + (r.greens_in_regulation || 0), 0)
    const holesPlayed = rounds.reduce((sum, r) => sum + r.holes_played, 0)
    stats.greensInReg = holesPlayed > 0 ? Math.round((gir / holesPlayed) * 100) : 0

    // Putts Per Round
    const totalPutts = rounds.reduce((sum, r) => sum + (r.total_putts || 0), 0)
    const roundsWithPutts = rounds.filter(r => r.total_putts !== null).length
    stats.puttsPerRound = roundsWithPutts > 0 ? Math.round((totalPutts / roundsWithPutts) * 10) / 10 : 0

    // Scrambling %
    const upDowns = rounds.reduce((sum, r) => sum + (r.up_and_downs || 0), 0)
    const upDownsOpp = rounds.reduce((sum, r) => sum + (r.up_and_downs_opportunities || 0), 0)
    stats.scrambling = upDownsOpp > 0 ? Math.round((upDowns / upDownsOpp) * 100) : 0
  }

  return <DashboardClient initialUser={user} initialRounds={rounds || []} initialStats={stats} />
}
