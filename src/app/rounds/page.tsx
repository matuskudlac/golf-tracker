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

  // 2. Get Rounds
  const { data: rounds, error: roundsError } = await supabase
    .from('rounds')
    .select('*') // You might want to select specific fields or related tables if needed (e.g., course details)
    .eq('user_id', user.id)
    .order('date_played', { ascending: false })

  if (roundsError) {
    console.error('Error fetching rounds:', roundsError)
  }

  return (
    <RoundsClient 
      initialUser={user} 
      initialRounds={rounds || []} 
    />
  )
}