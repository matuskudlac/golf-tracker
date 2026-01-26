import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RoundsClient } from './rounds-client'

export const dynamic = 'force-dynamic'

export default async function RoundsPage() {
  const supabase = await createClient()

  // 1. Get User
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // 2. Get Rounds with course information joined
  const { data: roundsData, error } = await supabase
    .from('rounds')
    .select(`
      id,
      date_played,
      total_score,
      course_id,
      courses!inner (
        id,
        name,
        course_holes (
          par
        )
      )
    `)
    .eq('user_id', user.id)
    .order('date_played', { ascending: false })

  if (error) {
    console.error('Error fetching rounds:', error)
  }

  // Transform the data to include calculated fields
  const rounds = roundsData?.map((round: any) => {
    // Calculate total par from course holes
    const totalPar = round.courses?.course_holes?.reduce(
      (sum: number, hole: any) => sum + (hole.par || 0),
      0
    ) || 0

    // Calculate relative to par
    const toPar = round.total_score - totalPar

    return {
      id: round.id,
      date_played: round.date_played,
      course_name: round.courses?.name || 'Unknown Course',
      course_id: round.course_id,
      total_score: round.total_score,
      total_par: totalPar,
      to_par: toPar,
      holes_played: round.courses?.course_holes?.length || 0,
    }
  }) || []

  return (
    <RoundsClient 
      initialUser={user} 
      initialRounds={rounds} 
    />
  )
}